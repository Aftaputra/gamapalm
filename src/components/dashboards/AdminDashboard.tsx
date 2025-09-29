"use client";

import React, { useState } from "react";
import { 
    Shield, Bell, User, Settings, LogOut, ChevronDown, BarChart3, FileText, 
    Users, Map, ClipboardCheck, Clock, CheckCircle, XCircle, FileInput, MoreHorizontal, Mail, MapPin, Award // <-- FIX: Tambah icon Award
} from "lucide-react";

// FIX 1: Impor TIPE DATA dari @/types, dan DATA VARIABEL dari @/lib/mockdata
import { requests, auditTasks, auditors } from "@/lib/mockdata";
import { RequestItem, AuditTask, Auditor } from "@/types";
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer } from "react-leaflet";

// =================================================================
// ==                      KOMPONEN-KOMPONEN KECIL (UI KIT)         ==
// =================================================================

// FIX 2: Membuat tipe status lebih eksplisit untuk TypeScript
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

// =================================================================
// ==              KOMPONEN VIEW UNTUK SETIAP TAB (BARU)          ==
// =================================================================

// --- 1. KOMPONEN OVERVIEW ---
const Overview = ({ stats, tasks, auditorsList }: { stats: any; tasks: AuditTask[]; auditorsList: Auditor[] }) => (
    <div className="space-y-8">
        <div>
            <h2 className="text-xl font-bold text-slate-800 mb-4">Ringkasan Sistem</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between"><p className="text-sm font-medium text-slate-500">Total Permintaan</p><FileInput className="w-5 h-5 text-slate-400" /></div>
                    <p className="text-3xl font-bold text-slate-800 mt-2">{stats.total}</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between"><p className="text-sm font-medium text-slate-500">Menunggu Persetujuan</p><Clock className="w-5 h-5 text-yellow-500" /></div>
                    <p className="text-3xl font-bold text-yellow-500 mt-2">{stats.pending}</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between"><p className="text-sm font-medium text-slate-500">Permintaan Disetujui</p><CheckCircle className="w-5 h-5 text-green-500" /></div>
                    <p className="text-3xl font-bold text-green-500 mt-2">{stats.approved}</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between"><p className="text-sm font-medium text-slate-500">Total Auditor Aktif</p><Users className="w-5 h-5 text-blue-500" /></div>
                    <p className="text-3xl font-bold text-blue-500 mt-2">{auditorsList.length}</p>
                </div>
            </div>
        </div>
        <div>
            <h2 className="text-xl font-bold text-slate-800 mb-4">Aktivitas Audit Terbaru</h2>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="flow-root">
                    <ul role="list" className="-mb-4">
                        {tasks.slice(0, 4).map((task, index) => (
                            <li key={task.id} className="relative pb-4">
                                {index !== tasks.slice(0, 4).length - 1 && <div className="absolute top-4 left-4 -ml-px mt-0.5 h-full w-0.5 bg-slate-200"></div>}
                                <div className="relative flex items-start space-x-3">
                                    <div><div className="relative px-1"><div className="h-8 w-8 bg-slate-100 rounded-full ring-8 ring-white flex items-center justify-center"><ClipboardCheck className="h-5 w-5 text-slate-500" /></div></div></div>
                                    <div className="min-w-0 flex-1 py-1.5">
                                        <div className="text-sm text-slate-600">
                                            Tugas audit baru untuk <span className="font-medium text-slate-900">{task.company}</span>
                                            {task.auditorId && ` ditugaskan ke ${auditorsList.find(a => a.id === task.auditorId)?.name || 'Auditor'}.`}
                                        </div>
                                    </div>
                                    <div className="flex-shrink-0 pr-2 py-1.5"><StatusBadge status={task.status} /></div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    </div>
);

// --- 2. KOMPONEN TABEL REQUESTS ---
const RequestsTable = ({ requests }: { requests: RequestItem[] }) => (
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
                {requests.map((req) => (
                    <tr key={req.id} className="bg-white border-t hover:bg-slate-50">
                        <td className="px-6 py-4 font-medium text-slate-900">REQ-{String(req.id).padStart(3, '0')}</td>
                        <td className="px-6 py-4">{req.company}</td>
                        <td className="px-6 py-4"><StatusBadge status={req.status} /></td>
                        <td className="px-6 py-4 text-right">
                            {/* --- FIX: LOGIKA TOMBOL AKSI DIPERBARUI --- */}
                            {req.status === 'pending' && (
                                <div className="flex justify-end items-center gap-3">
                                    <button className="font-semibold text-sm text-red-600 hover:text-red-800 transition-colors">Tolak</button>
                                    <button className="font-semibold text-sm px-4 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm">Setujui</button>
                                </div>
                            )}
                            {req.status === 'approved' && (
                                <a href="/cert" className="inline-flex items-center gap-2 bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors shadow-sm">
                                    <Award className="w-4 h-4" />
                                    <span>Terbitkan Sertifikat</span>
                                </a>
                            )}
                            {req.status === 'rejected' && (
                                <span className="text-xs text-slate-500 italic">Tindakan selesai</span>
                            )}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);


// --- 3. KOMPONEN TAMPILAN AUDITORS ---
const AuditorsView = ({ auditors, tasks }: { auditors: Auditor[], tasks: AuditTask[] }) => {
    const getAuditorWorkload = (auditorId: string) => {
        const assignedTasks = tasks.filter(task => task.auditorId === auditorId);
        return {
            active: assignedTasks.filter(task => task.status === 'pending').length,
            completed: assignedTasks.filter(task => task.status === 'approved').length,
        };
    };
    return (
        <div>
            <div className="mb-6"><h2 className="text-xl font-bold text-slate-800">Manajemen Auditor</h2><p className="text-sm text-slate-500 mt-1">Lihat daftar auditor terdaftar dan beban kerja mereka.</p></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {auditors.map(auditor => {
                    const workload = getAuditorWorkload(auditor.id);
                    return (
                        <div key={auditor.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-4">
                                    <img className="w-14 h-14 rounded-full" src={auditor.avatarUrl} alt={auditor.name} />
                                    <div><p className="font-bold text-slate-800 text-lg">{auditor.name}</p><p className="text-xs text-slate-500">{auditor.id}</p></div>
                                </div>
                                <button className="text-slate-400 hover:text-slate-600"><MoreHorizontal className="w-5 h-5"/></button>
                            </div>
                            <div className="space-y-2 text-sm">
                                <div className="flex items-center text-slate-600"><Mail className="w-4 h-4 mr-3 text-slate-400"/> {auditor.email}</div>
                                <div className="flex items-center text-slate-600"><MapPin className="w-4 h-4 mr-3 text-slate-400"/> {auditor.location}</div>
                            </div>
                            <div className="mt-4 pt-4 border-t flex justify-around">
                                <div className="text-center"><p className="font-bold text-lg text-blue-600">{workload.active}</p><p className="text-xs text-slate-500">Tugas Aktif</p></div>
                                <div className="text-center"><p className="font-bold text-lg text-green-600">{workload.completed}</p><p className="text-xs text-slate-500">Tugas Selesai</p></div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

// --- 4. KOMPONEN GEOSPATIAL (VERSI PROTOTIPE SIMPEL) ---
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

// =================================================================
// ==                      KOMPONEN UTAMA DASHBOARD                 ==
// =================================================================
const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState("overview");
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const stats = {
        total: requests.length,
        pending: requests.filter((r) => r.status === "pending").length,
        approved: requests.filter((r) => r.status === "approved").length,
    };

    const tabs = [
        { id: "overview", label: "Overview", icon: BarChart3 },
        { id: "requests", label: "Requests", icon: FileText },
        { id: "auditors", label: "Auditors", icon: Users },
        { id: "map", label: "Geospatial", icon: Map },
    ];

    return (
        <div className="min-h-screen bg-slate-50">
            <header className="bg-white shadow-sm border-b sticky top-0 z-10">
                <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-3">
                            <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center shadow-md"><Shield className="text-white w-5 h-5" /></div>
                            <div><h1 className="text-lg font-bold text-gray-800">Smart ISPO TIC</h1><p className="text-xs text-gray-600">Admin - PT Sucofindo</p></div>
                        </div>
                        <div className="relative">
                            <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center space-x-2 p-1 rounded-lg hover:bg-gray-100 transition">
                                <img className="w-9 h-9 rounded-full" src="https://i.pravatar.cc/150?u=dave" alt="Admin Avatar" />
                                <span className="text-sm font-medium text-gray-700 hidden sm:block">Admin Sucofindo</span>
                                <ChevronDown className="h-4 w-4 text-gray-500" />
                            </button>
                            {isProfileOpen && (
                                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border z-20">
                                    <div className="p-4 border-b"><p className="font-semibold text-gray-800">Admin Sucofindo</p><p className="text-xs text-gray-500">admin@sucofindo.co.id</p></div>
                                    <div className="py-2">
                                        <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"><Bell className="w-4 h-4 mr-3" />Notifications<span className="ml-auto bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">3</span></a>
                                        <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"><User className="w-4 h-4 mr-3" />Profile</a>
                                        <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"><Settings className="w-4 h-4 mr-3" />Settings</a>
                                    </div>
                                    <div className="p-2 border-t"><button className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md"><LogOut className="w-4 h-4 mr-3" />Logout</button></div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            <nav className="bg-white border-b">
                <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 flex space-x-6">
                    {tabs.map((tab) => (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-semibold text-sm transition-colors ${activeTab === tab.id ? "border-blue-500 text-blue-600" : "border-transparent text-gray-600 hover:text-blue-600"}`}
                        ><tab.icon className="h-5 w-5" /><span>{tab.label}</span></button>
                    ))}
                </div>
            </nav>

            <main className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {activeTab === 'overview' && <Overview stats={stats} tasks={auditTasks} auditorsList={auditors} />}
                {activeTab === 'requests' && <RequestsTable requests={requests} />}
                {activeTab === 'auditors' && <AuditorsView auditors={auditors} tasks={auditTasks} />}
                {activeTab === 'map' && <GeospatialView />}
            </main>
        </div>
    );
};

export default AdminDashboard;
