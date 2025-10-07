"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Shield } from "lucide-react";
import { registerUser } from "@/lib/api";

type Role = "company" | "auditor" | "admin";

export default function SignupPage() {
  const router = useRouter();
  const [role, setRole] = useState<Role>("company");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [email, setEmail] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!name || !email || !password) {
      setErrorMsg("Nama, email, dan password wajib diisi.");
      return;
    }
    if (role === "company" && !company) {
      setErrorMsg("Nama perusahaan wajib diisi untuk role perusahaan.");
      return;
    }
    if (role === "auditor" && !location) {
      setErrorMsg("Lokasi wajib diisi untuk role auditor.");
      return;
    }

    try {
      setLoading(true);
      const res = await registerUser({
        name,
        email,
        password,
        role,
        company: role === "company" ? company : undefined,
        location: role === "auditor" ? location : undefined,
        avatarUrl: avatarUrl || undefined,
      });

      if (!res.success) {
        setErrorMsg(res.error || "Pendaftaran gagal. Coba lagi.");
        return;
      }

      setSuccessMsg("Pendaftaran berhasil! Mengarahkan ke halaman login...");
      setTimeout(() => {
        if (role === "company") router.push("/login/perusahaan");
        else router.push("/login/staf");
      }, 1200);
    } catch (err: any) {
      setErrorMsg(err?.message || "Terjadi kesalahan saat pendaftaran.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "mt-1 w-full rounded-lg border px-4 py-2.5 text-sm bg-white text-slate-900 placeholder-slate-500 border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-blue-700";

  const labelClass = "block text-sm font-medium text-slate-900";

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navbar sederhana */}
      <header className="bg-white shadow-sm">
        <div className="max-w-screen-md mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-700 flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-base sm:text-lg font-semibold text-slate-900">Smart ISPO</span>
          </Link>
          <Link href="/login/perusahaan" className="text-sm font-medium text-blue-700 hover:underline">
            Sudah punya akun?
          </Link>
        </div>
      </header>

      <main className="max-w-screen-md mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white rounded-xl shadow border border-slate-300 p-6 sm:p-8">
          <h1 className="text-2xl font-bold text-slate-900">Buat Akun</h1>
          <p className="text-slate-700 mt-1">Pilih role dan isi data sesuai kebutuhan.</p>

          <form onSubmit={onSubmit} className="mt-6 space-y-5">
            {/* Role */}
            <div>
              <label className={labelClass}>Role</label>
              <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-3">
                {(["company", "auditor", "admin"] as Role[]).map((r) => {
                  const selected = role === r;
                  return (
                    <button
                      type="button"
                      key={r}
                      onClick={() => setRole(r)}
                      className={`rounded-lg border px-4 py-3 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-700
                        ${
                          selected
                            ? "border-blue-800 bg-blue-700 text-white"
                            : "border-slate-400 bg-white text-slate-900 hover:bg-slate-50"
                        }
                      `}
                      aria-pressed={selected}
                    >
                      {r === "company" ? "Perusahaan" : r === "auditor" ? "Auditor" : "Admin"}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Nama */}
            <div>
              <label className={labelClass}>
                Nama <span className="text-red-700">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClass}
                placeholder="Nama lengkap"
                autoComplete="name"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className={labelClass}>
                Email <span className="text-red-700">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
                placeholder="email@contoh.com"
                autoComplete="email"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className={labelClass}>
                Password <span className="text-red-700">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={inputClass}
                  placeholder="Minimal 6 karakter"
                  autoComplete="new-password"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute top-1/2 -translate-y-1/2 right-2 text-xs font-semibold text-slate-800 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 rounded px-1"
                  aria-label={showPass ? "Sembunyikan password" : "Lihat password"}
                >
                  {showPass ? "Sembunyikan" : "Lihat"}
                </button>
              </div>
            </div>

            {/* Avatar URL (opsional) */}
            <div>
              <label className={labelClass}>Avatar URL (opsional)</label>
              <input
                type="url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                className={inputClass}
                placeholder="https://..."
                autoComplete="url"
              />
            </div>

            {/* Khusus perusahaan */}
            {role === "company" && (
              <div>
                <label className={labelClass}>
                  Nama Perusahaan <span className="text-red-700">*</span>
                </label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className={inputClass}
                  placeholder="Contoh: PT Maju Jaya"
                  autoComplete="organization"
                  required
                />
              </div>
            )}

            {/* Khusus auditor */}
            {role === "auditor" && (
              <div>
                <label className={labelClass}>
                  Lokasi (Kota/Provinsi) <span className="text-red-700">*</span>
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className={inputClass}
                  placeholder="Contoh: Pekanbaru, Riau"
                  autoComplete="address-level2"
                  required
                />
              </div>
            )}

            {/* Alert */}
            {errorMsg && (
              <div
                className="rounded-lg border border-red-600 bg-red-600/10 text-red-800 text-sm px-4 py-3"
                role="alert"
              >
                {errorMsg}
              </div>
            )}
            {successMsg && (
              <div
                className="rounded-lg border border-green-700 bg-green-700/10 text-green-800 text-sm px-4 py-3"
                role="status"
              >
                {successMsg}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-blue-700 text-white font-semibold px-5 py-3 hover:bg-blue-800 transition disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-700"
            >
              {loading ? "Memproses..." : "Buat Akun"}
            </button>

            {/* Link balik */}
            <div className="text-center text-sm text-slate-800">
              Sudah punya akun?{" "}
              <Link href="/login/perusahaan" className="text-blue-700 hover:underline font-medium">
                Masuk di sini
              </Link>
            </div>
          </form>
        </div>

        <p className="mt-6 text-xs text-slate-700">
          Catatan: Ini versi demo. Untuk produksi, gunakan Supabase Auth dan simpan password secara aman (hash).
        </p>
      </main>
    </div>
  );
}