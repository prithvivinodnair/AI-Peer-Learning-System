"use client";

import React, { useState, useEffect } from "react";
import { Brain, Video, Shield, BarChart3, Bot, Coins } from "lucide-react";
import AuthModal from "../../app/components/AuthModal";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'signin' | 'signup'>('signup');
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  return (
    <div className="bg-white flex flex-col text-gray-900">

      {/* Hero Section */}
      <main className="flex flex-col md:flex-row items-center justify-between px-10 md:px-20 py-16 md:py-24 gap-10">
        <div className="flex-1 max-w-xl">
          <span className="inline-block text-sm font-medium text-indigo-600 bg-indigo-100 px-3 py-1 rounded-full mb-4">
            AI-Powered Peer Learning
          </span>

          <h1 className="text-5xl font-bold leading-tight mb-4">
            Learn Together, <br /> Grow Together
          </h1>

          <p className="text-gray-600 text-lg mb-8">
            Exchange knowledge with fellow students through our
            skill-bartering platform. No money required—just share what
            you know and learn what you need.
          </p>

          <div className="flex space-x-4">
            <button
              onClick={() => {
                setModalMode('signup');
                setShowModal(true);
              }}
              className="bg-black text-white px-6 py-3 rounded-md font-semibold hover:bg-gray-900 transition"
            >
              Start Learning Free →
            </button>

            <button
              onClick={() => {
                setModalMode('signin');
                setShowModal(true);
              }}
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

        {/* Hero Image */}
        <div className="flex-1 flex justify-center">
          <div className="rounded-2xl shadow-2xl w-full max-w-md h-96 bg-gray-200 relative overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop"
              alt="Students collaborating and learning together"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </main>

      {/* Why Section */}
      <section className="px-6 md:px-20 py-16 bg-white text-center">
        <h2 className="text-4xl font-semibold mb-2">
          Learning Made Simple & Affordable
        </h2>
        <p className="text-gray-600 mb-12">
          Say goodbye to expensive tutors — hello collaborative learning
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {[
            {
              icon: <Brain size={26} />,
              title: "AI-Powered Matching",
              text: "Get paired with the perfect study partner using intelligent algorithms.",
            },
            {
              icon: <Coins size={26} />,
              title: "Credit-Based System",
              text: "Earn credits by teaching others. Spend them to learn anything you want.",
            },
            {
              icon: <Video size={26} />,
              title: "Real-Time Sessions",
              text: "Video chat, whiteboards, and screen share for seamless virtual learning.",
            },
            {
              icon: <Bot size={26} />,
              title: "SyncBot AI Assistant",
              text: "Instant homework help, explanations, and study guidance.",
            },
            {
              icon: <BarChart3 size={26} />,
              title: "Track Progress",
              text: "Monitor achievements, analytics, and personal milestones.",
            },
            {
              icon: <Shield size={26} />,
              title: "Safe & Verified",
              text: "All users are verified students for a secure learning environment.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="p-6 border border-gray-200 rounded-xl bg-white hover:shadow-md transition"
            >
              <div className="bg-gray-100 p-3 w-fit rounded-lg mb-4">
                {item.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-600 text-sm">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="px-6 md:px-20 py-20 text-center bg-gray-50">
        <span className="text-sm text-gray-600 bg-gray-200 px-3 py-1 rounded-full">
          Simple Process
        </span>

        <h2 className="text-4xl font-semibold mt-4 mb-2">
          How SkillShare Works
        </h2>

        <p className="text-gray-600 mb-12">
          Start learning and teaching in three easy steps
        </p>

        <div className="flex flex-col md:flex-row justify-center items-center gap-12">
          {[
            {
              num: 1,
              title: "Create Your Profile",
              text: "List your skills and learning goals. Get 100 free credits.",
            },
            {
              num: 2,
              title: "Find Your Match",
              text: "Browse partners or get matched by AI based on your needs.",
            },
            {
              num: 3,
              title: "Start Learning",
              text: "Schedule sessions and exchange knowledge to earn credits.",
            },
          ].map((step, i) => (
            <div key={i} className="flex-1 max-w-xs">
              <div className="flex flex-col items-center">
                <div className="bg-black text-white w-10 h-10 flex items-center justify-center rounded-full text-lg font-bold mb-3">
                  {step.num}
                </div>
                <h3 className="font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-600 text-sm">{step.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="flex flex-col md:flex-row items-center justify-between px-10 md:px-20 py-16 gap-10 bg-white">
        <div className="flex-1 flex justify-center">
          <div className="rounded-2xl shadow-2xl w-full max-w-lg h-96 bg-gray-200 relative overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&h=600&fit=crop"
              alt="Students in classroom learning environment"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="flex-1">
          <span className="text-sm text-indigo-600 bg-indigo-100 px-3 py-1 rounded-full mb-4 inline-block">
            For Students, By Students
          </span>

          <h2 className="text-4xl font-semibold mb-6">
            Transform Your Learning Experience
          </h2>

          <ul className="space-y-4 text-gray-700 mb-8">
            {[
              {
                title: "Save Money on Tutoring",
                text: "Learn for free by contributing your own skills.",
              },
              {
                title: "Learn at Your Own Pace",
                text: "Schedule sessions anytime you want.",
              },
              {
                title: "Build Your Network",
                text: "Connect with students worldwide.",
              },
              {
                title: "Reinforce Your Knowledge",
                text: "Teaching others strengthens your mastery.",
              },
            ].map((item, i) => (
              <li key={i} className="flex items-start space-x-3">
                <span className="text-green-600 text-lg">✓</span>
                <div>
                  <p className="font-semibold">{item.title}</p>
                  <p className="text-sm text-gray-600">{item.text}</p>
                </div>
              </li>
            ))}
          </ul>

          <button
            onClick={() => {
              setModalMode('signup');
              setShowModal(true);
            }}
            className="bg-black text-white px-6 py-3 rounded-md font-semibold hover:bg-gray-900 transition"
          >
            Join SkillShare Today →
          </button>
        </div>
      </section>

      <AuthModal isOpen={showModal} onClose={() => setShowModal(false)} initialMode={modalMode} />
    </div>
  );
}
