import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { adminAPI } from '../../services/api';
import { StatCardSkeleton } from '../../components/common/Skeleton';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  approved: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  rejected: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    adminAPI.getStats()
      .then(r => setData(r.data.data))
      .catch(() => toast.error('Failed to load stats'))
      .finally(() => setLoading(false));
  }, []);

  const handleJobStatus = async (jobId, status) => {
    setUpdating(jobId);
    try {
      await adminAPI.updateJobStatus(jobId, status);
      setData(prev => ({
        ...prev,
        recentJobs: prev.recentJobs.map(j => j.id === jobId ? { ...j, status } : j),
        stats: { ...prev.stats, pendingJobs: Math.max(0, prev.stats.pendingJobs - 1) }
      }));
      toast.success(`Job ${status}!`);
    } catch { toast.error('Failed to update job'); }
    finally { setUpdating(null); }
  };

  const stats = data ? [
    { label: 'Total Users', value: data.stats.totalUsers, icon: '👥', color: 'from-blue-500 to-brand-600', to: '/admin/users' },
    { label: 'Total Jobs', value: data.stats.totalJobs, icon: '📋', color: 'from-purple-500 to-accent-600', to: '/admin/jobs' },
    { label: 'Applications', value: data.stats.totalApplications, icon: '📄', color: 'from-green-400 to-emerald-600', to: '/admin/jobs' },
    { label: 'Pending Approvals', value: data.stats.pendingJobs, icon: '⏳', color: 'from-yellow-400 to-orange-500', to: '/admin/jobs?status=pending' },
    { label: 'Companies', value: data.stats.totalCompanies, icon: '🏢', color: 'from-teal-400 to-cyan-600', to: '/admin/users' },
  ] : [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage users, jobs, and platform activity</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {loading ? Array(5).fill(0).map((_, i) => <StatCardSkeleton key={i} />) : stats.map((stat, i) => (
            <Link key={i} to={stat.to} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 hover:shadow-md transition-shadow animate-slide-up" style={{ animationDelay: `${i * 0.08}s` }}>
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-lg mb-3`}>{stat.icon}</div>
              <div className="font-display text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{stat.label}</div>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pending Jobs */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-gray-900 dark:text-white">Pending Job Approvals</h2>
              <Link to="/admin/jobs?status=pending" className="text-sm text-brand-600 hover:text-brand-700 font-medium">View all</Link>
            </div>
            {loading ? (
              <div className="space-y-3 animate-pulse">{Array(3).fill(0).map((_, i) => <div key={i} className="h-16 bg-gray-100 dark:bg-gray-700 rounded-xl" />)}</div>
            ) : data?.recentJobs?.filter(j => j.status === 'pending').length === 0 ? (
              <div className="text-center py-8">
                <div className="text-3xl mb-2">✅</div>
                <p className="text-sm text-gray-500 dark:text-gray-400">No pending jobs</p>
              </div>
            ) : (
              <div className="space-y-3">
                {data?.recentJobs?.filter(j => j.status === 'pending').map(job => (
                  <div key={job.id} className="flex items-center gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/10 rounded-xl border border-yellow-100 dark:border-yellow-800">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{job.title}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{job.company?.company_name}</p>
                    </div>
                    <div className="flex gap-2">
                      <button disabled={updating === job.id} onClick={() => handleJobStatus(job.id, 'approved')}
                        className="text-xs bg-green-100 dark:bg-green-900/30 hover:bg-green-200 text-green-700 dark:text-green-400 px-2.5 py-1 rounded-lg font-medium transition-colors disabled:opacity-60">
                        Approve
                      </button>
                      <button disabled={updating === job.id} onClick={() => handleJobStatus(job.id, 'rejected')}
                        className="text-xs bg-red-100 dark:bg-red-900/30 hover:bg-red-200 text-red-700 dark:text-red-400 px-2.5 py-1 rounded-lg font-medium transition-colors disabled:opacity-60">
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Users */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-gray-900 dark:text-white">Recent Users</h2>
              <Link to="/admin/users" className="text-sm text-brand-600 hover:text-brand-700 font-medium">Manage all</Link>
            </div>
            {loading ? (
              <div className="space-y-3 animate-pulse">{Array(4).fill(0).map((_, i) => <div key={i} className="h-12 bg-gray-100 dark:bg-gray-700 rounded-xl" />)}</div>
            ) : (
              <div className="space-y-3">
                {data?.recentUsers?.map(user => (
                  <div key={user.id} className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl transition-colors">
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs capitalize text-gray-500 dark:text-gray-400">{user.role}</span>
                      <span className={`w-2 h-2 rounded-full ${user.is_active ? 'bg-green-400' : 'bg-red-400'}`} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick links */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { to: '/admin/users', icon: '👥', title: 'Manage Users', desc: 'View, block, or delete users' },
            { to: '/admin/jobs', icon: '📋', title: 'Manage Jobs', desc: 'Approve, reject, or delete job posts' },
            { to: '/admin/reports', icon: '📊', title: 'View Reports', desc: 'Analytics and system statistics' },
          ].map(link => (
            <Link key={link.to} to={link.to} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 hover:border-brand-300 dark:hover:border-brand-600 hover:shadow-md transition-all group">
              <div className="text-3xl mb-3">{link.icon}</div>
              <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-brand-600 transition-colors">{link.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{link.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
