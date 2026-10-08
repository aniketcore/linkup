import { env } from "cloudflare:workers";

export type DepartmentRecord = {
  id: number;
  name: string;
  slug: string;
  sort_order: number;
};

export type WorkflowActionInput = {
  applicationId: string;
  actorUserId?: string | null;
  departmentId?: number | null;
  actionType: string;
  actionLabel: string;
  remarks?: string | null;
  metadata?: Record<string, unknown> | null;
};

export async function getDatabase(): Promise<D1Database> {
  const database = env.database;

  if (!database) {
    throw new Error("D1 database binding is missing.");
  }

  return database;
}

async function execSqlStatements(database: D1Database, statements: string[]) {
  for (const statement of statements) {
    const trimmed = statement.trim();
    if (!trimmed) continue;
    await database.prepare(trimmed).run();
  }
}

export async function ensureDatabaseReady() {
  const database = await getDatabase();

  await execSqlStatements(database, [
    `CREATE TABLE IF NOT EXISTS departments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      slug TEXT NOT NULL UNIQUE,
      sort_order INTEGER NOT NULL UNIQUE,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT,
      email TEXT,
      mobile TEXT,
      role TEXT NOT NULL DEFAULT 'applicant',
      department_id INTEGER,
      status TEXT NOT NULL DEFAULT 'active',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (department_id) REFERENCES departments(id)
    )`,
    `CREATE TABLE IF NOT EXISTS applications (
      id TEXT PRIMARY KEY,
      application_number TEXT NOT NULL UNIQUE,
      applicant_user_id TEXT,
      status TEXT NOT NULL DEFAULT 'Draft',
      current_department_id INTEGER,
      current_stage TEXT NOT NULL DEFAULT 'applicant',
      submission_date TEXT,
      last_updated_date TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      remarks TEXT,
      FOREIGN KEY (applicant_user_id) REFERENCES users(id),
      FOREIGN KEY (current_department_id) REFERENCES departments(id)
    )`,
    `CREATE TABLE IF NOT EXISTS applicant_profiles (
      id TEXT PRIMARY KEY,
      application_id TEXT NOT NULL UNIQUE,
      applicant_name TEXT,
      applicant_type TEXT,
      mobile TEXT,
      email TEXT,
      address TEXT,
      city TEXT,
      state TEXT,
      pin_code TEXT,
      id_proof_number TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (application_id) REFERENCES applications(id)
    )`,
    `CREATE TABLE IF NOT EXISTS firm_details (
      id TEXT PRIMARY KEY,
      application_id TEXT NOT NULL UNIQUE,
      firm_name TEXT,
      registration_number TEXT,
      firm_address TEXT,
      contact_person TEXT,
      contact_number TEXT,
      email TEXT,
      gst_number TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (application_id) REFERENCES applications(id)
    )`,
    `CREATE TABLE IF NOT EXISTS building_details (
      id TEXT PRIMARY KEY,
      application_id TEXT NOT NULL UNIQUE,
      project_name TEXT,
      building_type TEXT,
      plot_number TEXT,
      address TEXT,
      city TEXT,
      ward TEXT,
      zone TEXT,
      plot_area TEXT,
      built_up_area TEXT,
      floors TEXT,
      units TEXT,
      estimated_cost TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (application_id) REFERENCES applications(id)
    )`,
    `CREATE TABLE IF NOT EXISTS documents (
      id TEXT PRIMARY KEY,
      application_id TEXT NOT NULL,
      document_type TEXT NOT NULL,
      file_name TEXT,
      storage_key TEXT,
      file_url TEXT,
      uploaded_by TEXT,
      status TEXT NOT NULL DEFAULT 'uploaded',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (application_id) REFERENCES applications(id)
    )`,
    `CREATE TABLE IF NOT EXISTS workflow_actions (
      id TEXT PRIMARY KEY,
      application_id TEXT NOT NULL,
      actor_user_id TEXT,
      department_id INTEGER,
      action_type TEXT NOT NULL,
      action_label TEXT,
      remarks TEXT,
      metadata TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (application_id) REFERENCES applications(id),
      FOREIGN KEY (department_id) REFERENCES departments(id)
    )`,
    `CREATE INDEX IF NOT EXISTS idx_departments_sort ON departments(sort_order)`,
    `CREATE INDEX IF NOT EXISTS idx_users_role_dept ON users(role, department_id)`,
    `CREATE INDEX IF NOT EXISTS idx_apps_dept_status ON applications(current_department_id, status)`,
    `CREATE INDEX IF NOT EXISTS idx_apps_applicant ON applications(applicant_user_id)`,
    `CREATE INDEX IF NOT EXISTS idx_documents_app_id ON documents(application_id)`,
    `CREATE INDEX IF NOT EXISTS idx_workflow_app_id ON workflow_actions(application_id)`
  ]);

  await seedDefaultDepartments(database);

  return database;
}

export async function seedDefaultDepartments(database: D1Database) {
  const defaultDepartments = [
    { name: "Town Planning Department", slug: "town-planning", sort_order: 1 },
    { name: "Fire & Safety Department", slug: "fire-safety", sort_order: 2 },
    { name: "Environment Department", slug: "environment", sort_order: 3 },
  ];

  for (const department of defaultDepartments) {
    await database
      .prepare(
        `
          INSERT OR IGNORE INTO departments (name, slug, sort_order)
          VALUES (?, ?, ?)
        `
      )
      .bind(department.name, department.slug, department.sort_order)
      .run();
  }
}

export async function getDepartments() {
  const database = await ensureDatabaseReady();
  const result = await database
    .prepare(`SELECT * FROM departments ORDER BY sort_order ASC`)
    .all<DepartmentRecord>();

  return result.results;
}

export async function getDepartmentById(departmentId: number) {
  const database = await ensureDatabaseReady();
  const row = await database
    .prepare(`SELECT * FROM departments WHERE id = ?`)
    .bind(departmentId)
    .first<DepartmentRecord>();

  return row ?? null;
}

export async function getDepartmentBySlug(slug: string) {
  const database = await ensureDatabaseReady();
  const row = await database
    .prepare(`SELECT * FROM departments WHERE slug = ?`)
    .bind(slug)
    .first<DepartmentRecord>();

  return row ?? null;
}

export async function getFirstDepartment() {
  const database = await ensureDatabaseReady();
  const row = await database
    .prepare(`SELECT * FROM departments ORDER BY sort_order ASC LIMIT 1`)
    .first<DepartmentRecord>();

  return row ?? null;
}

export async function getNextDepartment(currentDepartmentId: number | null) {
  if (!currentDepartmentId) {
    return null;
  }

  const database = await ensureDatabaseReady();
  const row = await database
    .prepare(
      `SELECT * FROM departments WHERE sort_order = (
        SELECT MIN(sort_order) FROM departments WHERE sort_order > (
          SELECT sort_order FROM departments WHERE id = ?
        )
      )`
    )
    .bind(currentDepartmentId)
    .first<DepartmentRecord>();

  return row ?? null;
}

export async function generateApplicationNumber(database: D1Database) {
  const year = new Date().getFullYear();
  const result = await database
    .prepare(
      `
        SELECT application_number
        FROM applications
        WHERE application_number LIKE ?
        ORDER BY application_number DESC
        LIMIT 1
      `
    )
    .bind(`BP-${year}-%`)
    .all<{ application_number: string }>();

  const latestNumber = result.results[0]?.application_number;
  let nextSequence = 1;

  if (latestNumber) {
    const matched = latestNumber.match(/BP-\d{4}-(\d{6})$/);
    if (matched) {
      nextSequence = Number(matched[1]) + 1;
    }
  }

  return `BP-${year}-${String(nextSequence).padStart(6, "0")}`;
}

export async function insertWorkflowAction(
  database: D1Database,
  payload: WorkflowActionInput
) {
  const id = crypto.randomUUID();
  const remarkText = payload.remarks ?? null;
  const metadataText = payload.metadata ? JSON.stringify(payload.metadata) : null;

  await database
    .prepare(
      `
        INSERT INTO workflow_actions (
          id, application_id, actor_user_id, department_id, action_type, action_label, remarks, metadata
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `
    )
    .bind(
      id,
      payload.applicationId,
      payload.actorUserId ?? null,
      payload.departmentId ?? null,
      payload.actionType,
      payload.actionLabel,
      remarkText,
      metadataText
    )
    .run();

  return id;
}

export function hasValue(value: unknown) {
  return typeof value === "string" ? value.trim() !== "" : value != null;
}

export function normalizeNumberString(value: unknown) {
  return typeof value === "string" || typeof value === "number" ? String(value).trim() : "";
}
