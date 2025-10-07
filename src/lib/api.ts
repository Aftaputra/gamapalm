import { supabase } from './supabase';
import {
  Principle,
  CriterionTemplate,
  AuditProject,
  Criterion,
  Auditor,
  User,
  RequestItem,
  AuditTask,
  FormType,
  CriterionStatus,
} from '@/types';

// Helpers: normalisasi nilai dari DB ke union type aplikasi
function toFormType(v: unknown): FormType {
  return v === 'file' || v === 'text' || v === 'file_and_text' ? v : 'file';
}

function toCriterionStatus(v: unknown): CriterionStatus {
  switch (v) {
    case 'Belum Ada Berkas':
    case 'Menunggu Verifikasi':
    case 'Revisi Diperlukan':
    case 'Disetujui':
      return v;
    default:
      return 'Belum Ada Berkas';
  }
}

function toAuditTaskStatus(v: unknown): AuditTask['status'] {
  return v === 'pending' || v === 'approved' || v === 'rejected' ? v : 'pending';
}

function toAuditProjectStatus(v: unknown): AuditProject['status'] {
  return v === 'Sedang Berlangsung' || v === 'Selesai' ? v : 'Sedang Berlangsung';
}

// === LOGIN & AUTH ===
// Catatan: untuk produksi, gunakan Supabase Auth. Ini contoh sederhana berdasarkan tabel users.
export async function login(email: string, password: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .eq('password', password)
    .single();

  if (error || !data) return null;

  if (data.role === 'auditor') {
    return {
      id: String(data.id),
      email: data.email ?? '',
      name: data.name ?? '',
      avatarUrl: data.avatar_url ?? '',
      location: data.location ?? '',
      role: 'auditor' as const,
    };
  } else if (data.role === 'company') {
    return {
      id: String(data.id),
      email: data.email ?? '',
      name: data.name ?? '',
      avatarUrl: data.avatar_url ?? '',
      company: data.company ?? '',
      role: 'company' as const,
    };
  } else if (data.role === 'admin') {
    return {
      id: String(data.id),
      email: data.email ?? '',
      name: data.name ?? '',
      role: 'admin' as const,
    };
  }

  return null;
}

// === REGISTER USER (SIGNUP) ===
export type Role = 'company' | 'auditor' | 'admin';
export async function registerUser(input: {
  name: string;
  email: string;
  password: string;
  role: Role;
  company?: string;
  location?: string;
  avatarUrl?: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const email = input.email.trim().toLowerCase();

    // Cek email sudah dipakai
    const { data: existing, error: existErr } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .limit(1);

    if (existErr) {
      return { success: false, error: `Gagal memeriksa email: ${existErr.message}` };
    }
    if (existing && existing.length > 0) {
      return { success: false, error: 'Email sudah terdaftar.' };
    }

    const payload: Record<string, any> = {
      name: input.name,
      email,
      password: input.password, // DEMO: plain text. PRODUKSI: gunakan hash dan Supabase Auth
      role: input.role,
      avatar_url: input.avatarUrl ?? null,
      company: input.role === 'company' ? input.company ?? null : null,
      location: input.role === 'auditor' ? input.location ?? null : null,
      created_at: new Date().toISOString(),
    };

    const { error: insertErr } = await supabase.from('users').insert(payload);
    if (insertErr) {
      return { success: false, error: `Gagal mendaftar: ${insertErr.message}` };
    }

    return { success: true };
  } catch (e: any) {
    return { success: false, error: e?.message ?? 'Terjadi kesalahan tak terduga.' };
  }
}

// === GET PRINCIPLES & CRITERIA ===
export async function getAllPrinciples(): Promise<Principle[]> {
  const { data: principlesData, error: principlesError } = await supabase
    .from('principles')
    .select('*')
    .order('id', { ascending: true });

  if (principlesError) {
    throw new Error(`Error fetching principles: ${principlesError.message}`);
  }

  const principlesWithCriteria = await Promise.all(
    (principlesData ?? []).map(async (principle: any) => {
      const { data: criteriaData, error: criteriaError } = await supabase
        .from('criterion_templates')
        .select('*')
        .eq('principle_id', principle.id)
        .order('id', { ascending: true });

      if (criteriaError) {
        throw new Error(`Error fetching criteria for ${principle.id}: ${criteriaError.message}`);
      }

      const criteriaWithVerifiers: CriterionTemplate[] = await Promise.all(
        (criteriaData ?? []).map(async (criterion: any) => {
          const { data: verifiersData, error: verifiersError } = await supabase
            .from('criterion_verifiers')
            .select('verifier_text')
            .eq('criterion_id', criterion.id);

          if (verifiersError) {
            throw new Error(`Error fetching verifiers: ${verifiersError.message}`);
          }

          return {
            id: String(criterion.id),
            name: criterion.name ?? '',
            verificationMethod: criterion.verification_method ?? '',
            assessmentStandard: criterion.assessment_standard ?? '',
            requiresInspection: Boolean(criterion.requires_inspection),
            formType: toFormType(criterion.form_type),
            verifier: (verifiersData ?? []).map((v: any) => v.verifier_text ?? '').filter(Boolean),
          } as CriterionTemplate;
        })
      );

      return {
        id: String(principle.id),
        name: principle.name ?? '',
        criteria: criteriaWithVerifiers,
      } as Principle;
    })
  );

  return principlesWithCriteria;
}

// === GET USERS & AUDITORS ===
export async function getAuditors(): Promise<Auditor[]> {
  const { data, error } = await supabase.from('users').select('*').eq('role', 'auditor');

  if (error) throw new Error(`Error fetching auditors: ${error.message}`);

  return (data ?? []).map((auditor: any): Auditor => ({
    id: String(auditor.id),
    name: auditor.name ?? '',
    avatarUrl: auditor.avatar_url ?? '',
    email: auditor.email ?? '',
    password: auditor.password ?? '', // Catatan: jangan ekspose password di produksi
    location: auditor.location ?? '',
  }));
}

export async function getCompanyUsers(): Promise<User[]> {
  const { data, error } = await supabase.from('users').select('*').eq('role', 'company');

  if (error) throw new Error(`Error fetching company users: ${error.message}`);

  return (data ?? []).map((user: any): User => ({
    id: String(user.id),
    name: user.name ?? '',
    avatarUrl: user.avatar_url ?? '',
    email: user.email ?? '',
    password: user.password ?? '', // Catatan: jangan ekspose password di produksi
    company: user.company ?? '',
  }));
}

// === GET AUDIT PROJECTS ===
export async function getAuditProjects(): Promise<AuditProject[]> {
  const { data: projectsData, error: projectsError } = await supabase.from('audit_projects').select('*');

  if (projectsError) throw new Error(`Error fetching projects: ${projectsError.message}`);

  const projectsWithCriteria: AuditProject[] = await Promise.all(
    (projectsData ?? []).map(async (project: any) => {
      const principles: AuditProject['principles'] = {
        P1: [],
        P2: [],
        P3: [],
        P4: [],
        P5: [],
        P6: [],
        P7: [],
      };

      const { data: auditCriteriaData, error: auditCriteriaError } = await supabase
        .from('audit_criteria')
        .select(
          `
          *,
          criterion_template:criterion_template_id(
            id, name, principle_id, verification_method, assessment_standard,
            requires_inspection, form_type
          )
        `
        )
        .eq('project_id', project.project_id);

      if (auditCriteriaError) throw new Error(`Error fetching audit criteria: ${auditCriteriaError.message}`);

      for (const auditCriterion of auditCriteriaData ?? []) {
        const template = auditCriterion.criterion_template;
        if (!template) continue;

        const { data: verifiersData, error: verifiersError } = await supabase
          .from('criterion_verifiers')
          .select('verifier_text')
          .eq('criterion_id', template.id);

        if (verifiersError) throw new Error(`Error fetching verifiers: ${verifiersError.message}`);

        const criterion: Criterion = {
          id: String(template.id),
          name: template.name ?? '',
          verificationMethod: template.verification_method ?? '',
          assessmentStandard: template.assessment_standard ?? '',
          requiresInspection: Boolean(template.requires_inspection),
          formType: toFormType(template.form_type),
          verifier: (verifiersData ?? []).map((v: any) => v.verifier_text ?? '').filter(Boolean),
          status: toCriterionStatus(auditCriterion.status),
          submittedFileUrl: auditCriterion.submitted_file_url ?? null,
          submittedText: auditCriterion.submitted_text ?? null,
          auditorNotes: auditCriterion.auditor_notes ?? null,
          assignedAuditorId: auditCriterion.assigned_auditor_id ?? null,
          inspectionDate: auditCriterion.inspection_date ?? undefined,
        };

        const principleId = template.principle_id as keyof AuditProject['principles'];
        if (principles[principleId]) {
          principles[principleId].push(criterion);
        }
      }

      return {
        projectId: String(project.project_id),
        companyName: project.company_name ?? '',
        status: toAuditProjectStatus(project.status),
        deadline: project.deadline ?? '',
        principles,
        location: {
          lat: Number(project.location_lat ?? 0),
          lng: Number(project.location_lng ?? 0),
        },
      } as AuditProject;
    })
  );

  return projectsWithCriteria;
}

export async function getAuditProject(projectId: string): Promise<AuditProject | null> {
  const projects = await getAuditProjects();
  return projects.find((p) => p.projectId === projectId) ?? null;
}

export async function getAuditProjectByCompany(companyName: string): Promise<AuditProject | null> {
  const projects = await getAuditProjects();
  return projects.find((p) => p.companyName === companyName) ?? null;
}

// === GET AUDIT TASKS & REQUESTS ===
export async function getAuditTasks(): Promise<AuditTask[]> {
  const { data, error } = await supabase.from('audit_tasks').select('*');

  if (error) throw new Error(`Error fetching audit tasks: ${error.message}`);

  return (data ?? []).map((task: any): AuditTask => ({
    id: Number(task.id),
    auditorId: task.auditor_id ?? null,
    company: task.company ?? '',
    parameter: task.parameter ?? '',
    status: toAuditTaskStatus(task.status),
    // location optional — isi kalau kamu punya kolom lat/lng di tabel audit_tasks
    // location: task.location_lat && task.location_lng ? { lat: Number(task.location_lat), lng: Number(task.location_lng) } : undefined,
  }));
}

export async function getRequests(): Promise<RequestItem[]> {
  const { data, error } = await supabase.from('requests').select('*');

  if (error) throw new Error(`Error fetching requests: ${error.message}`);

  return (data ?? []).map((request: any): RequestItem => ({
    id: Number(request.id),
    company: request.company ?? '',
    status: (request.status as RequestItem['status']) ?? 'pending',
  }));
}

// === UPDATE FUNCTIONS ===
export async function updateAuditCriterion(
  projectId: string,
  criterionId: string,
  updates: {
    status?: CriterionStatus;
    submittedFileUrl?: string | null;
    submittedText?: string | null;
    auditorNotes?: string | null;
  }
): Promise<boolean> {
  const payload: Record<string, any> = {
    updated_at: new Date().toISOString(),
  };

  if (typeof updates.status !== 'undefined') payload.status = updates.status;
  if (typeof updates.submittedFileUrl !== 'undefined') payload.submitted_file_url = updates.submittedFileUrl;
  if (typeof updates.submittedText !== 'undefined') payload.submitted_text = updates.submittedText;
  if (typeof updates.auditorNotes !== 'undefined') payload.auditor_notes = updates.auditorNotes;

  const { error } = await supabase
    .from('audit_criteria')
    .update(payload)
    .eq('project_id', projectId)
    .eq('criterion_template_id', `${criterionId}`);

  return !error;
}

// === FILE UPLOAD FUNCTION ===
export async function uploadFile(file: File, path: string): Promise<string | null> {
  const safeName = file.name.replace(/\s+/g, '_');
  const fileName = `${Date.now()}_${safeName}`;
  const filePath = `${path}/${fileName}`;

  const { error } = await supabase.storage.from('audit-files').upload(filePath, file, {
    contentType: file.type || undefined,
    upsert: false,
  });

  if (error) {
    console.error('Error uploading file:', error);
    return null;
  }

  const { data } = supabase.storage.from('audit-files').getPublicUrl(filePath);
  return data?.publicUrl ?? null;
}