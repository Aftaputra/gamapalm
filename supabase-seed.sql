-- ============================================
-- SEED DATA untuk GAMAPALM ISPO Database
-- ============================================
-- Jalankan script ini SETELAH menjalankan supabase-schema.sql
-- untuk mengisi database dengan data awal

-- ============================================
-- SEED: Admins
-- ============================================
INSERT INTO admins (email, name) VALUES
('admin@ispo.com', 'Admin ISPO');

-- ============================================
-- SEED: Auditors
-- ============================================
INSERT INTO auditors (id, email, name, location, avatar_url) VALUES
('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 'budi.s@email.com', 'Budi Santoso', 'Jakarta', 'https://i.pravatar.cc/150?u=budi'),
('b2c3d4e5-f6a7-5b6c-9d0e-1f2a3b4c5d6e', 'dewi.l@email.com', 'Dewi Lestari', 'Medan', 'https://i.pravatar.cc/150?u=eko'),
('c3d4e5f6-a7b8-6c7d-0e1f-2a3b4c5d6e7f', 'ahmad.s@email.com', 'Ahmad Subagja', 'Pontianak', 'https://i.pravatar.cc/150?u=ahmad');

-- ============================================
-- SEED: Users (Perusahaan)
-- ============================================
INSERT INTO users (id, email, name, company, avatar_url) VALUES
('d4e5f6a7-b8c9-7d8e-1f2a-3b4c5d6e7f8a', 'rina.a@sawitmaju.com', 'Rina Aprilia', 'PT Sawit Maju', 'https://i.pravatar.cc/150?u=rina'),
('e5f6a7b8-c9d0-8e9f-2a3b-4c5d6e7f8a9b', 'joko.s@agrolestari.com', 'Joko Susilo', 'PT Agro Lestari', 'https://i.pravatar.cc/150?u=joko');

-- ============================================
-- SEED: Requests
-- ============================================
INSERT INTO requests (company, user_id, status) VALUES
('PT Sawit Maju', 'd4e5f6a7-b8c9-7d8e-1f2a-3b4c5d6e7f8a', 'pending'),
('PT Perkebunan Sejahtera', NULL, 'approved'),
('PT Agro Lestari', 'e5f6a7b8-c9d0-8e9f-2a3b-4c5d6e7f8a9b', 'rejected');

-- ============================================
-- SEED: Audit Tasks
-- ============================================
INSERT INTO audit_tasks (auditor_id, company, parameter, status, location_lat, location_lng) VALUES
('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 'PT Sawit Maju', 'Legalitas Lahan', 'pending', -0.93294, 102.634),
('b2c3d4e5-f6a7-5b6c-9d0e-1f2a3b4c5d6e', 'PT Perkebunan Sejahtera', 'Lingkungan', 'approved', -0.95000, 102.700),
('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 'PT Agro Lestari', 'Ketenagakerjaan', 'pending', -1.00000, 103.000),
(NULL, 'CV Tani Jaya', 'Transparansi', 'pending', -0.90000, 102.500);

-- ============================================
-- SEED: Audit Project
-- ============================================
INSERT INTO audit_projects (id, project_id, company_name, user_id, status, deadline, location_lat, location_lng) VALUES
('f6a7b8c9-d0e1-9f0a-3b4c-5d6e7f8a9b0c', 'PROJ-001', 'PT Sawit Maju', 'd4e5f6a7-b8c9-7d8e-1f2a-3b4c5d6e7f8a', 'Sedang Berlangsung', '2025-10-30', -0.93294, 102.634);

-- ============================================
-- SEED: Criteria untuk PROJ-001
-- ============================================
-- Prinsip 1
INSERT INTO criteria (
  project_id, criterion_id, principle_id, name, 
  verification_method, assessment_standard, verifier, 
  requires_inspection, form_type, status, 
  submitted_file_url, submitted_text, auditor_notes, assigned_auditor_id
) VALUES
(
  'f6a7b8c9-d0e1-9f0a-3b4c-5d6e7f8a9b0c',
  '1.1.1',
  'P1',
  'Legalitas Lahan: Bukti kepemilikan tanah yang sah',
  'Tinjauan dokumen, wawancara & Observasi',
  ''Memenuhi' jika memiliki sertifikat tanah, akta jual beli, girik, atau bukti sah lainnya.',
  '["Hak atas tanah (HGU, SHM) dapat ditunjukkan.", "Jika dalam proses, surat/dokumen pengurusan dapat ditunjukkan.", "Nama pemegang Hak Atas Tanah sesuai dengan nama unit sertifikasi."]',
  true,
  'file',
  'Disetujui',
  '/files/dummy-doc.pdf',
  NULL,
  'Sudah sesuai dengan peta BPN terbaru.',
  'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d'
),
(
  'f6a7b8c9-d0e1-9f0a-3b4c-5d6e7f8a9b0c',
  '1.4.1',
  'P1',
  'Legalitas Usaha: Surat Tanda Daftar Usaha Perkebunan (STD-B)',
  'Tinjauan dokumen, Wawancara & Observasi',
  ''Memenuhi' jika memiliki dokumen STDB.',
  '["Untuk lahan < 25 ha, tersedia dokumen STD sesuai lokasi kebun.", "STDB dikeluarkan oleh instansi yang berwenang."]',
  false,
  'file',
  'Menunggu Verifikasi',
  '/files/dummy-doc.pdf',
  NULL,
  NULL,
  'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d'
);

-- Prinsip 2
INSERT INTO criteria (
  project_id, criterion_id, principle_id, name, 
  verification_method, assessment_standard, verifier, 
  requires_inspection, form_type, status, 
  submitted_file_url, submitted_text, auditor_notes, assigned_auditor_id
) VALUES
(
  'f6a7b8c9-d0e1-9f0a-3b4c-5d6e7f8a9b0c',
  '2.3.2.1',
  'P2',
  'Perbenihan: Menggunakan benih dari sumber yang diakui Pemerintah',
  'Tinjauan dokumen & wawancara',
  ''Memenuhi' jika memiliki dokumen penggunaan benih sesuai standar pemerintah.',
  '["Rekaman penggunaan benih yang sudah dilepas oleh Pemerintah.", "Surat keterangan penggunaan benih dari Dinas terkait."]',
  false,
  'file',
  'Revisi Diperlukan',
  '/files/dummy-doc.pdf',
  NULL,
  'Sertifikat sumber benih sudah kedaluwarsa, mohon lampirkan yang terbaru.',
  'b2c3d4e5-f6a7-5b6c-9d0e-1f2a3b4c5d6e'
),
(
  'f6a7b8c9-d0e1-9f0a-3b4c-5d6e7f8a9b0c',
  '2.3.7.1',
  'P2',
  'Pemanenan: Acuan teknis untuk buah matang panen',
  'Tinjauan dokumen & wawancara',
  ''Memenuhi' jika memiliki dokumen penyiapan tenaga kerja dan penetapan kriteria buah matang.',
  '["Rekaman penyiapan tenaga kerja, peralatan, dan sarana.", "SOP penetapan kriteria matang panen dan putaran panen."]',
  true,
  'file',
  'Belum Ada Berkas',
  NULL,
  NULL,
  NULL,
  'b2c3d4e5-f6a7-5b6c-9d0e-1f2a3b4c5d6e'
);

-- Prinsip 3
INSERT INTO criteria (
  project_id, criterion_id, principle_id, name, 
  verification_method, assessment_standard, verifier, 
  requires_inspection, form_type, status, 
  submitted_file_url, submitted_text, auditor_notes, assigned_auditor_id
) VALUES
(
  'f6a7b8c9-d0e1-9f0a-3b4c-5d6e7f8a9b0c',
  '3.1.1',
  'P3',
  'Pencegahan dan Penanggulangan Kebakaran',
  'Tinjauan dokumen, wawancara & observasi',
  ''Memenuhi' jika memiliki SOP, informasi area rawan, dan sarana prasarana.',
  '["Dokumen mekanisme/pedoman/SOP pencegahan kebakaran.", "Dokumen berisi informasi areal yang rawan kebakaran.", "Ketersediaan peralatan untuk mencegah kebakaran."]',
  true,
  'file_and_text',
  'Menunggu Verifikasi',
  '/files/dummy-doc.pdf',
  'Peralatan pemadam (APAR) tersedia di setiap blok dan gudang. Simulasi rutin dijadwalkan setiap 6 bulan.',
  NULL,
  'c3d4e5f6-a7b8-6c7d-0e1f-2a3b4c5d6e7f'
),
(
  'f6a7b8c9-d0e1-9f0a-3b4c-5d6e7f8a9b0c',
  '3.2.1',
  'P3',
  'Pelestarian Keanekaragaman Hayati: Identifikasi satwa dan tumbuhan',
  'Tinjauan dokumen, Wawancara & Observasi',
  ''Memenuhi' jika memiliki data satwa/tumbuhan dan tidak ada pemeliharaan satwa langka yang dilindungi.',
  '["Rencana dan realisasi identifikasi satwa dan tumbuhan langka.", "Mekanisme perlindungan satwa dan tumbuhan langka.", "Tidak terdapat satwa langka yang ditangkap/dipelihara."]',
  true,
  'file_and_text',
  'Belum Ada Berkas',
  NULL,
  NULL,
  NULL,
  'c3d4e5f6-a7b8-6c7d-0e1f-2a3b4c5d6e7f'
);
