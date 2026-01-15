import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/auth.config";
import bcrypt from "bcryptjs";
import { db } from "@/src/lib/db";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { current, new: newPassword } = await req.json();

  const result: any = await db.query(
    "SELECT password_hash FROM users WHERE id = ?",
    [session.user.id]
  );
  const rows = result[0] as { password_hash: string }[];

  const valid = await bcrypt.compare(current, rows[0].password_hash);
  if (!valid) {
    return NextResponse.json({ error: "Incorrect current password" }, { status: 400 });
  }

  const hashed = await bcrypt.hash(newPassword, 10);

  await db.query(
    "UPDATE users SET password_hash = ? WHERE id = ?",
    [hashed, session.user.id]
  );

  return NextResponse.json({ message: "Password updated" });
}
