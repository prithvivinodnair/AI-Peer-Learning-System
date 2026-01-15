"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Star,
  Zap,
  MapPin,
  Clock,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface Tutor {
  id: number;
  initials: string;
  name: string;
  rating: number;
  sessions: number;
  match: number;
  rate: number;
  expertise: string[];
  bio: string;
  response: string;
  languages: string[];
  availability: string;
  online: boolean;
}

export default function Page() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [searchTerm, setSearchTerm] = useState("");
  const [subject, setSubject] = useState("");
  const [creditsSort, setCreditsSort] = useState("");
  const [availability, setAvailability] = useState("");

  const [partners, setPartners] = useState<Tutor[]>([]);
  const [filteredPartners, setFilteredPartners] = useState<Tutor[]>([]);

  const [selectedPartner, setSelectedPartner] = useState<Tutor | null>(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [bookingDetails, setBookingDetails] = useState({
    date: "",
    time: "",
    notes: "",
  });

  // Protect route
  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  // Load REAL tutors from backend
  useEffect(() => {
    async function loadTutors() {
      try {
        const res = await fetch("/api/users?role=tutor", {
          cache: "no-store",
        });

        if (!res.ok) {
          console.error("Failed to fetch tutors");
          return;
        }

        const data = await res.json();

        // Map backend → frontend schema
        const mapped = data.map((t: any) => ({
          id: t.id,
          initials: t.name
            .split(" ")
            .map((w: string) => w[0])
            .join("")
            .slice(0, 3)
            .toUpperCase(),
          name: t.name,
          rating: t.rating ?? 4.8,
          sessions: t.sessions ?? 50,
          match: t.match ?? 90,
          rate: t.price ?? 20,
          // Use backend field `expertise` (not `subject`) and normalize to array
          expertise: (t.expertise || "General")
            .split(",")
            .map((x: string) => x.trim())
            .filter((x: string) => x.length > 0),
          // Show real bio if present and non-empty; otherwise fallback
          bio: (typeof t.bio === "string" && t.bio.trim().length > 0)
            ? t.bio.trim()
            : "No bio available.",
          response: t.response_time ?? "< 1 hour",
          languages: (t.languages || "English").split(","),
          availability: t.availability ?? "Available now",
          online: true,
        }));

        setPartners(mapped);
        setFilteredPartners(mapped);
      } catch (err) {
        console.error("Error loading tutors", err);
      }
    }

    if (session) loadTutors();
  }, [session]);

  // Filters
  useEffect(() => {
    let filtered = partners.filter((p) => {
      const s = searchTerm.toLowerCase();
      const searchMatch =
        searchTerm === "" ||
        p.name.toLowerCase().includes(s) ||
        p.expertise.some((ex) => ex.toLowerCase().includes(s));

      const subjectMatch = subject === "" || p.expertise.includes(subject);
      const availabilityMatch = availability === "" || p.availability === availability;

      return searchMatch && subjectMatch && availabilityMatch;
    });

    if (creditsSort === "high-low") {
      filtered = filtered.sort((a, b) => b.rate - a.rate);
    } else if (creditsSort === "low-high") {
      filtered = filtered.sort((a, b) => a.rate - b.rate);
    }

    setFilteredPartners(filtered);
  }, [searchTerm, subject, creditsSort, availability, partners]);

  const subjectOptions = [
    "Mathematics",
    "Statistics",
    "Data Analysis",
    "Programming",
    "Web Development",
    "Algorithms",
    "Chemistry",
    "Organic Chemistry",
    "Biochemistry",
    "Physics",
    "Engineering",
  ];

  const creditsOptions = [
    { label: "High to Low", value: "high-low" },
    { label: "Low to High", value: "low-high" },
  ];

  const availabilityOptions = ["Available now", "Available today", "Available tomorrow"];

  // Submit booking → REAL BACKEND
  async function submitBooking(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedPartner) return;

    const session_time = new Date(
      `${bookingDetails.date}T${bookingDetails.time}:00`
    )
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");

    const res = await fetch("/api/booking", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        request_id: null,
        student_id: session?.user?.id,
        tutor_id: selectedPartner.id,
        session_time,
      }),
    });

    if (res.ok) {
      alert("Session booked successfully!");
      setBookingModalOpen(false);
      setSelectedPartner(null);
      setBookingDetails({ date: "", time: "", notes: "" });
      router.push("/sessions");
    } else {
      alert("Booking failed.");
    }
  }

  if (status === "loading") {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!session) return null;

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900 relative">
      {/* PROFILE MODAL */}
      {selectedPartner && !bookingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
              onClick={() => setSelectedPartner(null)}
            >
              <X size={22} />
            </button>

            {/* Header */}
            <div className="flex gap-4 items-center mb-4">
              <div className="h-14 w-14 flex items-center justify-center bg-indigo-100 text-indigo-700 rounded-full font-semibold text-lg">
                {selectedPartner.initials}
              </div>
              <div>
                <h2 className="font-bold text-xl">{selectedPartner.name}</h2>
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <Star className="text-yellow-400 fill-yellow-400" size={16} />
                  {selectedPartner.rating} ({selectedPartner.sessions} sessions)
                </p>
              </div>
            </div>

            {/* Expertise */}
            <div className="mb-2">
              <span className="font-medium text-sm">Expertise:</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {selectedPartner.expertise.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Bio */}
            <p className="text-sm text-gray-700 mb-2">{selectedPartner.bio}</p>

            {/* Details */}
            <div className="flex flex-wrap gap-3 mb-2 text-sm">
              <span className="flex items-center gap-1">
                <Zap className="text-indigo-600" size={16} />{" "}
                {selectedPartner.match}% match
              </span>
              <span className="text-gray-500">{selectedPartner.rate} credits/hr</span>
            </div>

            {/* Availability */}
            <p className="text-sm text-green-600 font-medium mb-4">
              {selectedPartner.availability}
            </p>

            {/* Buttons */}
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
                onClick={() => setSelectedPartner(null)}
              >
                Close
              </button>

              <button
                className="px-4 py-2 bg-indigo-700 hover:bg-indigo-600 text-white rounded-lg text-sm"
                onClick={() => setBookingModalOpen(true)}
              >
                Book Session
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BOOKING MODAL */}
      {selectedPartner && bookingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
              onClick={() => setBookingModalOpen(false)}
            >
              <X size={22} />
            </button>

            <h2 className="font-bold text-xl mb-3">
              Book Session with {selectedPartner.name}
            </h2>

            <form onSubmit={submitBooking} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Date</label>
                <input
                  type="date"
                  required
                  className="w-full border rounded-lg px-3 py-2"
                  value={bookingDetails.date}
                  onChange={(e) =>
                    setBookingDetails({ ...bookingDetails, date: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Time</label>
                <input
                  type="time"
                  required
                  className="w-full border rounded-lg px-3 py-2"
                  value={bookingDetails.time}
                  onChange={(e) =>
                    setBookingDetails({ ...bookingDetails, time: e.target.value })
                  }
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="px-4 py-2 border rounded-lg text-sm"
                  onClick={() => setBookingModalOpen(false)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-900 hover:bg-indigo-700 text-white rounded-lg text-sm"
                >
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MAIN PAGE */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 px-4 md:px-8 py-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl md:text-3xl font-bold mb-1">
              Find Learning Partners
            </h1>
            <p className="text-gray-500 mb-6 text-sm md:text-base">
              Discover expert tutors and study partners matched to your learning
              goals.
            </p>

            {/* FILTER BAR */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm mb-6 flex flex-col md:flex-row gap-4">
              <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2 flex-1">
                <Search size={18} className="text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="Search name, skill, or subject..."
                  className="w-full bg-transparent text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-2">
                <select
                  className="border rounded-lg text-sm px-3 py-2"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                >
                  <option value="">Subject</option>
                  {subjectOptions.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>

                <select
                  className="border rounded-lg text-sm px-3 py-2"
                  value={creditsSort}
                  onChange={(e) => setCreditsSort(e.target.value)}
                >
                  <option value="">Credits</option>
                  {creditsOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>

                <select
                  className="border rounded-lg text-sm px-3 py-2"
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value)}
                >
                  <option value="">Availability</option>
                  {availabilityOptions.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>

                <button className="bg-gray-100 p-2 rounded-lg">
                  <Filter size={18} />
                </button>
              </div>
            </div>

            {/* PARTNERS LIST */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredPartners.length === 0 ? (
                <div className="col-span-2 text-center text-gray-500 py-10">
                  No partners found.
                </div>
              ) : (
                filteredPartners.map((p) => (
                  <div
                    key={p.id}
                    className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition"
                  >
                    <div className="flex gap-4 items-start justify-between">
                      <div className="flex gap-4">
                        <div className="h-12 w-12 bg-indigo-100 text-indigo-700 flex items-center justify-center rounded-full font-semibold">
                          {p.initials}
                        </div>

                        <div>
                          <h2 className="font-semibold text-lg">{p.name}</h2>
                          <p className="text-sm text-gray-600 flex items-center gap-1">
                            <Star className="text-yellow-400 fill-yellow-400" size={14} />
                            {p.rating} ({p.sessions} sessions)
                          </p>
                        </div>
                      </div>

                      <div className="text-right text-sm">
                        <p className="flex items-center justify-end gap-1 text-gray-700">
                          <Zap className="text-indigo-600" size={16} /> {p.match}% match
                        </p>
                        <p className="text-xs text-gray-400">{p.rate} credits/hr</p>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mt-2">{p.bio}</p>

                    <div className="mt-3">
                      <p className="text-sm font-medium">Expertise</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {p.expertise.map((tag) => (
                          <span
                            key={tag}
                            className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <p className="text-sm text-green-600 mt-3">{p.availability}</p>

                    <div className="flex justify-end gap-2 mt-4">
                      <button
                        className="px-4 py-2 border rounded-lg text-sm"
                        onClick={() => setSelectedPartner(p)}
                      >
                        View Profile
                      </button>

                      <button
                        className="px-4 py-2 bg-indigo-900 hover:bg-indigo-700 text-white rounded-lg text-sm"
                        onClick={() => {
                          setSelectedPartner(p);
                          setBookingModalOpen(true);
                        }}
                      >
                        Book Session
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
