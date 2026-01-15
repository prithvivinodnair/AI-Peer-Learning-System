import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { db } from "@/src/lib/db";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const courseId = Number(id);
  if (Number.isNaN(courseId)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const [rows] = await db.query<any[]>(
    `SELECT 
        c.id,
        c.title,
        c.description,
        c.syllabus,
        c.outcomes,
        u.name AS tutor_name,
        u.id AS tutor_id
     FROM courses c
     JOIN users u ON c.tutor_id = u.id
     WHERE c.id = ?`,
    [courseId]
  );

  if (!Array.isArray(rows) || rows.length === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(rows[0]);
}
