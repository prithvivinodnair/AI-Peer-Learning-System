import { NextResponse } from "next/server";
import { db } from "@/src/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/auth.config";
import { createNotification } from "@/src/lib/notifications";

// GET all requests for logged-in user (student or tutor)
export async function GET() {
  // Return all requests, no user filtering
  const [rows] = await db.query(
    `SELECT * FROM requests ORDER BY created_at DESC`
  );

  return NextResponse.json(rows);
}

// POST create a new request
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { subject, message } = await req.json();

  if (!subject || !message) {
    return NextResponse.json({ error: "Subject and message are required" }, { status: 400 });
  }

  const [result]: any = await db.query(
    `INSERT INTO requests (student_id, tutor_id, subject, message)
     VALUES (?, NULL, ?, ?)`,
    [session.user.id, subject, message]
  );

  // Fetch the newly created request
  const [newRequest]: any = await db.query(
    `SELECT * FROM requests WHERE id = ?`,
    [result.insertId]
  );

  // Create notification for the user who created the request
  await createNotification({
    userId: session.user.id,
    title: `Your request for "${subject}" has been posted successfully.`,
    credits: 0,
  });

  return NextResponse.json(newRequest[0]);
}
