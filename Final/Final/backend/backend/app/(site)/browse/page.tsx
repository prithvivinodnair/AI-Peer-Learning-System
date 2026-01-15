"use client";

import { useState, useEffect } from "react";
import SearchBar from "../../components/SearchBar";
import TutorCard from "../../components/TutorCard";
import EmptyState from "../../components/EmptyState";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface Tutor {
  id: number;
  name: string;
  role: string;
  subject: string | null;
  rating: number | null;
  price: number | null;
}

export default function Page() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [allTutors, setAllTutors] = useState<Tutor[]>([]);
  const [items, setItems] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState(true);

  // Protect route
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Load tutors from backend
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/users?role=tutor", {
          cache: "no-store",
        });

        if (!res.ok) {
          console.error("Failed to load tutors");
          setLoading(false);
          return;
        }

        const data = await res.json();

        // Transform DB rows → frontend format
        const mapped = data.map((t: any) => ({
          id: t.id,
          name: t.name,
          role: t.role,
          subject: t.subject ?? "General",
          rating: t.rating ?? 4.8,
          price: t.price ?? 28,
        }));

        setAllTutors(mapped);
        setItems(mapped);
      } catch (err) {
        console.error("Error loading tutors:", err);
      }

      setLoading(false);
    }

    if (session) load();
  }, [session]);

  if (status === "loading" || loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!session) return null;

  // Search handler
  const onSubmit = (q: string) => {
    const s = q.toLowerCase();

    const filtered = allTutors.filter((t) => {
      return (
        t.name.toLowerCase().includes(s) ||
        (t.subject ?? "").toLowerCase().includes(s)
      );
    });

    setItems(filtered);
  };

  return (
    <section className="container py-10">
      <div className="card">
        <SearchBar onSubmit={onSubmit} />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
        {items.length ? (
          items.map((t) => <TutorCard key={t.id} tutor={t} />)
        ) : (
          <EmptyState
            title="No tutors found"
            hint="Try a different subject."
          />
        )}
      </div>
    </section>
  );
}
