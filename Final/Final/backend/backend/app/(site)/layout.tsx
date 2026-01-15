"use client";

import DashboardLayout from "../components/DashboardLayout";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { usePathname } from "next/navigation";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Pages that should use the dashboard layout
  const dashboardPages = [
    "/dashboard",
    "/assistant",
    "/findpartners",
    "/requests",
    "/sessions",
    "/messages",
    "/resources",
    "/payment",
    "/notifications",
    "/profile",
    "/postrequest",
    "/tutorprofile",
    "/course",
    "/browse",
    "/booking"
  ];
  
  // Pages that should NOT show Navbar/Footer
  const hideChrome = ["/login", ...dashboardPages];
  
  // Check if current page should use dashboard layout
  const useDashboardLayout = dashboardPages.some(page => pathname?.startsWith(page));
  const shouldHideChrome = hideChrome.some(page => pathname?.startsWith(page));
  
  if (useDashboardLayout) {
    return <DashboardLayout>{children}</DashboardLayout>;
  }
  
  // For non-dashboard pages (home, etc.)
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {!shouldHideChrome && <Navbar />}
      <main className={!shouldHideChrome ? "pb-16" : ""}>
        {children}
      </main>
      {!shouldHideChrome && <Footer />}
    </div>
  );
}
