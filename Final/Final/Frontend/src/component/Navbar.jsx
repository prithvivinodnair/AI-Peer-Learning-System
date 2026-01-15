import React, { useState } from "react";
import AuthModal from "../component/AuthModal";

export default function Navbar() {
  const [showModal, setShowModal] = useState(false);

  return (
    <header className="flex justify-between items-center px-10 py-6 shadow-sm">
      {/* Logo */}
      <div className="flex items-center space-x-2">
        <div className="flex items-center justify-center w-8 h-8 bg-black text-white rounded-lg font-bold">
          S
        </div>
        <h1 className="text-xl font-semibold">SkillShare</h1>
      </div>

      {/* Buttons */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => setShowModal(true)}
          className="text-gray-800 font-medium hover:text-black"
        >
          Sign In
        </button>
        <button
          onClick={() => setShowModal(true)}
          className="bg-black text-white px-4 py-2 rounded-md font-medium hover:bg-gray-900 transition"
        >
          Get Started
        </button>
      </div>

      {/* Auth Modal */}
      <AuthModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </header>
  );
}
