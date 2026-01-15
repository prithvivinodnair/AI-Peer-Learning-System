export default function PostRequest() {
  const submit = (e) => {
    e.preventDefault();
    alert("Your request was posted (demo).");
  };
  return (
    <section className="container py-10">
      <h2 className="text-2xl font-bold mb-4">Post a learning request</h2>
      <form onSubmit={submit} className="card grid gap-4">
        <input name="title" placeholder="Title (e.g., 'Need help with Dynamic Programming')" className="rounded-xl border px-4 py-2"/>
        <input name="subject" placeholder="Subject (e.g., Algorithms)" className="rounded-xl border px-4 py-2"/>
        <select name="level" className="rounded-xl border px-4 py-2">
          <option>High School</option><option>Undergrad</option><option>Grad</option>
        </select>
        <input type="number" name="budget" placeholder="Budget ($)" className="rounded-xl border px-4 py-2"/>
        <textarea name="details" rows={5} placeholder="Describe what you need…" className="rounded-xl border px-4 py-2"/>
        <button className="btn btn-primary w-fit">Submit</button>
      </form>
    </section>
  );
}
