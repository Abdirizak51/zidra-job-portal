import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { companiesAPI } from '../../services/api';

const CompanyProfile = () => {
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ company_name: '', location: '', description: '', website: '', industry: '', company_size: '' });

  useEffect(() => {
    companiesAPI.getMyCompany().then(r => {
      const c = r.data.data.company;
      if (c) { setCompany(c); setForm({ company_name: c.company_name || '', location: c.location || '', description: c.description || '', website: c.website || '', industry: c.industry || '', company_size: c.company_size || '' }); }
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (company) {
        const r = await companiesAPI.updateCompany(form);
        setCompany(r.data.data.company);
        toast.success('Company profile updated!');
      } else {
        const r = await companiesAPI.createCompany(form);
        setCompany(r.data.data.company);
        toast.success('Company profile created!');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save company profile');
    } finally { setSaving(false); }
  };

  const inputClass = "w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-brand-500";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white">Company Profile</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">{company ? 'Update your company details' : 'Set up your company profile to start posting jobs'}</p>
        </div>

        {!company && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-2xl p-4 mb-6 flex items-center gap-3">
            <span className="text-2xl">ℹ️</span>
            <p className="text-sm text-blue-700 dark:text-blue-300">You need to create a company profile before you can post jobs.</p>
          </div>
        )}

        {loading ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-8 animate-pulse">
            <div className="space-y-4">{Array(5).fill(0).map((_, i) => <div key={i} className="h-10 bg-gray-200 dark:bg-gray-700 rounded-xl" />)}</div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Company Name *</label>
                <input type="text" name="company_name" value={form.company_name} onChange={handleChange} required placeholder="e.g. Hormuud Telecom" className={inputClass} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Location</label>
                  <input type="text" name="location" value={form.location} onChange={handleChange} placeholder="Mogadishu, Somalia" className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Industry</label>
                  <input type="text" name="industry" value={form.industry} onChange={handleChange} placeholder="e.g. Telecommunications" className={inputClass} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Company Size</label>
                  <select name="company_size" value={form.company_size} onChange={handleChange} className={inputClass}>
                    <option value="">Select size</option>
                    {['1-10', '11-50', '51-200', '201-500', '500+'].map(s => <option key={s} value={s}>{s} employees</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Website</label>
                  <input type="url" name="website" value={form.website} onChange={handleChange} placeholder="https://example.com" className={inputClass} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Company Description</label>
                <textarea name="description" value={form.description} onChange={handleChange} rows={5}
                  placeholder="Tell job seekers about your company, culture, and mission..."
                  className={`${inputClass} resize-none`} />
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button type="submit" disabled={saving}
                className="bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white px-8 py-2.5 rounded-xl font-semibold text-sm transition-colors">
                {saving ? 'Saving...' : company ? 'Update Profile' : 'Create Profile'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default CompanyProfile;
