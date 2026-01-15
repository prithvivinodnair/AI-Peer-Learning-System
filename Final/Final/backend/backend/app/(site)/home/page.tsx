"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Brain, Video, Shield, BarChart3, Bot, Coins } from "lucide-react";
import { useSession } from "next-auth/react";

export default function Page() {
  const router = useRouter();
  const { data: session, status } = useSession();

  // If user is already logged in → redirect to dashboard
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  return (
    <div className="min-h-screen bg-white flex flex-col text-gray-900">
      {/* Hero Section */}
      <main className="flex flex-col md:flex-row items-center justify-between px-10 md:px-20 py-16 md:py-24 gap-10">
        <div className="flex-1 max-w-xl">
          <span className="inline-block text-sm font-medium text-indigo-600 bg-indigo-100 px-3 py-1 rounded-full mb-4">
            AI-Powered Peer Learning
          </span>

          <h1 className="text-5xl font-bold text-gray-900 leading-tight mb-4">
            Learn Together, <br /> Grow Together
          </h1>

          <p className="text-gray-600 text-lg mb-8 leading-relaxed">
            Exchange knowledge with fellow students through our skill-bartering
            platform. No money required—just share what you know and learn what
            you need.
          </p>

          <div className="flex space-x-4">
            {/* START LEARNING → goes to login page */}
            <button
              onClick={() => router.push("/login")}
              className="bg-black text-white px-6 py-3 rounded-md font-semibold hover:bg-gray-900 transition"
            >
              Start Learning Free →
            </button>

            {/* SIGN IN */}
            <button
              onClick={() => router.push("/login")}
              className="border border-gray-300 text-gray-800 px-6 py-3 rounded-md font-semibold hover:bg-gray-50 transition"
            >
              Sign In
            </button>
          </div>

          <div className="flex flex-wrap gap-10 mt-12 text-gray-700">
            <div>
              <p className="text-2xl font-bold">10K+</p>
              <p className="text-sm">Active Students</p>
            </div>
            <div>
              <p className="text-2xl font-bold">50K+</p>
              <p className="text-sm">Sessions Completed</p>
            </div>
            <div>
              <p className="text-2xl font-bold">100+</p>
              <p className="text-sm">Skills Shared</p>
            </div>
          </div>
        </div>

        <div className="flex-1 flex justify-center">
          <div className="rounded-2xl shadow-2xl w-full max-w-md h-96 relative overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&w=1200&q=80"
              alt="Group of students collaborating and learning together"
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
            />
          </div>
        </div>
      </main>

      {/* Why SkillShare Section */}
      <section className="px-6 md:px-20 py-16 bg-white text-center">
        <h2 className="text-4xl font-semibold mb-2">Learning Made Simple & Affordable</h2>
        <p className="text-gray-600 mb-12">
          Say goodbye to expensive tutors and hello to collaborative learning
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {[
            { icon: <Brain size={26} />, title: "AI-Powered Matching", text: "Get paired with ideal study partners." },
            { icon: <Coins size={26} />, title: "Credit-Based System", text: "Teach to earn credits. Learn for free." },
            { icon: <Video size={26} />, title: "Real-Time Sessions", text: "Video chat, screen share, and whiteboard." },
            { icon: <Bot size={26} />, title: "SyncBot AI Assistant", text: "Instant help for homework and explanations." },
            { icon: <BarChart3 size={26} />, title: "Track Progress", text: "Analytics & personalized feedback." },
            { icon: <Shield size={26} />, title: "Safe & Verified", text: "Only verified students. Safe environment." },
          ].map((f, i) => (
            <div key={i} className="p-6 rounded-xl border border-gray-200 hover:shadow-md transition bg-white">
              <div className="bg-gray-100 p-3 w-fit rounded-lg mb-4 text-gray-800">
                {f.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
              <p className="text-gray-600 text-sm">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gray-50 px-6 md:px-20 py-20 text-center">
        <span className="text-sm font-medium text-gray-600 bg-gray-200 px-3 py-1 rounded-full">
          Simple Process
        </span>
        <h2 className="text-4xl font-semibold mt-4 mb-2">How SkillShare Works</h2>
        <p className="text-gray-600 mb-12">Start learning and teaching in three easy steps</p>

        <div className="flex flex-col md:flex-row justify-center items-center gap-12">
          {[
            { num: 1, title: "Create Your Profile", text: "Get 100 free credits to start." },
            { num: 2, title: "Find Your Match", text: "Let our AI match you with partners." },
            { num: 3, title: "Start Learning", text: "Teach, learn, earn credits." },
          ].map((s, i) => (
            <div key={i} className="flex-1 max-w-xs">
              <div className="flex flex-col items-center">
                <div className="bg-black text-white w-10 h-10 flex items-center justify-center rounded-full text-lg font-bold mb-3">
                  {s.num}
                </div>
                <h3 className="font-semibold mb-2">{s.title}</h3>
                <p className="text-gray-600 text-sm">{s.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Transform Experience Section */}
      <section className="flex flex-col md:flex-row items-center justify-between px-10 md:px-20 py-16 md:py-24 gap-10 bg-white">
        <div className="flex-1 flex justify-center">
          <div className="rounded-2xl shadow-2xl w-full max-w-lg h-96 relative overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=1200&q=80"
              alt="Modern classroom style collaborative study environment"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
            />
          </div>
        </div>

        <div className="flex-1">
          <span className="inline-block text-sm font-medium text-indigo-600 bg-indigo-100 px-3 py-1 rounded-full mb-4">
            For Students, By Students
          </span>
          <h2 className="text-4xl font-semibold mb-6">Transform Your Learning Experience</h2>

          <ul className="space-y-4 text-gray-700 mb-8">
            {[
              { title: "Save Money", text: "Learn without paying for tutors." },
              { title: "Learn at Your Pace", text: "Study when it works for you." },
              { title: "Network Globally", text: "Meet students from everywhere." },
              { title: "Reinforce Knowledge", text: "Teaching boosts mastery." },
            ].map((point, i) => (
              <li key={i} className="flex items-start space-x-3">
                <span className="text-green-600 text-lg">✓</span>
                <div>
                  <p className="font-semibold">{point.title}</p>
                  <p className="text-sm text-gray-600">{point.text}</p>
                </div>
              </li>
            ))}
          </ul>

          <button
            onClick={() => router.push("/login")}
            className="bg-black text-white px-6 py-3 rounded-md font-semibold hover:bg-gray-900 transition"
          >
            Join SkillShare Today →
          </button>
        </div>
      </section>
    </div>
  );
}
