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

    const goals = await db.collection("goals").findOne({ userId });

    if (!goals) {
      return Response.json({
        calorieGoal: 0,
        proteinGoal: 0,
        carbGoal: 0,
        fatGoal: 0,
        weightGoal: 0,
      });
    }

    return Response.json({
      calorieGoal: goals.calorieGoal ?? 0,
      proteinGoal: goals.proteinGoal ?? 0,
      carbGoal: goals.carbGoal ?? 0,
      fatGoal: goals.fatGoal ?? 0,
      weightGoal: goals.weightGoal ?? 0,
    });
  } catch (error) {
    console.error("GET /api/goals error:", error);

    return Response.json(
      {
        error: "Failed to load goals",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      userId,
      calorieGoal,
      proteinGoal,
      carbGoal,
      fatGoal,
      weightGoal,
    } = body;

    if (!userId) {
      return Response.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    if (
      typeof calorieGoal !== "number" ||
      typeof proteinGoal !== "number" ||
      typeof carbGoal !== "number" ||
      typeof fatGoal !== "number" ||
      typeof weightGoal !== "number"
    ) {
      return Response.json(
        { error: "All goal values must be numbers" },
        { status: 400 }
      );
    }

    const client = await getMongoClient();
    const db = client.db("liftlog");

    await db.collection("goals").updateOne(
      { userId },
      {
        $set: {
          userId,
          calorieGoal,
          proteinGoal,
          carbGoal,
          fatGoal,
          weightGoal,
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    );

    return Response.json({ message: "Goals saved successfully" });
  } catch (error) {
    console.error("POST /api/goals error:", error);

    return Response.json(
      {
        error: "Failed to save goals",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}