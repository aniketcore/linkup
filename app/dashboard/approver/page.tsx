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
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-600">Approver dashboard</p>
            <h1 className="mt-2 text-3xl font-bold">Decision and compliance board</h1>
          </div>
          <div className="flex gap-3">
            <a href="/dashboard" className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:border-slate-400">Back</a>
            <button className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600">Review escalations</button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {summary.map((item) => (
            <div key={item.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">{item.label}</p>
              <p className="mt-3 text-3xl font-bold text-slate-900">{item.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-bold">Approvals awaiting sign-off</h2>
          <div className="mt-5 space-y-4">
            {approvals.map((item) => (
              <div key={item.id} className="rounded-2xl border border-slate-200 p-4">
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="text-sm font-semibold text-slate-900">{item.applicant}</div>
                    <div className="mt-1 text-xs font-mono text-slate-500">{item.id}</div>
                  </div>
                  <div className="flex gap-2">
                    <span className="rounded-full bg-amber-100 px-2 py-1 text-[11px] font-semibold text-amber-700">{item.department}</span>
                    <span className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-700">{item.decision}</span>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <button className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white">Approve</button>
                  <button className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white">Decline</button>
                  <button className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700">Hold</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
