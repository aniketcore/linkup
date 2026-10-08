"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { KanbanCard } from "../components/KanbanCard";
import NewApplicationModal from "../components/NewApplicationModal";
import PublicRecordModal from "../components/PublicRecordModal";
import WorkflowActionModal, { WorkflowActionType } from "../components/WorkflowActionModal";
import { ApplicationType } from "../types";

export default function UnifiedKanbanDashboard() {
  const router = useRouter();
  const [actualRole, setActualRole] = useState<string>("applicant");
  const [simulatedRole, setSimulatedRole] = useState<string>("applicant");
  const [departmentName, setDepartmentName] = useState<string | null>(null);
  const [showOnlyMyDept, setShowOnlyMyDept] = useState(true);
  const [loading, setLoading] = useState(true);
  const [allApplications, setAllApplications] = useState<ApplicationType[]>([]);
  const [isNewAppModalOpen, setIsNewAppModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ id?: string; name?: string; email?: string } | null>(null);
  const [selectedRecordApp, setSelectedRecordApp] = useState<ApplicationType | null>(null);
  const [actionModalState, setActionModalState] = useState<{
    app: ApplicationType;
    actionType: WorkflowActionType;
  } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("linkup_session_token");
    if (!token) {
      router.replace("/");
      return;
    }

      // Securely verify role with backend instead of trusting localStorage client-side
      fetch("/api/auth/me", {
        headers: { "Authorization": `Bearer ${token}` }
      })
      .then(res => res.json())
      .then((authData: any) => {
        if (authData.ok && authData.user) {
          const userRole = authData.user.role || "applicant";
          setActualRole(userRole);
          setSimulatedRole(userRole);
          setCurrentUser(authData.user);
          if (authData.user.department_name) {
            setDepartmentName(authData.user.department_name);
          }
        } else {
          router.replace("/");
        }
      })
      .catch(() => router.replace("/"));
    
    loadApplications();
  }, [router]);

  const loadApplications = useCallback(() => {
    fetch("/api/applications")
      .then(res => res.json())
      .then((data: any) => {
        if (data.success) {
          const formatted = data.applications.map((app: any) => {
            let formattedDate = app.date;
            try {
              const safeDateStr = String(app.date).includes('T') ? app.date : String(app.date).replace(' ', 'T') + 'Z';
              const d = new Date(safeDateStr);
              if (!isNaN(d.getTime())) {
                formattedDate = d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
              }
            } catch {
              // fallback
            }
            return {
              ...app,
              date: formattedDate
            };
          });
          setAllApplications(formatted);
        }
      })
      .catch(err => console.error("Failed to load apps:", err))
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="min-h-screen bg-[#f1f5f9] flex items-center justify-center font-bold text-[#003366]">Loading Workspace...</div>;
  }

  // Filter columns
  // Filter applications if the user wants to see only their department's queue
  const displayApps = (simulatedRole === "checker" || simulatedRole === "approver") && showOnlyMyDept && departmentName 
    ? allApplications.filter(a => 
        a.department === departmentName || 
        (a.status?.toLowerCase() === "approved" && a.approved_by?.includes(departmentName))
      ) 
    : allApplications;

  const draftsAndCorrections = displayApps.filter(a => {
    const s = a.status?.toLowerCase();
    return s === "draft" || s === "needs_correction";
  });
  const underScrutiny = displayApps.filter(a => {
    const s = a.status?.toLowerCase();
    return s === "scrutiny" || s === "submitted";
  });
  const awaitingApproval = displayApps.filter(a => {
    const s = a.status?.toLowerCase();
    return s === "awaiting_approval";
  });
  const approved = displayApps.filter(a => {
    const s = a.status?.toLowerCase();
    return s === "approved";
  });

  // Helper to render card buttons based on role
  const renderCardActions = (app: ApplicationType) => {
    // 1. Citizen is strictly read-only on the unified board
    if (simulatedRole === "citizen") {
      return (
        <button
          onClick={() => setSelectedRecordApp(app)}
          className="rounded bg-[#0b3b60] hover:bg-[#002244] text-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide w-full cursor-pointer transition-colors"
        >
          View Public Record
        </button>
      );
    }

    // 2. Final approved cards are permanently locked from modifications
    if (app.status === "approved") {
      return (
        <button
          onClick={() => setSelectedRecordApp(app)}
          className="rounded bg-[#0b3b60] hover:bg-[#002244] text-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide w-full cursor-pointer transition-colors"
        >
          View Public Record
        </button>
      );
    }

    // 3. Government Staff (Checker/Approver) Role Scoping & Super Admin Override
    if (simulatedRole === "checker" || simulatedRole === "approver" || simulatedRole === "admin") {
      // Staff can ONLY action cards actively assigned to their specific department (unless Admin override)
      if (simulatedRole !== "admin" && departmentName && app.department !== departmentName) {
        return <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide italic">Not in your department</span>;
      }

      const statusLower = app.status?.toLowerCase();

      // Scrutiny stage actions (Checker or Admin)
      if ((simulatedRole === "checker" || simulatedRole === "admin") && (statusLower === "scrutiny" || statusLower === "submitted")) {
        return (
          <div className="flex gap-2 w-full">
            <button
              onClick={() => setActionModalState({ app, actionType: "verify" })}
              className="flex-1 rounded bg-emerald-700 hover:bg-emerald-800 px-2 py-1.5 text-[10px] font-bold text-white uppercase tracking-wide transition-colors cursor-pointer"
            >
              Verify
            </button>
            <button
              onClick={() => setActionModalState({ app, actionType: "send_back" })}
              className="flex-1 rounded bg-[#ea580c] hover:bg-[#c2410c] px-2 py-1.5 text-[10px] font-bold text-white uppercase tracking-wide transition-colors cursor-pointer"
            >
              Send Back
            </button>
          </div>
        );
      }

      // Approval stage actions (Approver or Admin)
      if ((simulatedRole === "approver" || simulatedRole === "admin") && statusLower === "awaiting_approval") {
        return (
          <div className="flex gap-1 w-full">
            <button
              onClick={() => setActionModalState({ app, actionType: "approve" })}
              className="flex-1 rounded bg-emerald-700 hover:bg-emerald-800 px-2 py-1.5 text-[9px] font-bold text-white uppercase tracking-wide transition-colors cursor-pointer"
            >
              Approve
            </button>
            <button
              onClick={() => setActionModalState({ app, actionType: "decline" })}
              className="flex-1 rounded bg-red-700 hover:bg-red-800 px-2 py-1.5 text-[9px] font-bold text-white uppercase tracking-wide transition-colors cursor-pointer"
            >
              Decline
            </button>
            <button
              onClick={() => setActionModalState({ app, actionType: "hold" })}
              className="flex-1 rounded bg-white border border-slate-400 hover:bg-slate-100 text-slate-700 px-2 py-1.5 text-[9px] font-bold uppercase tracking-wide transition-colors cursor-pointer"
            >
              Hold
            </button>
          </div>
        );
      }
    }

    // 4. Applicant Actions
    if (simulatedRole === "applicant") {
      if (app.status?.toLowerCase() === "needs_correction") {
        return (
          <button
            onClick={() => setActionModalState({ app, actionType: "resubmit" })}
            className="rounded bg-[#ea580c] hover:bg-[#c2410c] px-3 py-1.5 text-[10px] font-bold text-white uppercase tracking-wide w-full transition-colors cursor-pointer"
          >
            Upload Missing Docs
          </button>
        );
      }
      return (
        <button
          onClick={() => setSelectedRecordApp(app)}
          className="rounded border border-[#003366] text-[#003366] hover:bg-slate-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide w-full cursor-pointer transition-colors"
        >
          View Details
        </button>
      );
    }

    return <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide italic">No actions available</span>;
  };

  const getRoleTitle = () => {
    switch (simulatedRole) {
      case "checker": return "Checker";
      case "approver": return "Approver";
      case "applicant": return "Applicant";
      case "citizen": return "Citizen";
      case "admin": return "Super Admin";
      default: return "Workspace";
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] text-slate-900 font-sans flex flex-col">
      {/* Top Navbar */}
      <div className="w-full px-4 py-4 sm:px-6 lg:px-8 border-b border-slate-300 bg-white flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <img src="/emblem.svg" alt="State Emblem of India" className="h-10 w-auto" />
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
              {departmentName ? `${departmentName} • ` : ""}{getRoleTitle()}
            </span>
          </div>
          <button
            onClick={() => {
              localStorage.removeItem("linkup_session_token");
              localStorage.removeItem("linkup_user");
              router.replace("/");
            }}
            className="rounded bg-[#003366] px-4 py-1.5 text-[10px] font-bold text-white uppercase tracking-wide hover:bg-[#002244] transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Action Sub-Toolbar */}
      <div className="w-full px-4 py-3 sm:px-6 lg:px-8 bg-slate-50 border-b-2 border-[#003366] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm z-10 sticky top-[73px]">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          {actualRole === "admin" && (
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Simulate:</span>
              <select
                value={simulatedRole}
                onChange={(e) => {
                  const newRole = e.target.value;
                  setSimulatedRole(newRole);
                  if ((newRole === "checker" || newRole === "approver") && !departmentName) {
                    setDepartmentName("Town Planning Department");
                  }
                }}
                className="rounded border border-slate-300 bg-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-slate-800 outline-none focus:border-[#ea580c] shadow-sm"
              >
                <option value="admin">🦸‍♂️ Admin Override</option>
                <option value="applicant">👤 Applicant Mode</option>
                <option value="checker">🕵️‍♂️ Checker Mode</option>
                <option value="approver">✍️ Approver Mode</option>
                <option value="citizen">👁️ Citizen Mode</option>
              </select>
            </div>
          )}

          {(simulatedRole === "checker" || simulatedRole === "approver") && (
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Dept:</span>
              <select
                value={departmentName || "Town Planning Department"}
                onChange={(e) => setDepartmentName(e.target.value)}
                className="rounded border border-slate-300 bg-white px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wide text-slate-800 outline-none focus:border-[#ea580c] shadow-sm"
              >
                <option value="Town Planning Department">Town Planning</option>
                <option value="Fire & Safety Department">Fire & Safety</option>
                <option value="Environment Department">Environment</option>
              </select>
            </div>
          )}
          
          {(simulatedRole === "checker" || simulatedRole === "approver") && departmentName && (
            <label className="flex items-center gap-2 cursor-pointer bg-white px-3 py-1.5 border border-slate-300 rounded shadow-sm hover:bg-slate-50 transition-colors">
              <input 
                type="checkbox" 
                checked={showOnlyMyDept} 
                onChange={e => setShowOnlyMyDept(e.target.checked)} 
                className="rounded border-slate-400 text-[#003366] focus:ring-[#003366] accent-[#003366]"
              />
              <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wide">
                Show My Dept Only
              </span>
            </label>
          )}
        </div>
        
        <div className="flex items-center gap-4 w-full sm:w-auto justify-end">
          {simulatedRole === "applicant" && (
            <button
              onClick={() => setIsNewAppModalOpen(true)}
              className="inline-flex items-center justify-center rounded bg-[#ea580c] px-4 py-1.5 text-[10px] font-bold text-white shadow-sm hover:bg-[#c2410c] border border-[#c2410c] transition-colors uppercase tracking-wide cursor-pointer"
            >
              + New Application
            </button>
          )}
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
                <KanbanCard key={app.id} app={app} columnType="draft" renderActions={renderCardActions} />
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
                <KanbanCard key={app.id} app={app} columnType="scrutiny" renderActions={renderCardActions} />
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
                <KanbanCard key={app.id} app={app} columnType="awaiting" renderActions={renderCardActions} />
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
                <KanbanCard key={app.id} app={app} columnType="approved" renderActions={renderCardActions} />
              ))}
            </div>
          </div>

        </div>
      </div>

      <NewApplicationModal
        isOpen={isNewAppModalOpen}
        onClose={() => setIsNewAppModalOpen(false)}
        onApplicationCreated={() => {
          loadApplications();
        }}
        currentUser={currentUser}
      />

      <PublicRecordModal
        isOpen={Boolean(selectedRecordApp)}
        onClose={() => setSelectedRecordApp(null)}
        application={selectedRecordApp}
      />

      <WorkflowActionModal
        isOpen={Boolean(actionModalState)}
        onClose={() => setActionModalState(null)}
        application={actionModalState?.app || null}
        actionType={actionModalState?.actionType || null}
        departmentName={departmentName}
        actorUserId={currentUser?.id}
        onActionComplete={() => loadApplications()}
      />
    </div>
  );
}
