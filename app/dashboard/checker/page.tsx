"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const queue = [
  { id: "BP-2026-000018", owner: "Green Crest Developers", priority: "High", status: "Missing site plan", department: "Town Planning" },
  { id: "BP-2026-000022", owner: "Mohan Construction", priority: "Medium", status: "Awaiting compliance check", department: "Town Planning" },
  { id: "BP-2026-000033", owner: "Riverside Infra", priority: "Low", status: "Ready for verification", department: "Fire & Safety" },
];

const checks = [
  "Zoning compliance verified",
  "FAR and building line review pending",
  "Rear setback dimension missing in uploaded plan",
];

export default function CheckerDashboard() {
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
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-600">Checker dashboard</p>
            <h1 className="mt-2 text-3xl font-bold">Department review queue</h1>
          </div>
          <div className="flex gap-3">
            <a href="/dashboard" className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:border-slate-400">Back</a>
            <button className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700">Export queue</button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {[
            { label: "Assigned today", value: "12" },
            { label: "Pending action", value: "06" },
            { label: "On hold", value: "03" },
          ].map((item) => (
            <div key={item.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">{item.label}</p>
              <p className="mt-3 text-3xl font-bold text-slate-900">{item.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-bold">Applications requiring review</h2>
            <div className="mt-5 space-y-4">
              {queue.map((item) => (
                <div key={item.id} className="rounded-2xl border border-slate-200 p-4">
                  <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div>
                      <div className="text-sm font-semibold text-slate-900">{item.owner}</div>
                      <div className="mt-1 text-xs font-mono text-slate-500">{item.id}</div>
                    </div>
                    <div className="flex gap-2">
                      <span className={`rounded-full px-2 py-1 text-[11px] font-semibold ${
                        item.priority === "High" ? "bg-red-100 text-red-700" : item.priority === "Medium" ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-700"
                      }`}>
                        {item.priority}
                      </span>
                      <span className="rounded-full bg-violet-100 px-2 py-1 text-[11px] font-semibold text-violet-700">{item.department}</span>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between gap-4">
                    <p className="text-sm text-slate-600">{item.status}</p>
                    <div className="flex gap-2">
                      <button className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700">Review</button>
                      <button className="rounded-lg bg-violet-600 px-3 py-1.5 text-xs font-semibold text-white">Send back</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-lg font-bold">Current checklist</h3>
            <ul className="mt-4 space-y-3">
              {checks.map((check) => (
                <li key={check} className="flex gap-3 text-sm text-slate-700">
                  <span className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-violet-100 text-[10px] font-bold text-violet-700">✓</span>
                  {check}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
