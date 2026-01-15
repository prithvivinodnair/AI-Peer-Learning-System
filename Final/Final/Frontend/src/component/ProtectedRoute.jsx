import { Navigate, useLocation } from "react-router-dom";

// Replace with real auth state later
const fakeIsAuthed = () => Boolean(localStorage.getItem("demo_authed"));

export default function ProtectedRoute({ children }) {
  const loc = useLocation();
  if (!fakeIsAuthed()) {
    return <Navigate to="/signin" replace state={{ from: loc.pathname }} />;
  }
  return children;
}
