"use client";

import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { signInWithGoogle, loginWithEmail } from "../lib/firebase";

const SESSION_KEY = "linkup_session_token";
const USER_KEY = "linkup_user";

function getDashboardPath(role?: string) {
  if (role === "admin") return "/dashboard/admin";
  if (role === "checker") return "/dashboard/checker";
  if (role === "approver") return "/dashboard/approver";
  return "/dashboard";
}

export default function LoginPage() {
  const [role, setRole] = useState<"applicant" | "checker" | "approver" | "citizen">("applicant");
  const [department, setDepartment] = useState("planning");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleLogin = async (e?: React.FormEvent, method: "email" | "google" = "email") => {
    if (e) e.preventDefault();
    setErrorMessage("");
    setSubmitting(true);

    try {
      let firebaseUser;
      if (method === "google") {
        firebaseUser = await signInWithGoogle();
      } else {
        if (!email || !password) {
          throw new Error("Email and Password are required.");
        }
        firebaseUser = await loginWithEmail(email, password);
      }

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: firebaseUser.uid }),
      });

      const data: any = await response.json();

      if (!response.ok || !data?.ok) {
        throw new Error(data?.error || "Authentication failed. User not registered in portal database.");
      }

      localStorage.setItem(SESSION_KEY, data.sessionToken);
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));

      const nextRole = data.user?.role || role;
      setSuccessMessage(`Authentication successful. Redirecting to ${nextRole.toUpperCase()} portal...`);

      setTimeout(() => {
        window.location.href = getDashboardPath(nextRole);
      }, 1000);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Something went wrong while signing in.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 py-10">
        <div className="w-full max-w-md bg-white border-2 border-[#003366] shadow-xl">
          {/* Official Card Header */}
          <div className="bg-[#003366] text-white px-5 py-3.5 border-b-2 border-[#ea580c] flex items-center gap-3">
            <img src="/emblem.svg" alt="Emblem" className="h-8 w-auto invert brightness-200" />
            <div>
              <h1 className="text-sm font-bold tracking-wide">
                PORTAL LOGIN / पोर्टल लॉगिन
              </h1>
              <p className="text-[10px] text-amber-200">
                Building Permit Approval Management System (BPAMS)
              </p>
            </div>
          </div>

          <div className="p-6 text-xs text-slate-800 space-y-4">
            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-300 text-red-800 rounded text-xs font-medium">
                ⚠️ {errorMessage}
              </div>
            )}

            {successMessage && (
              <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded text-xs font-medium">
                ✔ {successMessage}
              </div>
            )}

            <form onSubmit={(e) => handleLogin(e, "email")} className="space-y-4">
              {/* Role Selection */}
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
                    🔍 Dept. Checker
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
                    ✍️ Dept. Approver
                  </button>
                </div>
              </div>

              {/* Department selection for officials */}
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
                    <option value="planning">Town Planning Department (नगर नियोजन)</option>
                    <option value="fire">Fire & Emergency Services (अग्निशमन विभाग)</option>
                    <option value="environment">Environment Board (पर्यावरण संरक्षण)</option>
                  </select>
                </div>
              )}

              {/* Email / Username */}
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Registered Email / Mobile Number *
                </label>
                <input
                  type="text"
                  required
                  placeholder="applicant@example.com or 10-digit mobile"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-slate-300 px-2.5 py-2 text-xs text-slate-900 focus:border-[#003366] focus:outline-none"
                />
              </div>

              {/* Password */}
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
                  className="w-full border border-slate-300 px-2.5 py-2 text-xs text-slate-900 focus:border-[#003366] focus:outline-none"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-1">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-[#003366] hover:bg-[#002244] py-2.5 text-xs font-bold text-white uppercase tracking-wider border border-[#002244] shadow transition-colors disabled:opacity-60 cursor-pointer"
                >
                  {submitting ? "Authenticating..." : "SECURE LOGIN / लॉगिन करें"}
                </button>
              </div>

              {/* Google Sign-in */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => handleLogin(undefined, "google")}
                  disabled={submitting}
                  className="w-full bg-white hover:bg-slate-50 border border-slate-300 py-2 text-xs font-bold text-slate-700 flex items-center justify-center gap-2 transition-colors disabled:opacity-60 cursor-pointer"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  Sign in with Google
                </button>
              </div>

              {/* Direct Link to Register Page */}
              <div className="pt-3 border-t border-slate-200 text-center text-slate-700">
                <span>Don&apos;t have an account? </span>
                <a
                  href="/register"
                  className="font-bold text-[#ea580c] hover:underline"
                >
                  Register Here for New Permit / नया पंजीकरण →
                </a>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
