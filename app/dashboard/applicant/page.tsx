"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const applications = [
  { id: "BP-2026-000011", project: "Skyline Green Heights", status: "Under scrutiny", date: "10 Oct 2026", type: "Residential + Retail" },
  { id: "BP-2026-000021", project: "Lotus Residency Phase II", status: "Sent back", date: "09 Oct 2026", type: "Residential" },
  { id: "BP-2026-000034", project: "Metro Point Retail Hub", status: "Approved", date: "08 Oct 2026", type: "Commercial" },
];

const documentChecklist = [
  "Site plan and setback drawing",
  "Ownership proof",
  "Building NOC",
  "Structural stability certificate",
];

const statuses = [
  { label: "Submission", done: true, date: "01 Oct" },
  { label: "Town Planning", done: true, date: "03 Oct" },
  { label: "Fire & Safety", done: false, date: "Pending" },
  { label: "Environment", done: false, date: "Pending" },
];

export default function ApplicantDashboard() {
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
                Applicant Portal
              </p>
              <h1 className="text-2xl font-extrabold text-[#003366] uppercase tracking-tight">
                My Permit Applications
              </h1>
            </div>
          </div>
          <div className="flex gap-3">
            <a
              href="/dashboard"
              className="inline-flex items-center justify-center rounded bg-[#003366] px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#002244] border border-[#002244] transition-colors uppercase tracking-wide"
            >
              ← Back
            </a>
            <button className="inline-flex items-center justify-center rounded bg-[#ea580c] px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#c2410c] border border-[#c2410c] transition-colors uppercase tracking-wide">
              New Application
            </button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {[
            { label: "Active applications", value: "4" },
            { label: "Documents pending", value: "2" },
            { label: "Final approved", value: "9" },
          ].map((item) => (
            <div key={item.label} className="rounded border-t-4 border-t-[#003366] border border-slate-300 bg-white p-4 shadow-sm">
              <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">{item.label}</p>
              <p className="mt-2 text-2xl font-extrabold text-[#0b3b60]">{item.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
          <div className="rounded border border-slate-300 bg-white shadow-sm overflow-hidden flex flex-col">
            <div className="bg-[#0b3b60] px-4 py-3 border-b-2 border-[#ea580c] flex items-center justify-between">
              <h2 className="text-sm font-bold text-white uppercase tracking-wide">Application list</h2>
              <span className="rounded bg-[#ea580c] px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-wide">Updated today</span>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 font-bold text-slate-700 uppercase tracking-wide">Application</th>
                    <th className="px-4 py-3 font-bold text-slate-700 uppercase tracking-wide">Type</th>
                    <th className="px-4 py-3 font-bold text-slate-700 uppercase tracking-wide">Status</th>
                    <th className="px-4 py-3 font-bold text-slate-700 uppercase tracking-wide">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {applications.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-bold text-[#003366]">{app.project}</div>
                        <div className="text-[11px] font-semibold text-slate-500">{app.id}</div>
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-700">{app.type}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-sm px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                          app.status === "Approved"
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                            : app.status === "Sent back"
                              ? "bg-amber-100 text-amber-800 border border-amber-200"
                              : "bg-blue-100 text-blue-800 border border-blue-200"
                        }`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-600">{app.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded border border-slate-300 bg-white shadow-sm overflow-hidden flex flex-col">
              <div className="bg-[#003366] px-4 py-3 border-b-2 border-[#ea580c]">
                <h3 className="text-sm font-bold text-white uppercase tracking-wide">Checklist</h3>
              </div>
              <ul className="p-4 space-y-3">
                {documentChecklist.map((doc, index) => (
                  <li key={doc} className="flex items-center gap-3 text-xs font-medium text-slate-700">
                    <span className={`flex h-5 w-5 items-center justify-center rounded-sm text-[10px] font-bold ${
                      index < 2 ? "bg-emerald-100 text-emerald-700 border border-emerald-200" : "bg-amber-100 text-amber-700 border border-amber-200"
                    }`}>
                      {index < 2 ? "✓" : "!"}
                    </span>
                    {doc}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded border border-slate-300 bg-white shadow-sm overflow-hidden flex flex-col">
              <div className="bg-[#003366] px-4 py-3 border-b-2 border-[#ea580c]">
                <h3 className="text-sm font-bold text-white uppercase tracking-wide">Current Workflow</h3>
              </div>
              <div className="p-4 space-y-4">
                {statuses.map((item) => (
                  <div key={item.label} className="flex items-center gap-3">
                    <div className={`flex h-6 w-6 items-center justify-center rounded-sm text-[10px] font-bold ${
                      item.done ? "bg-emerald-100 text-emerald-700 border border-emerald-200" : "bg-slate-100 text-slate-400 border border-slate-200"
                    }`}>
                      {item.done ? "✓" : "•"}
                    </div>
                    <div className="flex-1">
                      <div className={`text-xs font-bold uppercase tracking-wide ${item.done ? "text-[#003366]" : "text-slate-500"}`}>{item.label}</div>
                      <div className="text-[10px] font-semibold text-slate-500">{item.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
