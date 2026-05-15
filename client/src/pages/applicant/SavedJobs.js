import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { savedJobsAPI } from '../../services/api';
import JobCard from '../../components/common/JobCard';

const SavedJobs = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    savedJobsAPI.getSavedJobs()
      .then(r => setSavedJobs(r.data.data.savedJobs))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleUnsave = async (jobId) => {
    try {
      await savedJobsAPI.toggleSave(jobId);
      setSavedJobs(prev => prev.filter(s => s.job_id !== jobId));
      toast.success('Job removed from saved');
    } catch { toast.error('Failed to remove job'); }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white">Saved Jobs</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">{savedJobs.length} saved jobs</p>
        </div>

        {loading ? (
          <div className="space-y-4">{Array(3).fill(0).map((_, i) => <div key={i} className="bg-white dark:bg-gray-800 h-32 rounded-2xl animate-pulse border border-gray-100 dark:border-gray-700" />)}</div>
        ) : savedJobs.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-16 text-center">
            <div className="text-5xl mb-4">🔖</div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">No saved jobs yet</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">Save jobs you like to review them later</p>
            <Link to="/jobs" className="bg-brand-600 hover:bg-brand-700 text-white px-6 py-2.5 rounded-xl font-medium text-sm transition-colors">Browse Jobs</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {savedJobs.map(saved => saved.job && (
              <div key={saved.id} className="relative group">
                <JobCard job={saved.job} />
                <button
                  onClick={() => handleUnsave(saved.job_id)}
                  className="absolute top-4 right-4 p-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-400 hover:text-red-500 hover:border-red-300 opacity-0 group-hover:opacity-100 transition-all text-xs"
                >
                  Remove
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
