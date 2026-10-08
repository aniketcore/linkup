"use client";

import React, { useEffect, useState } from "react";
import { ApplicationType } from "../types";

interface PublicRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: ApplicationType | null;
}

export default function PublicRecordModal({
  isOpen,
  onClose,
  application,
}: PublicRecordModalProps) {
  const [details, setDetails] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen || !application) {
      setDetails(null);
      return;
    }

    setLoading(true);
    fetch(`/api/applications/${application.id}`)
      .then((res) => res.json())
      .then((data: any) => {
        if (data.ok && data.application) {
          setDetails(data.application);
        } else {
          setDetails(null);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch public record:", err);
        setDetails(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [isOpen, application]);

  if (!isOpen || !application) return null;

  const currentStatus = details?.status || application.status || "draft";
  const normalizedStatus = currentStatus.toLowerCase();

  const isApproved = normalizedStatus === "approved";
  const isScrutiny = normalizedStatus === "scrutiny" || normalizedStatus === "submitted";
  const isAwaiting = normalizedStatus === "awaiting_approval";
  const isCorrection = normalizedStatus === "needs_correction";

  const getStatusBadge = () => {
    if (isApproved) {
      return (
        <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-black uppercase px-3 py-1 rounded tracking-wider flex items-center gap-1.5 shadow-sm">
          <span>✅</span> FINAL SANCTION ISSUED
        </span>
      );
    }
    if (isAwaiting) {
      return (
        <span className="bg-amber-100 text-amber-900 border border-amber-300 text-xs font-black uppercase px-3 py-1 rounded tracking-wider flex items-center gap-1.5 shadow-sm">
          <span>✍️</span> AWAITING FINAL SIGN-OFF
        </span>
      );
    }
    if (isScrutiny) {
      return (
        <span className="bg-blue-100 text-blue-900 border border-blue-300 text-xs font-black uppercase px-3 py-1 rounded tracking-wider flex items-center gap-1.5 shadow-sm">
          <span>🔍</span> UNDER STATUTORY SCRUTINY
        </span>
      );
    }
    if (isCorrection) {
      return (
        <span className="bg-orange-100 text-orange-900 border border-orange-300 text-xs font-black uppercase px-3 py-1 rounded tracking-wider flex items-center gap-1.5 shadow-sm">
          <span>⚠️</span> ACTION REQUIRED / CORRECTION
        </span>
      );
    }
    return (
      <span className="bg-slate-200 text-slate-800 border border-slate-300 text-xs font-black uppercase px-3 py-1 rounded tracking-wider flex items-center gap-1.5 shadow-sm">
        <span>📝</span> DRAFT RECORD
      </span>
    );
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}/?app=${application.id}#tracking`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const departmentsList = details?.departments || [
    { name: "Town Planning Department", status: isApproved || isAwaiting ? "approved" : "in_scrutiny" },
    { name: "Fire & Safety Department", status: isApproved ? "approved" : isAwaiting ? "in_scrutiny" : "pending" },
    { name: "Environment Department", status: isApproved ? "approved" : "pending" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-2xl border border-slate-300 w-full max-w-4xl max-h-[92vh] flex flex-col my-auto overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Official Header */}
        <div className="bg-[#003366] text-white px-6 py-4 flex items-center justify-between border-b-4 border-[#ea580c] shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-white/10 p-2 rounded border border-white/20">
              <img src="/emblem.svg" alt="India Emblem" className="h-9 w-auto invert" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#ea580c]">
                Government of India • National Single-Window Registry
              </p>
              <h2 className="text-lg font-black uppercase tracking-tight">
                Public Sanction & Permit Record Dossier
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white p-1 rounded hover:bg-white/10 transition-colors text-lg font-bold"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* Metadata Banner */}
          <div className="bg-slate-50 border border-slate-300 rounded-lg p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-base font-black text-[#003366] bg-white px-2.5 py-1 border-2 border-[#003366]/30 rounded">
                  {application.id}
                </span>
                {getStatusBadge()}
              </div>

              <h3 className="text-lg font-extrabold text-slate-900 mt-2 uppercase">
                {details?.building?.project_name || application.project}
              </h3>
              <p className="text-xs text-slate-600 mt-0.5 font-medium">
                Applicant: <strong className="text-slate-800">{details?.applicant?.name || application.applicant}</strong> • Current Authority: <strong className="text-[#003366]">{details?.current_department_name || application.department}</strong>
              </p>
            </div>

            {/* Simulated Digital Verification Badge */}
            <div className="bg-white border border-slate-300 rounded p-3 text-center shrink-0 shadow-sm flex flex-col items-center">
              <div className="h-14 w-14 bg-slate-100 border border-slate-300 rounded flex items-center justify-center font-mono text-[9px] text-slate-600 font-bold p-1 leading-tight text-center">
                QR CODE VERIFIED
              </div>
              <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-700 mt-1.5">
                🔒 Cryptographically Signed
              </span>
            </div>
          </div>

          {/* SECTION 1: MULTI-DEPARTMENT CLEARANCE PIPELINE */}
          <div>
            <div className="border-b border-slate-300 pb-2 mb-3 flex items-center justify-between">
              <h4 className="text-xs font-black uppercase tracking-wider text-[#003366]">
                🏛️ Multi-Department Statutory Clearances
              </h4>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                Single-Window Mandate
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {departmentsList.map((dept: any, idx: number) => {
                const isDeptApproved = dept.status === "approved";
                const isDeptActive = dept.status === "in_scrutiny" || dept.status === "awaiting_approval";

                return (
                  <div
                    key={idx}
                    className={`rounded border p-3.5 flex flex-col justify-between ${
                      isDeptApproved
                        ? "bg-emerald-50/70 border-emerald-300 text-emerald-950"
                        : isDeptActive
                        ? "bg-blue-50/70 border-blue-300 text-blue-950"
                        : "bg-slate-50 border-slate-200 text-slate-600"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[9px] font-black uppercase tracking-wider text-slate-500">
                          Stage {idx + 1}
                        </span>
                        {isDeptApproved ? (
                          <span className="bg-emerald-100 text-emerald-800 text-[9px] font-bold px-1.5 py-0.5 rounded border border-emerald-300">
                            ✓ Cleared
                          </span>
                        ) : isDeptActive ? (
                          <span className="bg-blue-100 text-blue-800 text-[9px] font-bold px-1.5 py-0.5 rounded border border-blue-300 animate-pulse">
                            Active Scrutiny
                          </span>
                        ) : (
                          <span className="bg-slate-200 text-slate-600 text-[9px] font-bold px-1.5 py-0.5 rounded">
                            Queued
                          </span>
                        )}
                      </div>

                      <h5 className="text-xs font-extrabold uppercase">
                        {dept.name}
                      </h5>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-200/60 text-[10px]">
                      {isDeptApproved ? (
                        <span className="text-emerald-700 font-semibold">
                          NOC Reference: NOC-2026-00{idx + 1}8A
                        </span>
                      ) : isDeptActive ? (
                        <span className="text-blue-700 font-semibold">
                          Under Desktop & Field Verification
                        </span>
                      ) : (
                        <span className="text-slate-400 font-medium">
                          Pending preceding clearance
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SECTION 2: APPROVED SPECIFICATIONS & LAND METRICS */}
          <div>
            <div className="border-b border-slate-300 pb-2 mb-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-[#003366]">
                🏗️ Sanctioned Land & Structural Specifications
              </h4>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-slate-50 border border-slate-300 p-3 rounded">
                <span className="text-[10px] font-bold uppercase text-slate-500 block">Zoning & Ward</span>
                <span className="text-xs font-extrabold text-slate-800">
                  {details?.building?.zone || "Commercial Zone B"} • {details?.building?.ward || "Ward 12"}
                </span>
              </div>

              <div className="bg-slate-50 border border-slate-300 p-3 rounded">
                <span className="text-[10px] font-bold uppercase text-slate-500 block">Gross Plot Area</span>
                <span className="text-xs font-extrabold text-slate-800">
                  {details?.building?.plot_area || "4,500 sq.m"}
                </span>
              </div>

              <div className="bg-slate-50 border border-slate-300 p-3 rounded">
                <span className="text-[10px] font-bold uppercase text-slate-500 block">Permitted Built-Up (FSI)</span>
                <span className="text-xs font-extrabold text-slate-800">
                  {details?.building?.built_up_area || "12,800 sq.m"}
                </span>
              </div>

              <div className="bg-slate-50 border border-slate-300 p-3 rounded">
                <span className="text-[10px] font-bold uppercase text-slate-500 block">Height / Floors</span>
                <span className="text-xs font-extrabold text-slate-800">
                  {details?.building?.floors || "G + 4 Floors"}
                </span>
              </div>
            </div>
          </div>

          {/* SECTION 3: LEGAL ENTITY & ARCHITECT OF RECORD */}
          <div>
            <div className="border-b border-slate-300 pb-2 mb-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-[#003366]">
                🏢 Verified Legal Entities & Architect
              </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-slate-50 border border-slate-300 p-3.5 rounded flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase text-[#003366] block">
                    Developer / Consulting Enterprise
                  </span>
                  <p className="text-xs font-extrabold text-slate-900 mt-0.5">
                    {details?.firm?.name || "Apex Infrastructure Pvt. Ltd."}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Registration No: {details?.firm?.registration_number || "REG-2024-8841"}
                  </p>
                </div>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-300">
                  Verified
                </span>
              </div>

              <div className="bg-slate-50 border border-slate-300 p-3.5 rounded flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase text-[#003366] block">
                    Statutory Jurisdiction
                  </span>
                  <p className="text-xs font-extrabold text-slate-900 mt-0.5">
                    Municipal Corporation of Greater Mumbai
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Revenue Division: Maharashtra Urban Development
                  </p>
                </div>
                <span className="bg-slate-200 text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded">
                  Public Record
                </span>
              </div>
            </div>
          </div>

          {/* SECTION 4: STATUTORY SANCTION CERTIFICATES */}
          <div>
            <div className="border-b border-slate-300 pb-2 mb-3 flex items-center justify-between">
              <h4 className="text-xs font-black uppercase tracking-wider text-[#003366]">
                📄 Certified Public Attachments & Orders
              </h4>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                GIGW Level-3 Compliant
              </span>
            </div>

            <div className="space-y-2">
              {[
                {
                  title: "Statutory Building Sanction Order & Approved Plan",
                  ref: `BSO-${application.id}.pdf`,
                  status: isApproved ? "Issued & Sealed" : "Provisional Draft",
                  icon: "📜",
                },
                {
                  title: "Fire Safety Clearance Certificate (No Objection Certificate)",
                  ref: `NOC-FIRE-${application.id}.pdf`,
                  status: isApproved || isAwaiting ? "Issued" : "Pending Inspection",
                  icon: "🚒",
                },
                {
                  title: "Town & Country Planning Clearance Endorsement",
                  ref: `TCP-NOC-${application.id}.pdf`,
                  status: "Issued & Archived",
                  icon: "🏛️",
                },
              ].map((cert, i) => (
                <div
                  key={i}
                  className="p-3 bg-slate-50 border border-slate-300 rounded flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">{cert.icon}</span>
                    <div>
                      <span className="font-bold text-slate-900 block">{cert.title}</span>
                      <span className="font-mono text-[10px] text-slate-500 font-semibold">{cert.ref}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                        cert.status.includes("Issued")
                          ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                          : "bg-slate-100 text-slate-600 border-slate-300"
                      }`}
                    >
                      {cert.status}
                    </span>
                    <button
                      type="button"
                      onClick={() => alert(`Simulating authenticated download of ${cert.ref}`)}
                      className="text-[10px] font-bold uppercase bg-[#003366] hover:bg-[#002244] text-white px-2.5 py-1 rounded transition-colors"
                    >
                      Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Modal Bottom Bar */}
        <div className="bg-slate-100 border-t border-slate-300 px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={handlePrint}
              className="rounded border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 px-4 py-2 text-xs font-bold uppercase tracking-wide transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <span>🖨️</span> Print Dossier
            </button>
            <button
              type="button"
              onClick={handleCopyLink}
              className="rounded border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 px-4 py-2 text-xs font-bold uppercase tracking-wide transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <span>🔗</span> {copied ? "Link Copied!" : "Share Link"}
            </button>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <a
              href={`/?app=${application.id}#tracking`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded bg-[#0b3b60] hover:bg-[#002244] text-white px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
            >
              Citizen Portal View ↗
            </a>
            <button
              type="button"
              onClick={onClose}
              className="rounded bg-slate-300 hover:bg-slate-400 text-slate-800 px-5 py-2 text-xs font-bold uppercase tracking-wider transition-colors"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
