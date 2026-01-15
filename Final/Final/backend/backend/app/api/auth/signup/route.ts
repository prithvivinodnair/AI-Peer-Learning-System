import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { db } from "@/src/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password, expertise, bio } = body;

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const [existing]: any = await db.query(
      "SELECT id FROM users WHERE email = ? LIMIT 1",
      [email]
    );

    if (existing.length > 0) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
      );
    }

    // Hash password
    const password_hash = await hash(password, 12);

    // Insert new user with expertise and bio
    const [result]: any = await db.query(
      `INSERT INTO users (name, email, password, expertise, bio, total_credits) 
       VALUES (?, ?, ?, ?, ?, 100)`,
      [name, email, password_hash, expertise || "", bio || ""]
    );

    return NextResponse.json(
      {
        message: "User created successfully",
        userId: result.insertId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
