import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X, User, Bookmark, Clock, Star } from "lucide-react";

export default function Resources() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const articles = [
    {
      id: 1,
      title: "How to Build Deep Focus While Studying",
      author: "Dr. Lisa Wang",
      duration: "5 min read",
      rating: 4.8,
      tag: "Productivity",
      img: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b",
      excerpt:
        "Discover neuroscience-backed methods to train your brain for longer focus sessions and improved memory retention.",
      link: "https://www.nytimes.com/guides/smarterliving/how-to-focus-at-work",
    },
    {
      id: 2,
      title: "Pomodoro 2.0: Smarter Time Management for Students",
      author: "Marcus Chen",
      duration: "4 min read",
      rating: 4.7,
      tag: "Time Management",
      img: "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
      excerpt:
        "Learn the upgraded Pomodoro method using micro-sprints, rest phases, and data-driven self-tracking to maximize output.",
      link: "https://todoist.com/productivity-methods/pomodoro-technique",
    },
    {
      id: 3,
      title: "Note-Taking Strategies Used by Top 1% Students",
      author: "Prof. Sarah Williams",
      duration: "6 min read",
      rating: 4.9,
      tag: "Study Skills",
      img: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4",
      excerpt:
        "Explore the Cornell, Mapping, and Flow-Based systems to turn lectures into easy-to-recall visual summaries.",
      link: "https://collegeinfogeek.com/how-to-take-notes-in-class/",
    },
    {
      id: 4,
      title: "The Science of Sleep for Better Learning",
      author: "Ahmed Hassan",
      duration: "7 min read",
      rating: 4.8,
      tag: "Health",
      img: "https://images.unsplash.com/photo-1504595403659-9088ce801e29",
      excerpt:
        "Understand how sleep cycles affect memory consolidation and how to optimize your study-sleep balance.",
      link: "https://www.sleepfoundation.org/college-sleep-guide",
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900 relative">
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile header */}
        <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200 md:hidden">
          <button className="text-gray-600" onClick={() => setSidebarOpen(true)}>
            <Menu size={22} />
          </button>
          <h2 className="font-semibold text-lg">Study Resources</h2>
        </div>

        {/* Articles grid */}
        <div className="flex-1 px-4 md:px-8 py-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">Study Resources</h1>
            <p className="text-gray-500 mb-8">
              Explore the latest insights, techniques, and evidence-based guides
              to study smarter.
            </p>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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

                    {/* ✅ Works perfectly now */}
                    <button
                      onClick={() =>
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

/* -------------------------
   Reusable Sidebar Item
------------------------- */
function NavItem({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between text-sm font-medium transition ${
        active
          ? "bg-indigo-50 text-indigo-700"
          : "text-gray-600 hover:bg-gray-50 hover:text-indigo-600"
      }`}
    >
      <span>{label}</span>
    </button>
  );
}
