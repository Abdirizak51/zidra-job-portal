import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { jobsAPI } from '../../services/api';
import JobCard from '../../components/common/JobCard';
import { JobCardSkeleton } from '../../components/common/Skeleton';

const JOB_TYPES = [
  { value: 'full-time',  label: 'Full-Time' },
  { value: 'part-time',  label: 'Part-Time' },
  { value: 'contract',   label: 'Contract' },
  { value: 'internship', label: 'Internship' },
  { value: 'remote',     label: 'Remote' },
];

const EXP_LEVELS = [
  { value: 'entry',     label: 'Entry Level' },
  { value: 'mid',       label: 'Mid Level' },
  { value: 'senior',    label: 'Senior Level' },
  { value: 'executive', label: 'Executive' },
];

const Jobs = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs]           = useState([]);
  const [loading, setLoading]     = useState(true);
  const [pagination, setPagination] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [filters, setFilters] = useState({
    search:           searchParams.get('search')           || '',
    location:         searchParams.get('location')         || '',
    job_type:         searchParams.get('job_type')         || '',
    experience_level: searchParams.get('experience_level') || '',
    category:         searchParams.get('category')         || '',
    sort:             'created_at',
    page:             1,
  });

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== ''));
      const { data } = await jobsAPI.getJobs({ ...params, limit: 12 });
      setJobs(data.data.jobs || []);
      setPagination(data.data.pagination || {});
    } catch { setJobs([]); }
    finally { setLoading(false); }
  }, [filters]);

  useEffect(() => { fetchJobs(); }, [fetchJobs]);

  const setFilter = (key, value) =>
    setFilters(p => ({ ...p, [key]: value, page: 1 }));

  const clearAll = () =>
    setFilters({ search: '', location: '', job_type: '', experience_level: '', category: '', sort: 'created_at', page: 1 });

  const activeCount = [filters.job_type, filters.experience_level, filters.category, filters.location].filter(Boolean).length;

  const FilterSection = () => (
    <div className="space-y-6">
      {/* Active filters */}
      {activeCount > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Active Filters</span>
            <button onClick={clearAll} className="text-xs text-red-500 hover:text-red-600 font-medium">Clear all</button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {filters.job_type && (
              <span className="inline-flex items-center gap-1 bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400 text-xs px-2.5 py-1 rounded-full">
                {filters.job_type.replace('-', ' ')}
                <button onClick={() => setFilter('job_type', '')} className="hover:text-red-500">×</button>
              </span>
            )}
            {filters.experience_level && (
              <span className="inline-flex items-center gap-1 bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400 text-xs px-2.5 py-1 rounded-full">
                {filters.experience_level}
                <button onClick={() => setFilter('experience_level', '')} className="hover:text-red-500">×</button>
              </span>
            )}
            {filters.location && (
              <span className="inline-flex items-center gap-1 bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400 text-xs px-2.5 py-1 rounded-full">
                📍 {filters.location}
                <button onClick={() => setFilter('location', '')} className="hover:text-red-500">×</button>
              </span>
            )}
          </div>
        </div>
      )}

      {/* Location */}
      <div>
        <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide block mb-2">Location</label>
        <input
          type="text"
          value={filters.location}
          onChange={e => setFilter('location', e.target.value)}
          placeholder="e.g. Mogadishu"
          className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-brand-500"
        />
      </div>

      {/* Job Type */}
      <div>
        <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide block mb-2">Job Type</label>
        <div className="space-y-1">
          {JOB_TYPES.map(t => (
            <button
              key={t.value}
              onClick={() => setFilter('job_type', filters.job_type === t.value ? '' : t.value)}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-colors flex items-center justify-between ${
                filters.job_type === t.value
                  ? 'bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400 font-semibold'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              {t.label}
              {filters.job_type === t.value && <span className="text-brand-600">✓</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Experience Level */}
      <div>
        <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide block mb-2">Experience</label>
        <div className="space-y-1">
          {EXP_LEVELS.map(l => (
            <button
              key={l.value}
              onClick={() => setFilter('experience_level', filters.experience_level === l.value ? '' : l.value)}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-colors flex items-center justify-between ${
                filters.experience_level === l.value
                  ? 'bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400 font-semibold'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              {l.label}
              {filters.experience_level === l.value && <span className="text-brand-600">✓</span>}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">

      {/* Search header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <form onSubmit={e => { e.preventDefault(); fetchJobs(); }} className="flex gap-3">
            <div className="flex-1 flex items-center gap-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 focus-within:ring-2 focus-within:ring-brand-500">
              <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input
                type="text"
                value={filters.search}
                onChange={e => setFilter('search', e.target.value)}
                placeholder="Search jobs, skills, companies..."
                className="flex-1 bg-transparent text-gray-900 dark:text-white placeholder-gray-400 outline-none text-sm py-3"
              />
              {filters.search && (
                <button type="button" onClick={() => setFilter('search', '')} className="text-gray-400 hover:text-gray-600">×</button>
              )}
            </div>
            <button type="submit" className="bg-brand-600 hover:bg-brand-700 text-white px-5 py-3 rounded-xl font-medium text-sm transition-colors hidden sm:block">
              Search
            </button>
            {/* Mobile filter button */}
            <button type="button" onClick={() => setSidebarOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-medium">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" /></svg>
              Filters {activeCount > 0 && <span className="bg-brand-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">{activeCount}</span>}
            </button>
          </form>
        </div>
      </div>

      {/* Mobile filter drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-80 bg-white dark:bg-gray-900 shadow-2xl overflow-y-auto p-6 animate-slide-in">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-gray-900 dark:text-white">Filters</h3>
              <button onClick={() => setSidebarOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <FilterSection />
            <button onClick={() => setSidebarOpen(false)} className="w-full mt-6 bg-brand-600 text-white py-3 rounded-xl font-semibold">
              Show {pagination.total || 0} Jobs
            </button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">

          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 sticky top-32">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-semibold text-gray-900 dark:text-white">Filters</h3>
                {activeCount > 0 && (
                  <button onClick={clearAll} className="text-xs text-red-500 hover:text-red-600 font-medium">
                    Clear ({activeCount})
                  </button>
                )}
              </div>
              <FilterSection />
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Results bar */}
            <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {loading ? 'Searching...' : `${pagination.total || 0} jobs found`}
                </p>
                {(filters.search || filters.location) && !loading && (
                  <p className="text-sm text-gray-400 mt-0.5">
                    {filters.search && <span>"{filters.search}"</span>}
                    {filters.search && filters.location && ' in '}
                    {filters.location && <span>{filters.location}</span>}
                  </p>
                )}
              </div>
              <select
                value={filters.sort}
                onChange={e => setFilter('sort', e.target.value)}
                className="text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-gray-700 dark:text-gray-300 outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="created_at">Latest First</option>
                <option value="views">Most Popular</option>
                <option value="salary_min">Highest Salary</option>
              </select>
            </div>

            {/* Jobs grid */}
            <div className="space-y-3">
              {loading
                ? Array(8).fill(0).map((_, i) => <JobCardSkeleton key={i} />)
                : jobs.length > 0
                  ? jobs.map(job => <JobCard key={job.id} job={job} />)
                  : (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-16 text-center">
                      <div className="text-5xl mb-4">🔍</div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">No jobs found</h3>
                      <p className="text-gray-500 dark:text-gray-400 text-sm mb-5">Try different keywords or adjust your filters</p>
                      <button onClick={clearAll} className="bg-brand-600 hover:bg-brand-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors">
                        Clear All Filters
                      </button>
                    </div>
                  )
              }
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  onClick={() => setFilter('page', Math.max(1, filters.page - 1))}
                  disabled={filters.page === 1}
                  className="px-4 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
                >
                  ← Prev
                </button>
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => i + 1).map(p => (
                  <button
                    key={p}
                    onClick={() => setFilter('page', p)}
                    className={`w-10 h-10 text-sm rounded-xl transition-colors font-medium ${
                      filters.page === p
                        ? 'bg-brand-600 text-white shadow-sm'
                        : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setFilter('page', Math.min(pagination.totalPages, filters.page + 1))}
                  disabled={filters.page === pagination.totalPages}
                  className="px-4 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
                >
                  Next →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Jobs;
