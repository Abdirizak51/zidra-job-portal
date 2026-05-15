import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { applicationsAPI } from '../../services/api';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  reviewing: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  accepted: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  rejected: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

const AppliedJobs = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    applicationsAPI.getMyApplications()
      .then(r => setApplications(r.data.data.applications))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white">My Applications</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">{applications.length} total applications</p>
        </div>

        {loading ? (
          <div className="space-y-4">{Array(4).fill(0).map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 animate-pulse">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
                </div>
              </div>
            </div>
          ))}</div>
        ) : applications.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-16 text-center">
            <div className="text-5xl mb-4">📋</div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">No applications yet</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">Start applying to jobs to track them here</p>
            <Link to="/jobs" className="bg-brand-600 hover:bg-brand-700 text-white px-6 py-2.5 rounded-xl font-medium text-sm transition-colors">Browse Jobs</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map(app => (
              <div key={app.id} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 hover:shadow-md transition-shadow animate-fade-in">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-100 to-accent-100 dark:from-brand-900 dark:to-accent-900 flex items-center justify-center flex-shrink-0">
                    <span className="text-brand-600 font-bold">{app.job?.company?.company_name?.charAt(0)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <Link to={`/jobs/${app.job_id}`} className="font-semibold text-gray-900 dark:text-white hover:text-brand-600 transition-colors">{app.job?.title}</Link>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{app.job?.company?.company_name} • {app.job?.location}</p>
                      </div>
                      <span className={`text-xs font-medium px-3 py-1 rounded-full capitalize flex-shrink-0 ${statusColors[app.status]}`}>{app.status}</span>
                    </div>
                    {app.employer_notes && (
                      <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1">Employer note:</p>
                        <p className="text-sm text-gray-700 dark:text-gray-300">{app.employer_notes}</p>
                      </div>
                    )}
                    <p className="text-xs text-gray-400 mt-2">Applied {new Date(app.applied_at).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AppliedJobs;
