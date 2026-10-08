"use client";

import React, { useState } from "react";
import { ApplicationType } from "../types";

export type WorkflowActionType = "verify" | "send_back" | "approve" | "decline" | "hold" | "resubmit";

interface WorkflowActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: ApplicationType | null;
  actionType: WorkflowActionType | null;
  departmentName?: string | null;
  actorUserId?: string | null;
  onActionComplete: () => void;
}

export default function WorkflowActionModal({
  isOpen,
  onClose,
  application,
  actionType,
  departmentName,
  actorUserId,
  onActionComplete,
}: WorkflowActionModalProps) {
  const [remarks, setRemarks] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen || !application || !actionType) return null;

  const getActionConfig = () => {
    switch (actionType) {
      case "verify":
        return {
          title: "Verify Scrutiny & Forward to Approver",
          subtitle: `Checker clearance for ${departmentName || application.department}`,
          icon: "🕵️‍♂️",
          confirmText: "Confirm Verification",
          confirmClass: "bg-emerald-700 hover:bg-emerald-800 text-white",
          defaultRemarks: "Site specifications and drawings verified compliant with municipal standards.",
          isDestructive: false,
        };
      case "send_back":
        return {
          title: "Return Application for Corrections",
          subtitle: "Return dossier to applicant for missing documents or revisions",
          icon: "⚠️",
          confirmText: "Send Back to Applicant",
          confirmClass: "bg-[#ea580c] hover:bg-[#c2410c] text-white",
          defaultRemarks: "Missing boundary clearance certificate and setback discrepancy in architectural drawing.",
          isDestructive: true,
          requireRemarks: true,
        };
      case "approve":
        return {
          title: "Grant Departmental Approval / Sign-Off",
          subtitle: `Issue clearance from ${departmentName || application.department}`,
          icon: "✍️",
          confirmText: "Grant & Advance Clearance",
          confirmClass: "bg-emerald-700 hover:bg-emerald-800 text-white",
          defaultRemarks: "Departmental NOC approved and endorsed by competent authority.",
          isDestructive: false,
        };
      case "decline":
        return {
          title: "Decline Application",
          subtitle: "Reject statutory permit application with formal grounds",
          icon: "🚫",
          confirmText: "Confirm Rejection",
          confirmClass: "bg-red-700 hover:bg-red-800 text-white",
          defaultRemarks: "Proposal violates municipal master zoning plan restrictions.",
          isDestructive: true,
          requireRemarks: true,
        };
      case "hold":
        return {
          title: "Place On Departmental Hold",
          subtitle: "Temporarily pause statutory timeline pending clarification",
          icon: "⏸️",
          confirmText: "Place on Hold",
          confirmClass: "bg-slate-700 hover:bg-slate-800 text-white",
          defaultRemarks: "Inter-agency site survey scheduled. Awaiting joint inspection report.",
          isDestructive: false,
        };
      case "resubmit":
        return {
          title: "Upload Corrections & Re-Submit",
          subtitle: "Submit revised documents back to Checker scrutiny queue",
          icon: "📤",
          confirmText: "Submit for Re-Scrutiny",
          confirmClass: "bg-[#003366] hover:bg-[#002244] text-white",
          defaultRemarks: "Updated setback plan and registered land clearance attached as requested.",
          isDestructive: false,
        };
    }
  };

  const config = getActionConfig();

  const handleConfirm = async () => {
    if (config.requireRemarks && !remarks.trim()) {
      setError("Please provide specific remarks/reasons before proceeding.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const res = await fetch(`/api/applications/${application.id}/action`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: actionType,
          remarks: remarks.trim() || config.defaultRemarks,
          actor_user_id: actorUserId || "staff-user",
        }),
      });

      const data: any = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Action failed.");
      }

      onActionComplete();
      onClose();
    } catch (err: any) {
      console.error("Workflow action error:", err);
      setError(err.message || "Failed to execute workflow action.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-2xl border border-slate-300 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="bg-[#003366] text-white px-5 py-3.5 flex items-center justify-between border-b-2 border-[#ea580c]">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">{config.icon}</span>
            <div>
              <h3 className="text-sm font-black uppercase tracking-tight">{config.title}</h3>
              <p className="text-[10px] text-slate-200">{config.subtitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={submitting}
            className="text-white/80 hover:text-white p-1 rounded hover:bg-white/10 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          <div className="bg-slate-50 border border-slate-300 rounded p-3 text-xs space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Application Ref</span>
              <span className="font-mono font-bold text-[#003366]">{application.id}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Project Scheme</span>
              <span className="font-bold text-slate-800">{application.project}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Department Authority</span>
              <span className="font-bold text-[#ea580c]">{application.department}</span>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
              Official Recorded Remarks {config.requireRemarks && <span className="text-red-500">*</span>}
            </label>
            <textarea
              rows={3}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder={config.defaultRemarks}
              className="w-full rounded border border-slate-300 px-3 py-2 text-xs font-medium focus:border-[#003366] focus:outline-none"
            />
            <p className="text-[10px] text-slate-400 mt-1">
              {config.requireRemarks
                ? "Mandatory: Enter the specific statutory reasons or required documents for the applicant."
                : "Optional: Leave empty to record standard departmental endorsement."}
            </p>
          </div>

          {error && (
            <div className="p-2.5 bg-red-50 border border-red-300 text-red-800 text-xs font-semibold rounded">
              ⚠️ {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-100 border-t border-slate-300 px-5 py-3 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="rounded border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 px-4 py-1.5 text-xs font-bold uppercase tracking-wide transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={submitting}
            className={`rounded px-5 py-1.5 text-xs font-bold uppercase tracking-wide transition-colors shadow-sm ${config.confirmClass}`}
          >
            {submitting ? "Processing..." : config.confirmText}
          </button>
        </div>

      </div>
    </div>
  );
}
