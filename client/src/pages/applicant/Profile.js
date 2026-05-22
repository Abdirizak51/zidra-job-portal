import React, { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { usersAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [form, setForm]     = useState({ name: '', phone: '', location: '', bio: '', skills: '' });
  const [loading, setLoading]   = useState(false);
  const [cvFile, setCvFile]     = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef();

  useEffect(() => {
    usersAPI.getProfile().then(r => {
      const u = r.data.data.user;
      setForm({
        name:     u.name     || '',
        phone:    u.phone    || '',
        location: u.location || '',
        bio:      u.bio      || '',
        skills:   Array.isArray(u.skills) ? u.skills.join(', ') : (u.skills || ''),
      });
    }).catch(console.error);
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const skills = form.skills ? form.skills.split(',').map(s => s.trim()).filter(Boolean) : [];
      await usersAPI.updateProfile({ ...form, skills });
      updateUser({ name: form.name });
      toast.success('✅ Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally { setLoading(false); }
  };

  const handleCVUpload = async () => {
    if (!cvFile) return toast.error('Select a PDF file first');
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('cv', cvFile);
      await usersAPI.uploadCV(fd);
      toast.success('✅ CV uploaded successfully!');
      setCvFile(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to upload CV');
    } finally { setUploading(false); }
  };

  const inp = "w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-brand-500 transition-all";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white">My Profile</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Keep your profile up to date to get better job matches</p>
        </div>

        {/* Avatar */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 mb-5 flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center text-white font-display font-bold text-3xl flex-shrink-0">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-gray-900 dark:text-white text-lg">{user?.name}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
            <span className="inline-block mt-1 text-xs font-medium bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400 px-2.5 py-1 rounded-full capitalize">{user?.role}</span>
          </div>
        </div>

        {/* Profile form */}
        <form onSubmit={handleSave} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 mb-5">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
            <span className="w-1 h-5 bg-brand-600 rounded-full inline-block" />
            Personal Information
          </h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                <input type="text" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className={inp} placeholder="Ahmed Hassan" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone Number</label>
                <input type="tel" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} className={inp} placeholder="+252 61 000 0000" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Location</label>
              <input type="text" value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} className={inp} placeholder="e.g. Mogadishu, Somalia" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Bio</label>
              <textarea value={form.bio} onChange={e => setForm(p => ({ ...p, bio: e.target.value }))} rows={4} maxLength={1000}
                placeholder="Tell employers about yourself, your experience, and what you're looking for..."
                className={`${inp} resize-none`} />
              <p className="text-xs text-gray-400 mt-1">{form.bio.length}/1000</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Skills</label>
              <input type="text" value={form.skills} onChange={e => setForm(p => ({ ...p, skills: e.target.value }))} className={inp}
                placeholder="e.g. JavaScript, React, Node.js, Excel, Communication" />
              <p className="text-xs text-gray-400 mt-1">Separate each skill with a comma</p>
            </div>

            {/* Skills preview */}
            {form.skills && (
              <div className="flex flex-wrap gap-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                {form.skills.split(',').map(s => s.trim()).filter(Boolean).map((skill, i) => (
                  <span key={i} className="text-xs bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400 px-2.5 py-1 rounded-full border border-brand-100 dark:border-brand-800">
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </div>
          <button type="submit" disabled={loading} className="w-full mt-6 bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white py-3 rounded-xl font-semibold transition-colors">
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>

        {/* CV Upload */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
            <span className="w-1 h-5 bg-accent-600 rounded-full inline-block" />
            Upload CV / Resume
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">Upload your latest CV so you can apply quickly to jobs</p>

          <div
            onClick={() => fileRef.current.click()}
            className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
              cvFile ? 'border-brand-400 bg-brand-50 dark:bg-brand-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-brand-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            {cvFile ? (
              <div>
                <div className="text-4xl mb-3">📄</div>
                <p className="font-semibold text-brand-700 dark:text-brand-400">{cvFile.name}</p>
                <p className="text-xs text-brand-500 mt-1">{(cvFile.size / 1024 / 1024).toFixed(2)} MB · Click to change</p>
              </div>
            ) : (
              <div>
                <div className="text-4xl mb-3">📁</div>
                <p className="font-medium text-gray-700 dark:text-gray-300 text-sm">Click to upload your CV</p>
                <p className="text-xs text-gray-400 mt-1">PDF only · Max 5MB</p>
              </div>
            )}
          </div>
          <input ref={fileRef} type="file" accept=".pdf,application/pdf" onChange={e => {
            const f = e.target.files[0];
            if (f && f.size > 5 * 1024 * 1024) { toast.error('File too large. Max 5MB'); return; }
            if (f) setCvFile(f);
          }} className="hidden" />

          {cvFile && (
            <button onClick={handleCVUpload} disabled={uploading} className="w-full mt-4 bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white py-3 rounded-xl font-semibold transition-colors">
              {uploading ? 'Uploading...' : '⬆️ Upload CV'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
