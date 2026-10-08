"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const roleCards = [
  {
    title: "Applicant Dashboard",
    href: "/dashboard/applicant",
    description: "Drafts, submissions, documents, and resubmission tracking.",
    accent: "from-blue-600 to-cyan-500",
    stats: ["4 Active", "2 Pending Docs", "1 Resubmission"],
  },
  {
    title: "Checker Dashboard",
    href: "/dashboard/checker",
    description: "Departmental checks, remarks, and compliance review queue.",
    accent: "from-violet-600 to-indigo-500",
    stats: ["12 In Queue", "3 On Hold", "5 Due Today"],
  },
  {
    title: "Approver Dashboard",
    href: "/dashboard/approver",
    description: "Decision approvals, hold actions, and adverse-case management.",
    accent: "from-amber-500 to-orange-500",
    stats: ["7 Awaiting", "2 High Priority", "1 Final Approval"],
  },
  {
    title: "Citizen Tracker",
    href: "/dashboard/citizen",
    description: "Public-facing status visibility for permit applications.",
    accent: "from-emerald-600 to-teal-500",
    stats: ["18 Public Views", "4 Under Review", "2 Final Approved"],
  },
];

const quickMetrics = [
  { label: "Applications in flow", value: "248", delta: "+12%" },
  { label: "Pending reviews", value: "31", delta: "5 critical" },
  { label: "Final approvals", value: "17", delta: "+3 this week" },
  { label: "Avg. decision time", value: "4.8 days", delta: "-1.1 days" },
];

const actions = [
  "Review missing plot setback data in BP-2026-000011",
  "Approve fire clearance for Metro Point Retail Hub",
  "Resolve the environmental hold on Skyline Green Heights",
  "Send remarks to applicant for Lotus Residency resubmission",
];

export default function DashboardOverviewPage() {
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
                National Single-Window Portal
              </p>
              <h1 className="text-2xl font-extrabold text-[#003366] uppercase tracking-tight">
                Government Dashboards (BPAMS)
              </h1>
            </div>
          </div>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded bg-[#003366] px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#002244] border border-[#002244] transition-colors uppercase tracking-wide"
          >
            ← Back to Home
          </a>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {quickMetrics.map((item) => (
            <div key={item.label} className="rounded border-t-4 border-t-[#003366] border border-slate-300 bg-white p-4 shadow-sm">
              <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">{item.label}</p>
              <div className="mt-2 flex items-end justify-between gap-3">
                <span className="text-2xl font-extrabold text-[#0b3b60]">{item.value}</span>
                <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 uppercase tracking-wide">
                  {item.delta}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
          <div className="grid gap-5 md:grid-cols-2">
            {roleCards.map((card) => (
              <a
                key={card.title}
                href={card.href}
                className="group rounded border border-slate-300 bg-white shadow-sm transition hover:border-[#ea580c] hover:shadow-md flex flex-col overflow-hidden"
              >
                <div className="bg-[#0b3b60] px-4 py-3 border-b-2 border-[#ea580c]">
                  <h2 className="text-sm font-bold text-white uppercase tracking-wide">{card.title}</h2>
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <p className="text-xs font-medium text-slate-700 leading-relaxed mb-4">{card.description}</p>
                  <div className="flex flex-wrap gap-1.5 mt-auto">
                    {card.stats.map((stat) => (
                      <span key={stat} className="rounded bg-slate-100 border border-slate-200 px-2 py-1 text-[10px] font-bold text-[#0b3b60] uppercase">
                        {stat}
                      </span>
                    ))}
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#ea580c] uppercase tracking-wide">
                    <span>Access Portal</span>
                    <span aria-hidden="true" className="group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              </a>
            ))}
          </div>

          <aside className="rounded border border-slate-300 bg-white shadow-sm overflow-hidden flex flex-col">
            <div className="bg-[#003366] px-4 py-3 flex items-center justify-between border-b-2 border-[#ea580c]">
              <h2 className="text-sm font-bold text-white uppercase tracking-wide">Live Priority Queue</h2>
              <span className="flex items-center gap-1.5 rounded bg-red-600 px-2 py-0.5 text-[10px] font-bold text-white animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                ACTIVE
              </span>
            </div>

            <ul className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
              {actions.map((action, i) => (
                <li key={i} className="flex gap-3 rounded border border-slate-200 bg-white p-3 text-xs font-medium text-slate-800 shadow-sm border-l-4 border-l-[#ea580c]">
                  <span className="text-base leading-none">📢</span>
                  <span>{action}</span>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </div>
    </div>
  );
}
