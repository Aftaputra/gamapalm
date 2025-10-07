"use client";

import React, { useState } from 'react';
import { RequestItem } from '@/types';
import { approveRequest, rejectRequest } from '@/lib/api';
import { Loader2, Check, X } from 'lucide-react';

type RequestsTableProps = {
  requests: RequestItem[];
  onRequestUpdate: () => void;
};

const RequestsTable = ({ requests, onRequestUpdate }: RequestsTableProps) => {
  const [loadingActions, setLoadingActions] = useState<{ [key: number]: 'approve' | 'reject' | null }>({});

  const handleApprove = async (requestId: number) => {
    setLoadingActions(prev => ({ ...prev, [requestId]: 'approve' }));
    
    try {
      const success = await approveRequest(requestId);
      if (success) {
        alert('Request berhasil disetujui dan audit project telah dibuat!');
        onRequestUpdate();
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
        onRequestUpdate();
      } else {
        alert('Gagal menolak request');
      }
    } catch (error) {
      alert('Terjadi kesalahan saat menolak request');
    } finally {
      setLoadingActions(prev => ({ ...prev, [requestId]: null }));
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold";
    switch (status) {
      case "pending": return <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>Pending</span>;
      case "approved": return <span className={`${baseClasses} bg-green-100 text-green-800`}>Approved</span>;
      case "rejected": return <span className={`${baseClasses} bg-red-100 text-red-800`}>Rejected</span>;
      default: return null;
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
                <td className="px-6 py-4">{getStatusBadge(req.status)}</td>
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
                          <X className="w-4 h-4" />
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
                          <Check className="w-4 h-4" />
                        )}
                        Setujui
                      </button>
                    </div>
                  )}
                  {req.status === 'approved' && (
                    <span className="text-xs text-green-600 font-medium">✓ Audit Project Created</span>
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

export default RequestsTable;