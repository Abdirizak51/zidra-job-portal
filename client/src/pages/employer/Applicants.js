import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { jobsAPI, applicationsAPI } from '../../services/api';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  reviewing: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  accepted: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  rejected: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

const Applicants = () => {
  const { id } = useParams();
  const [data, setData] = useState({ job: null, applications: [] });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [selectedApp, setSelectedApp] = useState(null);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    jobsAPI.getJobApplicants(id)
      .then(r => setData(r.data.data))
      .catch(() => toast.error('Failed to load applicants'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleStatusUpdate = async (appId, status) => {
    setUpdating(appId);
    try {
      await applicationsAPI.updateStatus(appId, { status, employer_notes: notes });
      setData(prev => ({
        ...prev,
        applications: prev.applications.map(a => a.id === appId ? { ...a, status, employer_notes: notes } : a)
      }));
      toast.success(`Application ${status}`);
      setSelectedApp(null);
      setNotes('');
    } catch { toast.error('Failed to update status'); }
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
    } catch { toast.error('Failed to download CV'); }
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
          {Array(3).fill(0).map((_, i) => <div key={i} className="bg-white dark:bg-gray-800 h-28 rounded-2xl border border-gray-100 dark:border-gray-700" />)}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/employer/jobs" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 mb-6">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Back to Jobs
        </Link>

        <div className="mb-6">
          <h1 className="font-display text-2xl font-bold text-gray-900 dark:text-white">{data.job?.title}</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">{data.applications.length} applicants</p>
        </div>

        {data.applications.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-16 text-center">
            <div className="text-5xl mb-4">👥</div>
            <h3 className="font-semibold text-gray-900 dark:text-white">No applicants yet</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">Applications will appear here once candidates apply</p>
          </div>
        ) : (
          <div className="space-y-4">
            {data.applications.map(app => (
              <div key={app.id} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 hover:shadow-md transition-shadow animate-fade-in">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                    {app.applicant?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">{app.applicant?.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{app.applicant?.email}</p>
                        {app.applicant?.location && <p className="text-xs text-gray-400 mt-0.5">📍 {app.applicant.location}</p>}
                      </div>
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${statusColors[app.status]}`}>{app.status}</span>
                    </div>

                    {/* Skills */}
                    {app.applicant?.skills?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {app.applicant.skills.slice(0, 5).map(skill => (
                          <span key={skill} className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded-full">{skill}</span>
                        ))}
                      </div>
                    )}

                    {app.cover_letter && (
                      <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Cover Letter:</p>
                        <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">{app.cover_letter}</p>
                      </div>
                    )}

                    {app.employer_notes && (
                      <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <p className="text-xs text-blue-700 dark:text-blue-400">Note: {app.employer_notes}</p>
                      </div>
                    )}

                    <div className="flex items-center gap-3 mt-4">
                      <button onClick={() => handleDownloadCV(app.id)}
                        className="flex items-center gap-1.5 text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-3 py-1.5 rounded-lg transition-colors font-medium">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        Download CV
                      </button>

                      {app.status === 'pending' || app.status === 'reviewing' ? (
                        <>
                          <button onClick={() => setSelectedApp(app.id === selectedApp ? null : app.id)}
                            className="text-xs bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 text-blue-700 dark:text-blue-400 px-3 py-1.5 rounded-lg transition-colors font-medium">
                            Add Note
                          </button>
                          <button disabled={updating === app.id}
                            onClick={() => handleStatusUpdate(app.id, 'accepted')}
                            className="text-xs bg-green-100 dark:bg-green-900/30 hover:bg-green-200 text-green-700 dark:text-green-400 px-3 py-1.5 rounded-lg transition-colors font-medium disabled:opacity-60">
                            Accept
                          </button>
                          <button disabled={updating === app.id}
                            onClick={() => handleStatusUpdate(app.id, 'rejected')}
                            className="text-xs bg-red-100 dark:bg-red-900/30 hover:bg-red-200 text-red-700 dark:text-red-400 px-3 py-1.5 rounded-lg transition-colors font-medium disabled:opacity-60">
                            Reject
                          </button>
                        </>
                      ) : null}
                    </div>

                    {selectedApp === app.id && (
                      <div className="mt-3 flex gap-2">
                        <input value={notes} onChange={e => setNotes(e.target.value)} placeholder="Optional note to applicant..."
                          className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-brand-500" />
                      </div>
                    )}
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

export default Applicants;
