-- ============================================
-- GAMAPALM ISPO Database Schema for Supabase
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLE: users (Perusahaan)
-- ============================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  company TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABLE: auditors
-- ============================================
CREATE TABLE auditors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABLE: admins
-- ============================================
CREATE TABLE admins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABLE: audit_projects
-- ============================================
CREATE TABLE audit_projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id TEXT UNIQUE NOT NULL,
  company_name TEXT NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('Sedang Berlangsung', 'Selesai')),
  deadline DATE NOT NULL,
  location_lat DECIMAL(10, 8),
  location_lng DECIMAL(11, 8),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABLE: criteria (Kriteria audit per project)
-- ============================================
CREATE TABLE criteria (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES audit_projects(id) ON DELETE CASCADE,
  criterion_id TEXT NOT NULL, -- e.g., '1.1.1'
  principle_id TEXT NOT NULL, -- e.g., 'P1'
  name TEXT NOT NULL,
  verification_method TEXT,
  assessment_standard TEXT,
  verifier JSONB, -- Array of strings
  requires_inspection BOOLEAN DEFAULT false,
  form_type TEXT CHECK (form_type IN ('file', 'text', 'file_and_text')),
  status TEXT NOT NULL CHECK (status IN ('Belum Ada Berkas', 'Menunggu Verifikasi', 'Revisi Diperlukan', 'Disetujui')),
  submitted_file_url TEXT,
  submitted_text TEXT,
  auditor_notes TEXT,
  assigned_auditor_id UUID REFERENCES auditors(id) ON DELETE SET NULL,
  inspection_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(project_id, criterion_id)
);

-- ============================================
-- TABLE: requests (Pengajuan sertifikasi)
-- ============================================
CREATE TABLE requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company TEXT NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABLE: audit_tasks (Tugas audit)
-- ============================================
CREATE TABLE audit_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auditor_id UUID REFERENCES auditors(id) ON DELETE SET NULL,
  company TEXT NOT NULL,
  parameter TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'rejected')),
  location_lat DECIMAL(10, 8),
  location_lng DECIMAL(11, 8),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- INDEXES untuk performa
-- ============================================
CREATE INDEX idx_audit_projects_user_id ON audit_projects(user_id);
CREATE INDEX idx_criteria_project_id ON criteria(project_id);
CREATE INDEX idx_criteria_assigned_auditor_id ON criteria(assigned_auditor_id);
CREATE INDEX idx_requests_user_id ON requests(user_id);
CREATE INDEX idx_audit_tasks_auditor_id ON audit_tasks(auditor_id);

-- ============================================
-- RLS (Row Level Security) Policies
-- ============================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE auditors ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE criteria ENABLE ROW LEVEL SECURITY;
ALTER TABLE requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_tasks ENABLE ROW LEVEL SECURITY;

-- Users can view their own data
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid()::text = id::text);

-- Users can update their own data
CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid()::text = id::text);

-- Auditors can view their own data
CREATE POLICY "Auditors can view own data" ON auditors
  FOR SELECT USING (auth.uid()::text = id::text);

-- Auditors can view assigned criteria
CREATE POLICY "Auditors can view assigned criteria" ON criteria
  FOR SELECT USING (assigned_auditor_id::text = auth.uid()::text);

-- Auditors can update assigned criteria
CREATE POLICY "Auditors can update assigned criteria" ON criteria
  FOR UPDATE USING (assigned_auditor_id::text = auth.uid()::text);

-- Users can view their own projects
CREATE POLICY "Users can view own projects" ON audit_projects
  FOR SELECT USING (user_id::text = auth.uid()::text);

-- Users can view their own criteria
CREATE POLICY "Users can view own criteria" ON criteria
  FOR SELECT USING (
    project_id IN (
      SELECT id FROM audit_projects WHERE user_id::text = auth.uid()::text
    )
  );

-- Users can update their own criteria (submit documents)
CREATE POLICY "Users can update own criteria" ON criteria
  FOR UPDATE USING (
    project_id IN (
      SELECT id FROM audit_projects WHERE user_id::text = auth.uid()::text
    )
  );

-- Admins have full access (implement based on custom claims or separate auth)
-- Note: Untuk admin, gunakan service role key atau custom claims

-- ============================================
-- TRIGGERS untuk updated_at
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_auditors_updated_at BEFORE UPDATE ON auditors
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admins_updated_at BEFORE UPDATE ON admins
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_audit_projects_updated_at BEFORE UPDATE ON audit_projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_criteria_updated_at BEFORE UPDATE ON criteria
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_requests_updated_at BEFORE UPDATE ON requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_audit_tasks_updated_at BEFORE UPDATE ON audit_tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
