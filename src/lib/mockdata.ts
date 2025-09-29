// GANTI SELURUH ISI FILE mockdata.ts DENGAN KODE FINAL INI

import { Principle, AuditProject, Auditor, User, RequestItem, AuditTask } from "@/types";

// ======================================================
// ==       MASTER DATA PRINSIP & KRITERIA ISPO        ==
// ==   (FINAL: P1-3 Detail + formType, P4-7 Dummy)    ==
// ======================================================
export const ISPO_PRINCIPLES: Principle[] = [
  // PRINSIP 1 (Data Riil)
  { 
    id: "P1", 
    name: "1. Kepatuhan Terhadap Peraturan Dan Perundangan", 
    criteria: [ 
      {
        id: '1.1.1', name: 'Legalitas Lahan: Bukti kepemilikan tanah yang sah',
        verificationMethod: 'Tinjauan dokumen, wawancara & Observasi',
        assessmentStandard: '‘Memenuhi’ jika memiliki sertifikat tanah, akta jual beli, girik, atau bukti sah lainnya.',
        verifier: ['Hak atas tanah (HGU, SHM) dapat ditunjukkan.', 'Jika dalam proses, surat/dokumen pengurusan dapat ditunjukkan.', 'Nama pemegang Hak Atas Tanah sesuai dengan nama unit sertifikasi.'],
        requiresInspection: true,
        formType: 'file'
      },
      {
        id: '1.4.1', name: 'Legalitas Usaha: Surat Tanda Daftar Usaha Perkebunan (STD-B)',
        verificationMethod: 'Tinjauan dokumen, Wawancara & Observasi',
        assessmentStandard: '‘Memenuhi’ jika memiliki dokumen STDB.',
        verifier: ['Untuk lahan < 25 ha, tersedia dokumen STD sesuai lokasi kebun.', 'STDB dikeluarkan oleh instansi yang berwenang.'],
        requiresInspection: false,
        formType: 'file'
      }
    ] 
  },
  // PRINSIP 2 (Data Riil)
  { 
    id: "P2", 
    name: "2. Penerapan Praktek Perkebunan Yang Baik", 
    criteria: [
      {
        id: '2.3.2.1', name: 'Perbenihan: Menggunakan benih dari sumber yang diakui Pemerintah',
        verificationMethod: 'Tinjauan dokumen & wawancara',
        assessmentStandard: '‘Memenuhi’ jika memiliki dokumen penggunaan benih sesuai standar pemerintah.',
        verifier: ['Rekaman penggunaan benih yang sudah dilepas oleh Pemerintah.', 'Surat keterangan penggunaan benih dari Dinas terkait.'],
        requiresInspection: false,
        formType: 'file'
      },
      {
        id: '2.3.7.1', name: 'Pemanenan: Acuan teknis untuk buah matang panen',
        verificationMethod: 'Tinjauan dokumen & wawancara',
        assessmentStandard: '‘Memenuhi’ jika memiliki dokumen penyiapan tenaga kerja dan penetapan kriteria buah matang.',
        verifier: ['Rekaman penyiapan tenaga kerja, peralatan, dan sarana.', 'SOP penetapan kriteria matang panen dan putaran panen.'],
        requiresInspection: true,
        formType: 'file'
      },
    ] 
  },
  // PRINSIP 3 (Data Riil)
  { 
    id: "P3", 
    name: "3. Pengelolaan Lingkungan Hidup, Sumber Daya Alam, Dan Keanekaragaman Hayati", 
    criteria: [
      {
        id: '3.1.1', name: 'Pencegahan dan Penanggulangan Kebakaran',
        verificationMethod: 'Tinjauan dokumen, wawancara & observasi',
        assessmentStandard: '‘Memenuhi’ jika memiliki SOP, informasi area rawan, dan sarana prasarana.',
        verifier: ['Dokumen mekanisme/pedoman/SOP pencegahan kebakaran.', 'Dokumen berisi informasi areal yang rawan kebakaran.', 'Ketersediaan peralatan untuk mencegah kebakaran.'],
        requiresInspection: true,
        formType: 'file_and_text'
      },
      {
        id: '3.2.1', name: 'Pelestarian Keanekaragaman Hayati: Identifikasi satwa dan tumbuhan',
        verificationMethod: 'Tinjauan dokumen, Wawancara & Observasi',
        assessmentStandard: '‘Memenuhi’ jika memiliki data satwa/tumbuhan dan tidak ada pemeliharaan satwa langka yang dilindungi.',
        verifier: ['Rencana dan realisasi identifikasi satwa dan tumbuhan langka.', 'Mekanisme perlindungan satwa dan tumbuhan langka.', 'Tidak terdapat satwa langka yang ditangkap/dipelihara.'],
        requiresInspection: true,
        formType: 'file_and_text'
      }
    ] 
  },
  // PRINSIP 4-7 (Data Dummy Kembali Sesuai Permintaan)
  { id: "P4", name: "4. Tanggung Jawab Ketenagakerjaan", criteria: [] },
  { id: "P5", name: "5. Tanggung Jawab Sosial & Pemberdayaan", criteria: [] },
  { id: "P6", name: "6. Penerapan Transparansi", criteria: [] },
  { id: "P7", name: "7. Peningkatan Usaha Berkelanjutan", criteria: [] },
];


// ======================================================
// ==        DATA PROYEK AUDIT YANG BERJALAN           ==
// ======================================================
export const auditTasks: AuditTask[] = [
  { id: 101, auditorId: "AUD001", company: "PT Sawit Maju", parameter: "Legalitas Lahan", status: "pending" },
  { id: 102, auditorId: "AUD002", company: "PT Perkebunan Sejahtera", parameter: "Lingkungan", status: "approved" },
  { id: 103, auditorId: "AUD001", company: "PT Agro Lestari", parameter: "Ketenagakerjaan", status: "pending" },
  { id: 104, auditorId: null, company: "CV Tani Jaya", parameter: "Transparansi", status: "pending" },
];

export const auditProjects: AuditProject[] = [
  {
    projectId: 'PROJ-001',
    companyName: "PT Sawit Maju",
    status: "Sedang Berlangsung",
    deadline: "2025-10-30",
    location: { lat: -0.93294, lng: 102.634 },
    principles: {
      P1: [
        {
          id: '1.1.1', name: 'Legalitas Lahan: Bukti kepemilikan tanah yang sah',
          verificationMethod: 'Tinjauan dokumen, wawancara & Observasi',
          assessmentStandard: '‘Memenuhi’ jika memiliki sertifikat tanah, akta jual beli, girik, atau bukti sah lainnya.',
          verifier: ['Hak atas tanah (HGU, SHM) dapat ditunjukkan.', 'Jika dalam proses, surat/dokumen pengurusan dapat ditunjukkan.', 'Nama pemegang Hak Atas Tanah sesuai dengan nama unit sertifikasi.'],
          requiresInspection: true,
          formType: 'file',
          status: 'Disetujui', submittedFileUrl: '/files/dummy-doc.pdf', submittedText: null, auditorNotes: 'Sudah sesuai dengan peta BPN terbaru.', assignedAuditorId: 'AUD001',
        },
        {
          id: '1.4.1', name: 'Legalitas Usaha: Surat Tanda Daftar Usaha Perkebunan (STD-B)',
          verificationMethod: 'Tinjauan dokumen, Wawancara & Observasi',
          assessmentStandard: '‘Memenuhi’ jika memiliki dokumen STDB.',
          verifier: ['Untuk lahan < 25 ha, tersedia dokumen STD sesuai lokasi kebun.', 'STDB dikeluarkan oleh instansi yang berwenang.'],
          requiresInspection: false,
          formType: 'file',
          status: 'Menunggu Verifikasi', submittedFileUrl: '/files/dummy-doc.pdf', submittedText: null, auditorNotes: null, assignedAuditorId: 'AUD001',
        },
      ],
      P2: [
        {
          id: '2.3.2.1', name: 'Perbenihan: Menggunakan benih dari sumber yang diakui Pemerintah',
          verificationMethod: 'Tinjauan dokumen & wawancara',
          assessmentStandard: '‘Memenuhi’ jika memiliki dokumen penggunaan benih sesuai standar pemerintah.',
          verifier: ['Rekaman penggunaan benih yang sudah dilepas oleh Pemerintah.', 'Surat keterangan penggunaan benih dari Dinas terkait.'],
          requiresInspection: false,
          formType: 'file',
          status: 'Revisi Diperlukan', submittedFileUrl: '/files/dummy-doc.pdf', submittedText: null, auditorNotes: 'Sertifikat sumber benih sudah kedaluwarsa, mohon lampirkan yang terbaru.', assignedAuditorId: 'AUD002',
        },
        {
          id: '2.3.7.1', name: 'Pemanenan: Acuan teknis untuk buah matang panen',
          verificationMethod: 'Tinjauan dokumen & wawancara',
          assessmentStandard: '‘Memenuhi’ jika memiliki dokumen penyiapan tenaga kerja dan penetapan kriteria buah matang.',
          verifier: ['Rekaman penyiapan tenaga kerja, peralatan, dan sarana.', 'SOP penetapan kriteria matang panen dan putaran panen.'],
          requiresInspection: true,
          formType: 'file',
          status: 'Belum Ada Berkas', submittedFileUrl: null, submittedText: null, auditorNotes: null, assignedAuditorId: 'AUD002',
        },
      ],
      P3: [
        {
          id: '3.1.1', name: 'Pencegahan dan Penanggulangan Kebakaran',
          verificationMethod: 'Tinjauan dokumen, wawancara & observasi',
          assessmentStandard: '‘Memenuhi’ jika memiliki SOP, informasi area rawan, dan sarana prasarana.',
          verifier: ['Dokumen mekanisme/pedoman/SOP pencegahan kebakaran.', 'Dokumen berisi informasi areal yang rawan kebakaran.', 'Ketersediaan peralatan untuk mencegah kebakaran.'],
          requiresInspection: true,
          formType: 'file_and_text',
          status: 'Menunggu Verifikasi', submittedFileUrl: '/files/dummy-doc.pdf', submittedText: "Peralatan pemadam (APAR) tersedia di setiap blok dan gudang. Simulasi rutin dijadwalkan setiap 6 bulan.", auditorNotes: null, assignedAuditorId: 'AUD003',
        },
        {
          id: '3.2.1', name: 'Pelestarian Keanekaragaman Hayati: Identifikasi satwa dan tumbuhan',
          verificationMethod: 'Tinjauan dokumen, Wawancara & Observasi',
          assessmentStandard: '‘Memenuhi’ jika memiliki data satwa/tumbuhan dan tidak ada pemeliharaan satwa langka yang dilindungi.',
          verifier: ['Rencana dan realisasi identifikasi satwa dan tumbuhan langka.', 'Mekanisme perlindungan satwa dan tumbuhan langka.', 'Tidak terdapat satwa langka yang ditangkap/dipelihara.'],
          requiresInspection: true,
          formType: 'file_and_text',
          status: 'Belum Ada Berkas', submittedFileUrl: null, submittedText: null, auditorNotes: null, assignedAuditorId: 'AUD003',
        }
      ],
      P4: [], P5: [], P6: [], P7: [],
    }
  },
];

// ======================================================
// ==                 DATA AKUN-AKUN                   ==
// ======================================================
export const adminAccount = { email: "admin@ispo.com", password: "admin" };

export const auditors: Auditor[] = [
  { id: "AUD001", name: "Budi Santoso", avatarUrl: "https://i.pravatar.cc/150?u=budi", email: "budi.s@email.com", password: "passbudi123", location: "Jakarta" },
  { id: "AUD002", name: "Dewi Lestari", avatarUrl: "https://i.pravatar.cc/150?u=eko", email: "dewi.l@email.com", password: "passdewi456", location: "Medan" },
  { id: "AUD003", name: "Ahmad Subagja", avatarUrl: "https://i.pravatar.cc/150?u=ahmad", email: "ahmad.s@email.com", password: "passahmad789", location: "Pontianak" },
];

export const users: User[] = [
  { id: "USR001", name: "Rina Aprilia", avatarUrl: "https://i.pravatar.cc/150?u=rina", email: "rina.a@sawitmaju.com", password: "passrina111", company: "PT Sawit Maju" },
  { id: "USR002", name: "Joko Susilo", avatarUrl: "https://i.pravatar.cc/150?u=joko", email: "joko.s@agrolestari.com", password: "passjoko222", company: "PT Agro Lestari" }
];

export const requests: RequestItem[] = [
  { id: 1, company: "PT Sawit Maju", status: "pending" },
  { id: 2, company: "PT Perkebunan Sejahtera", status: "approved" },
  { id: 3, company: "PT Agro Lestari", status: "rejected" }
];