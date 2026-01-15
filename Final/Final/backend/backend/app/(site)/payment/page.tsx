"use client";

import React, { useState, useEffect } from "react";
import { CreditCard, Trash2, PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface Subscription {
  id: number;
  name: string;
  plan: string;
  amount: string;
  nextBilling: string;
}

interface Card {
  id: number;
  holder: string;
  number: string;
  expiry: string;
}

export default function Page() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);

  const [newCard, setNewCard] = useState({
    holder: "",
    number: "",
    expiry: "",
    cvv: "",
  });

  // ------------------------------
  // 🔐 Require Login
  // ------------------------------
  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  // ------------------------------
  // 📡 Fetch Payments Data
  // ------------------------------
  useEffect(() => {
    if (!session) return;

    const loadData = async () => {
      try {
        const [subsRes, cardsRes] = await Promise.all([
          fetch("/api/payments/subscriptions"),
          fetch("/api/payments/cards"),
        ]);

        const subs = await subsRes.json();
        const cards = await cardsRes.json();

        setSubscriptions(subs);
        setCards(cards);
      } catch (err) {
        console.error("Failed to fetch payment data", err);
      }
      setLoading(false);
    };

    loadData();
  }, [session]);

  if (status === "loading" || loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!session) return null;

  // ------------------------------
  // ❌ Cancel Subscription
  // ------------------------------
  const handleRemoveSubscription = async (id: number) => {
    const res = await fetch(`/api/payments/subscriptions/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      alert("Error cancelling subscription");
      return;
    }

    setSubscriptions(subscriptions.filter((s) => s.id !== id));
  };

  // ------------------------------
  // ➕ Add New Card
  // ------------------------------
  const handleAddCard = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/payments/cards", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newCard),
    });

    if (!res.ok) {
      alert("Failed to add card");
      return;
    }

    const savedCard = await res.json();
    setCards([...cards, savedCard]);

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

        {/* Subscriptions */}
        <section className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
          <h3 className="text-xl font-semibold mb-4">Active Subscriptions</h3>

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
                    <p className="text-xs text-gray-400">Next Billing: {s.nextBilling}</p>
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

        {/* Cards */}
        <section className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
          <h3 className="text-xl font-semibold mb-4">Saved Cards</h3>

          <div className="grid md:grid-cols-2 gap-4">
            {cards.map((card) => (
              <div
                key={card.id}
                className="border border-gray-100 rounded-lg p-5 flex items-center gap-3 bg-gray-50"
              >
                <CreditCard className="text-indigo-600" size={24} />
                <div>
                  <p className="font-medium">{card.holder}</p>
                  <p className="text-sm text-gray-600">{card.number}</p>
                  <p className="text-xs text-gray-400">Exp: {card.expiry}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Add Card */}
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
              className="border rounded-lg px-4 py-2"
              value={newCard.holder}
              onChange={(e) => setNewCard({ ...newCard, holder: e.target.value })}
            />

            <input
              type="text"
              placeholder="Card Number"
              maxLength={16}
              className="border rounded-lg px-4 py-2"
              value={newCard.number}
              onChange={(e) => setNewCard({ ...newCard, number: e.target.value })}
            />

            <input
              type="text"
              placeholder="Expiry (MM/YY)"
              className="border rounded-lg px-4 py-2"
              value={newCard.expiry}
              onChange={(e) => setNewCard({ ...newCard, expiry: e.target.value })}
            />

            <input
              type="password"
              placeholder="CVV"
              maxLength={4}
              className="border rounded-lg px-4 py-2"
              value={newCard.cvv}
              onChange={(e) => setNewCard({ ...newCard, cvv: e.target.value })}
            />

            <button
              type="submit"
              className="sm:col-span-2 bg-indigo-900 text-white py-2 rounded-lg font-medium hover:bg-indigo-700"
            >
              Add Card
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
