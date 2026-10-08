import { ensureDatabaseReady, generateApplicationNumber, insertWorkflowAction } from "../../../lib/permit-workflow";

export async function POST(request: Request) {
  try {
    const database = await ensureDatabaseReady();
    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    const applicantUserId = String(body.applicant_user_id ?? body.user_id ?? "applicant-demo").trim();
    const now = new Date().toISOString();
    const applicationId = crypto.randomUUID();
    const applicationNumber = await generateApplicationNumber(database);

    await database
      .prepare(
        `
          INSERT INTO applications (
            id, application_number, applicant_user_id, status, current_department_id,
            current_stage, submission_date, last_updated_date, created_at, updated_at, remarks
          )
          VALUES (?, ?, ?, 'Draft', NULL, 'applicant', NULL, ?, ?, ?, '')
        `
      )
      .bind(
        applicationId,
        applicationNumber,
        applicantUserId,
        now,
        now,
        now
      )
      .run();

    const profileId = crypto.randomUUID();
    const firmId = crypto.randomUUID();
    const buildingId = crypto.randomUUID();

    await database
      .prepare(
        `
          INSERT INTO applicant_profiles (
            id, application_id, applicant_name, applicant_type, mobile, email,
            address, city, state, pin_code, id_proof_number, created_at, updated_at
          ) VALUES (?, ?, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, ?, ?)
        `
      )
      .bind(profileId, applicationId, now, now)
      .run();

    await database
      .prepare(
        `
          INSERT INTO firm_details (
            id, application_id, firm_name, registration_number, firm_address,
            contact_person, contact_number, email, gst_number, created_at, updated_at
          ) VALUES (?, ?, NULL, NULL, NULL, NULL, NULL, NULL, NULL, ?, ?)
        `
      )
      .bind(firmId, applicationId, now, now)
      .run();

    await database
      .prepare(
        `
          INSERT INTO building_details (
            id, application_id, project_name, building_type, plot_number, address,
            city, ward, zone, plot_area, built_up_area, floors, units, estimated_cost,
            created_at, updated_at
          ) VALUES (?, ?, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, ?, ?)
        `
      )
      .bind(buildingId, applicationId, now, now)
      .run();

    await insertWorkflowAction(database, {
      applicationId,
      actorUserId: applicantUserId,
      actionType: "draft_created",
      actionLabel: "Draft created",
      remarks: "Application draft created.",
    });

    return Response.json({
      ok: true,
      application: {
        id: applicationId,
        application_number: applicationNumber,
        status: "Draft",
      },
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
