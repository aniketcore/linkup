"use client";

import React, { useState } from "react";

interface NewApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplicationCreated: () => void;
  currentUser?: { id?: string; name?: string; email?: string } | null;
}

type FormState = {
  // 1. Applicant Profile
  applicant_name: string;
  applicant_type: string;
  mobile: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pin_code: string;
  id_proof_number: string;

  // 2. Firm Details
  firm_name: string;
  registration_number: string;
  firm_address: string;
  contact_person: string;
  contact_number: string;
  firm_email: string;
  gst_number: string;

  // 3. Building Details
  project_name: string;
  building_type: string;
  plot_number: string;
  building_address: string;
  building_city: string;
  ward: string;
  zone: string;
  plot_area: string;
  built_up_area: string;
  floors: string;
  units: string;
  estimated_cost: string;

  // 4. Documents
  site_plan_file: string;
  building_plan_file: string;
  ownership_proof_file: string;
  id_proof_file: string;
};

const INITIAL_FORM: FormState = {
  applicant_name: "",
  applicant_type: "Individual Owner",
  mobile: "",
  email: "",
  address: "",
  city: "",
  state: "Maharashtra",
  pin_code: "",
  id_proof_number: "",

  firm_name: "",
  registration_number: "",
  firm_address: "",
  contact_person: "",
  contact_number: "",
  firm_email: "",
  gst_number: "",

  project_name: "",
  building_type: "Commercial",
  plot_number: "",
  building_address: "",
  building_city: "",
  ward: "Ward 12",
  zone: "Zone B (Commercial)",
  plot_area: "",
  built_up_area: "",
  floors: "G+4",
  units: "12 units",
  estimated_cost: "",

  site_plan_file: "",
  building_plan_file: "",
  ownership_proof_file: "",
  id_proof_file: "",
};

const DEMO_PREFILL: FormState = {
  applicant_name: "Vikram Malhotra",
  applicant_type: "Developer / Builder",
  mobile: "+91 98201 54321",
  email: "vikram.malhotra@malhotragroup.in",
  address: "Suite 402, Nariman Point Business Centre, Marine Drive",
  city: "Mumbai",
  state: "Maharashtra",
  pin_code: "400021",
  id_proof_number: "AAAPM1234F (PAN)",

  firm_name: "Malhotra Apex Infrastructures LLP",
  registration_number: "MH-REG-2024-8841",
  firm_address: "Plot 14, BKC Complex, Bandra East, Mumbai",
  contact_person: "Rohit Deshmukh",
  contact_number: "+91 98201 54322",
  firm_email: "approvals@malhotragroup.in",
  gst_number: "27AAAPM1234F1Z5",

  project_name: "Horizon Gateway Tech Park",
  building_type: "Commercial IT Park",
  plot_number: "Plot 88-C / TPS III",
  building_address: "Andheri-Kurla Link Road, Near Metro Station",
  building_city: "Mumbai Suburban",
  ward: "Ward K-East",
  zone: "Zone 3 (Commercial Hub)",
  plot_area: "4,500 sq.m",
  built_up_area: "12,800 sq.m",
  floors: "2B + G + 12 Floors",
  units: "48 Commercial IT Suites",
  estimated_cost: "₹ 48,50,00,000",

  site_plan_file: "horizon_site_demarcation_cad.pdf",
  building_plan_file: "architectural_blueprint_v3.pdf",
  ownership_proof_file: "conveyance_deed_registered.pdf",
  id_proof_file: "director_aadhaar_pan_verified.pdf",
};

export default function NewApplicationModal({
  isOpen,
  onClose,
  onApplicationCreated,
  currentUser,
}: NewApplicationModalProps) {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [form, setForm] = useState<FormState>({
    ...INITIAL_FORM,
    applicant_name: currentUser?.name || "",
    email: currentUser?.email || "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [submissionSuccess, setSubmissionSuccess] = useState<{
    applicationNumber: string;
    isDraft: boolean;
  } | null>(null);

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAutofillDemo = () => {
    setForm({
      ...DEMO_PREFILL,
      applicant_name: currentUser?.name || DEMO_PREFILL.applicant_name,
      email: currentUser?.email || DEMO_PREFILL.email,
    });
    setErrorMessage("");
  };

  const validateStep = (step: number): boolean => {
    setErrorMessage("");
    if (step === 1) {
      if (!form.applicant_name || !form.mobile || !form.email || !form.address || !form.city || !form.id_proof_number) {
        setErrorMessage("Please complete all required Applicant Profile fields.");
        return false;
      }
    } else if (step === 2) {
      if (!form.firm_name || !form.firm_address || !form.contact_person || !form.contact_number || !form.firm_email) {
        setErrorMessage("Please complete all required Architecture & Firm details.");
        return false;
      }
    } else if (step === 3) {
      if (!form.project_name || !form.plot_number || !form.building_address || !form.building_city || !form.plot_area || !form.built_up_area || !form.estimated_cost) {
        setErrorMessage("Please complete all mandatory Building & Land specifications.");
        return false;
      }
    } else if (step === 4) {
      if (!form.site_plan_file || !form.building_plan_file || !form.ownership_proof_file || !form.id_proof_file) {
        setErrorMessage("All four mandatory statutory documents must be attached before final clearance submission.");
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 5));
    }
  };

  const handleBack = () => {
    setErrorMessage("");
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const saveApplication = async (onlyDraft: boolean) => {
    if (!onlyDraft && !validateStep(1)) return;
    if (!onlyDraft && !validateStep(2)) return;
    if (!onlyDraft && !validateStep(3)) return;
    if (!onlyDraft && !validateStep(4)) return;

    setIsSubmitting(true);
    setErrorMessage("");
    setStatusMessage("Step 1/5: Initializing official single-window permit record...");

    try {
      // 1. Create Draft Application
      const draftRes = await fetch("/api/applications/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicant_user_id: currentUser?.id || "applicant-user",
        }),
      });

      const draftData: any = await draftRes.json();
      if (!draftRes.ok || !draftData.ok) {
        throw new Error(draftData.error || "Failed to initialize permit draft.");
      }

      const appId = draftData.application.id;
      const appNumber = draftData.application.application_number;

      // 2. Patch Applicant Profile
      setStatusMessage("Step 2/5: Synchronizing verified applicant profile...");
      const applicantRes = await fetch(`/api/applications/${appId}/section/applicant`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicant_name: form.applicant_name,
          applicant_type: form.applicant_type,
          mobile: form.mobile,
          email: form.email,
          address: form.address,
          city: form.city,
          state: form.state,
          pin_code: form.pin_code,
          id_proof_number: form.id_proof_number,
        }),
      });

      if (!applicantRes.ok) {
        const err: any = await applicantRes.json();
        throw new Error(err.error || "Failed to save applicant profile.");
      }

      // 3. Patch Firm Details
      setStatusMessage("Step 3/5: Registering enterprise and architect credentials...");
      const firmRes = await fetch(`/api/applications/${appId}/section/firm`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firm_name: form.firm_name,
          registration_number: form.registration_number,
          firm_address: form.firm_address,
          contact_person: form.contact_person,
          contact_number: form.contact_number,
          email: form.firm_email,
          gst_number: form.gst_number,
        }),
      });

      if (!firmRes.ok) {
        const err: any = await firmRes.json();
        throw new Error(err.error || "Failed to save firm details.");
      }

      // 4. Patch Building Details
      setStatusMessage("Step 4/5: Registering plot and structural specifications...");
      const buildingRes = await fetch(`/api/applications/${appId}/section/building`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project_name: form.project_name,
          building_type: form.building_type,
          plot_number: form.plot_number,
          address: form.building_address,
          city: form.building_city,
          ward: form.ward,
          zone: form.zone,
          plot_area: form.plot_area,
          built_up_area: form.built_up_area,
          floors: form.floors,
          units: form.units,
          estimated_cost: form.estimated_cost,
        }),
      });

      if (!buildingRes.ok) {
        const err: any = await buildingRes.json();
        throw new Error(err.error || "Failed to save building details.");
      }

      // If document files are specified, attach them
      const docEntries = [
        { type: "site_plan", name: form.site_plan_file || "site_plan.pdf" },
        { type: "building_plan", name: form.building_plan_file || "building_plan.pdf" },
        { type: "ownership_proof", name: form.ownership_proof_file || "ownership_deed.pdf" },
        { type: "id_proof", name: form.id_proof_file || "applicant_id.pdf" },
      ];

      for (const doc of docEntries) {
        if (doc.name) {
          await fetch(`/api/applications/${appId}/documents`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              document_type: doc.type,
              file_name: doc.name,
              file_url: `/documents/${doc.name}`,
              storage_key: `r2-${appId}-${doc.type}`,
              uploaded_by: form.applicant_name || "applicant",
            }),
          });
        }
      }

      // 5. If not only draft, trigger formal Single-Window submission
      if (!onlyDraft) {
        setStatusMessage("Step 5/5: Dispatching dossier to Town Planning Department checkpoint...");
        const submitRes = await fetch(`/api/applications/${appId}/submit`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            actor_user_id: currentUser?.id || "applicant-user",
            remarks: "Standard single-window statutory submission via National Portal.",
          }),
        });

        const submitData: any = await submitRes.json();
        if (!submitRes.ok || !submitData.ok) {
          throw new Error(submitData.error || "Submission checkpoint validation failed.");
        }
      }

      setSubmissionSuccess({
        applicationNumber: appNumber,
        isDraft: onlyDraft,
      });

      onApplicationCreated();
    } catch (err: any) {
      console.error("Submission Error:", err);
      setErrorMessage(err.message || "An unexpected error occurred during permit submission.");
    } finally {
      setIsSubmitting(false);
      setStatusMessage("");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-2xl border border-slate-300 w-full max-w-4xl max-h-[92vh] flex flex-col my-auto overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Government Style Header */}
        <div className="bg-[#003366] text-white px-6 py-4 flex items-center justify-between border-b-4 border-[#ea580c] shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-white/10 p-2 rounded border border-white/20">
              <img src="/emblem.svg" alt="India Emblem" className="h-8 w-auto invert" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#ea580c]">
                Form UBPAF-01 • Unified Building Permit System
              </p>
              <h2 className="text-lg font-black uppercase tracking-tight">
                Single-Window Clearance Application
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {!submissionSuccess && (
              <button
                type="button"
                onClick={handleAutofillDemo}
                className="hidden sm:inline-flex items-center gap-1.5 rounded bg-amber-500 hover:bg-amber-600 text-slate-900 px-3 py-1.5 text-[10px] font-black uppercase tracking-wide transition-all shadow-sm"
                title="Fill with realistic verified mock data"
              >
                ⚡ Autofill Demo Data
              </button>
            )}
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="text-white/80 hover:text-white p-1 rounded hover:bg-white/10 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Success View */}
        {submissionSuccess ? (
          <div className="p-8 text-center space-y-6 overflow-y-auto">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 border-4 border-emerald-200">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <div>
              <span className="inline-block px-3 py-1 rounded text-xs font-bold uppercase tracking-widest bg-emerald-50 text-emerald-800 border border-emerald-300 mb-2">
                {submissionSuccess.isDraft ? "Draft Saved Successfully" : "Application Registered & Dispatched"}
              </span>
              <h3 className="text-2xl font-black text-[#003366] uppercase">
                {submissionSuccess.isDraft ? "Permit Draft Saved" : "Statutory Application Submitted"}
              </h3>
              <p className="text-slate-600 text-xs mt-1 max-w-lg mx-auto">
                {submissionSuccess.isDraft
                  ? "Your progress has been preserved in the system. You can review or complete it anytime from the Drafts column."
                  : "Your application has been securely logged on the National Single-Window Registry and assigned to the Town Planning Department for Initial Scrutiny."}
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-300 rounded-lg p-5 max-w-md mx-auto text-left space-y-2">
              <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                <span className="text-[11px] font-bold uppercase text-slate-500">Application Number</span>
                <span className="text-sm font-black text-[#003366] tracking-wider">{submissionSuccess.applicationNumber}</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                <span className="text-[11px] font-bold uppercase text-slate-500">Project Name</span>
                <span className="text-xs font-bold text-slate-800">{form.project_name || "Untitled Project"}</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                <span className="text-[11px] font-bold uppercase text-slate-500">Current Checkpoint</span>
                <span className="text-xs font-bold text-[#ea580c]">
                  {submissionSuccess.isDraft ? "Draft Queue (Applicant)" : "Town Planning (Checker)"}
                </span>
              </div>
              <div className="flex justify-between items-center pt-1">
                <span className="text-[11px] font-bold uppercase text-slate-500">Submission Timestamp</span>
                <span className="text-xs font-semibold text-slate-600">{new Date().toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="flex justify-center gap-3 pt-4">
              <button
                onClick={onClose}
                className="rounded bg-[#003366] hover:bg-[#002244] text-white px-6 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors shadow-md"
              >
                Return to Unified Board
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Multi-Step Stepper Bar */}
            <div className="bg-slate-100 border-b border-slate-300 px-6 py-3 flex items-center justify-between shrink-0 overflow-x-auto">
              {[
                { step: 1, label: "1. Applicant Profile" },
                { step: 2, label: "2. Firm & Architect" },
                { step: 3, label: "3. Building & Plot" },
                { step: 4, label: "4. Documents Dossier" },
                { step: 5, label: "5. Review & Submit" },
              ].map((item) => (
                <button
                  key={item.step}
                  type="button"
                  onClick={() => setCurrentStep(item.step)}
                  className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wide px-3 py-1.5 rounded transition-colors whitespace-nowrap ${
                    currentStep === item.step
                      ? "bg-[#003366] text-white shadow-sm"
                      : currentStep > item.step
                      ? "text-emerald-700 hover:bg-slate-200"
                      : "text-slate-500 hover:bg-slate-200"
                  }`}
                >
                  <span
                    className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                      currentStep === item.step
                        ? "bg-white text-[#003366]"
                        : currentStep > item.step
                        ? "bg-emerald-600 text-white"
                        : "bg-slate-300 text-slate-700"
                    }`}
                  >
                    {currentStep > item.step ? "✓" : item.step}
                  </span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>

            {/* Error & Progress Feedback */}
            {errorMessage && (
              <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-300 text-red-800 text-xs font-semibold rounded flex items-center gap-2">
                <span className="text-base">⚠️</span>
                <span>{errorMessage}</span>
              </div>
            )}

            {isSubmitting && (
              <div className="mx-6 mt-4 p-3 bg-blue-50 border border-blue-300 text-blue-900 text-xs font-bold rounded flex items-center gap-3 animate-pulse">
                <div className="h-3 w-3 rounded-full bg-blue-600 animate-ping" />
                <span>{statusMessage}</span>
              </div>
            )}

            {/* Step Form Body */}
            <div className="p-6 overflow-y-auto flex-1">
              {/* STEP 1: APPLICANT PROFILE */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div className="border-b border-slate-200 pb-2">
                    <h3 className="text-sm font-bold uppercase tracking-wide text-[#003366]">
                      Section I: Primary Applicant Identity
                    </h3>
                    <p className="text-xs text-slate-500">
                      Mandatory statutory identification as required under Municipal Building By-laws.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                        Full Legal Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="applicant_name"
                        value={form.applicant_name}
                        onChange={handleChange}
                        placeholder="e.g. Vikram Malhotra"
                        className="w-full rounded border border-slate-300 px-3 py-2 text-xs font-medium focus:border-[#003366] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                        Applicant Category <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="applicant_type"
                        value={form.applicant_type}
                        onChange={handleChange}
                        className="w-full rounded border border-slate-300 px-3 py-2 text-xs font-medium focus:border-[#003366] focus:outline-none"
                      >
                        <option value="Individual Owner">Individual Property Owner</option>
                        <option value="Developer / Builder">Developer / Real Estate Promoter</option>
                        <option value="Licensed Architect / Engineer">Licensed Architect / Consulting Engineer</option>
                        <option value="Authorized Corporate Representative">Authorized Corporate Representative</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                        Mobile Number (OTP Registered) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        name="mobile"
                        value={form.mobile}
                        onChange={handleChange}
                        placeholder="+91 98201 XXXXX"
                        className="w-full rounded border border-slate-300 px-3 py-2 text-xs font-medium focus:border-[#003366] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                        Official Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="applicant@domain.com"
                        className="w-full rounded border border-slate-300 px-3 py-2 text-xs font-medium focus:border-[#003366] focus:outline-none"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                        Permanent / Communication Postal Address <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        rows={2}
                        name="address"
                        value={form.address}
                        onChange={handleChange}
                        placeholder="Building Name, Flat/Office No, Street, Landmark"
                        className="w-full rounded border border-slate-300 px-3 py-2 text-xs font-medium focus:border-[#003366] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                        City / Municipal Corporation <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={form.city}
                        onChange={handleChange}
                        placeholder="e.g. Mumbai"
                        className="w-full rounded border border-slate-300 px-3 py-2 text-xs font-medium focus:border-[#003366] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                        State / UT <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={form.state}
                        onChange={handleChange}
                        className="w-full rounded border border-slate-300 px-3 py-2 text-xs font-medium focus:border-[#003366] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                        PIN Code <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="pin_code"
                        value={form.pin_code}
                        onChange={handleChange}
                        placeholder="e.g. 400021"
                        className="w-full rounded border border-slate-300 px-3 py-2 text-xs font-medium focus:border-[#003366] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                        Govt. Identity Proof No. (Aadhaar / PAN / Passport) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="id_proof_number"
                        value={form.id_proof_number}
                        onChange={handleChange}
                        placeholder="e.g. AAAPM1234F"
                        className="w-full rounded border border-slate-300 px-3 py-2 text-xs font-medium focus:border-[#003366] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: FIRM & ARCHITECT DETAILS */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <div className="border-b border-slate-200 pb-2">
                    <h3 className="text-sm font-bold uppercase tracking-wide text-[#003366]">
                      Section II: Engineering Firm / Developer Details
                    </h3>
                    <p className="text-xs text-slate-500">
                      Corporate developer details or licensed architect consulting practice credentials.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                        Company / Firm Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="firm_name"
                        value={form.firm_name}
                        onChange={handleChange}
                        placeholder="e.g. Malhotra Apex Infrastructures LLP"
                        className="w-full rounded border border-slate-300 px-3 py-2 text-xs font-medium focus:border-[#003366] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                        Registration / CoA License Number
                      </label>
                      <input
                        type="text"
                        name="registration_number"
                        value={form.registration_number}
                        onChange={handleChange}
                        placeholder="e.g. MH-REG-2024-8841 / CA/2018/9012"
                        className="w-full rounded border border-slate-300 px-3 py-2 text-xs font-medium focus:border-[#003366] focus:outline-none"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                        Registered Office Address <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        rows={2}
                        name="firm_address"
                        value={form.firm_address}
                        onChange={handleChange}
                        placeholder="Registered commercial address"
                        className="w-full rounded border border-slate-300 px-3 py-2 text-xs font-medium focus:border-[#003366] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                        Authorized Liaison / Contact Person <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="contact_person"
                        value={form.contact_person}
                        onChange={handleChange}
                        placeholder="e.g. Rohit Deshmukh"
                        className="w-full rounded border border-slate-300 px-3 py-2 text-xs font-medium focus:border-[#003366] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                        Direct Contact Telephone <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        name="contact_number"
                        value={form.contact_number}
                        onChange={handleChange}
                        placeholder="+91 98201 XXXXX"
                        className="w-full rounded border border-slate-300 px-3 py-2 text-xs font-medium focus:border-[#003366] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                        Corporate Communication Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="firm_email"
                        value={form.firm_email}
                        onChange={handleChange}
                        placeholder="contact@firm.com"
                        className="w-full rounded border border-slate-300 px-3 py-2 text-xs font-medium focus:border-[#003366] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                        GST Identification Number (GSTIN)
                      </label>
                      <input
                        type="text"
                        name="gst_number"
                        value={form.gst_number}
                        onChange={handleChange}
                        placeholder="27AAAPM1234F1Z5"
                        className="w-full rounded border border-slate-300 px-3 py-2 text-xs font-medium focus:border-[#003366] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: BUILDING & PLOT DETAILS */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <div className="border-b border-slate-200 pb-2">
                    <h3 className="text-sm font-bold uppercase tracking-wide text-[#003366]">
                      Section III: Plot & Building Technical Specifications
                    </h3>
                    <p className="text-xs text-slate-500">
                      Structural dimensions, zoning parameters, and estimated development cost.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                        Project / Scheme Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="project_name"
                        value={form.project_name}
                        onChange={handleChange}
                        placeholder="e.g. Horizon Gateway Tech Park"
                        className="w-full rounded border border-slate-300 px-3 py-2 text-xs font-medium focus:border-[#003366] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                        Building Classification <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="building_type"
                        value={form.building_type}
                        onChange={handleChange}
                        className="w-full rounded border border-slate-300 px-3 py-2 text-xs font-medium focus:border-[#003366] focus:outline-none"
                      >
                        <option value="Residential">Residential Group Housing</option>
                        <option value="Commercial">Commercial / Office Complex</option>
                        <option value="Industrial">Industrial & Warehousing</option>
                        <option value="Institutional">Educational / Healthcare Institutional</option>
                        <option value="Mixed Use">Mixed Use (Commercial + Residential)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                        Survey / Plot / CTS Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="plot_number"
                        value={form.plot_number}
                        onChange={handleChange}
                        placeholder="e.g. Plot 88-C / TPS III"
                        className="w-full rounded border border-slate-300 px-3 py-2 text-xs font-medium focus:border-[#003366] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                        City / Revenue Jurisdiction <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="building_city"
                        value={form.building_city}
                        onChange={handleChange}
                        placeholder="e.g. Mumbai Suburban"
                        className="w-full rounded border border-slate-300 px-3 py-2 text-xs font-medium focus:border-[#003366] focus:outline-none"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                        Site Location Address <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        rows={2}
                        name="building_address"
                        value={form.building_address}
                        onChange={handleChange}
                        placeholder="Site location road, ward details and landmark"
                        className="w-full rounded border border-slate-300 px-3 py-2 text-xs font-medium focus:border-[#003366] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                        Municipal Ward <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="ward"
                        value={form.ward}
                        onChange={handleChange}
                        placeholder="e.g. Ward K-East"
                        className="w-full rounded border border-slate-300 px-3 py-2 text-xs font-medium focus:border-[#003366] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                        Town Planning Zone <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="zone"
                        value={form.zone}
                        onChange={handleChange}
                        placeholder="e.g. Zone 3 (Commercial Hub)"
                        className="w-full rounded border border-slate-300 px-3 py-2 text-xs font-medium focus:border-[#003366] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                        Gross Plot Area <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="plot_area"
                        value={form.plot_area}
                        onChange={handleChange}
                        placeholder="e.g. 4,500 sq.m"
                        className="w-full rounded border border-slate-300 px-3 py-2 text-xs font-medium focus:border-[#003366] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                        Proposed Total Built-Up Area <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="built_up_area"
                        value={form.built_up_area}
                        onChange={handleChange}
                        placeholder="e.g. 12,800 sq.m"
                        className="w-full rounded border border-slate-300 px-3 py-2 text-xs font-medium focus:border-[#003366] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                        Height / Number of Floors <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="floors"
                        value={form.floors}
                        onChange={handleChange}
                        placeholder="e.g. 2B + G + 12 Floors"
                        className="w-full rounded border border-slate-300 px-3 py-2 text-xs font-medium focus:border-[#003366] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                        Total Number of Units <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="units"
                        value={form.units}
                        onChange={handleChange}
                        placeholder="e.g. 48 Commercial Units"
                        className="w-full rounded border border-slate-300 px-3 py-2 text-xs font-medium focus:border-[#003366] focus:outline-none"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                        Estimated Capital Project Cost (INR) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="estimated_cost"
                        value={form.estimated_cost}
                        onChange={handleChange}
                        placeholder="e.g. ₹ 48,50,00,000"
                        className="w-full rounded border border-slate-300 px-3 py-2 text-xs font-medium focus:border-[#003366] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: MANDATORY STATUTORY DOCUMENTS */}
              {currentStep === 4 && (
                <div className="space-y-4">
                  <div className="border-b border-slate-200 pb-2">
                    <h3 className="text-sm font-bold uppercase tracking-wide text-[#003366]">
                      Section IV: Mandatory Document Dossier
                    </h3>
                    <p className="text-xs text-slate-500">
                      All four statutory attachments are digitally cross-verified across Town Planning, Fire Safety, and Revenue checkpoints.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {[
                      {
                        key: "site_plan_file" as const,
                        title: "1. Demarcated Site / Cadastral Plan (site_plan)",
                        desc: "Approved revenue layout or cadastral land boundary map showing road setbacks.",
                        defaultName: "horizon_site_demarcation_cad.pdf",
                      },
                      {
                        key: "building_plan_file" as const,
                        title: "2. Architectural Blueprint & Elevation (building_plan)",
                        desc: "Detailed architectural drawings, cross-sections, and structural elevation schematics.",
                        defaultName: "architectural_blueprint_v3.pdf",
                      },
                      {
                        key: "ownership_proof_file" as const,
                        title: "3. Land Title Deed / 7/12 Extract (ownership_proof)",
                        desc: "Registered conveyance deed, 7/12 extract or encumbrance-free title certificate.",
                        defaultName: "conveyance_deed_registered.pdf",
                      },
                      {
                        key: "id_proof_file" as const,
                        title: "4. Government Identity Dossier (id_proof)",
                        desc: "Authenticated government photo identity proof of the primary applicant or director.",
                        defaultName: "director_aadhaar_pan_verified.pdf",
                      },
                    ].map((doc) => {
                      const isAttached = Boolean(form[doc.key]);
                      return (
                        <div
                          key={doc.key}
                          className={`p-3.5 rounded border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                            isAttached ? "bg-emerald-50/60 border-emerald-300" : "bg-slate-50 border-slate-300"
                          }`}
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-slate-900 uppercase">{doc.title}</span>
                              {isAttached && (
                                <span className="bg-emerald-100 text-emerald-800 text-[9px] font-bold px-1.5 py-0.5 rounded border border-emerald-300">
                                  ✓ Attached
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500 mt-0.5">{doc.desc}</p>
                            {isAttached && (
                              <p className="text-[11px] font-mono text-emerald-700 mt-1 font-semibold">
                                📎 {form[doc.key]}
                              </p>
                            )}
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {isAttached ? (
                              <button
                                type="button"
                                onClick={() => setForm((prev) => ({ ...prev, [doc.key]: "" }))}
                                className="text-[10px] font-bold uppercase text-red-600 hover:text-red-800 px-2 py-1 rounded border border-red-200 bg-white"
                              >
                                Remove
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setForm((prev) => ({ ...prev, [doc.key]: doc.defaultName }))}
                                className="text-[10px] font-bold uppercase bg-[#003366] hover:bg-[#002244] text-white px-3 py-1.5 rounded transition-colors shadow-sm"
                              >
                                + Attach File
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 5: REVIEW & DECLARATION */}
              {currentStep === 5 && (
                <div className="space-y-5">
                  <div className="border-b border-slate-200 pb-2">
                    <h3 className="text-sm font-bold uppercase tracking-wide text-[#003366]">
                      Section V: Dossier Summary & Statutory Declaration
                    </h3>
                    <p className="text-xs text-slate-500">
                      Review all consolidated details before formal dispatch to the single-window scrutiny committee.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-slate-50 border border-slate-300 p-3 rounded space-y-1.5">
                      <span className="text-[10px] font-black uppercase text-[#003366] tracking-wider block">
                        👤 Primary Applicant
                      </span>
                      <p className="text-xs font-bold text-slate-800">{form.applicant_name || "—"}</p>
                      <p className="text-[11px] text-slate-600">{form.applicant_type}</p>
                      <p className="text-[11px] text-slate-600">{form.mobile}</p>
                      <p className="text-[11px] text-slate-600 truncate">{form.email}</p>
                    </div>

                    <div className="bg-slate-50 border border-slate-300 p-3 rounded space-y-1.5">
                      <span className="text-[10px] font-black uppercase text-[#003366] tracking-wider block">
                        🏢 Developer / Firm
                      </span>
                      <p className="text-xs font-bold text-slate-800">{form.firm_name || "—"}</p>
                      <p className="text-[11px] text-slate-600">{form.contact_person}</p>
                      <p className="text-[11px] text-slate-600">{form.contact_number}</p>
                      <p className="text-[11px] text-slate-600 truncate">{form.gst_number || "No GST"}</p>
                    </div>

                    <div className="bg-slate-50 border border-slate-300 p-3 rounded space-y-1.5">
                      <span className="text-[10px] font-black uppercase text-[#003366] tracking-wider block">
                        🏗️ Project Specs
                      </span>
                      <p className="text-xs font-bold text-slate-800">{form.project_name || "—"}</p>
                      <p className="text-[11px] text-slate-600">{form.building_type} • {form.floors}</p>
                      <p className="text-[11px] text-slate-600">Built-Up: {form.built_up_area}</p>
                      <p className="text-[11px] font-bold text-[#ea580c]">{form.estimated_cost}</p>
                    </div>
                  </div>

                  <div className="bg-amber-50 border border-amber-300 rounded p-4 text-xs text-amber-900 space-y-2">
                    <div className="flex items-start gap-2">
                      <input
                        type="checkbox"
                        id="statutory_declaration"
                        defaultChecked
                        className="mt-0.5 rounded border-amber-400 text-[#003366] focus:ring-[#003366] accent-[#003366]"
                      />
                      <label htmlFor="statutory_declaration" className="text-[11px] leading-relaxed cursor-pointer font-medium">
                        <strong>Statutory Declaration:</strong> I hereby solemnly affirm that the site measurements, architectural plans, ownership titles, and personal credentials submitted herein are authentic and strictly comply with the National Building Code (NBC 2016) and applicable Municipal Corporation regulations. Any false declaration shall attract cancellation and penal action under the Act.
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Bottom Actions */}
            <div className="bg-slate-50 border-t border-slate-300 px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={handleBack}
                    disabled={isSubmitting}
                    className="rounded border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 px-4 py-2 text-xs font-bold uppercase tracking-wide transition-colors"
                  >
                    ← Back
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => saveApplication(true)}
                  disabled={isSubmitting}
                  className="rounded border border-slate-400 hover:bg-slate-200 text-slate-800 px-4 py-2 text-xs font-bold uppercase tracking-wide transition-colors"
                  title="Preserve progress in Drafts column without triggering scrutiny review"
                >
                  💾 Save as Draft
                </button>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                {currentStep < 5 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={isSubmitting}
                    className="rounded bg-[#003366] hover:bg-[#002244] text-white px-5 py-2 text-xs font-bold uppercase tracking-wide transition-colors shadow-sm"
                  >
                    Proceed to Step {currentStep + 1} →
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => saveApplication(false)}
                    disabled={isSubmitting}
                    className="rounded bg-[#ea580c] hover:bg-[#c2410c] text-white px-6 py-2.5 text-xs font-black uppercase tracking-wider transition-colors shadow-md border border-[#c2410c]"
                  >
                    {isSubmitting ? "Dispatching Dossier..." : "🚀 Submit for Clearance"}
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
