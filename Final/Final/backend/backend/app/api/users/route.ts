import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/auth.config";
import { db } from "@/src/lib/db";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const role = new URL(req.url).searchParams.get("role");

  // Include fields needed by Find Partners page
  let query = "SELECT id, name, email, profile_pic, expertise, bio FROM users";
  const params: any[] = [];

  // Note: role column doesn't exist in current schema
  // if (role) {
  //   query += " WHERE role = ?";
  //   params.push(role);
  // }

  const [rows] = await db.query(query, params);
  return NextResponse.json(rows);
}
