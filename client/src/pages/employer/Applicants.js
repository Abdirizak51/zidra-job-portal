import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { jobsAPI, applicationsAPI } from '../../services/api';

const STATUS_CONFIG = {
  pending:   { color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400', label: 'Pending', icon: '⏳' },
  reviewing: { color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', label: 'Shortlisted', icon: '⭐' },
  accepted:  { color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', label: 'Accepted', icon: '✅' },
  rejected:  { color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', label: 'Rejected', icon: '❌' },
};

const FILTERS = ['all', 'pending', 'reviewing', 'accepted', 'rejected'];

const Applicants = () => {
  const { id } = useParams();
  const [data, setData] = useState({ job: null, applications: [] });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [notesMap, setNotesMap] = useState({});
  const [expandedApp, setExpandedApp] = useState(null);

  useEffect(() => {
    jobsAPI.getJobApplicants(id)
      .then(r => setData(r.data.data))
      .catch(() => toast.error('Failed to load applicants'))
      .finally(() => setLoading(false));
  }, [id]);

  const updateApp = (appId, changes) => {
    setData(prev => ({
      ...prev,
      applications: prev.applications.map(a => a.id === appId ? { ...a, ...changes } : a)
    }));
  };

  const handleShortlist = async (appId) => {
    setUpdating(appId + '-shortlist');
    try {
      await applicationsAPI.shortlist(appId);
      updateApp(appId, { status: 'reviewing' });
      toast.success('⭐ Applicant shortlisted!');
    } catch { toast.error('Failed to shortlist.'); }
    finally { setUpdating(null); }
  };

  const handleStatusUpdate = async (appId, status) => {
    setUpdating(appId + '-' + status);
    const notes = notesMap[appId] || '';
    try {
      await applicationsAPI.updateStatus(appId, { status, employer_notes: notes });
      updateApp(appId, { status, employer_notes: notes });
      toast.success(`Application ${status}!`);
      setExpandedApp(null);
    } catch { toast.error('Failed to update.'); }
    finally { setUpdating(null); }
  };

  const handleDownloadCV = async (appId) => {
    try {
      const response = await applicationsAPI.downloadCV(appId);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `CV-Application-${appId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success('CV downloaded!');
    } catch { toast.error('Failed to download CV.'); }
  };

  const filtered = activeFilter === 'all'
    ? data.applications
    : data.applications.filter(a => a.status === activeFilter);

  const counts = FILTERS.reduce((acc, f) => {
    acc[f] = f === 'all' ? data.applications.length : data.applications.filter(a => a.status === f).length;
    return acc;
  }, {});

  if (loading) return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
          {Array(3).fill(0).map((_, i) => <div key={i} className="bg-white dark:bg-gray-800 h-36 rounded-2xl border border-gray-100 dark:border-gray-700" />)}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        <Link to="/employer/jobs" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 mb-6 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Back to Jobs
        </Link>

        {/* Job header */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 mb-6">
          <h1 className="font-display text-2xl font-bold text-gray-900 dark:text-white">{data.job?.title}</h1>
          <div className="flex flex-wrap gap-4 mt-3">
            {[
              { label: 'Total', value: counts.all, color: 'text-gray-600 dark:text-gray-300' },
              { label: '⏳ Pending', value: counts.pending, color: 'text-yellow-600 dark:text-yellow-400' },
              { label: '⭐ Shortlisted', value: counts.reviewing, color: 'text-blue-600 dark:text-blue-400' },
              { label: '✅ Accepted', value: counts.accepted, color: 'text-green-600 dark:text-green-400' },
              { label: '❌ Rejected', value: counts.rejected, color: 'text-red-600 dark:text-red-400' },
            ].map((s, i) => (
              <div key={i} className={`text-sm font-medium ${s.color}`}>
                {s.label}: <strong>{s.value}</strong>
              </div>
            ))}
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-5 flex-wrap">
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors capitalize ${
                activeFilter === f
                  ? 'bg-brand-600 text-white'
                  : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-brand-300'
              }`}
            >
              {f === 'reviewing' ? '⭐ Shortlisted' : f.charAt(0).toUpperCase() + f.slice(1)} ({counts[f]})
            </button>
          ))}
        </div>

        {/* Applicants list */}
        {filtered.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-16 text-center">
            <div className="text-5xl mb-4">👥</div>
            <h3 className="font-semibold text-gray-900 dark:text-white">No applicants in this category</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">Applications will appear here once candidates apply</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map(app => {
              const cfg = STATUS_CONFIG[app.status] || STATUS_CONFIG.pending;
              const isExpanded = expandedApp === app.id;

              return (
                <div key={app.id} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 hover:shadow-md transition-all animate-fade-in">
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                      {app.applicant?.name?.charAt(0).toUpperCase()}
                    </div>

                    <div className="flex-1 min-w-0">
                      {/* Top row */}
                      <div className="flex items-start justify-between gap-3 flex-wrap">
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">{app.applicant?.name}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{app.applicant?.email}</p>
                          {app.applicant?.location && <p className="text-xs text-gray-400 mt-0.5">📍 {app.applicant.location}</p>}
                        </div>
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1 ${cfg.color}`}>
                          {cfg.icon} {cfg.label}
                        </span>
                      </div>

                      {/* Bio */}
                      {app.applicant?.bio && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 line-clamp-2">{app.applicant.bio}</p>
                      )}

                      {/* Skills */}
                      {app.applicant?.skills?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {app.applicant.skills.slice(0, 6).map(skill => (
                            <span key={skill} className="text-xs bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-400 px-2 py-0.5 rounded-full border border-brand-100 dark:border-brand-800">{skill}</span>
                          ))}
                        </div>
                      )}

                      {/* Cover letter */}
                      {app.cover_letter && (
                        <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Cover Letter</p>
                          <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">{app.cover_letter}</p>
                        </div>
                      )}

                      {/* Employer notes */}
                      {app.employer_notes && (
                        <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                          <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-0.5">📝 Your Note</p>
                          <p className="text-xs text-blue-700 dark:text-blue-300">{app.employer_notes}</p>
                        </div>
                      )}

                      {/* Applied date */}
                      <p className="text-xs text-gray-400 mt-2">
                        Applied: {new Date(app.applied_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </p>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2 mt-4 flex-wrap">
                        <button onClick={() => handleDownloadCV(app.id)}
                          className="flex items-center gap-1.5 text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-3 py-1.5 rounded-lg transition-colors font-medium">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                          Download CV
                        </button>

                        {app.status === 'pending' && (
                          <button
                            disabled={!!updating}
                            onClick={() => handleShortlist(app.id)}
                            className="flex items-center gap-1.5 text-xs bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 text-blue-700 dark:text-blue-400 px-3 py-1.5 rounded-lg transition-colors font-medium disabled:opacity-60"
                          >
                            ⭐ Shortlist
                          </button>
                        )}

                        {(app.status === 'pending' || app.status === 'reviewing') && (
                          <>
                            <button
                              disabled={!!updating}
                              onClick={() => handleStatusUpdate(app.id, 'accepted')}
                              className="flex items-center gap-1.5 text-xs bg-green-100 dark:bg-green-900/30 hover:bg-green-200 text-green-700 dark:text-green-400 px-3 py-1.5 rounded-lg transition-colors font-medium disabled:opacity-60"
                            >
                              ✅ Accept
                            </button>
                            <button
                              disabled={!!updating}
                              onClick={() => handleStatusUpdate(app.id, 'rejected')}
                              className="flex items-center gap-1.5 text-xs bg-red-100 dark:bg-red-900/30 hover:bg-red-200 text-red-700 dark:text-red-400 px-3 py-1.5 rounded-lg transition-colors font-medium disabled:opacity-60"
                            >
                              ❌ Reject
                            </button>
                            <button
                              onClick={() => setExpandedApp(isExpanded ? null : app.id)}
                              className="flex items-center gap-1.5 text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 text-gray-600 dark:text-gray-400 px-3 py-1.5 rounded-lg transition-colors font-medium"
                            >
                              📝 {isExpanded ? 'Hide Note' : 'Add Note'}
                            </button>
                          </>
                        )}
                      </div>

                      {/* Note input - expanded */}
                      {isExpanded && (
                        <div className="mt-3 flex gap-2 animate-slide-up">
                          <input
                            value={notesMap[app.id] || ''}
                            onChange={e => setNotesMap(prev => ({ ...prev, [app.id]: e.target.value }))}
                            placeholder="Optional note to send to applicant..."
                            className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-brand-500"
                          />
                        </div>
                      )}
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

export default Applicants;
