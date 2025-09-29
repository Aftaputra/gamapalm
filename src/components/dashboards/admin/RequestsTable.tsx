import React from 'react';
import { RequestItem } from '@/types';

type RequestsTableProps = {
  requests: RequestItem[];
};

const RequestsTable = ({ requests }: RequestsTableProps) => {
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
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Certification Requests</h1>
      <div className="bg-white rounded-lg shadow-md overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>{["Request ID", "Company", "Status", "Actions"].map(header => (<th key={header} className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">{header}</th>))}</tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {requests.map((req) => (
              <tr key={req.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm font-semibold text-gray-900">REQ-{req.id}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{req.company}</td>
                <td className="px-6 py-4">{getStatusBadge(req.status)}</td>
                <td className="px-6 py-4 text-sm"><button className="px-3 py-1 text-xs font-semibold text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200">View</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RequestsTable;