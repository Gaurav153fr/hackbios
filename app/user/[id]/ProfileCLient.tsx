"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Phone, Building2, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

interface UserData {
  id: string;
  fullName: string;
  workEmail: string;
  mobilePhone: string;
  legalCompanyName: string;
  country: string;
}

export default function ProfileClient({ user }: { user: UserData }) {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);

    try {
      sessionStorage.clear();
      localStorage.clear();

      await new Promise((res) => setTimeout(res, 300));
      router.push("/");
    } catch (error) {
      console.error("Sign out error:", error);
      setIsSigningOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-950 dark:to-slate-900 flex flex-col">
      <div className="flex-1 flex flex-col py-12 px-4">
        <div className="max-w-2xl mx-auto w-full">

          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-200 dark:border-slate-700 p-8 md:p-12 mb-12">

            {/* Avatar */}
            <div className="flex flex-col items-center mb-8">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-blue-500 shadow-lg mb-6">
                <img
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.fullName}`}
                  alt={user.fullName}
                  className="w-full h-full object-cover"
                />
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                {user.fullName}
              </h1>

              <p className="text-lg text-blue-600 dark:text-blue-400 font-semibold mt-2">
                {user.country}
              </p>
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-slate-600 to-transparent my-8" />

            {/* Contact Info */}
            <div className="space-y-6 mb-8">
              {/* Email */}
              <div className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 dark:bg-slate-700 hover:bg-gray-100 dark:hover:bg-slate-600 transition">
                <Mail className="text-blue-500" size={24} />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-lg font-semibold">{user.workEmail}</p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 dark:bg-slate-700 hover:bg-gray-100 dark:hover:bg-slate-600 transition">
                <Phone className="text-green-500" size={24} />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="text-lg font-semibold">{user.mobilePhone}</p>
                </div>
              </div>

              {/* Company */}
              <div className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 dark:bg-slate-700 hover:bg-gray-100 dark:hover:bg-slate-600 transition">
                <Building2 className="text-purple-500" size={24} />
                <div>
                  <p className="text-sm text-gray-500">Company</p>
                  <p className="text-lg font-semibold">{user.legalCompanyName}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sign Out Button */}
          <div className="flex justify-center">
            <button
              onClick={handleSignOut}
              disabled={isSigningOut}
              className={cn(
                "flex items-center gap-3 px-10 py-4 rounded-xl font-semibold text-white text-lg transition-all shadow-md",
                isSigningOut
                  ? "bg-gray-500 cursor-not-allowed scale-95"
                  : "bg-red-600 hover:bg-red-700"
              )}
            >
              <LogOut size={22} />
              {isSigningOut ? "Signing Out..." : "Sign Out"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
