"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface Tutor {
  id: number;
  name: string;
  role: string;
  bio: string | null;
  price: number | null;
  subject: string | null;
  rating: number | null;
}

export default function Page() {
  const params = useParams();
  const tutorId = params?.id;
  const router = useRouter();
  const { data: session, status } = useSession();

  const [tutor, setTutor] = useState<Tutor | null>(null);
  const [loadingTutor, setLoadingTutor] = useState(true);

  // Redirect unauthenticated users
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Fetch tutor info from backend
  useEffect(() => {
    async function loadTutor() {
      try {
        const res = await fetch(`/api/users/${tutorId}`, {
          cache: "no-store",
        });

        if (!res.ok) {
          console.error("Tutor not found");
          setTutor(null);
          setLoadingTutor(false);
          return;
        }

        const data = await res.json();
        setTutor({
          id: data.id,
          name: data.name,
          role: data.role,
          bio: data.bio ?? "This tutor hasn't added a bio yet.",
          price: data.price ?? 28,
          subject: data.subject ?? "General Subjects",
          rating: data.rating ?? 4.8,
        });
      } catch (err) {
        console.error("Error loading tutor: ", err);
      }

      setLoadingTutor(false);
    }

    loadTutor();
  }, [tutorId]);

  if (status === "loading" || loadingTutor) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!session) return null;

  if (!tutor) {
    return (
      <section className="container py-10">
        <h2 className="text-2xl font-bold mb-4">Tutor not found</h2>
        <p className="text-gray-600">Please return to browse.</p>
      </section>
    );
  }

  return (
    <section className="container py-10">
      <div className="grid md:grid-cols-3 gap-6">

        {/* LEFT: Tutor Info */}
        <div className="card md:col-span-2 p-6">
          <h2 className="text-2xl font-bold">{tutor.name}</h2>
          <p className="text-sm text-gray-500 mt-1">⭐ {tutor.rating} rating</p>

          <p className="mt-4 text-gray-700 leading-relaxed">{tutor.bio}</p>

          <div className="mt-6">
            <h3 className="font-semibold mb-2">Subjects</h3>
            <p className="text-gray-600">{tutor.subject}</p>
          </div>

          <div className="mt-6">
            <h3 className="font-semibold mb-2">Reviews</h3>
            <p className="text-gray-500 text-sm">
              Reviews feature coming soon.
            </p>
          </div>

          <div className="mt-6">
            <h3 className="font-semibold mb-2">Gallery</h3>
            <p className="text-gray-500 text-sm">
              Images / certificates feature coming soon.
            </p>
          </div>
        </div>

        {/* RIGHT: Booking Card */}
        <aside className="card p-6">
          <p className="font-semibold text-lg">From ${tutor.price}/hr</p>
          <p className="text-sm text-gray-600 mt-1">Flexible scheduling</p>

          <Link
            href={`/booking/${tutorId}`}
            className="btn btn-primary mt-4 w-full text-center block"
          >
            Book session
          </Link>
        </aside>

      </div>
    </section>
  );
}
