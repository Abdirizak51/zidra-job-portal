import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { jobsAPI } from '../../services/api';

const PostJob = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '', description: '', requirements: '', location: '',
    job_type: 'full-time', experience_level: 'mid', category: '',
    salary_min: '', salary_max: '', salary_currency: 'USD', deadline: '',
  });

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...form };
      if (!payload.salary_min) delete payload.salary_min;
      if (!payload.salary_max) delete payload.salary_max;
      if (!payload.deadline) delete payload.deadline;
      await jobsAPI.createJob(payload);
      toast.success('Job posted! Awaiting admin approval.');
      navigate('/employer/jobs');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to post job');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-brand-500 transition-all";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white">Post a New Job</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Fill in the details. Your job will be reviewed by admin.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-5">Basic Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Job Title *</label>
                <input type="text" name="title" value={form.title} onChange={handleChange} required
                  placeholder="e.g. Senior Software Engineer" className={inputClass} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Job Type *</label>
                  <select name="job_type" value={form.job_type} onChange={handleChange} className={inputClass}>
                    {['full-time', 'part-time', 'contract', 'internship', 'remote'].map(t => (
                      <option key={t} value={t}>{t.replace('-', ' ')}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Experience Level</label>
                  <select name="experience_level" value={form.experience_level} onChange={handleChange} className={inputClass}>
                    {['entry', 'mid', 'senior', 'executive'].map(l => (
                      <option key={l} value={l}>{l} level</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Location *</label>
                  <input type="text" name="location" value={form.location} onChange={handleChange} required
                    placeholder="e.g. Mogadishu, Somalia" className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
                  <input type="text" name="category" value={form.category} onChange={handleChange}
                    placeholder="e.g. Technology" className={inputClass} />
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-5">Job Details</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Job Description *</label>
                <textarea name="description" value={form.description} onChange={handleChange} required rows={6}
                  placeholder="Describe the role, responsibilities, and what the candidate will be doing..."
                  className={`${inputClass} resize-none`} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Requirements</label>
                <textarea name="requirements" value={form.requirements} onChange={handleChange} rows={4}
                  placeholder="List required qualifications, experience, skills..."
                  className={`${inputClass} resize-none`} />
              </div>
            </div>
          </div>

          {/* Salary */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-5">Salary & Deadline</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Min Salary</label>
                <input type="number" name="salary_min" value={form.salary_min} onChange={handleChange}
                  placeholder="e.g. 1000" className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Max Salary</label>
                <input type="number" name="salary_max" value={form.salary_max} onChange={handleChange}
                  placeholder="e.g. 3000" className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Currency</label>
                <select name="salary_currency" value={form.salary_currency} onChange={handleChange} className={inputClass}>
                  <option>USD</option><option>EUR</option><option>GBP</option><option>SOS</option>
                </select>
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Application Deadline</label>
              <input type="date" name="deadline" value={form.deadline} onChange={handleChange}
                min={new Date().toISOString().split('T')[0]} className={`${inputClass} max-w-xs`} />
            </div>
          </div>

          <div className="flex gap-4 justify-end">
            <button type="button" onClick={() => navigate('/employer/jobs')}
              className="px-6 py-2.5 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white px-8 py-2.5 rounded-xl text-sm font-semibold transition-colors">
              {loading ? 'Posting...' : 'Post Job'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostJob;
