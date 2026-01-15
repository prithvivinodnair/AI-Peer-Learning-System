"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Bell, User, CreditCard, Menu, X, LogOut } from "lucide-react";
import { useSession, signOut } from "next-auth/react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/");
  };

  // Get user initials
  const getUserInitials = () => {
    if (!session?.user?.name) return "U";
    return session.user.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900 relative">
      {/* Sidebar */}
      <aside
        className={`fixed md:static z-30 bg-white border-r border-gray-200 h-screen w-64 flex flex-col justify-between transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex flex-col flex-1">
          {/* Logo + Close */}
          <div className="flex items-center justify-between px-4 py-6 border-b border-gray-100">
            <h1 className="text-2xl font-bold text-indigo-700">SkillShare</h1>
            <button
              className="md:hidden text-gray-500 hover:text-indigo-600"
              onClick={() => setSidebarOpen(false)}
            >
              <X size={22} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 mt-4 space-y-2 px-4 overflow-y-auto">
            <NavItem
              label="Dashboard"
              active={pathname === "/dashboard"}
              onClick={() => router.push("/dashboard")}
            />
            <NavItem
              label="Find Partners"
              active={pathname === "/findpartners"}
              onClick={() => router.push("/findpartners")}
            />
            <NavItem
              label="Requests"
              active={pathname === "/requests"}
              onClick={() => router.push("/requests")}
            />
            <NavItem
              label="My Sessions"
              active={pathname === "/sessions"}
              onClick={() => router.push("/sessions")}
            />
            <NavItem
              label="AI Assistant"
              active={pathname === "/assistant"}
              onClick={() => router.push("/assistant")}
            />
            <NavItem
              label="Messages"
              active={pathname === "/messages"}
              onClick={() => router.push("/messages")}
            />
            <NavItem
              label="Resources"
              active={pathname === "/resources"}
              onClick={() => router.push("/resources")}
            />
            <NavItem
              label="Payments"
              active={pathname === "/payment"}
              onClick={() => router.push("/payment")}
            />
          </nav>
        </div>

        {/* Footer - Settings + Logout */}
        <div className="px-4 py-6 border-t border-gray-100 space-y-3">
          <button
            onClick={() => router.push("/profile")}
            className="w-full text-gray-600 hover:text-indigo-600 flex items-center gap-2 transition"
          >
            <User size={18} /> Settings
          </button>
          <button
            onClick={handleLogout}
            className="w-full text-red-600 hover:text-red-700 flex items-center gap-2 transition"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 md:hidden z-20"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-screen">
        {/* Top Navbar */}
        <header className="hidden md:flex items-center justify-between px-4 md:px-6 py-4 bg-white border-b border-gray-200">
          <div></div> {/* Spacer */}

          {/* Right Section */}
          <div className="flex items-center gap-4 sm:gap-6">
            <button
              onClick={() => router.push("/payment")}
              className="hidden sm:flex items-center gap-2 text-gray-700 hover:text-indigo-600 transition"
            >
              <CreditCard size={18} />
              <span className="font-medium">247</span>
            </button>

            <button
              className="relative text-gray-600 hover:text-indigo-600"
              onClick={() => router.push("/notifications")}
            >
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs px-1">
                3
              </span>
            </button>

            <button
              onClick={() => router.push("/profile")}
              className="hidden sm:flex items-center gap-2 hover:text-indigo-600 transition"
            >
              <div className="h-8 w-8 bg-indigo-100 text-indigo-700 flex items-center justify-center rounded-full font-medium">
                {getUserInitials()}
              </div>
              <div className="text-sm text-left">
                <p className="font-medium leading-none">{session?.user?.name || "User"}</p>
                <p className="text-xs text-gray-500">
                  {session?.user?.role === "tutor" ? "Tutor" : "Student"}
                </p>
              </div>
            </button>
          </div>
        </header>

        {/* Mobile header */}
        <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200 md:hidden">
          <button className="text-gray-600" onClick={() => setSidebarOpen(true)}>
            <Menu size={22} />
          </button>
          <h2 className="font-semibold text-lg">SkillShare</h2>
          <button
            className="relative text-gray-600 hover:text-indigo-600"
            onClick={() => router.push("/profile")}
          >
            <User size={20} />
          </button>
        </div>

        {/* Outlet where pages load */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">{children}</div>
      </main>
    </div>
  );
}

/* -------------------------
   Reusable Sidebar Item
------------------------- */
interface NavItemProps {
  label: string;
  active?: boolean;
  onClick: () => void;
}

function NavItem({ label, active, onClick }: NavItemProps) {
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
