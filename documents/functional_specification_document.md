
# Functional Specification Document (FSD)
## Building Permit Approval Management System

**Version:** 1.0  
**Project Type:** 24-Hour Hackathon MVP  
**Application Type:** Web Application  
**Primary Objective:** Digitize and track the building permit application, departmental scrutiny, approval and citizen-tracking process.

---

# 1. Purpose

The Building Permit Approval Management System is a web-based application through which an applicant can submit a building permit application along with applicant, firm, building and supporting-document information.

The application is subsequently processed sequentially by designated government departments.

The system shall provide:

- Online application submission
- Document upload
- Mandatory and optional fields/documents
- Department-wise checking
- Sequential approval workflow
- Send Back / Approve / Decline / Hold actions
- Remarks at every departmental action
- Application status tracking
- Application-wise reporting
- Citizen-facing application visibility
- Complete application history/audit trail

For the hackathon MVP, three sample departments will be configured:

1. **Town Planning Department**
2. **Fire & Safety Department**
3. **Environment Department**

These departments are representative only and can subsequently be replaced/configured according to actual government requirements.

---

# 2. Scope

## 2.1 In Scope

### Applicant

- Registration/login
- Create new application
- Enter applicant details
- Enter firm details
- Enter building/project details
- Upload documents
- Save draft
- Submit application
- View application status
- View departmental remarks
- Respond to "Send Back"
- Resubmit corrected application
- View complete application history

### Department Checker

- Login
- View assigned applications
- View application details
- View uploaded documents
- Check application/document completeness
- Enter remarks
- Send Back
- Recommend/Forward
- Put application on Hold
- View previous departmental actions

### Department Approver

- Login
- View applications awaiting approval
- Review application and checker remarks
- Approve
- Decline
- Hold
- Send Back where applicable
- Enter mandatory remarks for adverse decisions

### Common Citizen

- Search application
- View limited application information
- View current status
- View approval progress
- View basic building/project information
- Optionally express interest in a portion/unit of the building

### Reporting

- Application-wise status report
- Department-wise pending applications
- Approved applications
- Declined applications
- Applications on Hold
- Applications sent back
- Processing timeline

---

# 3. User Roles

| Role | Primary Responsibility |
|---|---|
| Applicant | Creates and manages permit application |
| Department Checker | Performs preliminary scrutiny |
| Department Approver | Takes departmental decision |
| Common Citizen | Tracks publicly available application information |

---

# 4. High-Level Process

```text
Applicant
   |
   | Create Application
   v
Draft
   |
   | Submit
   v
Town Planning Checker
   |
   +---- Send Back ----> Applicant ----> Resubmit
   |
   +---- Hold
   |
   v
Town Planning Approver
   |
   +---- Send Back
   +---- Hold
   +---- Decline
   |
   v
Fire & Safety Checker
   |
   +---- Send Back
   +---- Hold
   |
   v
Fire & Safety Approver
   |
   +---- Send Back
   +---- Hold
   +---- Decline
   |
   v
Environment Checker
   |
   +---- Send Back
   +---- Hold
   |
   v
Environment Approver
   |
   +---- Send Back
   +---- Hold
   +---- Decline
   |
   v
FINAL APPROVED
```

The exact department sequence shall be configurable.

---

# 5. Application Status Model

The application shall have a lifecycle status.

| Status | Description |
|---|---|
| Draft | Application created but not submitted |
| Submitted | Applicant has submitted application |
| Under Scrutiny | Application is being checked |
| Sent Back | Department has returned application for correction |
| Resubmitted | Applicant has corrected and resubmitted |
| On Hold | Processing temporarily paused |
| Department Approved | Current department has approved |
| Department Declined | Current department has declined |
| Final Approved | All required departments have approved |
| Final Declined | Application has been declined |
| Withdrawn | Applicant withdrew application, if implemented |

For the hackathon, **Draft, Submitted, Under Scrutiny, Sent Back, On Hold, Approved, Declined and Final Approved** are sufficient.

---

# 6. Application Number

Every submitted application shall receive a unique application number.

### Example

```text
BP-2026-000001
BP-2026-000002
BP-2026-000003
```

The application number shall be the primary reference number for:

- Applicant tracking
- Department processing
- Citizen search
- Reports
- Audit trail

---

# 7. Applicant Module

## 7.1 Applicant Registration/Login

The applicant shall be able to:

- Register
- Login
- Logout
- Reset password

For the hackathon, authentication may be simplified using email/mobile + password.

---

# 8. Applicant Information

The application form shall capture:

| Field | Mandatory |
|---|---|
| Applicant Name | Yes |
| Applicant Type | Yes |
| Mobile Number | Yes |
| Email | Yes |
| Address | Yes |
| City | Yes |
| State | Yes |
| PIN Code | Yes |
| ID Proof Number | Yes |

Applicant Type may include:

- Individual
- Company
- Partnership
- Other

---

# 9. Firm/Organization Details

| Field | Mandatory |
|---|---|
| Firm/Organization Name | Yes |
| Registration Number | No |
| Firm Address | Yes |
| Contact Person | Yes |
| Contact Number | Yes |
| Email | Yes |
| GST Number | No |

---

# 10. Building/Project Details

The application shall capture:

### Basic Details

| Field | Mandatory |
|---|---|
| Project/Building Name | Yes |
| Building Type | Yes |
| Plot Number | Yes |
| Address | Yes |
| City | Yes |
| Ward/Zone | Yes |
| Plot Area | Yes |
| Proposed Built-up Area | Yes |
| Number of Floors | Yes |
| Number of Units | No |
| Estimated Project Cost | No |

### Building Type

Example values:

- Residential
- Commercial
- Residential + Commercial
- Institutional
- Industrial
- Other

---

# 11. Location Details

The system may capture:

- Address
- Plot number
- Ward
- Zone
- PIN code
- Latitude
- Longitude

For the 24-hour MVP, latitude/longitude can be optional.

A map integration should **not be treated as mandatory for the hackathon**.

---

# 12. Document Management

The applicant shall upload supporting documents.

Example documents:

| Document | Mandatory |
|---|---|
| Applicant ID Proof | Yes |
| Ownership/Title Document | Yes |
| Site Plan | Yes |
| Building Plan | Yes |
| Structural Plan | No |
| Fire Safety Plan | No |
| NOC/Supporting Document | No |
| Other Document | No |

The system shall display:

```text
Document Name
Document Type
Mandatory/Optional
Upload Status
File Name
Upload Date
```

---

# 13. Document Validation

At submission:

```text
IF all mandatory fields completed
AND all mandatory documents uploaded
THEN
    Allow Submit
ELSE
    Display validation errors
```

Example:

> Cannot submit application. Please upload Site Plan and Ownership Document.

For the hackathon, document validation should primarily check:

- File uploaded
- Allowed file type
- File size

OCR/document-content verification should be **out of scope**.

---

# 14. Save Draft

Applicant shall be able to save an incomplete application.

Example:

```text
Application: BP-2026-000123
Status: Draft
Completion: 65%
```

Applicant can return later and continue editing.

---

# 15. Application Submission

After completing mandatory information and documents:

```text
Applicant
     ↓
Review Application
     ↓
Declaration / Confirmation
     ↓
Submit
     ↓
Application Number Generated
     ↓
Town Planning Department
```

After submission, applicant editing shall be disabled unless the application is sent back.

---

# 16. Department Workflow

Each department shall have two roles:

### Checker

Performs detailed scrutiny.

### Approver

Makes the departmental decision.

Example:

```text
Town Planning

Application
    ↓
Checker
    ↓
Checker Decision
    ↓
Approver
    ↓
Department Decision
```

---

# 17. Department Checker Screen

The checker dashboard shall show:

| Application No | Applicant | Project | Received | Status | Action |
|---|---|---|---|---|---|

Checker can open an application.

The application screen shall contain:

### Section 1
Applicant Details

### Section 2
Firm Details

### Section 3
Building Details

### Section 4
Documents

### Section 5
Previous Department Actions

### Section 6
Current Action

---

# 18. Checker Actions

The checker shall have the following actions:

### 1. Send Back

Used when corrections are required.

Remarks shall be mandatory.

Example:

> "Site plan does not contain the required setback dimensions. Please upload revised site plan."

Application status:

```text
Under Scrutiny
       ↓
Sent Back
```

Applicant can edit and resubmit.

---

### 2. Hold

Used when processing cannot continue temporarily.

Remarks shall be mandatory.

Example:

> "Awaiting clarification regarding land ownership."

Status:

```text
On Hold
```

---

### 3. Forward to Approver

Used when scrutiny is satisfactory.

The checker shall enter:

- Remarks
- Recommendation

Example:

```text
Scrutiny completed.
Documents verified.
Recommended for approval.
```

Status:

```text
Checker Completed
        ↓
Pending Approver
```

---

# 19. Department Approver

The approver dashboard shall display applications awaiting departmental decision.

Approver shall see:

- Application details
- Uploaded documents
- Checker remarks
- Previous history
- Current department
- Application timeline

---

# 20. Approver Actions

## Approve

```text
Department Checker
       ↓
Department Approver
       ↓
Approved
       ↓
Next Department
```

If there is another department:

```text
Fire Department
```

If it is the last department:

```text
Final Approved
```

---

## Decline

Decline shall require mandatory remarks.

Example:

> "Proposed construction does not meet the prescribed fire-safety requirement."

Status:

```text
Department Declined
```

The application shall not automatically proceed to the next department.

---

## Hold

Approver can place the application on hold.

Remarks shall be mandatory.

---

## Send Back

If implemented at approver level, the approver can return the application to the applicant/checker depending on the defined business rule.

For the hackathon, I recommend:

> **Approver Send Back → Applicant**

This makes the demonstration easier.

---

# 21. Sequential Department Workflow

The MVP shall use three departments.

### Department 1

**Town Planning**

Checker → Approver

↓

### Department 2

**Fire & Safety**

Checker → Approver

↓

### Department 3

**Environment**

Checker → Approver

↓

### Final Decision

**Permit Approved**

This clearly demonstrates the core value of the solution.

---

# 22. Workflow Rule

The most important business rule:

> **A department cannot process an application until the previous department has completed its approval.**

Example:

```text
Town Planning APPROVED
          ↓
Fire & Safety becomes ACTIVE
          ↓
Fire & Safety APPROVED
          ↓
Environment becomes ACTIVE
          ↓
Environment APPROVED
          ↓
FINAL APPROVED
```

Fire & Safety must not be able to act while Town Planning is still pending.

---

# 23. Send-Back Workflow

Example:

```text
Applicant
   ↓
Town Planning Checker
   ↓
SEND BACK
   ↓
Applicant
   ↓
Edit Application
   ↓
Resubmit
   ↓
Town Planning Checker
```

The system shall preserve the previous remarks and history.

---

# 24. Hold Workflow

Example:

```text
Application
    ↓
Department Checker
    ↓
HOLD
    ↓
On Hold
```

After the issue is resolved:

```text
Resume Processing
       ↓
Under Scrutiny
```

For the hackathon, the department user can have a **Resume** action.

---

# 25. Audit Trail

Every important action shall be recorded.

Example:

| Date/Time | User | Role | Department | Action | Remarks |
|---|---|---|---|---|---|
| 08-Oct 10:00 | Applicant | Applicant | — | Submitted | — |
| 08-Oct 10:20 | Ravi | Checker | Planning | Send Back | Site plan missing |
| 08-Oct 11:15 | Applicant | Applicant | — | Resubmitted | Revised document |
| 08-Oct 12:00 | Ravi | Checker | Planning | Forwarded | Documents verified |
| 08-Oct 12:30 | Amit | Approver | Planning | Approved | Approved |
| 08-Oct 13:00 | Neha | Checker | Fire | Hold | Clarification required |

This audit trail is one of the strongest features to demonstrate to judges.

---

# 26. Common Citizen Module

The citizen does not need to see confidential applicant information.

Citizen can search using:

```text
Application Number
```

Optionally:

```text
Project/Building Name
Location
```

---

# 27. Citizen Tracking Screen

Example:

```text
Building Permit Application

Application No: BP-2026-000123
Project: ABC Commercial Complex
Location: Jaipur

Overall Status:
🟡 Under Department Processing
```

### Department Progress

```text
✓ Town Planning
   Approved

✓ Fire & Safety
   Approved

● Environment
   Under Scrutiny

○ Final Approval
   Pending
```

This provides an excellent visual demonstration.

---

# 28. Citizen Interest

If the problem statement specifically requires citizens interested in a portion/unit of the building, the system may provide:

```text
I am interested in this building
```

The citizen can optionally select:

- Unit/Shop/Flat number
- Portion type
- Contact information
- Interest status

Example:

```text
Project: ABC Commercial Complex

Available Portion:
Shop 101
Shop 102
Office 201

[Express Interest]
```

For the hackathon, this should remain a **secondary feature**, not part of the core permit workflow.

---

# 29. Dashboard

## Applicant Dashboard

```text
My Applications

Total       4
Draft       1
Submitted   1
Under Process 1
Approved    1
```

---

## Department Dashboard

```text
Applications

Pending Scrutiny       12
Pending Approval        5
On Hold                 2
Sent Back               3
Approved Today          4
```

---

## Citizen Dashboard

```text
Track Application

[ Enter Application Number ]

Application Status
Department Progress
Last Updated
```

---

# 30. Application-Wise Report

The system shall provide application-wise reporting.

Columns:

| Application No | Applicant | Project | Current Department | Status | Submitted Date | Last Updated |
|---|---|---|---|---|---|---|

Filters:

- Application Number
- Date
- Department
- Status
- Applicant
- Building Type

---

# 31. Application Detail / Tracking Report

Clicking an application shall display:

```text
Application BP-2026-000123

Applicant
Firm
Building

--------------------------------
Workflow
--------------------------------

✓ Application Submitted
✓ Town Planning Approved
✓ Fire Approved
● Environment Under Scrutiny
○ Final Approval

--------------------------------
Timeline
--------------------------------

08 Oct 10:00
Application Submitted

08 Oct 11:30
Planning Approved

08 Oct 13:00
Fire Approved

08 Oct 13:30
Environment Under Scrutiny
```

---

# 32. Notifications

For the hackathon MVP, notifications can be simulated/displayed inside the application.

Examples:

```text
Application submitted successfully.

Application sent back by Town Planning.

Application approved by Fire & Safety.

Application is currently on hold.

Application finally approved.
```

Email/SMS/WhatsApp integration should be considered **out of scope for the 24-hour MVP**.

---

# 33. Role-Based Access Control

Users shall only see functions applicable to their role.

| Function | Applicant | Checker | Approver | Citizen |
|---|---:|---:|---:|---:|
| Create Application | ✓ | | | |
| Edit Application | ✓ | | | |
| Upload Documents | ✓ | | | |
| Submit | ✓ | | | |
| View Application | ✓ | ✓ | ✓ | Limited |
| Scrutinize | | ✓ | | |
| Send Back | | ✓ | ✓ | |
| Hold | | ✓ | ✓ | |
| Approve | | | ✓ | |
| Decline | | | ✓ | |
| Track Status | ✓ | ✓ | ✓ | ✓ |
| View Audit Trail | ✓ | ✓ | ✓ | Limited |

---

# 34. Core Business Rules

### BR-01 — Mandatory Fields

An application cannot be submitted until all mandatory fields are completed.

### BR-02 — Mandatory Documents

An application cannot be submitted until mandatory documents are uploaded.

### BR-03 — Sequential Processing

A department cannot process an application until the previous department has approved it.

### BR-04 — Remarks

Remarks are mandatory for:

- Send Back
- Hold
- Decline

### BR-05 — Approval

Department approval moves the application to the next department.

### BR-06 — Final Approval

When the final department approves the application:

```text
Application Status = FINAL APPROVED
```

### BR-07 — Decline

If any department declines the application:

```text
Application Status = DECLINED
```

### BR-08 — Send Back

Applicant can edit the application only when it is sent back.

### BR-09 — Audit

Every workflow action shall create an audit record.

### BR-10 — Citizen Privacy

Common citizens shall not see confidential applicant information or internal departmental remarks.

---

# 35. Suggested Data Model

A simple relational model is sufficient.

### USER

```text
UserID
Name
Email
Mobile
Password/AuthenticationID
Role
DepartmentID
Status
```

### APPLICATION

```text
ApplicationID
ApplicationNumber
ApplicantID
ApplicationStatus
CurrentDepartmentID
CurrentRole
SubmissionDate
LastUpdatedDate
```

### APPLICANT

```text
ApplicantID
Name
Mobile
Email
Address
IDProof
```

### FIRM

```text
FirmID
ApplicationID
FirmName
RegistrationNumber
Address
ContactPerson
ContactNumber
GSTNumber
```

### BUILDING

```text
BuildingID
ApplicationID
BuildingName
BuildingType
PlotNumber
Address
Ward
Zone
PlotArea
BuiltUpArea
Floors
Units
EstimatedCost
```

### DOCUMENT

```text
DocumentID
ApplicationID
DocumentType
FileName
FilePath
MandatoryFlag
UploadedBy
UploadedDate
```

### DEPARTMENT

```text
DepartmentID
DepartmentName
Sequence
Active
```

### WORKFLOW_ACTION

```text
ActionID
ApplicationID
DepartmentID
UserID
Action
Remarks
ActionDateTime
FromStatus
ToStatus
```

### CITIZEN_INTEREST

```text
InterestID
ApplicationID
CitizenID
Unit/Portion
Contact
InterestDate
```

---

# 36. Recommended Hackathon Architecture

For the 24-hour implementation, avoid microservices.

```text
                 WEB BROWSER
                     |
                     v
             React / HTML UI
                     |
                     v
              Backend API
                     |
          +----------+----------+
          |                     |
          v                     v
     Application DB        Jira / Workflow
          |                     |
          +----------+----------+
                     |
                     v
               File Storage
```

If Jira is used as the central workflow engine:

```text
                    WEB PORTAL
                        |
                        v
                   Backend API
                        |
             +----------+----------+
             |                     |
             v                     v
       Applicant Data          Jira
             |                     |
             |              Workflow / Status
             |              Assignment
             |              Department Queue
             |              Remarks
             |              History
             |
             v
       Document Storage
```

---

# 37. Jira Mapping

This is where the proposed solution becomes particularly interesting for the hackathon.

Each permit application can be represented as a **Jira issue**.

Example:

```text
BP-2026-000123
```

Jira issue type:

```text
Building Permit
```

### Jira fields

```text
Application Number
Applicant Name
Firm Name
Building Name
Building Type
Location
Plot Area
Built-up Area
Current Department
Current Officer
Application Status
```

Documents can be attached to the Jira issue or stored externally with references.

---

# 38. Jira Workflow

Suggested Jira workflow:

```text
DRAFT
  ↓
SUBMITTED
  ↓
PLANNING CHECK
  ↓
PLANNING APPROVAL
  ↓
FIRE CHECK
  ↓
FIRE APPROVAL
  ↓
ENVIRONMENT CHECK
  ↓
ENVIRONMENT APPROVAL
  ↓
FINAL APPROVED
```

With alternate transitions:

```text
SEND BACK
HOLD
DECLINE
```

This is much more compelling than simply showing Jira as a ticketing system.

The pitch becomes:

> **"We converted a traditionally paper-driven, department-by-department approval process into a transparent workflow-driven permit management system."**

---

# 39. Suggested Jira Workflow States

For the MVP:

```text
Submitted
↓
Planning - Checker
↓
Planning - Approver
↓
Fire - Checker
↓
Fire - Approver
↓
Environment - Checker
↓
Environment - Approver
↓
Final Approved
```

Alternative states:

```text
Send Back
On Hold
Declined
```

The workflow should prevent unauthorized transitions.

---

# 40. Front-End Pages

The hackathon application can be limited to approximately **10 screens**.

### Screen 1 — Login

```text
Email
Password
[Login]
```

### Screen 2 — Applicant Dashboard

```text
My Applications
[New Application]
```

### Screen 3 — New Application

Tabs:

```text
Applicant
Firm
Building
Documents
Review
```

### Screen 4 — Application Details

Displays complete application.

### Screen 5 — Department Dashboard

Shows departmental queue.

### Screen 6 — Department Review

Application + documents + action buttons.

### Screen 7 — Approver Screen

Application + checker recommendation + decision.

### Screen 8 — Citizen Tracking

Application number → status.

### Screen 9 — Application Timeline

Visual workflow.

### Screen 10 — Reports

Filters + application list.

---

# 41. UI Workflow — Applicant

```text
Login
  ↓
Dashboard
  ↓
New Application
  ↓
Applicant Details
  ↓
Firm Details
  ↓
Building Details
  ↓
Documents
  ↓
Review
  ↓
Submit
  ↓
Application Number
  ↓
Track Application
```

---

# 42. UI Workflow — Department

```text
Login
  ↓
Department Dashboard
  ↓
Pending Applications
  ↓
Open Application
  ↓
Review Details
  ↓
Review Documents
  ↓
Action

 ┌─────────────┬────────────┬─────────────┐
 ↓             ↓            ↓             ↓
Send Back     Hold       Forward       Decline
                             ↓
                         Approver
```

---

# 43. UI Workflow — Citizen

```text
Citizen Portal
      ↓
Enter Application Number
      ↓
Search
      ↓
Application Summary
      ↓
Department Progress
      ↓
Current Status
      ↓
Timeline
```

---

# 44. Error Handling

Examples:

### Invalid login

> Invalid username or password.

### Missing mandatory field

> Plot Area is required.

### Missing document

> Site Plan is mandatory.

### Unauthorized action

> You are not authorized to perform this action.

### Incorrect workflow

> This application is currently awaiting Fire Department processing.

---

# 45. Non-Functional Requirements

For the hackathon MVP:

### Performance

Normal page response should ideally be within approximately 2–3 seconds under the demonstration load.

### Security

- Role-based access
- Password authentication
- HTTPS where deployed
- Input validation
- File-type validation

### Availability

The application should remain available during the hackathon demonstration.

### Auditability

All workflow decisions shall be logged.

---

# 46. Out of Scope

To protect the 24-hour timeline, the following should **not** be attempted:

- Aadhaar integration
- Real government API integration
- Real land-record integration
- Payment gateway
- GIS/GIS cadastral integration
- OCR
- AI-based building-plan verification
- Digital signatures
- SMS gateway
- WhatsApp integration
- Production-grade identity verification
- Complex multi-tenancy
- Mobile application
- Microservices architecture
- Real legal approval rules for every building category

These can be shown as **future enhancements**.

---

# 47. MVP Acceptance Criteria

The hackathon solution shall be considered successful if judges can perform this complete demonstration:

### Step 1

Applicant logs in.

### Step 2

Applicant creates a building permit.

### Step 3

Applicant enters:

- Applicant details
- Firm details
- Building details

### Step 4

Applicant uploads mandatory and optional documents.

### Step 5

System prevents submission if mandatory information is missing.

### Step 6

Applicant submits.

### Step 7

System generates:

```text
BP-2026-000001
```

### Step 8

Town Planning Checker opens the application.

### Step 9

Checker sends it back with remarks.

### Step 10

Applicant receives the application back, corrects information/document and resubmits.

### Step 11

Town Planning Checker forwards it.

### Step 12

Town Planning Approver approves.

### Step 13

Application automatically moves to Fire Department.

### Step 14

Fire Checker and Approver process it.

### Step 15

Environment Checker and Approver process it.

### Step 16

Final approval occurs.

### Step 17

Common citizen searches the application number.

### Step 18

Citizen sees:

```text
✓ Planning
✓ Fire
✓ Environment
✓ FINAL APPROVED
```

### Step 19

Application-wise report shows the complete history.

---

# 48. Recommended Hackathon Demonstration Scenario

Use **one deliberately designed application** to demonstrate almost every feature.

```text
Application BP-2026-000001
        |
        v
Planning Checker
        |
        +---- SEND BACK
        |
        v
Applicant Correction
        |
        v
Planning Checker
        |
        v
Planning Approver
        |
        v
APPROVED
        |
        v
Fire Checker
        |
        +---- HOLD
        |
        v
Resume
        |
        v
Fire Approver
        |
        v
APPROVED
        |
        v
Environment Checker
        |
        v
Environment Approver
        |
        v
FINAL APPROVED
```

This single scenario demonstrates:

**Create → Upload → Validation → Submit → Send Back → Edit → Resubmit → Hold → Resume → Sequential Approval → Final Approval → Tracking → Audit Trail.**

That is an extremely strong hackathon demo.

---

# 49. Future Enhancements

Once the MVP is proven, the system can evolve into:

- Configurable departments
- Dynamic workflow configuration
- GIS integration
- Online fee/payment
- Digital signatures
- Aadhaar/eKYC
- Automated document verification
- Building-plan AI analysis
- SMS/WhatsApp notifications
- SLA monitoring
- Escalation management
- Mobile application
- Public project dashboard
- Integration with municipal/government systems
- Analytics and predictive approval timelines

---

# 50. Success Metrics

The proposed system should demonstrate measurable improvement in:

1. **Application transparency**
2. **Processing visibility**
3. **Department accountability**
4. **Reduction in manual follow-up**
5. **Reduced application-return cycles**
6. **Traceability of decisions**
7. **Citizen access to status information**

The strongest value proposition is not merely "online form submission".

It is:

> **End-to-end transparent workflow orchestration across multiple departments.**

---

# 51. Final MVP Definition

The minimum viable product should therefore contain:

```text
                    BUILDING PERMIT PORTAL
                              |
          +-------------------+-------------------+
          |                   |                   |
          v                   v                   v
      APPLICANT          DEPARTMENT          CITIZEN
          |                   |                   |
      Application         Checker              Search
      Documents           Approver             Status
      Submission          Remarks              Timeline
          |                   |                   |
          +-------------------+-------------------+
                              |
                              v
                     WORKFLOW ENGINE
                              |
             +----------------+----------------+
             |                |                |
          PLANNING           FIRE          ENVIRONMENT
             |                |                |
          Checker          Checker          Checker
          Approver         Approver         Approver
             |                |                |
             +----------------+----------------+
                              |
                              v
                       FINAL APPROVAL
```

**Recommended implementation philosophy:** build a thin, polished web interface and let Jira handle as much of the workflow, assignment, status and history as practical. The students should spend their limited 24 hours on the **user journey, workflow logic, validation, dashboard and demonstration**, rather than reinventing authentication, ticketing and workflow infrastructure.