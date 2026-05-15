import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jobsAPI } from '../../services/api';
import JobCard from '../../components/common/JobCard';
import { JobCardSkeleton } from '../../components/common/Skeleton';

const stats = [
  { label: 'Jobs Available', value: '1,200+' },
  { label: 'Companies Hiring', value: '350+' },
  { label: 'Successful Placements', value: '8,000+' },
  { label: 'Cities Covered', value: '15+' },
];

const categories = [
  { name: 'Technology', icon: '💻', count: 245 },
  { name: 'Finance', icon: '💰', count: 128 },
  { name: 'Healthcare', icon: '🏥', count: 94 },
  { name: 'Education', icon: '📚', count: 87 },
  { name: 'Engineering', icon: '⚙️', count: 176 },
  { name: 'Marketing', icon: '📢', count: 112 },
  { name: 'Sales', icon: '📈', count: 203 },
  { name: 'Design', icon: '🎨', count: 67 },
];

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeaturedJobs = async () => {
      try {
        const { data } = await jobsAPI.getJobs({ limit: 6, sort: 'views', order: 'DESC' });
        setFeaturedJobs(data.data.jobs);
      } catch (error) {
        console.error('Failed to fetch featured jobs');
      } finally {
        setJobsLoading(false);
      }
    };
    fetchFeaturedJobs();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    if (searchLocation) params.set('location', searchLocation);
    navigate(`/jobs?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-900 via-brand-800 to-accent-800 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent-400 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="text-center animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm mb-6 backdrop-blur-sm">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse-slow" />
              <span>Somalia's #1 Job Portal</span>
            </div>
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Find Your Dream
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-accent-300">Career Today</span>
            </h1>
            <p className="text-blue-100 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
              Connect with top employers across Somalia and beyond. Thousands of jobs waiting for your talent.
            </p>

            {/* Search bar */}
            <form onSubmit={handleSearch} className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-2xl p-2 flex flex-col sm:flex-row gap-2 shadow-2xl">
              <div className="flex-1 flex items-center gap-3 px-4">
                <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Job title or keyword..."
                  className="flex-1 bg-transparent text-gray-900 dark:text-white placeholder-gray-400 outline-none py-3 text-sm"
                />
              </div>
              <div className="hidden sm:block w-px bg-gray-200 dark:bg-gray-700 my-2" />
              <div className="flex-1 flex items-center gap-3 px-4">
                <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                <input
                  type="text"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  placeholder="Location (e.g. Mogadishu)"
                  className="flex-1 bg-transparent text-gray-900 dark:text-white placeholder-gray-400 outline-none py-3 text-sm"
                />
              </div>
              <button type="submit" className="bg-brand-600 hover:bg-brand-700 text-white px-6 py-3 rounded-xl font-medium transition-colors text-sm whitespace-nowrap">
                Search Jobs
              </button>
            </form>

            <p className="mt-4 text-blue-200 text-sm">Popular: Software Engineer, Sales Manager, Teacher, Accountant</p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <div key={i} className="text-center animate-slide-up" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="font-display text-2xl md:text-3xl font-bold text-brand-600">{stat.value}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <h2 className="font-display text-3xl font-bold text-gray-900 dark:text-white">Browse by Category</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Find opportunities in your field of expertise</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {categories.map((cat, i) => (
            <Link
              key={i}
              to={`/jobs?category=${encodeURIComponent(cat.name)}`}
              className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-5 text-center hover:border-brand-300 dark:hover:border-brand-600 hover:shadow-md transition-all group animate-slide-up"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className="text-3xl mb-3">{cat.icon}</div>
              <div className="font-medium text-gray-900 dark:text-white text-sm group-hover:text-brand-600 transition-colors">{cat.name}</div>
              <div className="text-xs text-gray-400 mt-1">{cat.count} jobs</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="bg-gray-50 dark:bg-gray-950 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="font-display text-3xl font-bold text-gray-900 dark:text-white">Featured Jobs</h2>
              <p className="text-gray-500 dark:text-gray-400 mt-2">Hand-picked opportunities from top employers</p>
            </div>
            <Link to="/jobs" className="text-brand-600 hover:text-brand-700 font-medium text-sm flex items-center gap-1">
              View all <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {jobsLoading
              ? Array(6).fill(0).map((_, i) => <JobCardSkeleton key={i} />)
              : featuredJobs.map(job => <JobCard key={job.id} job={job} />)
            }
          </div>

          {!jobsLoading && featuredJobs.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <p>No jobs available yet. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-brand-600 to-accent-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Ready to Hire Top Talent?</h2>
          <p className="text-blue-100 text-lg mb-8">Post your job listing and connect with thousands of qualified candidates.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="bg-white text-brand-700 px-8 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-colors">
              Post a Job
            </Link>
            <Link to="/jobs" className="border-2 border-white/40 text-white px-8 py-3 rounded-xl font-semibold hover:bg-white/10 transition-colors">
              Browse Talent
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
