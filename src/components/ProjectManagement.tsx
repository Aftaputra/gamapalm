"use client";

import React, { useState, useEffect } from 'react';
import { AuditProject, Auditor } from '@/types';
import { getAllAuditProjects, getAuditors, assignAuditorToProject } from '@/lib/api';
import { 
  Building2, Calendar, MapPin, Users, Loader2, Award, CheckCircle, 
  TrendingUp, Clock, FileText, ArrowUpRight 
} from 'lucide-react';

const ProjectManagement = () => {
  const [projects, setProjects] = useState<AuditProject[]>([]);
  const [auditors, setAuditors] = useState<Auditor[]>([]);
  const [loading, setLoading] = useState(true);
  const [assigningCriterion, setAssigningCriterion] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [projectsData, auditorsData] = await Promise.all([
        getAllAuditProjects(),
        getAuditors()
      ]);
      setProjects(projectsData);
      setAuditors(auditorsData);
    } catch (error) {
      console.error('Error loading project data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignAuditor = async (projectId: string, criterionId: string, auditorId: string) => {
    setAssigningCriterion(criterionId);
    try {
      const success = await assignAuditorToProject(projectId, criterionId, auditorId);
      if (success) {
        alert('Auditor berhasil ditugaskan!');
        await loadData();
      } else {
        alert('Gagal menugaskan auditor');
      }
    } catch (error) {
      alert('Terjadi kesalahan');
    } finally {
      setAssigningCriterion(null);
    }
  };

  const calculateProjectProgress = (project: AuditProject) => {
    const allCriteria = Object.values(project.principles).flat();
    const totalCriteria = allCriteria.length;
    const approvedCriteria = allCriteria.filter(c => c.status === 'Disetujui').length;
    const submittedCriteria = allCriteria.filter(c => 
      c.status === 'Menunggu Verifikasi' || c.status === 'Disetujui'
    ).length;
    
    const completionPercentage = totalCriteria > 0 ? (approvedCriteria / totalCriteria) * 100 : 0;
    const submissionPercentage = totalCriteria > 0 ? (submittedCriteria / totalCriteria) * 100 : 0;
    
    return {
      totalCriteria,
      approvedCriteria,
      submittedCriteria,
      completionPercentage: Math.round(completionPercentage),
      submissionPercentage: Math.round(submissionPercentage),
      isComplete: completionPercentage === 100
    };
  };

  const handleIssueCertificate = (project: AuditProject) => {
    const progress = calculateProjectProgress(project);
    
    if (!progress.isComplete) {
      alert('Sertifikat hanya dapat diterbitkan setelah semua criteria disetujui (100%)');
      return;
    }

    const confirmed = confirm(
      `Terbitkan sertifikat ISPO untuk ${project.companyName}?\n\n` +
      `Progress: ${progress.completionPercentage}% (${progress.approvedCriteria}/${progress.totalCriteria} criteria disetujui)\n\n` +
      `Sertifikat akan diterbitkan dan dapat diunduh oleh perusahaan.`
    );

    if (confirmed) {
      // Redirect ke halaman certificate dengan project ID
      window.open(`/cert?projectId=${project.projectId}&company=${encodeURIComponent(project.companyName)}`, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-800">Manajemen Proyek Audit</h2>
        <p className="text-sm text-slate-700 mt-1">Kelola proyek audit, tugaskan auditor, dan terbitkan sertifikat.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {projects.map((project) => {
          const progress = calculateProjectProgress(project);
          
          return (
            <div key={project.projectId} className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-blue-500" />
                    {project.companyName}
                  </h3>
                  <p className="text-sm text-slate-600">ID: {project.projectId}</p>
                </div>
                {/* FIXED: Better contrast for status badges */}
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  project.status === 'Sedang Berlangsung' 
                    ? 'bg-blue-600 text-white border border-blue-700' 
                    : 'bg-green-600 text-white border border-green-700'
                }`}>
                  {project.status}
                </span>
              </div>

              <div className="space-y-2 text-sm text-slate-700 mb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Deadline: {new Date(project.deadline).toLocaleDateString('id-ID')}
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Lokasi: {project.location.lat}, {project.location.lng}
                </div>
              </div>

              {/* Progress Section */}
              <div className="bg-slate-50 p-4 rounded-lg mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-slate-800 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Progress Audit
                  </h4>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-slate-700">
                      {progress.submittedCriteria}/{progress.totalCriteria} submitted
                    </span>
                    <span className={`text-lg font-bold ${
                      progress.isComplete ? 'text-green-600' : 'text-blue-600'
                    }`}>
                      {progress.completionPercentage}%
                    </span>
                  </div>
                </div>
                
                <div className="w-full bg-slate-200 rounded-full h-3 mb-2">
                  <div 
                    className={`h-3 rounded-full transition-all duration-500 ${
                      progress.isComplete ? 'bg-green-500' : 'bg-blue-600'
                    }`}
                    style={{ width: `${progress.completionPercentage}%` }}
                  />
                </div>
                
                <div className="flex justify-between text-xs text-slate-600">
                  <span>{progress.approvedCriteria} criteria disetujui</span>
                  <span>{progress.totalCriteria - progress.approvedCriteria} belum disetujui</span>
                </div>

                {/* Certificate Button */}
                {progress.isComplete && (
                  <div className="mt-3 pt-3 border-t border-slate-200">
                    <button
                      onClick={() => handleIssueCertificate(project)}
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-2.5 px-4 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2 font-medium"
                    >
                      <Award className="w-5 h-5" />
                      Terbitkan Sertifikat ISPO
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
                
                {!progress.isComplete && (
                  <div className="mt-3 pt-3 border-t border-slate-200">
                    <div className="text-xs text-slate-700 text-center bg-slate-200 py-2 px-3 rounded-lg border border-slate-300">
                      <Clock className="w-4 h-4 inline mr-1" />
                      Sertifikat akan tersedia setelah semua criteria disetujui (100%)
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium text-slate-800 mb-3 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Kriteria & Assignment Auditor
                </h4>
                
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {Object.entries(project.principles).map(([principleId, criteria]) => 
                    criteria.map((criterion) => (
                      <div key={criterion.id} className="bg-slate-50 p-3 rounded-lg">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="text-sm font-medium text-slate-800">{criterion.name}</p>
                              {criterion.status === 'Disetujui' && (
                                <CheckCircle className="w-4 h-4 text-green-500" />
                              )}
                              {criterion.status === 'Menunggu Verifikasi' && (
                                <Clock className="w-4 h-4 text-blue-500" />
                              )}
                              {criterion.submittedFileUrl && (
                                <FileText className="w-4 h-4 text-slate-500" />
                              )}
                            </div>
                            <p className="text-xs text-slate-600">Prinsip {principleId}</p>
                            <div className="mt-1">
                              {/* FIXED: Better contrast for criterion status badges */}
                              <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                                criterion.status === 'Disetujui' ? 'bg-green-600 text-white' :
                                criterion.status === 'Menunggu Verifikasi' ? 'bg-blue-600 text-white' :
                                criterion.status === 'Revisi Diperlukan' ? 'bg-orange-600 text-white' :
                                'bg-slate-600 text-white'
                              }`}>
                                {criterion.status}
                              </span>
                            </div>
                            {criterion.assignedAuditorId && (
                              <p className="text-xs text-green-700 mt-1 font-medium">
                                ✓ Assigned to: {auditors.find(a => a.id === criterion.assignedAuditorId)?.name}
                              </p>
                            )}
                          </div>
                          
                          {!criterion.assignedAuditorId && (
                            <select
                              onChange={(e) => e.target.value && handleAssignAuditor(project.projectId, criterion.id, e.target.value)}
                              disabled={assigningCriterion === criterion.id}
                              className="text-xs px-2 py-1 border border-slate-300 rounded text-slate-800 bg-white"
                            >
                              <option value="">Pilih Auditor</option>
                              {auditors.map((auditor) => (
                                <option key={auditor.id} value={auditor.id}>
                                  {auditor.name}
                                </option>
                              ))}
                            </select>
                          )}
                          
                          {assigningCriterion === criterion.id && (
                            <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {projects.length === 0 && (
        <div className="text-center py-8">
          <p className="text-slate-600">Belum ada proyek audit yang dibuat.</p>
        </div>
      )}
    </div>
  );
};

export default ProjectManagement;