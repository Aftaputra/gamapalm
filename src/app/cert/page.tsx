import CertificateMinter from '@/components/CertificateMinter';

export default function CertificatePage() {
  return (
    // FIX: Ganti background jadi gradient yg subtle & modern
    // FIX: Pastikan tinggi 100% viewport (min-h-screen) & tambah padding
    <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-slate-100 p-4 sm:p-6 lg:p-8">
      
      {/* Langsung panggil komponennya.
        Gak perlu div wrapper lagi karena CertificateMinter udah punya style card sendiri.
        Ini bikin struktur lebih bersih dan efisien.
      */}
      <CertificateMinter />

    </main>
  );
}