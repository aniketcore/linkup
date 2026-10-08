import { ensureAuthTablesReady, getDatabase } from "../../../lib/auth";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<{ uid: string }>;

    if (!body.uid) {
      return Response.json({ ok: false, error: "Firebase UID is required." }, { status: 400 });
    }

    const database = getDatabase();
    await ensureAuthTablesReady(database);
    
    const user = await database
      .prepare(
        `SELECT id, email, mobile, name, role, status
         FROM users
         WHERE id = ?`
      )
      .bind(body.uid)
      .first();

    if (!user) {
      return Response.json({ ok: false, error: "User not found in our database." }, { status: 401 });
    }

    return Response.json({
      ok: true,
      user,
      sessionToken: body.uid, // Using UID as token
    });
  } catch (error) {
    return Response.json(
      { ok: false, error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
