export default function RequestCard({ req }) {
  const { title, budget, subject, level, createdAt } = req;
  return (
    <div className="card">
      <h3 className="font-semibold">{title}</h3>
      <p className="text-sm text-gray-600 mt-1">{subject} · {level}</p>
      <div className="mt-3 flex items-center justify-between">
        <span className="text-sm">{new Date(createdAt).toLocaleDateString()}</span>
        <span className="font-medium">${budget} budget</span>
      </div>
      <button className="btn btn-primary mt-4">Offer Help</button>
    </div>
  );
}
