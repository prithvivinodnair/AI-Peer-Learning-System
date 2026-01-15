"use client";

import React, { useEffect, useState } from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface Activity {
  id: number;
  title: string;
  partner: string;
  credits: number;
  type: "earned" | "spent";
  date: string;
}

export default function Page() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [activity, setActivity] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  // Protect route
  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  // Load notifications from backend
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/notifications", {
          cache: "no-store",
        });

        if (!res.ok) {
          console.error("Failed to load notifications");
          setLoading(false);
          return;
        }

        const data = await res.json();

        // Transform backend rows to frontend format
        const mapped = data.map((n: any) => ({
          id: n.id,
          title: n.title,
          partner: n.partner ?? "Unknown",
          credits: n.credits,
          type: n.credits >= 0 ? "earned" : "spent",
          date: new Date(n.created_at).toLocaleDateString(),
        }));

        setActivity(mapped);
      } catch (err) {
        console.error("Error loading notifications:", err);
      }

      setLoading(false);
    }

    if (session) load();
  }, [session]);

  if (status === "loading" || loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!session) return null;

  return (
    <div className="max-w-4xl mx-auto p-6">
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
          {activity.length === 0 && (
            <p className="text-center text-gray-500 py-6">
              No recent activity yet.
            </p>
          )}

          {activity.map((a) => (
            <div key={a.id} className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center ${
                    a.type === "earned"
                      ? "bg-green-100 text-green-600"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {a.type === "earned" ? (
                    <ArrowUpRight size={16} />
                  ) : (
                    <ArrowDownRight size={16} />
                  )}
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
                {a.credits > 0 ? `+${a.credits}` : a.credits}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
