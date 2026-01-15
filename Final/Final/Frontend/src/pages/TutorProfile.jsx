import { useParams, Link } from "react-router-dom";

export default function TutorProfile() {
  const { id } = useParams();
  return (
    <section className="container py-10">
      <div className="grid md:grid-cols-3 gap-6">
        <div className="card md:col-span-2">
          <h2 className="text-2xl font-bold">Tutor {id}</h2>
          <p className="mt-2 text-gray-700">Bio, expertise, reviews, gallery.</p>
        </div>
        <aside className="card">
          <p className="font-semibold">From $28/hr</p>
          <Link to={`/booking/${id}`} className="btn btn-primary mt-3 w-full text-center">Book session</Link>
        </aside>
      </div>
    </section>
  );
}
