# GAMAPALM - Smart ISPO TIC (Indonesian Sustainable Palm Oil)

Aplikasi digitalisasi untuk memudahkan proses sertifikasi ISPO dengan integrasi database Supabase.

## 🌟 Fitur Utama

### 1. **Multi-Role Authentication**
- **Admin**: Mengelola permintaan sertifikasi dan assign tugas ke auditor
- **Auditor**: Melakukan verifikasi dokumen dan audit kriteria ISPO
- **Perusahaan (User)**: Upload berkas dan dokumen untuk sertifikasi

### 2. **Workflow Sertifikasi ISPO**
- Upload dokumen sesuai kriteria ISPO (7 Prinsip)
- Assign auditor ke setiap kriteria
- Verifikasi dan approval dari auditor
- Penerbitan sertifikat digital

### 3. **Integrasi Database Supabase**
- Real-time data synchronization
- Secure authentication
- Row-level security (RLS)
- File storage untuk dokumen

## 🚀 Quick Start

### Prasyarat
- Node.js 18+ 
- npm atau yarn
- Akun Supabase (gratis)

### Instalasi

1. Clone repository:
```bash
git clone https://github.com/Aftaputra/gamapalm.git
cd gamapalm
```

2. Install dependencies:
```bash
npm install
```

3. Setup Supabase (lihat [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) untuk detail):
   - Buat project di [supabase.com](https://supabase.com)
   - Jalankan `supabase-schema.sql` di SQL Editor
   - Jalankan `supabase-seed.sql` untuk data awal

4. Konfigurasi environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` dengan credentials Supabase Anda:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

5. Jalankan development server:
```bash
npm run dev
```

6. Buka browser ke [http://localhost:3000](http://localhost:3000)

## 🔐 Login Credentials (Development)

### Admin
- Email: `admin@ispo.com`
- Password: `admin`

### Auditor (Sample)
- Email: `budi.s@email.com`
- Password: Lihat di database Supabase

### Perusahaan (Sample)
- Email: `rina.a@sawitmaju.com`
- Password: Lihat di database Supabase

## 📁 Struktur Project

```
gamapalm/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── login/             # Halaman login (admin, auditor, user)
│   │   ├── dashboard/         # Dashboard utama
│   │   └── cert/              # Halaman sertifikat
│   ├── components/
│   │   ├── dashboards/        # Dashboard components
│   │   │   ├── AdminDashboard.tsx
│   │   │   ├── AuditorDashboard.tsx
│   │   │   └── UserDashboard.tsx
│   │   └── ...
│   ├── lib/
│   │   ├── supabase.ts        # Supabase client
│   │   ├── supabase-service.ts # Service layer untuk database
│   │   └── mockdata.ts        # Mock data (fallback)
│   └── types/
│       └── index.ts           # TypeScript types
├── supabase-schema.sql        # Database schema
├── supabase-seed.sql          # Seed data
├── SUPABASE_SETUP.md          # Panduan setup Supabase
└── README.md
```

## 🗄️ Database Schema

### Tables
- **users**: Data perusahaan
- **auditors**: Data auditor
- **admins**: Data administrator
- **audit_projects**: Proyek audit per perusahaan
- **criteria**: Kriteria audit (checklist ISPO)
- **requests**: Pengajuan sertifikasi
- **audit_tasks**: Tugas audit

Lihat [supabase-schema.sql](./supabase-schema.sql) untuk detail lengkap.

## 🔄 Workflow Aplikasi

### 1. Pengajuan Sertifikasi (User/Perusahaan)
1. Login sebagai perusahaan
2. Lihat project audit yang aktif
3. Upload dokumen untuk setiap kriteria ISPO
4. Submit untuk review auditor

### 2. Assignment (Admin)
1. Login sebagai admin
2. Terima pengajuan sertifikasi
3. Approve/reject request
4. Assign auditor ke kriteria tertentu

### 3. Audit & Verifikasi (Auditor)
1. Login sebagai auditor
2. Lihat tugas yang di-assign
3. Review dokumen yang diupload perusahaan
4. Beri feedback atau approve kriteria

### 4. Penerbitan Sertifikat
1. Setelah semua kriteria disetujui
2. Admin dapat menerbitkan sertifikat digital
3. Sertifikat tersimpan di blockchain (IPFS/NFT - optional)

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth (custom implementation)
- **Maps**: Leaflet, React Leaflet
- **Icons**: Lucide React
- **Deployment**: Vercel (recommended)

## 📝 Integrasi Supabase

### Service Layer
File `src/lib/supabase-service.ts` menyediakan fungsi-fungsi untuk:

```typescript
// Authentication
authService.loginAdmin(email, password)
authService.loginAuditor(email, password)
authService.loginUser(email, password)
authService.registerUser(userData)

// Projects
projectService.getAllProjects()
projectService.getProjectsByUserId(userId)
projectService.createProject(projectData)

// Criteria
criteriaService.updateCriterion(projectId, criterionId, updates)
criteriaService.assignAuditor(projectId, criterionId, auditorId)

// Requests
requestService.getAllRequests()
requestService.updateRequestStatus(requestId, status)

// Audit Tasks
auditTaskService.getAllTasks()
auditTaskService.assignTask(taskId, auditorId)
```

### Fallback ke Mock Data
Aplikasi dirancang untuk fallback ke mock data jika koneksi Supabase gagal, sehingga dapat berjalan dalam mode development tanpa Supabase.

## 🔒 Security

- Row-Level Security (RLS) di Supabase
- Users hanya bisa akses data mereka sendiri
- Auditors hanya bisa akses tugas yang di-assign
- Admins perlu service role key untuk full access

## 🚧 Development

### Menjalankan Linter
```bash
npm run lint
```

### Build Production
```bash
npm run build
```

### Start Production Server
```bash
npm start
```

## 📚 Documentation

- [Supabase Setup Guide](./SUPABASE_SETUP.md) - Panduan lengkap setup Supabase
- [Database Schema](./supabase-schema.sql) - Schema database lengkap
- [Seed Data](./supabase-seed.sql) - Data awal untuk testing

## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📧 Support

Jika ada pertanyaan atau kendala:
- Buka issue di GitHub repository

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Indonesian Sustainable Palm Oil (ISPO) Standards
- Supabase for amazing BaaS platform
- Next.js team for the framework
- Semua kontributor project

---

**Dibuat dengan ❤️ untuk digitalisasi sertifikasi ISPO Indonesia**

