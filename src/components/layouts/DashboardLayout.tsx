import Header from "@/components/Header";
import { ReactNode } from "react";

export default function DashboardLayout({
  role,
  children,
}: {
  role: "admin" | "auditor" | "user";
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header role={role} />
      <main className="flex-1 p-6 bg-gray-50">{children}</main>
    </div>
  );
}
