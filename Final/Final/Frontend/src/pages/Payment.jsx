import React, { useState } from "react";
import { CreditCard, Trash2, PlusCircle } from "lucide-react";

export default function Payments() {
  const [subscriptions, setSubscriptions] = useState([
    {
      id: 1,
      name: "SkillShare Premium",
      plan: "Monthly",
      amount: "$12.99",
      nextBilling: "Nov 25, 2025",
    },
    {
      id: 2,
      name: "AI Assistant Pro",
      plan: "Annual",
      amount: "$49.99",
      nextBilling: "Oct 26, 2026",
    },
  ]);

  const [cards, setCards] = useState([
    { id: 1, holder: "Alex Chen", number: "**** **** **** 4321", expiry: "07/27" },
  ]);

  const [newCard, setNewCard] = useState({
    holder: "",
    number: "",
    expiry: "",
    cvv: "",
  });

  const handleRemoveSubscription = (id) => {
    setSubscriptions(subscriptions.filter((s) => s.id !== id));
  };

  const handleAddCard = (e) => {
    e.preventDefault();
    if (!newCard.holder || !newCard.number || !newCard.expiry || !newCard.cvv) {
      alert("Please fill in all card details.");
      return;
    }

    const formatted = {
      id: Date.now(),
      holder: newCard.holder,
      number: `**** **** **** ${newCard.number.slice(-4)}`,
      expiry: newCard.expiry,
    };
    setCards([...cards, formatted]);
    setNewCard({ holder: "", number: "", expiry: "", cvv: "" });
    alert("New card added successfully!");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 md:px-10">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Page Header */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Payments & Subscriptions</h2>
          <p className="text-gray-600">
            Manage your active plans and saved payment methods securely.
          </p>
        </div>

        {/* Subscriptions Section */}
        <section className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Active Subscriptions</h3>

          {subscriptions.length ? (
            <div className="space-y-4">
              {subscriptions.map((s) => (
                <div
                  key={s.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between border border-gray-100 rounded-lg p-4 hover:shadow transition"
                >
                  <div>
                    <h4 className="font-medium text-gray-900">{s.name}</h4>
                    <p className="text-sm text-gray-600">
                      {s.plan} Plan • {s.amount}
                    </p>
                    <p className="text-xs text-gray-400">
                      Next Billing: {s.nextBilling}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemoveSubscription(s.id)}
                    className="mt-3 sm:mt-0 flex items-center gap-1 text-red-600 hover:text-red-700 text-sm font-medium"
                  >
                    <Trash2 size={16} /> Cancel
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No active subscriptions.</p>
          )}
        </section>

        {/* Payment Methods Section */}
        <section className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Saved Cards</h3>

          <div className="grid md:grid-cols-2 gap-4">
            {cards.map((card) => (
              <div
                key={card.id}
                className="border border-gray-100 rounded-lg p-5 flex items-center gap-3 bg-gray-50"
              >
                <CreditCard className="text-indigo-600 flex-shrink-0" size={24} />
                <div>
                  <p className="font-medium text-gray-900">{card.holder}</p>
                  <p className="text-sm text-gray-600">{card.number}</p>
                  <p className="text-xs text-gray-400">Exp: {card.expiry}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Add New Card Section */}
        <section className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <PlusCircle className="text-indigo-600" size={20} />
            <h3 className="text-xl font-semibold text-gray-800">Add New Card</h3>
          </div>

          <form
            onSubmit={handleAddCard}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl"
          >
            <input
              type="text"
              placeholder="Card Holder Name"
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
              value={newCard.holder}
              onChange={(e) => setNewCard({ ...newCard, holder: e.target.value })}
            />
            <input
              type="text"
              placeholder="Card Number"
              maxLength={16}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
              value={newCard.number}
              onChange={(e) => setNewCard({ ...newCard, number: e.target.value })}
            />
            <input
              type="text"
              placeholder="Expiry (MM/YY)"
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
              value={newCard.expiry}
              onChange={(e) => setNewCard({ ...newCard, expiry: e.target.value })}
            />
            <input
              type="password"
              placeholder="CVV"
              maxLength={4}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
              value={newCard.cvv}
              onChange={(e) => setNewCard({ ...newCard, cvv: e.target.value })}
            />

            <button
              type="submit"
              className="sm:col-span-2 bg-indigo-900 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg transition"
            >
              Add Card
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
