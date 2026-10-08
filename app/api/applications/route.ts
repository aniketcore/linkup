import { NextResponse } from "next/server";
import { ensureDatabaseReady } from "@/app/lib/permit-workflow";

export const runtime = "edge";

export async function GET(request: Request) {
  try {
    const database = await ensureDatabaseReady();

    const query = `
      SELECT 
        a.id as uuid,
        a.application_number as id,
        a.status,
        COALESCE(d.name, 'Pending Setup') as department,
        (
          SELECT GROUP_CONCAT(name, ',')
          FROM (
            SELECT name 
            FROM departments 
            WHERE sort_order < d.sort_order OR (sort_order = d.sort_order AND LOWER(a.status) = 'approved')
            ORDER BY sort_order ASC
          )
        ) as approved_by_list,
        COALESCE(ap.applicant_name, u.name, 'Unknown Applicant') as applicant,
        COALESCE(b.project_name, 'Untitled Project') as project,
        COALESCE(a.submission_date, a.created_at) as date,
        CASE 
          WHEN LOWER(a.status) = 'approved' THEN 100
          WHEN LOWER(a.status) = 'awaiting_approval' THEN 80
          WHEN LOWER(a.status) IN ('scrutiny', 'submitted') THEN 40
          ELSE 10
        END as progress
      FROM applications a
      LEFT JOIN users u ON a.applicant_user_id = u.id
      LEFT JOIN departments d ON a.current_department_id = d.id
      LEFT JOIN building_details b ON a.id = b.application_id
      LEFT JOIN applicant_profiles ap ON a.id = ap.application_id
      ORDER BY a.created_at DESC
    `;

    const result = await database.prepare(query).all();

    const formattedApps = result.results.map((row: any) => ({
      ...row,
      approved_by: row.approved_by_list ? row.approved_by_list.split(',') : []
    }));

    return NextResponse.json({ success: true, applications: formattedApps });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
