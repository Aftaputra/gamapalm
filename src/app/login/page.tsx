"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Leaf, Shield, Eye, User, ArrowLeft } from "lucide-react";
import { auditors, users, adminAccount } from "@/lib/mockdata";

type View = 'role-select' | 'admin-login' | 'auditor-login' | 'user-login';

// FIX 1: LoginForm dipindah ke luar agar tidak re-render & kehilangan fokus
// Komponen ini sekarang mandiri dan tidak akan dibuat ulang setiap kali parent-nya (LoginPage) re-render.
const LoginForm = ({
  role,
  onBack,
  onSubmit,
  email,
  setEmail,
  password,
  setPassword,
  error,
  isLoading
}: any) => (
  <div className="min-h-screen flex items-center justify-center bg-slate-200 p-4">
    <div className="bg-white shadow-2xl rounded-xl p-8 w-full max-w-sm space-y-6">
      <button onClick={onBack} className="flex items-center text-sm font-semibold text-slate-800 hover:text-black">
        <ArrowLeft className="w-4 h-4 mr-2"/> Kembali Pilih Peran
      </button>
      <div className="text-center">
        {/* FIX 2: Ikon & teks lebih kontras */}
        {role === 'Admin' && <Shield className="mx-auto h-10 w-10 text-red-600" />}
        {role === 'Auditor' && <Eye className="mx-auto h-10 w-10 text-blue-600" />}
        {role === 'User' && <User className="mx-auto h-10 w-10 text-green-600" />}
        <h1 className="mt-2 text-3xl font-bold text-slate-900">{role} Login</h1>
        <p className="mt-2 text-slate-800">Gunakan email dan password Anda.</p>
      </div>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-semibold text-slate-900">Email</label>
          <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full border-2 border-gray-300 rounded-lg p-3 text-slate-900 font-medium focus:ring-2 focus:ring-blue-500 focus:border-transparent"/>
        </div>
        <div>
          <label className="text-sm font-semibold text-slate-900">Password</label>
          <input required type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 w-full border-2 border-gray-300 rounded-lg p-3 text-slate-900 font-medium focus:ring-2 focus:ring-blue-500 focus:border-transparent"/>
        </div>
        {error && <p className="text-red-600 text-sm text-center font-bold">{error}</p>}
        <button type="submit" disabled={isLoading} className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold text-base hover:bg-blue-700 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed">
          {isLoading ? 'Mencoba Masuk...' : 'LOGIN'}
        </button>
      </form>
    </div>
  </div>
);

export default function LoginPage() {
  const router = useRouter();
  const [view, setView] = useState<View>('role-select');
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
      
      if (view === 'admin-login') {
        if (email === adminAccount.email && password === adminAccount.password) {
          localStorage.setItem("role", "admin");
          loginSuccess = true;
        }
      } else if (view === 'auditor-login') {
        const foundAuditor = auditors.find(a => a.email.toLowerCase() === email.toLowerCase());
        if (foundAuditor && password === foundAuditor.password) {
          localStorage.setItem("role", "auditor");
          localStorage.setItem("auditorId", foundAuditor.id);
          loginSuccess = true;
        }
      } else if (view === 'user-login') {
        const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (foundUser && password === foundUser.password) {
          localStorage.setItem("role", "user");
          localStorage.setItem("userId", foundUser.id);
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

  const changeView = (newView: View) => {
    setEmail('');
    setPassword('');
    setError('');
    setView(newView);
  }

  if (view !== 'role-select') {
    const roleName = view.split('-')[0]; // "admin", "auditor", "user"
    return (
      <LoginForm
        role={roleName.charAt(0).toUpperCase() + roleName.slice(1)} // "Admin", "Auditor", "User"
        onBack={() => changeView('role-select')}
        onSubmit={handleLogin}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        error={error}
        isLoading={isLoading}
      />
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-200 p-4">
      <div className="bg-white shadow-2xl rounded-xl p-8 w-full max-w-sm text-center">
        <Leaf className="mx-auto h-12 w-12 text-green-600" />
        <h1 className="mt-4 text-3xl font-bold text-slate-900">Smart ISPO TIC</h1>
        <p className="mt-2 text-slate-800 font-medium mb-8">Silakan login sesuai peran Anda</p>
        <div className="space-y-4">
          <button onClick={() => changeView('admin-login')} className="w-full flex items-center justify-center space-x-3 p-3 border-2 border-gray-400 rounded-lg text-slate-900 font-bold hover:bg-slate-100 transition-colors duration-200">
            <Shield className="w-5 h-5 text-slate-700" /><span>Admin</span>
          </button>
          <button onClick={() => changeView('auditor-login')} className="w-full flex items-center justify-center space-x-3 p-3 border-2 border-gray-400 rounded-lg text-slate-900 font-bold hover:bg-slate-100 transition-colors duration-200">
            <Eye className="w-5 h-5 text-slate-700" /><span>Auditor</span>
          </button>
          <button onClick={() => changeView('user-login')} className="w-full flex items-center justify-center space-x-3 p-3 border-2 border-gray-400 rounded-lg text-slate-900 font-bold hover:bg-slate-100 transition-colors duration-200">
            <User className="w-5 h-5 text-slate-700" /><span>User</span>
          </button>
        </div>
      </div>
    </div>
  );
}