import { useState } from "react";

import { Mail, Phone, Building2, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

interface UserData {
  id: string;
  name: string;
  title: string;
  email: string;
  phone: string;
  company: string;
  avatar?: string;
}

export default function Profile() {

  const [isSigningOut, setIsSigningOut] = useState(false);

  const mockUserData: UserData = {
    id: "1",
    name: "John Anderson",
    title: "Senior Market Analyst",
    email: "john.anderson@example.com",
    phone: "+1 (555) 123-4567",
    company: "Global Trade Intelligence Inc.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
  };

  const handleSignOut = async () => {
    setIsSigningOut(true);
    
    try {
      sessionStorage.clear();
      localStorage.removeItem("userSession");
      
      await new Promise((resolve) => setTimeout(resolve, 300));
      
      window.location.href = "/";
    } catch (error) {
      console.error("Sign out error:", error);
      setIsSigningOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-950 dark:to-slate-900 flex flex-col">
      {/* Navbar */}
      {/* <Navbar /> */}

      {/* Main Content */}
      <div className="flex-1 flex flex-col py-12 px-4">
        <div className="max-w-2xl mx-auto w-full">
          {/* Profile Card */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-200 dark:border-slate-700 p-8 md:p-12 mb-12">
            {/* Avatar Section */}
            <div className="flex flex-col items-center mb-8">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-blue-500 shadow-lg mb-6">
                <img
                  src={mockUserData.avatar}
                  alt={mockUserData.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* User Name and Title */}
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white text-center">
                {mockUserData.name}
              </h1>
              <p className="text-lg md:text-xl text-blue-600 dark:text-blue-400 font-semibold mt-2 text-center">
                {mockUserData.title}
              </p>
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-slate-600 to-transparent my-8" />

            {/* Contact Details */}
            <div className="space-y-6 mb-8">
              <div className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 dark:bg-slate-700 hover:bg-gray-100 dark:hover:bg-slate-600 transition">
                <Mail className="text-blue-500 flex-shrink-0" size={24} />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                    Email
                  </p>
                  <p className="text-lg text-gray-900 dark:text-white font-semibold">
                    {mockUserData.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 dark:bg-slate-700 hover:bg-gray-100 dark:hover:bg-slate-600 transition">
                <Phone className="text-green-500 flex-shrink-0" size={24} />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                    Phone
                  </p>
                  <p className="text-lg text-gray-900 dark:text-white font-semibold">
                    {mockUserData.phone}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 dark:bg-slate-700 hover:bg-gray-100 dark:hover:bg-slate-600 transition">
                <Building2 className="text-purple-500 flex-shrink-0" size={24} />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                    Company
                  </p>
                  <p className="text-lg text-gray-900 dark:text-white font-semibold">
                    {mockUserData.company}
                  </p>
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
                "flex items-center gap-3 px-8 py-4 md:px-12 md:py-5 rounded-xl font-semibold text-white text-lg transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl",
                isSigningOut
                  ? "bg-gray-500 cursor-not-allowed scale-95"
                  : "bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800"
              )}
            >
              <LogOut size={24} />
              {isSigningOut ? "Signing Out..." : "Sign Out"}
            </button>
          </div>
        </div>
      </div>

  
    </div>
  );
}
