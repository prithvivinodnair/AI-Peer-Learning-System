import { useParams } from "react-router-dom";
export default function Course() {
  const { id } = useParams();
  return (
    <section className="container py-10">
      <h2 className="text-2xl font-bold mb-2">Course #{id}</h2>
      <div className="card">Syllabus, outcomes, tutor info, reviews.</div>
    </section>
  );
}
