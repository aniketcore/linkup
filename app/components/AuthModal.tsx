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
        ? `Logged in successfully as ${role.toUpperCase()} (${role !== "applicant" && role !== "citizen" ? department : ""}). Welcome!`
        : `Registered ${name} as ${role.toUpperCase()}. You can now log in!`
    );
    setTimeout(() => {
      setSubmittedMessage("");
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-900/10">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 to-indigo-700 px-6 py-5 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-white/20 p-1.5 text-xs font-bold uppercase tracking-wider">
                BPAMS
              </span>
              <h3 className="text-lg font-bold">
                {mode === "login" ? "Portal Sign In" : "Create New Account"}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-1 text-white/80 hover:bg-white/10 hover:text-white transition-colors"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="mt-1 text-xs text-blue-100">
            {mode === "login"
              ? "Access the unified Building Permit Approval system"
              : "Register as an Applicant or Citizen to start using services"}
          </p>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {submittedMessage ? (
            <div className="rounded-lg bg-emerald-50 p-4 text-center text-sm font-medium text-emerald-800 border border-emerald-200">
              <span className="block text-2xl mb-1">✅</span>
              {submittedMessage}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Role Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Select User Role
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setRole("applicant")}
                    className={`rounded-lg border p-2.5 font-medium text-center transition-all ${
                      role === "applicant"
                        ? "border-blue-600 bg-blue-50 text-blue-700 shadow-sm"
                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    🏗️ Applicant / Firm
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole("citizen")}
                    className={`rounded-lg border p-2.5 font-medium text-center transition-all ${
                      role === "citizen"
                        ? "border-blue-600 bg-blue-50 text-blue-700 shadow-sm"
                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    👤 Common Citizen
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole("checker")}
                    className={`rounded-lg border p-2.5 font-medium text-center transition-all ${
                      role === "checker"
                        ? "border-blue-600 bg-blue-50 text-blue-700 shadow-sm"
                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    🔍 Dept. Checker
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole("approver")}
                    className={`rounded-lg border p-2.5 font-medium text-center transition-all ${
                      role === "approver"
                        ? "border-blue-600 bg-blue-50 text-blue-700 shadow-sm"
                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    ✍️ Dept. Approver
                  </button>
                </div>
              </div>

              {/* Department Selector if Checker or Approver */}
              {(role === "checker" || role === "approver") && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Designated Department
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none"
                  >
                    <option value="planning">📐 Town Planning Department</option>
                    <option value="fire">🚒 Fire & Safety Department</option>
                    <option value="environment">🌿 Environment Department</option>
                  </select>
                </div>
              )}

              {mode === "register" && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rajesh Kumar"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address / Mobile Number
                </label>
                <input
                  type="text"
                  required
                  placeholder="applicant@example.com or 9876543210"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 transition-colors"
              >
                {mode === "login" ? "Sign In to Portal" : "Complete Registration"}
              </button>

              {/* Mode switch */}
              <div className="pt-2 text-center text-xs text-slate-500">
                {mode === "login" ? (
                  <span>
                    Don&apos;t have an account?{" "}
                    <button
                      type="button"
                      onClick={() => setMode("register")}
                      className="font-semibold text-blue-600 hover:underline"
                    >
                      Register here
                    </button>
                  </span>
                ) : (
                  <span>
                    Already registered?{" "}
                    <button
                      type="button"
                      onClick={() => setMode("login")}
                      className="font-semibold text-blue-600 hover:underline"
                    >
                      Login here
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
