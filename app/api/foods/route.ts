import { ObjectId } from "mongodb";
import getMongoClient from "@/lib/mongodb";

const DB_NAME = "liftlog";
const COLLECTION_NAME = "foods";

type FoodDocument = {
  _id?: ObjectId;
  userId: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  createdAt: string;
  updatedAt?: string;
};

function isValidNumber(value: unknown) {
  return typeof value === "number" && !Number.isNaN(value);
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return Response.json({ error: "Missing userId." }, { status: 400 });
    }

    const client = await getMongoClient();
    const db = client.db(DB_NAME);

    const foods = await db
      .collection<FoodDocument>(COLLECTION_NAME)
      .find({ userId })
      .sort({ createdAt: -1 })
      .toArray();

    const formattedFoods = foods.map((food) => ({
      id: food._id?.toString() ?? "",
      name: food.name,
      calories: food.calories,
      protein: food.protein,
      carbs: food.carbs,
      fats: food.fats,
      createdAt: food.createdAt,
    }));

    return Response.json(formattedFoods);
  } catch (error) {
    console.error("GET /api/foods error:", error);
    return Response.json({ error: "Failed to fetch food logs." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { userId, name, calories, protein, carbs, fats } = body ?? {};

    if (!userId || !name) {
      return Response.json(
        { error: "userId and name are required." },
        { status: 400 }
      );
    }

    if (
      !isValidNumber(calories) ||
      !isValidNumber(protein) ||
      !isValidNumber(carbs) ||
      !isValidNumber(fats)
    ) {
      return Response.json(
        { error: "Calories, protein, carbs, and fats must be valid numbers." },
        { status: 400 }
      );
    }

    const client = await getMongoClient();
    const db = client.db(DB_NAME);

    const newFood: FoodDocument = {
      userId,
      name: String(name).trim(),
      calories,
      protein,
      carbs,
      fats,
      createdAt: new Date().toISOString(),
    };

    await db.collection<FoodDocument>(COLLECTION_NAME).insertOne(newFood);

    return Response.json({ message: "Food logged successfully." });
  } catch (error) {
    console.error("POST /api/foods error:", error);
    return Response.json({ error: "Failed to log food." }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();

    const { id, userId, name, calories, protein, carbs, fats } = body ?? {};

    if (!id || !userId || !name) {
      return Response.json(
        { error: "id, userId, and name are required." },
        { status: 400 }
      );
    }

    if (
      !isValidNumber(calories) ||
      !isValidNumber(protein) ||
      !isValidNumber(carbs) ||
      !isValidNumber(fats)
    ) {
      return Response.json(
        { error: "Calories, protein, carbs, and fats must be valid numbers." },
        { status: 400 }
      );
    }

    if (!ObjectId.isValid(id)) {
      return Response.json({ error: "Invalid food log id." }, { status: 400 });
    }

    const client = await getMongoClient();
    const db = client.db(DB_NAME);

    const result = await db.collection<FoodDocument>(COLLECTION_NAME).updateOne(
      {
        _id: new ObjectId(id),
        userId,
      },
      {
        $set: {
          name: String(name).trim(),
          calories,
          protein,
          carbs,
          fats,
          updatedAt: new Date().toISOString(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return Response.json(
        { error: "Food log not found." },
        { status: 404 }
      );
    }

    return Response.json({ message: "Food log updated successfully." });
  } catch (error) {
    console.error("PUT /api/foods error:", error);
    return Response.json({ error: "Failed to update food log." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json();

    const { id, userId } = body ?? {};

    if (!id || !userId) {
      return Response.json(
        { error: "id and userId are required." },
        { status: 400 }
      );
    }

    if (!ObjectId.isValid(id)) {
      return Response.json({ error: "Invalid food log id." }, { status: 400 });
    }

    const client = await getMongoClient();
    const db = client.db(DB_NAME);

    const result = await db.collection<FoodDocument>(COLLECTION_NAME).deleteOne({
      _id: new ObjectId(id),
      userId,
    });

    if (result.deletedCount === 0) {
      return Response.json(
        { error: "Food log not found." },
        { status: 404 }
      );
    }

    return Response.json({ message: "Food log deleted successfully." });
  } catch (error) {
    console.error("DELETE /api/foods error:", error);
    return Response.json({ error: "Failed to delete food log." }, { status: 500 });
  }
}