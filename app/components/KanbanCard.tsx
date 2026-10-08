import React from 'react';
import { ApplicationType } from '../types';

export function KanbanCard({ 
  app, 
  columnType, 
  renderActions 
}: { 
  app: ApplicationType, 
  columnType: 'draft' | 'scrutiny' | 'awaiting' | 'approved',
  renderActions: (app: ApplicationType) => React.ReactNode
}) {
  const isNeedsCorrection = app.status === 'needs_correction';
  
  // Color mappings
  const containerClasses = {
    draft: isNeedsCorrection ? 'border-amber-300 border-l-amber-500 hover:border-amber-500' : 'border-slate-300 border-l-slate-400 hover:border-slate-500',
    scrutiny: 'border-slate-300 border-l-blue-500 hover:border-blue-500',
    awaiting: 'border-slate-300 border-l-[#ea580c] hover:border-[#ea580c]',
    approved: 'border-emerald-300 border-l-emerald-600 hover:border-emerald-500'
  };
  
  const bgClass = columnType === 'approved' ? 'bg-emerald-50' : 'bg-white';
  
  const badgeClasses = {
    draft: isNeedsCorrection ? 'bg-amber-100 text-amber-800 border-amber-200' : 'bg-slate-200 text-slate-700 border-slate-300',
    scrutiny: 'bg-[#003366]/10 border-[#003366]/20 text-[#0b3b60]',
    awaiting: 'bg-[#ea580c]/10 border-[#ea580c]/20 text-[#c2410c]',
    approved: 'bg-emerald-200 border-emerald-300 text-emerald-900'
  };

  const badgeText = {
    draft: isNeedsCorrection ? '⚠️ Action Required' : 'Draft',
    scrutiny: app.department,
    awaiting: app.department,
    approved: '✅ Issued'
  };

  const progressColor = {
    scrutiny: 'bg-blue-500',
    awaiting: 'bg-[#ea580c]',
    approved: 'bg-emerald-600'
  };

  const approvalsColor = columnType === 'approved' ? 'text-emerald-800' : 'text-slate-500';
  const approvalPillBg = columnType === 'approved' ? 'bg-emerald-100 border-emerald-300 text-emerald-700' : 'bg-slate-100 border-slate-300 text-slate-600';
  
  const idColor = columnType === 'approved' ? 'text-emerald-800' : 'text-slate-500';
  const applicantColor = columnType === 'approved' ? 'text-emerald-700' : 'text-slate-500';

  return (
    <div className={`rounded border p-3 shadow-sm border-l-4 transition-colors ${bgClass} ${containerClasses[columnType]}`}>
      <div className="flex justify-between items-start mb-2">
        <span className={`text-[10px] font-bold ${idColor}`}>{app.id}</span>
        {columnType === 'draft' ? (
          <div className="flex gap-1">
            <span className="rounded-sm bg-slate-100 border border-slate-200 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-slate-600 truncate max-w-[100px]">{app.department}</span>
            <span className={`rounded-sm px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide border ${badgeClasses.draft}`}>
              {badgeText.draft}
            </span>
          </div>
        ) : (
          <span className={`rounded-sm px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide border ${badgeClasses[columnType]}`}>
            {badgeText[columnType]}
          </span>
        )}
      </div>
      
      <h3 className="text-sm font-bold text-[#003366] uppercase mb-1">{app.project}</h3>
      <p className={`text-[10px] font-semibold uppercase tracking-wide mb-3 ${applicantColor}`}>{app.applicant}</p>
      
      {/* Completed Approvals */}
      {columnType !== 'draft' && (
        <div className="mb-3 flex flex-col gap-1 w-full">
          <span className={`text-[9px] font-bold uppercase tracking-wide ${approvalsColor}`}>Completed Approvals:</span>
          <div className="flex flex-wrap gap-1">
            {app.approved_by && app.approved_by.length > 0 ? (
              app.approved_by.map((dept, idx) => (
                <span key={idx} className={`rounded-sm border px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wide ${approvalPillBg}`}>
                  ✓ {dept}
                </span>
              ))
            ) : (
              <span className={`rounded-sm border px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wide ${approvalPillBg}`}>
                ✓ {app.department}
              </span>
            )}
          </div>
        </div>
      )}
      
      {/* Progress Bar */}
      {columnType !== 'draft' && (
        <div className="mb-3 h-1.5 rounded bg-slate-200 overflow-hidden">
          <div className={`h-1.5 ${progressColor[columnType]}`} style={{ width: `${app.progress}%` }} />
        </div>
      )}

      {/* Actions */}
      <div className={`pt-3 border-t mt-auto flex items-center justify-between ${columnType === 'approved' ? 'border-emerald-200' : 'border-slate-100'}`}>
        {renderActions(app)}
      </div>
    </div>
  );
}
