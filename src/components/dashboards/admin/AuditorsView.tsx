"use client";

import React, { useState, useEffect } from 'react';
import { Auditor, AuditTask, AuditProject, User } from '@/types';
import { getAuditors, getAuditTasks, getAllAuditProjects, getAllCompanyUsersWithStatus, assignAuditorToProject } from '@/lib/api';
import { 
  MapPin, Briefcase, Plus, Users, Search, Filter, Loader2, CheckCircle, Clock, AlertCircle, 
  Building2, UserPlus, Target, Eye, Award, TrendingUp, Activity, User as UserIcon, X, Check,
  ChevronDown, ChevronRight, Square, CheckSquare, ArrowLeft
} from 'lucide-react';

type AuditorWithStats = Auditor & {
  activeTasks: number;
  completedTasks: number;
  assignedCriteria: number;
  currentProjects: string[];
};

type SelectedCriteria = {
  [projectId: string]: string[]; // projectId -> array of criteria IDs
};

const AuditorsView = () => {
  const [auditors, setAuditors] = useState<AuditorWithStats[]>([]);
  const [tasks, setTasks] = useState<AuditTask[]>([]);
  const [projects, setProjects] = useState<AuditProject[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [showProjectList, setShowProjectList] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [selectedCriteria, setSelectedCriteria] = useState<SelectedCriteria>({});
  const [currentAuditorId, setCurrentAuditorId] = useState<string | null>(null);
  const [isAssigning, setIsAssigning] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      const [auditorsData, tasksData, projectsData, usersData] = await Promise.all([
        getAuditors(),
        getAuditTasks(),
        getAllAuditProjects(),
        getAllCompanyUsersWithStatus()
      ]);

      // Calculate stats for each auditor
      const auditorsWithStats: AuditorWithStats[] = auditorsData.map(auditor => {
        const auditorTasks = tasksData.filter(task => task.auditorId === auditor.id);
        const activeTasks = auditorTasks.filter(task => task.status === 'pending').length;
        const completedTasks = auditorTasks.filter(task => task.status === 'approved').length;
        
        let assignedCriteria = 0;
        const currentProjects = new Set<string>();
        
        projectsData.forEach(project => {
          Object.values(project.principles).flat().forEach(criterion => {
            if (criterion.assignedAuditorId === auditor.id) {
              assignedCriteria++;
              currentProjects.add(project.companyName);
            }
          });
        });

        return {
          ...auditor,
          activeTasks,
          completedTasks,
          assignedCriteria,
          currentProjects: Array.from(currentProjects)
        };
      });

      setAuditors(auditorsWithStats);
      setTasks(tasksData);
      setProjects(projectsData);
      setUsers(usersData);
    } catch (error) {
      console.error('❌ Error loading auditor data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAssignment = async () => {
    if (!currentAuditorId || isAssigning) return;
    
    const totalSelected = Object.values(selectedCriteria).reduce((sum, criteria) => sum + criteria.length, 0);
    
    if (totalSelected === 0) {
      alert('Pilih minimal 1 criteria untuk di-assign!');
      return;
    }

    const auditor = auditors.find(a => a.id === currentAuditorId);
    if (!auditor) return;

    const confirmed = confirm(
      `Assign ${totalSelected} criteria ke ${auditor.name}?\n\n` +
      `Details:\n${Object.entries(selectedCriteria).map(([projectId, criteria]) => {
        const project = projects.find(p => p.projectId === projectId);
        return `• ${project?.companyName}: ${criteria.length} criteria`;
      }).join('\n')}`
    );

    if (!confirmed) return;

    setIsAssigning(true);
    
    try {
      let totalSuccess = 0;
      
      for (const [projectId, criteriaIds] of Object.entries(selectedCriteria)) {
        const project = projects.find(p => p.projectId === projectId);
        console.log(`🎯 Assigning ${criteriaIds.length} criteria from ${project?.companyName} to ${auditor.name}`);
        
        for (const criterionId of criteriaIds) {
          try {
            const success = await assignAuditorToProject(projectId, criterionId, currentAuditorId);
            if (success) {
              totalSuccess++;
              console.log(`✅ Assigned criterion ${criterionId}`);
            }
            await new Promise(resolve => setTimeout(resolve, 150));
          } catch (err) {
            console.error(`❌ Failed to assign criterion ${criterionId}:`, err);
          }
        }
      }

      if (totalSuccess > 0) {
        alert(`🎉 Berhasil assign ${totalSuccess} criteria ke ${auditor.name}!`);
        await loadData();
        closeAssignmentModal();
      } else {
        alert('❌ Gagal assign criteria ke auditor');
      }
    } catch (error) {
      console.error('❌ Error in assignment:', error);
      alert('❌ Terjadi kesalahan saat assign auditor');
    } finally {
      setIsAssigning(false);
    }
  };

  const toggleCriteriaSelection = (projectId: string, criterionId: string) => {
    setSelectedCriteria(prev => {
      const projectCriteria = prev[projectId] || [];
      const isSelected = projectCriteria.includes(criterionId);
      
      if (isSelected) {
        // Remove from selection
        const filtered = projectCriteria.filter(id => id !== criterionId);
        if (filtered.length === 0) {
          const { [projectId]: removed, ...rest } = prev;
          return rest;
        }
        return { ...prev, [projectId]: filtered };
      } else {
        // Add to selection
        return { ...prev, [projectId]: [...projectCriteria, criterionId] };
      }
    });
  };

  const selectAllCriteria = (projectId: string, criteriaIds: string[]) => {
    setSelectedCriteria(prev => ({
      ...prev,
      [projectId]: criteriaIds
    }));
  };

  const deselectAllCriteria = (projectId: string) => {
    setSelectedCriteria(prev => {
      const { [projectId]: removed, ...rest } = prev;
      return rest;
    });
  };

  const openAssignmentModal = (auditorId: string) => {
    setCurrentAuditorId(auditorId);
    setShowProjectList(auditorId);
    setSelectedCriteria({});
    setSelectedProject(null);
  };

  const closeAssignmentModal = () => {
    setShowProjectList(null);
    setCurrentAuditorId(null);
    setSelectedCriteria({});
    setSelectedProject(null);
  };

  const openProjectCriteria = (projectId: string) => {
    setSelectedProject(projectId);
  };

  const backToProjectList = () => {
    setSelectedProject(null);
  };

  const filteredAuditors = auditors.filter(auditor => {
    const matchesSearch = auditor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         auditor.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = !locationFilter || auditor.location.toLowerCase().includes(locationFilter.toLowerCase());
    return matchesSearch && matchesLocation;
  });

  const locations = [...new Set(auditors.map(a => a.location))];
  const availableProjects = projects.filter(p => p.status === 'Sedang Berlangsung');

  const getWorkloadColor = (assigned: number) => {
    if (assigned === 0) return 'bg-slate-500';
    if (assigned <= 5) return 'bg-green-600';
    if (assigned <= 10) return 'bg-yellow-600';
    return 'bg-red-600';
  };

  const getProjectUnassignedCriteria = (projectId: string) => {
    const project = projects.find(p => p.projectId === projectId);
    if (!project) return [];
    
    return Object.values(project.principles).flat().filter(
      criterion => !criterion.assignedAuditorId
    );
  };

  const getTotalSelectedCriteria = () => {
    return Object.values(selectedCriteria).reduce((sum, criteria) => sum + criteria.length, 0);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-slate-700 font-medium">Memuat data auditor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-100 rounded-xl p-6 border border-blue-200">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <UserIcon className="w-6 h-6 text-white" />
              </div>
              Manajemen Auditor & Assignment
            </h2>
            <p className="text-slate-700 mt-2">
              Klik "Assign To" → Pilih project → Checklist criteria ISPO → Submit assignment
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Auditor</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">{auditors.length}</p>
            </div>
            <Users className="w-8 h-8 text-slate-500" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Auditor Aktif</p>
              <p className="text-3xl font-bold text-blue-700 mt-1">
                {auditors.filter(a => a.assignedCriteria > 0).length}
              </p>
            </div>
            <Activity className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Assignment</p>
              <p className="text-3xl font-bold text-green-700 mt-1">
                {auditors.reduce((sum, a) => sum + a.assignedCriteria, 0)}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Available Auditor</p>
              <p className="text-3xl font-bold text-orange-700 mt-1">
                {auditors.filter(a => a.assignedCriteria === 0).length}
              </p>
            </div>
            <AlertCircle className="w-8 h-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Cari auditor berdasarkan nama atau email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-slate-900 placeholder-slate-500"
              />
            </div>
          </div>
          <div className="sm:w-48">
            <div className="relative">
              <Filter className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" />
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-slate-900"
              >
                <option value="">Semua Lokasi</option>
                {locations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Auditors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAuditors.map((auditor) => (
          <div key={auditor.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-lg transition-all duration-200">
            {/* Profile Section */}
            <div className="flex items-center space-x-4 mb-4">
              <div className="relative">
                <img 
                  src={auditor.avatarUrl} 
                  alt={auditor.name} 
                  className="w-16 h-16 rounded-full border-2 border-slate-200" 
                />
                <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center ${getWorkloadColor(auditor.assignedCriteria)}`}>
                  <span className="text-white text-xs font-bold">{auditor.assignedCriteria}</span>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg text-slate-900">{auditor.name}</h3>
                <p className="text-sm text-slate-600">{auditor.email}</p>
                <div className="flex items-center mt-1">
                  <MapPin className="w-3 h-3 mr-1 text-slate-500"/>
                  <span className="text-xs text-slate-600">{auditor.location}</span>
                </div>
              </div>
            </div>

            {/* Workload Stats */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-blue-50 p-3 rounded-lg text-center border border-blue-200">
                <p className="text-lg font-bold text-blue-700">{auditor.assignedCriteria}</p>
                <p className="text-xs text-blue-700 font-medium">Criteria</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg text-center border border-green-200">
                <p className="text-lg font-bold text-green-700">{auditor.currentProjects.length}</p>
                <p className="text-xs text-green-700 font-medium">Projects</p>
              </div>
            </div>

            {/* Current Projects */}
            {auditor.currentProjects.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-slate-800 mb-2">Current Projects:</h4>
                <div className="space-y-1">
                  {auditor.currentProjects.map((projectName, index) => (
                    <div key={index} className="bg-slate-100 p-2 rounded text-xs border border-slate-300 text-slate-800">
                      {projectName}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Workload Indicator */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-slate-600">Workload</span>
                <span className="text-xs text-slate-800">{auditor.assignedCriteria}/15</span>
              </div>
              <div className="w-full bg-slate-300 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full transition-all duration-500 ${getWorkloadColor(auditor.assignedCriteria)}`}
                  style={{ width: `${Math.min((auditor.assignedCriteria / 15) * 100, 100)}%` }}
                />
              </div>
            </div>

            {/* Assign Button */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  if (showProjectList === auditor.id) {
                    closeAssignmentModal();
                  } else {
                    openAssignmentModal(auditor.id);
                  }
                }}
                className="w-full bg-blue-600 text-white py-2.5 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center justify-center gap-2 disabled:bg-slate-500"
                disabled={auditor.assignedCriteria >= 15 || isAssigning}
              >
                <UserPlus className="w-4 h-4" />
                <span>{auditor.assignedCriteria >= 15 ? 'Workload Penuh' : 'Assign To'}</span>
                {showProjectList === auditor.id ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </button>

              {/* Assignment Interface */}
              {showProjectList === auditor.id && (
                <>
                  {/* Backdrop */}
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={closeAssignmentModal}
                  />
                  
                  {/* Assignment Panel */}
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-300 rounded-lg shadow-xl z-20 w-96">
                    <div className="p-4">
                      {/* Header */}
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="font-semibold text-slate-800">
                            Assign ke {auditor.name}
                          </h4>
                          <p className="text-xs text-slate-600">
                            {selectedProject ? 'Pilih criteria ISPO' : 'Pilih project terlebih dahulu'}
                          </p>
                        </div>
                        {getTotalSelectedCriteria() > 0 && (
                          <div className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
                            {getTotalSelectedCriteria()} selected
                          </div>
                        )}
                      </div>
                      
                      {/* Project List or Criteria List */}
                      {!selectedProject ? (
                        /* Project Selection */
                        <div className="space-y-2 max-h-80 overflow-y-auto mb-4">
                          <p className="text-sm font-medium text-slate-700 mb-3">Pilih Project:</p>
                          {availableProjects.map(project => {
                            const unassignedCriteria = getProjectUnassignedCriteria(project.projectId);
                            const unassignedCount = unassignedCriteria.length;
                            const projectSelected = selectedCriteria[project.projectId] || [];
                            
                            if (unassignedCount === 0) return null;
                            
                            return (
                              <button
                                key={project.projectId}
                                type="button"
                                onClick={() => openProjectCriteria(project.projectId)}
                                className="w-full text-left px-3 py-3 hover:bg-blue-50 rounded-lg transition-colors border border-slate-200 hover:border-blue-300"
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex-1">
                                    <p className="font-medium text-slate-900">{project.companyName}</p>
                                    <p className="text-xs text-slate-600 mt-1">{project.projectId}</p>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs bg-orange-200 text-orange-900 px-2 py-1 rounded-full font-medium">
                                      {unassignedCount} criteria
                                    </span>
                                    {projectSelected.length > 0 && (
                                      <span className="text-xs bg-green-200 text-green-900 px-2 py-1 rounded-full font-medium">
                                        {projectSelected.length} dipilih
                                      </span>
                                    )}
                                    <ChevronRight className="w-4 h-4 text-slate-500" />
                                  </div>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      ) : (
                        /* Criteria Selection */
                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-3">
                            <button
                              type="button"
                              onClick={backToProjectList}
                              className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
                            >
                              <ArrowLeft className="w-4 h-4" />
                              Back to Projects
                            </button>
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  const unassignedCriteria = getProjectUnassignedCriteria(selectedProject);
                                  selectAllCriteria(selectedProject, unassignedCriteria.map(c => c.id));
                                }}
                                className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                              >
                                Select All
                              </button>
                              <button
                                type="button"
                                onClick={() => deselectAllCriteria(selectedProject)}
                                className="text-xs bg-slate-500 text-white px-2 py-1 rounded hover:bg-slate-600"
                              >
                                Clear
                              </button>
                            </div>
                          </div>
                          
                          <div className="max-h-64 overflow-y-auto space-y-2">
                            {getProjectUnassignedCriteria(selectedProject).map((criterion, index) => {
                              const projectSelected = selectedCriteria[selectedProject] || [];
                              const isSelected = projectSelected.includes(criterion.id);
                              
                              return (
                                <div
                                  key={criterion.id}
                                  onClick={() => toggleCriteriaSelection(selectedProject, criterion.id)}
                                  className={`p-3 rounded border cursor-pointer transition-colors ${
                                    isSelected 
                                      ? 'bg-blue-50 border-blue-300' 
                                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                                  }`}
                                >
                                  <div className="flex items-start gap-3">
                                    <div className="flex-shrink-0 mt-0.5">
                                      {isSelected ? (
                                        <CheckSquare className="w-4 h-4 text-blue-600" />
                                      ) : (
                                        <Square className="w-4 h-4 text-slate-400" />
                                      )}
                                    </div>
                                    <div className="flex-1">
                                      <p className="text-xs font-medium text-slate-800 leading-tight">
                                        {index + 1}. {criterion.name}
                                      </p>
                                      <p className="text-xs text-slate-600 mt-1">
                                        ID: {criterion.id}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                      
                      {/* Submit Button */}
                      <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                        <div className="text-xs text-slate-600">
                          Total dipilih: <strong>{getTotalSelectedCriteria()} criteria</strong>
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={closeAssignmentModal}
                            className="px-3 py-2 text-xs bg-slate-500 text-white rounded hover:bg-slate-600 transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={handleSubmitAssignment}
                            disabled={getTotalSelectedCriteria() === 0 || isAssigning}
                            className="px-4 py-2 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-slate-400 transition-colors flex items-center gap-2"
                          >
                            {isAssigning ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <Check className="w-3 h-3" />
                            )}
                            Submit Assignment
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Loading Indicator */}
      {isAssigning && (
        <div className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-sm font-medium">Processing assignment...</span>
        </div>
      )}
    </div>
  );
};

export default AuditorsView;