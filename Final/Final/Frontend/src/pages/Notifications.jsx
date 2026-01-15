import React from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

export default function Notifications() {
  const recentActivity = [
    {
      id: 1,
      title: "Completed Python Basics Session",
      partner: "David Chen",
      credits: "+10",
      type: "earned",
      date: "Oct 25, 2025",
    },
    {
      id: 2,
      title: "Booked Calculus II Session",
      partner: "Sarah Kim",
      credits: "-12",
      type: "spent",
      date: "Oct 24, 2025",
    },
    {
      id: 3,
      title: "Completed Spanish Conversation",
      partner: "Miguel Rodriguez",
      credits: "+8",
      type: "earned",
      date: "Oct 23, 2025",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
        <p className="text-gray-600 mt-1">Your recent activity and updates</p>
      </div>

      <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
        <h2 className="font-semibold text-lg mb-1">Recent Activity</h2>
        <p className="text-sm text-gray-500 mb-4">
          Your latest completed sessions and credit transactions
        </p>

        <div className="divide-y divide-gray-100">
          {recentActivity.map((a) => (
            <div key={a.id} className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center ${
                    a.type === "earned" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                  }`}
                >
                  {a.type === "earned" ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                </div>
                <div>
                  <p className="text-sm font-medium">{a.title}</p>
                  <p className="text-xs text-gray-500">
                    with {a.partner} • {a.date}
                  </p>
                </div>
              </div>
              <p
                className={`font-medium ${
                  a.type === "earned" ? "text-green-600" : "text-red-600"
                }`}
              >
                {a.credits}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}