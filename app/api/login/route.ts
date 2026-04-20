import getMongoClient from "@/lib/mongodb";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return Response.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const client = await getMongoClient();
    const db = client.db("liftlog");

    const user = await db.collection("users").findOne({ email });

    if (!user) {
      return Response.json(
        { error: "Invalid email or password" },
        { status: 400 }
      );
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return Response.json(
        { error: "Invalid email or password" },
        { status: 400 }
      );
    }

    return Response.json({
      message: "Login successful",
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return Response.json(
      { error: "Login failed" },
      { status: 500 }
    );
  }
}