"use client";

import React, { useState, useEffect } from "react";

interface AccessibilityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AccessibilityModal({ isOpen, onClose }: AccessibilityModalProps) {
  const [fontSize, setFontSize] = useState<"sm" | "base" | "lg" | "xl">("base");
  const [contrast, setContrast] = useState<"normal" | "high" | "inverted" | "grayscale">("normal");
  const [highlightLinks, setHighlightLinks] = useState(false);
  const [dyslexiaFont, setDyslexiaFont] = useState(false);
  const [largeCursor, setLargeCursor] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Apply font size
  const applyFontSize = (size: "sm" | "base" | "lg" | "xl") => {
    setFontSize(size);
    if (typeof document !== "undefined") {
      if (size === "sm") document.documentElement.style.fontSize = "14px";
      else if (size === "lg") document.documentElement.style.fontSize = "18px";
      else if (size === "xl") document.documentElement.style.fontSize = "20px";
      else document.documentElement.style.fontSize = "16px";
    }
  };

  // Apply contrast mode
  const applyContrast = (mode: "normal" | "high" | "inverted" | "grayscale") => {
    setContrast(mode);
    if (typeof document !== "undefined") {
      const root = document.documentElement.classList;
      root.remove("high-contrast", "inverted-contrast", "grayscale-mode");
      if (mode === "high") root.add("high-contrast");
      else if (mode === "inverted") root.add("inverted-contrast");
      else if (mode === "grayscale") root.add("grayscale-mode");
    }
  };

  // Apply highlight links
  const toggleHighlightLinks = () => {
    const next = !highlightLinks;
    setHighlightLinks(next);
    if (typeof document !== "undefined") {
      if (next) document.documentElement.classList.add("highlight-links");
      else document.documentElement.classList.remove("highlight-links");
    }
  };

  // Apply dyslexia readable font
  const toggleDyslexiaFont = () => {
    const next = !dyslexiaFont;
    setDyslexiaFont(next);
    if (typeof document !== "undefined") {
      if (next) document.documentElement.classList.add("dyslexia-font");
      else document.documentElement.classList.remove("dyslexia-font");
    }
  };

  // Apply large cursor
  const toggleLargeCursor = () => {
    const next = !largeCursor;
    setLargeCursor(next);
    if (typeof document !== "undefined") {
      if (next) document.documentElement.classList.add("large-cursor");
      else document.documentElement.classList.remove("large-cursor");
    }
  };

  // Text-to-Speech preview
  const handleTextToSpeech = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      alert("Text-to-speech is not supported by your browser.");
      return;
    }
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const textToRead = "Welcome to LinkUp, the official Building Permit Approval Management System, Government of India. This single-window portal facilitates sequential building scrutiny across Town Planning, Fire and Safety, and Environment departments.";
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.rate = 0.95;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  // Reset all
  const resetAll = () => {
    applyFontSize("base");
    applyContrast("normal");
    setHighlightLinks(false);
    setDyslexiaFont(false);
    setLargeCursor(false);
    if (typeof document !== "undefined") {
      document.documentElement.classList.remove(
        "high-contrast",
        "inverted-contrast",
        "grayscale-mode",
        "highlight-links",
        "dyslexia-font",
        "large-cursor"
      );
      document.documentElement.style.fontSize = "16px";
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-none" role="dialog" aria-modal="true" aria-labelledby="accessibility-title">
      <div className="relative w-full max-w-xl bg-white border-2 border-[#003366] shadow-2xl">
        {/* Header */}
        <div className="bg-[#003366] text-white px-5 py-3 flex items-center justify-between border-b-2 border-[#ea580c]">
          <div className="flex items-center gap-2">
            <span className="text-xl">♿</span>
            <div>
              <h2 id="accessibility-title" className="text-sm font-bold tracking-wide">
                ACCESSIBILITY OPTIONS / सुगम्यता विकल्प
              </h2>
              <p className="text-[10px] text-slate-200">
                Guidelines for Indian Government Websites (GIGW) Compliant Tools
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-amber-300 font-bold text-lg px-2"
            aria-label="Close accessibility options"
          >
            ✕
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 text-xs text-slate-800 space-y-5 max-h-[80vh] overflow-y-auto">
          
          {/* 1. Text Sizing */}
          <div className="border border-slate-200 p-3.5 bg-slate-50 rounded">
            <label className="block font-bold text-slate-900 mb-2 uppercase tracking-wide">
              1. Text Size / अक्षर का आकार
            </label>
            <div className="grid grid-cols-4 gap-2 text-center">
              <button
                type="button"
                onClick={() => applyFontSize("sm")}
                className={`py-2 border font-bold rounded transition-colors ${
                  fontSize === "sm" ? "bg-[#003366] text-white border-[#003366]" : "bg-white text-slate-700 border-slate-300 hover:bg-slate-100"
                }`}
              >
                A- (Small 14px)
              </button>
              <button
                type="button"
                onClick={() => applyFontSize("base")}
                className={`py-2 border font-bold rounded transition-colors ${
                  fontSize === "base" ? "bg-[#003366] text-white border-[#003366]" : "bg-white text-slate-700 border-slate-300 hover:bg-slate-100"
                }`}
              >
                A (Standard 16px)
              </button>
              <button
                type="button"
                onClick={() => applyFontSize("lg")}
                className={`py-2 border font-bold rounded transition-colors ${
                  fontSize === "lg" ? "bg-[#003366] text-white border-[#003366]" : "bg-white text-slate-700 border-slate-300 hover:bg-slate-100"
                }`}
              >
                A+ (Large 18px)
              </button>
              <button
                type="button"
                onClick={() => applyFontSize("xl")}
                className={`py-2 border font-bold rounded transition-colors ${
                  fontSize === "xl" ? "bg-[#003366] text-white border-[#003366]" : "bg-white text-slate-700 border-slate-300 hover:bg-slate-100"
                }`}
              >
                A++ (Extra 20px)
              </button>
            </div>
          </div>

          {/* 2. Color & Contrast Mode */}
          <div className="border border-slate-200 p-3.5 bg-slate-50 rounded">
            <label className="block font-bold text-slate-900 mb-2 uppercase tracking-wide">
              2. Contrast & Color Mode / कंट्रास्ट मोड
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => applyContrast("normal")}
                className={`p-2 border rounded font-semibold text-center ${
                  contrast === "normal" ? "border-[#003366] bg-[#003366] text-white" : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
                }`}
              >
                ⚪ Standard Colors
              </button>
              <button
                type="button"
                onClick={() => applyContrast("high")}
                className={`p-2 border rounded font-semibold text-center ${
                  contrast === "high" ? "border-amber-400 bg-black text-yellow-300" : "border-slate-300 bg-black text-yellow-300"
                }`}
              >
                ⚫ High Contrast
              </button>
              <button
                type="button"
                onClick={() => applyContrast("inverted")}
                className={`p-2 border rounded font-semibold text-center ${
                  contrast === "inverted" ? "border-[#003366] bg-[#003366] text-white" : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
                }`}
              >
                🔄 Inverted Theme
              </button>
              <button
                type="button"
                onClick={() => applyContrast("grayscale")}
                className={`p-2 border rounded font-semibold text-center ${
                  contrast === "grayscale" ? "border-slate-600 bg-slate-700 text-white" : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
                }`}
              >
                🔘 Monochrome
              </button>
            </div>
          </div>

          {/* 3. Visual & Reading Assistance */}
          <div className="border border-slate-200 p-3.5 bg-slate-50 rounded space-y-2.5">
            <label className="block font-bold text-slate-900 uppercase tracking-wide">
              3. Visual & Reading Assistance / दृश्य एवं पठन सहायता
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={toggleHighlightLinks}
                className={`p-2 border rounded text-left font-semibold transition-colors ${
                  highlightLinks ? "bg-amber-100 border-amber-500 text-amber-900" : "bg-white border-slate-300 text-slate-700 hover:bg-slate-100"
                }`}
              >
                🔗 {highlightLinks ? "Links Highlighted (ON)" : "Highlight All Links"}
              </button>
              <button
                type="button"
                onClick={toggleDyslexiaFont}
                className={`p-2 border rounded text-left font-semibold transition-colors ${
                  dyslexiaFont ? "bg-amber-100 border-amber-500 text-amber-900" : "bg-white border-slate-300 text-slate-700 hover:bg-slate-100"
                }`}
              >
                📖 {dyslexiaFont ? "Readable Font (ON)" : "Dyslexia-Friendly Font"}
              </button>
              <button
                type="button"
                onClick={toggleLargeCursor}
                className={`p-2 border rounded text-left font-semibold transition-colors ${
                  largeCursor ? "bg-amber-100 border-amber-500 text-amber-900" : "bg-white border-slate-300 text-slate-700 hover:bg-slate-100"
                }`}
              >
                🖱️ {largeCursor ? "Large Pointer (ON)" : "Large Mouse Cursor"}
              </button>
            </div>
          </div>

          {/* 4. Text-To-Speech (Speech Synthesis) */}
          <div className="border border-slate-200 p-3.5 bg-slate-50 rounded flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <span className="font-bold text-slate-900 block">🔊 Speech Synthesis / टेक्स्ट-टू-स्पीच</span>
              <span className="text-[11px] text-slate-600">Listen to an audio walkthrough of this portal&apos;s objective and services.</span>
            </div>
            <button
              type="button"
              onClick={handleTextToSpeech}
              className={`px-4 py-2 border font-bold rounded text-xs shrink-0 flex items-center gap-1.5 ${
                isSpeaking ? "bg-red-600 text-white border-red-700 animate-pulse" : "bg-[#003366] text-white border-[#003366] hover:bg-[#002244]"
              }`}
            >
              {isSpeaking ? "⏹️ Stop Speaking" : "▶️ Read Aloud Summary"}
            </button>
          </div>

          {/* 5. Screen Reader Compatibility Guidance */}
          <div className="p-3 border border-blue-200 bg-blue-50 text-slate-700 rounded text-[11px] space-y-1">
            <span className="font-bold text-[#003366] block">🎧 Screen Reader Accessibility Information:</span>
            <p>
              This website complies with World Wide Web Consortium (W3C) Web Content Accessibility Guidelines (WCAG) 2.0 Level AA. 
              Users with visual impairments can access this site using assistive technologies like <strong>NVDA</strong>, <strong>JAWS</strong>, <strong>Windows Narrator</strong>, or <strong>VoiceOver</strong>.
            </p>
            <p className="text-slate-600 pt-1">
              <strong>Keyboard Navigation:</strong> Press <code>Tab</code> to cycle through interactive elements; Press <code>Enter</code> to activate; Press <code>Esc</code> to dismiss popups.
            </p>
          </div>

          {/* Actions: Reset & Close */}
          <div className="pt-3 border-t border-slate-300 flex items-center justify-between">
            <button
              type="button"
              onClick={resetAll}
              className="text-red-700 font-bold hover:underline flex items-center gap-1 text-xs"
            >
              🔄 Reset to Default Settings
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-[#003366] text-white px-5 py-2 font-bold hover:bg-[#002244] rounded text-xs"
            >
              Apply & Close / बंद करें
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
