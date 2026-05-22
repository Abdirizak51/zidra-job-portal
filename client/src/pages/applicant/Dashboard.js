import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { applicationsAPI, savedJobsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { JobCardSkeleton } from '../../components/common/Skeleton';

const STATUS_STYLE = {
  pending:   { bg: 'bg-yellow-100 dark:bg-yellow-900/30',  text: 'text-yellow-700 dark:text-yellow-400',  icon: '⏳', label: 'Pending'     },
  reviewing: { bg: 'bg-blue-100 dark:bg-blue-900/30',     text: 'text-blue-700 dark:text-blue-400',      icon: '⭐', label: 'Shortlisted' },
  accepted:  { bg: 'bg-green-100 dark:bg-green-900/30',   text: 'text-green-700 dark:text-green-400',    icon: '✅', label: 'Accepted'    },
  rejected:  { bg: 'bg-red-100 dark:bg-red-900/30',       text: 'text-red-700 dark:text-red-400',        icon: '❌', label: 'Rejected'    },
};

const ApplicantDashboard = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [savedJobs, setSavedJobs]       = useState([]);
  const [loading, setLoading]           = useState(true);

  useEffect(() => {
    Promise.all([
      applicationsAPI.getMyApplications(),
      savedJobsAPI.getSavedJobs(),
    ]).then(([appRes, savedRes]) => {
      setApplications(appRes.data.data.applications || []);
      setSavedJobs(savedRes.data.data.savedJobs || []);
    }).catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const counts = {
    total:     applications.length,
    pending:   applications.filter(a => a.status === 'pending').length,
    reviewing: applications.filter(a => a.status === 'reviewing').length,
    accepted:  applications.filter(a => a.status === 'accepted').length,
    rejected:  applications.filter(a => a.status === 'rejected').length,
  };

  const stats = [
    { label: 'Applied',      value: counts.total,     icon: '📋', color: 'from-blue-500 to-brand-600'    },
    { label: 'Pending',      value: counts.pending,   icon: '⏳', color: 'from-yellow-400 to-orange-500' },
    { label: 'Shortlisted',  value: counts.reviewing, icon: '⭐', color: 'from-purple-500 to-accent-600' },
    { label: 'Accepted',     value: counts.accepted,  icon: '✅', color: 'from-green-400 to-emerald-600' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white">
              Welcome back, {user?.name?.split(' ')[0]}! 👋
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Track your job applications and saved jobs</p>
          </div>
          <Link to="/jobs" className="bg-brand-600 hover:bg-brand-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            Find Jobs
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 animate-slide-up" style={{ animationDelay: `${i * 0.07}s` }}>
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-base mb-3`}>
                {stat.icon}
              </div>
              <div className="font-display text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Recent Applications */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-gray-900 dark:text-white">Recent Applications</h2>
              <Link to="/applied-jobs" className="text-sm text-brand-600 hover:text-brand-700 font-medium">View all →</Link>
            </div>

            {loading ? (
              <div className="space-y-3">
                {Array(3).fill(0).map((_, i) => <div key={i} className="h-20 bg-gray-100 dark:bg-gray-700 rounded-xl animate-pulse" />)}
              </div>
            ) : applications.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-5xl mb-3">📭</div>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">No applications yet</p>
                <Link to="/jobs" className="bg-brand-600 hover:bg-brand-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors">Browse Jobs →</Link>
              </div>
            ) : (
              <div className="space-y-3">
                {applications.slice(0, 5).map(app => {
                  const s = STATUS_STYLE[app.status] || STATUS_STYLE.pending;
                  return (
                    <div key={app.id} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-100 to-accent-100 dark:from-brand-900/40 dark:to-accent-900/40 flex items-center justify-center font-bold text-brand-600 dark:text-brand-400 flex-shrink-0">
                        {app.job?.company?.company_name?.charAt(0) || '?'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">{app.job?.title}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{app.job?.company?.company_name}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${s.bg} ${s.text}`}>
                          {s.icon} {s.label}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right side */}
          <div className="space-y-5">

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
              <div className="space-y-2">
                {[
                  { to: '/jobs',        icon: '🔍', label: 'Browse Jobs'       },
                  { to: '/profile',     icon: '👤', label: 'Edit Profile'      },
                  { to: '/saved-jobs',  icon: '🔖', label: 'Saved Jobs'        },
                  { to: '/applied-jobs',icon: '📋', label: 'All Applications'  },
                ].map((item, i) => (
                  <Link key={i} to={item.to} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group">
                    <span className="text-lg">{item.icon}</span>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">{item.label}</span>
                    <svg className="w-4 h-4 text-gray-300 dark:text-gray-600 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </Link>
                ))}
              </div>
            </div>

            {/* Profile completion */}
            <div className="bg-gradient-to-br from-brand-600 to-accent-600 rounded-2xl p-5 text-white">
              <div className="text-2xl mb-2">💡</div>
              <h3 className="font-semibold mb-1">Complete your profile</h3>
              <p className="text-blue-100 text-xs leading-relaxed mb-4">
                A complete profile increases your chances of getting hired by 3x.
              </p>
              <Link to="/profile" className="bg-white/20 hover:bg-white/30 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors inline-block">
                Update Profile →
              </Link>
            </div>

            {/* Saved jobs count */}
            {savedJobs.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900 dark:text-white">Saved Jobs</h3>
                  <Link to="/saved-jobs" className="text-xs text-brand-600 hover:text-brand-700 font-medium">View all</Link>
                </div>
                <div className="space-y-2">
                  {savedJobs.slice(0, 3).map(s => (
                    <Link key={s.id} to={`/jobs/${s.job?.id}`} className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                      <div className="w-8 h-8 rounded-lg bg-brand-50 dark:bg-brand-900/30 flex items-center justify-center text-brand-600 font-bold text-xs flex-shrink-0">
                        {s.job?.company?.company_name?.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate">{s.job?.title}</p>
                        <p className="text-xs text-gray-400 truncate">{s.job?.company?.company_name}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicantDashboard;
