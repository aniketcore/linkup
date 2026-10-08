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
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Applicant portal</p>
            <h1 className="mt-2 text-3xl font-bold">My permit applications</h1>
          </div>
          <div className="flex gap-3">
            <a href="/dashboard" className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:border-slate-400">Back</a>
            <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">New application</button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {[
            { label: "Active applications", value: "4" },
            { label: "Documents pending", value: "2" },
            { label: "Final approved", value: "9" },
          ].map((item) => (
            <div key={item.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">{item.label}</p>
              <p className="mt-3 text-3xl font-bold text-slate-900">{item.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-bold">Application list</h2>
              <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">Updated today</span>
            </div>
            <div className="overflow-hidden rounded-2xl border border-slate-200">
              <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 font-semibold text-slate-700">Application</th>
                    <th className="px-4 py-3 font-semibold text-slate-700">Type</th>
                    <th className="px-4 py-3 font-semibold text-slate-700">Status</th>
                    <th className="px-4 py-3 font-semibold text-slate-700">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {applications.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3">
                        <div className="font-semibold text-slate-900">{app.project}</div>
                        <div className="text-xs text-slate-500">{app.id}</div>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{app.type}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          app.status === "Approved"
                            ? "bg-emerald-100 text-emerald-700"
                            : app.status === "Sent back"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-blue-100 text-blue-700"
                        }`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{app.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-lg font-bold">Checklist</h3>
              <ul className="mt-4 space-y-3">
                {documentChecklist.map((doc, index) => (
                  <li key={doc} className="flex items-center gap-3 text-sm text-slate-700">
                    <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${
                      index < 2 ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                    }`}>
                      {index < 2 ? "✓" : "!"}
                    </span>
                    {doc}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-lg font-bold">Current workflow</h3>
              <div className="mt-5 space-y-4">
                {statuses.map((item) => (
                  <div key={item.label} className="flex items-center gap-3">
                    <div className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                      item.done ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-600"
                    }`}>
                      {item.done ? "✓" : "•"}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-slate-800">{item.label}</div>
                      <div className="text-xs text-slate-500">{item.date}</div>
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
