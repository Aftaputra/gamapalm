import React from 'react';
import { Auditor, AuditTask } from '@/types'; // Path disesuaikan
import { MapPin, Briefcase } from 'lucide-react';

type AuditorsViewProps = {
  auditors: Auditor[];
  tasks: AuditTask[];
};

const AuditorsView = ({ auditors, tasks }: AuditorsViewProps) => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Manajemen Auditor</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {auditors.map((auditor) => {
          // Cari semua tugas yang cocok dengan ID auditor ini
          const assignedTasks = tasks.filter(task => task.auditorId === auditor.id);

          return (
            <div key={auditor.id} className="bg-white rounded-lg shadow-md border p-6 flex flex-col space-y-4">
              {/* Bagian Profil Utama */}
              <div className="flex items-center space-x-4">
                <img src={auditor.avatarUrl} alt={auditor.name} className="w-16 h-16 rounded-full" />
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-800">{auditor.name}</h3>
                  <p className="text-sm text-gray-500">{auditor.email}</p>
                  <p className="text-xs text-gray-500 mt-1 flex items-center"><MapPin className="w-3 h-3 mr-1"/>{auditor.location}</p>
                </div>
              </div>

              {/* Bagian Penugasan Saat Ini */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                  <Briefcase className="w-4 h-4 mr-2" />
                  Tugas Aktif ({assignedTasks.length})
                </h4>
                <div className="space-y-2 text-sm max-h-40 overflow-y-auto pr-2">
                  {assignedTasks.length > 0 ? (
                    assignedTasks.map((task) => (
                      <div key={task.id} className="bg-slate-50 p-2 rounded-md border">
                        <p className="font-semibold text-gray-800">{task.company}</p>
                        <p className="text-xs text-gray-600">Parameter: {task.parameter}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-gray-500 italic">Tidak ada tugas aktif.</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AuditorsView;