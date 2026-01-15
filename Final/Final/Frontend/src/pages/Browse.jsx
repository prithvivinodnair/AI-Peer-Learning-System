import { useState } from "react";
import SearchBar from "../component/SearchBar.jsx";
import TutorCard from "../component/TutorCard.jsx";
import EmptyState from "../component/EmptyState.jsx";

const seed = [
  { id: "t1", name: "Ava Chen", subjects: ["Python","DSA"], rating: 4.9, price: 28 },
  { id: "t2", name: "Liam Patel", subjects: ["Calculus","Algebra"], rating: 4.8, price: 25 },
];

export default function Browse() {
  const [items, setItems] = useState(seed);
  const onSubmit = (q) => {
    const s = q.toLowerCase();
    const filtered = seed.filter(t =>
      t.name.toLowerCase().includes(s) || t.subjects.some(x => x.toLowerCase().includes(s))
    );
    setItems(filtered);
  };

  return (
    <section className="container py-10">
      <div className="card">
        <SearchBar onSubmit={onSubmit} />
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
        {items.length ? items.map(t => <TutorCard key={t.id} tutor={t} />)
                      : <EmptyState title="No tutors found" hint="Try a different subject." />}
      </div>
    </section>
  );
}
