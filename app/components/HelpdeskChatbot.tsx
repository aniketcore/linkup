"use client";

import React, { useState, useEffect, useRef } from "react";

interface Message {
  id: string;
  sender: "bot" | "user";
  text: string;
  steps?: string[];
  actionLink?: { label: string; href?: string; onClickAction?: string };
  options?: { label: string; key: string }[];
  timestamp: string;
}

// Structured troubleshooting steps for every stage where a user can get stuck
const STUCK_CATEGORIES: Record<
  string,
  {
    title: string;
    botResponse: string;
    steps: string[];
    action?: { label: string; href?: string; onClickAction?: string };
    followUps?: { label: string; key: string }[];
  }
> = {
  submission_error: {
    title: "1. 'Submit' button is disabled or giving error",
    botResponse: "If your permit application cannot be submitted, it is almost always due to statutory mandatory validations (BR-01 & BR-02). Follow these exact checks:",
    steps: [
      "Check Mandatory Information: Ensure Applicant Name, Mobile, Address, ID Proof Number, Project Name, Plot Number, Plot Area, and Built-up Area are filled.",
      "Check Mandatory Documents: Verify that all 3 statutory documents are uploaded: (1) Ownership/Title Deed, (2) Site Plan, and (3) Architectural Building Plan.",
      "File Size & Format: Make sure all files are in PDF, JPG, or PNG format and strictly under 10 MB each.",
      "Declaration Checkbox: Scroll to the final Review tab and check the statutory legal declaration checkbox before clicking Submit."
    ],
    action: { label: "Go to Application Filing", href: "/#tracking" },
    followUps: [
      { label: "Document upload failed / format error", key: "upload_failed" },
      { label: "How to save draft & resume later?", key: "save_draft" },
      { label: "Back to Helpdesk Menu", key: "main_menu" }
    ]
  },

  sent_back: {
    title: "2. My application status says 'Sent Back'",
    botResponse: "Do not worry! 'Sent Back' does NOT mean your permit is rejected. The Department Checker found a minor deficiency and gave you a chance to rectify it:",
    steps: [
      "Step 1 — Read Department Remarks: Check your application dashboard. The officer will have specified the exact defect (e.g. 'Rear setback dimensions missing in Site Plan').",
      "Step 2 — Rectify the Document: Ask your architect/engineer to update only the specific drawing or provide the requested clarification.",
      "Step 3 — Re-upload: Go to your application dashboard, click 'Edit / Rectify', and upload the revised file.",
      "Step 4 — Click 'Resubmit': Your file will jump straight back to that officer's scrutiny queue without starting over or paying new fees."
    ],
    action: { label: "Check Sample Sent-Back File (BP-2026-000003)", onClickAction: "track_sample_3" },
    followUps: [
      { label: "Will my processing restart from zero?", key: "restart_query" },
      { label: "How many days do I have to resubmit?", key: "resubmit_sla" },
      { label: "Back to Helpdesk Menu", key: "main_menu" }
    ]
  },

  on_hold: {
    title: "3. My application status says 'On Hold'",
    botResponse: "'On Hold' means internal scrutiny is temporarily paused pending a specific external statutory clarification:",
    steps: [
      "Reason for Hold: Holds occur during legal boundary checks, municipal court litigation verification, or revenue land title cross-referencing.",
      "Mandatory Remark: Officers are legally mandated (BR-04) to record the exact reason for the hold in the file history.",
      "SLA Timer Paused: The statutory clearance countdown timer is temporarily frozen while on hold so your file does not get penalized.",
      "Action Required: Check if the officer requested a clarifying affidavit. Once submitted, the department officer uses the 'Resume' action to continue processing."
    ],
    action: { label: "View Public Status Slip", href: "/#tracking" },
    followUps: [
      { label: "Who is handling my file?", key: "officer_info" },
      { label: "Can I escalate if hold exceeds 15 days?", key: "escalate_sla" },
      { label: "Back to Helpdesk Menu", key: "main_menu" }
    ]
  },

  locked_departments: {
    title: "4. Why are Fire / Environment stages showing 'Locked'?",
    botResponse: "This is the core statutory rule of the system — Golden Rule BR-03 (Sequential Processing Pipeline):",
    steps: [
      "The Law: Downstream departments are strictly locked until the preceding department grants official statutory approval.",
      "Sequence Hierarchy: Town Planning (Zoning & FAR) ➔ MUST clear first ➔ Fire & Safety (Egress & NOC) ➔ MUST clear second ➔ Environment Board (Pollution & STP).",
      "Why this protects you: Fire departments cannot inspect emergency egress until town planning verifies the boundary line. No file can be cleared out of sequence.",
      "What to do: Check the status of Town Planning. As soon as Planning Approver signs off, Fire & Safety automatically unlocks."
    ],
    action: { label: "View 3-Tier Workflow Flowchart", href: "/#workflow" },
    followUps: [
      { label: "Check status of Town Planning", key: "track_app" },
      { label: "Back to Helpdesk Menu", key: "main_menu" }
    ]
  },

  lost_tracking_id: {
    title: "5. How to track my permit or lost Application Number?",
    botResponse: "Every permit is tracked using a Universal Application Reference Number in the standard format BP-YYYY-XXXXXX:",
    steps: [
      "Format: Begins with 'BP-' followed by the submission year and 6 digits (e.g. BP-2026-000001).",
      "Where to find it: Check your registered email inbox or SMS received upon submission, or the PDF acknowledgement receipt.",
      "Public Search: Enter this number in the 'Citizen Status Inquiry' box on the homepage to inspect live department clearance stages.",
      "Instant Test: You can test the tracker using sample reference IDs: BP-2026-000001, BP-2026-000002, or BP-2026-000003."
    ],
    action: { label: "Open Citizen Status Inquiry Box", href: "/#tracking" },
    followUps: [
      { label: "Test with Approved File (BP-2026-000001)", key: "track_sample_1" },
      { label: "Test with Active Scrutiny (BP-2026-000002)", key: "track_sample_2" },
      { label: "Back to Helpdesk Menu", key: "main_menu" }
    ]
  },

  sla_delay: {
    title: "6. My permit is delayed / Exceeded processing timeline",
    botResponse: "Under Model Building Regulations 2026, each departmental review has an enforced turnaround window (typically 7 working days per desk):",
    steps: [
      "Check Current Desk: Check whether the file is at the 'Checker' (inspection) or 'Approver' (sign-off) stage.",
      "Automatic Alert: If a file sits untouched past 80% of its SLA, automated alerts are sent to the Head of Department (HoD).",
      "Formal Grievance: If no action is taken after 14 days, you can lodge a formal escalation ticket quoting your BP-2026 reference number.",
      "Toll-Free Helpline: Call 1800-11-2026 (Mon–Sat, 9:30 AM to 6:00 PM IST) or email grievance@linkup.gov.in."
    ],
    action: { label: "Contact Helpdesk Support", href: "/#about" },
    followUps: [
      { label: "Check Nodal Officer hierarchy", key: "officer_info" },
      { label: "Back to Helpdesk Menu", key: "main_menu" }
    ]
  },

  upload_failed: {
    title: "Document Upload Failed / Format Error",
    botResponse: "If the document uploader is rejecting your file, verify these technical specifications:",
    steps: [
      "Allowed Extensions: Only .pdf, .jpg, .jpeg, and .png are permitted. (.dwg files should be converted to PDF).",
      "File Size Limit: Maximum 10 MB per individual document.",
      "Special Characters: Rename file to simple letters and numbers (e.g. 'Site_Plan_Revision1.pdf'). Avoid symbols like @, #, $, %, &.",
      "Browser Cache: If upload gets stuck at 99%, refresh browser (Ctrl + F5) and try uploading one file at a time."
    ],
    followUps: [{ label: "Back to Submission Help", key: "submission_error" }, { label: "Main Menu", key: "main_menu" }]
  },

  save_draft: {
    title: "How to Save Draft and Continue Later?",
    botResponse: "You don't need to finish the application in one sitting:",
    steps: [
      "Auto-save: At the bottom of each tab, click 'Save as Draft'.",
      "Draft Number: A temporary Draft Reference is generated.",
      "Resume: Log into the Applicant Portal anytime. Your draft will show its completion percentage (e.g. 65% Completed).",
      "No Data Loss: Uploaded documents remain securely attached in draft mode."
    ],
    followUps: [{ label: "Back to Submission Help", key: "submission_error" }, { label: "Main Menu", key: "main_menu" }]
  },

  restart_query: {
    title: "Will my processing restart from zero after Send Back?",
    botResponse: "NO. This is a key benefit of LinkUp:",
    steps: [
      "Your application does NOT go back to square one.",
      "It returns directly to the specific officer who requested the correction.",
      "Previously approved departments (if any) do NOT have to re-verify already cleared stages."
    ],
    followUps: [{ label: "Back to 'Sent Back' Help", key: "sent_back" }, { label: "Main Menu", key: "main_menu" }]
  },

  resubmit_sla: {
    title: "How many days do I have to resubmit?",
    botResponse: "You have 30 calendar days from the date of 'Sent Back' notification to submit the rectified drawing or document. If not resubmitted within 30 days, the application is marked as Withdrawn/Lapsed and will require fresh filing.",
    steps: [
      "Tip: Most applicants rectify minor blueprint defects within 24 to 48 hours.",
      "You receive instant confirmation once your correction is received."
    ],
    followUps: [{ label: "Back to 'Sent Back' Help", key: "sent_back" }, { label: "Main Menu", key: "main_menu" }]
  },

  officer_info: {
    title: "Department Scrutiny Hierarchy",
    botResponse: "Each statutory department operates on a transparent two-tier hierarchy:",
    steps: [
      "Level 1 — Department Checker: Scrutinizes blueprints, verifies bye-law setbacks, calculates FAR, and checks safety norms. Can Send Back, Hold, or Forward.",
      "Level 2 — Department Approver: Senior officer / Chief Planner / Fire Officer who reviews checker recommendation and grants final statutory sign-off.",
      "Nodal Secretariat: Oversees inter-departmental bottlenecks and resolves inter-department disputes."
    ],
    followUps: [{ label: "Main Menu", key: "main_menu" }]
  }
};

const INITIAL_MESSAGE: Message = {
  id: "msg-0",
  sender: "bot",
  text: "Namaste! 🙏 I am LinkUp Sahayak (सुगम साथी), your official 24×7 Virtual Guide. Where are you facing difficulty with your building permit? Select a topic below or type your application number:",
  options: [
    { label: "1. 📝 'Submit' button disabled / error", key: "submission_error" },
    { label: "2. 🔄 My status is 'Sent Back' — How to fix?", key: "sent_back" },
    { label: "3. ⏸️ My status is 'On Hold' — Why?", key: "on_hold" },
    { label: "4. 🔒 Fire / Environment stages are 'Locked'", key: "locked_departments" },
    { label: "5. 🔍 How to track / Lost Application Number", key: "lost_tracking_id" },
    { label: "6. ⏱️ Processing delayed past 7-day window", key: "sla_delay" }
  ],
  timestamp: "Just now"
};

export default function HelpdeskChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [inputText, setInputText] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping]);

  const handleSelectCategory = (categoryKey: string) => {
    if (categoryKey === "main_menu") {
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now()}`,
          sender: "user",
          text: "Back to Main Help Menu",
          timestamp: "Just now"
        },
        INITIAL_MESSAGE
      ]);
      return;
    }

    const item = STUCK_CATEGORIES[categoryKey];
    if (!item) return;

    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      sender: "user",
      text: item.title,
      timestamp: "Just now"
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      const botMsg: Message = {
        id: `bot-${Date.now() + 1}`,
        sender: "bot",
        text: item.botResponse,
        steps: item.steps,
        actionLink: item.action,
        options: item.followUps || [
          { label: "⬅️ Back to Main Help Menu", key: "main_menu" }
        ],
        timestamp: "Just now"
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 450);
  };

  const handleActionClick = (action: { label: string; href?: string; onClickAction?: string }) => {
    if (action.onClickAction) {
      if (action.onClickAction === "track_sample_1") {
        window.location.href = "/?app=BP-2026-000001#tracking";
      } else if (action.onClickAction === "track_sample_2") {
        window.location.href = "/?app=BP-2026-000002#tracking";
      } else if (action.onClickAction === "track_sample_3") {
        window.location.href = "/?app=BP-2026-000003#tracking";
      }
      setIsOpen(false);
    } else if (action.href) {
      window.location.href = action.href;
      setIsOpen(false);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    const query = inputText.trim();
    if (!query) return;

    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      sender: "user",
      text: query,
      timestamp: "Just now"
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsTyping(true);

    setTimeout(() => {
      // Check if user entered an application number like BP-2026-000001
      const appMatch = query.match(/BP[-_ ]?2026[-_ ]?\d+/i);
      let botMsg: Message;

      if (appMatch) {
        const appId = appMatch[0].toUpperCase().replace(" ", "-");
        botMsg = {
          id: `bot-${Date.now() + 1}`,
          sender: "bot",
          text: `Found permit record reference for ${appId}. You can verify the full multi-department clearance history below:`,
          steps: [
            `Application Reference: ${appId}`,
            "Statutory Departments: Town Planning ➔ Fire & Safety ➔ Environment",
            "Public Transparency Mode: Personal identity proofs remain protected as per Rule BR-10."
          ],
          actionLink: {
            label: `Inspect Live Status for ${appId}`,
            href: `/?app=${appId}#tracking`
          },
          options: [
            { label: "What does 'Sent Back' mean?", key: "sent_back" },
            { label: "Why is Fire Dept locked?", key: "locked_departments" },
            { label: "Back to Main Help Menu", key: "main_menu" }
          ],
          timestamp: "Just now"
        };
      } else {
        // Smart intent matching
        const lower = query.toLowerCase();
        let matchedKey = "";

        if (lower.includes("submit") || lower.includes("button") || lower.includes("error") || lower.includes("apply")) {
          matchedKey = "submission_error";
        } else if (lower.includes("sent back") || lower.includes("resubmit") || lower.includes("remark") || lower.includes("defect")) {
          matchedKey = "sent_back";
        } else if (lower.includes("hold") || lower.includes("pause") || lower.includes("court") || lower.includes("clarification")) {
          matchedKey = "on_hold";
        } else if (lower.includes("fire") || lower.includes("environment") || lower.includes("lock") || lower.includes("sequence")) {
          matchedKey = "locked_departments";
        } else if (lower.includes("track") || lower.includes("number") || lower.includes("status") || lower.includes("where")) {
          matchedKey = "lost_tracking_id";
        } else if (lower.includes("delay") || lower.includes("late") || lower.includes("sla") || lower.includes("time") || lower.includes("days")) {
          matchedKey = "sla_delay";
        } else if (lower.includes("upload") || lower.includes("pdf") || lower.includes("size") || lower.includes("format")) {
          matchedKey = "upload_failed";
        }

        if (matchedKey && STUCK_CATEGORIES[matchedKey]) {
          const item = STUCK_CATEGORIES[matchedKey];
          botMsg = {
            id: `bot-${Date.now() + 1}`,
            sender: "bot",
            text: item.botResponse,
            steps: item.steps,
            actionLink: item.action,
            options: item.followUps || [{ label: "Back to Main Menu", key: "main_menu" }],
            timestamp: "Just now"
          };
        } else {
          botMsg = {
            id: `bot-${Date.now() + 1}`,
            sender: "bot",
            text: `I understand you have an inquiry regarding: "${query}". Please select the exact stage where you are experiencing difficulty so I can give you the step-by-step resolution:`,
            options: [
              { label: "1. 📝 Stuck during Application Submission", key: "submission_error" },
              { label: "2. 🔄 My file was 'Sent Back' by Department", key: "sent_back" },
              { label: "3. ⏸️ My file was placed 'On Hold'", key: "on_hold" },
              { label: "4. 🔒 Why is downstream department 'Locked'?", key: "locked_departments" },
              { label: "5. 🔍 Track an Application Number", key: "lost_tracking_id" },
              { label: "6. 📞 Escalate to Nodal Helpdesk", key: "sla_delay" }
            ],
            timestamp: "Just now"
          };
        }
      }

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 450);
  };

  const handleSpeak = (textToSpeak: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    const cleanText = textToSpeak.replace(/[^\w\s.,?!]/gi, "");
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const resetChat = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
    setMessages([INITIAL_MESSAGE]);
  };

  return (
    <>
      {/* Keyframe & Animation styles */}
      <style>{`
        @keyframes floatBot {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        @keyframes shimmerGlow {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes radarRipple {
          0% { transform: scale(0.9); opacity: 0.9; }
          50% { transform: scale(1.6); opacity: 0.3; }
          100% { transform: scale(2.2); opacity: 0; }
        }
        @keyframes botWiggle {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-8deg); }
          75% { transform: rotate(8deg); }
        }
        @keyframes teaserSlide {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        @keyframes popupSlideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes msgSlide {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes dotTyping {
          0%, 80%, 100% { transform: scale(0); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }

        .bot-float-btn {
          animation: floatBot 3.5s ease-in-out infinite;
        }
        .bot-shimmer-effect {
          background-size: 250% 100%;
          background-image: linear-gradient(
            115deg,
            #002b4f 0%,
            #003366 35%,
            #0a4b8f 50%,
            #003366 65%,
            #002b4f 100%
          );
          animation: shimmerGlow 6s ease-in-out infinite;
        }
        .bot-chat-popup {
          animation: popupSlideUp 0.28s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .msg-anim {
          animation: msgSlide 0.2s ease-out forwards;
        }
        .typing-dot-1 { animation: dotTyping 1.4s infinite ease-in-out both; animation-delay: -0.32s; }
        .typing-dot-2 { animation: dotTyping 1.4s infinite ease-in-out both; animation-delay: -0.16s; }
        .typing-dot-3 { animation: dotTyping 1.4s infinite ease-in-out both; }
      `}</style>

      {/* Floating Chat Trigger Button on Bottom-Right */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          title="Ask LinkUp Virtual Helpdesk / सहायता केंद्र"
          className="bot-float-btn bot-shimmer-effect overflow-hidden fixed bottom-5 right-5 z-40 text-white border-2 border-[#ea580c] shadow-[0_8px_30px_rgba(0,51,102,0.45)] hover:shadow-[0_12px_35px_rgba(234,88,12,0.55)] w-[320px] px-8 py-3.5 rounded-full font-bold flex items-center justify-start gap-4 cursor-pointer transition-transform hover:scale-105 group"
          aria-label="Open LinkUp Helpdesk Chatbot"
        >
          {/* Subtle animated light gleam line */}
          <span className="absolute inset-0 w-1/3 h-full bg-white/10 skew-x-12 -translate-x-full group-hover:translate-x-[400%] transition-transform duration-1000 ease-out pointer-events-none" />

          {/* Radar Live Indicator Dot */}
          <div className="relative flex h-4 w-4 shrink-0">
            <span
              style={{ animation: "radarRipple 2s cubic-bezier(0, 0.2, 0.8, 1) infinite" }}
              className="absolute inline-flex h-full w-full rounded-full bg-emerald-400"
            />
            <span className="animate-ping absolute inline-flex h-4 w-4 rounded-full bg-emerald-400 opacity-80" />
            <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 ring-2 ring-emerald-300/40" />
          </div>

          {/* Animated Chat Bubble */}
          <div
            style={{ animation: "botWiggle 4s ease-in-out infinite" }}
            className="shrink-0 flex items-center justify-center text-2xl group-hover:rotate-6 transition-transform"
          >
            💬
          </div>

          {/* Text Container */}
          <div className="flex flex-col text-left leading-tight gap-0.5 relative z-10">
            <span className="text-base font-extrabold text-amber-300">Ask LinkUp</span>
            <span className="text-[13px] text-slate-200">सुगम साथी • 24×7 Help</span>
          </div>
        </button>
      )}

      {/* Chatbot Window with Pop-up Animation */}
      {isOpen && (
        <div
          className="bot-chat-popup fixed bottom-5 right-5 z-50 w-[94vw] sm:w-[440px] h-[600px] max-h-[88vh] bg-white border-2 border-[#003366] rounded-2xl shadow-[0_20px_50px_rgba(0,25,50,0.45)] flex flex-col overflow-hidden font-sans text-xs ring-1 ring-black/5"
          role="dialog"
          aria-label="LinkUp Virtual Helpdesk Chatbot"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#003366] via-[#0b3b60] to-[#124b7a] text-white px-4 py-3.5 flex items-center justify-between border-b-2 border-[#ea580c] shrink-0 shadow-md">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center border border-amber-300/60 text-lg shadow-inner">
                🏛️
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-extrabold text-sm text-white tracking-tight">
                    Ask LinkUp • Virtual Helpdesk
                  </h3>
                  <span className="bg-emerald-500 text-[9px] font-extrabold text-white px-1.5 py-0.2 rounded-full shadow-xs flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                    LIVE
                  </span>
                </div>
                <p className="text-[10px] text-amber-200 font-medium">
                  सुगम साथी • 24×7 Municipal Permit Assistance
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {/* Reset Chat */}
              <button
                type="button"
                onClick={resetChat}
                className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                title="Reset conversation"
              >
                🔄
              </button>
              {/* Audio Listen */}
              <button
                type="button"
                onClick={() => handleSpeak(messages[messages.length - 1]?.text || "")}
                className={`p-1.5 rounded-lg transition-colors ${
                  isSpeaking
                    ? "text-amber-300 bg-amber-400/20 animate-pulse"
                    : "text-slate-300 hover:text-white hover:bg-white/10"
                }`}
                title="Read aloud last response"
              >
                {isSpeaking ? "⏹️" : "🔊"}
              </button>
              {/* Close */}
              <button
                type="button"
                onClick={() => {
                  if (typeof window !== "undefined" && "speechSynthesis" in window) {
                    window.speechSynthesis.cancel();
                    setIsSpeaking(false);
                  }
                  setIsOpen(false);
                }}
                className="p-1.5 text-slate-300 hover:text-amber-300 hover:bg-white/10 rounded-lg font-bold text-base transition-colors"
                title="Close Helpdesk Chat"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Sub-banner disclaimer */}
          <div className="bg-slate-100 border-b border-slate-200 px-3.5 py-1.5 text-[10px] text-slate-600 flex items-center justify-between">
            <span className="flex items-center gap-1 font-medium">
              <span className="text-amber-600">⚡</span> Official Instant Guide for Clearances
            </span>
            <span className="font-semibold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              MoHUA & NIC Compliant
            </span>
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-3.5 overflow-y-auto space-y-3 bg-[#f8fafc]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`msg-anim flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[88%] rounded-2xl p-3 text-xs leading-relaxed shadow-sm transition-all ${
                    msg.sender === "user"
                      ? "bg-gradient-to-r from-[#003366] to-[#0b3b60] text-white rounded-tr-none"
                      : "bg-white border border-slate-200 text-slate-800 rounded-tl-none ring-1 ring-slate-100"
                  }`}
                >
                  {/* Message main text */}
                  <div className="font-medium">{msg.text}</div>

                  {/* Numbered Step-by-step guidance list */}
                  {msg.steps && msg.steps.length > 0 && (
                    <div className="mt-2.5 pt-2 border-t border-slate-200/80 space-y-1.5">
                      <span className="text-[10px] font-bold text-[#003366] uppercase tracking-wide block flex items-center gap-1">
                        <span>📋</span> Recommended Action Steps:
                      </span>
                      {msg.steps.map((st, sIdx) => (
                        <div key={sIdx} className="flex items-start gap-1.5 text-[11px] text-slate-700">
                          <span className="font-bold text-[#ea580c] bg-orange-50 px-1 rounded shrink-0">
                            {sIdx + 1}.
                          </span>
                          <span>{st}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Direct Action Link / Button */}
                  {msg.actionLink && (
                    <div className="mt-2.5 pt-2 border-t border-slate-200">
                      <button
                        type="button"
                        onClick={() => handleActionClick(msg.actionLink!)}
                        className="w-full bg-[#ea580c] hover:bg-[#c2410c] text-white py-1.5 px-3 rounded-lg font-bold text-[11px] flex items-center justify-center gap-1.5 transition-all shadow-sm hover:shadow hover:scale-[1.01] cursor-pointer"
                      >
                        <span>👉</span> {msg.actionLink.label}
                      </button>
                    </div>
                  )}
                </div>

                {/* Follow-up Question Chips */}
                {msg.options && msg.options.length > 0 && (
                  <div className="mt-2 flex flex-col gap-1 w-[92%] pl-1">
                    <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1">
                      <span>💡</span> Suggested Topics / आगे के विकल्प:
                    </span>
                    {msg.options.map((opt, oIdx) => (
                      <button
                        key={oIdx}
                        type="button"
                        onClick={() => handleSelectCategory(opt.key)}
                        className="text-left bg-white hover:bg-blue-50 border border-slate-200 hover:border-[#003366] text-slate-800 hover:text-[#003366] px-3 py-2 rounded-xl text-[11px] font-medium transition-all shadow-xs hover:shadow-sm hover:translate-x-1"
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}

                <span className="text-[9px] text-slate-400 mt-1 px-1">{msg.timestamp}</span>
              </div>
            ))}

            {/* Realistic AI Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-full px-3 py-2 w-fit shadow-xs">
                <span className="text-[10px] text-slate-500 font-semibold mr-1">Sahayak is typing</span>
                <span className="typing-dot-1 w-1.5 h-1.5 rounded-full bg-[#ea580c]"></span>
                <span className="typing-dot-2 w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                <span className="typing-dot-3 w-1.5 h-1.5 rounded-full bg-[#003366]"></span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask a question or enter Application ID (e.g. BP-2026-000001)..."
              className="flex-1 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#003366] focus:ring-1 focus:ring-[#003366] transition-all"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="bg-[#003366] hover:bg-[#002244] disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow hover:shadow-md shrink-0 flex items-center gap-1"
              title="Send Message"
            >
              <span>Send</span>
              <span className="text-amber-300">➤</span>
            </button>
          </form>
        </div>
      )}
    </>
  );
}
