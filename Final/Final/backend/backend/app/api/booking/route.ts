import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { db } from "@/src/lib/db";
import { createNotifications } from "@/src/lib/notifications";

export async function POST(req: Request) {
  const session = await getServerSession();
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { student_id, tutor_id, session_time } = body;

  // random request id
  const request_id = Math.floor(100000 + Math.random() * 900000);

  // auto meet link
  const meet_link = `https://meet.google.com/${Math.random()
    .toString(36)
    .substring(2, 7)}`;

  const [result]: any = await db.query(
    `INSERT INTO bookings (request_id, student_id, tutor_id, session_time, meet_link)
     VALUES (?, ?, ?, ?, ?)`,
    [request_id, student_id, tutor_id, session_time, meet_link]
  );

  // Fetch student and tutor names for notifications
  const [studentRows]: any = await db.query(
    `SELECT name FROM users WHERE id = ?`,
    [student_id]
  );
  const [tutorRows]: any = await db.query(
    `SELECT name FROM users WHERE id = ?`,
    [tutor_id]
  );

  const studentName = studentRows[0]?.name || "Student";
  const tutorName = tutorRows[0]?.name || "Tutor";

  // Create notifications for both student and tutor
  await createNotifications([
    {
      userId: student_id,
      title: "Booking confirmed! Your session has been scheduled.",
      partner: tutorName,
      credits: 0,
    },
    {
      userId: tutor_id,
      title: "New booking! You have a session scheduled.",
      partner: studentName,
      credits: 0,
    },
  ]);

  return NextResponse.json({
    id: result.insertId,
    request_id,
    meet_link,
    session_time,
  });
}
