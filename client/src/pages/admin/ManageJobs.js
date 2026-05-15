import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { adminAPI } from '../../services/api';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  approved: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  rejected: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  closed: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400',
};

const ManageJobs = () => {
  const [searchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || '');
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({});
  const [page, setPage] = useState(1);
  const [updating, setUpdating] = useState(null);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await adminAPI.getJobs({ status: statusFilter, search, page, limit: 15 });
      setJobs(data.data.jobs);
      setPagination(data.data.pagination);
    } catch { toast.error('Failed to load jobs'); }
    finally { setLoading(false); }
  }, [statusFilter, search, page]);

  useEffect(() => { fetchJobs(); }, [fetchJobs]);

  const handleStatusUpdate = async (id, status) => {
    setUpdating(id);
    try {
      await adminAPI.updateJobStatus(id, status);
      setJobs(prev => prev.map(j => j.id === id ? { ...j, status } : j));
      toast.success(`Job ${status}`);
    } catch { toast.error('Failed to update job'); }
    finally { setUpdating(null); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Permanently delete this job?')) return;
    try {
      await adminAPI.deleteJob(id);
      setJobs(prev => prev.filter(j => j.id !== id));
      toast.success('Job deleted');
    } catch { toast.error('Failed to delete job'); }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white">Manage Jobs</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">{pagination.total || 0} total jobs</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search job title..."
            className="flex-1 px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-brand-500"
          />
          <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
            className="px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-500">
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
          {loading ? (
            <div className="p-6 space-y-3 animate-pulse">{Array(5).fill(0).map((_, i) => <div key={i} className="h-16 bg-gray-100 dark:bg-gray-700 rounded-xl" />)}</div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-5xl mb-3">📭</div>
              <p className="text-gray-500 dark:text-gray-400">No jobs found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                    {['Job', 'Company', 'Type', 'Status', 'Posted', 'Actions'].map(h => (
                      <th key={h} className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide px-5 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                  {jobs.map(job => (
                    <tr key={job.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                      <td className="px-5 py-3">
                        <p className="text-sm font-medium text-gray-900 dark:text-white max-w-[200px] truncate">{job.title}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">📍 {job.location}</p>
                      </td>
                      <td className="px-5 py-3 text-sm text-gray-600 dark:text-gray-400">{job.company?.company_name}</td>
                      <td className="px-5 py-3 text-xs text-gray-600 dark:text-gray-400 capitalize">{job.job_type?.replace('-', ' ')}</td>
                      <td className="px-5 py-3">
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${statusColors[job.status]}`}>{job.status}</span>
                      </td>
                      <td className="px-5 py-3 text-xs text-gray-500 dark:text-gray-400">{new Date(job.created_at).toLocaleDateString()}</td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-1.5">
                          {job.status === 'pending' && (
                            <>
                              <button disabled={updating === job.id} onClick={() => handleStatusUpdate(job.id, 'approved')}
                                className="text-xs bg-green-100 dark:bg-green-900/30 hover:bg-green-200 text-green-700 dark:text-green-400 px-2.5 py-1 rounded-lg font-medium transition-colors disabled:opacity-60">
                                Approve
                              </button>
                              <button disabled={updating === job.id} onClick={() => handleStatusUpdate(job.id, 'rejected')}
                                className="text-xs bg-red-100 dark:bg-red-900/30 hover:bg-red-200 text-red-700 dark:text-red-400 px-2.5 py-1 rounded-lg font-medium transition-colors disabled:opacity-60">
                                Reject
                              </button>
                            </>
                          )}
                          {job.status === 'approved' && (
                            <button onClick={() => handleStatusUpdate(job.id, 'closed')}
                              className="text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 text-gray-600 dark:text-gray-400 px-2.5 py-1 rounded-lg font-medium transition-colors">
                              Close
                            </button>
                          )}
                          <button onClick={() => handleDelete(job.id)}
                            className="text-xs bg-red-100 dark:bg-red-900/30 hover:bg-red-200 text-red-700 dark:text-red-400 px-2.5 py-1 rounded-lg font-medium transition-colors">
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {pagination.totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="px-4 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg disabled:opacity-50 text-gray-700 dark:text-gray-300">Previous</button>
            <span className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">Page {page} of {pagination.totalPages}</span>
            <button onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))} disabled={page === pagination.totalPages}
              className="px-4 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg disabled:opacity-50 text-gray-700 dark:text-gray-300">Next</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageJobs;
