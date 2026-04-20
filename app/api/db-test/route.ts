import getMongoClient from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await getMongoClient();
    const adminDb = client.db("admin");
    const result = await adminDb.command({ ping: 1 });

    return Response.json({
      ok: true,
      ping: result,
    });
  } catch (error) {
    console.error("GET /api/db-test error:", error);

    return Response.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Unknown error",
        name: error instanceof Error ? error.name : "UnknownError",
      },
      { status: 500 }
    );
  }
}