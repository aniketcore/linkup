"use client";

import React, { useState } from "react";
import Navbar from "./components/Navbar";
import AuthModal from "./components/AuthModal";

// Sample demonstration records for instant search demonstration
const SAMPLE_APPLICATIONS = [
  {
    id: "BP-2026-000001",
    project: "Skyline Green Heights",
    type: "Commercial + Residential",
    location: "Jaipur, Rajasthan (Ward 14, Zone 3)",
    applicant: "Apex Infrastructure Pvt. Ltd.",
    status: "Final Approved",
    statusColor: "emerald",
    submittedDate: "2026-10-01",
    lastUpdated: "2026-10-08 11:30 AM",
    steps: [
      { dept: "Submission", status: "completed", date: "01 Oct 10:00 AM", note: "Application verified & submitted" },
      { dept: "Town Planning", status: "completed", date: "03 Oct 02:15 PM", note: "Zoning & FAR standards approved by Amit (Approver)" },
      { dept: "Fire & Safety", status: "completed", date: "06 Oct 04:30 PM", note: "Fire hydrant & egress NOC cleared by Vikram (Approver)" },
      { dept: "Environment", status: "completed", date: "08 Oct 11:30 AM", note: "Pollution clearance granted by Dr. Verma (Approver)" },
    ],
  },
  {
    id: "BP-2026-000002",
    project: "Lotus Residency Phase II",
    type: "Residential",
    location: "Sector 22, Mansarovar",
    applicant: "Ramesh Singhania",
    status: "Under Scrutiny",
    statusColor: "blue",
    submittedDate: "2026-10-04",
    lastUpdated: "2026-10-08 09:15 AM",
    steps: [
      { dept: "Submission", status: "completed", date: "04 Oct 11:00 AM", note: "Application submitted" },
      { dept: "Town Planning", status: "completed", date: "06 Oct 03:00 PM", note: "Approved by Planning Approver" },
      { dept: "Fire & Safety", status: "active", date: "08 Oct 09:15 AM", note: "Under scrutiny by Fire Checker Neha" },
      { dept: "Environment", status: "pending", date: "Awaiting Prior Clearances", note: "Will activate once Fire & Safety approves" },
    ],
  },
  {
    id: "BP-2026-000003",
    project: "Metro Point Retail Hub",
    type: "Commercial",
    location: "MI Road, Central Ward",
    applicant: "Metroline Realty LLP",
    status: "Sent Back",
    statusColor: "amber",
    submittedDate: "2026-10-07",
    lastUpdated: "2026-10-08 01:20 PM",
    steps: [
      { dept: "Submission", status: "completed", date: "07 Oct 04:00 PM", note: "Submitted" },
      { dept: "Town Planning", status: "sent_back", date: "08 Oct 01:20 PM", note: "Remarks: Site plan missing rear setback dimensions. Please re-upload." },
      { dept: "Fire & Safety", status: "locked", date: "Locked", note: "Requires Planning clearance first" },
      { dept: "Environment", status: "locked", date: "Locked", note: "Requires Fire clearance first" },
    ],
  },
];

export default function Home() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [searchQuery, setSearchQuery] = useState("BP-2026-000001");
  const [activeSearchResult, setActiveSearchResult] = useState(SAMPLE_APPLICATIONS[0]);
  const [searchError, setSearchError] = useState("");

  const handleOpenAuth = (mode: "login" | "register") => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim().toUpperCase();
    const found = SAMPLE_APPLICATIONS.find(
      (app) => app.id.toUpperCase() === query || app.project.toLowerCase().includes(query.toLowerCase())
    );
    if (found) {
      setActiveSearchResult(found);
      setSearchError("");
    } else {
      setSearchError(`No application found matching "${searchQuery}". Try sample IDs: BP-2026-000001, BP-2026-000002, or BP-2026-000003`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Navigation Bar with Logo, Login, and Register */}
      <Navbar
        onLoginClick={() => handleOpenAuth("login")}
        onRegisterClick={() => handleOpenAuth("register")}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        initialMode={authMode}
        onClose={() => setAuthModalOpen(false)}
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-900 via-indigo-900 to-slate-900 text-white py-16 sm:py-24">
        {/* Subtle background grid accent */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e3a8a15_1px,transparent_1px),linear-gradient(to_bottom,#1e3a8a15_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Headlines & CTAs */}
            <div className="lg:col-span-7 flex flex-col gap-6 text-left">
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/20 px-3.5 py-1 text-xs font-semibold tracking-wide text-blue-300 ring-1 ring-blue-400/30 w-fit">
                <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                Cross-Departmental Government Service Tracking
              </div>

              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl leading-[1.15]">
                Single-Window <br />
                <span className="bg-gradient-to-r from-blue-300 via-cyan-200 to-indigo-300 bg-clip-text text-transparent">
                  Building Permit Approval
                </span>{" "}
                System
              </h1>

              <p className="text-lg text-slate-300 max-w-2xl leading-relaxed">
                A digitized, transparent workflow connecting <strong>Applicants</strong>, 
                <strong> Town Planning</strong>, <strong>Fire & Safety</strong>, and <strong>Environment</strong> departments.
                Track file movements in real-time with zero paper delays and full accountability.
              </p>

              {/* Primary Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => handleOpenAuth("login")}
                  className="rounded-xl bg-blue-500 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-500/30 hover:bg-blue-400 active:scale-95 transition-all"
                >
                  🚀 Apply for Building Permit
                </button>
                <a
                  href="#tracking"
                  className="rounded-xl border border-white/20 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-sm hover:bg-white/20 active:scale-95 transition-all"
                >
                  🔍 Track Application Status
                </a>
              </div>

              {/* Metric Highlights */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10 text-slate-300">
                <div>
                  <div className="text-2xl font-bold text-white">3 Departments</div>
                  <div className="text-xs text-slate-400">Sequential Scrutiny Pipeline</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">100%</div>
                  <div className="text-xs text-slate-400">Audit Trail & Remarks</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">0 Visits</div>
                  <div className="text-xs text-slate-400">End-to-End Online Visibility</div>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Quick Tracker Card */}
            <div className="lg:col-span-5" id="tracking">
              <div className="rounded-2xl border border-white/15 bg-white/10 p-6 shadow-2xl backdrop-blur-xl ring-1 ring-black/5 text-slate-100">
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="flex h-3 w-3 rounded-full bg-blue-400" />
                    <h3 className="font-bold text-white text-base">Citizen Public Tracker</h3>
                  </div>
                  <span className="text-xs text-slate-300">Live Status Check</span>
                </div>

                {/* Search Form */}
                <form onSubmit={handleSearch} className="mt-4 flex flex-col gap-3">
                  <label htmlFor="app-search" className="text-xs font-medium text-slate-300">
                    Enter Application Number
                  </label>
                  <div className="flex gap-2">
                    <input
                      id="app-search"
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="e.g. BP-2026-000001"
                      className="w-full rounded-lg bg-slate-900/60 border border-white/20 px-3.5 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <button
                      type="submit"
                      className="rounded-lg bg-blue-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-400 transition-colors shrink-0"
                    >
                      Search
                    </button>
                  </div>

                  {/* Sample ID Quick Chips */}
                  <div className="flex items-center gap-1.5 flex-wrap text-xs text-slate-300">
                    <span className="text-[11px] text-slate-400">Sample Demos:</span>
                    {SAMPLE_APPLICATIONS.map((app) => (
                      <button
                        key={app.id}
                        type="button"
                        onClick={() => {
                          setSearchQuery(app.id);
                          setActiveSearchResult(app);
                          setSearchError("");
                        }}
                        className={`rounded px-2 py-0.5 text-[11px] font-mono transition-colors ${
                          activeSearchResult.id === app.id
                            ? "bg-blue-500 text-white font-bold"
                            : "bg-white/10 hover:bg-white/20 text-slate-200"
                        }`}
                      >
                        {app.id}
                      </button>
                    ))}
                  </div>

                  {searchError && (
                    <p className="text-xs text-amber-300 bg-amber-900/30 border border-amber-500/30 rounded p-2 mt-1">
                      {searchError}
                    </p>
                  )}
                </form>

                {/* Search Result Card Preview */}
                {activeSearchResult && (
                  <div className="mt-5 rounded-xl bg-slate-900/80 border border-white/10 p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="font-mono text-xs font-bold text-blue-400">
                          {activeSearchResult.id}
                        </span>
                        <h4 className="font-semibold text-white text-sm">
                          {activeSearchResult.project}
                        </h4>
                        <p className="text-[11px] text-slate-400">{activeSearchResult.location}</p>
                      </div>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider ${
                          activeSearchResult.status === "Final Approved"
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                            : activeSearchResult.status === "Sent Back"
                            ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                            : "bg-blue-500/20 text-blue-300 border border-blue-500/40"
                        }`}
                      >
                        {activeSearchResult.status}
                      </span>
                    </div>

                    {/* Progress Stepper */}
                    <div className="pt-2">
                      <div className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-2">
                        Department Clearances
                      </div>
                      <div className="space-y-2">
                        {activeSearchResult.steps.map((st, i) => (
                          <div key={i} className="flex items-center justify-between text-xs py-1 border-b border-white/5 last:border-0">
                            <div className="flex items-center gap-2">
                              {st.status === "completed" ? (
                                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[10px] text-white">✓</span>
                              ) : st.status === "active" ? (
                                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 text-[10px] text-white animate-pulse">●</span>
                              ) : st.status === "sent_back" ? (
                                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[10px] text-white">!</span>
                              ) : (
                                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-slate-700 text-[10px] text-slate-400">○</span>
                              )}
                              <span className="font-medium text-slate-200">{st.dept}</span>
                            </div>
                            <span className="text-[11px] text-slate-400 text-right truncate max-w-[150px]">
                              {st.date}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Problem vs Solution Section (Core Context) */}
      <section id="about" className="py-16 bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-xs font-bold uppercase tracking-widest text-blue-600">The Problem & The Solution</h2>
            <p className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Why Building Permit Tracking Needed a Revolution
            </p>
            <p className="mt-3 text-base text-slate-600">
              When a service like a building permit requires approvals from multiple departments,
              the file historically moves with no central visibility—forcing citizens into endless office rounds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            {/* The Old Paper-Driven Way */}
            <div className="rounded-2xl border border-red-200 bg-red-50/50 p-8 flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-md bg-red-100 px-3 py-1 text-xs font-bold text-red-700 uppercase tracking-wider mb-4">
                  ❌ Conventional File Movement
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Disconnected & Opaque Bureaucracy</h3>
                <ul className="space-y-3 text-sm text-slate-700">
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 font-bold mt-0.5">•</span>
                    <span><strong>No Central Visibility:</strong> Citizens have no online tracking and must visit municipal offices repeatedly.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 font-bold mt-0.5">•</span>
                    <span><strong>Hidden Delays & Bottlenecks:</strong> Files sit on officer desks with no accountability or recorded reason.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 font-bold mt-0.5">•</span>
                    <span><strong>Loss of Physical Notes:</strong> Queries and objection notes are scattered across manual registers.</span>
                  </li>
                </ul>
              </div>
              <div className="mt-6 pt-4 border-t border-red-200/60 text-xs font-medium text-red-800">
                Result: Weeks of preventable delays, administrative fatigue, and citizen distress.
              </div>
            </div>

            {/* The BPAMS Way */}
            <div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-8 flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-md bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700 uppercase tracking-wider mb-4">
                  ✨ The BPAMS Digital Paradigm
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Transparent Cross-Department Orchestration</h3>
                <ul className="space-y-3 text-sm text-slate-700">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold mt-0.5">•</span>
                    <span><strong>Universal Tracking Number:</strong> Every application gets a unique ID (e.g., <code>BP-2026-000001</code>) traceable anytime.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold mt-0.5">•</span>
                    <span><strong>Sequential Enforcement:</strong> Fire Department cannot act until Planning clears; Environment waits for Fire.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold mt-0.5">•</span>
                    <span><strong>Send-Back & Hold Governance:</strong> Mandatory written remarks ensure applicants fix defects in minutes, not months.</span>
                  </li>
                </ul>
              </div>
              <div className="mt-6 pt-4 border-t border-blue-200/60 text-xs font-medium text-blue-900">
                Result: Predictable turnaround, complete decision traceability, and 100% digital convenience.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The 3-Department Sequential Workflow (Core FSD requirement) */}
      <section id="workflow" className="py-16 bg-slate-100 border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-xs font-bold uppercase tracking-widest text-blue-600">Sequential Processing Pipeline</h2>
            <p className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              3 Departments, 6 Scrutiny Checkpoints
            </p>
            <p className="mt-3 text-base text-slate-600">
              In accordance with <strong>Business Rule BR-03</strong>: A downstream department cannot process an application until the previous department has fully approved it.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative" id="departments">
            {/* Step 1: Town Planning */}
            <div className="relative rounded-2xl bg-white p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700 font-bold text-lg">
                  1
                </span>
                <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 border border-blue-200">
                  Stage 1: Primary
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900">Town Planning Department</h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Verifies land title, master plan zoning compliance, Floor Area Ratio (FAR), setbacks, and parking requirements.
              </p>
              <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-700">
                  <span className="font-semibold">Checker Role:</span>
                  <span className="text-slate-500">Document completeness scrutiny</span>
                </div>
                <div className="flex items-center justify-between text-slate-700">
                  <span className="font-semibold">Approver Role:</span>
                  <span className="text-slate-500">Zoning clearance sign-off</span>
                </div>
              </div>
            </div>

            {/* Step 2: Fire & Safety */}
            <div className="relative rounded-2xl bg-white p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-700 font-bold text-lg">
                  2
                </span>
                <span className="rounded-full bg-orange-50 px-2.5 py-1 text-xs font-semibold text-orange-700 border border-orange-200">
                  Stage 2: Safety NOC
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900">Fire & Safety Department</h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Inspects building height, emergency egress stairs, fire extinguisher layouts, water tank reserves, and fire tender driveway access.
              </p>
              <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-700">
                  <span className="font-semibold">Checker Role:</span>
                  <span className="text-slate-500">Fire plan scrutiny & Hold checks</span>
                </div>
                <div className="flex items-center justify-between text-slate-700">
                  <span className="font-semibold">Approver Role:</span>
                  <span className="text-slate-500">Fire NOC approval/decline</span>
                </div>
              </div>
            </div>

            {/* Step 3: Environment */}
            <div className="relative rounded-2xl bg-white p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 font-bold text-lg">
                  3
                </span>
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
                  Stage 3: Eco Clearance
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900">Environment Department</h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Reviews sewage treatment provisions, rainwater harvesting capacity, solid waste disposal plans, and green cover percentage.
              </p>
              <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-700">
                  <span className="font-semibold">Checker Role:</span>
                  <span className="text-slate-500">Pollution board checklist verification</span>
                </div>
                <div className="flex items-center justify-between text-slate-700">
                  <span className="font-semibold">Approver Role:</span>
                  <span className="text-emerald-700 font-bold">Issues FINAL APPROVAL</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Capabilities / Features (FSD Section 12-25) */}
      <section id="features" className="py-16 bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-xs font-bold uppercase tracking-widest text-blue-600">Enterprise Feature Matrix</h2>
            <p className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Engineered for Absolute Transparency
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-6">
              <div className="text-2xl mb-3">📁</div>
              <h4 className="font-bold text-slate-900 text-base">Mandatory Document Verification</h4>
              <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                System prevents submission until Title Deeds, Site Plans, Building Plans, and Applicant ID proofs are uploaded with type and size checks.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-6">
              <div className="text-2xl mb-3">🔄</div>
              <h4 className="font-bold text-slate-900 text-base">Send-Back & Correction Loop</h4>
              <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                Officers cannot reject arbitrarily. Mandatory remarks specify the exact deficiency so applicants can rectify and resubmit immediately.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-6">
              <div className="text-2xl mb-3">⏸️</div>
              <h4 className="font-bold text-slate-900 text-base">Hold & Resume Mechanism</h4>
              <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                When external clarifications are pending (e.g. land boundary litigation check), the application is placed on Hold with transparent status.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-6">
              <div className="text-2xl mb-3">📜</div>
              <h4 className="font-bold text-slate-900 text-base">Complete Audit Trail</h4>
              <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                Every login, scrutiny, send-back, forward, and approval is recorded with officer designation, timestamp, and immutable comments.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-6">
              <div className="text-2xl mb-3">🛡️</div>
              <h4 className="font-bold text-slate-900 text-base">Citizen Privacy Protection</h4>
              <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                Citizens can track progress milestones without exposing sensitive personal ID proofs, internal officer discussions, or proprietary drawings.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-6">
              <div className="text-2xl mb-3">🏢</div>
              <h4 className="font-bold text-slate-900 text-base">Public Interest Expression</h4>
              <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                Citizens interested in residential or commercial units can register interest for approved and scrutinized projects directly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Recommended Hackathon Demonstration Scenario (FSD Section 48) */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="rounded-full bg-blue-500/20 px-3 py-1 text-xs font-semibold text-blue-300 ring-1 ring-blue-400/30">
              Demo Walkthrough
            </span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
              The 10-Step Hackathon Acceptance Journey
            </h2>
            <p className="mt-2 text-sm text-slate-300">
              Designed specifically to showcase the entire lifecycle to evaluators and judges.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 text-xs">
            <div className="rounded-xl bg-slate-800/80 border border-slate-700 p-4">
              <div className="text-blue-400 font-bold mb-1">Step 1 — Submit</div>
              <p className="text-slate-300">Applicant fills 5-step form, uploads plans, and generates <code>BP-2026-000001</code>.</p>
            </div>
            <div className="rounded-xl bg-slate-800/80 border border-slate-700 p-4">
              <div className="text-amber-400 font-bold mb-1">Step 2 — Send Back</div>
              <p className="text-slate-300">Planning Checker flags missing setback drawing with mandatory remarks.</p>
            </div>
            <div className="rounded-xl bg-slate-800/80 border border-slate-700 p-4">
              <div className="text-cyan-400 font-bold mb-1">Step 3 — Resubmit</div>
              <p className="text-slate-300">Applicant uploads corrected drawing and resubmits to Planning Checker queue.</p>
            </div>
            <div className="rounded-xl bg-slate-800/80 border border-slate-700 p-4">
              <div className="text-emerald-400 font-bold mb-1">Step 4 — Planning Pass</div>
              <p className="text-slate-300">Planning Approver approves. File automatically moves to Fire & Safety.</p>
            </div>
            <div className="rounded-xl bg-slate-800/80 border border-slate-700 p-4">
              <div className="text-purple-400 font-bold mb-1">Step 5 — Final Clear</div>
              <p className="text-slate-300">Fire and Environment approve sequentially. Final permit issued and public tracker updated.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-12 text-slate-600 text-xs">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <img src="/logo.png" alt="LinkUp Logo" className="h-10 w-auto object-contain" />
              </div>
              <p className="text-slate-500">
                LinkUp — Cross-Departmental Service Tracking, Government of India. Building Permit Scrutiny & Approval System.
              </p>
              <div className="text-[11px] text-slate-400">
                Hackathon MVP v1.0 • Built with Next.js & Tailwind CSS
              </div>
            </div>

            <div>
              <h5 className="font-bold text-slate-900 uppercase tracking-wider mb-3">User Portals</h5>
              <ul className="space-y-2">
                <li><button onClick={() => handleOpenAuth("login")} className="hover:text-blue-600">Applicant Portal</button></li>
                <li><button onClick={() => handleOpenAuth("login")} className="hover:text-blue-600">Department Checker Screen</button></li>
                <li><button onClick={() => handleOpenAuth("login")} className="hover:text-blue-600">Department Approver Screen</button></li>
                <li><a href="#tracking" className="hover:text-blue-600">Citizen Tracking Screen</a></li>
              </ul>
            </div>

            <div>
              <h5 className="font-bold text-slate-900 uppercase tracking-wider mb-3">Departments</h5>
              <ul className="space-y-2">
                <li><span className="text-slate-700">Town Planning Department</span></li>
                <li><span className="text-slate-700">Fire & Safety Department</span></li>
                <li><span className="text-slate-700">Environment Department</span></li>
                <li><span className="text-slate-700">Municipal Nodal Secretariat</span></li>
              </ul>
            </div>

            <div>
              <h5 className="font-bold text-slate-900 uppercase tracking-wider mb-3">Hackathon Info</h5>
              <p className="text-slate-500 leading-relaxed mb-3">
                Created for the 24-Hour Hackathon Challenge: Multi-Department Service Request Tracking.
              </p>
              <button
                type="button"
                onClick={() => handleOpenAuth("login")}
                className="rounded-lg bg-slate-900 text-white px-3.5 py-2 font-semibold hover:bg-slate-800 transition-colors"
              >
                Access Portal Login
              </button>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-slate-500 gap-4">
            <div>
              © 2026 BPAMS • All Rights Reserved. Prototype demonstration for government service tracking.
            </div>
            <div className="flex gap-4">
              <a href="#about" className="hover:text-slate-900">About</a>
              <a href="#workflow" className="hover:text-slate-900">Workflow</a>
              <a href="#tracking" className="hover:text-slate-900">Tracking</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
