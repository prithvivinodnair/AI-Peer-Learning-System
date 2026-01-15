"use client";

import React, { useState, useEffect } from "react";
import { User, CreditCard, Award } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface ProfileData {
  id: number;
  name: string;
  email: string;
  expertise: string;
  bio: string;
  credits_earned: number;
  credits_spent: number;
  total_credits: number;
}

export default function Page() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  // Protect route
  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  // Load REAL user profile
  useEffect(() => {
    async function load() {
      if (!session?.user?.id) return;

      try {
        const res = await fetch(`/api/users/me`, { cache: "no-store" });

        if (!res.ok) {
          console.error("Error fetching profile");
          return;
        }

        const data = await res.json();

        setProfile({
          id: data.id,
          name: data.name,
          email: data.email,
          expertise: data.expertise ?? "",
          bio: data.bio ?? "",
          credits_earned: data.credits_earned ?? 0,
          credits_spent: data.credits_spent ?? 0,
          total_credits: data.total_credits ?? 0,
        });
      } catch (err) {
        console.error("Profile load error:", err);
      }

      setLoading(false);
    }

    if (session) load();
  }, [session]);

  // Saving profile update
  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!profile) return;

    try {
      const res = await fetch(`/api/users/me`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: profile.name,
          expertise: profile.expertise,
          bio: profile.bio,
        }),
      });

      if (res.ok) {
        alert("Profile updated!");
      } else {
        alert("Failed to update profile.");
      }
    } catch (err) {
      alert("Server error updating profile.");
    }
  }

  // Change password
  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();

    if (passwords.new !== passwords.confirm) {
      alert("New passwords do not match!");
      return;
    }

    try {
      const res = await fetch(`/api/users/change-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          current: passwords.current,
          new: passwords.new,
        }),
      });

      if (res.ok) {
        alert("Password updated!");
        setPasswords({ current: "", new: "", confirm: "" });
      } else {
        alert("Incorrect current password.");
      }
    } catch (err) {
      alert("Server error updating password.");
    }
  }

  if (status === "loading" || loading || !profile) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900">
      <div className="flex-1 flex flex-col">
        <div className="flex-1 px-4 md:px-8 py-8 overflow-y-auto">
          <div className="max-w-4xl mx-auto">

            <h1 className="text-2xl md:text-3xl font-bold mb-1">Profile Settings</h1>
            <p className="text-gray-500 mb-6">
              Manage your personal information, bio, and password.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              <StatCard icon={<CreditCard />} title="Credits Left" value={profile.total_credits.toString()} />
              <StatCard icon={<Award />} title="Credits Earned" value={profile.credits_earned.toString()} />
              <StatCard icon={<User />} title="Sessions Completed" value={profile.credits_spent.toString()} />
            </div>

            {/* Profile Form */}
            <form onSubmit={handleSaveProfile} className="bg-white border rounded-xl shadow-sm p-6 mb-8">
              <h2 className="font-semibold text-lg mb-4">Edit Profile</h2>

              <div className="grid gap-4">
                <input
                  name="name"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="border rounded-lg px-4 py-2"
                  placeholder="Full Name"
                />

                <input
                  name="email"
                  type="email"
                  value={profile.email}
                  disabled
                  className="border rounded-lg px-4 py-2 bg-gray-100 text-gray-500"
                />

                <input
                  name="expertise"
                  value={profile.expertise}
                  onChange={(e) => setProfile({ ...profile, expertise: e.target.value })}
                  className="border rounded-lg px-4 py-2"
                  placeholder="Expertise (e.g. Math, Physics)"
                />

                <textarea
                  name="bio"
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  className="border rounded-lg px-4 py-2"
                  rows={4}
                  placeholder="Write a short bio..."
                />
              </div>

              <button className="mt-5 bg-indigo-900 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg">
                Save Changes
              </button>
            </form>

            {/* Change Password */}
            <form onSubmit={handleChangePassword} className="bg-white border rounded-xl shadow-sm p-6">
              <h2 className="font-semibold text-lg mb-4">Change Password</h2>

              <div className="grid gap-4">
                <input
                  type="password"
                  name="current"
                  value={passwords.current}
                  onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                  placeholder="Current Password"
                  className="border rounded-lg px-4 py-2"
                />

                <input
                  type="password"
                  name="new"
                  value={passwords.new}
                  onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                  placeholder="New Password"
                  className="border rounded-lg px-4 py-2"
                />

                <input
                  type="password"
                  name="confirm"
                  value={passwords.confirm}
                  onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                  placeholder="Confirm New Password"
                  className="border rounded-lg px-4 py-2"
                />
              </div>

              <button className="mt-5 bg-indigo-900 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg">
                Update Password
              </button>
            </form>

          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, title, value }: { icon: React.ReactNode; title: string; value: string }) {
  return (
    <div className="bg-white rounded-xl border p-4 shadow-sm flex items-center gap-3">
      <div className="bg-indigo-100 text-indigo-700 p-2 rounded-lg">{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <h3 className="text-lg font-semibold">{value}</h3>
      </div>
    </div>
  );
}
