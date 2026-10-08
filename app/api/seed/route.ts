import { NextResponse } from "next/server";
import { ensureDatabaseReady } from "@/app/lib/permit-workflow";

export const runtime = "edge";

export async function GET() {
  try {
    const database = await ensureDatabaseReady();

    // 1. Seed fake users
    await database.prepare(`
      INSERT OR IGNORE INTO users (id, name, email, role, department_id) VALUES
      ('user_app_1', 'Apex Infrastructure', 'apex@example.com', 'applicant', NULL),
      ('user_app_2', 'Metro Infra', 'metro@example.com', 'applicant', NULL);
    `).run();

    // 2. Seed fake applications across different statuses
    await database.prepare(`
      INSERT OR REPLACE INTO applications (id, application_number, applicant_user_id, status, current_department_id) VALUES
      ('app_1', 'BP-2026-000010', 'user_app_1', 'draft', 1),
      ('app_2', 'BP-2026-000011', 'user_app_2', 'needs_correction', 2),
      ('app_3', 'BP-2026-000012', 'user_app_1', 'scrutiny', 1),
      ('app_4', 'BP-2026-000013', 'user_app_2', 'awaiting_approval', 3),
      ('app_5', 'BP-2026-000014', 'user_app_1', 'approved', 3);
    `).run();

    // 3. Seed the building details (so we get the project names on the Kanban cards)
    await database.prepare(`
      INSERT OR REPLACE INTO building_details (id, application_id, project_name) VALUES
      ('bd_1', 'app_1', 'Skyline Green Heights'),
      ('bd_2', 'app_2', 'City Center Mall'),
      ('bd_3', 'app_3', 'Lotus Residency Phase II'),
      ('bd_4', 'app_4', 'Riverside Infra'),
      ('bd_5', 'app_5', 'Metro Point Retail Hub');
    `).run();

    return NextResponse.json({ success: true, message: "Database seeded successfully!" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
