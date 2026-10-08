"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const applications = [
  { id: "BP-2026-000001", project: "Skyline Green Heights", status: "Final approved", progress: 100, date: "01 Oct 2026" },
  { id: "BP-2026-000002", project: "Lotus Residency Phase II", status: "Under scrutiny", progress: 70, date: "04 Oct 2026" },
  { id: "BP-2026-000003", project: "Metro Point Retail Hub", status: "Sent back", progress: 40, date: "07 Oct 2026" },
];

export default function CitizenDashboard() {
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
                Citizen Tracker
              </p>
              <h1 className="text-2xl font-extrabold text-[#003366] uppercase tracking-tight">
                Public Status Dashboard
              </h1>
            </div>
          </div>
          <div className="flex gap-3">
            <a href="/dashboard" className="inline-flex items-center justify-center rounded bg-[#003366] px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#002244] border border-[#002244] transition-colors uppercase tracking-wide">
              ← Back
            </a>
            <button className="inline-flex items-center justify-center rounded bg-[#ea580c] px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#c2410c] border border-[#c2410c] transition-colors uppercase tracking-wide">
              Search Application
            </button>
          </div>
        </div>

        <div className="mb-6 rounded border border-slate-300 bg-white p-4 shadow-sm border-t-4 border-t-[#003366]">
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <input
              placeholder="Search by application number or project name"
              className="w-full rounded border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-[#ea580c] focus:ring-1 focus:ring-[#ea580c]"
            />
            <button className="rounded bg-[#ea580c] hover:bg-[#c2410c] px-6 py-2.5 text-sm font-bold text-white uppercase tracking-wide transition-colors">
              Track
            </button>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
          <div className="space-y-4">
            {applications.map((app) => (
              <div key={app.id} className="rounded border border-slate-300 bg-white p-5 shadow-sm border-l-4 border-l-[#0b3b60]">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="text-[11px] font-bold text-slate-500 tracking-wide">{app.id}</div>
                    <h3 className="mt-1 text-lg font-bold text-[#003366] uppercase">{app.project}</h3>
                  </div>
                  <span className={`rounded-sm border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                    app.status === "Final approved" ? "bg-emerald-100 text-emerald-800 border-emerald-200" : app.status === "Sent back" ? "bg-amber-100 text-amber-800 border-amber-200" : "bg-blue-100 text-blue-800 border-blue-200"
                  }`}>
                    {app.status}
                  </span>
                </div>

                <div className="mt-4">
                  <div className="mb-2 flex items-center justify-between text-[11px] font-bold uppercase text-slate-500 tracking-wide">
                    <span>Progress</span>
                    <span>{app.progress}%</span>
                  </div>
                  <div className="h-2 rounded bg-slate-200 overflow-hidden">
                    <div className="h-2 bg-[#003366]" style={{ width: `${app.progress}%` }} />
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between text-xs font-medium text-slate-600">
                  <span>Submitted on <strong className="text-slate-800">{app.date}</strong></span>
                  <button className="font-bold text-[#ea580c] uppercase tracking-wide hover:underline">View details</button>
                </div>
              </div>
            ))}
          </div>

          <aside className="rounded border border-slate-300 bg-white shadow-sm flex flex-col overflow-hidden">
            <div className="bg-[#0b3b60] px-4 py-3 border-b-2 border-[#ea580c]">
              <h3 className="text-sm font-bold text-white uppercase tracking-wide">Department Progress</h3>
            </div>
            <div className="p-4 space-y-5 bg-slate-50 flex-1">
              {[
                { label: "Town Planning", status: "Completed", value: "100%" },
                { label: "Fire & Safety", status: "In progress", value: "70%" },
                { label: "Environment", status: "Pending", value: "30%" },
              ].map((step) => (
                <div key={step.label} className="rounded border border-slate-200 bg-white p-3 shadow-sm border-l-4 border-l-[#003366]">
                  <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wide">
                    <span className="text-[#003366]">{step.label}</span>
                    <span className={step.status === "Completed" ? "text-emerald-700" : step.status === "In progress" ? "text-amber-700" : "text-slate-500"}>
                      {step.status}
                    </span>
                  </div>
                  <div className="mt-3 h-1.5 rounded bg-slate-200 overflow-hidden">
                    <div className="h-1.5 bg-[#ea580c]" style={{ width: step.value }} />
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
