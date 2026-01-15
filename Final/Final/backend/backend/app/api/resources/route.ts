import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { db } from "@/src/lib/db";

export async function GET() {
  const session = await getServerSession();
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [rows] = await db.query(
    `SELECT id, title, url, image_url, created_at
     FROM blog_posts
     ORDER BY created_at DESC`
  );

  return NextResponse.json(rows);
}
