import { NextResponse } from "next/server";
import { db } from "@/src/lib/db";
import { getServerSession } from "next-auth";

export async function PUT(req: Request, { params }: any) {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id: requestId } = await params;
  const body = await req.json();
  const { status, tutor_id } = body;

  try {
    if (status === "accepted" && tutor_id) {
      // Get request details to create booking
      const [requestRows]: any = await db.query(
        "SELECT student_id FROM requests WHERE id = ?",
        [requestId]
      );

      if (!requestRows || requestRows.length === 0) {
        return NextResponse.json({ error: "Request not found" }, { status: 404 });
      }

      const student_id = requestRows[0].student_id;

      if (!student_id) {
        return NextResponse.json({ error: "Invalid student_id" }, { status: 400 });
      }

      // Update request status
      await db.query(
        "UPDATE requests SET status = ?, tutor_id = ? WHERE id = ?",
        [status, tutor_id, requestId]
      );

      // Create a booking/session record
      const meet_link = `https://meet.google.com/${Math.random()
        .toString(36)
        .substring(2, 7)}-${Math.random().toString(36).substring(2, 7)}`;

      // Default session time to 24 hours from now
      const session_time = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 19).replace('T', ' ');

      const [bookingResult]: any = await db.query(
        `INSERT INTO bookings (request_id, student_id, tutor_id, session_time, meet_link, status)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [requestId, student_id, tutor_id, session_time, meet_link, 'scheduled']
      );

      console.log("Booking created:", bookingResult.insertId);

      return NextResponse.json({ 
        message: "Request accepted and session created",
        booking_id: bookingResult.insertId,
        meet_link,
        session_time
      });
    } else {
      await db.query(
        "UPDATE requests SET status = ? WHERE id = ?",
        [status, requestId]
      );

      return NextResponse.json({ message: "Request updated" });
    }
  } catch (error) {
    console.error("Error updating request:", error);
    return NextResponse.json({ 
      error: "Failed to update request",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
