import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jobsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import JobCard from '../../components/common/JobCard';
import { JobCardSkeleton } from '../../components/common/Skeleton';

const CATEGORIES = [
  { name: 'Technology',   icon: '💻', color: 'from-blue-500 to-cyan-500'    },
  { name: 'Finance',      icon: '💰', color: 'from-green-500 to-emerald-500' },
  { name: 'Healthcare',   icon: '🏥', color: 'from-red-500 to-rose-500'     },
  { name: 'Education',    icon: '📚', color: 'from-amber-500 to-yellow-500' },
  { name: 'Engineering',  icon: '⚙️', color: 'from-gray-600 to-slate-600'  },
  { name: 'Marketing',    icon: '📢', color: 'from-purple-500 to-violet-500' },
  { name: 'Sales',        icon: '📈', color: 'from-orange-500 to-amber-500' },
  { name: 'Design',       icon: '🎨', color: 'from-pink-500 to-fuchsia-500' },
];

const STEPS = [
  { icon: '📝', title: 'Create Account', desc: 'Sign up free in under a minute' },
  { icon: '🔍', title: 'Browse Jobs', desc: 'Search thousands of opportunities' },
  { icon: '📤', title: 'Apply Instantly', desc: 'Upload your CV and apply with ease' },
  { icon: '🎉', title: 'Get Hired', desc: 'Land your dream job in Somalia' },
];

const Home = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch]     = useState('');
  const [location, setLocation] = useState('');
  const [jobs, setJobs]         = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    jobsAPI.getJobs({ limit: 6, sort: 'created_at', order: 'DESC' })
      .then(r => setJobs(r.data.data.jobs || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const p = new URLSearchParams();
    if (search.trim()) p.set('search', search.trim());
    if (location.trim()) p.set('location', location.trim());
    navigate(`/jobs?${p.toString()}`);
  };

  return (
    <div className="bg-white dark:bg-gray-950">

      {/* ── HERO ──────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-900 via-brand-800 to-accent-900 text-white">
        {/* Background blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-brand-600/30 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-accent-600/30 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 lg:py-32">
          {/* Badge */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-5 py-2 text-sm backdrop-blur-sm">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              🇸🇴 Somalia's #1 Job Portal
            </div>
          </div>

          {/* Headline */}
          <h1 className="text-center font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
            Find Your
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-cyan-200 to-accent-300">
              Dream Career
            </span>
          </h1>

          <p className="text-center text-blue-100 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Connect with top employers across Somalia and beyond. Thousands of jobs are waiting for your talent right now.
          </p>

          {/* Search */}
          <form onSubmit={handleSearch} className="max-w-3xl mx-auto">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-2 shadow-2xl flex flex-col sm:flex-row gap-2">
              <div className="flex-1 flex items-center gap-3 px-4 py-1">
                <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                <input
                  value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Job title, skill, or keyword..."
                  className="flex-1 bg-transparent text-gray-900 dark:text-white placeholder-gray-400 outline-none text-sm py-2"
                />
              </div>
              <div className="hidden sm:block w-px bg-gray-100 dark:bg-gray-800 my-2" />
              <div className="flex-1 flex items-center gap-3 px-4 py-1">
                <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                <input
                  value={location} onChange={e => setLocation(e.target.value)}
                  placeholder="City, e.g. Mogadishu"
                  className="flex-1 bg-transparent text-gray-900 dark:text-white placeholder-gray-400 outline-none text-sm py-2"
                />
              </div>
              <button type="submit" className="bg-brand-600 hover:bg-brand-700 text-white font-semibold px-7 py-3 rounded-xl transition-colors text-sm whitespace-nowrap">
                Search Jobs
              </button>
            </div>
            <p className="text-center text-blue-200/70 text-xs mt-3">
              Popular: Software Engineer · Sales Manager · Teacher · Accountant · Driver
            </p>
          </form>

          {/* Quick auth links — only for guests */}
          {!isAuthenticated && (
            <div className="flex items-center justify-center gap-4 mt-8">
              <Link to="/register" className="bg-white text-brand-700 font-semibold px-6 py-2.5 rounded-xl hover:bg-blue-50 transition-colors text-sm">
                Create Free Account
              </Link>
              <Link to="/login" className="text-white/80 hover:text-white text-sm font-medium transition-colors">
                Already have an account? Sign in →
              </Link>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-3xl mx-auto">
            {[
              { value: '1,200+', label: 'Jobs Available' },
              { value: '350+',   label: 'Companies' },
              { value: '8,000+', label: 'Hired' },
              { value: '15+',    label: 'Cities' },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="font-display text-3xl font-bold text-white">{s.value}</div>
                <div className="text-blue-200 text-sm mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────── */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold text-gray-900 dark:text-white">How Zidra Works</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Get hired in 4 simple steps</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STEPS.map((step, i) => (
              <div key={i} className="text-center group">
                <div className="w-16 h-16 bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 shadow-sm group-hover:border-brand-300 transition-colors">
                  {step.icon}
                </div>
                <div className="w-6 h-6 bg-brand-600 text-white text-xs font-bold rounded-full flex items-center justify-center mx-auto -mt-2 mb-3 relative z-10">
                  {i + 1}
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{step.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-xs mt-1 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ───────────────────────────────────────── */}
      <section className="py-16 bg-white dark:bg-gray-950">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl font-bold text-gray-900 dark:text-white">Browse by Category</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Find opportunities in your field of expertise</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {CATEGORIES.map((cat, i) => (
              <Link
                key={i}
                to={`/jobs?category=${encodeURIComponent(cat.name)}`}
                className="group bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-5 text-center hover:shadow-lg hover:border-transparent transition-all duration-200 hover:-translate-y-0.5"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-2xl mx-auto mb-3 shadow-sm`}>
                  {cat.icon}
                </div>
                <div className="font-semibold text-gray-800 dark:text-white text-sm group-hover:text-brand-600 transition-colors">{cat.name}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── LATEST JOBS ──────────────────────────────────────── */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-display text-3xl font-bold text-gray-900 dark:text-white">Latest Jobs</h2>
              <p className="text-gray-500 dark:text-gray-400 mt-1">Fresh opportunities added daily</p>
            </div>
            <Link to="/jobs" className="flex items-center gap-1 text-brand-600 hover:text-brand-700 font-semibold text-sm transition-colors">
              View all <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {loading
              ? Array(6).fill(0).map((_, i) => <JobCardSkeleton key={i} />)
              : jobs.length > 0
                ? jobs.map(job => <JobCard key={job.id} job={job} />)
                : (
                  <div className="col-span-3 text-center py-16">
                    <div className="text-5xl mb-4">📭</div>
                    <p className="text-gray-500 dark:text-gray-400">No jobs posted yet. Check back soon!</p>
                    {isAuthenticated && user?.role === 'employer' && (
                      <Link to="/employer/post-job" className="mt-4 inline-block bg-brand-600 text-white px-6 py-2.5 rounded-xl font-medium text-sm">Post the First Job</Link>
                    )}
                  </div>
                )
            }
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      {!isAuthenticated && (
        <section className="py-20 bg-gradient-to-br from-brand-600 to-accent-700 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Ready to Start Your Career?</h2>
            <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of job seekers and employers on Zidra. Create your free account today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="bg-white text-brand-700 font-bold px-8 py-3.5 rounded-xl hover:bg-blue-50 transition-colors shadow-lg">
                🚀 Get Started Free
              </Link>
              <Link to="/jobs" className="border-2 border-white/30 text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-white/10 transition-colors">
                Browse Jobs First
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
