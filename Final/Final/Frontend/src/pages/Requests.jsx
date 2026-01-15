import React, { useState } from "react";
import { PlusCircle, Clock } from "lucide-react";

export default function PostRequests() {
  const [requests, setRequests] = useState([]);

  const [form, setForm] = useState({
    subject: "",
    message: "",
  });

  // Fetch requests from API
  React.useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/requests");
      if (res.ok) {
        const data = await res.json();
        setRequests(data);
      }
    } catch (error) {
      console.error("Error fetching requests:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.subject.trim() || !form.message.trim()) {
      alert("Subject and message are required");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: form.subject,
          message: form.message,
        }),
      });

      if (res.ok) {
        alert("Request posted successfully!");
        setForm({ subject: "", message: "" });
        fetchRequests(); // Refresh the list
      } else {
        alert("Error posting request");
      }
    } catch (error) {
      console.error("Error posting request:", error);
      alert("Error posting request");
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

        {/* Request List */}
        <div>
          <h2 className="text-xl font-semibold mb-4">All Requests</h2>
          {requests.length === 0 ? (
            <div className="text-center py-12 border rounded-lg bg-white text-gray-600">
              No requests yet. Post your first one!
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {requests.map((req) => (
                <div
                  key={req.id}
                  className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition"
                >
                  <h3 className="font-semibold text-lg">{req.subject}</h3>
                  <p className="text-sm text-gray-600 mt-2">
                    {req.message}
                  </p>
                  <div className="flex items-center mt-4 text-sm text-gray-500">
                    <Clock size={14} className="mr-1" />
                    {new Date(req.created_at).toLocaleString()}
                  </div>
                  <button className="mt-4 w-full bg-indigo-900 hover:bg-indigo-700 text-white rounded-lg py-2 text-sm font-medium">
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
