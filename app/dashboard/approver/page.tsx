"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const approvals = [
  { id: "BP-2026-000010", applicant: "Apex Infrastructure", decision: "Awaiting approval", department: "Town Planning" },
  { id: "BP-2026-000014", applicant: "Metroline Realty", decision: "Checker remarks reviewed", department: "Fire & Safety" },
  { id: "BP-2026-000017", applicant: "Riverside Infra", decision: "Ready for final signoff", department: "Environment" },
];

const summary = [
  { label: "Awaiting decision", value: "7" },
  { label: "Approved this week", value: "19" },
  { label: "Sent back", value: "4" },
];

export default function ApproverDashboard() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("linkup_session_token");
    if (!token) {
      router.replace("/");
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-[#f1f5f9] text-slate-900 font-sans">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-[#003366] pb-4">
          <div className="flex items-center gap-4">
            <img src="/emblem.svg" alt="State Emblem of India" className="h-16 w-auto" />
            <div className="flex flex-col">
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#ea580c]">
                Approver Dashboard
              </p>
              <h1 className="text-2xl font-extrabold text-[#003366] uppercase tracking-tight">
                Decision & Compliance Board
              </h1>
            </div>
          </div>
          <div className="flex gap-3">
            <a href="/dashboard" className="inline-flex items-center justify-center rounded bg-[#003366] px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#002244] border border-[#002244] transition-colors uppercase tracking-wide">
              ← Back
            </a>
            <button className="inline-flex items-center justify-center rounded bg-[#ea580c] px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#c2410c] border border-[#c2410c] transition-colors uppercase tracking-wide">
              Review Escalations
            </button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {summary.map((item) => (
            <div key={item.label} className="rounded border-t-4 border-t-[#003366] border border-slate-300 bg-white p-4 shadow-sm">
              <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">{item.label}</p>
              <p className="mt-2 text-2xl font-extrabold text-[#0b3b60]">{item.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded border border-slate-300 bg-white shadow-sm overflow-hidden flex flex-col">
          <div className="bg-[#0b3b60] px-4 py-3 border-b-2 border-[#ea580c]">
            <h2 className="text-sm font-bold text-white uppercase tracking-wide">Approvals awaiting sign-off</h2>
          </div>
          <div className="p-4 space-y-4 bg-slate-50">
            {approvals.map((item) => (
              <div key={item.id} className="rounded border border-slate-300 bg-white p-4 shadow-sm border-l-4 border-l-[#003366]">
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="text-sm font-bold text-[#003366]">{item.applicant}</div>
                    <div className="mt-1 text-[11px] font-semibold text-slate-500">{item.id}</div>
                  </div>
                  <div className="flex gap-2">
                    <span className="rounded-sm bg-slate-100 border border-slate-200 px-2 py-0.5 text-[10px] font-bold text-slate-700 uppercase tracking-wide">{item.department}</span>
                    <span className="rounded-sm bg-[#003366]/10 border border-[#003366]/20 px-2 py-0.5 text-[10px] font-bold text-[#003366] uppercase tracking-wide">{item.decision}</span>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <button className="rounded bg-emerald-700 hover:bg-emerald-800 px-4 py-1.5 text-[11px] font-bold text-white uppercase tracking-wide">Approve</button>
                  <button className="rounded bg-red-700 hover:bg-red-800 px-4 py-1.5 text-[11px] font-bold text-white uppercase tracking-wide">Decline</button>
                  <button className="rounded bg-white border border-slate-400 hover:bg-slate-100 px-4 py-1.5 text-[11px] font-bold text-slate-700 uppercase tracking-wide">Hold</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
