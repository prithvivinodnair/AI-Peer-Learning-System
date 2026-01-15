export default function EmptyState({ title="Nothing here yet", hint="Try adjusting filters or create something new." }) {
  return (
    <div className="text-center py-16 border rounded-2xl bg-white">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-gray-600 mt-1">{hint}</p>
    </div>
  );
}
