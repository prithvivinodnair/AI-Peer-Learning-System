"use client";

import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface Course {
  id: number;
  title: string;
  description: string;
  syllabus: string;
  outcomes: string;
  tutor_name: string;
  tutor_id: number;
}

export default function Page() {
  const params = useParams();
  const id = params?.id;
  const router = useRouter();
  const { data: session, status } = useSession();

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  // Protect route
  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  // Load course from API
  useEffect(() => {
    async function loadCourse() {
      try {
        const res = await fetch(`/api/courses/${id}`, {
          cache: "no-store",
        });

        if (!res.ok) {
          console.error("Course not found");
          setCourse(null);
          setLoading(false);
          return;
        }

        const data = await res.json();
        setCourse(data);
      } catch (err) {
        console.error("Error loading course", err);
      }

      setLoading(false);
    }

    if (session) loadCourse();
  }, [id, session]);

  if (status === "loading" || loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!session) return null;

  if (!course) {
    return (
      <section className="container py-10">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Course Not Found</h2>
        <p className="text-gray-600">Try browsing other courses.</p>
      </section>
    );
  }

  return (
    <section className="container py-10">
      <h2 className="text-3xl font-bold mb-3">{course.title}</h2>

      <p className="text-gray-700 mb-6">
        {course.description}
      </p>

      <div className="card p-6 mb-6">
        <h3 className="text-xl font-semibold mb-2">Syllabus</h3>
        <p className="text-gray-700 whitespace-pre-line">{course.syllabus}</p>
      </div>

      <div className="card p-6 mb-6">
        <h3 className="text-xl font-semibold mb-2">Outcomes</h3>
        <p className="text-gray-700 whitespace-pre-line">{course.outcomes}</p>
      </div>

      <div className="card p-6">
        <h3 className="text-xl font-semibold mb-2">Tutor</h3>
        <p className="text-gray-700">
          <strong>{course.tutor_name}</strong>  
        </p>
        <a
          href={`/tutor/${course.tutor_id}`}
          className="text-indigo-600 underline text-sm"
        >
          View Tutor Profile →
        </a>
      </div>
    </section>
  );
}
