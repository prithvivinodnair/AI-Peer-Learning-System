import { useParams } from "react-router-dom";

export default function Booking() {
  const { id } = useParams();
  const book = (e) => {
    e.preventDefault();
    alert("Session booked (demo).");
  };
  return (
    <section className="container py-10">
      <h2 className="text-2xl font-bold mb-4">Book with Tutor {id}</h2>
      <form onSubmit={book} className="card grid gap-4">
        <input type="datetime-local" className="rounded-xl border px-4 py-2"/>
        <select className="rounded-xl border px-4 py-2">
          <option>30 min</option><option>60 min</option><option>90 min</option>
        </select>
        <button className="btn btn-primary w-fit">Confirm</button>
      </form>
    </section>
  );
}
