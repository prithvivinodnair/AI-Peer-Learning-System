"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Send, Bot, BarChart3, Lightbulb } from "lucide-react";
import { useSession } from "next-auth/react";

interface Message {
  id: number;
  sender: "bot" | "user";
  text: string;
}

export default function Page() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: "bot",
      text: `Hello! I'm SkillShare Bot, your AI learning assistant. I can help you with study questions, find partners, and suggest the best learning steps. What would you like to work on today?`,
    },
  ]);

  const [input, setInput] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  if (!session) return null;


  const handleSend = async () => {
    if (!input.trim()) return;

    // User message
    const userMsg: Message = {
      id: Date.now(),
      sender: "user",
      text: input,
    };
    setMessages((prev) => [...prev, userMsg]);

    const prompt = input;
    setInput("");

    // Send to backend API
    const res = await fetch("/api/assistant", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: prompt }),
    });

    const data = await res.json();

    // Bot reply
    const botMsg: Message = {
      id: Date.now() + 1,
      sender: "bot",
      text: data.reply || "I couldn't understand that. Try again!",
    };

    setMessages((prev) => [...prev, botMsg]);
  };

  // Fake stats & tips UI
  const usageStats = {
    totalMessages: messages.length,
    creditsUsed: 42,
    lastUsed: "Just now",
    accuracyScore: "92%",
  };

  const proTips = [
    "Ask follow-up questions for deeper explanations.",
    "Use 'Explain Like I'm 5' for simpler answers.",
    "Ask AI to generate quizzes or spaced-repetition cards.",
    "Request personalized study plans or learning paths.",
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900">
      <div className="flex-1 flex flex-col md:flex-row">

        {/* Chat Section */}
        <div className="flex-1 px-4 md:px-8 py-6 overflow-y-auto">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-2xl md:text-3xl font-bold mb-1">AI Assistant</h1>
            <p className="text-gray-500 mb-6 text-sm md:text-base">Ask anything. Learn instantly.</p>

            {/* Chat Box */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col p-4 md:p-6 h-[65vh] overflow-y-auto">
              {messages.map((msg) => (
                <div key={msg.id} className={`mb-4 flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                  {msg.sender === "bot" ? (
                    <div className="flex items-start gap-2">
                      <div className="h-8 w-8 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center">
                        <Bot size={16} />
                      </div>
                      <div className="bg-gray-100 px-3 py-2 rounded-lg text-sm whitespace-pre-wrap max-w-md">
                        {msg.text}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-indigo-900 text-white px-3 py-2 rounded-lg text-sm max-w-md">
                      {msg.text}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Input Field */}
            <div className="flex items-center gap-2 mt-4">
              <input
                type="text"
                placeholder="Ask me anything about your studies..."
                className="flex-1 bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <button
                onClick={handleSend}
                className="bg-indigo-900 hover:bg-indigo-700 text-white p-2 rounded-lg"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Stats Sidebar */}
        <div className="hidden lg:flex flex-col w-80 p-6 border-l border-gray-100 bg-white">
          <div className="mb-6 p-4 border border-gray-100 rounded-xl shadow-sm bg-gray-50">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 size={18} className="text-indigo-600" />
              <h3 className="font-semibold">AI Usage Stats</h3>
            </div>
            <ul className="text-sm space-y-1">
              <li>Total Messages: {usageStats.totalMessages}</li>
              <li>Credits Used: {usageStats.creditsUsed}</li>
              <li>Last Used: {usageStats.lastUsed}</li>
              <li>Accuracy: {usageStats.accuracyScore}</li>
            </ul>
          </div>

          <div className="p-4 border border-gray-100 rounded-xl shadow-sm bg-gray-50">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb size={18} className="text-yellow-500" />
              <h3 className="font-semibold">Pro Tips</h3>
            </div>
            <ul className="list-disc list-inside text-sm space-y-1">
              {proTips.map((t, i) => <li key={i}>{t}</li>)}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
