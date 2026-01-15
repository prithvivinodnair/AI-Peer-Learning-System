"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Page() {
  const router = useRouter();

  const [form, setForm] = useState({
    subject: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.subject.trim() || !form.message.trim()) {
      alert("Subject and message are required");
      return;
    }

    const res = await fetch("/api/requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
      body: JSON.stringify({
        subject: form.subject,
        message: form.message,
      }),
    });

    if (res.ok) {
      alert("Request posted successfully!");
      router.push("/requests"); // send back to main Requests page
    } else {
      alert("Error posting request");
    }
  };

  return (
    <section className="container py-10 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold mb-2">Post Requests</h2>
      <p className="text-gray-600 mb-8">Post your learning or collaboration requests.</p>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-2 mb-6">
          <span className="text-blue-600 text-xl">⊕</span>
          <h3 className="text-xl font-semibold">Create a New Request</h3>
        </div>

        <form onSubmit={submit} className="grid gap-4">
          {/* Subject and Details in one row */}
          <div className="grid grid-cols-2 gap-4">
            <input
              name="subject"
              value={form.subject}
              onChange={handleChange}
              placeholder="Subject (e.g. Mathematics)"
              className="rounded-lg border border-gray-300 px-4 py-3"
              required
            />
            <input
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Describe what you need help with"
              className="rounded-lg border border-gray-300 px-4 py-3"
              required
            />
          </div>

          <button 
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-3 rounded-lg w-fit"
          >
            Post Request
          </button>
        </form>
      </div>
    </section>
  );
}
