"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import AuditorDashboard from "@/components/dashboards/AuditorDashboard";
import UserDashboard from "@/components/dashboards/UserDashboard";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const AdminDashboard = dynamic(() => import("@/components/dashboards/AdminDashboard"), {
  ssr: false,
});

export default function DashboardPage() {
  const [role, setRole] = useState<"admin" | "auditor" | "company" | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Add delay to ensure localStorage is available
    const timer = setTimeout(() => {
      const storedRole = localStorage.getItem("role") as any;
      console.log("Checking role from localStorage:", storedRole);
      
      if (!storedRole) {
        console.log("No role found, redirecting to login");
        router.push("/login");
      } else {
        console.log("Setting role:", storedRole);
        setRole(storedRole);
      }
      setIsLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, [router]);

  // Show loading state instead of returning null immediately
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-slate-600">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  // If still no role after loading, redirect
  if (!role) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-100">
        <div className="text-center">
          <p className="text-red-600 mb-4">Sesi berakhir. Silakan login ulang.</p>
          <button 
            onClick={() => router.push("/login")}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  // PERBAIKAN: Gunakan DashboardLayout untuk semua role
  return (
    <DashboardLayout role={role === "company" ? "user" : role}>
      {role === "admin" && <AdminDashboard />}
      {role === "auditor" && <AuditorDashboard />}
      {role === "company" && <UserDashboard />}
    </DashboardLayout>
  );
}