import { NextResponse } from "next/server";
import {
  ensureDatabaseReady,
  getNextDepartment,
  getDepartmentById,
  insertWorkflowAction,
} from "@/app/lib/permit-workflow";

export const runtime = "edge";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const database = await ensureDatabaseReady();
    const targetId = params.id;
    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;

    const action = String(body.action || "").toLowerCase().trim();
    const remarks = String(body.remarks || "").trim();
    const actorUserId = body.actor_user_id ? String(body.actor_user_id) : null;

    if (!action) {
      return NextResponse.json(
        { ok: false, error: "Action is required (verify, send_back, approve, decline, hold, resubmit)." },
        { status: 400 }
      );
    }

    // 1. Fetch current application state by either UUID or application_number
    const application = await database
      .prepare(`SELECT * FROM applications WHERE id = ? OR application_number = ? LIMIT 1`)
      .bind(targetId, targetId)
      .first<any>();

    if (!application) {
      return NextResponse.json(
        { ok: false, error: "Application not found." },
        { status: 404 }
      );
    }

    const appId = application.id;
    const currentDeptId = application.current_department_id;
    const currentDept = currentDeptId ? await getDepartmentById(currentDeptId) : null;
    const now = new Date().toISOString();

    // 2. State Machine Transition Logic
    switch (action) {
      // CHECKER ACTIONS
      case "verify": {
        await database
          .prepare(
            `UPDATE applications 
             SET status = 'awaiting_approval', 
                 current_stage = 'approver', 
                 last_updated_date = ?, 
                 updated_at = ? 
             WHERE id = ?`
          )
          .bind(now, now, appId)
          .run();

        await insertWorkflowAction(database, {
          applicationId: appId,
          actorUserId,
          departmentId: currentDeptId,
          actionType: "verified",
          actionLabel: `Scrutiny Verified by ${currentDept?.name || "Checker"}`,
          remarks: remarks || "Documents and technical drawings scrutinized and verified for sign-off.",
        });

        return NextResponse.json({
          ok: true,
          status: "awaiting_approval",
          current_stage: "approver",
          message: "Application verified and advanced to Approver queue.",
        });
      }

      case "send_back": {
        await database
          .prepare(
            `UPDATE applications 
             SET status = 'needs_correction', 
                 current_stage = 'applicant', 
                 last_updated_date = ?, 
                 updated_at = ?,
                 remarks = ?
             WHERE id = ?`
          )
          .bind(now, now, remarks || "Corrections required on submitted dossier.", appId)
          .run();

        await insertWorkflowAction(database, {
          applicationId: appId,
          actorUserId,
          departmentId: currentDeptId,
          actionType: "correction_requested",
          actionLabel: `Returned for Correction by ${currentDept?.name || "Checker"}`,
          remarks: remarks || "Application returned to applicant for corrections or missing documents.",
        });

        return NextResponse.json({
          ok: true,
          status: "needs_correction",
          current_stage: "applicant",
          message: "Application returned to applicant for corrections.",
        });
      }

      // APPROVER ACTIONS
      case "approve": {
        const nextDept = await getNextDepartment(currentDeptId);

        if (nextDept) {
          // Progress to Next Department Checkpoint
          await database
            .prepare(
              `UPDATE applications 
               SET status = 'scrutiny', 
                   current_stage = 'checker', 
                   current_department_id = ?,
                   last_updated_date = ?, 
                   updated_at = ? 
               WHERE id = ?`
            )
            .bind(nextDept.id, now, now, appId)
            .run();

          await insertWorkflowAction(database, {
            applicationId: appId,
            actorUserId,
            departmentId: currentDeptId,
            actionType: "department_approved",
            actionLabel: `Clearance Granted by ${currentDept?.name || "Department"}`,
            remarks: remarks || `NOC issued. Forwarded to ${nextDept.name} for clearance.`,
          });

          return NextResponse.json({
            ok: true,
            status: "scrutiny",
            current_stage: "checker",
            next_department: nextDept.name,
            is_final_approval: false,
            message: `Department clearance granted. Application advanced to ${nextDept.name}.`,
          });
        } else {
          // Final Approval Across All Department Pipelines!
          await database
            .prepare(
              `UPDATE applications 
               SET status = 'approved', 
                   current_stage = 'completed', 
                   last_updated_date = ?, 
                   updated_at = ? 
               WHERE id = ?`
            )
            .bind(now, now, appId)
            .run();

          await insertWorkflowAction(database, {
            applicationId: appId,
            actorUserId,
            departmentId: currentDeptId,
            actionType: "final_approved",
            actionLabel: "Unified Building Permit Sanction Issued",
            remarks: remarks || "All multi-department clearances fulfilled. Official permit issued.",
          });

          return NextResponse.json({
            ok: true,
            status: "approved",
            current_stage: "completed",
            is_final_approval: true,
            message: "Final approval granted! Unified Building Sanction Order issued.",
          });
        }
      }

      case "decline": {
        await database
          .prepare(
            `UPDATE applications 
             SET status = 'needs_correction', 
                 current_stage = 'applicant', 
                 last_updated_date = ?, 
                 updated_at = ?,
                 remarks = ?
             WHERE id = ?`
          )
          .bind(now, now, remarks || "Declined by department approver.", appId)
          .run();

        await insertWorkflowAction(database, {
          applicationId: appId,
          actorUserId,
          departmentId: currentDeptId,
          actionType: "declined",
          actionLabel: `Clearance Declined by ${currentDept?.name || "Approver"}`,
          remarks: remarks || "Application declined by authority head. Re-submission required.",
        });

        return NextResponse.json({
          ok: true,
          status: "needs_correction",
          current_stage: "applicant",
          message: "Application declined and returned to applicant.",
        });
      }

      case "hold": {
        await insertWorkflowAction(database, {
          applicationId: appId,
          actorUserId,
          departmentId: currentDeptId,
          actionType: "held",
          actionLabel: `Administrative Hold by ${currentDept?.name || "Approver"}`,
          remarks: remarks || "Application placed on administrative hold pending clarification.",
        });

        return NextResponse.json({
          ok: true,
          message: "Application placed on departmental hold. Recorded in audit trail.",
        });
      }

      // APPLICANT ACTIONS
      case "resubmit": {
        await database
          .prepare(
            `UPDATE applications 
             SET status = 'scrutiny', 
                 current_stage = 'checker', 
                 last_updated_date = ?, 
                 updated_at = ? 
             WHERE id = ?`
          )
          .bind(now, now, appId)
          .run();

        await insertWorkflowAction(database, {
          applicationId: appId,
          actorUserId,
          departmentId: currentDeptId,
          actionType: "resubmitted",
          actionLabel: "Corrections Re-submitted by Applicant",
          remarks: remarks || "Corrected documents and clarifications uploaded.",
        });

        return NextResponse.json({
          ok: true,
          status: "scrutiny",
          current_stage: "checker",
          message: "Corrections submitted. Application returned to Checker scrutiny queue.",
        });
      }

      default:
        return NextResponse.json(
          { ok: false, error: `Unsupported action: '${action}'.` },
          { status: 400 }
        );
    }
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, error: error.message || "Failed to process workflow action." },
      { status: 500 }
    );
  }
}
