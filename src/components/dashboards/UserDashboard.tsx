// GANTI SELURUH ISI FILE UserDashboard.tsx DENGAN KODE FINAL INI

"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { users, auditProjects as initialProjects, ISPO_PRINCIPLES } from "@/lib/mockdata";
import { User, AuditProject, Criterion } from "@/types";
import StatusBadge from "../StatusBadge";
import { 
    Upload, FileText, MessageCircleWarning, CheckCircle2, Clock, Dot, Loader2, BookCheck, 
    FolderOpen, MapPin, Calendar, ListChecks, ClipboardPen, ShieldCheck, Save, Award,
    Check,
    Copy,
    Download,
    ToggleRight,
    ToggleLeft
} from "lucide-react";

// Helper function untuk update state project secara immutable
const updateCriterionInProject = (project: AuditProject, criterionId: string, updates: Partial<Criterion>): AuditProject => {
    const newProject = JSON.parse(JSON.stringify(project));
    for (const key in newProject.principles) {
        const principleKey = key as keyof typeof newProject.principles;
        const criteria = newProject.principles[principleKey];
        const criterionIndex = criteria.findIndex((c: Criterion) => c.id === criterionId);
        if (criterionIndex > -1) {
            criteria[criterionIndex] = { ...criteria[criterionIndex], ...updates };
            return newProject;
        }
    }
    return newProject;
};

// =================================================================
// ==              SUB-KOMPONEN UI (FINAL)                        ==
// =================================================================

type CertificateDownloadButtonProps = {
  data: { cid: string; hash: string } | null;
};

const CertificateDownloadButton = ({ data }: CertificateDownloadButtonProps) => {
  const [cidCopied, setCidCopied] = useState(false);
  const [hashCopied, setHashCopied] = useState(false);

  const isComplete = data !== null;
  const ipfsGatewayUrl = isComplete ? `https://chocolate-changing-lemur-536.mypinata.cloud/ipfs/bafkreia6tr4tioorf3f3iaodqphk2jyglq3tbm4rofzujffe4o4qst2ycq` : '#';

  const handleCopy = (text: string, type: 'cid' | 'hash') => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    if (type === 'cid') {
      setCidCopied(true);
      setTimeout(() => setCidCopied(false), 2000);
    } else {
      setHashCopied(true);
      setTimeout(() => setHashCopied(false), 2000);
    }
  };

  return (
    <div className="mt-5 pt-5 border-t border-slate-200">
      <a
        href={ipfsGatewayUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => !isComplete && e.preventDefault()}
        className={`
          w-full flex items-center justify-center gap-3 text-base font-bold p-4 rounded-lg transition-all
          ${isComplete
            ? 'bg-green-600 text-white shadow-lg hover:bg-green-700 hover:shadow-xl transform hover:-translate-y-1'
            : 'bg-slate-200 text-slate-500 cursor-not-allowed'
          }
        `}
      >
        <Download className="w-6 h-6" />
        <span>{isComplete ? 'Unduh Sertifikat ISPO Anda' : 'Sertifikat Belum Tersedia'}</span>
      </a>

      {!isComplete && (
        <p className="text-xs text-slate-500 mt-2 text-center">
          Selesaikan 100% progres kepatuhan untuk dapat mengunduh sertifikat.
        </p>
      )}

      {isComplete && (
        <div className="mt-4 space-y-3">
          <div className="flex items-center gap-2 p-2 bg-slate-100 rounded-md border">
            <code className="text-sm text-slate-600 truncate flex-grow">CID: {data.cid}</code>
            <button onClick={() => handleCopy(data.cid, 'cid')} className="p-1.5 rounded-md hover:bg-slate-200">
              {cidCopied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4 text-slate-600" />}
            </button>
          </div>
          <div className="flex items-center gap-2 p-2 bg-slate-100 rounded-md border">
            <code className="text-sm text-slate-600 truncate flex-grow">Hash: {data.hash}</code>
            <button onClick={() => handleCopy(data.hash, 'hash')} className="p-1.5 rounded-md hover:bg-slate-200">
              {hashCopied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4 text-slate-600" />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const Header = ({ user, project }: { user: User; project: AuditProject }) => {
    const allCriteria = Object.values(project.principles).flat();
    const completedCriteria = allCriteria.filter(c => c.status === 'Disetujui').length;
    const progressPercentage = allCriteria.length > 0 ? (completedCriteria / allCriteria.length) * 100 : 0;
    const isAuditComplete = progressPercentage === 100;

    // State untuk toggle tetap sama
    const [isCertificateReady, setIsCertificateReady] = useState(false);

    const dummyCertificateData = {
        cid: 'QmXv8a3Zf8n7E4gY2R9wZ5pK1aC3b4dF6eG8H7j9K0L1M2',
        hash: '0xabc123def456ghi789jkl012mno345pqr678stu901vwx234yz567abc890def12'
    };

    return (
        <div>
          <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Dashboard Kepatuhan ISPO</h1>
              <p className="text-slate-600 mt-1">Selamat datang, <strong>{user.name}</strong> dari <strong>{user.company}</strong>.</p>
            </div>
              <a href="/ndvi-upload" className="flex-shrink-0 flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg text-white bg-slate-700 hover:bg-slate-900 transition-colors shadow-sm">
                <Upload className="w-4 h-4"/> Unggah Citra Multispektral
              </a>
          </div>

          <div className="mt-6 bg-white p-5 rounded-xl shadow-sm border">
            {/* ✨ POINT 1: Strukturnya diubah dikit biar icon bisa di kanan */}
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-semibold text-slate-700">Progres Kepatuhan</h3>
                <div className="flex items-center gap-3">
                    <span className={`text-sm font-bold ${isAuditComplete ? 'text-green-600' : 'text-blue-600'}`}>{Math.round(progressPercentage)}%</span>
                    
                    {/* ✨ POINT 2: Ini toggle barunya, cuma icon button kecil */}
                    <button 
                        onClick={() => setIsCertificateReady(!isCertificateReady)}
                        title="Simulasi Status Sertifikat" // Tooltip buat pas presentasi
                        className="text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        {isCertificateReady 
                            ? <ToggleRight className="w-5 h-5 text-green-600" /> 
                            : <ToggleLeft className="w-5 h-5" />
                        }
                    </button>
                </div>
            </div>

            <div className="w-full bg-slate-200 rounded-full h-3">
                <div className={`h-3 rounded-full transition-all duration-500 ${isAuditComplete ? 'bg-green-500' : 'bg-blue-600'}`} style={{ width: `${progressPercentage}%` }}></div>
            </div>

            <CertificateDownloadButton 
                data={isCertificateReady ? dummyCertificateData : null} 
            />
          </div>
        </div>
    );
};


const AuditorFeedbackCard = ({ notes }: { notes: string }) => (
    <div className="mt-4 bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-lg">
        <div className="flex items-start">
            <MessageCircleWarning className="h-5 w-5 text-amber-500 mr-3 flex-shrink-0 mt-1" />
            <div>
                <h4 className="font-bold text-sm text-amber-800">Feedback dari Auditor</h4>
                <p className="text-sm text-amber-700 mt-1 italic">"{notes}"</p>
            </div>
        </div>
    </div>
);

const InspectionInfoCard = ({ date }: { date: string }) => (
    <div className="mt-4 bg-indigo-50 border-l-4 border-indigo-400 p-4 rounded-r-lg">
        <div className="flex items-start">
            <Calendar className="h-5 w-5 text-indigo-500 mr-3 flex-shrink-0 mt-1" />
            <div>
                <h4 className="font-bold text-sm text-indigo-800">Inspeksi Lapangan Terjadwal</h4>
                <p className="text-sm text-indigo-700 mt-1 font-semibold">{new Date(date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
        </div>
    </div>
);


const FormInputArea = ({ 
    criterion, onFileUpload, onTextChange, onSaveText,
}: { 
    criterion: Criterion; 
    onFileUpload: (id: string) => void;
    onTextChange: (id: string, text: string) => void;
    onSaveText: (id: string) => void;
}) => {
    const hasFileInput = criterion.formType === 'file' || criterion.formType === 'file_and_text';
    const hasTextInput = criterion.formType === 'text' || criterion.formType === 'file_and_text';

    return (
        <div className="bg-slate-50 p-4 rounded-b-lg space-y-4">
            {hasTextInput && (
                <div>
                    <label className="text-sm font-semibold text-slate-700">
                        {criterion.formType === 'file_and_text' ? 'Deskripsi / Pernyataan Tambahan' : 'Penjelasan'}
                    </label>
                    <textarea
                        value={criterion.submittedText || ''}
                        onChange={(e) => onTextChange(criterion.id, e.target.value)}
                        className="mt-1 w-full border-2 border-slate-300 rounded-lg p-3 h-28 text-slate-800 focus:border-blue-500 focus:ring-blue-500 transition"
                        placeholder="Jelaskan secara rinci sesuai parameter yang diminta..."
                    />
                </div>
            )}
            <div className="flex items-center justify-end gap-3">
                 {hasTextInput && (
                    <button 
                        onClick={() => onSaveText(criterion.id)}
                        className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm"
                    >
                        <Save className="w-4 h-4" /> Simpan Teks
                    </button>
                 )}
                 {hasFileInput && (
                    <button 
                        onClick={() => onFileUpload(criterion.id)} 
                        className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg text-white bg-slate-700 hover:bg-slate-800 transition-colors shadow-sm"
                    >
                        <Upload className="w-4 h-4" /> 
                        <span>{criterion.submittedFileUrl ? 'Unggah Ulang Berkas' : 'Unggah Berkas'}</span>
                    </button>
                 )}
            </div>
        </div>
    );
};


const CriterionCard = ({ criterion, onFileUpload, onTextChange, onSaveText }: { 
    criterion: Criterion; 
    onFileUpload: (id: string) => void;
    onTextChange: (id: string, text: string) => void;
    onSaveText: (id: string) => void;
}) => {
    const statusIcons = {
        'Disetujui': <CheckCircle2 className="w-5 h-5 text-green-500" />,
        'Menunggu Verifikasi': <Clock className="w-5 h-5 text-blue-500" />,
        'Revisi Diperlukan': <MessageCircleWarning className="w-5 h-5 text-amber-500" />,
        'Belum Ada Berkas': <FolderOpen className="w-5 h-5 text-slate-400" />,
    };

    return (
        <div className="bg-white border border-slate-200 rounded-lg transition-all hover:shadow-lg hover:border-blue-300">
            <div className="p-5">
                <div className="flex justify-between items-start">
                    <div className="flex items-start gap-4 flex-grow">
                        <div className="flex-shrink-0 mt-1">{statusIcons[criterion.status]}</div>
                        <p className="font-semibold text-slate-800">{criterion.name}</p>
                    </div>
                    <div className="flex items-center gap-4 flex-shrink-0 ml-4">
                        <StatusBadge status={criterion.status}/>
                    </div>
                </div>
                <div className="pt-4 mt-4 border-t border-slate-200 space-y-3 pl-9">
                    <div>
                        <h5 className="flex items-center gap-2 text-xs font-bold text-slate-600 mb-2"><ListChecks className="w-4 h-4 text-slate-400"/>VERIFIER</h5>
                        <ul className="list-disc pl-5 space-y-1">
                            {criterion.verifier.map((item, index) => <li key={index} className="text-sm text-slate-700">{item}</li>)}
                        </ul>
                    </div>
                     {criterion.submittedFileUrl && (
                        <div>
                            <h5 className="flex items-center gap-2 text-xs font-bold text-slate-600 mb-2"><FileText className="w-4 h-4 text-slate-400"/>BERKAS TERUNGGAH</h5>
                            <a href={criterion.submittedFileUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                                dummy-doc.pdf
                            </a>
                        </div>
                     )}
                </div>
            </div>
            {criterion.status !== 'Disetujui' && (
                <FormInputArea 
                    criterion={criterion} 
                    onFileUpload={onFileUpload}
                    onTextChange={onTextChange}
                    onSaveText={onSaveText}
                />
            )}
        </div>
    );
};


// =================================================================
// ==                 KOMPONEN UTAMA DASHBOARD                    ==
// =================================================================
export default function UserDashboard() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [project, setProject] = useState<AuditProject | null>(null);
  const [activePrincipleId, setActivePrincipleId] = useState<string>(ISPO_PRINCIPLES[0].id);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [criterionToUpdate, setCriterionToUpdate] = useState<string | null>(null);

  useEffect(() => {
    const loggedInUserId = localStorage.getItem("userId");
    if (loggedInUserId) {
      const foundUser = users.find(user => user.id === loggedInUserId);
      if (foundUser) {
        setCurrentUser(foundUser);
        const userProject = initialProjects.find(p => p.companyName === foundUser.company);
        setProject(userProject || null);
      }
    }
  }, []);

  const handleFileUploadRequest = (criterionId: string) => {
    setCriterionToUpdate(criterionId);
    fileInputRef.current?.click();
  };
  
  const handleFileSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0] && criterionToUpdate && project) {
        const updates: Partial<Criterion> = {
            status: 'Menunggu Verifikasi',
            submittedFileUrl: `/files/${event.target.files[0].name}`
        };
        const newProject = updateCriterionInProject(project, criterionToUpdate, updates);
        setProject(newProject);
        setCriterionToUpdate(null);
    }
  };

  const handleTextChange = (criterionId: string, text: string) => {
    if (!project) return;
    const updates: Partial<Criterion> = { submittedText: text };
    const newProject = updateCriterionInProject(project, criterionId, updates);
    setProject(newProject);
  };
  
  const handleSaveText = (criterionId: string) => {
      if (!project) return;
      const updates: Partial<Criterion> = { status: 'Menunggu Verifikasi' };
      const newProject = updateCriterionInProject(project, criterionId, updates);
      setProject(newProject);
      alert(`Perubahan teks untuk kriteria ${criterionId} telah disimpan dan menunggu verifikasi.`);
  };

  const principleStatuses = useMemo(() => {
    if (!project) return {};
    const statuses: { [key: string]: 'completed' | 'in_progress' | 'not_started' } = {};
    ISPO_PRINCIPLES.forEach(principle => {
      const projectCriteria = project.principles[principle.id as keyof typeof project.principles] || [];
      const totalCriteriaCount = principle.criteria.length;

      if (totalCriteriaCount === 0) {
        statuses[principle.id] = 'not_started'; return;
      }
      if (projectCriteria.length > 0 && projectCriteria.every(c => c.status === 'Disetujui')) {
        statuses[principle.id] = 'completed'; return;
      }
      if (projectCriteria.some(c => c.status !== 'Belum Ada Berkas')) {
        statuses[principle.id] = 'in_progress';
      } else {
        statuses[principle.id] = 'not_started';
      }
    });
    return statuses;
  }, [project]);

  if (!currentUser || !project) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-slate-100">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
        <p className="mt-4 text-slate-600 font-semibold">Memuat Dashboard Anda...</p>
      </div>
    );
  }

  const activePrinciple = ISPO_PRINCIPLES.find(p => p.id === activePrincipleId);
  const projectCriteria = project.principles[activePrincipleId as keyof typeof project.principles] || [];

  return (
    <div className="bg-slate-100 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-screen-xl mx-auto">
        <Header user={currentUser} project={project} />
        <div className="flex flex-col lg:flex-row mt-8 gap-8">
          <aside className="w-full lg:w-1/4">
            <div className="bg-white p-4 rounded-xl shadow-lg">
              <h3 className="font-bold text-slate-800 px-2 mb-2">Prinsip ISPO</h3>
              <nav className="space-y-1">
                {ISPO_PRINCIPLES.map((principle, index) => {
                  const status = principleStatuses[principle.id];
                  const isInactive = index > 2; 

                  return (
                    <button 
                      key={principle.id} 
                      onClick={() => !isInactive && setActivePrincipleId(principle.id)}
                      disabled={isInactive}
                      className={`w-full text-left p-3 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center justify-between ${
                        activePrincipleId === principle.id 
                        ? 'bg-blue-600 text-white shadow-md' 
                        : 'hover:bg-slate-100 text-slate-700'
                      } ${isInactive ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <span>{principle.name}</span>
                      {status === 'completed' && <CheckCircle2 className="w-5 h-5 text-green-400"/>}
                      {status === 'in_progress' && <Clock className="w-5 h-5 text-yellow-400"/>}
                      {status === 'not_started' && !isInactive && <Dot className="w-5 h-5 text-slate-400"/>}
                    </button>
                  );
                })}
              </nav>
            </div>
          </aside>
          <main className="w-full lg:w-3/4">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h2 className="text-2xl font-bold text-slate-900 mb-1 flex items-center gap-3"><BookCheck className="w-6 h-6 text-blue-500"/> {activePrinciple?.name}</h2>
              <p className="text-slate-500 mb-6">Penuhi semua kriteria di bawah ini untuk melanjutkan.</p>
              <div className="space-y-5">
                {projectCriteria.length > 0 ? projectCriteria.map(criterion => (
                  <div key={criterion.id}>
                    <CriterionCard 
                        criterion={criterion} 
                        onFileUpload={handleFileUploadRequest}
                        onTextChange={handleTextChange}
                        onSaveText={handleSaveText}
                    />
                    {criterion.status === 'Revisi Diperlukan' && criterion.auditorNotes && <AuditorFeedbackCard notes={criterion.auditorNotes} />}
                    {criterion.inspectionDate && <InspectionInfoCard date={criterion.inspectionDate} />}
                  </div>
                )) : <p className="text-center text-slate-500 py-8">Kriteria untuk prinsip ini belum tersedia.</p>}
              </div>
            </div>
          </main>
        </div>
      </div>
      <input type="file" ref={fileInputRef} onChange={handleFileSelected} style={{ display: 'none' }} />
    </div>
  );
}