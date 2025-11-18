"use client"
import { useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";


/**
 * Navbar component for the application.
 *
 * Contains a logo on the left and a set of menu items on the right.
 * The menu items include Import, Export, and About.
 * Additionally, there are two buttons for signing in and out.
 *
 * @returns {JSX.Element} The Navbar component.
 */
const Navbar = () => {
  const { data: session, status } = useSession();

  if (status === "loading") return <p>Loading...</p>;
 
  return (
    <nav className="w-full shadow-sm px-6 py-3 flex items-center justify-between">
      {/* Left: Logo */}
      <Link href="/" className="text-xl font-bold cursor-pointer">
       TradeFlow Ai
      </Link>

      {/* Right: Menu Items */}
      <ul className="flex items-center gap-6 text-sm font-medium">
        <li className="cursor-pointer hover:text-blue-600 transition">Import</li>
        <li className="cursor-pointer hover:text-blue-600 transition">Export</li>
        <li className="cursor-pointer hover:text-blue-600 transition">About</li>

        {/* Buttons */}
        {session ? (<Link href={`/user/${session.user?.id}`} className={`px-4 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition`}>Logged in as {session.user?.fullName}</Link>) : (<div>
      <Link href="/register" className="px-4 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
        Sign In
      </Link>
      </div>)}
        <button className="px-4 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
          Sign Out
        </button>
      </ul>
    </nav>
  );
};

export default Navbar;
