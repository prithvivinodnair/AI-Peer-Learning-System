import { NextResponse } from "next/server";
import { db } from "@/src/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/auth.config";
import { messageStore } from "@/src/lib/messageStore";

// GET messages of logged-in user with user details
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  const [rows] = await db.query(
    `SELECT 
       m.*,
       sender.name as sender_name,
       receiver.name as receiver_name
     FROM messages m
     LEFT JOIN users sender ON m.sender_id = sender.id
     LEFT JOIN users receiver ON m.receiver_id = receiver.id
     WHERE m.sender_id = ? OR m.receiver_id = ?
     ORDER BY m.created_at ASC`,
    [userId, userId]
  );

  return NextResponse.json(rows);
}

// POST send message
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const body = await req.json();

  const { receiver_id, content } = body;

  const [result]: any = await db.query(
    "INSERT INTO messages (sender_id, receiver_id, content) VALUES (?, ?, ?)",
    [userId, receiver_id, content]
  );

  // Get sender details for real-time broadcast
  const [senderRows]: any = await db.query(
    "SELECT id, name FROM users WHERE id = ?",
    [userId]
  );

  const newMessage = {
    id: result.insertId,
    sender_id: userId,
    receiver_id,
    content,
    created_at: new Date().toISOString(),
    sender_name: senderRows[0]?.name || "Unknown",
  };

  // Broadcast to both sender and receiver via SSE
  messageStore.broadcast(receiver_id, {
    type: "new-message",
    message: newMessage,
  });
  messageStore.broadcast(userId, {
    type: "new-message",
    message: newMessage,
  });

  return NextResponse.json({ message: "Message sent", data: newMessage });
}
