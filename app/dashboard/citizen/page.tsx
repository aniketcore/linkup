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
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">Citizen tracker</p>
            <h1 className="mt-2 text-3xl font-bold">Public status dashboard</h1>
          </div>
          <div className="flex gap-3">
            <a href="/dashboard" className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:border-slate-400">Back</a>
            <button className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700">Search application</button>
          </div>
        </div>

        <div className="mb-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <input
              placeholder="Search by application number or project name"
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none ring-0 placeholder:text-slate-500 focus:border-emerald-500"
            />
            <button className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white">Track</button>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
          <div className="space-y-4">
            {applications.map((app) => (
              <div key={app.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="font-mono text-xs text-slate-500">{app.id}</div>
                    <h3 className="mt-1 text-lg font-bold text-slate-900">{app.project}</h3>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                    app.status === "Final approved" ? "bg-emerald-100 text-emerald-700" : app.status === "Sent back" ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"
                  }`}>
                    {app.status}
                  </span>
                </div>

                <div className="mt-4">
                  <div className="mb-2 flex items-center justify-between text-xs font-medium text-slate-500">
                    <span>Progress</span>
                    <span>{app.progress}%</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-slate-100">
                    <div className="h-2.5 rounded-full bg-emerald-500" style={{ width: `${app.progress}%` }} />
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between text-sm text-slate-600">
                  <span>Submitted on {app.date}</span>
                  <button className="font-semibold text-emerald-700">View details</button>
                </div>
              </div>
            ))}
          </div>

          <aside className="rounded-3xl border border-slate-200 bg-slate-900 p-5 text-white shadow-sm">
            <h3 className="text-lg font-bold">Department progress</h3>
            <div className="mt-5 space-y-4">
              {[
                { label: "Town Planning", status: "Completed", value: "100%" },
                { label: "Fire & Safety", status: "In progress", value: "70%" },
                { label: "Environment", status: "Pending", value: "30%" },
              ].map((step) => (
                <div key={step.label} className="rounded-2xl border border-slate-700 bg-slate-800/80 p-3">
                  <div className="flex items-center justify-between text-sm">
                    <span>{step.label}</span>
                    <span className="text-slate-300">{step.status}</span>
                  </div>
                  <div className="mt-3 h-2 rounded-full bg-slate-700">
                    <div className="h-2 rounded-full bg-emerald-500" style={{ width: step.value }} />
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
