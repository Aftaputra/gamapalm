// GANTI SELURUH ISI FILE index.ts DENGAN KODE INI

export type RequestItem = {
  id: number;
  company: string;
  status: "pending" | "approved" | "rejected";
};

export interface Location {
  lat: number;
  lng: number;
}

export type AuditTask = {
  location?: Location;
  id: number;
  auditorId: string | null; 
  company: string;
  parameter: string;
  status: "pending" | "approved" | "rejected";
};

export type Auditor = {
  id: string;
  name: string;
  avatarUrl: string;
  email: string;
  password: string;
  location: string;
};

export type User = {
  id: string;
  name: string;
  avatarUrl: string;
  email: string;
  password: string;
  company: string;
};

// =================================================================
// ==              TIPE DATA AUDIT YANG SUDAH FINAL               ==
// =================================================================

export type CriterionStatus = "Belum Ada Berkas" | "Menunggu Verifikasi" | "Revisi Diperlukan" | "Disetujui";

// Tipe BARU untuk menentukan jenis input form di UI
export type FormType = 'file' | 'text' | 'file_and_text';

// Tipe untuk TEMPLATE Kriteria dari dokumen checklist (Definisi)
export type CriterionTemplate = {
  id: string; // Contoh: '1.1.1'
  name: string;
  verificationMethod: string; // Metode Verifikasi
  assessmentStandard: string; // Norma Penilaian
  verifier: string[]; // Daftar item verifier
  requiresInspection: boolean;
  formType: FormType; // <-- PROPERTI BARU
};

// Tipe untuk Kriteria Audit yang sudah berjalan (Progres)
export type Criterion = CriterionTemplate & {
  status: CriterionStatus;
  submittedFileUrl: string | null;
  submittedText: string | null; // <-- PROPERTI BARU
  auditorNotes: string | null;
  assignedAuditorId: string | null;
  inspectionDate?: string;
};

// Tipe untuk Prinsip ISPO utama (TEMPLATE)
export type Principle = {
  id: string; // Contoh: 'P1'
  name: string;
  criteria: CriterionTemplate[]; // Menggunakan template kriteria
};

// Tipe untuk satu Proyek Audit lengkap per perusahaan
export type AuditProject = {
  projectId: string;
  companyName: string;
  status: "Sedang Berlangsung" | "Selesai";
  deadline: string;
  principles: {
    P1: Criterion[]; P2: Criterion[]; P3: Criterion[];
    P4: Criterion[]; P5: Criterion[]; P6: Criterion[]; P7: Criterion[];
  };
  location: { lat: number; lng: number; };
};