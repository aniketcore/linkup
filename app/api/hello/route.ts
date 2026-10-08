export async function GET(_request: Request, env: Cloudflare.Env) {
  const database = env.database;

  if (!database) {
    return Response.json({
      message: "D1 binding is not configured yet.",
      binding: "database",
      database: "linkup-db",
    });
  }

  try {
    const result = await database.prepare("SELECT 1 as ok").first<{ ok: number }>();

    return Response.json({
      message: "D1 is bound and responding.",
      binding: "database",
      database: "linkup-db",
      result,
    });
  } catch (error) {
    return Response.json(
      {
        message: "The D1 binding exists, but the database is not reachable yet.",
        binding: "database",
        database: "linkup-db",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
