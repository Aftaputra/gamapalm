// GANTI SELURUH ISI FILE AuditorDashboard.tsx DENGAN KODE FINAL INI

"use client";

import React, { useState, useEffect, Fragment } from "react";
import { auditors as mockAuditors, auditProjects as initialProjects, ISPO_PRINCIPLES } from "@/lib/mockdata";
import { Auditor, AuditProject, Criterion } from "@/types";
import { projectService, auditorService, criteriaService } from "@/lib/supabase-service";
import StatusBadge from "../StatusBadge";
import { 
    FileText, MessageSquare, CheckSquare, X, Calendar, Building, ListChecks, 
    ClipboardList, MessageCircle, Info, Paperclip, PlayCircle, Flag
} from "lucide-react";


// --- Bagian Header & Sidebar ---

const Header = ({ currentUser }: { currentUser: Auditor }) => (
    <div>
        <h1 className="text-3xl font-bold text-slate-900">Auditor Workspace</h1>
        <p className="text-slate-600 mt-1">Selamat datang, <strong>{currentUser.name}</strong>. Pilih proyek audit untuk memulai.</p>
    </div>
);

const ProjectSidebar = ({ projects, activeProjectId, setActiveProjectId }: {
    projects: { project: AuditProject, criteria: Criterion[] }[];
    activeProjectId: string | null;
    setActiveProjectId: (id: string) => void;
}) => {
    const activeProject = projects.find(p => p.project.projectId === activeProjectId);
    
    return (
        <aside className="w-full lg:w-1/3 xl:w-1/4">
            <div className="bg-white p-4 rounded-xl shadow-lg h-full flex flex-col">
                <h3 className="font-bold text-slate-800 px-2 mb-3 text-lg">Proyek Audit Anda</h3>
                <nav className="space-y-3">
                    {projects.map(({ project }) => (
                        <button
                            key={project.projectId}
                            onClick={() => setActiveProjectId(project.projectId)}
                            className={`w-full text-left p-4 rounded-xl transition-all duration-200 ${
                                activeProjectId === project.projectId 
                                ? 'bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-400 shadow-md' 
                                : 'bg-slate-50 border-2 border-slate-200 hover:border-blue-300 hover:shadow-md'
                            }`}
                        >
                            <div className="flex items-start justify-between mb-2">
                                <div className="flex-1">
                                    <p className="font-bold text-slate-900 mb-1">{project.companyName}</p>
                                    <p className="text-xs text-slate-500 font-mono">{project.projectId}</p>
                                </div>
                                <Building className={`w-5 h-5 ${activeProjectId === project.projectId ? 'text-blue-600' : 'text-slate-400'}`}/>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-600 mt-2">
                                <Calendar className="w-3 h-3"/>
                                <span>{new Date(project.deadline).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                            </div>
                        </button>
                    ))}
                </nav>
                
                {/* NDVI Summary Section - Only show for active project */}
                {activeProject && (
                    <>
                        <div className="mt-4 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl p-3">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="bg-gradient-to-br from-green-600 to-emerald-700 p-1.5 rounded-lg">
                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-xs font-bold text-green-900">ANALISIS NDVI - {activeProject.project.companyName}</h4>
                                </div>
                                <span className="text-xs bg-green-200 text-green-800 px-2 py-0.5 rounded-full font-semibold">Satelit</span>
                            </div>
                            <div className="space-y-2">
                                <div className="bg-white rounded-lg p-2.5">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-xs font-semibold text-slate-600">Indeks Vegetasi</span>
                                        <span className="text-sm font-bold text-green-700">0.75</span>
                                    </div>
                                    <div className="w-full bg-slate-200 rounded-full h-2">
                                        <div className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full" style={{width: '75%'}}></div>
                                    </div>
                                    <p className="text-xs text-slate-500 mt-1">Status: <span className="font-semibold text-green-700">Sehat & Produktif</span></p>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                    <div className="bg-white rounded-lg p-2">
                                        <p className="text-slate-500">Luas Area</p>
                                        <p className="font-bold text-slate-800">2,450 ha</p>
                                    </div>
                                    <div className="bg-white rounded-lg p-2">
                                        <p className="text-slate-500">Tutupan Hijau</p>
                                        <p className="font-bold text-green-700">94.2%</p>
                                    </div>
                                </div>
                                <p className="text-xs text-slate-500 italic mt-1">*Data dari Sentinel-2 (simulasi)</p>
                            </div>
                        </div>
                        
                        <button className="mt-3 w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold py-2.5 px-4 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                            </svg>
                            Lihat Peta Geospasial
                        </button>
                    </>
                )}
            </div>
        </aside>
    );
};

// --- Komponen untuk kartu tugas auditor ---

const CriterionCard = ({ criterion, project, onFeedback, onApprove }: { 
    criterion: Criterion; 
    project: AuditProject; 
    onFeedback: (c: Criterion, p: AuditProject) => void; 
    onApprove: (pid: string, cid: string) => void;
}) => {
    const principle = ISPO_PRINCIPLES.find(p => p.id === `P${criterion.id.split('.')[0]}`);
    const hasEvidence = criterion.submittedFileUrl || criterion.submittedText;
    const dummyFiles = [`Dokumen_${criterion.id}_Utama.pdf`, `Lampiran_${criterion.id}_A.docx`];
    
    // AI Summary untuk dokumen (gimmick untuk OCR & RAG yang akan datang)
    const aiSummary = `Dokumen menunjukkan bahwa ${project.companyName} telah memenuhi sebagian persyaratan untuk kriteria ${criterion.id}. Berdasarkan analisis dokumen, terdapat bukti implementasi ${principle?.name || 'prinsip terkait'} dalam operasional perusahaan. Namun perlu verifikasi lebih lanjut pada bagian dokumentasi legalitas dan prosedur operasional standar.`;

    return (
        <div className="bg-white border border-slate-200 rounded-lg transition-all hover:shadow-lg hover:border-blue-300">
            <div className="p-4 border-b border-slate-200">
                <div className="flex justify-between items-start gap-4">
                    <div>
                        <p className="text-xs font-semibold text-blue-700 bg-blue-100 px-2 py-1 rounded-full inline-block mb-2">{principle?.name || 'Prinsip Umum'}</p>
                        <h4 className="font-semibold text-slate-800">{criterion.name}</h4>
                    </div>
                    <StatusBadge status={criterion.status} />
                </div>
            </div>

            <div className="p-4 space-y-4">
                <div>
                    <h5 className="flex items-center gap-2 text-xs font-bold text-slate-600 mb-2"><ClipboardList className="w-4 h-4 text-slate-400"/>VERIFIER YANG PERLU DICEK</h5>
                    <ul className="list-disc pl-5 space-y-1">
                        {criterion.verifier.map((item, index) => (<li key={index} className="text-sm text-slate-700">{item}</li>))}
                    </ul>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg">
                    <h5 className="text-xs font-bold text-slate-600 mb-2">BUKTI DARI USER</h5>
                    {!hasEvidence ? (
                        <div className="flex items-center gap-3 text-slate-500 text-sm p-3">
                           <Info className="w-5 h-5 flex-shrink-0" /> 
                           <span>User belum mengirimkan bukti untuk kriteria ini.</span>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {criterion.submittedText && (
                                <div>
                                    <h6 className="text-xs font-semibold text-slate-500 mb-1">Catatan/Pernyataan User:</h6>
                                    <div className="flex items-start gap-3">
                                        <MessageCircle className="w-5 h-5 text-slate-400 flex-shrink-0 mt-1" />
                                        <p className="text-sm text-slate-800 italic bg-white p-2 rounded border w-full">"{criterion.submittedText}"</p>
                                    </div>
                                </div>
                            )}
                            {criterion.submittedFileUrl && (
                                <div>
                                    <h6 className="text-xs font-semibold text-slate-500 mb-2">Berkas Terunggah:</h6>
                                    <ul className="space-y-2">
                                        {dummyFiles.map(file => (
                                            <li key={file} className="flex items-center">
                                                <a href={criterion.submittedFileUrl!} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:underline">
                                                    <Paperclip className="w-4 h-4"/> {file}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            
                            {/* AI Summary Section */}
                            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-lg p-4 mt-3">
                                <div className="flex items-start gap-3">
                                    <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-2 rounded-lg">
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                        </svg>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <h6 className="text-xs font-bold text-purple-900">RINGKASAN AI</h6>
                                            <span className="text-xs bg-purple-200 text-purple-800 px-2 py-0.5 rounded-full font-semibold">Beta</span>
                                        </div>
                                        <p className="text-sm text-slate-700 leading-relaxed">{aiSummary}</p>
                                        <p className="text-xs text-slate-500 mt-2 italic">*Fitur OCR & RAG dalam pengembangan - ringkasan ini adalah simulasi</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            
            <div className="bg-slate-100 p-3 flex justify-end items-center space-x-2 rounded-b-lg">
                <button 
                    onClick={() => onFeedback(criterion, project)} 
                    className="flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-lg text-amber-800 bg-amber-100 hover:bg-amber-200 transition-colors"
                >
                    <MessageSquare className="w-4 h-4" /> Beri Feedback
                </button>
                <button 
                    onClick={() => onApprove(project.projectId, criterion.id)} 
                    className="flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-lg text-green-800 bg-green-100 hover:bg-green-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!hasEvidence || criterion.status === 'Disetujui'}
                >
                    <CheckSquare className="w-4 h-4" /> Setujui
                </button>
            </div>
        </div>
    );
};


// --- Komponen utama untuk dashboard auditor ---
export default function AuditorDashboard() {
    const [currentUser, setCurrentUser] = useState<Auditor | null>(null);
    const [projects, setProjects] = useState<AuditProject[]>(initialProjects);
    const [myAssignments, setMyAssignments] = useState<{ project: AuditProject, criteria: Criterion[] }[]>([]);
    const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCriterion, setSelectedCriterion] = useState<Criterion | null>(null);
    const [currentProject, setCurrentProject] = useState<AuditProject | null>(null);
    const [feedbackText, setFeedbackText] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    // Load auditor data from Supabase
    useEffect(() => {
        const loadAuditor = async () => {
            const loggedInAuditorId = localStorage.getItem("auditorId");
            if (loggedInAuditorId) {
                const foundUser = await auditorService.getAuditorById(loggedInAuditorId);
                if (foundUser) {
                    setCurrentUser(foundUser);
                } else {
                    // Fallback to mock data
                    const mockUser = mockAuditors.find(auditor => auditor.id === loggedInAuditorId);
                    setCurrentUser(mockUser || null);
                }
            }
        };
        loadAuditor();
    }, []);

    // Load projects from Supabase
    useEffect(() => {
        const loadProjects = async () => {
            if (!currentUser) return;
            
            setIsLoading(true);
            try {
                const allProjects = await projectService.getAllProjects();
                if (allProjects.length > 0) {
                    setProjects(allProjects);
                }
            } catch (error) {
                console.error('Error loading projects:', error);
                // Fallback to mock data
            } finally {
                setIsLoading(false);
            }
        };
        
        if (currentUser) {
            loadProjects();
        }
    }, [currentUser]);

    useEffect(() => {
        if (currentUser) {
            const assignments = projects.map(project => {
                const criteriaForAuditor = Object.values(project.principles).flat().filter(
                    criterion => criterion.assignedAuditorId === currentUser.id
                );
                return { project, criteria: criteriaForAuditor };
            }).filter(assignment => assignment.criteria.length > 0);

            setMyAssignments(assignments);
            if (assignments.length > 0 && !activeProjectId) {
                setActiveProjectId(assignments[0].project.projectId);
            }
        }
    }, [currentUser, projects, activeProjectId]);

    const handleUpdateStatus = async (projectId: string, criterionId: string, newStatus: Criterion['status'], notes: string | null = null) => {
        // Update in Supabase
        const result = await criteriaService.updateCriterion(projectId, criterionId, {
            status: newStatus,
            auditorNotes: notes
        });

        if (result.success) {
            // Update local state
            setProjects(currentProjects =>
                currentProjects.map(project => {
                    if (project.projectId !== projectId) return project;
                    const updatedPrinciples: AuditProject['principles'] = { ...project.principles };
                    for (const key in updatedPrinciples) {
                        const pKey = key as keyof typeof updatedPrinciples;
                        updatedPrinciples[pKey] = updatedPrinciples[pKey].map(c => 
                            c.id === criterionId 
                            ? { ...c, status: newStatus, auditorNotes: notes !== null ? notes : c.auditorNotes } 
                            : c
                        );
                    }
                    return { ...project, principles: updatedPrinciples };
                })
            );
        }
    };

    const openFeedbackModal = (criterion: Criterion, project: AuditProject) => {
        setSelectedCriterion(criterion);
        setCurrentProject(project);
        setFeedbackText(criterion.auditorNotes || "");
        setIsModalOpen(true);
    };
    
    const submitFeedback = () => {
        if (selectedCriterion && currentProject) {
            handleUpdateStatus(currentProject.projectId, selectedCriterion.id, "Revisi Diperlukan", feedbackText);
        }
        setIsModalOpen(false);
    };
    
    const handleApprove = (projectId: string, criterionId: string) => {
        if(confirm("Anda yakin ingin menyetujui kriteria ini?")){
            handleUpdateStatus(projectId, criterionId, "Disetujui", "Telah diverifikasi dan disetujui.");
        }
    };

    const activeProjectData = myAssignments.find(a => a.project.projectId === activeProjectId);

    const renderProjectDetails = () => {
        if (!activeProjectData) {
            return (
                <div className="bg-white p-10 rounded-xl shadow-lg text-center text-slate-500">
                    <p className="font-semibold">Pilih proyek dari sidebar untuk melihat detail tugas.</p>
                </div>
            );
        }

        const deadline = new Date(activeProjectData.project.deadline);
        const startDate = new Date(deadline);
        startDate.setMonth(startDate.getMonth() - 3);

        return (
            <div className="bg-white p-6 rounded-xl shadow-lg space-y-6">
                <div className="pb-4 border-b border-slate-200">
                    <p className="text-sm text-slate-500">Proyek Aktif</p>
                    <h2 className="text-2xl font-bold text-slate-900 flex items-center mb-3">
                        <Building className="w-6 h-6 mr-3 text-slate-400"/>{activeProjectData.project.companyName}
                    </h2>
                    <div className="flex items-center gap-6 text-sm">
                        <div className="flex items-center text-gray-600">
                            <PlayCircle className="w-4 h-4 mr-2 text-green-500"/>
                            <strong>Mulai:</strong><span className="ml-1">{startDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                        </div>
                        <div className="flex items-center text-red-600">
                            <Flag className="w-4 h-4 mr-2"/>
                            <strong>Deadline:</strong><span className="ml-1 font-semibold">{deadline.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                        </div>
                    </div>
                </div>
                <div>
                    <h3 className="font-semibold text-slate-800 flex items-center mb-4"><ListChecks className="w-5 h-5 mr-3 text-slate-400"/>Tugas Penilaian Anda</h3>
                    <div className="space-y-4">
                        {activeProjectData.criteria.map(criterion => (
                            <CriterionCard 
                                key={criterion.id} 
                                criterion={criterion} 
                                project={activeProjectData.project} 
                                onFeedback={openFeedbackModal} 
                                onApprove={handleApprove} 
                            />
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    if (!currentUser) { return <div className="p-10 text-center">Memuat data...</div>; }

    return (
        <Fragment>
            <div className="bg-slate-100 min-h-screen p-4 sm:p-6 lg:p-8">
                <div className="max-w-screen-xl mx-auto space-y-8">
                    <Header currentUser={currentUser} />
                    <div className="flex flex-col lg:flex-row gap-8">
                        <ProjectSidebar projects={myAssignments} activeProjectId={activeProjectId} setActiveProjectId={setActiveProjectId} />
                        <main className="w-full lg:w-2/3 xl:w-3/4">
                            {renderProjectDetails()}
                        </main>
                    </div>
                </div>
            </div>
            {isModalOpen && selectedCriterion && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
                    <div className="bg-white rounded-lg p-6 w-full max-w-lg space-y-4 shadow-2xl">
                        <div className="flex justify-between items-center"><h3 className="font-bold text-lg text-slate-800">Feedback untuk: {selectedCriterion.name}</h3><button onClick={() => setIsModalOpen(false)}><X className="w-5 h-5 text-gray-500"/></button></div>
                        <div>
                            <label className="text-sm font-semibold text-slate-900">Catatan Revisi:</label>
                            <textarea value={feedbackText} onChange={(e) => setFeedbackText(e.target.value)} className="mt-1 w-full border-2 border-gray-300 rounded-lg p-3 h-32 text-slate-800" placeholder="Contoh: Mohon lampirkan dokumen SIUP yang terbaru."/>
                        </div>
                        <div className="flex justify-end gap-3">
                            <button onClick={() => setIsModalOpen(false)} className="bg-slate-100 text-slate-800 font-bold py-2 px-4 rounded-lg hover:bg-slate-200">Batal</button>
                            <button onClick={submitFeedback} className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700">Kirim Feedback</button>
                        </div>
                    </div>
                </div>
            )}
        </Fragment>
    );
}