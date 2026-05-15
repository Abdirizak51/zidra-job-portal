import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { applicationsAPI, savedJobsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { StatCardSkeleton, JobCardSkeleton } from '../../components/common/Skeleton';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  reviewing: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  accepted: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  rejected: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

const ApplicantDashboard = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appRes, savedRes] = await Promise.all([
          applicationsAPI.getMyApplications(),
          savedJobsAPI.getSavedJobs(),
        ]);
        setApplications(appRes.data.data.applications);
        setSavedJobs(savedRes.data.data.savedJobs);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const stats = [
    { label: 'Total Applications', value: applications.length, icon: '📄', color: 'from-blue-500 to-brand-600' },
    { label: 'Pending', value: applications.filter(a => a.status === 'pending').length, icon: '⏳', color: 'from-yellow-400 to-orange-500' },
    { label: 'Accepted', value: applications.filter(a => a.status === 'accepted').length, icon: '✅', color: 'from-green-400 to-emerald-600' },
    { label: 'Saved Jobs', value: savedJobs.length, icon: '🔖', color: 'from-purple-400 to-accent-600' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back, {user?.name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Track your job search journey</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {loading ? Array(4).fill(0).map((_, i) => <StatCardSkeleton key={i} />) : stats.map((stat, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 animate-slide-up" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-lg mb-3`}>
                {stat.icon}
              </div>
              <div className="font-display text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Applications */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-gray-900 dark:text-white">Recent Applications</h2>
              <Link to="/applied-jobs" className="text-sm text-brand-600 hover:text-brand-700 font-medium">View all</Link>
            </div>

            {loading ? (
              <div className="space-y-3">{Array(3).fill(0).map((_, i) => <JobCardSkeleton key={i} />)}</div>
            ) : applications.length === 0 ? (
              <div className="text-center py-10">
                <div className="text-4xl mb-3">📋</div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">No applications yet</p>
                <Link to="/jobs" className="mt-3 inline-block text-brand-600 hover:text-brand-700 font-medium text-sm">Browse Jobs →</Link>
              </div>
            ) : (
              <div className="space-y-3">
                {applications.slice(0, 5).map(app => (
                  <div key={app.id} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-100 to-accent-100 dark:from-brand-900 dark:to-accent-900 flex items-center justify-center flex-shrink-0">
                      <span className="text-brand-600 font-bold text-sm">{app.job?.company?.company_name?.charAt(0)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{app.job?.title}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{app.job?.company?.company_name}</p>
                    </div>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${statusColors[app.status]}`}>
                      {app.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions + Saved */}
          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
              <div className="space-y-2">
                {[
                  { to: '/jobs', icon: '🔍', label: 'Browse Jobs' },
                  { to: '/profile', icon: '👤', label: 'Edit Profile' },
                  { to: '/saved-jobs', icon: '🔖', label: 'Saved Jobs' },
                  { to: '/applied-jobs', icon: '📋', label: 'My Applications' },
                ].map(action => (
                  <Link key={action.to} to={action.to}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300 text-sm"
                  >
                    <span className="text-lg">{action.icon}</span>
                    {action.label}
                    <svg className="w-4 h-4 ml-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </Link>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-brand-600 to-accent-700 rounded-2xl p-5 text-white">
              <div className="text-2xl mb-2">💡</div>
              <h3 className="font-semibold mb-1">Complete your profile</h3>
              <p className="text-blue-100 text-xs leading-relaxed">A complete profile increases your chances of getting hired by 3x.</p>
              <Link to="/profile" className="inline-block mt-3 bg-white text-brand-700 text-xs font-semibold px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors">
                Update Profile →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicantDashboard;
