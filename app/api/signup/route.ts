import getMongoClient from "@/lib/mongodb";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return Response.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const client = await getMongoClient();
    const db = client.db("liftlog");

    const existingUser = await db.collection("users").findOne({ email });

    if (existingUser) {
      return Response.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      name,
      email,
      password: hashedPassword,
      createdAt: new Date(),
    };

    const result = await db.collection("users").insertOne(newUser);

    return Response.json({
      message: "User created successfully",
      userId: result.insertedId.toString(),
    });
  } catch (error) {
    console.error("Signup error:", error);

    return Response.json(
      { error: "Signup failed" },
      { status: 500 }
    );
  }
}