# Setup Supabase untuk GAMAPALM ISPO

Panduan ini akan membantu Anda mengintegrasikan aplikasi GAMAPALM dengan database Supabase.

## Langkah 1: Buat Project Supabase

1. Kunjungi [https://supabase.com](https://supabase.com) dan buat akun atau login
2. Klik "New Project"
3. Isi detail project:
   - Name: `gamapalm-ispo`
   - Database Password: (simpan password ini dengan aman)
   - Region: Pilih yang terdekat dengan lokasi Anda (misalnya: Singapore)
4. Klik "Create new project" dan tunggu beberapa menit hingga project siap

## Langkah 2: Setup Database Schema

1. Buka project Supabase Anda
2. Di sidebar, klik "SQL Editor"
3. Klik "New Query"
4. Copy seluruh isi file `supabase-schema.sql` dan paste ke editor
5. Klik "Run" untuk menjalankan query
6. Tunggu hingga selesai (akan membuat semua tabel, indexes, dan policies)

## Langkah 3: Seed Data Awal

1. Masih di SQL Editor, buat query baru
2. Copy seluruh isi file `supabase-seed.sql` dan paste ke editor
3. Klik "Run" untuk menjalankan query
4. Data awal akan terisi (users, auditors, admin, projects, dll)

## Langkah 4: Setup Authentication (Optional - untuk production)

Untuk demo, aplikasi menggunakan autentikasi sederhana dengan check langsung ke database.
Untuk production, Anda bisa mengaktifkan Supabase Auth:

1. Di sidebar, klik "Authentication" > "Providers"
2. Aktifkan "Email" provider
3. Update kode di `src/lib/supabase-service.ts` untuk menggunakan Supabase Auth
4. Contoh:
```typescript
const { data, error } = await supabase.auth.signInWithPassword({
  email: email,
  password: password
});
```

## Langkah 5: Konfigurasi Environment Variables

1. Di project Supabase, klik "Settings" > "API"
2. Copy nilai berikut:
   - `Project URL` (misalnya: https://xxxxx.supabase.co)
   - `anon public` key di bagian "Project API keys"

3. Buka file `.env.local` di root project
4. Update dengan nilai yang Anda copy:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Langkah 6: Setup Storage untuk File Upload (Optional)

Untuk upload file dokumen:

1. Di sidebar Supabase, klik "Storage"
2. Klik "Create a new bucket"
3. Nama bucket: `documents`
4. Public bucket: `true` (atau sesuaikan dengan kebutuhan)
5. Klik "Create bucket"

6. Setup policy untuk bucket:
   - Klik bucket "documents"
   - Klik "Policies"
   - Tambahkan policy untuk INSERT dan SELECT sesuai role user

Contoh kode untuk upload file:
```typescript
const { data, error } = await supabase.storage
  .from('documents')
  .upload(`${userId}/${filename}`, file);
```

## Langkah 7: Verifikasi Setup

1. Buka terminal di project folder
2. Jalankan:
```bash
npm run dev
```

3. Buka browser ke `http://localhost:3000`
4. Test login dengan akun:
   - **Admin**: admin@ispo.com / admin
   - **Auditor**: budi.s@email.com / (password di database)
   - **User**: rina.a@sawitmaju.com / (password di database)

## Struktur Database

### Tables:
- `users` - Data perusahaan yang apply sertifikasi
- `auditors` - Data auditor ISPO
- `admins` - Data admin sistem
- `audit_projects` - Proyek audit per perusahaan
- `criteria` - Kriteria audit (checklist ISPO)
- `requests` - Pengajuan sertifikasi
- `audit_tasks` - Tugas audit untuk auditor

### Row Level Security (RLS):
Database sudah dilengkapi dengan RLS policies untuk keamanan:
- Users hanya bisa akses data mereka sendiri
- Auditors hanya bisa akses tugas yang di-assign ke mereka
- Admins perlu service role key untuk full access

## Troubleshooting

### Error: "Invalid API key"
- Pastikan `.env.local` sudah benar
- Restart development server (`npm run dev`)

### Error: "relation does not exist"
- Jalankan ulang `supabase-schema.sql`
- Pastikan semua tabel terbuat

### Error: "permission denied"
- Check RLS policies di Supabase dashboard
- Untuk testing, Anda bisa temporarily disable RLS

### Data tidak muncul
- Pastikan sudah menjalankan `supabase-seed.sql`
- Check di Supabase > Table Editor apakah data sudah ada

## Next Steps

Setelah Supabase setup selesai:

1. ✅ Test semua flow: login, upload dokumen, assign auditor
2. ✅ Implement file upload ke Supabase Storage
3. ✅ Tambahkan real-time subscriptions (optional)
4. ✅ Deploy aplikasi ke Vercel/Netlify
5. ✅ Setup domain custom dan production Supabase project

## Support

Jika ada pertanyaan atau kendala, silakan:
- Check dokumentasi Supabase: https://supabase.com/docs
- Buka issue di GitHub repository ini
- Kontak developer
