"use client";

import React, { useState, useEffect } from "react";
import { Calendar, Clock, User, Video, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function Page() {
  const [sessions, setSessions] = useState<any[]>([]);
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Load sessions from backend
  useEffect(() => {
    async function loadSessions() {
      try {
        const res = await fetch("/api/sessions", { cache: "no-store" });

        if (!res.ok) {
          console.error("Failed to load sessions");
          return;
        }

        const data = await res.json();

        // Transform DB data to UI structure
        const mapped = data.map((s: any) => {
          const isUserTutor = String(s.tutor_id) === String(session?.user?.id);
          const isUserStudent = String(s.student_id) === String(session?.user?.id);
          
          return {
            id: s.id,
            title: isUserTutor ? `Session with ${s.student_name}` : `Session with ${s.tutor_name}`,
            tutor: isUserTutor ? "You (Tutor)" : s.tutor_name || `Tutor ID ${s.tutor_id}`,
            student: isUserStudent ? "You (Student)" : s.student_name || `Student ID ${s.student_id}`,
            role: isUserTutor ? "Tutor" : "Student",
            date: new Date(s.session_time).toLocaleDateString(),
            time: new Date(s.session_time).toLocaleTimeString(),
            credits: 10,
            status: s.status || "scheduled",
            link: s.meet_link || `/sessions/${s.id}`,
            expertise: "",
            notes: "",
          };
        });

        setSessions(mapped);
      } catch (err) {
        console.error("Error loading sessions:", err);
      }
    }

    if (session) loadSessions();
  }, [session]);

  if (status === "loading") {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!session) return null;

  // Handle deleting session
  const handleDeleteSession = async (id: number) => {
    if (typeof window !== "undefined") {
      const ok = window.confirm("Are you sure you want to cancel this session?");
      if (!ok) return;
    }

    try {
      await fetch(`/api/sessions/${id}`, {
        method: "DELETE",
      });

      setSessions((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900 relative">
      <div className="flex-1 flex flex-col">
        <div className="flex-1 px-4 md:px-8 py-6 overflow-y-auto">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-2xl md:text-3xl font-bold mb-1">Your Upcoming Sessions</h1>
            <p className="text-gray-500 mb-6 text-sm md:text-base">
              View your scheduled sessions and join meetings directly.
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
                          <User size={14} /> {s.role === "Tutor" ? `Student: ${s.student}` : `Tutor: ${s.tutor}`}
                        </p>
                        <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                          <Clock size={14} /> {s.date}, {s.time}
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                          {s.credits} credits • Status: {s.status} • Role: {s.role}
                        </p>

                        {/* Meeting Link */}
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
                        onClick={() =>
                          typeof window !== "undefined" && window.open(s.link, "_blank")
                        }
                        className="flex items-center justify-center gap-2 bg-indigo-900 hover:bg-indigo-700 text-white text-sm px-5 py-2 rounded-lg transition whitespace-nowrap"
                      >
                        <Video size={16} /> Join Session
                      </button>

                      <button
                        onClick={() => handleDeleteSession(s.id)}
                        className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-2 rounded-lg transition"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {sessions.length === 0 && (
              <p className="text-center text-gray-500 mt-10">No upcoming sessions found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
