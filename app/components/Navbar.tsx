"use client";

import React, { useState } from "react";

interface NavbarProps {
  onLoginClick?: () => void;
  onRegisterClick?: () => void;
}

export default function Navbar({ onLoginClick, onRegisterClick }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md transition-all">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand & Logo */}
        <div className="flex items-center gap-3">
          <a href="/" className="flex items-center gap-3 group">
            <div className="relative flex items-center transition-transform group-hover:scale-[1.02]">
              <img
                src="/logo.png"
                alt="LinkUp - Cross-Departmental Service Tracking, Government of India"
                className="h-12 sm:h-14 w-auto object-contain rounded-md"
              />
            </div>
            <div className="hidden lg:flex flex-col border-l border-slate-200 pl-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                National Portal
              </span>
              <span className="text-xs font-semibold text-slate-800">
                Building Permit Scrutiny & Approval
              </span>
            </div>
          </a>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <a href="#about" className="hover:text-blue-600 transition-colors">
            About System
          </a>
          <a href="#workflow" className="hover:text-blue-600 transition-colors">
            3-Tier Workflow
          </a>
          <a href="#departments" className="hover:text-blue-600 transition-colors">
            Departments
          </a>
          <a href="#tracking" className="hover:text-blue-600 transition-colors">
            Citizen Tracking
          </a>
          <a href="#features" className="hover:text-blue-600 transition-colors">
            Features
          </a>
        </nav>

        {/* Header Options: Login & Register */}
        <div className="hidden sm:flex items-center gap-3">
          <button
            type="button"
            onClick={onLoginClick}
            className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
          >
            Login
          </button>
          <button
            type="button"
            onClick={onRegisterClick}
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-blue-500/25 hover:bg-blue-700 active:bg-blue-800 transition-all cursor-pointer"
          >
            Register
          </button>
        </div>

        {/* Mobile menu button */}
        <div className="flex sm:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex items-center justify-center rounded-md p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:outline-none"
            aria-expanded={mobileMenuOpen}
          >
            <span className="sr-only">Open main menu</span>
            {mobileMenuOpen ? (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 shadow-lg">
          <div className="flex flex-col space-y-3 font-medium text-slate-700">
            <a
              href="#about"
              onClick={() => setMobileMenuOpen(false)}
              className="px-2 py-1.5 rounded-md hover:bg-slate-50"
            >
              About System
            </a>
            <a
              href="#workflow"
              onClick={() => setMobileMenuOpen(false)}
              className="px-2 py-1.5 rounded-md hover:bg-slate-50"
            >
              3-Tier Workflow
            </a>
            <a
              href="#departments"
              onClick={() => setMobileMenuOpen(false)}
              className="px-2 py-1.5 rounded-md hover:bg-slate-50"
            >
              Departments
            </a>
            <a
              href="#tracking"
              onClick={() => setMobileMenuOpen(false)}
              className="px-2 py-1.5 rounded-md hover:bg-slate-50"
            >
              Citizen Tracking
            </a>
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="px-2 py-1.5 rounded-md hover:bg-slate-50"
            >
              Features
            </a>
            <div className="pt-3 border-t border-slate-200 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onLoginClick?.();
                }}
                className="w-full rounded-lg border border-slate-300 py-2.5 text-center text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onRegisterClick?.();
                }}
                className="w-full rounded-lg bg-blue-600 py-2.5 text-center text-sm font-semibold text-white shadow hover:bg-blue-700"
              >
                Register
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
