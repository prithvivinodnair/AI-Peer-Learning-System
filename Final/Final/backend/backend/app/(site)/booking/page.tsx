"use client";

import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function Page() {
  const params = useParams();
  const tutorId = Number(params?.id); // tutor ID from URL
  const router = useRouter();
  const { data: session, status } = useSession();

  const [dateTime, setDateTime] = useState("");
  const [duration, setDuration] = useState("60");

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  if (status === "loading") {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!session) return null;

  const book = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!dateTime) {
      alert("Select a date & time");
      return;
    }

    // Convert local datetime to MySQL DATETIME
    const session_time = new Date(dateTime).toISOString().slice(0, 19).replace("T", " ");

    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          request_id: null, // optional for now
          student_id: session.user.id,
          session_time,
          tutor_id: tutorId
        }),
      });

      if (res.ok) {
        alert("Session booked successfully!");
        router.push("/sessions");
      } else {
        alert("Booking failed. Check backend logs.");
      }
    } catch (err) {
      console.error(err);
      alert("Error booking session.");
    }
  };

  return (
    <section className="container py-10">
      <h2 className="text-2xl font-bold mb-4">Book with Tutor {tutorId}</h2>

      <form onSubmit={book} className="card grid gap-4 max-w-md">
        <input
          type="datetime-local"
          value={dateTime}
          onChange={(e) => setDateTime(e.target.value)}
          className="rounded-xl border px-4 py-2"
          required
        />

        <select
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          className="rounded-xl border px-4 py-2"
        >
          <option value="30">30 min</option>
          <option value="60">60 min</option>
          <option value="90">90 min</option>
        </select>

        <button className="btn btn-primary w-fit">Confirm</button>
      </form>
    </section>
  );
}
