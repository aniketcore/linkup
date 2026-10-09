"use client";

import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import AuthModal from "./components/AuthModal";
import HelpdeskChatbot from "./components/HelpdeskChatbot";

// Public permit records for instant verification
const SAMPLE_APPLICATIONS = [
  {
    id: "BP-2026-000001",
    project: "Skyline Green Heights",
    type: "Commercial + Residential",
    location: "Jaipur, Rajasthan (Ward 14, Zone 3)",
    applicant: "Apex Infrastructure Pvt. Ltd.",
    status: "Final Approved",
    statusBadge: "bg-emerald-700 text-white",
    submittedDate: "2026-10-01",
    lastUpdated: "08-Oct-2026 11:30 AM",
    steps: [
      { dept: "1. Submission Verification", status: "completed", date: "01-Oct-2026 10:00 AM", note: "Application intake completed. Tracking ID issued." },
      { dept: "2. Town Planning Department", status: "completed", date: "03-Oct-2026 02:15 PM", note: "Zoning & FAR standards approved by Amit (Approver)" },
      { dept: "3. Fire & Safety Department", status: "completed", date: "06-Oct-2026 04:30 PM", note: "Fire hydrant & egress NOC cleared by Vikram (Approver)" },
      { dept: "4. Environment Board", status: "completed", date: "08-Oct-2026 11:30 AM", note: "Pollution clearance granted by Dr. Verma (Approver). Final Permit Issued." },
    ],
  },
  {
    id: "BP-2026-000002",
    project: "Lotus Residency Phase II",
    type: "Residential",
    location: "Sector 22, Mansarovar",
    applicant: "Ramesh Singhania",
    status: "Under Scrutiny",
    statusBadge: "bg-[#003366] text-white",
    submittedDate: "2026-10-04",
    lastUpdated: "08-Oct-2026 09:15 AM",
    steps: [
      { dept: "1. Submission Verification", status: "completed", date: "04-Oct-2026 11:00 AM", note: "Application intake completed." },
      { dept: "2. Town Planning Department", status: "completed", date: "06-Oct-2026 03:00 PM", note: "Approved by Planning Approver. Dispatched to Fire Dept." },
      { dept: "3. Fire & Safety Department", status: "active", date: "08-Oct-2026 09:15 AM", note: "Under active scrutiny by Fire Checker Neha." },
      { dept: "4. Environment Board", status: "pending", date: "Awaiting Prior Clearance", note: "Will activate sequentially once Fire & Safety approves." },
    ],
  },
  {
    id: "BP-2026-000003",
    project: "Metro Point Retail Hub",
    type: "Commercial",
    location: "MI Road, Central Ward",
    applicant: "Metroline Realty LLP",
    status: "Sent Back",
    statusBadge: "bg-amber-600 text-white",
    submittedDate: "2026-10-07",
    lastUpdated: "08-Oct-2026 01:20 PM",
    steps: [
      { dept: "1. Submission Verification", status: "completed", date: "07-Oct-2026 04:00 PM", note: "Submitted online." },
      { dept: "2. Town Planning Department", status: "sent_back", date: "08-Oct-2026 01:20 PM", note: "Official Remarks: Site plan missing rear setback dimensions. Please re-upload revised drawing." },
      { dept: "3. Fire & Safety Department", status: "locked", date: "Locked", note: "Requires Planning clearance sign-off first." },
      { dept: "4. Environment Board", status: "locked", date: "Locked", note: "Requires Fire clearance sign-off first." },
    ],
  },
];

export default function Home() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [searchQuery, setSearchQuery] = useState("BP-2026-000001");
  const [activeSearchResult, setActiveSearchResult] = useState<any>(SAMPLE_APPLICATIONS[0]);
  const [searchError, setSearchError] = useState("");
  const [activeNoticeTab, setActiveNoticeTab] = useState<"public" | "news">("public");

  const performSearch = async (queryStr: string) => {
    const q = queryStr.trim().toUpperCase();
    if (!q) return;

    const found = SAMPLE_APPLICATIONS.find(
      (app) => app.id.toUpperCase() === q || app.project.toLowerCase().includes(q.toLowerCase())
    );

    if (found) {
      setActiveSearchResult(found);
      setSearchError("");
      return;
    }

    try {
      const res = await fetch(`/api/applications/${q}`);
      const data: any = await res.json();

      if (data.ok && data.application) {
        const app = data.application;
        const mappedResult = {
          id: app.id,
          project: app.building?.project_name || "Statutory Project",
          type: app.building?.building_type || "Commercial / Residential",
          location: `${app.building?.city || "Municipal City"} (${app.building?.ward || "Ward"}, ${app.building?.zone || "Zone"})`,
          applicant: app.applicant?.name || "Official Applicant",
          status: app.status === "approved" ? "Final Approved" : app.status === "awaiting_approval" ? "Awaiting Sign-off" : "Under Scrutiny",
          statusBadge: app.status === "approved" ? "bg-emerald-700 text-white" : "bg-[#003366] text-white",
          submittedDate: app.submission_date?.slice(0, 10) || "Recorded",
          lastUpdated: new Date(app.last_updated_date || app.created_at).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
          steps: [
            { dept: "1. Submission Verification", status: "completed", date: app.submission_date?.slice(0, 10) || "Intake Cleared", note: "Application intake completed. Tracking ID issued." },
            ...(app.departments || []).map((d: any, idx: number) => ({
              dept: `${idx + 2}. ${d.name}`,
              status: d.status === "approved" ? "completed" : d.status === "in_scrutiny" || d.status === "awaiting_approval" ? "active" : "pending",
              date: d.status === "approved" ? "NOC Cleared" : d.status === "in_scrutiny" ? "Active Scrutiny" : "Queued",
              note: d.status === "approved" ? "Clearance granted by Department Head." : d.status === "in_scrutiny" ? "Under active scrutiny by municipal officer." : "Awaiting sequential clearance.",
            })),
          ],
        };
        setActiveSearchResult(mappedResult);
        setSearchError("");
      } else {
        setSearchError(`No official permit record found for "${queryStr}". Please check the application number.`);
      }
    } catch {
      setSearchError(`Unable to query public registry for "${queryStr}". Please try again.`);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const appParam = params.get("app");
      if (appParam) {
        setSearchQuery(appParam);
        performSearch(appParam);
        const trackingEl = document.getElementById("tracking");
        if (trackingEl) {
          trackingEl.scrollIntoView({ behavior: "smooth" });
        }
      }
    }
  }, []);

  const handleOpenAuth = (mode: "login" | "register") => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(searchQuery);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col font-sans selection:bg-[#003366] selection:text-white" id="main-content">
      {/* Official Government Header & Accessibility Bar */}
      <Navbar />

      {/* Role-based Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        initialMode={authMode}
        onClose={() => setAuthModalOpen(false)}
      />

      {/* Hero Banner (Inspired by UIDAI & National Government Portal) */}
      <section className="bg-gradient-to-r from-[#003366] via-[#0b3b60] to-[#124b7a] text-white py-10 border-b-4 border-[#ea580c]">
        <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Banner Left: Portal Headline & Mandate */}
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 bg-[#ea580c] text-white px-3 py-0.5 text-[11px] font-bold uppercase tracking-wider rounded-sm shadow-sm">
                <span>🏛️</span>
                <span>Government of India • Ministry of Housing and Urban Affairs</span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight tracking-tight text-white">
                Cross-Departmental Service Request Tracking System
              </h1>
              <p className="text-sm sm:text-base text-slate-100 max-w-3xl leading-relaxed">
                A single-window, transparent digital gateway facilitating statutory building permit scrutiny and clearances across 
                <strong> Town Planning</strong>, <strong>Fire & Emergency Services</strong>, and <strong>Environment</strong> departments with end-to-end citizen visibility.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href="/register"
                  className="bg-[#ea580c] hover:bg-[#c2410c] text-white px-5 py-2.5 text-xs font-bold uppercase tracking-wider rounded shadow flex items-center gap-2 transition-all cursor-pointer"
                >
                  <span>📝</span> Apply for Building Permit / नया आवेदन
                </a>
                <a
                  href="#tracking"
                  className="bg-[#f59e0b] hover:bg-[#d97706] text-slate-950 px-5 py-2.5 text-xs font-extrabold uppercase tracking-wider rounded shadow-lg border-2 border-amber-200 flex items-center gap-2 transition-all cursor-pointer hover:scale-105"
                >
                  <span className="text-sm">🔍</span> Citizen Status Inquiry / स्थिति जांचें
                </a>
                <a
                  href="/login"
                  className="bg-[#082b47] hover:bg-[#051c30] text-amber-300 border border-amber-400/40 px-4 py-2.5 text-xs font-bold uppercase tracking-wider rounded transition-all cursor-pointer"
                >
                  <span>🔐</span> Department Officer Login / अधिकारी लॉगिन
                </a>
              </div>

              {/* Statutory Metric Strips */}
              <div className="pt-4 grid grid-cols-3 gap-3 border-t border-white/20 text-xs">
                <div>
                  <div className="text-xl font-bold text-amber-300">3 Departments</div>
                  <div className="text-[11px] text-slate-200">Unified Sequential Scrutiny</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-amber-300">100% Digital</div>
                  <div className="text-[11px] text-slate-200">Zero Physical Office Visits</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-amber-300">Audited Log</div>
                  <div className="text-[11px] text-slate-200">Mandatory Officer Remarks</div>
                </div>
              </div>
            </div>

            {/* Banner Right: Official Portal Seal / Statutory Emblem Card */}
            <div className="lg:col-span-4 hidden lg:flex flex-col items-center justify-center p-6 bg-white/10 border border-white/20 rounded shadow-inner text-center">
              <img src="/emblem.svg" alt="National Emblem" className="h-20 w-auto invert brightness-200 mb-3" />
              <div className="text-sm font-bold text-white uppercase tracking-wider">
                सत्यमेव जयते
              </div>
              <div className="text-xs font-semibold text-slate-200 mt-1">
                National Building Clearance Framework
              </div>
              <div className="mt-3 text-[11px] bg-white/20 px-3 py-1 rounded text-amber-200 font-medium">
                Compliant with Model Building Bye-Laws 2026
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Main Two-Column Government Section (Inspired by NTA / JEE Structure) */}
      <section className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 py-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Public Notices & Circulars (NTA Style) */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="border border-slate-300 bg-white rounded shadow-sm overflow-hidden h-full">
              {/* Notice Tabs */}
              <div className="flex border-b border-slate-300 bg-slate-100">
                <button
                  type="button"
                  onClick={() => setActiveNoticeTab("public")}
                  className={`flex-1 py-2.5 px-4 text-xs font-bold text-center border-b-2 transition-colors ${
                    activeNoticeTab === "public"
                      ? "border-[#003366] bg-white text-[#003366]"
                      : "border-transparent text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Public Notices (सार्वजनिक सूचनाएं)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveNoticeTab("news")}
                  className={`flex-1 py-2.5 px-4 text-xs font-bold text-center border-b-2 transition-colors ${
                    activeNoticeTab === "news"
                      ? "border-[#003366] bg-white text-[#003366]"
                      : "border-transparent text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Circulars & Orders (परिपत्र)
                </button>
              </div>

              {/* Notice List */}
              <div className="p-4 space-y-3.5 text-xs">
                {activeNoticeTab === "public" ? (
                  <>
                    <div className="border-b border-slate-200 pb-2.5">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="bg-red-700 text-white text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">NEW</span>
                        <span className="text-[11px] text-slate-500 font-semibold">08-Oct-2026</span>
                      </div>
                      <a href="#workflow" className="font-semibold text-[#003366] hover:underline block leading-snug">
                        Mandatory sequential verification enforced: Town Planning clearances must precede Fire and Environmental scrutiny.
                      </a>
                    </div>

                    <div className="border-b border-slate-200 pb-2.5">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="bg-red-700 text-white text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">NEW</span>
                        <span className="text-[11px] text-slate-500 font-semibold">06-Oct-2026</span>
                      </div>
                      <a href="#features" className="font-semibold text-[#003366] hover:underline block leading-snug">
                        Checklist of mandatory documents: Ownership Title, Site Plan, and Building Drawings for online permit filing.
                      </a>
                    </div>

                    <div className="border-b border-slate-200 pb-2.5">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[11px] text-slate-500 font-semibold">02-Oct-2026</span>
                      </div>
                      <a href="#sop" className="font-semibold text-[#003366] hover:underline block leading-snug">
                        Proactive Send-Back and Hold protocol guidelines for Department Checkers and Approvers.
                      </a>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[11px] text-slate-500 font-semibold">28-Sep-2026</span>
                      </div>
                      <a href="#tracking" className="font-semibold text-[#003366] hover:underline block leading-snug">
                        Universal Application Reference Number (BP-2026-XXXXXX) operational across all municipal zones.
                      </a>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="border-b border-slate-200 pb-2.5">
                      <span className="text-[11px] text-slate-500 font-semibold block mb-1">05-Oct-2026</span>
                      <p className="font-semibold text-slate-800 leading-snug">
                        Order No. 41/MoHUA: Strict 7-day departmental scrutiny turnaround window per officer desk.
                      </p>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-500 font-semibold block mb-1">29-Sep-2026</span>
                      <p className="font-semibold text-slate-800 leading-snug">
                        Gazette Notification: Model Building Regulations and Digital Clearances Protocol 2026.
                      </p>
                    </div>
                  </>
                )}
              </div>

              {/* View All Bar */}
              <div className="bg-slate-50 border-t border-slate-200 p-2 text-right">
                <a href="#about" className="text-[11px] font-bold text-[#003366] hover:underline">
                  Archive / All Circulars →
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Portal Introduction & Mandate */}
          <div className="lg:col-span-7 space-y-4">
            <div className="border border-slate-300 bg-white p-6 rounded shadow-sm">
              <div className="border-b-2 border-[#003366] pb-2 mb-4">
                <h2 className="text-base font-bold text-[#003366] uppercase tracking-wide">
                  INTRODUCTION / परिचय
                </h2>
                <span className="text-xs text-slate-500">
                  National Building Permit Approval Management System (BPAMS - LinkUp)
                </span>
              </div>

              <div className="space-y-3 text-xs leading-relaxed text-slate-700">
                <p>
                  The Ministry of Housing and Urban Affairs (MoHUA), Government of India has instituted the 
                  <strong> Building Permit Approval Management System (LinkUp)</strong> as an integrated, web-based single-window 
                  platform through which applicants, architectural firms, and institutions can submit building permit applications 
                  along with verified land records, structural blueprints, and statutory declarations.
                </p>
                <p>
                  Historically, building permits requiring approvals from multiple departments (such as Town Planning, Fire Safety, 
                  and Pollution/Environment Boards) resulted in disjointed manual desk movements with zero central visibility, forcing 
                  citizens into repeated municipal visits. LinkUp resolves this structural bottleneck through an automated, sequential 
                  scrutiny engine where each department acts in defined hierarchy with mandatory remarks and permanent audit trails.
                </p>
              </div>

              {/* Key Highlights Table */}
              <div className="mt-5 border border-slate-200 rounded overflow-hidden">
                <div className="bg-[#003366] text-white text-[11px] font-bold px-3 py-2">
                  System Architecture & Statutory Roles
                </div>
                <div className="divide-y divide-slate-200 text-xs">
                  <div className="p-2.5 flex items-start gap-3 bg-white">
                    <span className="font-bold text-slate-900 w-36 shrink-0">• Applicant:</span>
                    <span className="text-slate-600">Unified digital filing, mandatory document uploads, draft saving, and instant resubmission.</span>
                  </div>
                  <div className="p-2.5 flex items-start gap-3 bg-slate-50">
                    <span className="font-bold text-slate-900 w-36 shrink-0">• Department Checker:</span>
                    <span className="text-slate-600">Performs preliminary scrutiny, verifies checklists, and records Send-Back or Hold remarks.</span>
                  </div>
                  <div className="p-2.5 flex items-start gap-3 bg-white">
                    <span className="font-bold text-slate-900 w-36 shrink-0">• Department Approver:</span>
                    <span className="text-slate-600">Grants statutory departmental approval or recorded decline, advancing files to downstream nodes.</span>
                  </div>
                  <div className="p-2.5 flex items-start gap-3 bg-slate-50">
                    <span className="font-bold text-slate-900 w-36 shrink-0">• Common Citizen:</span>
                    <span className="text-slate-600">Public tracking via Application ID with privacy preservation and optional unit interest.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Citizen Status Inquiry / Tracking Section (Styled like Official Gov Inquiry Portal) */}
      <section id="tracking" className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 py-6 w-full">
        <div className="border-2 border-[#003366] bg-white rounded shadow-md overflow-hidden">
          
          {/* Header */}
          <div className="bg-[#003366] text-white px-5 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-[#ea580c]">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                <span>🔍</span> CITIZEN STATUS INQUIRY / आवेदन स्थिति जांच
              </h2>
              <p className="text-[11px] text-slate-200">
                Track real-time multi-department scrutiny progress using your Universal Reference Number
              </p>
            </div>
            <span className="text-[11px] bg-[#ea580c] text-white font-bold px-2.5 py-1 rounded-sm w-fit">
              Live National Registry
            </span>
          </div>

          <div className="p-6">
            {/* Search Input Box */}
            <form onSubmit={handleSearch} className="max-w-3xl mx-auto bg-slate-50 p-4 border border-slate-300 rounded">
              <label htmlFor="app-search" className="block text-xs font-bold text-slate-800 uppercase tracking-wide mb-1.5">
                Enter Universal Application Number / आवेदन संख्या दर्ज करें:
              </label>
              
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  id="app-search"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="e.g. BP-2026-000001"
                  className="flex-1 border border-slate-400 bg-white px-3 py-2 text-xs font-mono font-bold text-slate-900 rounded focus:border-[#003366] focus:outline-none"
                />
                <button
                  type="submit"
                  className="bg-[#ea580c] hover:bg-[#c2410c] text-white px-6 py-2 text-xs font-bold uppercase tracking-wider rounded shadow flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>🔍</span> Search Status / खोजें
                </button>
              </div>

              {/* Recent Applications Chips */}
              <div className="mt-3 flex items-center gap-2 flex-wrap text-xs">
                <span className="text-[11px] font-bold text-slate-600">Recent Applications:</span>
                {SAMPLE_APPLICATIONS.map((app) => (
                  <button
                    key={app.id}
                    type="button"
                    onClick={() => {
                      setSearchQuery(app.id);
                      setActiveSearchResult(app);
                      setSearchError("");
                    }}
                    className={`px-2 py-0.5 text-[11px] font-mono border rounded transition-colors ${
                      activeSearchResult.id === app.id
                        ? "bg-[#003366] text-white font-bold border-[#003366]"
                        : "bg-white text-slate-700 border-slate-300 hover:bg-slate-100"
                    }`}
                  >
                    {app.id}
                  </button>
                ))}
              </div>

              {searchError && (
                <div className="mt-3 p-2 bg-red-50 border border-red-300 text-red-800 text-xs font-medium rounded">
                  ⚠️ {searchError}
                </div>
              )}
            </form>

            {/* Official Status Table & Stepper Display */}
            {activeSearchResult && (
              <div className="mt-6 border border-slate-300 rounded overflow-hidden">
                {/* Application Metadata Bar */}
                <div className="bg-slate-100 p-4 border-b border-slate-300 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="font-mono font-bold text-sm text-[#003366] bg-white px-2 py-0.5 border border-slate-300 rounded">
                      {activeSearchResult.id}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 mt-1">
                      {activeSearchResult.project}
                    </h3>
                    <p className="text-slate-600 text-[11px]">
                      {activeSearchResult.location} • Category: <strong>{activeSearchResult.type}</strong>
                    </p>
                  </div>
                  <div className="flex flex-col md:items-end">
                    <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded ${activeSearchResult.statusBadge}`}>
                      {activeSearchResult.status}
                    </span>
                    <span className="text-[11px] text-slate-500 mt-1">
                      Last Updated: {activeSearchResult.lastUpdated}
                    </span>
                  </div>
                </div>

                {/* Statutory Scrutiny Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-[#0b3b60] text-white text-[11px] uppercase tracking-wider">
                        <th className="p-3 border-r border-[#164e7a]">Scrutiny Stage / Department</th>
                        <th className="p-3 border-r border-[#164e7a]">Status</th>
                        <th className="p-3 border-r border-[#164e7a]">Timestamp</th>
                        <th className="p-3">Official Recorded Remarks</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {activeSearchResult.steps.map((st: any, i: number) => (
                        <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                          <td className="p-3 font-bold text-slate-900 border-r border-slate-200">
                            {st.dept}
                          </td>
                          <td className="p-3 border-r border-slate-200">
                            {st.status === "completed" ? (
                              <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                ✔ Approved
                              </span>
                            ) : st.status === "active" ? (
                              <span className="inline-flex items-center gap-1 font-bold text-[#003366] bg-blue-50 px-2 py-0.5 rounded border border-blue-200 animate-pulse">
                                ● Under Scrutiny
                              </span>
                            ) : st.status === "sent_back" ? (
                              <span className="inline-flex items-center gap-1 font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                                ⚠ Action Required
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                                🔒 Awaiting Prior Stage
                              </span>
                            )}
                          </td>
                          <td className="p-3 text-slate-600 border-r border-slate-200 whitespace-nowrap">
                            {st.date}
                          </td>
                          <td className="p-3 text-slate-700">
                            {st.note}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="bg-slate-50 p-2.5 text-[11px] text-slate-500 border-t border-slate-200 flex items-center justify-between">
                  <span>Note: As per BR-10, sensitive applicant identity documents and internal deliberations are protected from public inquiry.</span>
                  <button onClick={() => window.print()} className="font-bold text-[#003366] hover:underline">
                    🖨️ Print Status Slip
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Problem & Solution: Background & Policy Rationale */}
      <section id="about" className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 py-8 w-full">
        <div className="border border-slate-300 bg-white rounded shadow-sm p-6">
          <div className="border-b-2 border-[#003366] pb-2 mb-6">
            <h2 className="text-base font-bold text-[#003366] uppercase tracking-wide">
              BACKGROUND & POLICY RATIONALE / पृष्ठभूमि एवं नीति
            </h2>
            <p className="text-xs text-slate-600">
              Eliminating file-movement latency across municipal jurisdictions through digital workflow governance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Conventional Process */}
            <div className="border border-red-300 bg-red-50/40 p-4 rounded">
              <div className="font-bold text-red-800 text-xs uppercase tracking-wider mb-2 flex items-center gap-1">
                <span>❌</span> Conventional Manual File Movement
              </div>
              <ul className="space-y-2 text-xs text-slate-700">
                <li className="flex items-start gap-1.5">
                  <span className="text-red-600 font-bold">•</span>
                  <span><strong>No Central Visibility:</strong> Citizens have no online tracking and are forced to visit offices repeatedly.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-red-600 font-bold">•</span>
                  <span><strong>Hidden Delays & Bottlenecks:</strong> Physical files sit on officer desks with no accountability or recorded reason.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-red-600 font-bold">•</span>
                  <span><strong>Loss of Physical Notes:</strong> Queries and objection notes are scattered across manual registers.</span>
                </li>
              </ul>
            </div>

            {/* LinkUp Digital Framework */}
            <div className="border border-[#003366] bg-blue-50/40 p-4 rounded">
              <div className="font-bold text-[#003366] text-xs uppercase tracking-wider mb-2 flex items-center gap-1">
                <span>✔</span> LinkUp Digital Single-Window Framework
              </div>
              <ul className="space-y-2 text-xs text-slate-700">
                <li className="flex items-start gap-1.5">
                  <span className="text-[#003366] font-bold">•</span>
                  <span><strong>Universal Tracking Number:</strong> Every application gets a unique ID (e.g. <code>BP-2026-000001</code>) traceable anytime.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-[#003366] font-bold">•</span>
                  <span><strong>Sequential Enforcement:</strong> Fire Department cannot act until Planning clears; Environment waits for Fire.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-[#003366] font-bold">•</span>
                  <span><strong>Send-Back & Hold Governance:</strong> Mandatory written remarks ensure applicants fix defects in minutes, not months.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* The 3 Statutory Departments (FSD Section 21 & 22) */}
      <section id="departments" className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 py-6 w-full">
        <div className="border border-slate-300 bg-white rounded shadow-sm p-6" id="workflow">
          <div className="border-b-2 border-[#003366] pb-2 mb-6">
            <h2 className="text-base font-bold text-[#003366] uppercase tracking-wide">
              3-TIER SEQUENTIAL CLEARANCE PIPELINE / विभागीय अनुमोदन प्रक्रिया
            </h2>
            <p className="text-xs text-slate-600">
              In accordance with <strong>Business Rule BR-03</strong>: A downstream department cannot process an application until the previous department has completed its approval.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Department 1 */}
            <div className="border border-slate-300 rounded overflow-hidden">
              <div className="bg-[#003366] text-white p-3 border-b-2 border-[#ea580c]">
                <div className="text-[10px] font-bold uppercase tracking-wider text-amber-300">STAGE 1 • PRIMARY CLEARANCE</div>
                <h3 className="font-bold text-xs">Town Planning Department</h3>
                <div className="text-[10px] text-slate-200">नगर नियोजन विभाग</div>
              </div>
              <div className="p-4 text-xs space-y-2.5 bg-white">
                <p className="text-slate-600">
                  Verifies land title, master plan zoning compliance, Floor Area Ratio (FAR), setbacks, and parking requirements.
                </p>
                <div className="pt-2 border-t border-slate-200 space-y-1 text-[11px]">
                  <div className="flex justify-between font-medium">
                    <span className="text-slate-800">Checker Role:</span>
                    <span className="text-slate-500">Document completeness scrutiny</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span className="text-slate-800">Approver Role:</span>
                    <span className="text-slate-500">Zoning clearance sign-off</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Department 2 */}
            <div className="border border-slate-300 rounded overflow-hidden">
              <div className="bg-[#003366] text-white p-3 border-b-2 border-[#ea580c]">
                <div className="text-[10px] font-bold uppercase tracking-wider text-amber-300">STAGE 2 • SAFETY CLEARANCE</div>
                <h3 className="font-bold text-xs">Fire & Safety Department</h3>
                <div className="text-[10px] text-slate-200">अग्निशमन एवं आपातकालीन सेवा विभाग</div>
              </div>
              <div className="p-4 text-xs space-y-2.5 bg-white">
                <p className="text-slate-600">
                  Inspects building height, emergency egress stairs, fire extinguisher layouts, water tank reserves, and fire tender driveway access.
                </p>
                <div className="pt-2 border-t border-slate-200 space-y-1 text-[11px]">
                  <div className="flex justify-between font-medium">
                    <span className="text-slate-800">Checker Role:</span>
                    <span className="text-slate-500">Fire plan scrutiny & Hold checks</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span className="text-slate-800">Approver Role:</span>
                    <span className="text-slate-500">Fire NOC approval / decline</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Department 3 */}
            <div className="border border-slate-300 rounded overflow-hidden">
              <div className="bg-[#003366] text-white p-3 border-b-2 border-[#ea580c]">
                <div className="text-[10px] font-bold uppercase tracking-wider text-amber-300">STAGE 3 • STATUTORY FINAL CLEARANCE</div>
                <h3 className="font-bold text-xs">Environment Board</h3>
                <div className="text-[10px] text-slate-200">पर्यावरण संरक्षण बोर्ड</div>
              </div>
              <div className="p-4 text-xs space-y-2.5 bg-white">
                <p className="text-slate-600">
                  Reviews sewage treatment provisions, rainwater harvesting capacity, solid waste disposal plans, and green cover percentage.
                </p>
                <div className="pt-2 border-t border-slate-200 space-y-1 text-[11px]">
                  <div className="flex justify-between font-medium">
                    <span className="text-slate-800">Checker Role:</span>
                    <span className="text-slate-500">Pollution checklist verification</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span className="text-slate-800">Approver Role:</span>
                    <span className="text-emerald-700 font-bold">Issues FINAL APPROVAL</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Enterprise Features Matrix */}
      <section id="features" className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 py-6 w-full">
        <div className="border border-slate-300 bg-white rounded shadow-sm p-6">
          <div className="border-b-2 border-[#003366] pb-2 mb-6">
            <h2 className="text-base font-bold text-[#003366] uppercase tracking-wide">
              SYSTEM CAPABILITIES & BUSINESS RULES / प्रणाली की विशेषताएं
            </h2>
            <p className="text-xs text-slate-600">
              Statutory provisions enforcing accountability, citizen privacy, and zero data loss.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 border border-slate-200 rounded bg-slate-50">
              <div className="font-bold text-[#003366] mb-1.5 flex items-center gap-1.5">
                <span>📁</span> Mandatory Document Verification
              </div>
              <p className="text-slate-600 leading-relaxed">
                System prevents submission until Title Deeds, Site Plans, Building Plans, and Applicant ID proofs are uploaded with type and size checks.
              </p>
            </div>

            <div className="p-4 border border-slate-200 rounded bg-slate-50">
              <div className="font-bold text-[#003366] mb-1.5 flex items-center gap-1.5">
                <span>🔄</span> Send-Back & Correction Loop
              </div>
              <p className="text-slate-600 leading-relaxed">
                Officers cannot reject arbitrarily. Mandatory remarks specify the exact deficiency so applicants can rectify and resubmit immediately.
              </p>
            </div>

            <div className="p-4 border border-slate-200 rounded bg-slate-50">
              <div className="font-bold text-[#003366] mb-1.5 flex items-center gap-1.5">
                <span>⏸️</span> Hold & Resume Mechanism
              </div>
              <p className="text-slate-600 leading-relaxed">
                When external clarifications are pending (e.g. land boundary litigation check), the application is placed on Hold with transparent status.
              </p>
            </div>

            <div className="p-4 border border-slate-200 rounded bg-slate-50">
              <div className="font-bold text-[#003366] mb-1.5 flex items-center gap-1.5">
                <span>📜</span> Complete Audit Trail
              </div>
              <p className="text-slate-600 leading-relaxed">
                Every login, scrutiny, send-back, forward, and approval is recorded with officer designation, timestamp, and immutable comments.
              </p>
            </div>

            <div className="p-4 border border-slate-200 rounded bg-slate-50">
              <div className="font-bold text-[#003366] mb-1.5 flex items-center gap-1.5">
                <span>🛡️</span> Citizen Privacy Protection
              </div>
              <p className="text-slate-600 leading-relaxed">
                Citizens can track progress milestones without exposing sensitive personal ID proofs, internal officer discussions, or proprietary drawings.
              </p>
            </div>

            <div className="p-4 border border-slate-200 rounded bg-slate-50">
              <div className="font-bold text-[#003366] mb-1.5 flex items-center gap-1.5">
                <span>🏢</span> Public Interest Expression
              </div>
              <p className="text-slate-600 leading-relaxed">
                Citizens interested in residential or commercial units can register interest for approved and scrutinized projects directly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Standard Operating Procedure (SOP) */}
      <section id="sop" className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 py-6 w-full">
        <div className="border border-slate-300 bg-white rounded shadow-sm p-6">
          <div className="border-b-2 border-[#003366] pb-2 mb-6">
            <h2 className="text-base font-bold text-[#003366] uppercase tracking-wide">
              STANDARD OPERATING PROCEDURE (SOP) / मानक संचालन प्रक्रिया
            </h2>
            <p className="text-xs text-slate-600">
              Statutory operating procedure guiding building permit applications from online intake to final regulatory sign-off.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
            <div className="border border-slate-300 bg-slate-50 p-3 rounded">
              <div className="bg-[#003366] text-white text-[10px] font-bold px-1.5 py-0.5 rounded w-fit mb-2">Stage 1</div>
              <div className="font-bold text-slate-900 mb-1">Intake & Submission</div>
              <p className="text-slate-600 text-[11px]">Applicant fills 5-step form, uploads plans, and generates <code>BP-2026-000001</code>.</p>
            </div>
            <div className="border border-slate-300 bg-slate-50 p-3 rounded">
              <div className="bg-amber-700 text-white text-[10px] font-bold px-1.5 py-0.5 rounded w-fit mb-2">Stage 2</div>
              <div className="font-bold text-slate-900 mb-1">Planning Scrutiny</div>
              <p className="text-slate-600 text-[11px]">Planning Checker scrutinizes blueprints; can Send Back for corrections if defects exist.</p>
            </div>
            <div className="border border-slate-300 bg-slate-50 p-3 rounded">
              <div className="bg-cyan-800 text-white text-[10px] font-bold px-1.5 py-0.5 rounded w-fit mb-2">Stage 3</div>
              <div className="font-bold text-slate-900 mb-1">Resubmission & Pass</div>
              <p className="text-slate-600 text-[11px]">Applicant rectifies drawings; Planning Approver grants primary clearance sign-off.</p>
            </div>
            <div className="border border-slate-300 bg-slate-50 p-3 rounded">
              <div className="bg-orange-700 text-white text-[10px] font-bold px-1.5 py-0.5 rounded w-fit mb-2">Stage 4</div>
              <div className="font-bold text-slate-900 mb-1">Fire NOC Scrutiny</div>
              <p className="text-slate-600 text-[11px]">Fire Checker and Approver process emergency egress plans; can place on Hold if required.</p>
            </div>
            <div className="border border-slate-300 bg-slate-50 p-3 rounded">
              <div className="bg-emerald-700 text-white text-[10px] font-bold px-1.5 py-0.5 rounded w-fit mb-2">Stage 5</div>
              <div className="font-bold text-slate-900 mb-1">Final Approval</div>
              <p className="text-slate-600 text-[11px]">Environment Approver issues final clearance. Digital permit issued with public verification.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Official Government of India Footer (NIC Style) */}
      <footer className="mt-auto bg-[#1c2d42] text-white text-xs pt-1">
        {/* Tricolor Ribbon along the top of footer */}
        <div className="grid grid-cols-3 h-1.5 w-full">
          <div className="bg-[#ff9933]"></div>
          <div className="bg-white"></div>
          <div className="bg-[#138808]"></div>
        </div>

        <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-700">
            {/* Column 1: Ministry Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <img src="/emblem.svg" alt="Emblem" className="h-12 w-auto invert brightness-200" />
                <div>
                  <div className="font-bold text-white text-xs">भारत सरकार</div>
                  <div className="text-[11px] text-slate-300">Government of India</div>
                  <div className="text-[11px] text-amber-300 font-semibold">आवासन और शहरी कार्य मंत्रालय</div>
                </div>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Building Permit Approval Management System (BPAMS - LinkUp) • A unified initiative under the Digital India urban governance mission.
              </p>
            </div>

            {/* Column 2: User Portals */}
            <div>
              <h4 className="font-bold text-amber-300 uppercase tracking-wider mb-3 text-xs border-b border-slate-700 pb-1">
                PORTALS & SERVICES
              </h4>
              <ul className="space-y-2 text-[11px] text-slate-300">
                <li><a href="/register" className="hover:text-white hover:underline">Applicant Portal Filing / पंजीकरण</a></li>
                <li><a href="/login" className="hover:text-white hover:underline">Town Planning Scrutiny Screen</a></li>
                <li><a href="/login" className="hover:text-white hover:underline">Fire & Safety Approver Screen</a></li>
                <li><a href="#tracking" className="hover:text-white hover:underline">Citizen Application Status Inquiry</a></li>
              </ul>
            </div>

            {/* Column 3: Statutory Bodies */}
            <div>
              <h4 className="font-bold text-amber-300 uppercase tracking-wider mb-3 text-xs border-b border-slate-700 pb-1">
                STATUTORY BODIES
              </h4>
              <ul className="space-y-2 text-[11px] text-slate-300">
                <li><span>Directorate of Town & Country Planning</span></li>
                <li><span>State Disaster & Fire Safety Authority</span></li>
                <li><span>State Pollution Control & Environment Board</span></li>
                <li><span>Municipal Urban Local Bodies (ULBs)</span></li>
              </ul>
            </div>

            {/* Column 4: Helpdesk */}
            <div>
              <h4 className="font-bold text-amber-300 uppercase tracking-wider mb-3 text-xs border-b border-slate-700 pb-1">
                PUBLIC HELPDESK
              </h4>
              <p className="text-[11px] text-slate-300 leading-relaxed mb-3">
                Toll-Free Grievance Helpline: <strong>1800-11-2026</strong> (Mon–Sat, 9:30 AM to 6:00 PM IST).<br />
                Email: <strong>helpdesk@linkup.gov.in</strong>
              </p>
              <a
                href="/login"
                className="inline-block rounded bg-[#ea580c] hover:bg-[#c2410c] text-white px-3 py-1.5 font-bold text-xs"
              >
                Access Official Portal / लॉगिन
              </a>
            </div>
          </div>

          {/* Bottom NIC & Policy Disclaimer Bar */}
          <div className="pt-6 flex flex-col md:flex-row items-center justify-between text-[11px] text-slate-400 gap-4">
            <div className="space-y-1 text-center md:text-left">
              <div>
                © 2026 Ministry of Housing and Urban Affairs, Government of India. All Rights Reserved.
              </div>
              <div className="text-[10px] text-slate-400">
                Portal designed, hosted and maintained by <strong>National Informatics Centre (NIC)</strong>.
              </div>
            </div>
            <div className="flex flex-wrap gap-4 text-slate-300">
              <a href="#about" className="hover:text-white hover:underline">Terms of Use</a>
              <a href="#about" className="hover:text-white hover:underline">Privacy Policy</a>
              <a href="#about" className="hover:text-white hover:underline">Hyperlinking Policy</a>
              <a href="#about" className="hover:text-white hover:underline">Accessibility Statement</a>
              <a href="#about" className="hover:text-white hover:underline">Help & FAQ</a>
            </div>
          </div>
        </div>
      </footer>

      {/* 24x7 Official Virtual Helpdesk Chatbot */}
      <HelpdeskChatbot />
    </div>
  );
}
