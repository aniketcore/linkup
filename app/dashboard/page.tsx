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
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">LinkUp portal</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">Government dashboards</h1>
          </div>
          <a
            href="/"
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:border-slate-400 hover:bg-slate-50"
          >
            Back to home
          </a>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {quickMetrics.map((item) => (
            <div key={item.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">{item.label}</p>
              <div className="mt-3 flex items-end justify-between gap-3">
                <span className="text-3xl font-bold text-slate-900">{item.value}</span>
                <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700">
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
                className="group rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
              >
                <div className={`mb-4 h-2 rounded-full bg-gradient-to-r ${card.accent}`} />
                <h2 className="text-xl font-bold text-slate-900">{card.title}</h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">{card.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {card.stats.map((stat) => (
                    <span key={stat} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                      {stat}
                    </span>
                  ))}
                </div>
                <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-700">
                  Open dashboard
                  <span aria-hidden="true">→</span>
                </div>
              </a>
            ))}
          </div>

          <aside className="rounded-3xl border border-slate-200 bg-slate-900 p-6 text-white shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Priority queue</h2>
              <span className="rounded-full bg-blue-500/20 px-2 py-1 text-xs font-semibold text-blue-200">Live</span>
            </div>

            <ul className="mt-5 space-y-3">
              {actions.map((action) => (
                <li key={action} className="rounded-2xl border border-slate-700 bg-slate-800/80 p-3 text-sm text-slate-200">
                  {action}
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </div>
    </div>
  );
}
