import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { savedJobsAPI } from '../../services/api';
import JobCard from '../../components/common/JobCard';

const SavedJobs = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    savedJobsAPI.getSavedJobs()
      .then(r => setSavedJobs(r.data.data.savedJobs || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleRemove = async (jobId) => {
    try {
      await savedJobsAPI.toggleSave(jobId);
      setSavedJobs(prev => prev.filter(s => s.job?.id !== jobId));
      toast.success('Removed from saved jobs');
    } catch { toast.error('Failed to remove'); }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white">Saved Jobs</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">{savedJobs.length} saved job{savedJobs.length !== 1 ? 's' : ''}</p>
          </div>
          <Link to="/jobs" className="bg-brand-600 hover:bg-brand-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors">
            Browse More
          </Link>
        </div>

        {loading ? (
          <div className="space-y-3">
            {Array(4).fill(0).map((_, i) => <div key={i} className="bg-white dark:bg-gray-800 h-28 rounded-2xl animate-pulse border border-gray-100 dark:border-gray-700" />)}
          </div>
        ) : savedJobs.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-16 text-center">
            <div className="text-5xl mb-4">🔖</div>
            <p className="font-semibold text-gray-900 dark:text-white mb-2">No saved jobs yet</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-5">Save jobs you're interested in and apply later</p>
            <Link to="/jobs" className="bg-brand-600 hover:bg-brand-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors">Browse Jobs</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {savedJobs.map(s => s.job && (
              <div key={s.id} className="relative group">
                <JobCard job={s.job} />
                <button
                  onClick={() => handleRemove(s.job.id)}
                  className="absolute top-4 right-4 p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-400 hover:text-red-500 hover:border-red-200 transition-colors shadow-sm opacity-0 group-hover:opacity-100"
                  title="Remove from saved"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedJobs;
