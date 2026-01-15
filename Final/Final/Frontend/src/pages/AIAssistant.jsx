import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X, User, Send, Bot, Zap, BarChart3, Lightbulb } from "lucide-react";

export default function AIAssistant() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "bot",
      text: `Hello! I'm SkillShare Bot, your AI learning assistant. I can help you with study questions, find learning partners, and suggest optimal learning paths. What would you like to work on today?`,
    },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    const userMessage = { id: Date.now(), sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // Simulate AI reply
    setTimeout(() => {
      const botReply = {
        id: Date.now() + 1,
        sender: "bot",
        text: `Great question! Here's a breakdown:\n\n1. Identify the main idea.\n2. Apply logical reasoning.\n3. Review key formulas.\n\nWould you like a real example?`,
      };
      setMessages((prev) => [...prev, botReply]);
    }, 1000);
  };

  const usageStats = {
    totalMessages: 56,
    creditsUsed: 42,
    lastUsed: "2 hours ago",
    accuracyScore: "92%",
  };

  const proTips = [
    "Ask follow-up questions for deeper explanations.",
    "Use the 'Explain Like I'm 5' prompt for simplification.",
    "Ask AI to generate quizzes from your notes.",
    "Combine AI with sessions for faster progress.",
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900 relative">
     

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Chat Section */}
        <div className="flex-1 px-4 md:px-8 py-6 overflow-y-auto">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-2xl md:text-3xl font-bold mb-1">AI Assistant</h1>
            <p className="text-gray-500 mb-6 text-sm md:text-base">
              Get instant help with your studies, powered by advanced AI
            </p>

            {/* Chat Box */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col p-4 md:p-6 h-[65vh] overflow-y-auto">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`mb-4 flex ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {msg.sender === "bot" && (
                    <div className="flex items-start gap-2">
                      <div className="h-8 w-8 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center">
                        <Bot size={16} />
                      </div>
                      <div className="bg-gray-100 px-3 py-2 rounded-lg text-sm whitespace-pre-wrap max-w-xs sm:max-w-sm md:max-w-md">
                        {msg.text.split("\n").map((line, i) => (
                          <p key={i} className="mb-1 last:mb-0">
                            {line}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}

                  {msg.sender === "user" && (
                    <div className="bg-indigo-900 text-white px-3 py-2 rounded-lg text-sm max-w-xs sm:max-w-sm md:max-w-md">
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
                className="flex-1 bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
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

        {/* Right Sidebar (Stats + Tips) */}
        <div className="hidden lg:flex flex-col w-80 p-6 border-l border-gray-100 bg-white">
          {/* AI Usage Stats */}
          <div className="mb-6 p-4 border border-gray-100 rounded-xl shadow-sm bg-gray-50">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 size={18} className="text-indigo-600" />
              <h3 className="font-semibold text-gray-800">AI Usage Stats</h3>
            </div>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>Total Messages: <span className="font-medium">{usageStats.totalMessages}</span></li>
              <li>Credits Used: <span className="font-medium">{usageStats.creditsUsed}</span></li>
              <li>Last Used: <span className="font-medium">{usageStats.lastUsed}</span></li>
              <li>Accuracy: <span className="font-medium">{usageStats.accuracyScore}</span></li>
            </ul>
          </div>

          {/* Pro Tips */}
          <div className="p-4 border border-gray-100 rounded-xl shadow-sm bg-gray-50">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb size={18} className="text-yellow-500" />
              <h3 className="font-semibold text-gray-800">Pro Tips</h3>
            </div>
            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
              {proTips.map((tip, i) => (
                <li key={i}>{tip}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------
   Reusable Sidebar Item
------------------------- */
function NavItem({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between text-sm font-medium transition ${
        active
          ? "bg-indigo-50 text-indigo-700"
          : "text-gray-600 hover:bg-gray-50 hover:text-indigo-600"
      }`}
    >
      <span>{label}</span>
    </button>
  );
}
