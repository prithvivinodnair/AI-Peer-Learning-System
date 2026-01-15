import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Brain, Video, Shield, BarChart3, Bot, Coins } from "lucide-react";
import heroImage from "../assets/hero.jpg";
import classroomImage from "../assets/classroom.jpg";
import AuthModal from "../component/AuthModal"; 

export default function Home() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false); 

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
            Exchange knowledge with fellow students through our
            skill-bartering platform. No money required—just share what you
            know and learn what you need.
          </p>

          <div className="flex space-x-4">
            <button
              onClick={() => setShowModal(true)} 
              className="bg-black text-white px-6 py-3 rounded-md font-semibold hover:bg-gray-900 transition"
            >
              Start Learning Free →
            </button>
            <button
              onClick={() => setShowModal(true)} 
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
          <img
            src={heroImage}
            alt="Peer Learning"
            className="rounded-2xl shadow-2xl w-full max-w-md object-cover"
          />
        </div>
      </main>

      {/* Why SkillShare Section */}
      <section className="px-6 md:px-20 py-16 bg-white text-center">
        <h2 className="text-4xl font-semibold mb-2">
          Learning Made Simple & Affordable
        </h2>
        <p className="text-gray-600 mb-12">
          Say goodbye to expensive tutors and hello to collaborative learning
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {[
            {
              icon: <Brain size={26} />,
              title: "AI-Powered Matching",
              text: "Our intelligent algorithm pairs you with the perfect study partner based on learning styles, schedules, and goals.",
            },
            {
              icon: <Coins size={26} />,
              title: "Credit-Based System",
              text: "Earn credits by teaching others, spend them to learn new skills. Fair, transparent, and completely free.",
            },
            {
              icon: <Video size={26} />,
              title: "Real-Time Sessions",
              text: "Built-in video chat, screen sharing, and interactive whiteboard for seamless virtual learning experiences.",
            },
            {
              icon: <Bot size={26} />,
              title: "SyncBot AI Assistant",
              text: "Get instant help with homework, explanations, and study tips from our GPT-powered AI assistant.",
            },
            {
              icon: <BarChart3 size={26} />,
              title: "Track Progress",
              text: "Monitor your learning journey with detailed analytics, achievements, and personalized recommendations.",
            },
            {
              icon: <Shield size={26} />,
              title: "Safe & Verified",
              text: "All users are verified students. Our guidelines ensure a respectful learning environment.",
            },
          ].map((f, i) => (
            <div
              key={i}
              className="p-6 rounded-xl border border-gray-200 hover:shadow-md transition bg-white"
            >
              <div className="bg-gray-100 p-3 w-fit rounded-lg mb-4 text-gray-800">
                {f.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
              <p className="text-gray-600 text-sm">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-gray-50 px-6 md:px-20 py-20 text-center">
        <span className="text-sm font-medium text-gray-600 bg-gray-200 px-3 py-1 rounded-full">
          Simple Process
        </span>
        <h2 className="text-4xl font-semibold mt-4 mb-2">How SkillShare Works</h2>
        <p className="text-gray-600 mb-12">
          Start learning and teaching in three easy steps
        </p>

        <div className="flex flex-col md:flex-row justify-center items-center gap-12">
          {[
            {
              num: 1,
              title: "Create Your Profile",
              text: "List your skills to teach and subjects you want to learn. Get 100 free credits to start.",
            },
            {
              num: 2,
              title: "Find Your Match",
              text: "Browse partners or let our AI match you with compatible students based on learning needs.",
            },
            {
              num: 3,
              title: "Start Learning",
              text: "Schedule sessions, connect via video, and exchange knowledge. Earn credits while you teach!",
            },
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
          <img
            src={classroomImage}
            alt="Classroom"
            className="rounded-2xl shadow-2xl w-full max-w-lg object-cover"
          />
        </div>

        <div className="flex-1">
          <span className="inline-block text-sm font-medium text-indigo-600 bg-indigo-100 px-3 py-1 rounded-full mb-4">
            For Students, By Students
          </span>
          <h2 className="text-4xl font-semibold mb-6">
            Transform Your Learning Experience
          </h2>

          <ul className="space-y-4 text-gray-700 mb-8">
            {[
              {
                title: "Save Money on Tutoring",
                text: "No more expensive tutoring fees. Learn for free by contributing your own skills.",
              },
              {
                title: "Learn at Your Own Pace",
                text: "Schedule sessions that fit your calendar. Study when it works best for you.",
              },
              {
                title: "Build Your Network",
                text: "Connect with students worldwide. Build lasting friendships while learning.",
              },
              {
                title: "Reinforce Your Knowledge",
                text: "Teaching others is the best way to master a subject. Earn credits while solidifying your understanding.",
              },
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
            onClick={() => setShowModal(true)} 
            className="bg-black text-white px-6 py-3 rounded-md font-semibold hover:bg-gray-900 transition"
          >
            Join SkillShare Today →
          </button>
        </div>
      </section>

      {/* Modal appears at root */}
      <AuthModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
}
