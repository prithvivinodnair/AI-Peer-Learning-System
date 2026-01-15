"use client";

export default function Footer() {
  return (
    <footer className="bg-[#030212] text-gray-500 text-sm py-6">
      <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        {/* Left side — Logo and name */}
        <div className="flex items-center space-x-2">
          <div className="bg-[#030212] text-white p-2 rounded-lg">
            {/* Inline Lightbulb SVG */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.6}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 2a7 7 0 00-7 7c0 3.03 1.97 5.63 4.65 6.58v1.17a1.17 1.17 0 001.17 1.17h2.36a1.17 1.17 0 001.17-1.17v-1.17A7 7 0 0019 9a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <span className="text-lg font-semibold text-white">
            SkillShare
          </span>
        </div>

        {/* Center — Copyright */}
        <div className="text-center text-gray-400">
          © 2025 SkillShare. All rights reserved.
        </div>

        {/* Right side — Links */}
        <div className="flex space-x-6 text-gray-400">
          <a href="#" className="hover:text-white transition">
            Privacy
          </a>
          <a href="#" className="hover:text-white transition">
            Terms
          </a>
          <a href="#" className="hover:text-white transition">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}
