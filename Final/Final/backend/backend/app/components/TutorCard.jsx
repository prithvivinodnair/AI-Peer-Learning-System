import Link from "next/link";
import { Star } from "lucide-react";

export default function TutorCard({ tutor }) {
  const { id, name, subjects, rating, price } = tutor;
  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">{name}</h3>
        <div className="flex items-center gap-1 text-amber-500">
          <Star size={16} fill="currentColor" /> <span>{rating.toFixed(1)}</span>
        </div>
      </div>
      <p className="text-sm text-gray-600 mt-1">{subjects.join(" · ")}</p>
      <p className="mt-3 font-medium">${price}/hr</p>
      <div className="mt-4 flex gap-2">
        <Link href={`/tutor/${id}`} className="btn btn-primary">View Profile</Link>
        <Link href={`/booking/${id}`} className="btn">Book</Link>
      </div>
    </div>
  );
}
