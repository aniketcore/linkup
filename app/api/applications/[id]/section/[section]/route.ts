import { ensureDatabaseReady } from "../../../../../lib/permit-workflow";

const sectionConfig = {
  applicant: {
    table: "applicant_profiles",
    columns: [
      "applicant_name",
      "applicant_type",
      "mobile",
      "email",
      "address",
      "city",
      "state",
      "pin_code",
      "id_proof_number",
    ],
  },
  firm: {
    table: "firm_details",
    columns: [
      "firm_name",
      "registration_number",
      "firm_address",
      "contact_person",
      "contact_number",
      "email",
      "gst_number",
    ],
  },
  building: {
    table: "building_details",
    columns: [
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
    ],
  },
} as const;

export async function PATCH(
  request: Request,
  { params }: { params: { id: string; section: string } }
) {
  try {
    const database = await ensureDatabaseReady();
    const applicationId = params.id;
    const section = params.section?.toLowerCase();

    if (!section || !(section in sectionConfig)) {
      return Response.json(
        { ok: false, error: "Unsupported application section." },
        { status: 400 }
      );
    }

    const application = await database
      .prepare(`SELECT id FROM applications WHERE id = ?`)
      .bind(applicationId)
      .first<{ id: string }>();

    if (!application) {
      return Response.json(
        { ok: false, error: "Application not found." },
        { status: 404 }
      );
    }

    const payload = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    const config = sectionConfig[section as keyof typeof sectionConfig];
    const recordId =
      (await database
        .prepare(`SELECT id FROM ${config.table} WHERE application_id = ?`)
        .bind(applicationId)
        .first<{ id: string }>())?.id ?? crypto.randomUUID();

    const values: Array<string | null> = [recordId, applicationId];
    const columnNames = ["id", "application_id"];
    const assignmentNames: string[] = [];

    for (const column of config.columns) {
      const value = payload[column];
      values.push(value == null ? null : String(value));
      columnNames.push(column);
      assignmentNames.push(`${column} = excluded.${column}`);
    }

    const placeholders = columnNames.map(() => "?").join(", ");
    const assignmentSql = assignmentNames.join(", ");

    await database
      .prepare(
        `
          INSERT INTO ${config.table} (${columnNames.join(", ")})
          VALUES (${placeholders})
          ON CONFLICT(application_id) DO UPDATE SET ${assignmentSql}
        `
      )
      .bind(...values)
      .run();

    await database
      .prepare(
        `UPDATE applications SET last_updated_date = ?, updated_at = ? WHERE id = ?`
      )
      .bind(new Date().toISOString(), new Date().toISOString(), applicationId)
      .run();

    return Response.json({
      ok: true,
      section,
      application_id: applicationId,
      updated: true,
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
