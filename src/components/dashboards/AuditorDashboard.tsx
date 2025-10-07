"use client";

import React, { useState, useEffect, Fragment } from "react";
import { 
    getAuditors, 
    getAuditProjects, 
    updateAuditCriterion, 
    getAllPrinciples 
} from "@/lib/api";
import { Auditor, AuditProject, Criterion, Principle } from "@/types";
import StatusBadge from "../StatusBadge";
import { 
    FileText, MessageSquare, CheckSquare, X, Calendar, Building, ListChecks, 
    ClipboardList, MessageCircle, Info, Paperclip, PlayCircle, Flag, Download,
    Eye, ExternalLink, FileIcon, Clock, CheckCircle, AlertTriangle, User,
    Brain, Satellite, Zap, MapPin, BarChart3, TrendingUp, Sparkles, AlertCircle
} from "lucide-react";

// --- Header & Sidebar Components ---
const Header = ({ currentUser }: { currentUser: Auditor }) => (
    <div>
        <h1 className="text-3xl font-bold text-slate-900">Auditor Workspace</h1>
        <p className="text-slate-600 mt-1">
            Selamat datang, <strong>{currentUser.name}</strong>. 
            Review dan verifikasi dokumen yang telah diupload perusahaan dengan bantuan AI analysis.
        </p>
    </div>
);

// --- AI Analysis Component ---
const AIAnalysisPanel = ({ criterion, project }: { criterion: Criterion; project: AuditProject }) => {
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [showAnalysis, setShowAnalysis] = useState(false);

    const triggerAnalysis = () => {
        setIsAnalyzing(true);
        // Simulate AI processing
        setTimeout(() => {
            setIsAnalyzing(false);
            setShowAnalysis(true);
        }, 2000);
    };

    const demoAnalysisResult = {
        confidence: 85,
        compliance: "Partial Compliance",
        summary: "Dokumen telah dianalisis menggunakan OCR dan Natural Language Processing. Ditemukan informasi relevan mengenai sertifikasi lahan, namun beberapa detail teknis perlu verifikasi lebih lanjut.",
        keyFindings: [
            "✅ Sertifikat lahan tercantum dengan jelas",
            "⚠️ Tanggal ekspirasi perlu diverifikasi",
            "❌ Stempel resmi tidak terdeteksi dengan jelas",
            "✅ Nomor registrasi sesuai dengan format standar"
        ],
        recommendations: [
            "Minta perusahaan untuk memperjelas kualitas stempel",
            "Verifikasi tanggal ekspirasi dengan database resmi",
            "Konfirmasi nomor registrasi dengan instansi terkait"
        ],
        extractedData: {
            "Nama Perusahaan": project.companyName,
            "Nomor Sertifikat": "ISPO-2024-001234",
            "Tanggal Terbit": "15 Maret 2024",
            "Masa Berlaku": "15 Maret 2027",
            "Luas Lahan": "2,450 hektar"
        }
    };

    return (
        <div className="bg-gradient-to-br from-purple-50 to-indigo-100 border-2 border-purple-200 rounded-lg p-4 mt-4">
            <div className="flex items-center justify-between mb-3">
                <h6 className="text-sm font-bold text-purple-800 flex items-center gap-2">
                    <Brain className="w-4 h-4" />
                    AI Document Analysis
                    <span className="bg-orange-200 text-orange-800 text-xs px-2 py-0.5 rounded-full font-medium">
                        DEMO
                    </span>
                </h6>
                {!showAnalysis && (
                    <button
                        onClick={triggerAnalysis}
                        disabled={isAnalyzing || !criterion.submittedFileUrl}
                        className="bg-purple-600 text-white px-3 py-1.5 rounded text-xs hover:bg-purple-700 transition-colors flex items-center gap-1 disabled:opacity-50"
                    >
                        {isAnalyzing ? (
                            <>
                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                                Analyzing...
                            </>
                        ) : (
                            <>
                                <Zap className="w-3 h-3" />
                                Analyze Document
                            </>
                        )}
                    </button>
                )}
            </div>

            {!criterion.submittedFileUrl && (
                <div className="text-xs text-purple-600 bg-purple-50 p-3 rounded border border-purple-200">
                    <Info className="w-4 h-4 inline mr-1" />
                    AI analysis akan tersedia setelah dokumen diupload perusahaan
                </div>
            )}

            {showAnalysis && (
                <div className="space-y-4">
                    {/* Confidence Score */}
                    <div className="bg-white rounded-lg p-3 border border-purple-200">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-medium text-slate-700">Confidence Score</span>
                            <span className="text-sm font-bold text-purple-600">{demoAnalysisResult.confidence}%</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                            <div 
                                className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 transition-all duration-1000" 
                                style={{ width: `${demoAnalysisResult.confidence}%` }}
                            />
                        </div>
                        <div className="flex justify-between text-xs text-slate-500 mt-1">
                            <span>Low</span>
                            <span>High</span>
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="bg-white rounded-lg p-3 border border-purple-200">
                        <h6 className="text-xs font-bold text-slate-700 mb-2 flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            AI Summary
                        </h6>
                        <p className="text-sm text-slate-700 italic">"{demoAnalysisResult.summary}"</p>
                        <div className="mt-2 flex items-center gap-2">
                            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
                                {demoAnalysisResult.compliance}
                            </span>
                        </div>
                    </div>

                    {/* Key Findings */}
                    <div className="bg-white rounded-lg p-3 border border-purple-200">
                        <h6 className="text-xs font-bold text-slate-700 mb-2">Key Findings</h6>
                        <div className="space-y-1">
                            {demoAnalysisResult.keyFindings.map((finding, index) => (
                                <div key={index} className="text-xs text-slate-700">
                                    {finding}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Extracted Data */}
                    <div className="bg-white rounded-lg p-3 border border-purple-200">
                        <h6 className="text-xs font-bold text-slate-700 mb-2">Extracted Data (OCR)</h6>
                        <div className="grid grid-cols-1 gap-1">
                            {Object.entries(demoAnalysisResult.extractedData).map(([key, value]) => (
                                <div key={key} className="flex justify-between text-xs">
                                    <span className="text-slate-600">{key}:</span>
                                    <span className="text-slate-800 font-medium">{value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recommendations */}
                    <div className="bg-white rounded-lg p-3 border border-purple-200">
                        <h6 className="text-xs font-bold text-slate-700 mb-2">AI Recommendations</h6>
                        <div className="space-y-1">
                            {demoAnalysisResult.recommendations.map((rec, index) => (
                                <div key={index} className="text-xs text-slate-700 flex items-start gap-1">
                                    <span className="text-blue-500">•</span>
                                    <span>{rec}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="text-xs text-purple-600 bg-purple-50 p-2 rounded border border-purple-200">
                        <AlertCircle className="w-3 h-3 inline mr-1" />
                        <strong>Demo Mode:</strong> Hasil analisis ini adalah simulasi. Pada implementasi real, sistem akan menggunakan OCR dan LLM untuk analisis dokumen sesungguhnya.
                    </div>
                </div>
            )}
        </div>
    );
};

// --- NDVI Geospatial Analysis Sidebar ---
const NDVIAnalysisPanel = ({ project }: { project: AuditProject }) => {
    const [showDetail, setShowDetail] = useState(false);

    const demoNDVIData = {
        lastUpdate: "2024-01-15",
        coverageArea: "2,450 ha",
        averageNDVI: 0.76,
        healthStatus: "Excellent",
        deforestationRisk: "Low",
        complianceScore: 92,
        trends: [
            { period: "Jan 2024", ndvi: 0.78, status: "Stable" },
            { period: "Dec 2023", ndvi: 0.76, status: "Improving" },
            { period: "Nov 2023", ndvi: 0.74, status: "Stable" },
        ],
        alerts: [
            "Terdeteksi pertumbuhan vegetasi yang baik di sektor A",
            "Tidak ada indikasi deforestasi dalam 3 bulan terakhir",
            "Kualitas tutupan lahan sesuai standar ISPO"
        ]
    };

    return (
        <div className="bg-gradient-to-br from-green-50 to-emerald-100 border-2 border-green-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-bold text-green-800 flex items-center gap-2">
                    <Satellite className="w-4 h-4" />
                    NDVI Geospatial Analysis
                    <span className="bg-orange-200 text-orange-800 text-xs px-2 py-0.5 rounded-full font-medium">
                        DEMO
                    </span>
                </h4>
                <button
                    onClick={() => setShowDetail(!showDetail)}
                    className="text-green-600 hover:text-green-700"
                >
                    <Eye className="w-4 h-4" />
                </button>
            </div>

            {/* Quick Stats */}
            <div className="space-y-3 mb-4">
                <div className="bg-white rounded-lg p-3 border border-green-200">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-green-700">NDVI Score</span>
                        <span className="text-lg font-bold text-green-600">{demoNDVIData.averageNDVI}</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                        <div 
                            className="h-2 rounded-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-1000" 
                            style={{ width: `${demoNDVIData.averageNDVI * 100}%` }}
                        />
                    </div>
                    <div className="flex justify-between text-xs text-slate-500 mt-1">
                        <span>0.0</span>
                        <span>1.0</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                    <div className="bg-white rounded-lg p-2 border border-green-200 text-center">
                        <p className="text-xs text-slate-600">Coverage</p>
                        <p className="text-sm font-bold text-green-600">{demoNDVIData.coverageArea}</p>
                    </div>
                    <div className="bg-white rounded-lg p-2 border border-green-200 text-center">
                        <p className="text-xs text-slate-600">Compliance</p>
                        <p className="text-sm font-bold text-green-600">{demoNDVIData.complianceScore}%</p>
                    </div>
                </div>

                <div className="bg-white rounded-lg p-3 border border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-4 h-4 text-green-600" />
                        <span className="text-xs font-medium text-green-700">Status Overview</span>
                    </div>
                    <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                            <span className="text-slate-600">Health Status:</span>
                            <span className="text-green-600 font-medium">{demoNDVIData.healthStatus}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                            <span className="text-slate-600">Deforestation Risk:</span>
                            <span className="text-green-600 font-medium">{demoNDVIData.deforestationRisk}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                            <span className="text-slate-600">Last Update:</span>
                            <span className="text-slate-600">{new Date(demoNDVIData.lastUpdate).toLocaleDateString('id-ID')}</span>
                        </div>
                    </div>
                </div>
            </div>

            {showDetail && (
                <div className="space-y-3">
                    {/* Trend Analysis */}
                    <div className="bg-white rounded-lg p-3 border border-green-200">
                        <h6 className="text-xs font-bold text-slate-700 mb-2 flex items-center gap-1">
                            <BarChart3 className="w-3 h-3" />
                            NDVI Trend (3 Months)
                        </h6>
                        <div className="space-y-2">
                            {demoNDVIData.trends.map((trend, index) => (
                                <div key={index} className="flex justify-between items-center text-xs">
                                    <span className="text-slate-600">{trend.period}</span>
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium">{trend.ndvi}</span>
                                        <span className={`px-1.5 py-0.5 rounded-full text-xs ${
                                            trend.status === 'Improving' ? 'bg-green-100 text-green-700' :
                                            trend.status === 'Stable' ? 'bg-blue-100 text-blue-700' :
                                            'bg-orange-100 text-orange-700'
                                        }`}>
                                            {trend.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Alerts */}
                    <div className="bg-white rounded-lg p-3 border border-green-200">
                        <h6 className="text-xs font-bold text-slate-700 mb-2">Recent Alerts</h6>
                        <div className="space-y-1">
                            {demoNDVIData.alerts.map((alert, index) => (
                                <div key={index} className="text-xs text-slate-700 flex items-start gap-1">
                                    <CheckCircle className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                                    <span>{alert}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="text-xs text-green-600 bg-green-50 p-2 rounded border border-green-200">
                        <Satellite className="w-3 h-3 inline mr-1" />
                        <strong>Demo Mode:</strong> Data geospasial ini adalah simulasi. Pada implementasi real, sistem akan mengintegrasikan data satelit untuk monitoring tutupan lahan secara real-time.
                    </div>
                </div>
            )}
        </div>
    );
};

const ProjectSidebar = ({ projects, activeProjectId, setActiveProjectId }: {
    projects: { project: AuditProject, criteria: Criterion[] }[];
    activeProjectId: string | null;
    setActiveProjectId: (id: string) => void;
}) => {
    const activeProject = projects.find(p => p.project.projectId === activeProjectId);
    
    return (
        <aside className="w-full lg:w-1/3 xl:w-1/4">
            <div className="space-y-4">
                {/* Project List */}
                <div className="bg-white p-4 rounded-xl shadow-lg">
                    <h3 className="font-bold text-slate-800 px-2 mb-3 text-lg">Proyek Assignment Anda</h3>
                    <nav className="space-y-3">
                        {projects.map(({ project, criteria }) => {
                            const pendingCount = criteria.filter(c => c.status === 'Menunggu Verifikasi').length;
                            const completedCount = criteria.filter(c => c.status === 'Disetujui').length;
                            const hasUploads = criteria.some(c => c.submittedFileUrl || c.submittedText);
                            
                            return (
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
                                            <div className="flex items-center gap-3 mt-2">
                                                <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">
                                                    {pendingCount} pending
                                                </span>
                                                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                                                    {completedCount} done
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <Building className={`w-5 h-5 ${activeProjectId === project.projectId ? 'text-blue-600' : 'text-slate-400'}`}/>
                                            {hasUploads && (
                                                <div className="w-2 h-2 bg-green-500 rounded-full mt-1" title="Ada dokumen baru"></div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-slate-600 mt-2">
                                        <Calendar className="w-3 h-3"/>
                                        <span>{new Date(project.deadline).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                    </div>
                                </button>
                            );
                        })}
                    </nav>

                    {/* Quick Stats for Active Project */}
                    {activeProject && (
                        <div className="mt-4 bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-xl p-4">
                            <h4 className="text-sm font-bold text-indigo-900 mb-3">Quick Stats</h4>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-slate-600">Total Criteria:</span>
                                    <span className="text-sm font-bold text-slate-800">{activeProject.criteria.length}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-slate-600">Dengan Upload:</span>
                                    <span className="text-sm font-bold text-green-600">
                                        {activeProject.criteria.filter(c => c.submittedFileUrl || c.submittedText).length}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-slate-600">Menunggu Review:</span>
                                    <span className="text-sm font-bold text-orange-600">
                                        {activeProject.criteria.filter(c => c.status === 'Menunggu Verifikasi').length}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* NDVI Analysis Panel */}
                {activeProject && (
                    <NDVIAnalysisPanel project={activeProject.project} />
                )}
            </div>
        </aside>
    );
};

// --- Enhanced Criterion Card with AI Analysis ---
const CriterionCard = ({ 
    criterion, 
    project, 
    principle,
    onFeedback, 
    onApprove 
}: { 
    criterion: Criterion; 
    project: AuditProject; 
    principle: Principle | undefined;
    onFeedback: (c: Criterion, p: AuditProject) => void; 
    onApprove: (pid: string, cid: string) => void;
}) => {
    const hasEvidence = criterion.submittedFileUrl || criterion.submittedText;
    
    // Get actual file name from URL
    const getFileName = (url: string) => {
        if (!url) return 'Unknown File';
        const parts = url.split('/');
        const fileName = parts[parts.length - 1];
        // Remove timestamp prefix for display
        return fileName.replace(/^\d+_/, '');
    };

    const getFileType = (url: string) => {
        if (!url) return 'unknown';
        const extension = url.split('.').pop()?.toLowerCase();
        switch (extension) {
            case 'pdf': return 'PDF Document';
            case 'doc':
            case 'docx': return 'Word Document';
            case 'xls':
            case 'xlsx': return 'Excel Spreadsheet';
            case 'jpg':
            case 'jpeg':
            case 'png': return 'Image File';
            default: return 'Document';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'Disetujui':
                return <CheckCircle className="w-4 h-4 text-green-500" />;
            case 'Menunggu Verifikasi':
                return <Clock className="w-4 h-4 text-blue-500" />;
            case 'Revisi Diperlukan':
                return <AlertTriangle className="w-4 h-4 text-orange-500" />;
            default:
                return <Info className="w-4 h-4 text-slate-400" />;
        }
    };

    return (
        <div className="bg-white border border-slate-200 rounded-lg transition-all hover:shadow-lg hover:border-blue-300">
            <div className="p-4 border-b border-slate-200">
                <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <p className="text-xs font-semibold text-blue-700 bg-blue-100 px-2 py-1 rounded-full">
                                {principle?.name || 'Prinsip Umum'}
                            </p>
                            {hasEvidence && (
                                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                                    📄 Ada Upload
                                </span>
                            )}
                        </div>
                        <h4 className="font-semibold text-slate-800 mb-1">{criterion.name}</h4>
                        <p className="text-xs text-slate-500">ID: {criterion.id}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                        <StatusBadge status={criterion.status} />
                        {getStatusIcon(criterion.status)}
                    </div>
                </div>
            </div>

            <div className="p-4 space-y-4">
                {/* Verification Requirements */}
                <div>
                    <h5 className="flex items-center gap-2 text-xs font-bold text-slate-600 mb-2">
                        <ClipboardList className="w-4 h-4 text-slate-400"/>
                        VERIFIER YANG PERLU DICEK
                    </h5>
                    <ul className="list-disc pl-5 space-y-1">
                        {criterion.verifier.map((item, index) => (
                            <li key={index} className="text-sm text-slate-700">{item}</li>
                        ))}
                    </ul>
                </div>

                {/* Evidence Section */}
                <div className="bg-slate-50 p-4 rounded-lg">
                    <h5 className="text-xs font-bold text-slate-600 mb-3 flex items-center gap-2">
                        <User className="w-4 h-4 text-slate-400"/>
                        BUKTI DARI {project.companyName.toUpperCase()}
                    </h5>
                    
                    {!hasEvidence ? (
                        <div className="flex items-center gap-3 text-slate-500 text-sm p-4 bg-white rounded border-2 border-dashed border-slate-300">
                           <Info className="w-5 h-5 flex-shrink-0" /> 
                           <span>Perusahaan belum mengirimkan bukti untuk kriteria ini.</span>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {/* Text Evidence */}
                            {criterion.submittedText && (
                                <div className="bg-white border border-slate-200 rounded-lg p-3">
                                    <h6 className="text-xs font-semibold text-slate-600 mb-2 flex items-center gap-1">
                                        <MessageCircle className="w-3 h-3"/>
                                        Catatan/Pernyataan:
                                    </h6>
                                    <div className="bg-blue-50 border border-blue-200 rounded p-3">
                                        <p className="text-sm text-slate-800 italic">"{criterion.submittedText}"</p>
                                    </div>
                                </div>
                            )}
                            
                            {/* File Evidence */}
                            {criterion.submittedFileUrl && (
                                <div className="bg-white border border-slate-200 rounded-lg p-3">
                                    <h6 className="text-xs font-semibold text-slate-600 mb-2 flex items-center gap-1">
                                        <Paperclip className="w-3 h-3"/>
                                        Dokumen Terupload:
                                    </h6>
                                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                                <FileIcon className="w-6 h-6 text-green-600" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-slate-800">
                                                    {getFileName(criterion.submittedFileUrl)}
                                                </p>
                                                <p className="text-xs text-slate-500">
                                                    {getFileType(criterion.submittedFileUrl)} • 
                                                    Uploaded by {project.companyName}
                                                </p>
                                                <p className="text-xs text-green-600 font-medium mt-1">
                                                    ✓ Siap untuk direview
                                                </p>
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <a
                                                    href={criterion.submittedFileUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="bg-blue-600 text-white px-3 py-1.5 rounded text-xs hover:bg-blue-700 transition-colors flex items-center gap-1"
                                                >
                                                    <Eye className="w-3 h-3" />
                                                    View
                                                </a>
                                                <a
                                                    href={criterion.submittedFileUrl}
                                                    download
                                                    className="bg-green-600 text-white px-3 py-1.5 rounded text-xs hover:bg-green-700 transition-colors flex items-center gap-1"
                                                >
                                                    <Download className="w-3 h-3" />
                                                    Download
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            
                            {/* Timeline */}
                            <div className="bg-white border border-slate-200 rounded-lg p-3">
                                <h6 className="text-xs font-semibold text-slate-600 mb-2">Timeline Review:</h6>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-xs">
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                        <span className="text-slate-600">
                                            Dokumen diupload • {new Date().toLocaleDateString('id-ID')}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                        <span className="text-slate-600">
                                            Status: {criterion.status}
                                        </span>
                                    </div>
                                    {criterion.auditorNotes && (
                                        <div className="flex items-start gap-2 text-xs">
                                            <div className="w-2 h-2 bg-orange-500 rounded-full mt-1"></div>
                                            <div>
                                                <span className="text-slate-600 font-medium">Feedback Auditor:</span>
                                                <p className="text-slate-600 italic">"{criterion.auditorNotes}"</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* AI Analysis Panel */}
                {hasEvidence && (
                    <AIAnalysisPanel criterion={criterion} project={project} />
                )}
            </div>
            
            {/* Action Buttons */}
            <div className="bg-slate-100 p-4 flex justify-between items-center rounded-b-lg">
                <div className="text-xs text-slate-500">
                    {hasEvidence ? (
                        <span className="flex items-center gap-1">
                            <CheckCircle className="w-3 h-3 text-green-500" />
                            Siap direview
                        </span>
                    ) : (
                        <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            Menunggu upload dari perusahaan
                        </span>
                    )}
                </div>
                <div className="flex items-center space-x-2">
                    <button 
                        onClick={() => onFeedback(criterion, project)} 
                        className="flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-lg text-amber-800 bg-amber-100 hover:bg-amber-200 transition-colors"
                        disabled={!hasEvidence}
                    >
                        <MessageSquare className="w-4 h-4" /> 
                        Feedback
                    </button>
                    <button 
                        onClick={() => onApprove(project.projectId, criterion.id)} 
                        className="flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-lg text-green-800 bg-green-100 hover:bg-green-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={!hasEvidence || criterion.status === 'Disetujui'}
                    >
                        <CheckSquare className="w-4 h-4" /> 
                        {criterion.status === 'Disetujui' ? 'Approved' : 'Approve'}
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- Main Auditor Dashboard Component ---
export default function AuditorDashboard() {
    const [currentUser, setCurrentUser] = useState<Auditor | null>(null);
    const [projects, setProjects] = useState<AuditProject[]>([]);
    const [principles, setPrinciples] = useState<Principle[]>([]);
    const [myAssignments, setMyAssignments] = useState<{ project: AuditProject, criteria: Criterion[] }[]>([]);
    const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCriterion, setSelectedCriterion] = useState<Criterion | null>(null);
    const [currentProject, setCurrentProject] = useState<AuditProject | null>(null);
    const [feedbackText, setFeedbackText] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Load data awal dari Supabase
    useEffect(() => {
        async function loadData() {
            try {
                setLoading(true);
                setError(null);

                // Ambil auditor ID dari localStorage
                const loggedInAuditorId = localStorage.getItem("auditorId");
                if (!loggedInAuditorId) {
                    setError("Anda belum login sebagai auditor");
                    setLoading(false);
                    return;
                }

                // Fetch auditors
                const auditorsData = await getAuditors();
                console.log("🔍 Looking for auditor ID:", loggedInAuditorId);
                
                // Coba cari dengan berbagai format ID
                const foundUser = auditorsData.find(auditor => 
                    auditor.id === loggedInAuditorId || 
                    auditor.id === String(loggedInAuditorId) ||
                    String(auditor.id) === loggedInAuditorId
                );
                
                if (!foundUser) {
                    console.error("❌ Auditor not found. Available IDs:", auditorsData.map(a => a.id));
                    setError(`Data auditor tidak ditemukan (ID: ${loggedInAuditorId}). Silakan login ulang.`);
                    setLoading(false);
                    return;
                }
                
                console.log("✅ Auditor found:", foundUser.name);
                setCurrentUser(foundUser);

                // Fetch principles
                const principlesData = await getAllPrinciples();
                setPrinciples(principlesData);

                // Fetch projects
                const projectsData = await getAuditProjects();
                setProjects(projectsData);

                // Filter assignments untuk auditor ini - hanya criteria yang di-assign ke dia
                const assignments = projectsData.map(project => {
                    const criteriaForAuditor = Object.values(project.principles).flat().filter(
                        criterion => criterion.assignedAuditorId === loggedInAuditorId
                    );
                    return { project, criteria: criteriaForAuditor };
                }).filter(assignment => assignment.criteria.length > 0);

                console.log("📋 Assignments found:", assignments.length);
                setMyAssignments(assignments);
                
                if (assignments.length > 0 && !activeProjectId) {
                    setActiveProjectId(assignments[0].project.projectId);
                }

                setLoading(false);
            } catch (err) {
                console.error("Error loading data:", err);
                setError("Gagal memuat data dari database");
                setLoading(false);
            }
        }

        loadData();
    }, []);

    // Helper untuk mendapatkan principle dari criterion ID
    const getPrincipleForCriterion = (criterionId: string): Principle | undefined => {
        // More robust principle ID extraction
        for (const principle of principles) {
            if (principle.criteria.some(c => c.id === criterionId)) {
                return principle;
            }
        }
        return principles[0]; // fallback
    };

    const handleUpdateStatus = async (
        projectId: string, 
        criterionId: string, 
        newStatus: Criterion['status'], 
        notes: string | null = null
    ) => {
        try {
            const updates: any = { status: newStatus };
            if (notes !== null) {
                updates.auditorNotes = notes;
            }

            console.log("🔄 Updating criterion:", { projectId, criterionId, newStatus, notes });
            const success = await updateAuditCriterion(projectId, criterionId, updates);
            
            if (success) {
                console.log("✅ Update successful");
                // Refresh data
                const updatedProjects = await getAuditProjects();
                setProjects(updatedProjects);
                
                const loggedInAuditorId = localStorage.getItem("auditorId");
                const assignments = updatedProjects.map(project => {
                    const criteriaForAuditor = Object.values(project.principles).flat().filter(
                        criterion => criterion.assignedAuditorId === loggedInAuditorId
                    );
                    return { project, criteria: criteriaForAuditor };
                }).filter(assignment => assignment.criteria.length > 0);
                setMyAssignments(assignments);
                
                alert(`Status berhasil diupdate menjadi: ${newStatus}`);
            } else {
                alert("Gagal mengupdate status kriteria");
            }
        } catch (err) {
            console.error("Error updating criterion:", err);
            alert("Terjadi kesalahan saat mengupdate status");
        }
    };

    const openFeedbackModal = (criterion: Criterion, project: AuditProject) => {
        setSelectedCriterion(criterion);
        setCurrentProject(project);
        setFeedbackText(criterion.auditorNotes || "");
        setIsModalOpen(true);
    };
    
    const submitFeedback = () => {
        if (selectedCriterion && currentProject && feedbackText.trim()) {
            handleUpdateStatus(currentProject.projectId, selectedCriterion.id, "Revisi Diperlukan", feedbackText);
            setIsModalOpen(false);
        } else {
            alert("Mohon isi feedback terlebih dahulu");
        }
    };
    
    const handleApprove = (projectId: string, criterionId: string) => {
        if(confirm("Anda yakin ingin menyetujui kriteria ini? Aksi ini tidak dapat dibatalkan.")){
            handleUpdateStatus(projectId, criterionId, "Disetujui", "Dokumen telah diverifikasi dan disetujui oleh auditor.");
        }
    };

    const activeProjectData = myAssignments.find(a => a.project.projectId === activeProjectId);

    const renderProjectDetails = () => {
        if (!activeProjectData) {
            return (
                <div className="bg-white p-10 rounded-xl shadow-lg text-center">
                    <div className="text-slate-400 text-6xl mb-4">📋</div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">Tidak Ada Assignment</h3>
                    <p className="text-slate-500 mb-4">
                        Anda belum memiliki project yang di-assign. Hubungi admin untuk mendapatkan assignment audit.
                    </p>
                    <button 
                        onClick={() => window.location.reload()}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Refresh Page
                    </button>
                </div>
            );
        }

        const deadline = new Date(activeProjectData.project.deadline);
        const totalCriteria = activeProjectData.criteria.length;
        const withUploads = activeProjectData.criteria.filter(c => c.submittedFileUrl || c.submittedText).length;
        const pendingReview = activeProjectData.criteria.filter(c => c.status === 'Menunggu Verifikasi').length;
        const approved = activeProjectData.criteria.filter(c => c.status === 'Disetujui').length;

        return (
            <div className="bg-white p-6 rounded-xl shadow-lg space-y-6">
                {/* Project Header */}
                <div className="pb-4 border-b border-slate-200">
                    <div className="flex items-center justify-between mb-3">
                        <div>
                            <p className="text-sm text-slate-500">Proyek Assignment</p>
                            <h2 className="text-2xl font-bold text-slate-900 flex items-center">
                                <Building className="w-6 h-6 mr-3 text-blue-500"/>
                                {activeProjectData.project.companyName}
                            </h2>
                            <p className="text-sm text-slate-600">{activeProjectData.project.projectId}</p>
                        </div>
                        <div className="text-right">
                            <div className="flex items-center text-red-600 mb-1">
                                <Flag className="w-4 h-4 mr-2"/>
                                <span className="text-sm font-semibold">
                                    Deadline: {deadline.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </span>
                            </div>
                            <p className="text-xs text-slate-500">
                                {Math.ceil((deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} hari tersisa
                            </p>
                        </div>
                    </div>
                    
                    {/* Progress Stats */}
                    <div className="grid grid-cols-4 gap-4 mt-4">
                        <div className="bg-slate-50 p-3 rounded-lg text-center">
                            <p className="text-lg font-bold text-slate-800">{totalCriteria}</p>
                            <p className="text-xs text-slate-500">Total Criteria</p>
                        </div>
                        <div className="bg-green-50 p-3 rounded-lg text-center">
                            <p className="text-lg font-bold text-green-600">{withUploads}</p>
                            <p className="text-xs text-green-600">Dengan Upload</p>
                        </div>
                        <div className="bg-orange-50 p-3 rounded-lg text-center">
                            <p className="text-lg font-bold text-orange-600">{pendingReview}</p>
                            <p className="text-xs text-orange-600">Pending Review</p>
                        </div>
                        <div className="bg-blue-50 p-3 rounded-lg text-center">
                            <p className="text-lg font-bold text-blue-600">{approved}</p>
                            <p className="text-xs text-blue-600">Approved</p>
                        </div>
                    </div>
                </div>

                {/* Criteria List */}
                <div>
                    <h3 className="font-semibold text-slate-800 flex items-center mb-4">
                        <ListChecks className="w-5 h-5 mr-3 text-slate-400"/>
                        Criteria Assignment Anda ({activeProjectData.criteria.length})
                    </h3>
                    <div className="space-y-4">
                        {activeProjectData.criteria.map(criterion => (
                            <CriterionCard 
                                key={criterion.id} 
                                criterion={criterion} 
                                project={activeProjectData.project}
                                principle={getPrincipleForCriterion(criterion.id)}
                                onFeedback={openFeedbackModal} 
                                onApprove={handleApprove} 
                            />
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="bg-slate-100 min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-slate-600">Memuat assignment Anda...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-slate-100 min-h-screen flex items-center justify-center">
                <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md">
                    <div className="text-red-500 text-5xl mb-4">⚠️</div>
                    <h2 className="text-xl font-bold text-slate-900 mb-2">Terjadi Kesalahan</h2>
                    <p className="text-slate-600 mb-4">{error}</p>
                    <div className="flex gap-3 justify-center">
                        <button 
                            onClick={() => {
                                localStorage.removeItem("auditorId");
                                window.location.href = "/login/auditor";
                            }}
                            className="bg-slate-600 text-white px-6 py-2 rounded-lg hover:bg-slate-700 transition-colors"
                        >
                            Kembali ke Login
                        </button>
                        <button 
                            onClick={() => window.location.reload()} 
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Muat Ulang
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!currentUser) {
        return (
            <div className="bg-slate-100 min-h-screen flex items-center justify-center">
                <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md">
                    <p className="text-slate-600">Silakan login terlebih dahulu sebagai auditor</p>
                </div>
            </div>
        );
    }

    return (
        <Fragment>
            <div className="bg-slate-100 min-h-screen p-4 sm:p-6 lg:p-8">
                <div className="max-w-screen-xl mx-auto space-y-8">
                    <Header currentUser={currentUser} />
                    {myAssignments.length === 0 ? (
                        renderProjectDetails()
                    ) : (
                        <div className="flex flex-col lg:flex-row gap-8">
                            <ProjectSidebar projects={myAssignments} activeProjectId={activeProjectId} setActiveProjectId={setActiveProjectId} />
                            <main className="w-full lg:w-2/3 xl:w-3/4">
                                {renderProjectDetails()}
                            </main>
                        </div>
                    )}
                </div>
            </div>

            {/* Feedback Modal */}
            {isModalOpen && selectedCriterion && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
                    <div className="bg-white rounded-lg p-6 w-full max-w-lg space-y-4 shadow-2xl">
                        <div className="flex justify-between items-center">
                            <h3 className="font-bold text-lg text-slate-800">
                                Feedback untuk: {selectedCriterion.name}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)}>
                                <X className="w-5 h-5 text-gray-500"/>
                            </button>
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-slate-900">
                                Catatan Revisi untuk {currentProject?.companyName}:
                            </label>
                            <textarea 
                                value={feedbackText} 
                                onChange={(e) => setFeedbackText(e.target.value)} 
                                className="mt-1 w-full border-2 border-gray-300 rounded-lg p-3 h-32 text-slate-800" 
                                placeholder="Contoh: Mohon lampirkan dokumen SIUP yang terbaru dan pastikan stempel perusahaan tercantum jelas."
                            />
                            <p className="text-xs text-slate-500 mt-1">
                                Feedback ini akan dikirim ke perusahaan untuk perbaikan dokumen.
                            </p>
                        </div>
                        <div className="flex justify-end gap-3">
                            <button 
                                onClick={() => setIsModalOpen(false)} 
                                className="bg-slate-100 text-slate-800 font-bold py-2 px-4 rounded-lg hover:bg-slate-200"
                            >
                                Batal
                            </button>
                            <button 
                                onClick={submitFeedback} 
                                className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700"
                                disabled={!feedbackText.trim()}
                            >
                                Kirim Feedback
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </Fragment>
    );
}