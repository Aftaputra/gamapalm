"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { auditors, adminAccount } from "@/lib/mockdata";

export default function StafLoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<'admin' | 'auditor'>('auditor');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    setTimeout(() => {
      let loginSuccess = false;
      if (role === 'admin') {
        if (email === adminAccount.email && password === adminAccount.password) {
          localStorage.setItem("role", "admin");
          loginSuccess = true;
        }
      } else {
        const foundAuditor = auditors.find(a => a.email.toLowerCase() === email.toLowerCase());
        if (foundAuditor && password === foundAuditor.password) {
          localStorage.setItem("role", "auditor");
          localStorage.setItem("auditorId", foundAuditor.id);
          loginSuccess = true;
        }
      }

      if (loginSuccess) {
        router.push("/dashboard");
      } else {
        setError("Email atau password salah!");
        setIsLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4">
      <div className="bg-slate-200 shadow-2xl rounded-xl p-8 w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-900">Portal Internal</h1>
          <p className="mt-2 text-slate-700">Login untuk Admin & Auditor.</p>
        </div>

        {/* Role Switcher */}
        <div className="flex bg-slate-300 p-1 rounded-lg">
          <button
            onClick={() => setRole('auditor')}
            className={`w-1/2 p-2 rounded-md font-semibold text-sm transition-colors ${
              role === 'auditor' ? 'bg-white shadow text-slate-900' : 'text-slate-700'
            }`}
          >
            Auditor
          </button>
          <button
            onClick={() => setRole('admin')}
            className={`w-1/2 p-2 rounded-md font-semibold text-sm transition-colors ${
              role === 'admin' ? 'bg-white shadow text-slate-900' : 'text-slate-700'
            }`}
          >
            Admin
          </button>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-slate-900">Email</label>
            <input
              required
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="mt-1 w-full border-2 border-gray-400 rounded-lg p-3 text-slate-900 placeholder-slate-600 focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
              placeholder="email@internal.com"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-900">Password</label>
            <input
              required
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="mt-1 w-full border-2 border-gray-400 rounded-lg p-3 text-slate-900 placeholder-slate-600 focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
              placeholder="********"
            />
          </div>
          {error && <p className="text-red-600 text-sm text-center font-bold">{error}</p>}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold text-base hover:bg-blue-700 disabled:bg-gray-400"
          >
            {isLoading ? 'Mencoba Masuk...' : 'LOGIN'}
          </button>
        </form>
      </div>
    </div>
  );
}
