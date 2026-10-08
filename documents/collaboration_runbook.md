# Collaboration Runbook
## Building Permit MVP - Live Execution Board

Last Updated: 2026-10-08
Primary Owner: Aniket
Source Plan: documents/hackathon_execution_plan.md

## 1. How To Use This File
1. Claim one task ID at a time by changing its status to IN_PROGRESS.
2. Do not start a task whose dependency is not DONE.
3. After finishing, update status to DONE and fill the completion notes.
4. Always set the Next Task pointer before handoff.

## 2. Single Source Of Truth
- Current Phase: Phase 1
- Current Next Task: T-01
- Current Blocker: None
- Last Completed Task: None

## 3. Task Board (Strict Order)

| ID | Task | Owner | Depends On | Status | Completion Notes |
|---|---|---|---|---|---|
| T-01 | Expand D1 schema for applications, profiles, firm, building, documents, departments, workflow_actions | Backend | None | TODO | |
| T-02 | Seed departments with sequence: Planning=1, Fire=2, Environment=3 | Backend | T-01 | TODO | |
| T-03 | Seed role users: applicant, checker, approver, citizen | Backend | T-01 | TODO | |
| T-04 | Build API: create draft application | Backend | T-01 | TODO | |
| T-05 | Build API: update section (applicant/firm/building) | Backend | T-04 | TODO | |
| T-06 | Build API: documents metadata + mandatory checks | Backend | T-05 | TODO | |
| T-07 | Build API: submit with mandatory field/doc validation | Backend | T-06 | TODO | |
| T-08 | Build checker action API: send_back, hold, forward | Backend | T-07 | TODO | |
| T-09 | Build approver action API: approve, decline, hold, send_back | Backend | T-08 | TODO | |
| T-10 | Build resubmit API for applicant after send back | Backend | T-08 | TODO | |
| T-11 | Build citizen tracking API by application number | Backend | T-09 | TODO | |
| T-12 | Build timeline API (audit history) | Backend | T-09 | TODO | |
| T-13 | Build reports API (application-wise status list) | Backend | T-09 | TODO | |
| T-14 | Applicant dashboard + new application wizard UI | Frontend | T-07 | TODO | |
| T-15 | Applicant review, submit, and confirmation with app number | Frontend | T-14 | TODO | |
| T-16 | Send-back correction and resubmit UI | Frontend | T-10 | TODO | |
| T-17 | Checker queue and review screen UI | Frontend | T-08 | TODO | |
| T-18 | Approver queue and decision screen UI | Frontend | T-09 | TODO | |
| T-19 | Citizen search and status timeline UI | Frontend | T-11,T-12 | TODO | |
| T-20 | Reports UI with basic filters | Frontend | T-13 | TODO | |
| T-21 | End-to-end validation tests for invalid transitions and mandatory remarks | QA/Shared | T-20 | TODO | |
| T-22 | Seed golden demo scenario data | Backend | T-21 | TODO | |
| T-23 | Full demo rehearsal (2 runs) | Shared | T-22 | TODO | |
| T-24 | Deploy and smoke test | Shared | T-23 | TODO | |

## 4. Must Enforce Rules
1. A department cannot process until the previous department is approved.
2. Remarks are mandatory for send_back, hold, and decline.
3. Submit is blocked until mandatory fields and mandatory documents are present.
4. Every successful action inserts an audit row.
5. Citizen view never exposes confidential/internal fields.

## 5. File Ownership Map
- Backend schema: db/schema.sql
- API routes: app/api/**/route.ts
- Applicant UI: app/page.tsx and app/**
- Shared plan docs: documents/**
- Cloudflare bindings and runtime: wrangler.jsonc, worker-configuration.d.ts

## 6. Handoff Protocol
When ending a work session, append a handoff note in this format:

### Handoff Note Template
- Time:
- Completed Task IDs:
- Files Changed:
- Validation Run:
- Known Issues:
- Next Task ID:
- Suggested First Command:

## 7. Commands Reference
1. Install: npm install
2. Frontend dev: npm run dev -- --host 0.0.0.0
3. Worker preview: npm run start
4. Build: npm run build
5. Deploy: npm run deploy
6. Refresh Cloudflare types: npm run cf-typegen

## 8. Fast Priority If Time Is Slipping
1. Keep only essential report columns.
2. Keep only mandatory document types.
3. Skip citizen interest feature.
4. Keep UI simple, protect workflow correctness.

## 9. Definition Of Done
1. Entire scripted flow runs without manual DB edits.
2. Final Approved is reachable only through sequential department approvals.
3. Send Back and Hold paths are demonstrated live.
4. Citizen can track by application number.
5. Timeline displays complete action history.
