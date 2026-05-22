import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { applicationsAPI } from '../../services/api';

const STATUS = {
  pending:   { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-400', icon: '⏳', label: 'Pending'     },
  reviewing: { bg: 'bg-blue-100 dark:bg-blue-900/30',    text: 'text-blue-700 dark:text-blue-400',     icon: '⭐', label: 'Shortlisted' },
  accepted:  { bg: 'bg-green-100 dark:bg-green-900/30',  text: 'text-green-700 dark:text-green-400',   icon: '✅', label: 'Accepted'    },
  rejected:  { bg: 'bg-red-100 dark:bg-red-900/30',      text: 'text-red-700 dark:text-red-400',       icon: '❌', label: 'Rejected'    },
};

const AppliedJobs = () => {
  const [apps, setApps]         = useState([]);
  const [loading, setLoading]   = useState(true);
  const [filter, setFilter]     = useState('all');

  useEffect(() => {
    applicationsAPI.getMyApplications()
      .then(r => setApps(r.data.data.applications || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'all' ? apps : apps.filter(a => a.status === filter);
  const counts = Object.keys(STATUS).reduce((acc, k) => ({ ...acc, [k]: apps.filter(a => a.status === k).length }), {});

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white">My Applications</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">{apps.length} total applications</p>
          </div>
          <Link to="/jobs" className="bg-brand-600 hover:bg-brand-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors">
            + Apply More
          </Link>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          <button onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filter === 'all' ? 'bg-brand-600 text-white' : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-brand-300'}`}>
            All ({apps.length})
          </button>
          {Object.entries(STATUS).map(([k, s]) => (
            <button key={k} onClick={() => setFilter(k)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filter === k ? 'bg-brand-600 text-white' : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-brand-300'}`}>
              {s.icon} {s.label} ({counts[k] || 0})
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-3">
            {Array(4).fill(0).map((_, i) => <div key={i} className="bg-white dark:bg-gray-800 h-28 rounded-2xl animate-pulse border border-gray-100 dark:border-gray-700" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-16 text-center">
            <div className="text-5xl mb-4">📭</div>
            <p className="font-semibold text-gray-900 dark:text-white mb-2">No applications here</p>
            <Link to="/jobs" className="text-brand-600 hover:text-brand-700 text-sm font-medium">Browse jobs →</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(app => {
              const s = STATUS[app.status] || STATUS.pending;
              return (
                <div key={app.id} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 hover:shadow-md transition-all animate-fade-in">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-100 to-accent-100 dark:from-brand-900/40 dark:to-accent-900/40 flex items-center justify-center font-bold text-brand-600 dark:text-brand-400 text-lg flex-shrink-0">
                      {app.job?.company?.company_name?.charAt(0) || '?'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 flex-wrap">
                        <div>
                          <Link to={`/jobs/${app.job?.id}`} className="font-semibold text-gray-900 dark:text-white hover:text-brand-600 transition-colors">
                            {app.job?.title}
                          </Link>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                            {app.job?.company?.company_name} · {app.job?.location}
                          </p>
                        </div>
                        <span className={`text-xs font-semibold px-3 py-1.5 rounded-full flex-shrink-0 ${s.bg} ${s.text}`}>
                          {s.icon} {s.label}
                        </span>
                      </div>

                      {app.employer_notes && (
                        <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                          <p className="text-xs font-semibold text-blue-700 dark:text-blue-400 mb-1">📝 Employer Note</p>
                          <p className="text-xs text-blue-600 dark:text-blue-300">{app.employer_notes}</p>
                        </div>
                      )}

                      <p className="text-xs text-gray-400 mt-3">
                        Applied {new Date(app.applied_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AppliedJobs;
