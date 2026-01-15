"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Bell,
  User,
  Search,
  Star,
  BookOpen,
  TrendingUp,
  Calendar,
  CreditCard,
  Menu,
  X,
  CheckCircle,
} from "lucide-react";
 

export default function Page() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sessions, setSessions] = useState<any[]>([]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

useEffect(() => {
  type RawSession = { id: string; session_time: string; [key: string]: any };

  async function loadSessions() {
    try {
      const res = await fetch("/api/sessions", {
        method: "GET",
        cache: "no-store",
      });

      if (!res.ok) {
        console.error("Failed to load sessions");
        setSessions([]);
        return;
      }

      const data: RawSession[] = await res.json();

      const mapped = data.map((s: RawSession) => ({
        id: s.id,
        title: "Study Session",
        tutor: session?.user?.name ?? "Tutor",
        date: new Date(s.session_time).toLocaleDateString(),
        time: new Date(s.session_time).toLocaleTimeString(),
        credits: 10,
        link: "/sessions/" + s.id
      }));

      setSessions(mapped);

    } catch (err) {
      console.error("Error loading sessions:", err);
      setSessions([]);
    }
  }

  loadSessions();
}, [session]);



  if (status === "loading") {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!session) {
    return null;
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const upcomingSessions = sessions.slice(0, 3).map(session => ({
    id: session.id,
    initials: getInitials(session.tutor),
    title: session.title,
    with: session.tutor,
    time: `${session.date.split(',')[0]}, ${session.time.split(' - ')[0]}`,
    duration: "60 min",
    credits: session.credits,
    link: session.link,
  }));

  const recommendations = [
    {
      id: 1,
      name: "Dr. Lisa Wang",
      subject: "Organic Chemistry",
      rating: 4.9,
      sessions: 127,
      tags: ["Chemistry", "Biochemistry"],
      credits: 15,
    },
    {
      id: 2,
      name: "James Miller",
      subject: "Data Structures",
      rating: 4.8,
      sessions: 89,
      tags: ["Programming", "Algorithms"],
      credits: 12,
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900 relative">
      <div className="flex-1 flex flex-col">
        {/* Stats */}
        <section className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 md:p-6">
          <StatCard icon={<CreditCard size={20} />} title="Total Credits" value="247" subtitle="+23 from last week" />
          <StatCard icon={<Calendar size={20} />} title="Upcoming Sessions" value={sessions.length.toString()} subtitle={`${sessions.length} sessions scheduled`} />
          <StatCard icon={<Star size={20} />} title="Rating" value="4.8" subtitle="Based on 47 reviews" />
          <StatCard icon={<TrendingUp size={20} />} title="Skill Progress" value="73%" subtitle="+12% this month" />
        </section>

        {/* Upcoming & AI Recommendations */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 px-4 md:px-6 pb-6">
          <div className="lg:col-span-2 bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-1">
              <h2 className="font-semibold text-lg">Upcoming Sessions</h2>
              {sessions.length > 3 && (
                <button
                  onClick={() => router.push('/sessions')}
                  className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  View All ({sessions.length})
                </button>
              )}
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Your scheduled learning and teaching sessions
            </p>
            <div className="space-y-4">
              {upcomingSessions.length > 0 ? (
                upcomingSessions.map((s) => (
                  <div
                    key={s.id}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border border-gray-100 rounded-lg hover:shadow-sm transition"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-semibold">
                        {s.initials}
                      </div>
                      <div>
                        <h3 className="font-medium text-sm sm:text-base">{s.title}</h3>
                        <p className="text-sm text-gray-500">with {s.with}</p>
                        <p className="text-xs text-gray-400">{s.time} • {s.duration}</p>
                      </div>
                    </div>
                    <div className="text-right mt-3 sm:mt-0">
                      <p className="text-xs text-gray-400 mb-1">{s.credits} credits</p>
                      <a
                        href={s.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-indigo-900 hover:bg-indigo-700 text-white text-sm px-4 py-1.5 rounded-lg inline-block text-center"
                      >
                        Join Session
                      </a>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p className="mb-2">No upcoming sessions</p>
                  <button
                    onClick={() => router.push('/findpartners')}
                    className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                  >
                    Book a session →
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="font-semibold text-lg mb-1">AI Recommendations</h2>
            <p className="text-sm text-gray-500 mb-4">
              Perfect matches for your learning goals
            </p>
            <div className="space-y-4">
              {recommendations.map((rec) => (
                <div key={rec.id} className="border border-gray-100 rounded-lg p-4 hover:shadow-sm transition">
                  <h3 className="font-medium text-sm sm:text-base">{rec.name}</h3>
                  <p className="text-sm text-gray-500">{rec.subject}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {rec.rating} ⭐ {rec.sessions} sessions
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {rec.tags.map((t) => (
                      <span key={t} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{t}</span>
                    ))}
                  </div>
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-xs text-gray-400">{rec.credits} credits</span>
                    <button 
                      onClick={() => router.push('/findpartners')}
                      className="bg-indigo-900 hover:bg-indigo-700 text-white text-sm px-4 py-1.5 rounded-lg"
                    >
                      Book Session
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, title, value, subtitle }: { icon: React.ReactNode; title: string; value: string; subtitle: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 md:p-5 shadow-sm flex flex-col gap-1">
      <div className="flex items-center gap-2 text-gray-500">
        {icon}
        <span className="text-sm">{title}</span>
      </div>
      <h3 className="text-xl md:text-2xl font-bold">{value}</h3>
      <p className="text-xs text-gray-400">{subtitle}</p>
    </div>
  );
}
