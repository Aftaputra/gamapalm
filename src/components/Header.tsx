"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export default function Header({ role }: { role: string }) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("role");
    router.push("/");
  };

  return (
    <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-6 py-4 shadow-md flex justify-between items-center">
      {/* Title */}
      <h1 className="text-xl font-extrabold tracking-tight">
        🌿 ISPO System <span className="opacity-80">({role})</span>
      </h1>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-md hover:bg-white/20 transition-all duration-200 ease-in-out"
      >
        <LogOut className="w-5 h-5" />
        <span className="font-medium">Logout</span>
      </button>
    </header>
  );
}
