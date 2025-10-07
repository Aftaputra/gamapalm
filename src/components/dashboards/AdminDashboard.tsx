"use client";

import React, { useState, useEffect } from "react";
import { 
    Shield, Bell, User, Settings, LogOut, ChevronDown, BarChart3, FileText, 
    Users, Map, ClipboardCheck, Clock, CheckCircle, XCircle, FileInput, MoreHorizontal, 
    Mail, MapPin, Award, Loader2
} from "lucide-react";

import { getRequests, getAuditTasks, getAuditors, approveRequest, rejectRequest } from "@/lib/api";
import { RequestItem, AuditTask, Auditor } from "@/types";
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer } from "react-leaflet";
import ProjectManagement from '../ProjectManagement';
import { getCompanyUsers, createCertificationRequest } from "@/lib/api";
import { getAllCompanyUsersWithStatus, createAuditProjectForUser } from "@/lib/api";
import UserManagement from '../UserManagement';
// Import AuditorsView yang benar (yang ada assignment features)
import AuditorsView from './admin/AuditorsView';

type BadgeStatus = 'pending' | 'approved' | 'rejected';

const StatusBadge = ({ status }: { status: BadgeStatus }) => {
    const statusConfig: Record<BadgeStatus, { text: string; color: string; }> = {
        pending: { text: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
        approved: { text: 'Approved', color: 'bg-green-100 text-green-800' },
        rejected: { text: 'Rejected', color: 'bg-red-100 text-red-800' },
    };
    const config = statusConfig[status];
    return <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${config.color}`}>{config.text}</span>;
};

// Overview Component
const Overview = ({ stats, tasks, auditorsList }: { stats: any; tasks: AuditTask[]; auditorsList: Auditor[] }) => (
    <div className="space-y-8">
        <div>
            <h2 className="text-xl font-bold text-slate-800 mb-4">Ringkasan Sistem</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-slate-500">Total Permintaan</p>
                        <FileInput className="w-5 h-5 text-slate-400" />
                    </div>
                    <p className="text-3xl font-bold text-slate-800 mt-2">{stats.total}</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-slate-500">Menunggu Persetujuan</p>
                        <Clock className="w-5 h-5 text-yellow-500" />
                    </div>
                    <p className="text-3xl font-bold text-yellow-500 mt-2">{stats.pending}</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-slate-500">Permintaan Disetujui</p>
                        <CheckCircle className="w-5 h-5 text-green-500" />
                    </div>
                    <p className="text-3xl font-bold text-green-500 mt-2">{stats.approved}</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-slate-500">Total Auditor Aktif</p>
                        <Users className="w-5 h-5 text-blue-500" />
                    </div>
                    <p className="text-3xl font-bold text-blue-500 mt-2">{auditorsList.length}</p>
                </div>
            </div>
        </div>
    </div>
);

// Requests Table Component with Actions
const RequestsTable = ({ requests, onRequestUpdate }: { requests: RequestItem[]; onRequestUpdate: () => Promise<void> }) => {
    const [loadingActions, setLoadingActions] = useState<{ [key: number]: 'approve' | 'reject' | null }>({});

    const handleApprove = async (requestId: number) => {
        setLoadingActions(prev => ({ ...prev, [requestId]: 'approve' }));
        
        try {
            const success = await approveRequest(requestId);
            if (success) {
                alert('Request berhasil disetujui dan audit project telah dibuat!');
                await onRequestUpdate();
            } else {
                alert('Gagal menyetujui request');
            }
        } catch (error) {
            alert('Terjadi kesalahan saat menyetujui request');
        } finally {
            setLoadingActions(prev => ({ ...prev, [requestId]: null }));
        }
    };

    const handleReject = async (requestId: number) => {
        setLoadingActions(prev => ({ ...prev, [requestId]: 'reject' }));
        
        try {
            const success = await rejectRequest(requestId);
            if (success) {
                alert('Request berhasil ditolak');
                await onRequestUpdate();
            } else {
                alert('Gagal menolak request');
            }
        } catch (error) {
            alert('Terjadi kesalahan saat menolak request');
        } finally {
            setLoadingActions(prev => ({ ...prev, [requestId]: null }));
        }
    };

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6">
                <h2 className="text-xl font-bold text-slate-800">Manajemen Permintaan Sertifikasi</h2>
                <p className="text-sm text-slate-500 mt-1">Setujui atau tolak permintaan sertifikasi yang masuk.</p>
            </div>
            <table className="w-full text-sm text-left text-slate-500">
                <thead className="bg-slate-50 text-xs text-slate-700 uppercase">
                    <tr>
                        <th scope="col" className="px-6 py-3">ID</th>
                        <th scope="col" className="px-6 py-3">Nama Perusahaan</th>
                        <th scope="col" className="px-6 py-3">Status</th>
                        <th scope="col" className="px-6 py-3 text-right">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {requests.map((req) => {
                        const isLoading = loadingActions[req.id];
                        return (
                            <tr key={req.id} className="bg-white border-t hover:bg-slate-50">
                                <td className="px-6 py-4 font-medium text-slate-900">REQ-{String(req.id).padStart(3, '0')}</td>
                                <td className="px-6 py-4">{req.company}</td>
                                <td className="px-6 py-4"><StatusBadge status={req.status} /></td>
                                <td className="px-6 py-4 text-right">
                                    {req.status === 'pending' && (
                                        <div className="flex justify-end items-center gap-3">
                                            <button 
                                                onClick={() => handleReject(req.id)}
                                                disabled={isLoading !== null}
                                                className="flex items-center gap-2 font-semibold text-sm text-red-600 hover:text-red-800 transition-colors disabled:opacity-50"
                                            >
                                                {isLoading === 'reject' ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <XCircle className="w-4 h-4" />
                                                )}
                                                Tolak
                                            </button>
                                            <button 
                                                onClick={() => handleApprove(req.id)}
                                                disabled={isLoading !== null}
                                                className="flex items-center gap-2 font-semibold text-sm px-4 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm disabled:opacity-50"
                                            >
                                                {isLoading === 'approve' ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <CheckCircle className="w-4 h-4" />
                                                )}
                                                Setujui
                                            </button>
                                        </div>
                                    )}
                                    {req.status === 'approved' && (
                                        <span className="text-xs text-green-600 font-medium">✓ Project Created</span>
                                    )}
                                    {req.status === 'rejected' && (
                                        <span className="text-xs text-slate-500 italic">Ditolak</span>
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

// Geospatial View Component
const GeospatialView = () => {
    const defaultPosition: [number, number] = [-6.2088, 106.8456]; 

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 h-[600px] w-full flex flex-col">
            <div className="mb-4">
                <h2 className="text-xl font-bold text-slate-800">Tampilan Peta Geospasial</h2>
                <p className="text-sm text-slate-500 mt-1">Prototipe peta dasar menggunakan OpenStreetMap.</p>
            </div>
            <div className="flex-grow rounded-lg overflow-hidden z-0">
                <MapContainer center={defaultPosition} zoom={13} style={{ height: '100%', width: '100%' }}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                </MapContainer>
            </div>
        </div>
    );
};

// Main AdminDashboard Component
const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState("overview");
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    const [requests, setRequests] = useState<RequestItem[]>([]);
    const [auditTasks, setAuditTasks] = useState<AuditTask[]>([]);
    const [auditors, setAuditors] = useState<Auditor[]>([]);

    // Load data dari Supabase
    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            setError(null);

            const [requestsData, tasksData, auditorsData, companyUsersData] = await Promise.all([
                getRequests(),
                getAuditTasks(),
                getAuditors(),
                getCompanyUsers()
            ]);

            // Jika ada company users yang belum punya request, buat otomatis
            for (const user of companyUsersData) {
                const hasRequest = requestsData.some(req => req.company === user.company);
                if (!hasRequest && user.company) {
                    await createCertificationRequest(user.company);
                }
            }

            // Reload requests setelah create otomatis
            const updatedRequests = await getRequests();

            setRequests(updatedRequests);
            setAuditTasks(tasksData);
            setAuditors(auditorsData);
        } catch (err) {
            console.error('Error loading admin data:', err);
            setError('Gagal memuat data dari database');
        } finally {
            setLoading(false);
        }
    };

    const reloadRequests = async () => {
        try {
            const requestsData = await getRequests();
            setRequests(requestsData);
        } catch (error) {
            console.error('Error reloading requests:', error);
        }
    };

    const stats = {
        total: requests.length,
        pending: requests.filter((r) => r.status === "pending").length,
        approved: requests.filter((r) => r.status === "approved").length,
    };

    const tabs = [
        { id: "overview", label: "Overview", icon: BarChart3 },
        { id: "users", label: "Users", icon: Users },
        { id: "projects", label: "Projects", icon: ClipboardCheck },
        { id: "auditors", label: "Auditors", icon: Users },
        { id: "map", label: "Geospatial", icon: Map },
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
                    <p className="text-slate-600 font-semibold">Memuat Dashboard Admin...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md">
                    <div className="text-red-500 text-5xl mb-4">⚠️</div>
                    <h2 className="text-xl font-bold text-slate-900 mb-2">Terjadi Kesalahan</h2>
                    <p className="text-slate-600 mb-4">{error}</p>
                    <button 
                        onClick={loadData}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                    >
                        Muat Ulang
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <header className="bg-white shadow-sm border-b sticky top-0 z-10">
                <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-3">
                            <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center shadow-md">
                                <Shield className="text-white w-5 h-5" />
                            </div>
                            <div>
                                <h1 className="text-lg font-bold text-gray-800">Smart ISPO TIC</h1>
                                <p className="text-xs text-gray-600">Admin - PT Sucofindo</p>
                            </div>
                        </div>
                        <div className="relative">
                            <button 
                                onClick={() => setIsProfileOpen(!isProfileOpen)} 
                                className="flex items-center space-x-2 p-1 rounded-lg hover:bg-gray-100 transition"
                            >
                                <img className="w-9 h-9 rounded-full" src="https://i.pravatar.cc/150?u=dave" alt="Admin Avatar" />
                                <span className="text-sm font-medium text-gray-700 hidden sm:block">Admin Sucofindo</span>
                                <ChevronDown className="h-4 w-4 text-gray-500" />
                            </button>
                            {isProfileOpen && (
                                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border z-20">
                                    <div className="p-4 border-b">
                                        <p className="font-semibold text-gray-800">Admin Sucofindo</p>
                                        <p className="text-xs text-gray-500">admin@sucofindo.co.id</p>
                                    </div>
                                    <div className="py-2">
                                        <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                            <Bell className="w-4 h-4 mr-3" />Notifications
                                            <span className="ml-auto bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">3</span>
                                        </a>
                                        <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                            <User className="w-4 h-4 mr-3" />Profile
                                        </a>
                                        <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                            <Settings className="w-4 h-4 mr-3" />Settings
                                        </a>
                                    </div>
                                    <div className="p-2 border-t">
                                        <button className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md">
                                            <LogOut className="w-4 h-4 mr-3" />Logout
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            <nav className="bg-white border-b">
                <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 flex space-x-6">
                    {tabs.map((tab) => (
                        <button 
                            key={tab.id} 
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-semibold text-sm transition-colors ${
                                activeTab === tab.id 
                                    ? "border-blue-500 text-blue-600" 
                                    : "border-transparent text-gray-600 hover:text-blue-600"
                            }`}
                        >
                            <tab.icon className="h-5 w-5" />
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </div>
            </nav>

            <main className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {activeTab === 'overview' && <Overview stats={stats} tasks={auditTasks} auditorsList={auditors} />}
                {activeTab === 'users' && <UserManagement />}
                {activeTab === 'projects' && <ProjectManagement />}
                {/* Ganti dengan komponen AuditorsView yang benar */}
                {activeTab === 'auditors' && <AuditorsView />}
                {activeTab === 'map' && <GeospatialView />}
            </main>
        </div>
    );
};

export default AdminDashboard;