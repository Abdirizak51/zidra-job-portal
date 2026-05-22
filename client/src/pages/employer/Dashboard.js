import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { jobsAPI, companiesAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { StatCardSkeleton } from '../../components/common/Skeleton';

const statusColors = {
  pending:  'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400 border border-amber-200 dark:border-amber-800',
  approved: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800',
  rejected: 'bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400 border border-rose-200 dark:border-rose-800',
  closed:   'bg-gray-50 text-gray-500 dark:bg-gray-800 dark:text-gray-400 border border-gray-200 dark:border-gray-700',
};

const PIE_COLORS = ['#f59e0b', '#3b82f6', '#10b981', '#ef4444', '#8b5cf6'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900 dark:bg-gray-950 border border-gray-700 rounded-xl px-3 py-2.5 text-xs text-white shadow-2xl">
        <p className="font-semibold mb-1.5 text-gray-200">{label}</p>
        {payload.map((p, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: p.color }} />
            <span className="text-gray-400">{p.name}:</span>
            <span className="font-semibold">{p.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const StatCard = ({ stat, index }) => (
  <div
    className="relative overflow-hidden bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 group hover:border-brand-200 dark:hover:border-brand-800 transition-all duration-300 hover:shadow-lg hover:shadow-brand-500/5 animate-slide-up"
    style={{ animationDelay: `${index * 0.07}s` }}
  >
    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      style={{
        background: 'radial-gradient(ellipse at top left, rgba(37,99,235,0.04) 0%, transparent 60%)'
      }}
    />
    <div className="relative">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-xl shadow-sm`}>
          {stat.icon}
        </div>
        {stat.change !== undefined && (
          <span className={`text-xs font-semibold px-2 py-1 rounded-lg ${
            stat.change >= 0
              ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400'
              : 'bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400'
          }`}>
            {stat.change >= 0 ? '+' : ''}{stat.change}%
          </span>
        )}
      </div>
      <div className="font-display text-3xl font-bold text-gray-900 dark:text-white tabular-nums">{stat.value}</div>
      <div className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium">{stat.label}</div>
    </div>
  </div>
);

const EmployerDashboard = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([jobsAPI.getMyJobs(), companiesAPI.getMyCompany()])
      .then(([jobsRes, companyRes]) => {
        setJobs(jobsRes.data.data.jobs || []);
        setCompany(companyRes.data.data.company);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const totalApplicants = jobs.reduce((sum, j) => sum + (j.applications?.length || 0), 0);
  const totalViews = jobs.reduce((sum, j) => sum + (j.views || 0), 0);

  const stats = [
    { label: 'Jobs Posted', value: jobs.length, icon: '📋', color: 'from-blue-500 to-brand-600' },
    { label: 'Total Applicants', value: totalApplicants, icon: '👥', color: 'from-purple-500 to-accent-600' },
    { label: 'Active Jobs', value: jobs.filter(j => j.status === 'approved').length, icon: '✅', color: 'from-emerald-400 to-teal-600' },
    { label: 'Profile Views', value: totalViews, icon: '👁️', color: 'from-orange-400 to-rose-500' },
  ];

  const barData = jobs
    .filter(j => (j.applications?.length || 0) > 0 || (j.views || 0) > 0)
    .slice(0, 6)
    .map(j => ({
      name: j.title.length > 14 ? j.title.substring(0, 14) + '…' : j.title,
      Applicants: j.applications?.length || 0,
      Views: j.views || 0,
    }));

  const appStatusRaw = jobs.reduce((acc, j) => {
    (j.applications || []).forEach(a => { acc[a.status] = (acc[a.status] || 0) + 1; });
    return acc;
  }, {});
  const pieData = Object.entries(appStatusRaw).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value,
  }));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Top gradient bar */}
      <div className="h-1 bg-gradient-to-r from-brand-500 via-accent-500 to-brand-600" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="flex items-start justify-between mb-10">
          <div className="animate-fade-in">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center text-white font-display font-bold text-lg">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-widest">Employer Dashboard</p>
                <h1 className="font-display text-2xl font-bold text-gray-900 dark:text-white leading-none">
                  Hello, {user?.name?.split(' ')[0]} 👋
                </h1>
              </div>
            </div>
          </div>
          <Link
            to="/employer/post-job"
            className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 shadow-lg shadow-brand-500/20 hover:shadow-brand-500/30 hover:-translate-y-0.5"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            Post a Job
          </Link>
        </div>

        {/* Company warning */}
        {!loading && !company && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 border border-amber-200 dark:border-amber-800 rounded-2xl p-5 mb-8 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-xl flex-shrink-0">⚠️</div>
            <div className="flex-1">
              <p className="font-semibold text-amber-900 dark:text-amber-400 text-sm">Company profile missing</p>
              <p className="text-xs text-amber-700 dark:text-amber-500 mt-0.5">Set up your company profile to start attracting candidates</p>
            </div>
            <Link to="/employer/company" className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-xl text-xs font-semibold transition-colors flex-shrink-0">
              Setup Now →
            </Link>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {loading
            ? Array(4).fill(0).map((_, i) => <StatCardSkeleton key={i} />)
            : stats.map((stat, i) => <StatCard key={i} stat={stat} index={i} />)
          }
        </div>

        {/* Charts */}
        {!loading && jobs.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-8">
            {/* Area chart */}
            <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-display font-semibold text-gray-900 dark:text-white">Job Performance</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Applicants & views per posting</p>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-400">
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-brand-500" />Applicants</span>
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-accent-500" />Views</span>
                </div>
              </div>
              {barData.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={barData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                    <defs>
                      <linearGradient id="applicantGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="viewGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#a855f7" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} allowDecimals={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="Applicants" stroke="#3b82f6" strokeWidth={2} fill="url(#applicantGrad)" dot={{ r: 3, fill: '#3b82f6' }} />
                    <Area type="monotone" dataKey="Views" stroke="#a855f7" strokeWidth={2} fill="url(#viewGrad)" dot={{ r: 3, fill: '#a855f7' }} />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-48 flex flex-col items-center justify-center text-gray-300 dark:text-gray-600">
                  <span className="text-5xl mb-3">📊</span>
                  <p className="text-sm font-medium text-gray-400">Data appears once candidates apply</p>
                </div>
              )}
            </div>

            {/* Pie chart */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
              <div className="mb-4">
                <h3 className="font-display font-semibold text-gray-900 dark:text-white">Application Status</h3>
                <p className="text-xs text-gray-400 mt-0.5">Across all job postings</p>
              </div>
              {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="40%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">
                      {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: 11, paddingTop: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-48 flex flex-col items-center justify-center text-gray-300 dark:text-gray-600">
                  <span className="text-5xl mb-3">🥧</span>
                  <p className="text-sm font-medium text-gray-400">No applications yet</p>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Jobs table */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
              <h2 className="font-display font-semibold text-gray-900 dark:text-white">My Job Postings</h2>
              <Link to="/employer/jobs" className="text-xs font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400 flex items-center gap-1">
                View all
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
              </Link>
            </div>

            {loading ? (
              <div className="p-6 space-y-3 animate-pulse">
                {Array(3).fill(0).map((_, i) => <div key={i} className="h-14 bg-gray-100 dark:bg-gray-800 rounded-xl" />)}
              </div>
            ) : jobs.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-5xl mb-4">📭</div>
                <p className="font-semibold text-gray-900 dark:text-white mb-1">No jobs posted yet</p>
                <p className="text-sm text-gray-400 mb-5">Start attracting top talent today</p>
                <Link to="/employer/post-job" className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors">
                  Post your first job →
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-gray-50 dark:divide-gray-800">
                {jobs.slice(0, 6).map((job, i) => (
                  <div key={job.id} className="flex items-center gap-4 px-6 py-3.5 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-100 to-accent-100 dark:from-brand-900/40 dark:to-accent-900/40 flex items-center justify-center flex-shrink-0">
                      <span className="text-brand-600 dark:text-brand-400 font-bold text-sm">{i + 1}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 dark:text-white text-sm truncate">{job.title}</p>
                      <p className="text-xs text-gray-400 mt-0.5 capitalize">{job.job_type?.replace('-', ' ')} · {job.location}</p>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <div className="text-right">
                        <p className="text-sm font-bold text-gray-900 dark:text-white tabular-nums">{job.applications?.length || 0}</p>
                        <p className="text-xs text-gray-400">applicants</p>
                      </div>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg capitalize ${statusColors[job.status] || statusColors.pending}`}>
                        {job.status}
                      </span>
                      <Link to={`/employer/jobs/${job.id}/applicants`} className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline">
                        View →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right column */}
          <div className="space-y-5">
            {/* Quick actions */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
              <h3 className="font-display font-semibold text-gray-900 dark:text-white mb-4 text-sm">Quick Actions</h3>
              <div className="space-y-1.5">
                {[
                  { to: '/employer/post-job', icon: '➕', label: 'Post New Job', desc: 'Attract new candidates' },
                  { to: '/employer/jobs', icon: '📋', label: 'My Jobs', desc: 'Manage all postings' },
                  { to: '/employer/company', icon: '🏢', label: 'Company Profile', desc: 'Update your info' },
                  { to: '/jobs', icon: '🔍', label: 'Browse Market', desc: 'See competition' },
                ].map((action, i) => (
                  <Link
                    key={i} to={action.to}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
                  >
                    <span className="text-lg w-7 text-center">{action.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">{action.label}</p>
                      <p className="text-xs text-gray-400">{action.desc}</p>
                    </div>
                    <svg className="w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:text-brand-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </Link>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="relative overflow-hidden bg-gradient-to-br from-brand-600 to-accent-700 rounded-2xl p-5 text-white">
              <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/10" />
              <div className="absolute -bottom-8 -left-4 w-32 h-32 rounded-full bg-white/5" />
              <div className="relative">
                <span className="text-2xl">🚀</span>
                <h3 className="font-display font-bold mt-2 mb-1">Boost your reach</h3>
                <p className="text-blue-100 text-xs leading-relaxed">Complete your company profile to attract 3x more qualified candidates.</p>
                <Link to="/employer/company" className="inline-block mt-4 bg-white text-brand-700 text-xs font-bold px-4 py-2 rounded-xl hover:bg-blue-50 transition-colors">
                  Complete Profile →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerDashboard;
