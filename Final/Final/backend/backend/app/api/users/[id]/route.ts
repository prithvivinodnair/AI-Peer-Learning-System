import { NextResponse, NextRequest } from "next/server";
import { db } from "@/src/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const role = searchParams.get("role");

  let query = "SELECT * FROM users";
  const params: any[] = [];

  if (role) {
    query += " WHERE role = ?";
    params.push(role);
  }

  const [rows] = await db.query(query, params);
  return NextResponse.json(rows);
}
