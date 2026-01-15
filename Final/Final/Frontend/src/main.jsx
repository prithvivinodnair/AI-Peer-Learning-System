import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./index.css";
import RootLayout from "./layouts/RootLayout.jsx";
import DashboardLayout from "./layouts/DashboardLayout.jsx";
import { SessionProvider } from "./contexts/SessionContext.jsx";

import Home from "./pages/Home.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import FindPartners from "./pages/FindPartners.jsx";
import AIAssistant from "./pages/AIAssistant.jsx";
import Sessions from "./pages/Sessions.jsx";
import Payments from "./pages/Payment.jsx";
import Profile from "./pages/Profile.jsx";
import Resources from "./pages/Resources.jsx"; 
import Messages from "./pages/Messages.jsx";
import Requests from  "./pages/Requests.jsx";
import Notifications from "./pages/Notifications.jsx";


const router = createBrowserRouter([
  // Public landing layout
  {
    element: <RootLayout />,
    children: [
      { path: "/", element: <Home /> },
    ],
  },

  // Dashboard layout
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "find-partners", element: <FindPartners /> },
      { path: "ai-assistant", element: <AIAssistant /> },
      { path: "sessions", element: <Sessions /> },
      { path: "payments", element: <Payments /> },
      { path: "profile", element: <Profile /> },
      { path: "resources", element: <Resources /> },
      { path: "messages", element: <Messages /> },
      { path: "requests", element: <Requests /> },
      { path: "notifications", element: <Notifications /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <SessionProvider>
      <RouterProvider router={router} />
    </SessionProvider>
  </React.StrictMode>
);
