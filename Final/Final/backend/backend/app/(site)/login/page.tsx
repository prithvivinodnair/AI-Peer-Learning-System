'use client';

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const [mode, setMode] = useState('signin');
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [expertise, setExpertise] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSent, setForgotSent] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    setLoading(false);

    if (!result?.error) {
      router.push("/dashboard");
    } else {
      alert("Invalid email or password");
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePassword(password)) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name: fullName, expertise }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Account created! Please sign in.");
        setMode('signin');
        setPassword("");
      } else {
        alert(data.message || "Sign up failed");
      }
    } catch (error) {
      alert("An error occurred during sign up");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail }),
      });

      const data = await response.json();

      if (response.ok) {
        setForgotSent(true);
        setTimeout(() => {
          setMode('signin');
          setForgotSent(false);
          setForgotEmail("");
        }, 3000);
      } else {
        alert(data.message || "Failed to send reset email");
      }
    } catch (error) {
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 border border-gray-200">
        {/* Header */}
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-1">
          SkillShare
        </h2>
        <p className="text-center text-sm text-gray-500 mb-6">
          Join the AI-powered peer learning revolution
        </p>

        {/* Tabs */}
        <div className="flex bg-gray-100 rounded-lg mb-5">
          <button
            onClick={() => setMode('signin')}
            className={`flex-1 py-2 text-sm font-medium ${
              mode === 'signin' ? "bg-white text-gray-900" : "text-gray-500"
            } rounded-lg transition`}
          >
            Sign In
          </button>
          <button
            onClick={() => setMode('signup')}
            className={`flex-1 py-2 text-sm font-medium ${
              mode === 'signup' ? "bg-white text-gray-900" : "text-gray-500"
            } rounded-lg transition`}
          >
            Sign Up
          </button>
          <button
            onClick={() => setMode('forgot')}
            className={`flex-1 py-2 text-sm font-medium ${
              mode === 'forgot' ? "bg-white text-gray-900" : "text-gray-500"
            } rounded-lg transition`}
          >
            Forgot Password
          </button>
        </div>

        {/* Forms */}
        {mode === 'signin' && (
          <form onSubmit={handleSignIn} className="flex flex-col space-y-3">
            <input
              type="email"
              placeholder="University Email"
              className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        )}

        {mode === 'signup' && (
          <form onSubmit={handleSignUp} className="flex flex-col space-y-3">
            <input
              type="text"
              placeholder="Full Name"
              className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Expertise (e.g., Math, Physics)"
              className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              value={expertise}
              onChange={(e) => setExpertise(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="University Email"
              className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                validatePassword(e.target.value);
              }}
              required
            />
            {passwordError && (
              <p className="text-red-500 text-xs mt-1">{passwordError}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>
        )}

        {mode === 'forgot' && (
          <form onSubmit={handleForgotPassword} className="flex flex-col space-y-3">
            <h3 className="text-lg font-semibold text-center mb-2">Reset Password</h3>
            <p className="text-sm text-gray-600 text-center mb-2">
              Enter your email and we'll send you a link to reset your password.
            </p>
            <input
              type="email"
              placeholder="Enter your university email"
              className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              required
            />
            <button
              type="submit"
              disabled={loading || forgotSent}
              className="bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {loading ? "Sending..." : forgotSent ? "✓ Reset Link Sent!" : "Send Reset Link"}
            </button>
            {forgotSent && (
              <p className="text-sm text-green-600 text-center mt-2">
                Check your email for the reset link. It will expire in 10 minutes.
              </p>
            )}
          </form>
        )}

        {mode !== 'forgot' && (
          <>
            <p className="text-xs text-gray-500 mt-4 text-center">
              By signing up, you agree to our{" "}
              <span className="underline cursor-pointer">Terms of Service</span>
            </p>
            {mode === 'signup' && (
              <p className="text-sm text-center text-indigo-600 mt-3 font-medium">
                Get 100 free credits when you join!
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
