"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  return (
    <header className="flex justify-between items-center px-10 py-6 shadow-sm bg-white">
      {/* Logo */}
      <div className="flex items-center space-x-2 cursor-pointer" onClick={() => router.push("/")}>
        <div className="flex items-center justify-center w-8 h-8 bg-black text-white rounded-lg font-bold">
          S
        </div>
        <h1 className="text-xl font-semibold">SkillShare</h1>
      </div>

      {/* Buttons */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => router.push("/login")}
          className="text-gray-800 font-medium hover:text-black"
        >
          Sign In
        </button>
        <button
          onClick={() => router.push("/login")}
          className="bg-black text-white px-4 py-2 rounded-md font-medium hover:bg-gray-900 transition"
        >
          Get Started
        </button>
      </div>
    </header>
  );
}
