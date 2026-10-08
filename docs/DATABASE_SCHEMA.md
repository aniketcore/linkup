# BPAMS Database Schema Documentation

This document outlines the SQLite (Cloudflare D1) database schema used for the Building Permit Approval Management System (BPAMS).

## Core Tables

### 1. `departments`
Stores the sequential workflow stages (departments) that an application must pass through.
- **Columns**: `id`, `name`, `slug`, `sort_order`
- **Key Index**: `idx_departments_sort` on `(sort_order)` - Crucial for determining the next department in the routing chain.

### 2. `users`
Stores user identities (Firebase UIDs) and their Role-Based Access Control (RBAC).
- **Columns**: `id` (Firebase UID), `name`, `email`, `mobile`, `role`, `department_id`, `status`
- **Roles**: `applicant`, `checker`, `approver`, `admin`, `citizen`
- **Key Index**: `idx_users_role_dept` on `(role, department_id)`

### 3. `applications`
The central state machine record for a building permit. Populates the Kanban board.
- **Columns**: `id`, `application_number`, `applicant_user_id`, `status`, `current_department_id`, `current_stage`
- **Statuses**: `draft`, `needs_correction`, `scrutiny`, `awaiting_approval`, `approved`
- **Key Indexes**: 
  - `idx_apps_dept_status` on `(current_department_id, status)` - Optimizes Kanban column fetching for Checkers/Approvers.
  - `idx_apps_applicant` on `(applicant_user_id)` - Optimizes dashboard loading for Applicants.

### 4. `documents`
Maps uploaded R2 files to their respective applications.
- **Columns**: `id`, `application_id`, `document_type`, `file_name`, `storage_key` (Cloudflare R2 Object Key), `file_url`, `status`
- **Key Index**: `idx_documents_app_id` on `(application_id)` - Ensures fast retrieval of all attachments for a specific permit.

### 5. `workflow_actions`
An immutable audit log tracking every transition, approval, and rejection.
- **Columns**: `id`, `application_id`, `actor_user_id`, `department_id`, `action_type`, `remarks`, `metadata`
- **Key Index**: `idx_workflow_app_id` on `(application_id)`

## Sub-Entity Tables
These tables hold denormalized, specialized data for the application to prevent wide schemas:
- `applicant_profiles`: Personal details of the applicant (address, ID proof).
- `firm_details`: Company details if applying as a firm (GST, registration).
- `building_details`: Specifics of the construction (plot area, floors, zone).

> [!NOTE]
> All tables include `created_at` and `updated_at` timestamps. All primary keys are `TEXT` (UUIDs) except for standard reference tables like `departments`.
