"use client"
import { signOut, useSession } from "next-auth/react";
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
        <Link href="/import" className="cursor-pointer hover:text-blue-600 transition">Import</Link>
        <Link href="/export" className="cursor-pointer hover:text-blue-600 transition">Export</Link>
        <li className="cursor-pointer hover:text-blue-600 transition">About</li>

        {/* Buttons */}
        {session ? (<div><Link href={`/user/${session.user?.id}`} className={`px-4 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition`}>Logged in as {session.user?.fullName}</Link>   <button onClick={() => signOut()} className="px-4 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
          Sign Out
        </button></div>) : (<div>
      <Link href="/register" className="px-4 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
        Sign In
      </Link>
      <Link href="/login" className="px-4 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
        Log In
      </Link>
      </div>)}

       
      </ul>
    </nav>
  );
};

export default Navbar;
