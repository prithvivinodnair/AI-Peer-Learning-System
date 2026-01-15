export default function SearchBar({ onSubmit }) {
  const submit = (e) => {
    e.preventDefault();
    const q = new FormData(e.currentTarget).get("q")?.toString() ?? "";
    onSubmit?.(q);
  };
  return (
    <form onSubmit={submit} className="flex gap-2">
      <input
        name="q"
        placeholder="Search tutors, subjects, courses…"
        className="w-full rounded-xl border px-4 py-2"
      />
      <button className="btn btn-primary" type="submit">Search</button>
    </form>
  );
}
