import React, { useEffect, useState } from "react";
import { User, CreditCard, Award } from "lucide-react";

// Use an env var so you can switch between dev/prod easily.
// In Vite create .env.local and set VITE_API_BASE_URL=http://localhost:3000
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export default function Profile() {
  const [profile, setProfile] = useState({
    id: null,
    name: "",
    email: "",
    expertise: "",
    bio: "",
    credits_left: 0,
    credits_used: 0,
    sessions_completed: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });
  const [saving, setSaving] = useState(false);
  const [changingPw, setChangingPw] = useState(false);

  // Load profile from backend
  useEffect(() => {
    let ignore = false;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`${API_BASE}/api/users/me`, { credentials: "include" });
        if (!res.ok) throw new Error(`Profile fetch failed (${res.status})`);
        const data = await res.json();
        if (!ignore) {
          setProfile({
            id: data.id ?? null,
            name: data.name ?? "",
            email: data.email ?? "",
            expertise: data.expertise ?? "",
            bio: data.bio ?? "",
            credits_left: data.total_credits ?? 0,
            credits_used: data.credits_spent ?? 0,
            sessions_completed: data.credits_earned ?? 0, // adjust if you track separately
          });
        }
      } catch (e) {
        if (!ignore) setError(e.message || "Failed loading profile");
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    load();
    return () => { ignore = true; };
  }, []);

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setProfile((p) => ({ ...p, [name]: value }));
  };

  async function handleSaveProfile(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/api/users/me`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: profile.name,
          expertise: profile.expertise,
          bio: profile.bio,
        }),
      });
      if (res.ok) {
        alert("Profile updated");
      } else {
        alert("Update failed");
      }
    } catch (err) {
      alert("Server error updating profile");
    } finally {
      setSaving(false);
    }
  }

  async function handleChangePassword(e) {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      alert("New passwords do not match");
      return;
    }
    setChangingPw(true);
    try {
      const res = await fetch(`${API_BASE}/api/users/change-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ current: passwords.current, new: passwords.new }),
      });
      if (res.ok) {
        alert("Password updated");
        setPasswords({ current: "", new: "", confirm: "" });
      } else if (res.status === 400 || res.status === 401) {
        alert("Incorrect current password");
      } else {
        alert("Password change failed");
      }
    } catch (err) {
      alert("Server error changing password");
    } finally {
      setChangingPw(false);
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-[400px]">Loading profile...</div>;
  }
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px] flex-col gap-4">
        <p className="text-red-600">{error}</p>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded" onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold mb-1">Profile Settings</h1>
      <p className="text-gray-500 mb-6">Manage your personal information, bio, and password.</p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <StatCard icon={<CreditCard />} title="Credits Left" value={profile.credits_left.toString()} />
        <StatCard icon={<Award />} title="Credits Used" value={profile.credits_used.toString()} />
        <StatCard icon={<User />} title="Sessions Completed" value={profile.sessions_completed.toString()} />
      </div>

      <form onSubmit={handleSaveProfile} className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mb-8">
        <h2 className="font-semibold text-lg mb-4">Edit Profile</h2>
        <div className="grid gap-4">
          <input
            name="name"
            value={profile.name}
            onChange={handleFieldChange}
            placeholder="Full Name"
            className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
          />
          <input
            name="email"
            type="email"
            value={profile.email}
            disabled
            placeholder="Email"
            className="border rounded-lg px-4 py-2 bg-gray-100 text-gray-500"
          />
          <input
            name="expertise"
            value={profile.expertise}
            onChange={handleFieldChange}
            placeholder="Expertise (e.g., Math, Physics)"
            className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
          />
          <textarea
            name="bio"
            value={profile.bio}
            onChange={handleFieldChange}
            placeholder="Write a short bio..."
            rows={4}
            className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>
        <button type="submit" disabled={saving} className="mt-5 bg-indigo-900 disabled:opacity-60 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg text-sm font-medium">
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>

      <form onSubmit={handleChangePassword} className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        <h2 className="font-semibold text-lg mb-4">Change Password</h2>
        <div className="grid gap-4">
          <input
            type="password"
            name="current"
            value={passwords.current}
            onChange={(e) => setPasswords((p) => ({ ...p, current: e.target.value }))}
            placeholder="Current Password"
            className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
          />
          <input
            type="password"
            name="new"
            value={passwords.new}
            onChange={(e) => setPasswords((p) => ({ ...p, new: e.target.value }))}
            placeholder="New Password"
            className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
          />
          <input
            type="password"
            name="confirm"
            value={passwords.confirm}
            onChange={(e) => setPasswords((p) => ({ ...p, confirm: e.target.value }))}
            placeholder="Confirm New Password"
            className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>
        <button type="submit" disabled={changingPw} className="mt-5 bg-indigo-900 disabled:opacity-60 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg text-sm font-medium">
          {changingPw ? "Updating..." : "Update Password"}
        </button>
      </form>
    </div>
  );
}

/* -------------------------
   Reusable Components
------------------------- */
function NavItem() { return null; }

function StatCard({ icon, title, value }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm flex items-center gap-3">
      <div className="bg-indigo-100 text-indigo-700 p-2 rounded-lg">{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <h3 className="text-lg font-semibold">{value}</h3>
      </div>
    </div>
  );
}
