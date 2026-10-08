import { env } from "cloudflare:workers";

export type Role =
  | "applicant"
  | "checker"
  | "approver"
  | "citizen"
  | "admin";

export function normalizeRole(value?: string | null): Role {
  const role = (value ?? "applicant").toLowerCase();
  if (["applicant", "checker", "approver", "citizen", "admin"].includes(role)) {
    return role as Role;
  }
  return "applicant";
}

export function safeParseJson<T>(payload: string | null | undefined): T | null {
  if (!payload) return null;
  try {
    return JSON.parse(payload) as T;
  } catch {
    return null;
  }
}


export function getDatabase() {
  const database = env.database;
  if (!database) {
    throw new Error("D1 database binding is missing.");
  }
  return database;
}

export async function ensureAuthTablesReady(database: D1Database = getDatabase()) {
  const statements = [
    `CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT,
      mobile TEXT,
      name TEXT,
      avatar TEXT,
      role TEXT NOT NULL DEFAULT 'applicant',
      department_id INTEGER,
      status TEXT NOT NULL DEFAULT 'active',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`,
    `CREATE INDEX IF NOT EXISTS idx_users_mobile ON users(mobile)`,
  ];

  for (const statement of statements) {
    const trimmed = statement.trim();
    if (!trimmed) continue;
    await database.prepare(trimmed).run();
  }

  const tableInfo = await database.prepare("PRAGMA table_info(users)").all<{ name: string }>();
  const columns = new Set(tableInfo.results.map((column) => column.name));

  const pendingColumns: Array<[string, string]> = [
    ["mobile", "TEXT"],
    ["avatar", "TEXT"],
    ["department_id", "INTEGER"],
    ["status", "TEXT DEFAULT 'active'"],
    ["updated_at", "TEXT DEFAULT CURRENT_TIMESTAMP"],
  ];

  for (const [columnName, columnType] of pendingColumns) {
    if (!columns.has(columnName)) {
      await database.prepare(`ALTER TABLE users ADD COLUMN ${columnName} ${columnType}`).run();
    }
  }
}

export function getBearerToken(request: Request): string | null {
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice("Bearer ".length).trim();
  }

  const url = new URL(request.url);
  return url.searchParams.get("token");
}

export async function getSessionUser(database: D1Database, uid: string): Promise<null | { id: string; email: string; name: string | null; role: Role; mobile?: string | null; department_id?: number | null; department_name?: string | null }> {
  if (!uid) return null;

  const user = await database
    .prepare(
      `
        SELECT u.id, u.email, u.name, u.role, u.mobile, u.department_id, d.name as department_name
        FROM users u
        LEFT JOIN departments d ON u.department_id = d.id
        WHERE u.id = ?
      `
    )
    .bind(uid)
    .first<{
      id: string;
      email: string;
      name: string | null;
      role: string;
      mobile: string | null;
      department_id: number | null;
      department_name: string | null;
    }>();

  if (!user) return null;

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: normalizeRole(user.role),
    mobile: user.mobile,
    department_id: user.department_id,
    department_name: user.department_name,
  };
}
