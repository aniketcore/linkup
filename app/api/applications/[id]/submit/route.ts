import {
  ensureDatabaseReady,
  getFirstDepartment,
  insertWorkflowAction,
} from "../../../../lib/permit-workflow";

const requiredApplicantFields = [
  "applicant_name",
  "applicant_type",
  "mobile",
  "email",
  "address",
  "city",
  "state",
  "pin_code",
  "id_proof_number",
];

const requiredFirmFields = [
  "firm_name",
  "firm_address",
  "contact_person",
  "contact_number",
  "email",
];

const requiredBuildingFields = [
  "project_name",
  "building_type",
  "plot_number",
  "address",
  "city",
  "ward",
  "zone",
  "plot_area",
  "built_up_area",
  "floors",
  "units",
  "estimated_cost",
];

const requiredDocuments = [
  "site_plan",
  "building_plan",
  "ownership_proof",
  "id_proof",
];

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const database = await ensureDatabaseReady();
    const applicationId = params.id;
    const payload = (await request.json().catch(() => ({}))) as Record<string, unknown>;

    const application = await database
      .prepare(`SELECT * FROM applications WHERE id = ?`)
      .bind(applicationId)
      .first<Record<string, unknown>>();

    if (!application) {
      return Response.json(
        { ok: false, error: "Application not found." },
        { status: 404 }
      );
    }

    const applicantProfile = await database
      .prepare(`SELECT * FROM applicant_profiles WHERE application_id = ?`)
      .bind(applicationId)
      .first<Record<string, unknown>>();

    const firmDetails = await database
      .prepare(`SELECT * FROM firm_details WHERE application_id = ?`)
      .bind(applicationId)
      .first<Record<string, unknown>>();

    const buildingDetails = await database
      .prepare(`SELECT * FROM building_details WHERE application_id = ?`)
      .bind(applicationId)
      .first<Record<string, unknown>>();

    const missingFields: string[] = [];

    for (const field of requiredApplicantFields) {
      if (!applicantProfile || !applicantProfile[field]) {
        missingFields.push(`applicant.${field}`);
      }
    }

    for (const field of requiredFirmFields) {
      if (!firmDetails || !firmDetails[field]) {
        missingFields.push(`firm.${field}`);
      }
    }

    for (const field of requiredBuildingFields) {
      if (!buildingDetails || !buildingDetails[field]) {
        missingFields.push(`building.${field}`);
      }
    }

    const uploadedDocuments = await database
      .prepare(`SELECT document_type FROM documents WHERE application_id = ?`)
      .bind(applicationId)
      .all<{ document_type: string }>();

    const uploadedDocSet = new Set(
      uploadedDocuments.results.map((row) => String(row.document_type).trim())
    );

    const missingDocuments = requiredDocuments.filter(
      (documentType) => !uploadedDocSet.has(documentType)
    );

    if (missingFields.length > 0 || missingDocuments.length > 0) {
      return Response.json(
        {
          ok: false,
          error: "Application cannot be submitted until all mandatory fields and documents are completed.",
          missing_fields: missingFields,
          missing_documents: missingDocuments,
        },
        { status: 400 }
      );
    }

    const firstDepartment = await getFirstDepartment();
    const now = new Date().toISOString();

    await database
      .prepare(
        `
          UPDATE applications
          SET status = 'Submitted',
              current_department_id = ?,
              current_stage = 'checker',
              submission_date = COALESCE(submission_date, ?),
              last_updated_date = ?,
              updated_at = ?,
              remarks = ?
          WHERE id = ?
        `
      )
      .bind(firstDepartment?.id ?? null, now, now, now, payload.remarks ?? "Application submitted for review.", applicationId)
      .run();

    await insertWorkflowAction(database, {
      applicationId,
      actorUserId: payload.actor_user_id ? String(payload.actor_user_id) : null,
      departmentId: firstDepartment?.id ?? null,
      actionType: "submitted",
      actionLabel: "Application submitted",
      remarks: "Application submitted to first department checkpoint.",
    });

    return Response.json({
      ok: true,
      application_id: applicationId,
      status: "Submitted",
      current_department_id: firstDepartment?.id ?? null,
      current_stage: "checker",
    });
  } catch (error) {
    return Response.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
