import React from "react";

const Navbar = () => {
  return (
    <nav className="w-full shadow-sm px-6 py-3 flex items-center justify-between">
      {/* Left: Logo */}
      <div className="text-xl font-bold cursor-pointer">
        MyLogo
      </div>

      {/* Right: Menu Items */}
      <ul className="flex items-center gap-6 text-sm font-medium">
        <li className="cursor-pointer hover:text-blue-600 transition">Import</li>
        <li className="cursor-pointer hover:text-blue-600 transition">Export</li>
        <li className="cursor-pointer hover:text-blue-600 transition">About</li>

        {/* Buttons */}
        <button className="px-4 py-1 border rounded-md hover:bg-gray-100 transition">
          Sign In
        </button>

        <button className="px-4 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
          Sign Out
        </button>
      </ul>
    </nav>
  );
};

export default Navbar;
