import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/auth.config";
import { db } from "@/src/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    // Fetch all bookings where user is either student or tutor
    const [rows]: any = await db.query(
      `SELECT 
        b.id,
        b.request_id,
        b.student_id,
        b.tutor_id,
        b.session_time,
        b.meet_link,
        b.status,
        b.created_at,
        student.name as student_name,
        tutor.name as tutor_name
      FROM bookings b
      LEFT JOIN users student ON b.student_id = student.id
      LEFT JOIN users tutor ON b.tutor_id = tutor.id
      WHERE b.student_id = ? OR b.tutor_id = ?
      ORDER BY b.session_time DESC`,
      [userId, userId]
    );

    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error fetching sessions:", error);
    return NextResponse.json({ error: "Failed to fetch sessions" }, { status: 500 });
  }
}
