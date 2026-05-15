import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { jobsAPI, applicationsAPI, savedJobsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const JobDetail = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [cvFile, setCvFile] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const fileRef = useRef();

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const { data } = await jobsAPI.getJob(id);
        setJob(data.data.job);

        if (isAuthenticated && user?.role === 'applicant') {
          try {
            const saveData = await savedJobsAPI.getSaveStatus(id);
            setIsSaved(saveData.data.data.saved);
          } catch (e) {}
        }
      } catch (error) {
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
    if (!cvFile) return toast.error('Please select your CV (PDF)');

    setApplying(true);
    const formData = new FormData();
    formData.append('cv', cvFile);
    if (coverLetter) formData.append('cover_letter', coverLetter);

    try {
      await applicationsAPI.apply(id, formData);
      toast.success('Application submitted successfully!');
      setShowApplyModal(false);
      setCvFile(null);
      setCoverLetter('');
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to submit application';
      toast.error(msg);
    } finally {
      setApplying(false);
    }
  };

  const handleSave = async () => {
    if (!isAuthenticated) return navigate('/login');
    try {
      const { data } = await savedJobsAPI.toggleSave(id);
      setIsSaved(data.data.saved);
      toast.success(data.data.saved ? 'Job saved!' : 'Job removed from saved');
    } catch (error) {
      toast.error('Failed to save job');
    }
  };

  if (loading) return <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>;
  if (!job) return null;

  const { title, description, requirements, location, job_type, salary_min, salary_max, salary_currency, experience_level, category, deadline, views, created_at, company } = job;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/jobs" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 mb-6 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Back to Jobs
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job header */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 animate-fade-in">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-brand-100 to-accent-100 dark:from-brand-900 dark:to-accent-900 flex items-center justify-center flex-shrink-0 border border-gray-100 dark:border-gray-700">
                  <span className="text-brand-600 font-display font-bold text-2xl">
                    {company?.company_name?.charAt(0)}
                  </span>
                </div>
                <div className="flex-1">
                  <h1 className="font-display text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>
                  <Link to={`/companies/${company?.id}`} className="text-brand-600 hover:text-brand-700 font-medium">{company?.company_name}</Link>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <span className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 px-3 py-1.5 rounded-lg">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                  {location}
                </span>
                <span className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 px-3 py-1.5 rounded-lg capitalize">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  {job_type?.replace('-', ' ')}
                </span>
                {experience_level && (
                  <span className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 px-3 py-1.5 rounded-lg capitalize">
                    {experience_level} level
                  </span>
                )}
                {(salary_min || salary_max) && (
                  <span className="flex items-center gap-1.5 text-sm text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-3 py-1.5 rounded-lg">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    {salary_min && salary_max ? `$${salary_min} - $${salary_max}` : salary_min ? `From $${salary_min}` : `Up to $${salary_max}`} {salary_currency}
                  </span>
                )}
                <span className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 px-3 py-1.5 rounded-lg">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  {views} views
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
              <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Job Description</h2>
              <div className="prose dark:prose-invert max-w-none text-sm text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">
                {description}
              </div>
            </div>

            {requirements && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
                <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Requirements</h2>
                <div className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">{requirements}</div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Apply button */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 sticky top-20">
              {isAuthenticated && user?.role === 'applicant' ? (
                <>
                  <button
                    onClick={() => setShowApplyModal(true)}
                    className="w-full bg-brand-600 hover:bg-brand-700 text-white py-3 rounded-xl font-semibold transition-colors mb-3"
                  >
                    Apply Now
                  </button>
                  <button
                    onClick={handleSave}
                    className={`w-full py-3 rounded-xl font-medium transition-colors border text-sm ${isSaved ? 'bg-brand-50 dark:bg-brand-900/20 border-brand-200 dark:border-brand-700 text-brand-700 dark:text-brand-400' : 'border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                  >
                    {isSaved ? '✓ Saved' : '🔖 Save Job'}
                  </button>
                </>
              ) : !isAuthenticated ? (
                <Link to="/login" className="block w-full bg-brand-600 hover:bg-brand-700 text-white py-3 rounded-xl font-semibold transition-colors text-center">
                  Sign In to Apply
                </Link>
              ) : null}

              <div className="mt-5 space-y-3 border-t border-gray-100 dark:border-gray-700 pt-5">
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  <span className="font-medium text-gray-700 dark:text-gray-300">Posted:</span> {new Date(created_at).toLocaleDateString()}
                </div>
                {deadline && (
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    <span className="font-medium text-gray-700 dark:text-gray-300">Deadline:</span> {new Date(deadline).toLocaleDateString()}
                  </div>
                )}
                {category && (
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    <span className="font-medium text-gray-700 dark:text-gray-300">Category:</span> {category}
                  </div>
                )}
              </div>
            </div>

            {/* Company card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">About the Company</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1 font-medium">{company?.company_name}</p>
              {company?.location && <p className="text-xs text-gray-500 dark:text-gray-400">📍 {company.location}</p>}
              {company?.industry && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">🏢 {company.industry}</p>}
              {company?.company_size && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">👥 {company.company_size} employees</p>}
              {company?.description && <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 leading-relaxed line-clamp-3">{company.description}</p>}
            </div>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6 animate-slide-up">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-display text-lg font-bold text-gray-900 dark:text-white">Apply for {title}</h3>
              <button onClick={() => setShowApplyModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <form onSubmit={handleApply}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">CV / Resume (PDF only)*</label>
                <div
                  onClick={() => fileRef.current.click()}
                  className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${cvFile ? 'border-brand-400 bg-brand-50 dark:bg-brand-900/20' : 'border-gray-300 dark:border-gray-600 hover:border-brand-400'}`}
                >
                  <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                  {cvFile ? (
                    <p className="text-sm text-brand-700 dark:text-brand-400 font-medium">{cvFile.name}</p>
                  ) : (
                    <>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Click to upload your CV</p>
                      <p className="text-xs text-gray-400 mt-1">PDF only, max 5MB</p>
                    </>
                  )}
                </div>
                <input ref={fileRef} type="file" accept=".pdf" onChange={(e) => setCvFile(e.target.files[0])} className="hidden" />
              </div>

              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Cover Letter (optional)</label>
                <textarea
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  rows={4}
                  placeholder="Tell the employer why you're a great fit..."
                  className="w-full px-3 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-brand-500 resize-none"
                />
              </div>

              <div className="flex gap-3">
                <button type="button" onClick={() => setShowApplyModal(false)} className="flex-1 py-3 border border-gray-200 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={applying || !cvFile} className="flex-1 py-3 bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white rounded-xl text-sm font-semibold transition-colors">
                  {applying ? 'Submitting...' : 'Submit Application'}
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
