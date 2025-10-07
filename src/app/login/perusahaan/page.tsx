"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User } from "lucide-react";
import { login } from "@/lib/api";

export default function PerusahaanLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const emailInput = email.trim().toLowerCase();
      const user = await login(emailInput, password);

      if (!user) {
        setError("Email atau password salah!");
        setIsLoading(false);
        return;
      }

      if (user.role !== "company") {
        setError("Akun Anda bukan perusahaan. Silakan gunakan portal yang sesuai.");
        setIsLoading(false);
        return;
      }

      // Simpan info minimal ke localStorage untuk sesi
      localStorage.setItem("role", user.role);
      localStorage.setItem("userId", user.id);
      localStorage.setItem("email", user.email || "");
      localStorage.setItem("name", user.name || "");
      localStorage.setItem("company", (user as any).company || "");

      router.push("/dashboard"); // ganti jika dashboard perusahaan punya path lain
    } catch (err) {
      setError("Terjadi kesalahan saat login. Coba lagi.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-200 p-4">
      <div className="bg-white shadow-2xl rounded-xl p-8 w-full max-w-sm space-y-6">
        <div className="text-center">
          <User className="mx-auto h-10 w-10 text-blue-600" />
          <h1 className="mt-2 text-3xl font-bold text-slate-900">Portal Perusahaan</h1>
          <p className="mt-2 text-slate-700">Login untuk mengelola proses sertifikasi Anda.</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-slate-900">Email Perusahaan</label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full border-2 border-gray-300 rounded-lg p-3 text-slate-900 placeholder-slate-500 focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
              placeholder="email@perusahaan.com"
              autoComplete="email"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-900">Password</label>
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full border-2 border-gray-300 rounded-lg p-3 text-slate-900 placeholder-slate-500 focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
              placeholder="********"
              autoComplete="current-password"
            />
          </div>
          {error && <p className="text-red-600 text-sm text-center font-bold">{error}</p>}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold text-base hover:bg-blue-700 disabled:bg-gray-400"
          >
            {isLoading ? "Mencoba Masuk..." : "LOGIN"}
          </button>
        </form>
        <p className="text-center text-sm text-slate-700">
          Belum punya akun?{" "}
          <Link href="/signup" className="font-semibold text-blue-600 hover:underline">
            Daftar di sini
          </Link>
        </p>
      </div>
    </div>
  );
}