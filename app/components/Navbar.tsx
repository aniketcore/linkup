"use client";

import React, { useEffect, useState } from "react";
import AccessibilityModal from "./AccessibilityModal";

interface NavbarProps {
  onLoginClick?: () => void;
  onRegisterClick?: () => void;
}

interface SessionUser {
  id: string;
  email: string;
  name: string | null;
  role: "applicant" | "checker" | "approver" | "citizen" | "admin";
}

const SESSION_KEY = "linkup_session_token";
const USER_KEY = "linkup_user";

function getRoleDashboardPath(_role?: SessionUser["role"] | string) {
  return "/dashboard";
}

export default function Navbar({ onLoginClick, onRegisterClick }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [fontSize, setFontSize] = useState<"sm" | "base" | "lg">("base");
  const [language, setLanguage] = useState<"en" | "hi">("en");
  const [accessibilityOpen, setAccessibilityOpen] = useState(false);
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [user, setUser] = useState<SessionUser | null>(null);

  const changeFontSize = (size: "sm" | "base" | "lg") => {
    setFontSize(size);
    if (typeof document !== "undefined") {
      if (size === "sm") document.documentElement.style.fontSize = "14px";
      else if (size === "lg") document.documentElement.style.fontSize = "18px";
      else document.documentElement.style.fontSize = "16px";
    }
  };

  const toggleHighContrast = () => {
    const next = !isHighContrast;
    setIsHighContrast(next);
    if (typeof document !== "undefined") {
      if (next) {
        document.documentElement.classList.add("high-contrast");
      } else {
        document.documentElement.classList.remove("high-contrast");
      }
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem(USER_KEY);
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem(USER_KEY);
      }
    }

    const token = localStorage.getItem(SESSION_KEY);
    if (!token) return;

    fetch("/api/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Session invalid");
        }

        const data: any = await response.json();
        if (data?.ok && data.user) {
          const nextUser = data.user as SessionUser;
          localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
          setUser(nextUser);
        }
      })
      .catch(() => {
        localStorage.removeItem(SESSION_KEY);
        localStorage.removeItem(USER_KEY);
        setUser(null);
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
    window.location.href = "/";
  };

  return (
    <header className="w-full bg-white font-sans text-slate-800">
      {/* Accessibility Modal */}
      <AccessibilityModal
        isOpen={accessibilityOpen}
        onClose={() => setAccessibilityOpen(false)}
      />

      {/* Floating Bottom-Left Accessibility Button (GIGW Standard) */}
      <button
        type="button"
        onClick={() => setAccessibilityOpen(true)}
        className="fixed bottom-5 left-5 z-40 bg-[#003366] hover:bg-[#002244] text-white border-2 border-[#ea580c] shadow-2xl px-3.5 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-transform hover:scale-105"
        title="Accessibility Options / सुगम्यता विकल्प"
        aria-label="Open Accessibility Tools"
      >
        <span className="text-base">♿</span>
        <span className="hidden sm:inline">Accessibility / सुगम्यता</span>
      </button>

      {/* 1. Topmost Government Accessibility & Utility Bar */}
      <div className="bg-[#1c2d42] text-white text-xs border-b border-slate-700">
        <div className="mx-auto flex h-9 max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <a href="#main-content" className="hover:underline text-[11px] font-medium text-slate-200">
              Skip to Main Content
            </a>
            <span className="text-slate-500 hidden sm:inline">|</span>
            <span className="hidden sm:inline text-[11px] text-slate-300">
              भारत सरकार • Government of India
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 text-[11px]">
            {/* Screen Reader Access */}
            <button
              type="button"
              onClick={() => setAccessibilityOpen(true)}
              className="hidden md:inline-flex items-center gap-1 text-slate-300 hover:text-white"
              title="Screen Reader Guidance"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 100-6 3 3 0 000 6z" />
              </svg>
              Screen Reader
            </button>
            <span className="text-slate-500 hidden md:inline">|</span>

            {/* Quick High Contrast Switcher */}
            <button
              type="button"
              onClick={toggleHighContrast}
              className={`px-1.5 py-0.5 rounded text-[10px] font-bold border transition-colors ${
                isHighContrast
                  ? "bg-yellow-300 text-black border-yellow-400"
                  : "bg-slate-800 text-slate-200 border-slate-600 hover:text-white"
              }`}
              title="Toggle High Contrast Mode"
            >
              {isHighContrast ? "Standard" : "High Contrast"}
            </button>
            <span className="text-slate-500">|</span>

            {/* Font Resize A- A A+ */}
            <div className="flex items-center border border-slate-600 rounded bg-slate-800/80 px-1 py-0.5 space-x-1">
              <button
                type="button"
                onClick={() => changeFontSize("sm")}
                title="Decrease Font Size"
                className={`px-1 rounded text-[10px] ${fontSize === "sm" ? "bg-amber-500 text-black font-bold" : "text-slate-300 hover:text-white"}`}
              >
                A-
              </button>
              <button
                type="button"
                onClick={() => changeFontSize("base")}
                title="Normal Font Size"
                className={`px-1 rounded text-[10px] ${fontSize === "base" ? "bg-amber-500 text-black font-bold" : "text-slate-300 hover:text-white"}`}
              >
                A
              </button>
              <button
                type="button"
                onClick={() => changeFontSize("lg")}
                title="Increase Font Size"
                className={`px-1 rounded text-[10px] ${fontSize === "lg" ? "bg-amber-500 text-black font-bold" : "text-slate-300 hover:text-white"}`}
              >
                A+
              </button>
            </div>
            <span className="text-slate-500">|</span>

            {/* More Accessibility Options (UIDAI Style) */}
            <button
              type="button"
              onClick={() => setAccessibilityOpen(true)}
              className="inline-flex items-center gap-1 font-semibold text-amber-300 hover:text-amber-200 cursor-pointer"
              title="Open Accessibility Menu"
            >
              <span>♿</span>
              <span className="hidden sm:inline">More</span>
            </button>
            <span className="text-slate-500">|</span>

            {/* Language Selector */}
            <button
              type="button"
              onClick={() => setLanguage(language === "en" ? "hi" : "en")}
              className="hover:underline flex items-center gap-1 font-semibold text-amber-300"
            >
              <span className="text-[10px]">🌐</span>
              {language === "en" ? "हिन्दी (Hindi)" : "English"}
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main Official Header (Emblem + Ministry Title + Portal Name + Logo) */}
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Left: Ashoka Emblem + Ministry text */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            <img
              src="/emblem.svg"
              alt="State Emblem of India"
              className="h-16 w-auto object-contain"
            />
            <div className="flex flex-col border-l border-slate-300 pl-3">
              <span className="text-xs font-bold text-slate-800 tracking-wide">
                भारत सरकार
              </span>
              <span className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
                Government of India
              </span>
              <span className="text-xs font-bold text-blue-900 mt-0.5">
                आवासन और शहरी कार्य मंत्रालय
              </span>
              <span className="text-[11px] font-semibold text-slate-700">
                Ministry of Housing and Urban Affairs
              </span>
            </div>
          </div>

          {/* Center: Portal Name in English & Hindi */}
          <div className="text-center hidden lg:block px-4">
            <h1 className="text-lg font-extrabold text-[#003366] leading-tight">
              भवन निर्माण अनुमति प्रबंधन एवं ट्रैकिंग प्रणाली
            </h1>
            <h2 className="text-sm font-bold text-slate-800 tracking-tight">
              Building Permit Approval Management System (BPAMS)
            </h2>
            <p className="text-[11px] text-amber-800 font-semibold tracking-wide">
              राष्ट्रीय एकल खिड़की सेवा • National Single-Window Portal
            </p>
          </div>

          {/* Right: Official LinkUp Logo + Quick Portals */}
          <div className="flex items-center gap-4 shrink-0">
            <div className="flex items-center">
              <img
                src="/logo.png"
                alt="LinkUp - Cross Departmental Service Tracking"
                className="h-14 sm:h-16 w-auto object-contain"
              />
            </div>
            <div className="hidden sm:flex items-center gap-1.5 border-l border-slate-200 pl-4">
              {user ? (
                <>
                  <a
                    href={getRoleDashboardPath(user.role)}
                    className="inline-flex items-center justify-center rounded bg-[#003366] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[#002244] shadow-sm transition-colors"
                  >
                    Dashboard
                  </a>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="inline-flex items-center justify-center rounded border border-[#003366] bg-white px-3 py-1.5 text-xs font-bold text-[#003366] hover:bg-slate-50 transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={onLoginClick}
                    className="inline-flex items-center justify-center rounded bg-[#003366] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[#002244] shadow-sm transition-colors"
                  >
                    Portal Login
                  </button>
                  <button
                    type="button"
                    onClick={onRegisterClick}
                    className="inline-flex items-center justify-center rounded border border-[#003366] bg-white px-3 py-1.5 text-xs font-bold text-[#003366] hover:bg-slate-50 transition-colors"
                  >
                    New Registration
                  </button>
                </>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* 3. Primary Navigation Bar (Official Government Solid Navy Bar) */}
      <nav className="bg-[#0b3b60] border-t-2 border-[#ea580c] text-white shadow-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-2 sm:px-6 lg:px-8">
          
          {/* Main Desktop Links */}
          <div className="hidden md:flex items-center text-xs font-semibold">
            <a
              href="/"
              className="bg-[#ea580c] text-white px-4 py-3 flex items-center gap-1.5 font-bold hover:bg-[#c2410c] transition-colors"
            >
              <span>🏠</span> Home
            </a>
            <a
              href="#about"
              className="px-4 py-3 hover:bg-[#082b47] border-r border-[#164e7a] transition-colors"
            >
              About System
            </a>
            <a
              href="#workflow"
              className="px-4 py-3 hover:bg-[#082b47] border-r border-[#164e7a] transition-colors"
            >
              3-Tier Scrutiny Workflow
            </a>
            <a
              href="#departments"
              className="px-4 py-3 hover:bg-[#082b47] border-r border-[#164e7a] transition-colors"
            >
              Departments
            </a>
            <a
              href="#tracking"
              className="px-4 py-3 bg-[#082b47] text-amber-300 hover:bg-[#ea580c] hover:text-white font-bold border-r border-[#164e7a] transition-colors flex items-center gap-1.5"
            >
              <span>🔍</span> Citizen Status Inquiry
            </a>
            <a
              href="#features"
              className="px-4 py-3 hover:bg-[#082b47] border-r border-[#164e7a] transition-colors"
            >
              Key Features
            </a>
            <a
              href="#sop"
              className="px-4 py-3 hover:bg-[#082b47] transition-colors"
            >
              Standard Operating Procedure
            </a>
          </div>

          {/* Quick Search in Nav */}
            <div className="hidden sm:flex flex-col md:flex-row items-center gap-2 py-2">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const el = document.getElementById("app-search");
                  if (el) el.focus();
                }}
                className="flex items-center bg-white rounded overflow-hidden"
              >
                <input
                  type="text"
                  placeholder="Search Application..."
                  className="px-2.5 py-1 text-xs text-slate-800 outline-none w-44"
                />
                <button
                  type="submit"
                  className="bg-[#ea580c] text-white px-2.5 py-1 text-xs font-bold hover:bg-[#c2410c]"
                >
                  🔍
                </button>
              </form>
            </div>

          {/* Mobile hamburger */}
          <div className="flex md:hidden w-full items-center justify-between py-2">
            <span className="text-xs font-bold text-amber-300">LinkUp Gov Portal</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onLoginClick}
                className="rounded bg-[#ea580c] px-2.5 py-1 text-xs font-bold text-white"
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-1 rounded text-white hover:bg-slate-700"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#082b47] border-t border-[#164e7a] px-4 py-3 text-xs space-y-2">
            <a href="/" className="block py-1 hover:text-amber-300">Home</a>
            <a href="#about" className="block py-1 hover:text-amber-300">About System</a>
            <a href="#workflow" className="block py-1 hover:text-amber-300">3-Tier Scrutiny Workflow</a>
            <a href="#departments" className="block py-1 hover:text-amber-300">Departments</a>
            <a href="#tracking" className="block py-1 hover:text-amber-300">Citizen Status Inquiry</a>
            <a href="#features" className="block py-1 hover:text-amber-300">Key Features</a>
            <a href="#sop" className="block py-1 hover:text-amber-300">Standard Operating Procedure</a>
            <div className="pt-2 border-t border-[#164e7a] flex flex-col gap-2">
              {user ? (
                <>
                  <a
                    href={getRoleDashboardPath(user.role)}
                    className="w-full rounded bg-[#ea580c] py-1.5 font-bold text-white text-center"
                  >
                    Open Dashboard
                  </a>
                  <button
                    onClick={handleLogout}
                    className="w-full rounded border border-white py-1.5 font-bold text-white text-center"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={onLoginClick}
                    className="w-full rounded bg-[#ea580c] py-1.5 font-bold text-white text-center"
                  >
                    Login
                  </button>
                  <button
                    onClick={onRegisterClick}
                    className="w-full rounded border border-white py-1.5 font-bold text-white text-center"
                  >
                    Register
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* 4. Latest News / Circulars Ticker (Exact NIC / NTA / UIDAI Style) */}
      <div className="bg-[#f1f5f9] border-b border-slate-300">
        <div className="mx-auto flex max-w-7xl items-center px-3 sm:px-6 lg:px-8 py-1.5">
          <div className="bg-[#003366] text-white px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider rounded-l shrink-0 flex items-center gap-1">
            <span>📢</span>
            <span className="hidden sm:inline">LATEST NOTICES /</span> सूचनाएं
          </div>
          <div className="bg-amber-100/80 border border-amber-300 border-l-0 text-slate-800 px-3 py-1 text-xs font-medium rounded-r flex-1 overflow-hidden whitespace-nowrap">
            <div className="inline-block animate-[marquee_25s_linear_infinite] hover:[animation-play-state:paused]">
              <span className="font-bold text-blue-900">• PUBLIC CIRCULAR 2026:</span> Mandatory sequential clearances across Town Planning, Fire & Safety, and Environment departments are now enforced under Urban Bye-Laws.
              <span className="mx-4 text-slate-400">|</span>
              <span className="font-bold text-blue-900">• CITIZEN ADVISORY:</span> Real-time status inquiry is available using your Universal Application Reference Number (e.g. BP-2026-000001). Zero physical municipal visits required.
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
