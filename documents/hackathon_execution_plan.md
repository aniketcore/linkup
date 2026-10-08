# Hackathon Execution Plan
## Building Permit Approval Management System MVP

Version: 1.0  
Date: 2026-10-08  
Owner: Aniket

## 1. Objective
Build a demo-ready MVP in 24 hours that proves end-to-end transparent, sequential, multi-department permit processing with audit trail and citizen tracking.

## 2. Demo Success Criteria
The MVP is successful only if this full flow works live:

1. Applicant logs in.
2. Applicant creates and submits an application with mandatory fields and documents.
3. Town Planning checker sends back with remarks.
4. Applicant edits and resubmits.
5. Town Planning checker forwards.
6. Town Planning approver approves.
7. Fire checker places hold, then resumes.
8. Fire approver approves.
9. Environment checker and approver approve.
10. Final Approved status is reached.
11. Citizen tracks by application number and sees department-wise progress.
12. Timeline shows complete audit trail.

## 3. Scope Lock (Must Have)

### 3.1 In Scope
- Applicant: create, draft, edit, upload, submit, track, resubmit.
- Department Checker: review, send back, hold, forward.
- Department Approver: approve, decline, hold, send back.
- Citizen: search by application number and view safe status timeline.
- Reports: application-wise listing with status and filters.
- Audit trail for every action.

### 3.2 Out of Scope
- GIS, OCR, payment, Aadhaar/eKYC, SMS/WhatsApp, digital signatures, complex analytics.

## 4. Current Baseline (Already Available)
- Frontend auth shell and landing page.
- D1 connectivity health endpoint.
- User sync endpoint.
- Basic users table.
- Wrangler Cloudflare bindings for D1 and R2.

## 5. 24-Hour Build Plan

## Phase 0: Kickoff and Freeze (Hour 0-1)
1. Freeze this plan and do not add features after hour 4.
2. Confirm demo script sequence and role handoff.
3. Create issue board with Must-Have, Optional, and Cut List.

Deliverable:
- Signed-off scope and owner matrix.

## Phase 1: Data Layer and Seed (Hour 1-4)
1. Expand schema with:
   - users
   - applications
   - applicant_profiles
   - firm_details
   - building_details
   - documents
   - departments
   - workflow_actions
2. Add status constraints and transition support fields.
3. Seed departments in strict sequence:
   - 1: Town Planning
   - 2: Fire and Safety
   - 3: Environment
4. Seed minimal users by role.

Deliverable:
- Migrated D1 schema and seeded base data.

## Phase 2: Core Workflow APIs (Hour 4-7)
Implement only these APIs:

1. POST /api/applications/draft
2. PATCH /api/applications/:id/section/:section
3. POST /api/applications/:id/documents
4. POST /api/applications/:id/submit
5. POST /api/applications/:id/actions/checker
6. POST /api/applications/:id/actions/approver
7. POST /api/applications/:id/resubmit
8. GET /api/track/:applicationNumber
9. GET /api/applications/:id/timeline
10. GET /api/reports/applications

Mandatory business-rule enforcement:
1. Mandatory fields and documents before submit.
2. Remarks mandatory for send back, hold, decline.
3. Strict sequential department gate.
4. Audit row written for every action.

Deliverable:
- Endpoints callable and transition-safe.

## Phase 3: Applicant UX (Hour 7-10)
Build screens:
1. Applicant dashboard.
2. New application wizard:
   - Applicant
   - Firm
   - Building
   - Documents
   - Review
3. Submit confirmation page showing generated application number.
4. Sent-back correction and resubmission flow.

Deliverable:
- Applicant can complete submit and resubmit loop without manual DB edits.

## Phase 4: Department UX (Hour 10-13)
Build screens:
1. Checker queue.
2. Approver queue.
3. Application review panel with document list and history.
4. Action panel with required remarks validation.

Deliverable:
- Checker and approver can process the same application through all departments.

## Phase 5: Citizen Tracking and Reports (Hour 13-15)
Build screens:
1. Citizen search by application number.
2. Status timeline and department progress tracker.
3. Application-wise report with basic filters.

Privacy rule:
- Hide confidential applicant and internal-only data from citizen view.

Deliverable:
- Citizen can track status and timeline safely.

## Phase 6: Hardening and Validation (Hour 15-19)
Test critical failures:
1. Submit with missing mandatory fields.
2. Submit with missing mandatory documents.
3. Unauthorized action by wrong role.
4. Invalid transition (out-of-order department processing).
5. Hold/resume behavior.

Deliverable:
- Error messages are clear and workflow cannot be bypassed.

## Phase 7: Demo Readiness (Hour 19-24)
1. Seed one golden application that demonstrates send-back and hold.
2. Rehearse complete demo twice.
3. Cap live demo to 6-8 minutes.
4. Keep fallback screenshots ready.
5. Deploy and smoke-test production URL.

Deliverable:
- Judge-ready, deterministic demo flow.

## 6. Data Model (MVP)

### users
- id
- name
- email
- mobile
- role (applicant/checker/approver/citizen/admin)
- department_id (nullable)
- status
- created_at
- updated_at

### applications
- id
- application_number
- applicant_user_id
- status
- current_department_id
- current_stage (checker/approver/applicant)
- submission_date
- last_updated_date

### applicant_profiles
- id
- application_id
- applicant_name
- applicant_type
- mobile
- email
- address
- city
- state
- pin_code
- id_proof_number

### firm_details
- id
- application_id
- firm_name
- registration_number
- firm_address
- contact_person
- contact_number
- email
- gst_number

### building_details
- id
- application_id
- project_name
- building_type
- plot_number
- address
- city
- ward
- zone
- plot_area
- built_up_area
- floors
- units
- estimated_cost

### documents
- id
- application_id
- document_type
- mandatory_flag
- file_name
- file_key
- file_size
- mime_type
- uploaded_by
- uploaded_date

### departments
- id
- name
- sequence
- active

### workflow_actions
- id
- application_id
- department_id
- user_id
- user_role
- action
- remarks
- from_status
- to_status
- action_datetime

## 7. Application Number Format
Use:
- BP-YYYY-XXXXXX

Example:
- BP-2026-000001

Generation rule:
- Increment per year, zero-padded to 6 digits.

## 8. Workflow State Machine (MVP)

### Main States
- Draft
- Submitted
- Under Scrutiny
- Sent Back
- On Hold
- Approved
- Declined
- Final Approved

### Transition Rules
1. Draft -> Submitted only if mandatory fields/documents complete.
2. Submitted -> Under Scrutiny at first department checker.
3. Checker send_back -> Sent Back (remarks required).
4. Sent Back -> Resubmitted -> Under Scrutiny (same department checker).
5. Checker forward -> Pending Approver.
6. Approver approve -> next department checker OR Final Approved.
7. Approver decline -> Declined (terminal).
8. Hold can be applied by checker/approver with remarks.

### Sequential Gate
- Department N cannot act unless Department N-1 is approved.

## 9. API Validation Rules
1. Reject action if user role is unauthorized.
2. Reject action if application is not in expected state.
3. Reject send_back/hold/decline when remarks missing.
4. Reject submit when mandatory document types are absent.
5. Always append audit action when transition succeeds.

## 10. UI Screen List (Target 10)
1. Login
2. Applicant dashboard
3. New/Edit application wizard
4. Applicant application detail
5. Department dashboard
6. Checker review screen
7. Approver decision screen
8. Citizen tracking search
9. Timeline screen
10. Reports screen

## 11. Team Execution Split

### Backend Owner (Aniket)
1. Schema and seed.
2. Workflow service and transition rules.
3. API endpoints.
4. R2 document metadata integration.
5. Role and permission checks.

### Frontend Owner
1. Wizard forms and validation UX.
2. Dashboards and queue screens.
3. Citizen tracking UI.
4. Timeline visualization.
5. Report listing and filters.

## 12. Cut Strategy if Time Slips
Cut in this order:
1. Citizen interest feature.
2. Advanced report filters.
3. Optional document categories.
4. Fancy UI animations.

Never cut:
1. Sequential workflow gate.
2. Mandatory remarks validation.
3. Audit timeline.
4. End-to-end demo path.

## 13. Risk Register
1. Workflow bugs in transitions.
   - Mitigation: central transition function and table-driven rules.
2. Upload flow complexity.
   - Mitigation: keep to basic type/size checks and metadata storage.
3. Role confusion during demo.
   - Mitigation: pre-created accounts and role-labeled login chips.
4. Time overrun.
   - Mitigation: strict cut strategy by hour 12 checkpoint.

## 14. Final Demo Script (6-8 Minutes)
1. Login as Applicant and create application.
2. Fill mandatory sections and upload mandatory docs.
3. Submit and show generated application number.
4. Login as Planning Checker and send back with remarks.
5. Switch to Applicant, fix and resubmit.
6. Planning Checker forwards.
7. Planning Approver approves.
8. Fire Checker places hold, then resumes and forwards.
9. Fire Approver approves.
10. Environment Checker and Approver approve.
11. Show Final Approved status.
12. Open Citizen Tracking, search by application number, show progress and timeline.

## 15. Done Definition
MVP is done when all are true:
1. Full scripted flow executes without DB manual intervention.
2. All workflow actions generate audit records.
3. Citizen view shows accurate limited status.
4. Report page lists applications with current status.
5. Validation failures produce user-friendly messages.
