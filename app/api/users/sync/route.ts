export async function POST(request: Request, env: Cloudflare.Env) {
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
    const body = (await request.json()) as Partial<{
      id: string;
      email: string;
      name: string;
      avatar: string;
      role: string;
    }>;

    const id = body.id?.trim();
    const email = body.email?.trim();

    if (!id || !email) {
      return Response.json(
        {
          ok: false,
          error: "User id and email are required.",
        },
        { status: 400 }
      );
    }

    await database
      .prepare(`
        CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY,
          email TEXT NOT NULL UNIQUE,
          name TEXT,
          avatar TEXT,
          role TEXT NOT NULL DEFAULT 'member',
          created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
      `)
      .run();

    const role = (body.role ?? "member").trim() || "member";
    const name = body.name?.trim() || "User";
    const avatar = body.avatar?.trim() || null;

    const result = await database
      .prepare(
        `
          INSERT INTO users (id, email, name, avatar, role, updated_at)
          VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
          ON CONFLICT(id) DO UPDATE SET
            email = excluded.email,
            name = excluded.name,
            avatar = excluded.avatar,
            role = excluded.role,
            updated_at = CURRENT_TIMESTAMP
        `
      )
      .bind(id, email, name, avatar, role)
      .run();

    return Response.json({
      ok: true,
      user: {
        id,
        email,
        name,
        avatar,
        role,
      },
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
