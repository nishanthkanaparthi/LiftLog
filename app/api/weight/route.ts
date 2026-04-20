import getMongoClient from "@/lib/mongodb";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return Response.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const client = await getMongoClient();
    const db = client.db("liftlog");

    const latestWeight = await db.collection("weights").findOne(
      { userId },
      { sort: { createdAt: -1 } }
    );

    if (!latestWeight) {
      return Response.json({ weight: 0 });
    }

    return Response.json({
      weight: latestWeight.weight ?? 0,
    });
  } catch (error) {
    console.error("GET /api/weight error:", error);

    return Response.json(
      {
        error: "Failed to load weight",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, weight } = body;

    if (!userId) {
      return Response.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    if (typeof weight !== "number") {
      return Response.json(
        { error: "Weight must be a number" },
        { status: 400 }
      );
    }

    if (weight <= 0) {
      return Response.json(
        { error: "Weight must be greater than 0" },
        { status: 400 }
      );
    }

    const client = await getMongoClient();
    const db = client.db("liftlog");

    const result = await db.collection("weights").insertOne({
      userId,
      weight,
      createdAt: new Date(),
    });

    return Response.json({
      message: "Weight saved successfully",
      id: result.insertedId.toString(),
    });
  } catch (error) {
    console.error("POST /api/weight error:", error);

    return Response.json(
      {
        error: "Failed to save weight",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}