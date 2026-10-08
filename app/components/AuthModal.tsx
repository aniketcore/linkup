"use client";

import React, { useState } from "react";

interface AuthModalProps {
  isOpen: boolean;
  initialMode: "login" | "register";
  onClose: () => void;
}

export default function AuthModal({ isOpen, initialMode, onClose }: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const [role, setRole] = useState<"applicant" | "checker" | "approver" | "citizen">("applicant");
  const [department, setDepartment] = useState("planning");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [submittedMessage, setSubmittedMessage] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedMessage(
      mode === "login"
        ? `Authentication successful. Access granted to ${role.toUpperCase()} portal.`
        : `Applicant account for ${name} registered successfully. Please login with your credentials.`
    );
    setTimeout(() => {
      setSubmittedMessage("");
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-none">
      <div className="relative w-full max-w-lg bg-white rounded-none border-2 border-[#003366] shadow-xl">
        {/* Official Header */}
        <div className="bg-[#003366] text-white px-5 py-3.5 flex items-center justify-between border-b-2 border-[#ea580c]">
          <div className="flex items-center gap-2">
            <img src="/emblem.svg" alt="Emblem" className="h-7 w-auto invert brightness-200" />
            <div>
              <h3 className="text-sm font-bold tracking-wide">
                {mode === "login" ? "PORTAL LOGIN / पोर्टल लॉगिन" : "NEW REGISTRATION / नया पंजीकरण"}
              </h3>
              <p className="text-[10px] text-slate-200">
                Building Permit Approval Management System (BPAMS)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-amber-300 font-bold text-lg px-2"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 text-slate-800 text-xs">
          {submittedMessage ? (
            <div className="rounded border border-emerald-600 bg-emerald-50 p-4 text-center font-medium text-emerald-900">
              <span className="block text-xl mb-1">✔</span>
              {submittedMessage}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Role Selection Tabs */}
              <div>
                <label className="block font-bold text-slate-800 uppercase tracking-wide mb-1.5">
                  Select User Category / श्रेणी चुनें
                </label>
                <div className="grid grid-cols-2 gap-1.5 font-medium">
                  <button
                    type="button"
                    onClick={() => setRole("applicant")}
                    className={`border px-3 py-2 text-left transition-colors ${
                      role === "applicant"
                        ? "border-[#003366] bg-[#003366] text-white font-bold"
                        : "border-slate-300 bg-slate-50 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    🏗️ Applicant / Firm
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole("citizen")}
                    className={`border px-3 py-2 text-left transition-colors ${
                      role === "citizen"
                        ? "border-[#003366] bg-[#003366] text-white font-bold"
                        : "border-slate-300 bg-slate-50 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    👤 Common Citizen
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole("checker")}
                    className={`border px-3 py-2 text-left transition-colors ${
                      role === "checker"
                        ? "border-[#003366] bg-[#003366] text-white font-bold"
                        : "border-slate-300 bg-slate-50 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    🔍 Department Checker
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole("approver")}
                    className={`border px-3 py-2 text-left transition-colors ${
                      role === "approver"
                        ? "border-[#003366] bg-[#003366] text-white font-bold"
                        : "border-slate-300 bg-slate-50 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    ✍️ Department Approver
                  </button>
                </div>
              </div>

              {/* Department Selector */}
              {(role === "checker" || role === "approver") && (
                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Designated Department / विभाग
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-900 focus:border-[#003366] focus:outline-none"
                  >
                    <option value="planning">Town Planning Department (नगर नियोजन विभाग)</option>
                    <option value="fire">Fire & Emergency Services (अग्निशमन एवं सुरक्षा विभाग)</option>
                    <option value="environment">Environment Board (पर्यावरण संरक्षण बोर्ड)</option>
                  </select>
                </div>
              )}

              {mode === "register" && (
                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Full Name / पूरा नाम *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter full name as per identity proof"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border border-slate-300 px-2.5 py-1.5 text-xs text-slate-900 focus:border-[#003366] focus:outline-none"
                  />
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  User ID / Email / Mobile Number *
                </label>
                <input
                  type="text"
                  required
                  placeholder="applicant@example.com or 10-digit mobile"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-slate-300 px-2.5 py-1.5 text-xs text-slate-900 focus:border-[#003366] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Password / पासवर्ड *
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-slate-300 px-2.5 py-1.5 text-xs text-slate-900 focus:border-[#003366] focus:outline-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-[#003366] py-2 text-xs font-bold text-white hover:bg-[#002244] border border-[#002244] shadow-sm"
                >
                  {mode === "login" ? "SECURE LOGIN / लॉगिन करें" : "REGISTER APPLICATION ACCOUNT"}
                </button>
              </div>

              <div className="pt-2 border-t border-slate-200 text-center text-slate-600">
                {mode === "login" ? (
                  <span>
                    New User?{" "}
                    <button
                      type="button"
                      onClick={() => setMode("register")}
                      className="font-bold text-[#003366] hover:underline"
                    >
                      Register Here for New Permit
                    </button>
                  </span>
                ) : (
                  <span>
                    Already Registered?{" "}
                    <button
                      type="button"
                      onClick={() => setMode("login")}
                      className="font-bold text-[#003366] hover:underline"
                    >
                      Sign In to Account
                    </button>
                  </span>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
