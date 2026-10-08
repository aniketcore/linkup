import { ensureAuthTablesReady, getDatabase, normalizeRole } from "../../../lib/auth";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<{
      uid: string;
      name: string;
      email: string;
      mobile: string;
      role: string;
      department_id?: number | null;
    }>;

    const uid = body.uid;
    const name = body.name?.trim();
    const email = body.email?.trim().toLowerCase();
    const mobile = body.mobile?.trim();

    if (!uid || !name || !email) {
      return Response.json(
        { ok: false, error: "UID, name, and email are required." },
        { status: 400 }
      );
    }

    const database = getDatabase();
    await ensureAuthTablesReady(database);

    const existing = await database
      .prepare(`SELECT id FROM users WHERE email = ? OR mobile = ? OR id = ?`)
      .bind(email, mobile || "", uid)
      .first<{ id: string }>();

    if (existing) {
      return Response.json(
        { ok: false, error: "A user with this email, mobile or UID already exists." },
        { status: 409 }
      );
    }

    const role = normalizeRole(body.role);

    await database
      .prepare(
        `INSERT INTO users (
            id, email, mobile, name, role, department_id, status, created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, 'active', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`
      )
      .bind(
        uid,
        email,
        mobile || null,
        name,
        role,
        typeof body.department_id === "number" ? body.department_id : null
      )
      .run();

    return Response.json({
      ok: true,
      user: {
        id: uid,
        email,
        mobile,
        name,
        role,
        status: "active",
      },
      sessionToken: uid,
    });
  } catch (error) {
    return Response.json(
      { ok: false, error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
