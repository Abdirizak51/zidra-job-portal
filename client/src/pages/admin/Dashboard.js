import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { adminAPI } from '../../services/api';
import { StatCardSkeleton } from '../../components/common/Skeleton';

const statusColors = {
  pending:  'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400 border border-amber-200 dark:border-amber-800',
  approved: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800',
  rejected: 'bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400 border border-rose-200 dark:border-rose-800',
};

const roleColors = {
  applicant: 'text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/20',
  employer:  'text-accent-600 dark:text-accent-400 bg-accent-50 dark:bg-accent-900/20',
  admin:     'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/20',
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
        stats: { ...prev.stats, pendingJobs: Math.max(0, prev.stats.pendingJobs - 1) },
      }));
      toast.success(`Job ${status}!`);
    } catch { toast.error('Failed to update job'); }
    finally { setUpdating(null); }
  };

  const stats = data ? [
    { label: 'Total Users',        value: data.stats.totalUsers,        icon: '👥', color: 'from-blue-500 to-brand-600',     to: '/admin/users' },
    { label: 'Total Jobs',         value: data.stats.totalJobs,         icon: '📋', color: 'from-purple-500 to-accent-600',  to: '/admin/jobs' },
    { label: 'Applications',       value: data.stats.totalApplications, icon: '📄', color: 'from-emerald-400 to-teal-600',   to: '/admin/jobs' },
    { label: 'Pending Approvals',  value: data.stats.pendingJobs,       icon: '⏳', color: 'from-amber-400 to-orange-500',   to: '/admin/jobs?status=pending' },
    { label: 'Companies',          value: data.stats.totalCompanies,    icon: '🏢', color: 'from-rose-400 to-pink-600',      to: '/admin/users' },
  ] : [];

  const pendingJobs = data?.recentJobs?.filter(j => j.status === 'pending') || [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="h-1 bg-gradient-to-r from-rose-500 via-accent-500 to-brand-600" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="flex items-start justify-between mb-10">
          <div className="animate-fade-in">
            <p className="text-xs text-gray-400 font-medium uppercase tracking-widest mb-1">Control Panel</p>
            <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">Platform overview & management</p>
          </div>
          {!loading && data?.stats?.pendingJobs > 0 && (
            <Link
              to="/admin/jobs?status=pending"
              className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-lg shadow-amber-500/20 hover:-translate-y-0.5"
            >
              <span className="w-5 h-5 rounded-full bg-white text-amber-600 text-xs font-bold flex items-center justify-center">
                {data.stats.pendingJobs}
              </span>
              Review Pending
            </Link>
          )}
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {loading
            ? Array(5).fill(0).map((_, i) => <StatCardSkeleton key={i} />)
            : stats.map((stat, i) => (
              <Link
                key={i} to={stat.to}
                className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 hover:border-brand-200 dark:hover:border-brand-800 hover:shadow-lg hover:shadow-brand-500/5 transition-all duration-200 hover:-translate-y-0.5 animate-slide-up group"
                style={{ animationDelay: `${i * 0.07}s` }}
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-lg mb-4`}>
                  {stat.icon}
                </div>
                <div className="font-display text-2xl font-bold text-gray-900 dark:text-white tabular-nums">{stat.value}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium group-hover:text-brand-500 transition-colors">{stat.label}</div>
              </Link>
            ))
          }
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">

          {/* Pending approvals */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2.5">
                <h2 className="font-display font-semibold text-gray-900 dark:text-white">Pending Approvals</h2>
                {!loading && pendingJobs.length > 0 && (
                  <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-bold px-2 py-0.5 rounded-full">
                    {pendingJobs.length}
                  </span>
                )}
              </div>
              <Link to="/admin/jobs?status=pending" className="text-xs font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400">
                View all →
              </Link>
            </div>

            {loading ? (
              <div className="p-6 space-y-3 animate-pulse">
                {Array(3).fill(0).map((_, i) => <div key={i} className="h-14 bg-gray-100 dark:bg-gray-800 rounded-xl" />)}
              </div>
            ) : pendingJobs.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-4xl mb-3">✅</div>
                <p className="font-semibold text-gray-900 dark:text-white text-sm mb-1">All caught up!</p>
                <p className="text-xs text-gray-400">No jobs waiting for review</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50 dark:divide-gray-800">
                {pendingJobs.map(job => (
                  <div key={job.id} className="flex items-center gap-4 px-6 py-3.5">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{job.title}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{job.company?.company_name}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        disabled={updating === job.id}
                        onClick={() => handleJobStatus(job.id, 'approved')}
                        className="text-xs font-semibold bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50 border border-emerald-200 dark:border-emerald-800"
                      >
                        ✓ Approve
                      </button>
                      <button
                        disabled={updating === job.id}
                        onClick={() => handleJobStatus(job.id, 'rejected')}
                        className="text-xs font-semibold bg-rose-50 dark:bg-rose-900/20 hover:bg-rose-100 dark:hover:bg-rose-900/40 text-rose-700 dark:text-rose-400 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50 border border-rose-200 dark:border-rose-800"
                      >
                        ✕ Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent users */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
              <h2 className="font-display font-semibold text-gray-900 dark:text-white">Recent Users</h2>
              <Link to="/admin/users" className="text-xs font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400">
                Manage all →
              </Link>
            </div>

            {loading ? (
              <div className="p-6 space-y-3 animate-pulse">
                {Array(4).fill(0).map((_, i) => <div key={i} className="h-12 bg-gray-100 dark:bg-gray-800 rounded-xl" />)}
              </div>
            ) : (
              <div className="divide-y divide-gray-50 dark:divide-gray-800">
                {data?.recentUsers?.map(u => (
                  <div key={u.id} className="flex items-center gap-4 px-6 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                      {u.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{u.name}</p>
                      <p className="text-xs text-gray-400 truncate">{u.email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-lg capitalize ${roleColors[u.role] || roleColors.applicant}`}>
                        {u.role}
                      </span>
                      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${u.is_active ? 'bg-emerald-400' : 'bg-gray-300 dark:bg-gray-600'}`} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Bottom quick links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              to: '/admin/users', icon: '👥', title: 'Manage Users',
              desc: 'View, block, or delete users', color: 'from-brand-500 to-brand-600',
              stat: data?.stats?.totalUsers,
            },
            {
              to: '/admin/jobs', icon: '📋', title: 'Manage Jobs',
              desc: 'Approve, reject, or close listings', color: 'from-accent-500 to-accent-600',
              stat: data?.stats?.totalJobs,
            },
            {
              to: '/admin/reports', icon: '📊', title: 'Analytics & Reports',
              desc: 'Platform statistics and insights', color: 'from-emerald-500 to-teal-600',
              stat: null,
            },
          ].map(link => (
            <Link
              key={link.to} to={link.to}
              className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 hover:border-brand-200 dark:hover:border-brand-800 hover:shadow-lg hover:shadow-brand-500/5 transition-all duration-200 hover:-translate-y-0.5 group flex items-center gap-4"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${link.color} flex items-center justify-center text-2xl flex-shrink-0 shadow-sm`}>
                {link.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-display font-semibold text-gray-900 dark:text-white text-sm group-hover:text-brand-600 transition-colors">{link.title}</h3>
                  {link.stat !== null && link.stat !== undefined && (
                    <span className="text-xs text-gray-400 font-mono">({link.stat})</span>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-0.5">{link.desc}</p>
              </div>
              <svg className="w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:text-brand-400 transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
