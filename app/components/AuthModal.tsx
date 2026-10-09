"use client";

import React, { useState } from "react";
import { signInWithGoogle, loginWithEmail, registerWithEmail } from "../lib/firebase";

interface AuthModalProps {
  isOpen: boolean;
  initialMode: "login" | "register";
  onClose: () => void;
}

const SESSION_KEY = "linkup_session_token";
const USER_KEY = "linkup_user";

function getDashboardPath(_role?: string) {
  return "/dashboard";
}

export default function AuthModal({ isOpen, initialMode, onClose }: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "register">(initialMode);

  // Synchronize mode whenever initialMode changes or modal opens
  React.useEffect(() => {
    setMode(initialMode);
    setErrorMessage("");
    setSubmittedMessage("");
  }, [initialMode, isOpen]);
  const [role, setRole] = useState<"applicant" | "checker" | "approver" | "citizen">("applicant");
  const [department, setDepartment] = useState("planning");
  const [submittedMessage, setSubmittedMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e?: React.FormEvent, method: "email" | "google" = "email") => {
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
        if (mode === "login") {
          firebaseUser = await loginWithEmail(email, password);
        } else {
          firebaseUser = await registerWithEmail(email, password);
        }
      }
      
      const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register";
      const payload =
        mode === "login"
          ? { uid: firebaseUser.uid }
          : {
              uid: firebaseUser.uid,
              name: firebaseUser.displayName || "Unknown User",
              email: firebaseUser.email || "",
              role,
              department_id: department === "planning" ? 1 : department === "fire" ? 2 : 3,
            };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data: any = await response.json();

      if (!response.ok || !data?.ok) {
        throw new Error(data?.error || "Authentication failed.");
      }

      localStorage.setItem(SESSION_KEY, data.sessionToken);
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));

      const nextRole = data.user?.role || role;
      setSubmittedMessage(
        mode === "login"
          ? `Authentication successful. Access granted to ${nextRole.toUpperCase()} portal.`
          : `Applicant account for ${data.user?.name} registered successfully. Redirecting...`
      );

      setTimeout(() => {
        setSubmittedMessage("");
        setErrorMessage("");
        onClose();
        window.location.href = getDashboardPath(nextRole);
      }, 1000);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Something went wrong while signing in."
      );
    } finally {
      setSubmitting(false);
    }
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
            <form onSubmit={(e) => handleSubmit(e, "email")} className="space-y-4">
              {/* Role Selection Tabs */}
              {mode === "register" && (
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
              )}

              {/* Department Selector */}
              {mode === "register" && (role === "checker" || role === "approver") && (
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

              {/* Email & Password Fields */}
              <div className="space-y-3 mt-4">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Email Address / ईमेल</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full border border-slate-300 px-3 py-2 text-sm focus:border-[#003366] focus:outline-none" />
                </div>
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Password / पासवर्ड</label>
                  <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full border border-slate-300 px-3 py-2 text-sm focus:border-[#003366] focus:outline-none" />
                </div>
              </div>

              {errorMessage && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {errorMessage}
                </div>
              )}

              <div className="pt-2 flex flex-col gap-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-[#ea580c] py-2.5 text-sm font-bold text-white hover:bg-[#c2410c] shadow-sm disabled:opacity-50 tracking-wide"
                >
                  {submitting ? "PROCESSING..." : mode === "login" ? "SECURE LOGIN" : "REGISTER ACCOUNT"}
                </button>
                <div className="flex items-center gap-2 my-2">
                  <div className="h-px bg-slate-300 flex-1"></div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Or</span>
                  <div className="h-px bg-slate-300 flex-1"></div>
                </div>
                <button
                  type="button"
                  onClick={(e) => handleSubmit(e, "google")}
                  disabled={submitting}
                  className="flex items-center justify-center gap-2 w-full bg-[#003366] py-2.5 text-sm font-bold text-white hover:bg-[#002244] border border-[#002244] shadow-sm disabled:cursor-not-allowed disabled:bg-slate-400 tracking-wide"
                >
                  <svg className="w-5 h-5 bg-white rounded-full p-0.5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  {submitting ? "PLEASE WAIT..." : "SIGN IN WITH GOOGLE"}
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
