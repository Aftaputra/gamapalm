"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import AdminDashboard from "@/components/dashboards/AdminDashboard";
import AuditorDashboard from "@/components/dashboards/AuditorDashboard";
import UserDashboard from "@/components/dashboards/UserDashboard";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const [role, setRole] = useState<"admin" | "auditor" | "user" | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedRole = localStorage.getItem("role") as any;
    if (!storedRole) {
      router.push("/login");
    } else {
      setRole(storedRole);
    }
  }, [router]);

  if (!role) return null;

  return (
    <DashboardLayout role={role}>
      {role === "admin" && <AdminDashboard />}
      {role === "auditor" && <AuditorDashboard />}
      {role === "user" && <UserDashboard />}
    </DashboardLayout>
  );
}
