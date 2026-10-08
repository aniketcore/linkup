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
    <div className="min-h-screen bg-[#f1f5f9] text-slate-900 font-sans">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-[#003366] pb-4">
          <div className="flex items-center gap-4">
            <img src="/emblem.svg" alt="State Emblem of India" className="h-16 w-auto" />
            <div className="flex flex-col">
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#ea580c]">
                Checker Dashboard
              </p>
              <h1 className="text-2xl font-extrabold text-[#003366] uppercase tracking-tight">
                Department Review Queue
              </h1>
            </div>
          </div>
          <div className="flex gap-3">
            <a href="/dashboard" className="inline-flex items-center justify-center rounded bg-[#003366] px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#002244] border border-[#002244] transition-colors uppercase tracking-wide">
              ← Back
            </a>
            <button className="inline-flex items-center justify-center rounded bg-white border border-[#003366] text-[#003366] px-5 py-2 text-xs font-bold shadow-sm hover:bg-slate-50 transition-colors uppercase tracking-wide">
              Export Queue
            </button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {[
            { label: "Assigned today", value: "12" },
            { label: "Pending action", value: "06" },
            { label: "On hold", value: "03" },
          ].map((item) => (
            <div key={item.label} className="rounded border-t-4 border-t-[#003366] border border-slate-300 bg-white p-4 shadow-sm">
              <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">{item.label}</p>
              <p className="mt-2 text-2xl font-extrabold text-[#0b3b60]">{item.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
          <div className="rounded border border-slate-300 bg-white shadow-sm overflow-hidden flex flex-col">
            <div className="bg-[#0b3b60] px-4 py-3 border-b-2 border-[#ea580c]">
              <h2 className="text-sm font-bold text-white uppercase tracking-wide">Applications requiring review</h2>
            </div>
            <div className="p-4 space-y-4 bg-slate-50 flex-1">
              {queue.map((item) => (
                <div key={item.id} className="rounded border border-slate-300 bg-white p-4 shadow-sm border-l-4 border-l-[#003366]">
                  <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div>
                      <div className="text-sm font-bold text-[#003366] uppercase">{item.owner}</div>
                      <div className="mt-1 text-[11px] font-semibold text-slate-500">{item.id}</div>
                    </div>
                    <div className="flex gap-2">
                      <span className={`rounded-sm border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                        item.priority === "High" ? "bg-red-100 text-red-800 border-red-200" : item.priority === "Medium" ? "bg-amber-100 text-amber-800 border-amber-200" : "bg-slate-100 text-slate-700 border-slate-200"
                      }`}>
                        {item.priority}
                      </span>
                      <span className="rounded-sm bg-[#0b3b60]/10 border border-[#0b3b60]/20 px-2 py-0.5 text-[10px] font-bold text-[#0b3b60] uppercase tracking-wide">{item.department}</span>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between gap-4">
                    <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">{item.status}</p>
                    <div className="flex gap-2">
                      <button className="rounded border border-[#003366] bg-white px-4 py-1.5 text-[11px] font-bold text-[#003366] uppercase tracking-wide hover:bg-slate-50">Review</button>
                      <button className="rounded bg-[#ea580c] px-4 py-1.5 text-[11px] font-bold text-white uppercase tracking-wide hover:bg-[#c2410c]">Send back</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded border border-slate-300 bg-white shadow-sm overflow-hidden flex flex-col">
            <div className="bg-[#003366] px-4 py-3 border-b-2 border-[#ea580c]">
              <h3 className="text-sm font-bold text-white uppercase tracking-wide">Current checklist</h3>
            </div>
            <ul className="p-4 space-y-3 bg-slate-50 flex-1">
              {checks.map((check) => (
                <li key={check} className="flex items-center gap-3 text-xs font-medium text-slate-700">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-sm border border-[#003366]/20 bg-[#003366]/10 text-[10px] font-bold text-[#003366]">✓</span>
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
