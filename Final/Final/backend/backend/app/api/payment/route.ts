import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/auth.config";
import { db } from "@/src/lib/db";
import { createNotification } from "@/src/lib/notifications";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  // Get payment history and card information
  const [payments] = await db.query(
    `SELECT id, cardholder_name, card_last4, expiry_month, expiry_year, created_at 
     FROM payments 
     WHERE user_id = ? 
     ORDER BY created_at DESC`,
    [userId]
  );

  return NextResponse.json({ 
    ok: true,
    userId,
    payments
  });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const body = await req.json();

  try {
    // Process payment - this could integrate with Stripe, PayPal, etc.
    const { amount, cardId, description } = body;

    if (!amount || !cardId) {
      return NextResponse.json(
        { error: "Missing required fields: amount, cardId" },
        { status: 400 }
      );
    }

    // Verify the card belongs to the user
    const [cards]: any = await db.query(
      "SELECT id FROM payments WHERE id = ? AND user_id = ?",
      [cardId, userId]
    );

    if (!cards || cards.length === 0) {
      return NextResponse.json(
        { error: "Card not found or doesn't belong to user" },
        { status: 404 }
      );
    }

    // Here you would typically integrate with a payment processor
    // For now, we'll just record the transaction
    const [result]: any = await db.query(
      `INSERT INTO transactions (user_id, card_id, amount, description, status, created_at) 
       VALUES (?, ?, ?, ?, 'completed', NOW())`,
      [userId, cardId, amount, description || "Payment"]
    );

    // Create notification for payment completion
    await createNotification({
      userId,
      title: `Payment successful! $${amount} processed.`,
      credits: Math.floor(amount / 10), // Example: 1 credit per $10
    });

    return NextResponse.json({
      success: true,
      transactionId: result.insertId,
      amount,
      status: "completed"
    });
  } catch (error) {
    console.error("Payment error:", error);
    return NextResponse.json(
      { error: "Payment processing failed" },
      { status: 500 }
    );
  }
}
