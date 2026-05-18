import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { jobsAPI, companiesAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { StatCardSkeleton } from '../../components/common/Skeleton';

const statusColors = {
  pending:  'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  approved: 'bg-green-100  text-green-700  dark:bg-green-900/30  dark:text-green-400',
  rejected: 'bg-red-100    text-red-700    dark:bg-red-900/30    dark:text-red-400',
  closed:   'bg-gray-100   text-gray-600   dark:bg-gray-700      dark:text-gray-400',
};

const PIE_COLORS = ['#f59e0b', '#3b82f6', '#10b981', '#ef4444', '#8b5cf6'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white shadow-lg">
        <p className="font-semibold mb-1">{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }}>{p.name}: {p.value}</p>
        ))}
      </div>
    );
  }
  return null;
};

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
  const totalViews      = jobs.reduce((sum, j) => sum + (j.views || 0), 0);

  const stats = [
    { label: 'Posted Jobs',      value: jobs.length,                                         icon: '📋', color: 'from-blue-500 to-brand-600'   },
    { label: 'Total Applicants', value: totalApplicants,                                      icon: '👥', color: 'from-purple-500 to-accent-600' },
    { label: 'Active Jobs',      value: jobs.filter(j => j.status === 'approved').length,     icon: '✅', color: 'from-green-400 to-emerald-600' },
    { label: 'Total Views',      value: totalViews,                                           icon: '👁️', color: 'from-orange-400 to-rose-500'   },
  ];

  // Bar chart: applicants per job (top 6)
  const barData = jobs
    .filter(j => (j.applications?.length || 0) > 0 || (j.views || 0) > 0)
    .slice(0, 6)
    .map(j => ({
      name:       j.title.length > 12 ? j.title.substring(0, 12) + '…' : j.title,
      Applicants: j.applications?.length || 0,
      Views:      j.views || 0,
    }));

  // Pie chart: application status breakdown
  const appStatusRaw = jobs.reduce((acc, j) => {
    (j.applications || []).forEach(a => {
      acc[a.status] = (acc[a.status] || 0) + 1;
    });
    return acc;
  }, {});
  const pieData = Object.entries(appStatusRaw).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value
  }));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white">
              Employer Dashboard
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Welcome back, {user?.name?.split(' ')[0]}! 👋
            </p>
          </div>
          <Link
            to="/employer/post-job"
            className="bg-brand-600 hover:bg-brand-700 text-white px-5 py-2.5 rounded-xl font-medium text-sm transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Post Job
          </Link>
        </div>

        {/* No company warning */}
        {!loading && !company && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-2xl p-5 mb-6 flex items-center gap-4">
            <div className="text-3xl">⚠️</div>
            <div className="flex-1">
              <p className="font-semibold text-yellow-800 dark:text-yellow-400">Company profile not set up</p>
              <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-0.5">Create your company profile before posting jobs</p>
            </div>
            <Link to="/employer/company" className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              Setup Now
            </Link>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {loading
            ? Array(4).fill(0).map((_, i) => <StatCardSkeleton key={i} />)
            : stats.map((stat, i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 animate-slide-up"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-lg mb-3`}>
                  {stat.icon}
                </div>
                <div className="font-display text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{stat.label}</div>
              </div>
            ))
          }
        </div>

        {/* Charts — only show when there's data */}
        {!loading && jobs.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

            {/* Bar chart */}
            <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Job Performance</h3>
              <p className="text-xs text-gray-400 mb-4">Applicants & views per job posting</p>
              {barData.length > 0 ? (
                <ResponsiveContainer width="100%" height={210}>
                  <BarChart data={barData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} allowDecimals={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="Applicants" fill="#3b82f6" radius={[5, 5, 0, 0]} />
                    <Bar dataKey="Views"      fill="#a855f7" radius={[5, 5, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-48 flex flex-col items-center justify-center text-gray-400">
                  <span className="text-4xl mb-2">📊</span>
                  <p className="text-sm">Data will appear once candidates apply</p>
                </div>
              )}
            </div>

            {/* Pie chart */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Application Status</h3>
              <p className="text-xs text-gray-400 mb-2">Across all your jobs</p>
              {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height={210}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%" cy="42%"
                      innerRadius={48} outerRadius={72}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {pieData.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-48 flex flex-col items-center justify-center text-gray-400">
                  <span className="text-4xl mb-2">🥧</span>
                  <p className="text-sm">No applications yet</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Quick actions */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { to: '/employer/post-job', icon: '➕', label: 'Post New Job'     },
            { to: '/employer/jobs',     icon: '📋', label: 'My Jobs'          },
            { to: '/employer/company',  icon: '🏢', label: 'Company Profile'  },
            { to: '/jobs',              icon: '🔍', label: 'Browse Market'    },
          ].map((action, i) => (
            <Link
              key={i} to={action.to}
              className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-4 text-center hover:border-brand-300 dark:hover:border-brand-600 hover:shadow-sm transition-all group"
            >
              <div className="text-2xl mb-2">{action.icon}</div>
              <p className="text-xs font-medium text-gray-700 dark:text-gray-300 group-hover:text-brand-600 transition-colors">
                {action.label}
              </p>
            </Link>
          ))}
        </div>

        {/* Recent jobs */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-gray-900 dark:text-white">My Job Postings</h2>
            <Link to="/employer/jobs" className="text-sm text-brand-600 hover:text-brand-700 font-medium">
              View all →
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3 animate-pulse">
              {Array(3).fill(0).map((_, i) => (
                <div key={i} className="h-16 bg-gray-100 dark:bg-gray-700 rounded-xl" />
              ))}
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-10">
              <div className="text-4xl mb-3">📭</div>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">No jobs posted yet</p>
              <Link
                to="/employer/post-job"
                className="bg-brand-600 hover:bg-brand-700 text-white px-5 py-2 rounded-xl text-sm font-medium transition-colors"
              >
                Post your first job
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {jobs.slice(0, 5).map(job => (
                <div
                  key={job.id}
                  className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white text-sm truncate">{job.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 capitalize mt-0.5">
                      {job.job_type?.replace('-', ' ')} • {job.location} • 👁️ {job.views || 0}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                      {job.applications?.length || 0} applicants
                    </span>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${statusColors[job.status] || statusColors.pending}`}>
                      {job.status}
                    </span>
                    <Link
                      to={`/employer/jobs/${job.id}/applicants`}
                      className="text-xs bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 px-3 py-1.5 rounded-lg font-medium hover:bg-brand-100 dark:hover:bg-brand-900/40 transition-colors"
                    >
                      View
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default EmployerDashboard;
