import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { jobsAPI, companiesAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { StatCardSkeleton } from '../../components/common/Skeleton';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  approved: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  rejected: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  closed: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400',
};

const EmployerDashboard = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([jobsAPI.getMyJobs(), companiesAPI.getMyCompany()])
      .then(([jobsRes, companyRes]) => {
        setJobs(jobsRes.data.data.jobs);
        setCompany(companyRes.data.data.company);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const totalApplicants = jobs.reduce((sum, j) => sum + (j.applications?.length || 0), 0);
  const stats = [
    { label: 'Posted Jobs', value: jobs.length, icon: '📋', color: 'from-blue-500 to-brand-600' },
    { label: 'Total Applicants', value: totalApplicants, icon: '👥', color: 'from-purple-500 to-accent-600' },
    { label: 'Active Jobs', value: jobs.filter(j => j.status === 'approved').length, icon: '✅', color: 'from-green-400 to-emerald-600' },
    { label: 'Pending Review', value: jobs.filter(j => j.status === 'pending').length, icon: '⏳', color: 'from-yellow-400 to-orange-500' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white">Employer Dashboard</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Welcome back, {user?.name?.split(' ')[0]}!</p>
          </div>
          <Link to="/employer/post-job" className="bg-brand-600 hover:bg-brand-700 text-white px-5 py-2.5 rounded-xl font-medium text-sm transition-colors flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
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
            <Link to="/employer/company" className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap">
              Setup Now
            </Link>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {loading ? Array(4).fill(0).map((_, i) => <StatCardSkeleton key={i} />) : stats.map((stat, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 animate-slide-up" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-lg mb-3`}>{stat.icon}</div>
              <div className="font-display text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Jobs list */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-gray-900 dark:text-white">My Job Postings</h2>
            <Link to="/employer/jobs" className="text-sm text-brand-600 hover:text-brand-700 font-medium">View all</Link>
          </div>

          {loading ? (
            <div className="space-y-3 animate-pulse">
              {Array(3).fill(0).map((_, i) => <div key={i} className="h-16 bg-gray-100 dark:bg-gray-700 rounded-xl" />)}
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-10">
              <div className="text-4xl mb-3">📭</div>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">No jobs posted yet</p>
              <Link to="/employer/post-job" className="bg-brand-600 hover:bg-brand-700 text-white px-5 py-2 rounded-xl text-sm font-medium transition-colors">Post your first job</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {jobs.slice(0, 5).map(job => (
                <div key={job.id} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white text-sm truncate">{job.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 capitalize mt-0.5">{job.job_type?.replace('-', ' ')} • {job.location}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-500 dark:text-gray-400">{job.applications?.length || 0} applicants</span>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${statusColors[job.status]}`}>{job.status}</span>
                    <Link to={`/employer/jobs/${job.id}/applicants`} className="text-xs text-brand-600 hover:text-brand-700 font-medium">
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
