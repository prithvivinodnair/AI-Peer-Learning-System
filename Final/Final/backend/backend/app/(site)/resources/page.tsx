"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Bookmark, Clock, Star } from "lucide-react";
import { useSession } from "next-auth/react";

interface Article {
  id: number;
  title: string;
  author: string;
  duration: string;
  rating: number;
  tag: string;
  img: string;
  excerpt: string;
  link: string;
}

export default function Page() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  // Protect route
  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  // Load resources from backend
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/resources", { cache: "no-store" });

        if (!res.ok) {
          console.error("Failed to load articles");
          setLoading(false);
          return;
        }

        const data = await res.json();

        // Transform backend → UI format
        const mapped = data.map((a: any) => ({
  id: a.id,
  title: a.title,
  author: "Admin",
  duration: "5 min read",
  rating: 4.8,
  tag: "General",
  img: a.image_url,
  excerpt: "Click to read full article",
  link: a.url,  // your DB uses `url`
}));


        setArticles(mapped);
      } catch (err) {
        console.error("Error loading resources:", err);
      }

      setLoading(false);
    }

    if (session) load();
  }, [session]);

  if (status === "loading" || loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!session) return null;

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900 relative">
      <div className="flex-1 flex flex-col">
        <div className="flex-1 px-4 md:px-8 py-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">Study Resources</h1>
            <p className="text-gray-500 mb-8">
              Explore the latest insights, techniques, and evidence-based guides
              to study smarter.
            </p>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {articles.length === 0 && (
                <p className="text-gray-500">No articles found.</p>
              )}

              {articles.map((a) => (
                <article
                  key={a.id}
                  className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition flex flex-col overflow-hidden"
                >
                  <img
                    src={a.img}
                    alt={a.title}
                    className="h-40 w-full object-cover"
                  />

                  <div className="p-4 flex flex-col flex-1">
                    <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                      <span className="flex items-center gap-1">
                        <Bookmark size={14} /> {a.tag}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={14} /> {a.duration}
                      </span>
                    </div>

                    <h3 className="font-semibold text-base text-gray-900 mb-1 line-clamp-2">
                      {a.title}
                    </h3>

                    <p className="text-sm text-gray-600 line-clamp-3 flex-1">
                      {a.excerpt}
                    </p>

                    <div className="mt-3 flex items-center justify-between text-sm">
                      <span className="text-gray-500">{a.author}</span>
                      <span className="flex items-center gap-1 text-yellow-500">
                        <Star size={14} fill="currentColor" /> {a.rating}
                      </span>
                    </div>

                    <button
                      onClick={() =>
                        typeof window !== "undefined" &&
                        window.open(a.link, "_blank", "noopener,noreferrer")
                      }
                      className="mt-4 bg-indigo-900 hover:bg-indigo-700 text-white text-sm px-4 py-2 rounded-lg w-full transition"
                    >
                      Read More
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
