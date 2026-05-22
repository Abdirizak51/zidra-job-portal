import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { jobsAPI, applicationsAPI, savedJobsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const TYPE_STYLES = {
  'full-time':  'bg-emerald-100 text-emerald-700',
  'part-time':  'bg-blue-100 text-blue-700',
  'contract':   'bg-orange-100 text-orange-700',
  'internship': 'bg-purple-100 text-purple-700',
  'remote':     'bg-teal-100 text-teal-700',
};

const JobDetail = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [job, setJob]               = useState(null);
  const [loading, setLoading]       = useState(true);
  const [applying, setApplying]     = useState(false);
  const [isSaved, setIsSaved]       = useState(false);
  const [showApply, setShowApply]   = useState(false);
  const [cvFile, setCvFile]         = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [dragOver, setDragOver]     = useState(false);
  const fileRef = useRef();

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const { data } = await jobsAPI.getJob(id);
        setJob(data.data.job);
        if (isAuthenticated && user?.role === 'applicant') {
          try {
            const s = await savedJobsAPI.getSaveStatus(id);
            setIsSaved(s.data.data.saved);
          } catch (_) {}
        }
      } catch {
        toast.error('Job not found');
        navigate('/jobs');
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id, isAuthenticated, user, navigate]);

  const handleApply = async (e) => {
    e.preventDefault();
    if (!cvFile) return toast.error('Please upload your CV (PDF)');
    setApplying(true);
    const fd = new FormData();
    fd.append('cv', cvFile);
    if (coverLetter.trim()) fd.append('cover_letter', coverLetter.trim());
    try {
      await applicationsAPI.apply(id, fd);
      toast.success('🎉 Application submitted successfully!');
      setShowApply(false);
      setCvFile(null);
      setCoverLetter('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit application');
    } finally {
      setApplying(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file?.type === 'application/pdf') setCvFile(file);
    else toast.error('Only PDF files are allowed');
  };

  const handleSave = async () => {
    if (!isAuthenticated) return navigate('/login');
    try {
      const { data } = await savedJobsAPI.toggleSave(id);
      setIsSaved(data.data.saved);
      toast.success(data.data.saved ? '🔖 Job saved!' : 'Removed from saved');
    } catch { toast.error('Failed to save job'); }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingSpinner size="lg" />
    </div>
  );
  if (!job) return null;

  const {
    title, description, requirements, location, job_type,
    salary_min, salary_max, salary_currency, experience_level,
    category, deadline, views, created_at, company
  } = job;

  const salary = salary_min || salary_max
    ? salary_min && salary_max
      ? `${Number(salary_min).toLocaleString()} – ${Number(salary_max).toLocaleString()} ${salary_currency}`
      : salary_min ? `From ${Number(salary_min).toLocaleString()} ${salary_currency}`
      : `Up to ${Number(salary_max).toLocaleString()} ${salary_currency}`
    : null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header banner */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link to="/jobs" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-brand-600 transition-colors mb-5">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Back to Jobs
          </Link>

          <div className="flex items-start gap-5">
            {/* Company logo */}
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-100 to-accent-100 dark:from-brand-900/40 dark:to-accent-900/40 border-2 border-white dark:border-gray-700 shadow-sm flex items-center justify-center flex-shrink-0">
              <span className="font-display font-bold text-3xl text-brand-600 dark:text-brand-400">
                {company?.company_name?.charAt(0)}
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <h1 className="font-display text-2xl md:text-3xl font-bold text-gray-900 dark:text-white leading-tight">{title}</h1>
              <p className="text-brand-600 font-semibold mt-1">{company?.company_name}</p>

              <div className="flex flex-wrap gap-2 mt-3">
                <span className={`text-xs font-semibold px-3 py-1.5 rounded-full capitalize ${TYPE_STYLES[job_type] || 'bg-gray-100 text-gray-600'}`}>
                  {job_type?.replace('-', ' ')}
                </span>
                <span className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-full">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                  {location}
                </span>
                {experience_level && (
                  <span className="text-xs text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-full capitalize">
                    {experience_level} level
                  </span>
                )}
                {salary && (
                  <span className="flex items-center gap-1.5 text-sm font-semibold text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-3 py-1.5 rounded-full">
                    💰 {salary}
                  </span>
                )}
                <span className="text-xs text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-full">
                  👁️ {views} views
                </span>
              </div>
            </div>

            {/* Desktop apply buttons */}
            <div className="hidden md:flex flex-col gap-2 flex-shrink-0">
              {isAuthenticated && user?.role === 'applicant' ? (
                <>
                  <button onClick={() => setShowApply(true)} className="bg-brand-600 hover:bg-brand-700 text-white px-6 py-2.5 rounded-xl font-semibold transition-colors text-sm whitespace-nowrap">
                    Apply Now →
                  </button>
                  <button onClick={handleSave} className={`px-6 py-2.5 rounded-xl font-medium text-sm border transition-colors ${isSaved ? 'bg-brand-50 border-brand-200 text-brand-700' : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
                    {isSaved ? '✓ Saved' : '🔖 Save Job'}
                  </button>
                </>
              ) : !isAuthenticated ? (
                <Link to="/login" state={{ from: { pathname: `/jobs/${id}` } }} className="bg-brand-600 hover:bg-brand-700 text-white px-6 py-2.5 rounded-xl font-semibold transition-colors text-sm text-center">
                  Sign In to Apply
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left: Job details */}
          <div className="lg:col-span-2 space-y-5">

            {/* Description */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
              <h2 className="font-semibold text-gray-900 dark:text-white text-lg mb-4 flex items-center gap-2">
                <span className="w-1 h-5 bg-brand-600 rounded-full inline-block"></span>
                Job Description
              </h2>
              <div className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                {description}
              </div>
            </div>

            {/* Requirements */}
            {requirements && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
                <h2 className="font-semibold text-gray-900 dark:text-white text-lg mb-4 flex items-center gap-2">
                  <span className="w-1 h-5 bg-accent-600 rounded-full inline-block"></span>
                  Requirements
                </h2>
                <div className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                  {requirements}
                </div>
              </div>
            )}

            {/* Mobile apply button */}
            <div className="md:hidden">
              {isAuthenticated && user?.role === 'applicant' ? (
                <div className="flex gap-3">
                  <button onClick={() => setShowApply(true)} className="flex-1 bg-brand-600 hover:bg-brand-700 text-white py-3 rounded-xl font-semibold transition-colors">
                    Apply Now →
                  </button>
                  <button onClick={handleSave} className={`px-4 py-3 rounded-xl font-medium border transition-colors ${isSaved ? 'bg-brand-50 border-brand-200 text-brand-700' : 'border-gray-200 text-gray-600'}`}>
                    {isSaved ? '✓' : '🔖'}
                  </button>
                </div>
              ) : !isAuthenticated ? (
                <Link to="/login" className="block w-full bg-brand-600 text-white py-3 rounded-xl font-semibold text-center">
                  Sign In to Apply
                </Link>
              ) : null}
            </div>
          </div>

          {/* Right: Sidebar */}
          <div className="space-y-5">
            {/* Job details card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Job Details</h3>
              <div className="space-y-3">
                {[
                  { icon: '📅', label: 'Posted', value: new Date(created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) },
                  deadline && { icon: '⏰', label: 'Deadline', value: new Date(deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), red: new Date(deadline) < new Date(Date.now() + 7*86400000) },
                  category && { icon: '🏷️', label: 'Category', value: category },
                  salary && { icon: '💰', label: 'Salary', value: salary },
                  job_type && { icon: '💼', label: 'Type', value: job_type.replace('-', ' ') },
                  experience_level && { icon: '📊', label: 'Experience', value: experience_level + ' level' },
                ].filter(Boolean).map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="text-base flex-shrink-0 mt-0.5">{item.icon}</span>
                    <div>
                      <p className="text-xs text-gray-400 dark:text-gray-500">{item.label}</p>
                      <p className={`text-sm font-medium capitalize ${item.red ? 'text-red-600' : 'text-gray-800 dark:text-gray-200'}`}>{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Company card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">About the Company</h3>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-100 to-accent-100 dark:from-brand-900/40 dark:to-accent-900/40 flex items-center justify-center flex-shrink-0">
                  <span className="font-bold text-brand-600 dark:text-brand-400">{company?.company_name?.charAt(0)}</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">{company?.company_name}</p>
                  {company?.industry && <p className="text-xs text-gray-500 dark:text-gray-400">{company.industry}</p>}
                </div>
              </div>
              <div className="space-y-2">
                {company?.location && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                    <span>📍</span> {company.location}
                  </p>
                )}
                {company?.company_size && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                    <span>👥</span> {company.company_size} employees
                  </p>
                )}
                {company?.website && (
                  <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-xs text-brand-600 hover:text-brand-700 flex items-center gap-1.5">
                    <span>🌐</span> Visit website
                  </a>
                )}
              </div>
              {company?.description && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 leading-relaxed line-clamp-4">{company.description}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Apply Modal ──────────────────────────────────────── */}
      {showApply && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4 animate-fade-in">
          <div className="bg-white dark:bg-gray-900 w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl shadow-2xl animate-slide-up max-h-[95vh] overflow-y-auto">

            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-gray-800">
              <div>
                <h3 className="font-display text-lg font-bold text-gray-900 dark:text-white">Apply for this Job</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{title} · {company?.company_name}</p>
              </div>
              <button onClick={() => setShowApply(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <form onSubmit={handleApply} className="px-6 py-5 space-y-5">

              {/* CV Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  CV / Resume <span className="text-red-500">*</span>
                  <span className="font-normal text-gray-400 ml-1">(PDF only, max 5MB)</span>
                </label>
                <div
                  onClick={() => fileRef.current.click()}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                    cvFile
                      ? 'border-brand-400 bg-brand-50 dark:bg-brand-900/20'
                      : dragOver
                      ? 'border-brand-400 bg-brand-50 dark:bg-brand-900/10 scale-[1.01]'
                      : 'border-gray-200 dark:border-gray-700 hover:border-brand-300 dark:hover:border-brand-600 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                  }`}
                >
                  {cvFile ? (
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 bg-brand-100 dark:bg-brand-900/30 rounded-xl flex items-center justify-center mb-3">
                        <svg className="w-6 h-6 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                      </div>
                      <p className="font-semibold text-brand-700 dark:text-brand-400 text-sm">{cvFile.name}</p>
                      <p className="text-xs text-brand-500 mt-1">{(cvFile.size / 1024 / 1024).toFixed(2)} MB · Click to change</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center mb-3">
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                      </div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Drop your CV here or <span className="text-brand-600">browse</span></p>
                      <p className="text-xs text-gray-400 mt-1">PDF format only · Max size 5MB</p>
                    </div>
                  )}
                </div>
                <input ref={fileRef} type="file" accept=".pdf,application/pdf" onChange={(e) => {
                  const f = e.target.files[0];
                  if (f && f.size > 5 * 1024 * 1024) { toast.error('File too large. Max 5MB.'); return; }
                  if (f) setCvFile(f);
                }} className="hidden" />
              </div>

              {/* Application Letter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Application Letter
                  <span className="font-normal text-gray-400 ml-1">(optional but recommended)</span>
                </label>
                <textarea
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  rows={5}
                  maxLength={2000}
                  placeholder={`Dear Hiring Manager,\n\nI am writing to express my interest in the ${title} position at ${company?.company_name}...\n\nThank you for your consideration.`}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 outline-none focus:ring-2 focus:ring-brand-500 resize-none transition-all leading-relaxed"
                />
                <div className="flex justify-between mt-1">
                  <p className="text-xs text-gray-400">Introduce yourself and why you're a great fit</p>
                  <p className="text-xs text-gray-400">{coverLetter.length}/2000</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2 pb-1">
                <button type="button" onClick={() => setShowApply(false)} className="flex-1 py-3 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={applying || !cvFile}
                  className="flex-1 py-3 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  {applying ? (
                    <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Submitting...</>
                  ) : (
                    <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg> Submit Application</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetail;
