"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Shield, Upload, FileText, CheckCircle, Building2, Eye, EyeOff } from "lucide-react";
import { registerUser } from "@/lib/api";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Simulate pre-filled required documents
  const requiredDocuments = [
    { name: "Akta Pendirian Perusahaan", status: "uploaded", filename: "akta_pendirian_pt_example.pdf" },
    { name: "SIUP (Surat Izin Usaha Perdagangan)", status: "uploaded", filename: "siup_2024.pdf" },
    { name: "Sertifikat Lahan/HGU", status: "uploaded", filename: "sertifikat_lahan_1234ha.pdf" },
    { name: "NPWP Perusahaan", status: "uploaded", filename: "npwp_perusahaan.pdf" },
    { name: "Surat Keterangan Domisili Usaha", status: "uploaded", filename: "domisili_usaha.pdf" },
    { name: "Laporan Keuangan Terakhir", status: "uploaded", filename: "laporan_keuangan_2023.pdf" },
    { name: "Struktur Organisasi Perusahaan", status: "uploaded", filename: "struktur_organisasi.pdf" },
    { name: "Rencana Kerja dan Anggaran (RKA)", status: "uploaded", filename: "rka_2024.pdf" }
  ];

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!name || !email || !password || !company) {
      setErrorMsg("Semua field wajib diisi.");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("Password minimal 6 karakter.");
      return;
    }

    try {
      setLoading(true);
      const res = await registerUser({
        name,
        email,
        password,
        role: "company", // Fixed role for company users only
        company,
        avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=2563eb&color=fff`,
      });

      if (!res.success) {
        setErrorMsg(res.error || "Pendaftaran gagal. Silakan coba lagi.");
        return;
      }

      setSuccessMsg("Pendaftaran berhasil! Mengarahkan ke halaman login...");
      setTimeout(() => {
        router.push("/login/perusahaan");
      }, 1500);
    } catch (err: any) {
      setErrorMsg(err?.message || "Terjadi kesalahan saat pendaftaran.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "mt-1 w-full rounded-lg border px-4 py-3 text-sm bg-white text-slate-900 placeholder-slate-500 border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-colors";

  const labelClass = "block text-sm font-semibold text-slate-900";

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navbar */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-screen-lg mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-600 flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-slate-900">Smart ISPO</span>
          </Link>
          <Link 
            href="/login/perusahaan" 
            className="text-sm font-semibold text-blue-700 hover:text-blue-800 hover:underline transition-colors"
          >
            Sudah punya akun?
          </Link>
        </div>
      </header>

      <main className="max-w-screen-lg mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Form */}
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 sm:p-8">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                <Building2 className="w-6 h-6 text-blue-600" />
                Daftar Sertifikasi ISPO
              </h1>
              <p className="text-slate-700 mt-2">
                Daftarkan perusahaan Anda untuk mendapatkan sertifikasi ISPO (Indonesian Sustainable Palm Oil).
              </p>
              <div className="mt-4 p-4 bg-blue-600 border border-blue-700 rounded-lg">
                <p className="text-sm text-white font-medium">
                  <strong>Khusus Perusahaan:</strong> Pendaftaran ini hanya untuk perusahaan yang ingin mengajukan sertifikasi ISPO.
                </p>
              </div>
            </div>

            <form onSubmit={onSubmit} className="space-y-5">
              {/* Nama Perusahaan */}
              <div>
                <label className={labelClass}>
                  Nama Perusahaan <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className={inputClass}
                  placeholder="PT Contoh Sawit Lestari"
                  autoComplete="organization"
                  required
                />
              </div>

              {/* Nama PIC (Person In Charge) */}
              <div>
                <label className={labelClass}>
                  Nama Penanggung Jawab <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={inputClass}
                  placeholder="Nama lengkap PIC perusahaan"
                  autoComplete="name"
                  required
                />
                <p className="text-xs text-slate-700 mt-1">
                  Nama orang yang bertanggung jawab untuk proses sertifikasi
                </p>
              </div>

              {/* Email */}
              <div>
                <label className={labelClass}>
                  Email Perusahaan <span className="text-red-600">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                  placeholder="admin@perusahaan.com"
                  autoComplete="email"
                  required
                />
                <p className="text-xs text-slate-700 mt-1">
                  Email resmi perusahaan untuk komunikasi sertifikasi
                </p>
              </div>

              {/* Password */}
              <div>
                <label className={labelClass}>
                  Password <span className="text-red-600">*</span>
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
                    className="absolute top-1/2 -translate-y-1/2 right-3 text-slate-600 hover:text-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded p-1"
                    aria-label={showPass ? "Sembunyikan password" : "Lihat password"}
                  >
                    {showPass ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Agreement */}
              <div className="bg-slate-100 border border-slate-300 rounded-lg p-4">
                <p className="text-sm text-slate-900 font-semibold">
                  Dengan mendaftar, Anda menyetujui:
                </p>
                <ul className="text-sm text-slate-800 mt-2 space-y-1 pl-4">
                  <li>• Mengikuti seluruh proses audit ISPO</li>
                  <li>• Menyediakan akses ke lokasi untuk inspeksi lapangan</li>
                  <li>• Melengkapi semua dokumen yang dipersyaratkan</li>
                  <li>• Membayar biaya sertifikasi sesuai ketentuan</li>
                </ul>
              </div>

              {/* Alert Messages */}
              {errorMsg && (
                <div
                  className="rounded-lg border border-red-600 bg-red-100 text-red-900 text-sm px-4 py-3"
                  role="alert"
                >
                  <strong>Error:</strong> {errorMsg}
                </div>
              )}
              {successMsg && (
                <div
                  className="rounded-lg border border-green-600 bg-green-100 text-green-900 text-sm px-4 py-3"
                  role="status"
                >
                  <CheckCircle className="w-4 h-4 inline mr-2" />
                  {successMsg}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 text-white font-semibold px-6 py-3 hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Memproses Pendaftaran...
                  </>
                ) : (
                  <>
                    <Building2 className="w-4 h-4" />
                    Daftar Sertifikasi ISPO
                  </>
                )}
              </button>

              {/* Login Link */}
              <div className="text-center text-sm text-slate-800 pt-2 border-t border-slate-200">
                Sudah punya akun?{" "}
                <Link 
                  href="/login/perusahaan" 
                  className="text-blue-700 hover:text-blue-800 hover:underline font-semibold"
                >
                  Masuk di sini
                </Link>
              </div>
            </form>
          </div>

          {/* Right Side - Required Documents */}
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 sm:p-8">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-green-600" />
                Dokumen Persyaratan
              </h2>
              <p className="text-slate-700 mt-2">
                Berikut adalah dokumen yang diperlukan untuk proses sertifikasi ISPO:
              </p>
            </div>

            <div className="space-y-3">
              {requiredDocuments.map((doc, index) => (
                <div 
                  key={index} 
                  className="flex items-center gap-3 p-3 bg-green-100 border border-green-300 rounded-lg"
                >
                  <CheckCircle className="w-5 h-5 text-green-700 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-900">{doc.name}</p>
                    <p className="text-xs text-slate-700 mt-1">
                      📄 {doc.filename}
                    </p>
                  </div>
                  <span className="text-xs bg-green-200 text-green-900 px-2 py-1 rounded-full font-semibold">
                    ✓ Uploaded
                  </span>
                </div>
              ))}
            </div>

            {/* FIXED: Demo Status Box with Better Contrast */}
            <div className="mt-6 p-4 bg-slate-800 border border-slate-700 rounded-lg">
              <h3 className="text-sm font-bold text-white mb-2">
                📋 Status Dokumen (Demo)
              </h3>
              <p className="text-sm text-slate-200">
                Pada demo ini, semua dokumen dianggap sudah terupload untuk mempercepat proses. 
                Pada implementasi real, perusahaan akan mengunggah dokumen satu per satu melalui dashboard mereka.
              </p>
            </div>

            <div className="mt-6 p-4 bg-slate-200 border border-slate-400 rounded-lg">
              <h3 className="text-sm font-bold text-slate-900 mb-2">
                🔒 Proses Selanjutnya
              </h3>
              <div className="space-y-2 text-xs text-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span>Admin akan review permohonan Anda</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-600 rounded-full"></div>
                  <span>Project audit akan dibuat jika disetujui</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  <span>Auditor akan ditugaskan untuk evaluasi</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}