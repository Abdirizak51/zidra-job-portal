import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { jobsAPI } from '../../services/api';
import JobCard from '../../components/common/JobCard';
import { JobCardSkeleton } from '../../components/common/Skeleton';

const JOB_TYPES = ['full-time', 'part-time', 'contract', 'internship', 'remote'];
const EXPERIENCE_LEVELS = ['entry', 'mid', 'senior', 'executive'];

const Jobs = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    location: searchParams.get('location') || '',
    job_type: searchParams.get('job_type') || '',
    experience_level: searchParams.get('experience_level') || '',
    category: searchParams.get('category') || '',
    page: 1,
  });

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== ''));
      const { data } = await jobsAPI.getJobs(params);
      setJobs(data.data.jobs);
      setPagination(data.data.pagination);
    } catch (error) {
      console.error('Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetchJobs(); }, [fetchJobs]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  const clearFilters = () => {
    setFilters({ search: '', location: '', job_type: '', experience_level: '', category: '', page: 1 });
    setSearchParams({});
  };

  const activeFiltersCount = [filters.job_type, filters.experience_level, filters.category, filters.location].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white mb-6">Browse Jobs</h1>
          <form onSubmit={handleSearch} className="flex gap-3">
            <div className="flex-1 relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                placeholder="Search job title or keyword..."
                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-brand-500 text-sm"
              />
            </div>
            <button type="submit" className="bg-brand-600 hover:bg-brand-700 text-white px-6 py-3 rounded-xl font-medium transition-colors text-sm">
              Search
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 sticky top-20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-white">Filters</h3>
                {activeFiltersCount > 0 && (
                  <button onClick={clearFilters} className="text-xs text-brand-600 hover:text-brand-700">
                    Clear all ({activeFiltersCount})
                  </button>
                )}
              </div>

              {/* Location filter */}
              <div className="mb-5">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2 block">Location</label>
                <input
                  type="text"
                  value={filters.location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                  placeholder="e.g. Mogadishu"
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              {/* Job Type filter */}
              <div className="mb-5">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2 block">Job Type</label>
                <div className="space-y-1.5">
                  {JOB_TYPES.map(type => (
                    <button
                      key={type}
                      onClick={() => handleFilterChange('job_type', filters.job_type === type ? '' : type)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm capitalize transition-colors ${filters.job_type === type ? 'bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400 font-medium' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                    >
                      {type.replace('-', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Experience Level */}
              <div className="mb-5">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2 block">Experience</label>
                <div className="space-y-1.5">
                  {EXPERIENCE_LEVELS.map(level => (
                    <button
                      key={level}
                      onClick={() => handleFilterChange('experience_level', filters.experience_level === level ? '' : level)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm capitalize transition-colors ${filters.experience_level === level ? 'bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400 font-medium' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                    >
                      {level} level
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Job List */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {loading ? 'Searching...' : `${pagination.total || 0} jobs found`}
              </p>
              <select
                onChange={(e) => handleFilterChange('sort', e.target.value)}
                className="text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-gray-700 dark:text-gray-300 outline-none"
              >
                <option value="created_at">Latest</option>
                <option value="views">Most Popular</option>
                <option value="salary_min">Highest Salary</option>
              </select>
            </div>

            <div className="space-y-3">
              {loading
                ? Array(8).fill(0).map((_, i) => <JobCardSkeleton key={i} />)
                : jobs.length > 0
                  ? jobs.map(job => <JobCard key={job.id} job={job} />)
                  : (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-12 text-center">
                      <div className="text-5xl mb-4">🔍</div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">No jobs found</h3>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">Try adjusting your search or filters</p>
                      <button onClick={clearFilters} className="mt-4 text-brand-600 hover:text-brand-700 font-medium text-sm">
                        Clear all filters
                      </button>
                    </div>
                  )
              }
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  onClick={() => handleFilterChange('page', Math.max(1, filters.page - 1))}
                  disabled={filters.page === 1}
                  className="px-4 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
                >
                  Previous
                </button>
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => handleFilterChange('page', page)}
                    className={`w-10 h-10 text-sm rounded-lg transition-colors ${filters.page === page ? 'bg-brand-600 text-white' : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => handleFilterChange('page', Math.min(pagination.totalPages, filters.page + 1))}
                  disabled={filters.page === pagination.totalPages}
                  className="px-4 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
                >
                  Next
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
