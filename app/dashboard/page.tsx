"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Mock database of all applications in the system
const allApplications = [
  { id: "BP-2026-000010", project: "Skyline Green Heights", status: "draft", department: "Town Planning", applicant: "Apex Infrastructure", date: "10 Oct 2026", progress: 10 },
  { id: "BP-2026-000011", project: "City Center Mall", status: "needs_correction", department: "Fire & Safety", applicant: "City Builders", date: "09 Oct 2026", progress: 25 },
  { id: "BP-2026-000012", project: "Lotus Residency Phase II", status: "scrutiny", department: "Town Planning", applicant: "Metroline Realty", date: "08 Oct 2026", progress: 40 },
  { id: "BP-2026-000013", project: "Riverside Infra", status: "awaiting_approval", department: "Environment", applicant: "Riverside Co", date: "07 Oct 2026", progress: 75 },
  { id: "BP-2026-000014", project: "Metro Point Retail Hub", status: "approved", department: "Town Planning", applicant: "Metro Infra", date: "05 Oct 2026", progress: 100 },
];

export default function UnifiedKanbanDashboard() {
  const router = useRouter();
  const [role, setRole] = useState<string>("applicant");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("linkup_session_token");
    if (!token) {
      router.replace("/");
      return;
    }

    try {
      const userStr = localStorage.getItem("linkup_user");
      if (userStr) {
        const user = JSON.parse(userStr);
        setRole(user.role || "applicant");
      }
    } catch (e) {
      // ignore
    }
    setLoading(false);
  }, [router]);

  if (loading) {
    return <div className="min-h-screen bg-[#f1f5f9] flex items-center justify-center font-bold text-[#003366]">Loading Workspace...</div>;
  }

  // Filter columns
  const draftsAndCorrections = allApplications.filter(a => a.status === "draft" || a.status === "needs_correction");
  const underScrutiny = allApplications.filter(a => a.status === "scrutiny");
  const awaitingApproval = allApplications.filter(a => a.status === "awaiting_approval");
  const approved = allApplications.filter(a => a.status === "approved");

  // Helper to render card buttons based on role
  const renderCardActions = (app: typeof allApplications[0]) => {
    if (role === "applicant") {
      if (app.status === "needs_correction") {
        return <button className="rounded bg-[#ea580c] hover:bg-[#c2410c] px-3 py-1.5 text-[10px] font-bold text-white uppercase tracking-wide w-full">Upload Missing Docs</button>;
      }
      return <button className="rounded border border-[#003366] text-[#003366] hover:bg-slate-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide w-full">View Details</button>;
    }

    if (role === "checker" && app.status === "scrutiny") {
      return (
        <div className="flex gap-2 w-full">
          <button className="flex-1 rounded bg-emerald-700 hover:bg-emerald-800 px-2 py-1.5 text-[10px] font-bold text-white uppercase tracking-wide">Verify</button>
          <button className="flex-1 rounded bg-[#ea580c] hover:bg-[#c2410c] px-2 py-1.5 text-[10px] font-bold text-white uppercase tracking-wide">Send Back</button>
        </div>
      );
    }

    if (role === "approver" && app.status === "awaiting_approval") {
      return (
        <div className="flex gap-1 w-full">
          <button className="flex-1 rounded bg-emerald-700 hover:bg-emerald-800 px-2 py-1.5 text-[9px] font-bold text-white uppercase tracking-wide">Approve</button>
          <button className="flex-1 rounded bg-red-700 hover:bg-red-800 px-2 py-1.5 text-[9px] font-bold text-white uppercase tracking-wide">Decline</button>
          <button className="flex-1 rounded bg-white border border-slate-400 hover:bg-slate-100 text-slate-700 px-2 py-1.5 text-[9px] font-bold uppercase tracking-wide">Hold</button>
        </div>
      );
    }

    if (role === "citizen" || role === "admin" || app.status === "approved") {
      return <button className="rounded bg-[#0b3b60] hover:bg-[#002244] text-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide w-full">View Public Record</button>;
    }

    return <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide italic">No actions available</span>;
  };

  const getRoleTitle = () => {
    switch (role) {
      case "checker": return "Department Scrutiny Mode";
      case "approver": return "Department Sign-off Mode";
      case "applicant": return "Applicant Submission Mode";
      case "citizen": return "Public Visibility Mode";
      case "admin": return "System Admin Override Mode";
      default: return "Workspace";
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] text-slate-900 font-sans flex flex-col">
      <div className="w-full px-4 py-6 sm:px-6 lg:px-8 border-b-2 border-[#003366] bg-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <img src="/emblem.svg" alt="State Emblem of India" className="h-12 w-auto" />
          <div className="flex flex-col">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#ea580c]">
              National Single-Window Portal
            </p>
            <h1 className="text-xl font-extrabold text-[#003366] uppercase tracking-tight">
              Unified Project Board
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 rounded bg-slate-100 px-3 py-1.5 border border-slate-300">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wide">
              {getRoleTitle()}
            </span>
          </div>
          {role === "applicant" && (
            <button className="inline-flex items-center justify-center rounded bg-[#ea580c] px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#c2410c] border border-[#c2410c] transition-colors uppercase tracking-wide">
              + New Application
            </button>
          )}
          <a href="/" className="inline-flex items-center justify-center rounded bg-[#003366] px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#002244] border border-[#002244] transition-colors uppercase tracking-wide">
            Sign Out
          </a>
        </div>
      </div>

      <div className="flex-1 w-full p-4 sm:p-6 lg:p-8 overflow-x-auto">
        <div className="flex items-start gap-6 min-w-max h-full pb-4">
          
          {/* COLUMN 1: DRAFTS / NEEDS CORRECTION */}
          <div className="w-[340px] flex flex-col max-h-[calc(100vh-140px)] rounded border border-slate-300 bg-slate-50 shadow-sm">
            <div className="bg-[#0b3b60] px-4 py-3 border-b-2 border-slate-400 flex justify-between items-center shrink-0">
              <h2 className="text-xs font-bold text-white uppercase tracking-wide">Drafts & Corrections</h2>
              <span className="bg-white/20 px-2 py-0.5 rounded text-[10px] font-bold text-white">{draftsAndCorrections.length}</span>
            </div>
            <div className="p-3 space-y-3 overflow-y-auto flex-1">
              {draftsAndCorrections.map(app => (
                <div key={app.id} className={`rounded border bg-white p-3 shadow-sm border-l-4 transition-colors ${app.status === 'needs_correction' ? 'border-amber-300 border-l-amber-500 hover:border-amber-500' : 'border-slate-300 border-l-slate-400 hover:border-slate-500'}`}>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-bold text-slate-500">{app.id}</span>
                    <span className={`rounded-sm px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide ${app.status === 'needs_correction' ? 'bg-amber-100 text-amber-800 border border-amber-200' : 'bg-slate-100 text-slate-600 border border-slate-200'}`}>
                      {app.status === 'needs_correction' ? '⚠️ Action Required' : 'Draft'}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-[#003366] uppercase mb-1">{app.project}</h3>
                  <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-3">{app.applicant}</p>
                  <div className="pt-3 border-t border-slate-100 mt-auto flex items-center justify-between">
                    {renderCardActions(app)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* COLUMN 2: UNDER SCRUTINY */}
          <div className="w-[340px] flex flex-col max-h-[calc(100vh-140px)] rounded border border-slate-300 bg-slate-50 shadow-sm">
            <div className="bg-[#0b3b60] px-4 py-3 border-b-2 border-blue-400 flex justify-between items-center shrink-0">
              <h2 className="text-xs font-bold text-white uppercase tracking-wide">Under Scrutiny (Checker)</h2>
              <span className="bg-white/20 px-2 py-0.5 rounded text-[10px] font-bold text-white">{underScrutiny.length}</span>
            </div>
            <div className="p-3 space-y-3 overflow-y-auto flex-1">
              {underScrutiny.map(app => (
                <div key={app.id} className="rounded border border-slate-300 bg-white p-3 shadow-sm border-l-4 border-l-blue-500 hover:border-blue-500 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-bold text-slate-500">{app.id}</span>
                    <span className="rounded-sm bg-[#003366]/10 border border-[#003366]/20 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-[#0b3b60]">{app.department}</span>
                  </div>
                  <h3 className="text-sm font-bold text-[#003366] uppercase mb-1">{app.project}</h3>
                  <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-3">{app.applicant}</p>
                  
                  <div className="mb-3 h-1.5 rounded bg-slate-200 overflow-hidden">
                    <div className="h-1.5 bg-blue-500" style={{ width: `${app.progress}%` }} />
                  </div>

                  <div className="pt-3 border-t border-slate-100 mt-auto flex items-center justify-between">
                    {renderCardActions(app)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* COLUMN 3: AWAITING APPROVAL */}
          <div className="w-[340px] flex flex-col max-h-[calc(100vh-140px)] rounded border border-slate-300 bg-slate-50 shadow-sm">
            <div className="bg-[#0b3b60] px-4 py-3 border-b-2 border-[#ea580c] flex justify-between items-center shrink-0">
              <h2 className="text-xs font-bold text-white uppercase tracking-wide">Awaiting Sign-off (Approver)</h2>
              <span className="bg-white/20 px-2 py-0.5 rounded text-[10px] font-bold text-white">{awaitingApproval.length}</span>
            </div>
            <div className="p-3 space-y-3 overflow-y-auto flex-1">
              {awaitingApproval.map(app => (
                <div key={app.id} className="rounded border border-slate-300 bg-white p-3 shadow-sm border-l-4 border-l-[#ea580c] hover:border-[#ea580c] transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-bold text-slate-500">{app.id}</span>
                    <span className="rounded-sm bg-[#ea580c]/10 border border-[#ea580c]/20 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-[#c2410c]">{app.department}</span>
                  </div>
                  <h3 className="text-sm font-bold text-[#003366] uppercase mb-1">{app.project}</h3>
                  <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-3">{app.applicant}</p>
                  
                  <div className="mb-3 h-1.5 rounded bg-slate-200 overflow-hidden">
                    <div className="h-1.5 bg-[#ea580c]" style={{ width: `${app.progress}%` }} />
                  </div>

                  <div className="pt-3 border-t border-slate-100 mt-auto flex items-center justify-between">
                    {renderCardActions(app)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* COLUMN 4: APPROVED */}
          <div className="w-[340px] flex flex-col max-h-[calc(100vh-140px)] rounded border border-slate-300 bg-slate-50 shadow-sm">
            <div className="bg-[#0b3b60] px-4 py-3 border-b-2 border-emerald-500 flex justify-between items-center shrink-0">
              <h2 className="text-xs font-bold text-white uppercase tracking-wide">Final Approved</h2>
              <span className="bg-white/20 px-2 py-0.5 rounded text-[10px] font-bold text-white">{approved.length}</span>
            </div>
            <div className="p-3 space-y-3 overflow-y-auto flex-1">
              {approved.map(app => (
                <div key={app.id} className="rounded border border-emerald-300 bg-emerald-50 p-3 shadow-sm border-l-4 border-l-emerald-600 hover:border-emerald-500 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-bold text-emerald-800">{app.id}</span>
                    <span className="rounded-sm bg-emerald-100 border border-emerald-200 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-emerald-800">✅ Issued</span>
                  </div>
                  <h3 className="text-sm font-bold text-[#003366] uppercase mb-1">{app.project}</h3>
                  <p className="text-[10px] font-semibold text-emerald-700 uppercase tracking-wide mb-3">{app.applicant}</p>
                  
                  <div className="mb-3 h-1.5 rounded bg-slate-200 overflow-hidden">
                    <div className="h-1.5 bg-emerald-600" style={{ width: `${app.progress}%` }} />
                  </div>

                  <div className="pt-3 border-t border-emerald-200 mt-auto flex items-center justify-between">
                    {renderCardActions(app)}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
