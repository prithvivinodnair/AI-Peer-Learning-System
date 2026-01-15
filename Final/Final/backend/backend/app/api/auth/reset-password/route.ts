import { NextRequest, NextResponse } from "next/server";
import { db } from "@/src/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json(
        { message: "Token and password are required" },
        { status: 400 }
      );
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        { message: "Password must be at least 8 characters long" },
        { status: 400 }
      );
    }

    if (!/[A-Z]/.test(password)) {
      return NextResponse.json(
        { message: "Password must contain at least one uppercase letter" },
        { status: 400 }
      );
    }

    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      return NextResponse.json(
        { message: "Password must contain at least one special character" },
        { status: 400 }
      );
    }

    // Find valid token
    const [resetTokens]: any = await db.query(
      "SELECT * FROM password_resets WHERE token = ? AND used = FALSE AND expires_at > NOW()",
      [token]
    );

    if (!Array.isArray(resetTokens) || resetTokens.length === 0) {
      return NextResponse.json(
        { message: "Invalid or expired reset token" },
        { status: 400 }
      );
    }

    const resetToken = resetTokens[0];

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user's password
    await db.query(
      "UPDATE users SET password = ? WHERE email = ?",
      [hashedPassword, resetToken.email]
    );

    // Mark token as used
    await db.query(
      "UPDATE password_resets SET used = TRUE WHERE token = ?",
      [token]
    );

    return NextResponse.json(
      { message: "Password successfully reset. You can now sign in with your new password." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { message: "An error occurred. Please try again." },
      { status: 500 }
    );
  }
}
