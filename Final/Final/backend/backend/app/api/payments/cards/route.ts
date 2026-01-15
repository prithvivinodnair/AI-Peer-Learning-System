import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/auth.config";
import { db } from "@/src/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json([], { status: 200 });

  const userId = session.user.id;

  const [cards] = await db.query(
    "SELECT id, cardholder_name AS holder, CONCAT('**** **** **** ', card_last4) AS number, CONCAT(expiry_month, '/', expiry_year) AS expiry FROM payments WHERE user_id = ?",
    [userId]
  );

  return NextResponse.json(cards);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = session.user.id;
  const body = await req.json();

  const last4 = body.number.slice(-4);
  const [month, year] = body.expiry.split("/");

  const result: any = await db.query(
    "INSERT INTO payments (user_id, cardholder_name, card_last4, expiry_month, expiry_year) VALUES (?, ?, ?, ?, ?)",
    [userId, body.holder, last4, month, year]
  );

  return NextResponse.json({
    id: result.insertId,
    holder: body.holder,
    number: `**** **** **** ${last4}`,
    expiry: body.expiry,
  });
}
