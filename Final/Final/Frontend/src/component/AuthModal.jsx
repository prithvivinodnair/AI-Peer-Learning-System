import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthModal({ isOpen, onClose }) {
  const [mode, setMode] = useState('signup');
  const navigate = useNavigate();


  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [expertise, setExpertise] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSent, setForgotSent] = useState(false);

  const validatePassword = (pwd) => {
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

  if (!isOpen) return null;

  const handleSignIn = () => {
    // Check if user data exists, if not create default
    if (!localStorage.getItem('user')) {
      const defaultUser = {
        fullName: "Alex Chen",
        email,
        expertise: "Math, Physics",
        bio: ""
      };
      localStorage.setItem('user', JSON.stringify(defaultUser));
    }
    localStorage.setItem("demo_authed", "true");
    onClose();
    navigate("/dashboard");
  };

  const handleSignUp = () => {
    if (!validatePassword(password)) {
      return;
    }
    // Store user data in localStorage
    const userData = {
      fullName,
      email,
      expertise,
      bio: ""
    };
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem("demo_authed", "true");
    // you can later add backend call here
    alert("Account created! Redirecting to dashboard...");
    onClose();
    navigate("/dashboard");
  };

  return (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-md">
  <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 border border-gray-200">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-800"
        >
          ✕
        </button>

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
            } rounded-lg`}
          >
            Sign In
          </button>
          <button
            onClick={() => setMode('signup')}
            className={`flex-1 py-2 text-sm font-medium ${
              mode === 'signup' ? "bg-white text-gray-900" : "text-gray-500"
            } rounded-lg`}
          >
            Sign Up
          </button>
          <button
            onClick={() => setMode('forgot')}
            className={`flex-1 py-2 text-sm font-medium ${
              mode === 'forgot' ? "bg-white text-gray-900" : "text-gray-500"
            } rounded-lg`}
          >
            Forgot Password
          </button>
        </div>

        {/* Forms */}
        {mode === 'signin' && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSignIn();
            }}
            className="flex flex-col space-y-3"
          >
            <input
              type="email"
              placeholder="University Email"
              className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <button
              type="submit"
              className="bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 transition"
            >
              Sign In
            </button>
          </form>
        )}

        {mode === 'signup' && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSignUp();
            }}
            className="flex flex-col space-y-3"
          >
            <input
              type="text"
              placeholder="Full Name"
              className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Expertise (e.g., Math, Physics)"
              className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              value={expertise}
              onChange={e => setExpertise(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="University Email"
              className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              value={password}
              onChange={e => {
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
              className="bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 transition"
            >
              Create Account
            </button>
          </form>
        )}

        {mode === 'forgot' && (
          <form
            onSubmit={e => {
              e.preventDefault();
              setForgotSent(true);
              setTimeout(() => {
                setMode('signin');
                setForgotSent(false);
                setForgotEmail("");
              }, 2000);
            }}
            className="flex flex-col space-y-3"
          >
            <h3 className="text-lg font-semibold text-center mb-2">Reset Password</h3>
            <input
              type="email"
              placeholder="Enter your university email"
              className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              value={forgotEmail}
              onChange={e => setForgotEmail(e.target.value)}
              required
            />
            <button
              type="submit"
              className="bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 transition"
              disabled={forgotSent}
            >
              {forgotSent ? "Reset Link Sent!" : "Send Reset Link"}
            </button>
          </form>
        )}

        {mode !== 'forgot' && (
          <>
            <p className="text-xs text-gray-500 mt-4 text-center">
              By signing up, you agree to our{" "}
              <span className="underline">Terms of Service</span>
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
