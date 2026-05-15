import React, { useState, useRef } from 'react';
import toast from 'react-hot-toast';
import { usersAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '', phone: user?.phone || '',
    location: user?.location || '', bio: user?.bio || '',
    skills: Array.isArray(user?.skills) ? user.skills.join(', ') : '',
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [skillInput, setSkillInput] = useState('');
  const [skills, setSkills] = useState(Array.isArray(user?.skills) ? user.skills : []);
  const cvRef = useRef();

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const addSkill = (e) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault();
      if (!skills.includes(skillInput.trim())) {
        setSkills(prev => [...prev, skillInput.trim()]);
      }
      setSkillInput('');
    }
  };

  const removeSkill = (skill) => setSkills(prev => prev.filter(s => s !== skill));

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await usersAPI.updateProfile({ ...form, skills });
      updateUser(data.data.user);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCVUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== 'application/pdf') return toast.error('Only PDF files allowed');
    if (file.size > 5 * 1024 * 1024) return toast.error('File too large (max 5MB)');

    setUploading(true);
    const formData = new FormData();
    formData.append('cv', file);
    try {
      await usersAPI.uploadCV(formData);
      toast.success('CV uploaded successfully!');
    } catch (error) {
      toast.error('Failed to upload CV');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white">My Profile</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Keep your profile up to date</p>
        </div>

        <div className="space-y-6">
          {/* Avatar / info header */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center text-white font-display font-bold text-3xl flex-shrink-0">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{user?.name}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
                <span className="inline-block mt-1 text-xs font-medium bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400 px-2 py-0.5 rounded-full capitalize">{user?.role}</span>
              </div>
            </div>
          </div>

          {/* Personal Info */}
          <form onSubmit={handleSave} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-5">Personal Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                <input type="text" name="name" value={form.name} onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone Number</label>
                <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="+252 61 xxxxxxx"
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-brand-500" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Location</label>
                <input type="text" name="location" value={form.location} onChange={handleChange} placeholder="e.g. Mogadishu, Somalia"
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-brand-500" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Bio</label>
                <textarea name="bio" value={form.bio} onChange={handleChange} rows={4} placeholder="Tell employers about yourself..."
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-brand-500 resize-none" />
              </div>

              {/* Skills */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Skills</label>
                <input
                  type="text" value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={addSkill}
                  placeholder="Type a skill and press Enter..."
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-brand-500"
                />
                {skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {skills.map(skill => (
                      <span key={skill} className="flex items-center gap-1 bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400 text-xs font-medium px-3 py-1.5 rounded-full">
                        {skill}
                        <button type="button" onClick={() => removeSkill(skill)} className="ml-1 hover:text-red-500">×</button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button type="submit" disabled={saving}
                className="bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white px-6 py-2.5 rounded-xl font-medium text-sm transition-colors">
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>

          {/* CV Upload */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">CV / Resume</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Upload your CV so employers can review your background. PDF only, max 5MB.</p>
            <div
              onClick={() => cvRef.current.click()}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${user?.cv_path ? 'border-green-400 bg-green-50 dark:bg-green-900/10' : 'border-gray-300 dark:border-gray-600 hover:border-brand-400 hover:bg-brand-50 dark:hover:bg-brand-900/10'}`}
            >
              {uploading ? (
                <p className="text-sm text-gray-500">Uploading...</p>
              ) : user?.cv_path ? (
                <>
                  <div className="text-3xl mb-2">✅</div>
                  <p className="text-sm font-medium text-green-700 dark:text-green-400">CV uploaded successfully</p>
                  <p className="text-xs text-gray-400 mt-1">Click to replace</p>
                </>
              ) : (
                <>
                  <div className="text-3xl mb-2">📄</div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Click to upload your CV</p>
                  <p className="text-xs text-gray-400 mt-1">PDF only, max 5MB</p>
                </>
              )}
            </div>
            <input ref={cvRef} type="file" accept=".pdf" onChange={handleCVUpload} className="hidden" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
