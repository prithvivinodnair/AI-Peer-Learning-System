import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../component/Navbar.jsx";
import Footer from "../component/Footer.jsx";

export default function RootLayout() {
  const { pathname } = useLocation();
  const hideChrome = ["/signin", "/signup", "/dashboard", "/find-partners", "/ai-assistant"].includes(pathname); // Hide Navbar/Footer on dashboard and find-partners
  return (
    <div className="min-h-dvh bg-gray-50 text-gray-900">
      {!hideChrome && <Navbar />}
      <main className={!hideChrome ? "pb-16" : ""}>
        <Outlet />
      </main>
      {!hideChrome && <Footer />}
    </div>
  );
}
