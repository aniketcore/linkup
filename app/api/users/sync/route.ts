import { env } from "cloudflare:workers";
import { ensureAuthTablesReady, normalizeRole } from "../../../lib/auth";

export async function POST(request: Request) {
  const database = env.database;

  if (!database) {
    return Response.json(
      {
        ok: false,
        error: "D1 database binding is missing.",
      },
      { status: 500 }
    );
  }

  try {
    await ensureAuthTablesReady(database);

    const body = (await request.json()) as Partial<{
      id: string;
      email: string;
      mobile: string;
      name: string;
      avatar: string;
      role: string;
      password_hash: string;
      password_salt: string;
      department_id: number | null;
      status: string;
    }>;

    const id = body.id?.trim();
    const email = body.email?.trim();
    const mobile = body.mobile?.trim();

    if (!id || !email) {
      return Response.json(
        {
          ok: false,
          error: "User id and email are required.",
        },
        { status: 400 }
      );
    }

    const role = normalizeRole(body.role ?? "applicant");
    const name = body.name?.trim() || "User";
    const avatar = body.avatar?.trim() || null;
    const departmentId = typeof body.department_id === "number" ? body.department_id : null;
    const passwordHash = body.password_hash?.trim() || "";
    const passwordSalt = body.password_salt?.trim() || "";
    const status = (body.status ?? "active").trim() || "active";

    if (!passwordHash || !passwordSalt) {
      return Response.json(
        {
          ok: false,
          error: "Password hash and salt are required for user sync.",
        },
        { status: 400 }
      );
    }

    const result = await database
      .prepare(
        `
          INSERT INTO users (
            id,
            email,
            mobile,
            name,
            avatar,
            role,
            department_id,
            password_hash,
            password_salt,
            status,
            updated_at
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
          ON CONFLICT(id) DO UPDATE SET
            email = excluded.email,
            mobile = excluded.mobile,
            name = excluded.name,
            avatar = excluded.avatar,
            role = excluded.role,
            department_id = excluded.department_id,
            password_hash = excluded.password_hash,
            password_salt = excluded.password_salt,
            status = excluded.status,
            updated_at = CURRENT_TIMESTAMP
        `
      )
      .bind(
        id,
        email,
        mobile || null,
        name,
        avatar,
        role,
        departmentId,
        passwordHash,
        passwordSalt,
        status
      )
      .run();

    const existingUser = await database
      .prepare(
        `
          SELECT id, email, mobile, name, avatar, role, department_id, status
          FROM users
          WHERE id = ?
        `
      )
      .bind(id)
      .first<{
        id: string;
        email: string;
        mobile: string | null;
        name: string | null;
        avatar: string | null;
        role: string;
        department_id: number | null;
        status: string;
      }>();

    return Response.json({
      ok: true,
      user: existingUser,
      meta: result,
    });
  } catch (error) {
    return Response.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
