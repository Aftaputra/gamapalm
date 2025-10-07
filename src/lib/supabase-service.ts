import { supabase } from './supabase';
import { User, Auditor, AuditProject, Criterion, RequestItem, AuditTask } from '@/types';

// ============================================
// Authentication Services
// ============================================

export const authService = {
  // Login untuk Admin
  async loginAdmin(email: string, password: string) {
    // Untuk demo: hardcoded admin check
    // Dalam production, gunakan Supabase Auth dengan custom claims
    if (email === "admin@ispo.com" && password === "admin") {
      return { success: true, role: 'admin' };
    }
    return { success: false, error: 'Invalid credentials' };
  },

  // Login untuk Auditor
  async loginAuditor(email: string, password: string) {
    const { data, error } = await supabase
      .from('auditors')
      .select('*')
      .eq('email', email.toLowerCase())
      .single();

    if (error || !data) {
      return { success: false, error: 'Invalid credentials' };
    }

    // Dalam production, gunakan Supabase Auth
    // Untuk demo, simpan data auditor
    return { 
      success: true, 
      role: 'auditor',
      auditor: data 
    };
  },

  // Login untuk User (Perusahaan)
  async loginUser(email: string, password: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase())
      .single();

    if (error || !data) {
      return { success: false, error: 'Invalid credentials' };
    }

    return { 
      success: true, 
      role: 'user',
      user: data 
    };
  },

  // Register User baru
  async registerUser(userData: {
    email: string;
    name: string;
    company: string;
    password: string;
  }) {
    const { data, error } = await supabase
      .from('users')
      .insert([{
        email: userData.email.toLowerCase(),
        name: userData.name,
        company: userData.company,
        avatar_url: `https://i.pravatar.cc/150?u=${userData.email}`
      }])
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, user: data };
  }
};

// ============================================
// User Services
// ============================================

export const userService = {
  // Get user by ID
  async getUserById(userId: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching user:', error);
      return null;
    }

    return data as User;
  },

  // Get all users
  async getAllUsers() {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching users:', error);
      return [];
    }

    return data as User[];
  }
};

// ============================================
// Auditor Services
// ============================================

export const auditorService = {
  // Get auditor by ID
  async getAuditorById(auditorId: string) {
    const { data, error } = await supabase
      .from('auditors')
      .select('*')
      .eq('id', auditorId)
      .single();

    if (error) {
      console.error('Error fetching auditor:', error);
      return null;
    }

    return data as Auditor;
  },

  // Get all auditors
  async getAllAuditors() {
    const { data, error } = await supabase
      .from('auditors')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching auditors:', error);
      return [];
    }

    return data as Auditor[];
  }
};

// ============================================
// Audit Project Services
// ============================================

export const projectService = {
  // Get all projects
  async getAllProjects() {
    const { data: projects, error: projectError } = await supabase
      .from('audit_projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (projectError) {
      console.error('Error fetching projects:', projectError);
      return [];
    }

    // Get all criteria for these projects
    const projectIds = projects.map(p => p.id);
    const { data: criteriaData, error: criteriaError } = await supabase
      .from('criteria')
      .select('*')
      .in('project_id', projectIds);

    if (criteriaError) {
      console.error('Error fetching criteria:', criteriaError);
    }

    // Organize criteria by principle and project
    const fullProjects: AuditProject[] = projects.map(project => {
      const projectCriteria = criteriaData?.filter(c => c.project_id === project.id) || [];
      
      return {
        projectId: project.project_id,
        companyName: project.company_name,
        status: project.status,
        deadline: project.deadline,
        location: {
          lat: parseFloat(project.location_lat) || 0,
          lng: parseFloat(project.location_lng) || 0
        },
        principles: {
          P1: projectCriteria.filter(c => c.principle_id === 'P1').map(mapCriterion),
          P2: projectCriteria.filter(c => c.principle_id === 'P2').map(mapCriterion),
          P3: projectCriteria.filter(c => c.principle_id === 'P3').map(mapCriterion),
          P4: projectCriteria.filter(c => c.principle_id === 'P4').map(mapCriterion),
          P5: projectCriteria.filter(c => c.principle_id === 'P5').map(mapCriterion),
          P6: projectCriteria.filter(c => c.principle_id === 'P6').map(mapCriterion),
          P7: projectCriteria.filter(c => c.principle_id === 'P7').map(mapCriterion),
        }
      };
    });

    return fullProjects;
  },

  // Get projects for a specific user
  async getProjectsByUserId(userId: string) {
    const { data: projects, error: projectError } = await supabase
      .from('audit_projects')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (projectError) {
      console.error('Error fetching user projects:', projectError);
      return [];
    }

    // Similar to getAllProjects, fetch criteria
    const projectIds = projects.map(p => p.id);
    const { data: criteriaData } = await supabase
      .from('criteria')
      .select('*')
      .in('project_id', projectIds);

    const fullProjects: AuditProject[] = projects.map(project => {
      const projectCriteria = criteriaData?.filter(c => c.project_id === project.id) || [];
      
      return {
        projectId: project.project_id,
        companyName: project.company_name,
        status: project.status,
        deadline: project.deadline,
        location: {
          lat: parseFloat(project.location_lat) || 0,
          lng: parseFloat(project.location_lng) || 0
        },
        principles: {
          P1: projectCriteria.filter(c => c.principle_id === 'P1').map(mapCriterion),
          P2: projectCriteria.filter(c => c.principle_id === 'P2').map(mapCriterion),
          P3: projectCriteria.filter(c => c.principle_id === 'P3').map(mapCriterion),
          P4: projectCriteria.filter(c => c.principle_id === 'P4').map(mapCriterion),
          P5: projectCriteria.filter(c => c.principle_id === 'P5').map(mapCriterion),
          P6: projectCriteria.filter(c => c.principle_id === 'P6').map(mapCriterion),
          P7: projectCriteria.filter(c => c.principle_id === 'P7').map(mapCriterion),
        }
      };
    });

    return fullProjects;
  },

  // Create new project
  async createProject(projectData: {
    projectId: string;
    companyName: string;
    userId: string;
    deadline: string;
    location: { lat: number; lng: number };
  }) {
    const { data, error } = await supabase
      .from('audit_projects')
      .insert([{
        project_id: projectData.projectId,
        company_name: projectData.companyName,
        user_id: projectData.userId,
        status: 'Sedang Berlangsung',
        deadline: projectData.deadline,
        location_lat: projectData.location.lat,
        location_lng: projectData.location.lng
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating project:', error);
      return { success: false, error: error.message };
    }

    return { success: true, project: data };
  }
};

// ============================================
// Criteria Services
// ============================================

export const criteriaService = {
  // Update criterion (submit file/text)
  async updateCriterion(
    projectId: string,
    criterionId: string,
    updates: {
      submittedFileUrl?: string | null;
      submittedText?: string | null;
      status?: string;
      auditorNotes?: string | null;
    }
  ) {
    // First get the database ID
    const { data: criterion } = await supabase
      .from('criteria')
      .select('id')
      .eq('project_id', projectId)
      .eq('criterion_id', criterionId)
      .single();

    if (!criterion) {
      return { success: false, error: 'Criterion not found' };
    }

    const { data, error } = await supabase
      .from('criteria')
      .update({
        submitted_file_url: updates.submittedFileUrl,
        submitted_text: updates.submittedText,
        status: updates.status,
        auditor_notes: updates.auditorNotes
      })
      .eq('id', criterion.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating criterion:', error);
      return { success: false, error: error.message };
    }

    return { success: true, criterion: data };
  },

  // Assign auditor to criterion
  async assignAuditor(projectId: string, criterionId: string, auditorId: string) {
    const { data: criterion } = await supabase
      .from('criteria')
      .select('id')
      .eq('project_id', projectId)
      .eq('criterion_id', criterionId)
      .single();

    if (!criterion) {
      return { success: false, error: 'Criterion not found' };
    }

    const { data, error } = await supabase
      .from('criteria')
      .update({ assigned_auditor_id: auditorId })
      .eq('id', criterion.id)
      .select()
      .single();

    if (error) {
      console.error('Error assigning auditor:', error);
      return { success: false, error: error.message };
    }

    return { success: true, criterion: data };
  },

  // Get criteria assigned to an auditor
  async getCriteriaByAuditor(auditorId: string) {
    const { data, error } = await supabase
      .from('criteria')
      .select('*, audit_projects(*)')
      .eq('assigned_auditor_id', auditorId);

    if (error) {
      console.error('Error fetching auditor criteria:', error);
      return [];
    }

    return data;
  },

  // Create criteria for a project
  async createCriteria(projectDbId: string, criteria: any[]) {
    const criteriaToInsert = criteria.map(c => ({
      project_id: projectDbId,
      criterion_id: c.id,
      principle_id: c.principleId,
      name: c.name,
      verification_method: c.verificationMethod,
      assessment_standard: c.assessmentStandard,
      verifier: c.verifier,
      requires_inspection: c.requiresInspection,
      form_type: c.formType,
      status: 'Belum Ada Berkas',
      assigned_auditor_id: c.assignedAuditorId || null
    }));

    const { data, error } = await supabase
      .from('criteria')
      .insert(criteriaToInsert)
      .select();

    if (error) {
      console.error('Error creating criteria:', error);
      return { success: false, error: error.message };
    }

    return { success: true, criteria: data };
  }
};

// ============================================
// Request Services
// ============================================

export const requestService = {
  // Get all requests
  async getAllRequests() {
    const { data, error } = await supabase
      .from('requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching requests:', error);
      return [];
    }

    return data as RequestItem[];
  },

  // Create new request
  async createRequest(company: string, userId: string) {
    const { data, error } = await supabase
      .from('requests')
      .insert([{
        company,
        user_id: userId,
        status: 'pending'
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating request:', error);
      return { success: false, error: error.message };
    }

    return { success: true, request: data };
  },

  // Update request status
  async updateRequestStatus(requestId: string, status: 'pending' | 'approved' | 'rejected') {
    const { data, error } = await supabase
      .from('requests')
      .update({ status })
      .eq('id', requestId)
      .select()
      .single();

    if (error) {
      console.error('Error updating request:', error);
      return { success: false, error: error.message };
    }

    return { success: true, request: data };
  }
};

// ============================================
// Audit Task Services
// ============================================

export const auditTaskService = {
  // Get all audit tasks
  async getAllTasks() {
    const { data, error } = await supabase
      .from('audit_tasks')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching audit tasks:', error);
      return [];
    }

    return data as AuditTask[];
  },

  // Get tasks for specific auditor
  async getTasksByAuditor(auditorId: string) {
    const { data, error } = await supabase
      .from('audit_tasks')
      .select('*')
      .eq('auditor_id', auditorId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching auditor tasks:', error);
      return [];
    }

    return data as AuditTask[];
  },

  // Assign task to auditor
  async assignTask(taskId: string, auditorId: string) {
    const { data, error } = await supabase
      .from('audit_tasks')
      .update({ auditor_id: auditorId })
      .eq('id', taskId)
      .select()
      .single();

    if (error) {
      console.error('Error assigning task:', error);
      return { success: false, error: error.message };
    }

    return { success: true, task: data };
  }
};

// ============================================
// Helper Functions
// ============================================

function mapCriterion(dbCriterion: any): Criterion {
  return {
    id: dbCriterion.criterion_id,
    name: dbCriterion.name,
    verificationMethod: dbCriterion.verification_method,
    assessmentStandard: dbCriterion.assessment_standard,
    verifier: dbCriterion.verifier || [],
    requiresInspection: dbCriterion.requires_inspection,
    formType: dbCriterion.form_type,
    status: dbCriterion.status,
    submittedFileUrl: dbCriterion.submitted_file_url,
    submittedText: dbCriterion.submitted_text,
    auditorNotes: dbCriterion.auditor_notes,
    assignedAuditorId: dbCriterion.assigned_auditor_id,
    inspectionDate: dbCriterion.inspection_date
  };
}
