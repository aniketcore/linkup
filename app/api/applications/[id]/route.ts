import { NextResponse } from "next/server";
import { ensureDatabaseReady } from "@/app/lib/permit-workflow";

export const runtime = "edge";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const database = await ensureDatabaseReady();
    const targetId = params.id;

    // 1. Fetch base application record by either UUID or application_number
    const appQuery = `
      SELECT 
        a.*,
        COALESCE(d.name, 'Town Planning Department') as current_department_name,
        d.sort_order as current_department_order
      FROM applications a
      LEFT JOIN departments d ON a.current_department_id = d.id
      WHERE a.id = ? OR a.application_number = ?
      LIMIT 1
    `;

    const app = await database
      .prepare(appQuery)
      .bind(targetId, targetId)
      .first<any>();

    if (!app) {
      return NextResponse.json(
        { ok: false, error: "Application record not found." },
        { status: 404 }
      );
    }

    const appId = app.id;

    // 2. Fetch associated sub-entities
    const applicant = await database
      .prepare(`SELECT * FROM applicant_profiles WHERE application_id = ?`)
      .bind(appId)
      .first<any>();

    const firm = await database
      .prepare(`SELECT * FROM firm_details WHERE application_id = ?`)
      .bind(appId)
      .first<any>();

    const building = await database
      .prepare(`SELECT * FROM building_details WHERE application_id = ?`)
      .bind(appId)
      .first<any>();

    const documentsResult = await database
      .prepare(`SELECT id, document_type, file_name, file_url, status, created_at FROM documents WHERE application_id = ? ORDER BY created_at ASC`)
      .bind(appId)
      .all<any>();

    const workflowResult = await database
      .prepare(`
        SELECT w.*, d.name as department_name 
        FROM workflow_actions w
        LEFT JOIN departments d ON w.department_id = d.id
        WHERE w.application_id = ?
        ORDER BY w.created_at ASC
      `)
      .bind(appId)
      .all<any>();

    const allDeptsResult = await database
      .prepare(`SELECT * FROM departments ORDER BY sort_order ASC`)
      .all<any>();

    // Compute Department Clearance Status for Public Record
    const departmentsStatus = allDeptsResult.results.map((dept: any) => {
      let status = "pending";
      const appStatusLower = app.status?.toLowerCase();
      if (appStatusLower === "approved") {
        status = "approved";
      } else if (app.current_department_order) {
        if (dept.sort_order < app.current_department_order) {
          status = "approved";
        } else if (dept.sort_order === app.current_department_order) {
          status = appStatusLower === "awaiting_approval" ? "awaiting_approval" : "in_scrutiny";
        } else {
          status = "pending";
        }
      }
      return {
        id: dept.id,
        name: dept.name,
        slug: dept.slug,
        sort_order: dept.sort_order,
        status,
      };
    });

    return NextResponse.json({
      ok: true,
      application: {
        id: app.application_number,
        internal_id: app.id,
        status: app.status,
        submission_date: app.submission_date || app.created_at,
        created_at: app.created_at,
        last_updated_date: app.last_updated_date,
        current_department_name: app.current_department_name,
        remarks: app.remarks,
        applicant: {
          name: applicant?.applicant_name || "Official Applicant",
          type: applicant?.applicant_type || "Individual Owner",
          city: applicant?.city || "Municipal Region",
          state: applicant?.state || "State",
        },
        firm: {
          name: firm?.firm_name || "Apex Infrastructures",
          registration_number: firm?.registration_number || "REG-VERIFIED",
          contact_person: firm?.contact_person || "Authorized Representative",
        },
        building: {
          project_name: building?.project_name || "Proposed Construction",
          building_type: building?.building_type || "Commercial / Residential",
          plot_number: building?.plot_number || "Plot Site",
          address: building?.address || "Designated Municipal Sector",
          city: building?.city || "City",
          ward: building?.ward || "Ward Jurisdiction",
          zone: building?.zone || "Permitted Zoning",
          plot_area: building?.plot_area || "Standard Plot Size",
          built_up_area: building?.built_up_area || "Approved FSI",
          floors: building?.floors || "Authorized Floors",
          units: building?.units || "Permitted Units",
          estimated_cost: building?.estimated_cost || "Assessed Capital Cost",
        },
        departments: departmentsStatus,
        documents: documentsResult.results,
        workflow: workflowResult.results,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, error: error.message || "Failed to fetch application public record." },
      { status: 500 }
    );
  }
}
