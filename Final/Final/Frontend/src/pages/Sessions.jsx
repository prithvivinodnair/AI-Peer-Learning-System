import React, { useState } from "react";
import { Calendar, Clock, User, Video, Menu, X, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSession } from "../contexts/SessionContext";

export default function Sessions() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { sessions, deleteSession } = useSession();

  const handleDeleteSession = (sessionId) => {
    if (window.confirm('Are you sure you want to cancel this session?')) {
      deleteSession(sessionId);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900 relative">
     

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200 md:hidden">
          <button className="text-gray-600" onClick={() => setSidebarOpen(true)}>
            <Menu size={22} />
          </button>
          <h2 className="font-semibold text-lg">Sessions</h2>
        </div>

        {/* Session List */}
        <div className="flex-1 px-4 md:px-8 py-6 overflow-y-auto">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-2xl md:text-3xl font-bold mb-1">Your Upcoming Sessions</h1>
            <p className="text-gray-500 mb-6 text-sm md:text-base">
              View your scheduled sessions and join the meetings directly
            </p>

            <div className="space-y-4">
              {sessions.map((s) => (
                <div
                  key={s.id}
                  className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 hover:shadow-md transition"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="h-12 w-12 bg-indigo-100 text-indigo-700 flex items-center justify-center rounded-full shrink-0">
                        <Calendar size={22} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-base md:text-lg">{s.title}</h3>
                        <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                          <User size={14} /> {s.tutor}
                        </p>
                        <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                          <Clock size={14} /> {s.date}, {s.time}
                        </p>
                        {s.expertise && (
                          <p className="text-xs text-gray-500 mt-1">
                            Topics: {s.expertise}
                          </p>
                        )}
                        {s.notes && (
                          <p className="text-xs text-gray-500 mt-1 italic">
                            Notes: {s.notes}
                          </p>
                        )}
                        <p className="text-xs text-gray-400 mt-2">
                          {s.credits} credits • {s.status}
                        </p>
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <p className="text-xs text-indigo-600 font-medium">Meeting Link:</p>
                          <a
                            href={s.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-indigo-600 hover:text-indigo-800 underline break-all"
                          >
                            {s.link}
                          </a>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2">
                      <button
                        onClick={() => window.open(s.link, "_blank")}
                        className="flex items-center justify-center gap-2 bg-indigo-900 hover:bg-indigo-700 text-white text-sm px-5 py-2 rounded-lg transition whitespace-nowrap"
                      >
                        <Video size={16} /> Join Session
                      </button>
                      <button
                        onClick={() => handleDeleteSession(s.id)}
                        className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-2 rounded-lg transition"
                        title="Cancel Session"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {sessions.length === 0 && (
              <p className="text-center text-gray-500 mt-10">
                No upcoming sessions found.
              </p>
            )}
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
