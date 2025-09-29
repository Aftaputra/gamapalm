import React from 'react';
import StatCard from '../shared/StatCard'; // Import dari folder shared
import { FileText, Clock, CheckCircle, AlertTriangle } from 'lucide-react';

type OverviewProps = {
  stats: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  };
};

const Overview = ({ stats }: OverviewProps) => (
  <div className="space-y-6">
    <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard icon={FileText} title="Total Requests" value={stats.total} color="blue" />
      <StatCard icon={Clock} title="Pending" value={stats.pending} color="yellow" />
      <StatCard icon={CheckCircle} title="Approved" value={stats.approved} color="green" />
      <StatCard icon={AlertTriangle} title="Rejected" value={stats.rejected} color="red" />
    </div>
  </div>
);

export default Overview;