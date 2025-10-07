"use client";

import React, { useState, useEffect } from 'react';
import { User, AuditProject, Auditor } from '@/types';
import { getAllCompanyUsersWithStatus, createAuditProjectForUser, getAuditors, getAllAuditProjects } from '@/lib/api';
import { Building2, Calendar, MapPin, Users, Loader2, CheckCircle, Clock, XCircle, UserCheck, Plus, Activity, AlertCircle } from 'lucide-react';

type UserWithStatus = User & { 
  hasProject: boolean; 
  projectId?: string; 
  projectStatus?: string;
};

const UserManagement = () => {
  const [users, setUsers] = useState<UserWithStatus[]>([]);
  const [projects, setProjects] = useState<AuditProject[]>([]);
  const [auditors, setAuditors] = useState<Auditor[]>([]);
  const [loading, setLoading] = useState(true);
  const [creatingProject, setCreatingProject] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [usersData, projectsData, auditorsData] = await Promise.all([
        getAllCompanyUsersWithStatus(),
        getAllAuditProjects(),
        getAuditors()
      ]);
      setUsers(usersData);
      setProjects(projectsData);
      setAuditors(auditorsData);
    } catch (error) {
      console.error('Error loading user management data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (userId: string, companyName: string) => {
    setCreatingProject(userId);
    try {
      const success = await createAuditProjectForUser(userId, companyName);
      if (success) {
        alert(`Audit project berhasil dibuat untuk ${companyName}! User sekarang bisa login dan mulai upload dokumen.`);
        await loadData();
      } else {
        alert('Gagal membuat audit project');
      }
    } catch (error) {
      alert('Terjadi kesalahan');
    } finally {
      setCreatingProject(null);
    }
  };

  const getStatusBadge = (user: UserWithStatus) => {
    if (user.hasProject && user.projectStatus === 'Sedang Berlangsung') {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          <Activity className="w-3 h-3 mr-1" />
          Audit Berlangsung
        </span>
      );
    } else if (user.hasProject && user.projectStatus === 'Selesai') {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3 mr-1" />
          Audit Selesai
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
          <AlertCircle className="w-3 h-3 mr-1" />
          Menunggu Approval
        </span>
      );
    }
  };

  const getUserProject = (companyName: string) => {
    return projects.find(project => project.companyName === companyName);
  };

  const getAssignedAuditors = (project: AuditProject) => {
    const assignedAuditorIds = new Set<string>();
    Object.values(project.principles).flat().forEach(criterion => {
      if (criterion.assignedAuditorId) {
        assignedAuditorIds.add(criterion.assignedAuditorId);
      }
    });
    
    return Array.from(assignedAuditorIds).map(id => 
      auditors.find(auditor => auditor.id === id)
    ).filter(Boolean);
  };

  const getProjectProgress = (project: AuditProject) => {
    const allCriteria = Object.values(project.principles).flat();
    const completedCriteria = allCriteria.filter(c => c.status === 'Disetujui').length;
    const totalCriteria = allCriteria.length;
    
    return totalCriteria > 0 ? Math.round((completedCriteria / totalCriteria) * 100) : 0;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  const stats = {
    total: users.length,
    withProject: users.filter(u => u.hasProject).length,
    needingApproval: users.filter(u => !u.hasProject).length,
    completed: users.filter(u => u.projectStatus === 'Selesai').length
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-800">Manajemen User & Project Audit</h2>
        <p className="text-sm text-slate-500 mt-1">Kelola user perusahaan dan approve mereka untuk memulai audit ISPO.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Total User</p>
              <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
            </div>
            <Users className="w-8 h-8 text-slate-400" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Project Aktif</p>
              <p className="text-2xl font-bold text-blue-600">{stats.withProject}</p>
            </div>
            <Activity className="w-8 h-8 text-blue-400" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Menunggu Approval</p>
              <p className="text-2xl font-bold text-orange-600">{stats.needingApproval}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-orange-400" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Audit Selesai</p>
              <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-2">Daftar User Perusahaan</h3>
          <p className="text-sm text-slate-500">
            Klik "Create Project" untuk memulai audit ISPO bagi perusahaan yang belum memiliki project.
          </p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-500">
            <thead className="bg-slate-50 text-xs text-slate-700 uppercase">
              <tr>
                <th scope="col" className="px-6 py-3">User Info</th>
                <th scope="col" className="px-6 py-3">Company</th>
                <th scope="col" className="px-6 py-3">Status</th>
                <th scope="col" className="px-6 py-3">Project Progress</th>
                <th scope="col" className="px-6 py-3">Assigned Auditors</th>
                <th scope="col" className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                const userProject = getUserProject(user.company);
                const assignedAuditors = userProject ? getAssignedAuditors(userProject) : [];
                const progress = userProject ? getProjectProgress(userProject) : 0;
                
                return (
                  <tr key={user.id} className="bg-white border-t hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <img 
                          className="w-10 h-10 rounded-full" 
                          src={user.avatarUrl || `https://i.pravatar.cc/150?u=${user.email}`} 
                          alt={user.name} 
                        />
                        <div>
                          <p className="font-medium text-slate-900">{user.name}</p>
                          <p className="text-xs text-slate-500">{user.email}</p>
                          <p className="text-xs text-slate-400">ID: {user.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-900">{user.company}</p>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(user)}
                    </td>
                    <td className="px-6 py-4">
                      {userProject ? (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-slate-900">
                              {userProject.projectId}
                            </span>
                            <span className="text-xs text-slate-600">{progress}%</span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <p className="text-xs text-slate-500">
                            Deadline: {new Date(userProject.deadline).toLocaleDateString('id-ID')}
                          </p>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400">Belum ada project</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {assignedAuditors.length > 0 ? (
                        <div className="space-y-1">
                          {assignedAuditors.slice(0, 2).map((auditor, index) => (
                            <div key={auditor?.id || index} className="flex items-center space-x-2">
                              <img 
                                className="w-6 h-6 rounded-full" 
                                src={auditor?.avatarUrl || `https://i.pravatar.cc/150?u=${auditor?.email}`} 
                                alt={auditor?.name} 
                              />
                              <span className="text-xs text-slate-600">{auditor?.name}</span>
                            </div>
                          ))}
                          {assignedAuditors.length > 2 && (
                            <p className="text-xs text-slate-400">
                              +{assignedAuditors.length - 2} lainnya
                            </p>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400">Belum ada auditor</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {!user.hasProject ? (
                        <button
                          onClick={() => handleCreateProject(user.id, user.company)}
                          disabled={creatingProject === user.id}
                          className="inline-flex items-center gap-2 text-sm font-medium px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm disabled:opacity-50"
                        >
                          {creatingProject === user.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <CheckCircle className="w-4 h-4" />
                          )}
                          Approve Audit
                        </button>
                      ) : (
                        <div className="flex flex-col items-end space-y-1">
                          <span className="text-xs text-green-600 font-medium">✓ Project Aktif</span>
                          {progress === 100 && (
                            <span className="text-xs text-blue-600 font-medium">🎉 Siap Sertifikat</span>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {users.length === 0 && (
        <div className="text-center py-8">
          <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <p className="text-slate-500">Belum ada user perusahaan yang terdaftar.</p>
        </div>
      )}
    </div>
  );
};

export default UserManagement;