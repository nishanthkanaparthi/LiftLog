import getMongoClient from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await getMongoClient();
    const db = client.db("liftlog");

    await db.command({ ping: 1 });

    return Response.json({ message: "Connected to MongoDB ✅" });
  } catch (error) {
    console.error("MongoDB connection error:", error);

    return Response.json(
      {
        error: "Connection failed ❌",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}