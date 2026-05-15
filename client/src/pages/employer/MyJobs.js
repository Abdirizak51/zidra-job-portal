import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { jobsAPI } from '../../services/api';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  approved: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  rejected: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  closed: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400',
};

const MyJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    jobsAPI.getMyJobs()
      .then(r => setJobs(r.data.data.jobs))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this job? This cannot be undone.')) return;
    try {
      await jobsAPI.deleteJob(id);
      setJobs(prev => prev.filter(j => j.id !== id));
      toast.success('Job deleted');
    } catch { toast.error('Failed to delete job'); }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white">My Jobs</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">{jobs.length} job postings</p>
          </div>
          <Link to="/employer/post-job" className="bg-brand-600 hover:bg-brand-700 text-white px-5 py-2.5 rounded-xl font-medium text-sm transition-colors">
            + Post Job
          </Link>
        </div>

        {loading ? (
          <div className="space-y-4">{Array(3).fill(0).map((_, i) => <div key={i} className="bg-white dark:bg-gray-800 h-24 rounded-2xl animate-pulse border border-gray-100 dark:border-gray-700" />)}</div>
        ) : jobs.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-16 text-center">
            <div className="text-5xl mb-4">📭</div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">No jobs posted yet</h3>
            <Link to="/employer/post-job" className="mt-3 inline-block bg-brand-600 hover:bg-brand-700 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-colors">Post your first job</Link>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                    {['Job Title', 'Type', 'Status', 'Applicants', 'Posted', 'Actions'].map(h => (
                      <th key={h} className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide px-5 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                  {jobs.map(job => (
                    <tr key={job.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                      <td className="px-5 py-4">
                        <p className="font-medium text-gray-900 dark:text-white text-sm">{job.title}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">📍 {job.location}</p>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-xs text-gray-600 dark:text-gray-400 capitalize">{job.job_type?.replace('-', ' ')}</span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${statusColors[job.status]}`}>{job.status}</span>
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-600 dark:text-gray-400">{job.applications?.length || 0}</td>
                      <td className="px-5 py-4 text-xs text-gray-500 dark:text-gray-400">{new Date(job.created_at).toLocaleDateString()}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <Link to={`/employer/jobs/${job.id}/applicants`} className="text-xs text-brand-600 hover:text-brand-700 font-medium">Applicants</Link>
                          <Link to={`/employer/jobs/${job.id}/edit`} className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">Edit</Link>
                          <button onClick={() => handleDelete(job.id)} className="text-xs text-red-500 hover:text-red-700">Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyJobs;
