# Alternative: OTP-Based Password Reset

If you prefer a 6-digit OTP code instead of a link, here's the implementation:

## Modified API Route: `/api/auth/forgot-password/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";
import { query } from "@/src/lib/db";
import { Resend } from "resend";
import crypto from "crypto";

const resend = new Resend(process.env.RESEND_API_KEY);

// Generate 6-digit OTP
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    // Check if user exists
    const users = await query(
      "SELECT id, email FROM users WHERE email = ?",
      [email]
    );

    if (!Array.isArray(users) || users.length === 0) {
      return NextResponse.json(
        { message: "If an account exists with this email, you will receive an OTP." },
        { status: 200 }
      );
    }

    // Generate 6-digit OTP
    const otp = generateOTP();
    
    // OTP expires in 10 minutes
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // Store OTP in database (use 'token' column for OTP)
    await query(
      "INSERT INTO password_resets (email, token, expires_at) VALUES (?, ?, ?)",
      [email, otp, expiresAt]
    );

    // Send email with OTP
    try {
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || "SkillShare <onboarding@resend.dev>",
        to: email,
        subject: "Your Password Reset Code - SkillShare",
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background-color: #4F46E5; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
                .content { background-color: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; text-align: center; }
                .otp-box { background-color: white; border: 2px dashed #4F46E5; padding: 20px; margin: 20px 0; border-radius: 8px; }
                .otp-code { font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #4F46E5; }
                .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #6b7280; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>SkillShare</h1>
                </div>
                <div class="content">
                  <h2>Password Reset Code</h2>
                  <p>Your password reset code is:</p>
                  <div class="otp-box">
                    <div class="otp-code">${otp}</div>
                  </div>
                  <p><strong>This code will expire in 10 minutes.</strong></p>
                  <p style="margin-top: 20px;">Enter this code on the password reset page to continue.</p>
                  <p style="margin-top: 20px; font-size: 14px; color: #6b7280;">If you didn't request a password reset, you can safely ignore this email.</p>
                </div>
                <div class="footer">
                  <p>© ${new Date().getFullYear()} SkillShare. All rights reserved.</p>
                </div>
              </div>
            </body>
          </html>
        `,
      });
    } catch (emailError) {
      console.error("Email sending error:", emailError);
      return NextResponse.json(
        { message: "Failed to send OTP. Please try again later." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "If an account exists with this email, you will receive an OTP." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { message: "An error occurred. Please try again." },
      { status: 500 }
    );
  }
}
```

## Modified Frontend: `/app/(site)/reset-password/page.tsx`

```typescript
'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ResetPasswordPage() {
  const router = useRouter();
  
  const [step, setStep] = useState<'email' | 'otp' | 'password'>('email');
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmError, setConfirmError] = useState("");
  const [otpError, setOtpError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validatePassword = (pwd: string) => {
    if (pwd.length < 8) {
      setPasswordError("Password must be at least 8 characters long.");
      return false;
    }
    if (!/[A-Z]/.test(pwd)) {
      setPasswordError("Password must contain at least one uppercase letter.");
      return false;
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd)) {
      setPasswordError("Password must contain at least one special character.");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStep('otp');
      } else {
        alert(data.message || "Failed to send OTP");
      }
    } catch (error) {
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (otp.length !== 6) {
      setOtpError("OTP must be 6 digits");
      return;
    }

    setOtpError("");
    setStep('password');
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePassword(password)) {
      return;
    }

    if (password !== confirmPassword) {
      setConfirmError("Passwords do not match");
      return;
    }

    setConfirmError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: otp, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } else {
        alert(data.message || "Failed to reset password");
      }
    } catch (error) {
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 text-center">
          <div className="mb-4">
            <svg className="mx-auto h-16 w-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Password Reset Successful!</h2>
          <p className="text-gray-600 mb-6">Redirecting to login...</p>
          <Link href="/login" className="text-indigo-600 hover:text-indigo-700 font-medium">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 border border-gray-200">
        {/* Progress Indicator */}
        <div className="flex justify-between mb-6">
          {['Email', 'OTP', 'Password'].map((label, index) => (
            <div key={label} className="flex-1 flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                step === ['email', 'otp', 'password'][index] ? 'bg-indigo-600 text-white' :
                ['email', 'otp', 'password'].indexOf(step) > index ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                {['email', 'otp', 'password'].indexOf(step) > index ? '✓' : index + 1}
              </div>
              <span className="text-xs mt-1 text-gray-600">{label}</span>
            </div>
          ))}
        </div>

        {/* Step 1: Email */}
        {step === 'email' && (
          <form onSubmit={handleSendOTP} className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">Reset Password</h2>
            <p className="text-sm text-gray-500 text-center mb-4">Enter your email to receive an OTP</p>
            <input
              type="email"
              placeholder="University Email"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>
        )}

        {/* Step 2: OTP Verification */}
        {step === 'otp' && (
          <form onSubmit={handleVerifyOTP} className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">Enter OTP</h2>
            <p className="text-sm text-gray-500 text-center mb-4">
              We sent a 6-digit code to {email}
            </p>
            <input
              type="text"
              placeholder="Enter 6-digit OTP"
              maxLength={6}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-center text-2xl font-bold tracking-widest focus:ring-2 focus:ring-indigo-500 outline-none"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              required
            />
            {otpError && <p className="text-red-500 text-xs text-center">{otpError}</p>}
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition"
            >
              Verify OTP
            </button>
            <button
              type="button"
              onClick={() => setStep('email')}
              className="w-full text-indigo-600 hover:text-indigo-700 text-sm"
            >
              Resend OTP
            </button>
          </form>
        )}

        {/* Step 3: New Password */}
        {step === 'password' && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">Create New Password</h2>
            <input
              type="password"
              placeholder="New Password"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                validatePassword(e.target.value);
              }}
              required
            />
            {passwordError && <p className="text-red-500 text-xs">{passwordError}</p>}
            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (confirmError) setConfirmError("");
              }}
              required
            />
            {confirmError && <p className="text-red-500 text-xs">{confirmError}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {loading ? "Resetting Password..." : "Reset Password"}
            </button>
          </form>
        )}

        <div className="mt-6 text-center">
          <Link href="/login" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
```

## Key Differences: OTP vs Link

| Feature | Link-Based | OTP-Based |
|---------|-----------|-----------|
| User Experience | One click | Type 6 digits |
| Email Content | Clickable button | Display code |
| Security | Same | Same |
| Mobile Friendly | Better (auto-opens) | Good (copy-paste) |
| Code Complexity | Simpler | More steps |
| UX Flow | 2 steps | 3 steps |

## When to Use OTP?

Use OTP if:
- Users prefer typing codes
- You want multi-step verification
- Banking/finance app aesthetic
- SMS integration planned

Use Link if:
- Simpler UX preferred
- Mobile-first design
- Standard practice expected
- One-click convenience

Both are **100% free** with Resend! 🎉
