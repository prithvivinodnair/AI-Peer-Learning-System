"use client";

import React, { useState, useEffect } from "react";
import { PlusCircle, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface RequestItem {
  id: number;
  subject: string;
  message: string;
  tutor_id: number;
  student_id: number;
  status: string;
  created_at: string;
}

export default function Page() {
  const router = useRouter();
  const { data: session, status } = useSession();


  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    subject: "",
    message: "",
    tutor_id: "", // will choose tutor later
  });

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<number | null>(null);

  // Redirect if unauthenticated
  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  // Fetch requests from backend
  useEffect(() => {
    async function loadRequests() {
      try {
        const res = await fetch("/api/requests", { cache: "no-store" });

        if (res.ok) {
          const data = await res.json();
          console.log("Fetched requests:", data);
          setRequests(Array.isArray(data) ? data : []);
        } else {
          const error = await res.json();
          console.error("Failed to fetch requests:", error);
        }
      } catch (err) {
        console.error("Error loading requests:", err);
      }
      setLoading(false);
    }

    if (session) loadRequests();
  }, [session]);

  if (status === "loading" || loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!session) return null;

  // Handle Form Changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Submit Request → POST to backend
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.subject.trim() || !form.message.trim()) return;

    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({
          tutor_id: Number(form.tutor_id), // must be valid number
          subject: form.subject,
          message: form.message,
        }),
      });

      if (res.ok) {
        const newReq = await res.json();
        console.log("Created request:", newReq);
        setRequests((prev) => [newReq, ...prev]);
        
        // Reset Form
        setForm({
          subject: "",
          message: "",
          tutor_id: "",
        });
      } else {
        const error = await res.json();
        console.error("Failed to create request:", error);
        alert("Failed to create request: " + (error.error || "Unknown error"));
      }
    } catch (err) {
      console.error("Error creating request", err);
      alert("Error creating request");
    }
  };

  // Accept Request Handler
  const handleAcceptRequest = async () => {
    if (!selectedRequestId || !session?.user?.id) return;
    try {
      const res = await fetch(`/api/requests/${selectedRequestId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tutor_id: session.user.id,
          status: "accepted",
        }),
      });
      if (res.ok) {
        // Update request in UI
        setRequests((prev) =>
          prev.map((r) =>
            r.id === selectedRequestId
              ? { ...r, tutor_id: Number(session.user.id), status: "accepted" }
              : r
          )
        );
        setShowModal(false);
        setSelectedRequestId(null);
      } else {
        const error = await res.json();
        alert("Failed to accept request: " + (error.error || "Unknown error"));
      }
    } catch (err) {
      alert("Error accepting request");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <section className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-2">Post Requests</h1>
        <p className="text-gray-600 mb-8 text-sm md:text-base">
          Post your learning or collaboration requests.
        </p>

        {/* Post Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 md:p-6 grid gap-4 mb-10"
        >
          <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <PlusCircle size={20} className="text-indigo-600" />
            Create a New Request
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            <input
              name="subject"
              value={form.subject}
              onChange={handleChange}
              placeholder="Subject (e.g. Mathematics)"
              className="rounded-lg border px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              required
            />
            <input
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Describe what you need help with"
              className="rounded-lg border px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              required
            />
          </div>

          <button
            type="submit"
            className="bg-indigo-900 hover:bg-indigo-700 text-white font-medium px-5 py-2 rounded-lg w-fit"
          >
            Post Request
          </button>
        </form>

        {/* Modal for Accept Confirmation */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-xl shadow-lg p-8 max-w-sm w-full">
              <h3 className="text-lg font-semibold mb-4">Are you sure you want to accept this request?</h3>
              <div className="flex gap-4 justify-end">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAcceptRequest}
                  className="px-4 py-2 rounded-lg bg-indigo-900 text-white font-medium"
                >
                  Yes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Request List */}
        <div>
          <h2 className="text-xl font-semibold mb-4">All Requests</h2>
          {requests.length === 0 ? (
            <div className="text-center py-12 border rounded-lg bg-white text-gray-600">
              No requests yet.
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {requests.map((req) => (
                <div
                  key={req.id}
                  className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition"
                >
                  <h3 className="font-semibold text-lg">{req.subject}</h3>
                  <p className="text-sm text-gray-600 mt-1">{req.message}</p>

                  <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock size={14} />
                      {new Date(req.created_at).toLocaleString()}
                    </div>
                    <span className="text-indigo-700 font-medium capitalize">
                      {req.status}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedRequestId(req.id);
                      setShowModal(true);
                    }}
                    className="mt-4 w-full bg-indigo-900 hover:bg-indigo-700 text-white rounded-lg py-2 text-sm font-medium"
                  >
                    View / Accept
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
