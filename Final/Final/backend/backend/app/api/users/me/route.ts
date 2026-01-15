import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/auth.config";
import { db } from "@/src/lib/db";

// =========================
// GET USER PROFILE
// =========================
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [rows]: any = await db.query(
    `SELECT 
        id, 
        name, 
        email, 
        profile_pic, 
        expertise, 
        bio,
        credits_earned,
        credits_spent,
        total_credits,
        created_at
     FROM users 
     WHERE id = ?`,
    [session.user.id]
  );

  return NextResponse.json(rows?.[0] ?? null);
}

// =========================
// UPDATE USER PROFILE
// =========================
export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name, profile_pic, expertise, bio } = await req.json();

  await db.query(
    `UPDATE users 
     SET name=?, profile_pic=?, expertise=?, bio=?
     WHERE id=?`,
    [
      name,
      profile_pic || null,
      expertise || "",
      bio || "",
      session.user.id
    ]
  );

  return NextResponse.json({ message: "Profile updated" });
}
