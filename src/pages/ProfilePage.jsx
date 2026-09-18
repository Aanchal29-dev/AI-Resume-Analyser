// src/pages/ProfilePage.jsx
import React, { useState } from 'react';
import Sidebar from '../components/common/Sidebar';
import { useApp } from '../context/AppContext';
import { User, Mail, Phone, GraduationCap, Briefcase, Save } from 'lucide-react';

const ProfilePage = () => {
  const { userProfile, setUserProfile } = useApp();
  const [profileForm, setProfileForm] = useState(userProfile);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setUserProfile(profileForm);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  return (
    <Sidebar>
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">User Profile & Preferences</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">Manage your academic background and career targeting preferences.</p>
        </div>

        <form onSubmit={handleSave} className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-soft space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                value={profileForm.fullName}
                onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-600"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Email Address</label>
              <input
                type="text"
                value={profileForm.email}
                onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-600"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Education Level</label>
              <select
                value={profileForm.educationLevel}
                onChange={(e) => setProfileForm({ ...profileForm, educationLevel: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-600 bg-white"
              >
                <option>Undergraduate Senior</option>
                <option>Recent Graduate (0-1 yrs)</option>
                <option>Master's Candidate</option>
                <option>Career Switcher</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Target Industry</label>
              <input
                type="text"
                value={profileForm.targetIndustry}
                onChange={(e) => setProfileForm({ ...profileForm, targetIndustry: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-600"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            {saveSuccess && <span className="text-xs font-bold text-emerald-600">Profile Updated Successfully! ✓</span>}
            <button
              type="submit"
              className="ml-auto px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" /> Save Profile
            </button>
          </div>
        </form>
      </div>
    </Sidebar>
  );
};

export default ProfilePage;
