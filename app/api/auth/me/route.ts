import { ensureAuthTablesReady, getBearerToken, getDatabase, getSessionUser } from "../../../lib/auth";

export async function GET(request: Request) {
  try {
    const token = getBearerToken(request);
    if (!token) {
      return Response.json(
        {
          ok: false,
          error: "Authentication required.",
        },
        { status: 401 }
      );
    }

    const database = getDatabase();
    await ensureAuthTablesReady(database);
    const user = await getSessionUser(database, token);
    if (!user) {
      return Response.json(
        {
          ok: false,
          error: "Session expired or invalid.",
        },
        { status: 401 }
      );
    }

    return Response.json({ ok: true, user });
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
