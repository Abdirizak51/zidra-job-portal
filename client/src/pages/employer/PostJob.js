import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { jobsAPI } from '../../services/api';

const CATEGORIES = [
  'Technology', 'Finance', 'Healthcare', 'Education', 'Engineering',
  'Marketing', 'Sales', 'Design', 'Customer Service', 'Logistics',
  'Construction', 'Legal', 'Human Resources', 'Hospitality', 'Other'
];

const PostJob = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    title: '', description: '', requirements: '',
    location: '', job_type: 'full-time', experience_level: 'mid',
    category: '', salary_min: '', salary_max: '', salary_currency: 'USD',
    deadline: '',
  });

  const set = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim() || !form.location.trim()) {
      return toast.error('Please fill in all required fields.');
    }
    setLoading(true);
    try {
      const payload = { ...form };
      if (!payload.salary_min) delete payload.salary_min;
      if (!payload.salary_max) delete payload.salary_max;
      if (!payload.deadline)   delete payload.deadline;
      if (!payload.requirements) delete payload.requirements;
      await jobsAPI.createJob(payload);
      toast.success('🎉 Job posted! Awaiting admin approval.');
      navigate('/employer/jobs');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post job. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const inp = "w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white">Post a New Job</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Fill in the details below. Your job will be reviewed by admin before going live.
          </p>
        </div>

        {/* Progress steps */}
        <div className="flex items-center gap-3 mb-8">
          {['Basic Info', 'Job Details', 'Salary & Deadline'].map((s, i) => (
            <React.Fragment key={i}>
              <button
                type="button"
                onClick={() => setStep(i + 1)}
                className={`flex items-center gap-2 text-sm font-medium transition-colors ${step === i + 1 ? 'text-brand-600' : step > i + 1 ? 'text-green-600' : 'text-gray-400'}`}
              >
                <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${step === i + 1 ? 'bg-brand-600 text-white' : step > i + 1 ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'}`}>
                  {step > i + 1 ? '✓' : i + 1}
                </span>
                <span className="hidden sm:block">{s}</span>
              </button>
              {i < 2 && <div className={`flex-1 h-0.5 rounded-full transition-colors ${step > i + 1 ? 'bg-green-400' : 'bg-gray-200 dark:bg-gray-700'}`} />}
            </React.Fragment>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* STEP 1: Basic Info */}
          {step === 1 && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 space-y-5 animate-fade-in">
              <h3 className="font-semibold text-gray-900 dark:text-white text-base">Basic Information</h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Job Title <span className="text-red-500">*</span></label>
                <input type="text" name="title" value={form.title} onChange={set} required
                  placeholder="e.g. Senior Software Engineer, Sales Manager, Nurse" className={inp} />
                <p className="text-xs text-gray-400 mt-1">Be specific — clear titles get more applications</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Job Type <span className="text-red-500">*</span></label>
                  <select name="job_type" value={form.job_type} onChange={set} className={inp}>
                    <option value="full-time">Full-Time</option>
                    <option value="part-time">Part-Time</option>
                    <option value="contract">Contract</option>
                    <option value="internship">Internship</option>
                    <option value="remote">Remote</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Experience Level</label>
                  <select name="experience_level" value={form.experience_level} onChange={set} className={inp}>
                    <option value="entry">Entry Level (0-2 years)</option>
                    <option value="mid">Mid Level (2-5 years)</option>
                    <option value="senior">Senior Level (5+ years)</option>
                    <option value="executive">Executive</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Location <span className="text-red-500">*</span></label>
                  <input type="text" name="location" value={form.location} onChange={set} required
                    placeholder="e.g. Mogadishu, Hargeisa, Remote" className={inp} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
                  <select name="category" value={form.category} onChange={set} className={inp}>
                    <option value="">Select a category</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="flex justify-end">
                <button type="button" onClick={() => { if (!form.title || !form.location) return toast.error('Fill in Job Title and Location first.'); setStep(2); }}
                  className="bg-brand-600 hover:bg-brand-700 text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition-colors">
                  Next →
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Job Details */}
          {step === 2 && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 space-y-5 animate-fade-in">
              <h3 className="font-semibold text-gray-900 dark:text-white text-base">Job Details</h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Job Description <span className="text-red-500">*</span>
                </label>
                <textarea name="description" value={form.description} onChange={set} required rows={8}
                  placeholder={`Describe this position in detail:\n\n• What will the candidate do day-to-day?\n• What team will they work with?\n• What are the key responsibilities?\n• What does success look like in this role?\n• Why is this a great opportunity?`}
                  className={`${inp} resize-none leading-relaxed`} />
                <p className="text-xs text-gray-400 mt-1">{form.description.length} characters · Minimum 20 required · Be detailed for better candidates</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Requirements & Qualifications
                </label>
                <textarea name="requirements" value={form.requirements} onChange={set} rows={6}
                  placeholder={`List what you're looking for:\n\n• Minimum education level\n• Years of experience required\n• Technical skills needed\n• Certifications or licenses\n• Soft skills important for the role`}
                  className={`${inp} resize-none leading-relaxed`} />
                <p className="text-xs text-gray-400 mt-1">Optional but highly recommended</p>
              </div>

              <div className="flex justify-between">
                <button type="button" onClick={() => setStep(1)} className="px-6 py-2.5 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  ← Back
                </button>
                <button type="button" onClick={() => { if (!form.description) return toast.error('Job description is required.'); setStep(3); }}
                  className="bg-brand-600 hover:bg-brand-700 text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition-colors">
                  Next →
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Salary & Deadline */}
          {step === 3 && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 space-y-5 animate-fade-in">
              <h3 className="font-semibold text-gray-900 dark:text-white text-base">Salary & Deadline</h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Salary Range <span className="text-gray-400 font-normal">(optional but recommended)</span>
                </label>
                <div className="flex items-center gap-3">
                  <input type="number" name="salary_min" value={form.salary_min} onChange={set} min="0"
                    placeholder="Min e.g. 500" className={`${inp} flex-1`} />
                  <span className="text-gray-400 flex-shrink-0">—</span>
                  <input type="number" name="salary_max" value={form.salary_max} onChange={set} min="0"
                    placeholder="Max e.g. 2000" className={`${inp} flex-1`} />
                  <select name="salary_currency" value={form.salary_currency} onChange={set} className={`${inp} w-28 flex-shrink-0`}>
                    <option value="USD">USD $</option>
                    <option value="EUR">EUR €</option>
                    <option value="GBP">GBP £</option>
                    <option value="SOS">SOS</option>
                  </select>
                </div>
                <p className="text-xs text-gray-400 mt-1">💡 Jobs with salary info get 3x more applications</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Application Deadline <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <input type="date" name="deadline" value={form.deadline} onChange={set}
                  min={new Date().toISOString().split('T')[0]}
                  className={`${inp} max-w-xs`} />
              </div>

              {/* Summary preview */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 border border-gray-100 dark:border-gray-600">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">Job Preview</p>
                <div className="space-y-2">
                  <p className="font-semibold text-gray-900 dark:text-white">{form.title || 'Job Title'}</p>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="bg-white dark:bg-gray-600 px-2.5 py-1 rounded-full text-gray-600 dark:text-gray-300 capitalize">{form.job_type.replace('-', ' ')}</span>
                    <span className="bg-white dark:bg-gray-600 px-2.5 py-1 rounded-full text-gray-600 dark:text-gray-300">📍 {form.location || 'Location'}</span>
                    {form.salary_min && <span className="bg-white dark:bg-gray-600 px-2.5 py-1 rounded-full text-green-700 dark:text-green-400">💰 {Number(form.salary_min).toLocaleString()}{form.salary_max ? `–${Number(form.salary_max).toLocaleString()}` : '+'} {form.salary_currency}</span>}
                    {form.category && <span className="bg-white dark:bg-gray-600 px-2.5 py-1 rounded-full text-gray-600 dark:text-gray-300">🏷️ {form.category}</span>}
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-2">
                <button type="button" onClick={() => setStep(2)} className="px-6 py-2.5 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  ← Back
                </button>
                <button type="submit" disabled={loading}
                  className="bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white px-8 py-2.5 rounded-xl font-bold text-sm transition-colors flex items-center gap-2">
                  {loading ? (
                    <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Posting...</>
                  ) : (
                    <>🚀 Post Job</>
                  )}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default PostJob;
