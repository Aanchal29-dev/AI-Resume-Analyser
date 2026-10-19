// src/pages/ProfilePage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import { useApp } from '../context/AppContext';
import { AVAILABLE_INDUSTRIES } from '../data/mockData';
import {
  User,
  Mail,
  Phone,
  GraduationCap,
  Briefcase,
  Save,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Check,
  Pencil,
  Compass,
  Loader2,
  ArrowRight
} from 'lucide-react';

const ProfilePage = () => {
  const navigate = useNavigate();
  const {
    userProfile,
    setUserProfile,
    selectedIndustry,
    setSelectedIndustry,
    customIndustryName,
    setCustomIndustryName,
    handleStartIndustryQuestionnaire,
    isGeneratingQuestionnaire,
    aiTailoredResume
  } = useApp();

  const [profileForm, setProfileForm] = useState(userProfile);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Industry Dropdown & Others State
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isOthersSelected, setIsOthersSelected] = useState(() => {
    const activeInd = selectedIndustry || userProfile.targetIndustry || '';
    const isStandard = AVAILABLE_INDUSTRIES.some(i => i.id !== 'others' && i.name.toLowerCase() === activeInd.toLowerCase());
    return !isStandard && Boolean(activeInd && activeInd !== 'Software & Technology');
  });
  const [customIndustryInput, setCustomIndustryInput] = useState(() =>
    customIndustryName || (userProfile.targetIndustry && userProfile.targetIndustry !== 'Software & Technology' ? userProfile.targetIndustry : '')
  );
  const [wantsQuestionnaire, setWantsQuestionnaire] = useState(true);

  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setProfileForm(userProfile);
  }, [userProfile]);

  const currentSelectedObj = isOthersSelected
    ? AVAILABLE_INDUSTRIES.find(i => i.id === 'others')
    : AVAILABLE_INDUSTRIES.find(i => i.name.toLowerCase() === (selectedIndustry || userProfile.targetIndustry || 'Software & Technology').toLowerCase()) || AVAILABLE_INDUSTRIES[0];

  const handleSelectDropdownIndustry = (ind) => {
    if (ind.id === 'others') {
      setIsOthersSelected(true);
      setSelectedIndustry('Others');
      setProfileForm(prev => ({ ...prev, targetIndustry: customIndustryInput.trim() || 'Others' }));
    } else {
      setIsOthersSelected(false);
      setSelectedIndustry(ind.name);
      setProfileForm(prev => ({ ...prev, targetIndustry: ind.name }));
    }
    setIsDropdownOpen(false);
  };

  const handleLaunchIndustryAssessment = async () => {
    const effectiveIndustry = isOthersSelected
      ? (customIndustryInput.trim() || 'Custom Industry')
      : (selectedIndustry || profileForm.targetIndustry || 'Software & Technology');

    // Save profile details first
    const updated = {
      ...profileForm,
      targetIndustry: effectiveIndustry
    };
    setUserProfile(updated);
    setSelectedIndustry(effectiveIndustry);

    if (isOthersSelected) {
      setCustomIndustryName(effectiveIndustry);
    }

    if (wantsQuestionnaire) {
      await handleStartIndustryQuestionnaire(effectiveIndustry, isOthersSelected, navigate);
    } else {
      navigate('/career-discovery');
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    const effectiveIndustry = isOthersSelected
      ? (customIndustryInput.trim() || 'Others')
      : (selectedIndustry || profileForm.targetIndustry || 'Software & Technology');

    const updated = {
      ...profileForm,
      targetIndustry: effectiveIndustry
    };
    setUserProfile(updated);
    setSelectedIndustry(effectiveIndustry);
    if (isOthersSelected && customIndustryInput.trim()) {
      setCustomIndustryName(customIndustryInput.trim());
    }
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <Sidebar>
      <div className="max-w-4xl mx-auto space-y-6 font-sans">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-purple-600" /> Account & Preferences
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">User Profile</h1>
            <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
              Personalize your workspace, select your target industry questionnaire, and let AI prepare your tailored resume.
            </p>
          </div>

          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-purple-200 bg-white hover:bg-purple-50 text-xs font-bold text-purple-900 shadow-2xs transition-colors cursor-pointer self-start sm:self-auto"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Workspace
          </button>
        </div>

        <form onSubmit={handleSave} className="bg-[#fbf7fd] rounded-3xl p-6 sm:p-8 border border-purple-200/90 shadow-soft space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
            <div>
              <label className="block font-bold text-stone-800 mb-1.5 flex items-center gap-1.5">
                <User className="w-4 h-4 text-purple-600" /> Full Name
              </label>
              <input
                type="text"
                placeholder="e.g. Aanchal Sharma"
                value={profileForm.fullName || ''}
                onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                className="w-full p-3 rounded-xl border border-purple-200/80 bg-white text-stone-900 font-medium focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 transition-all placeholder:text-stone-400"
              />
              <p className="text-[11px] text-stone-500 mt-1">Updates your dashboard welcome and resume applicant name immediately.</p>
            </div>

            <div>
              <label className="block font-bold text-stone-800 mb-1.5 flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-purple-600" /> Email Address
              </label>
              <input
                type="email"
                placeholder="e.g. yourname@college.edu"
                value={profileForm.email || ''}
                onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                className="w-full p-3 rounded-xl border border-purple-200/80 bg-white text-stone-900 font-medium focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 transition-all placeholder:text-stone-400"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-800 mb-1.5 flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-purple-600" /> Phone Number (Optional)
              </label>
              <input
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={profileForm.phone || ''}
                onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                className="w-full p-3 rounded-xl border border-purple-200/80 bg-white text-stone-900 font-medium focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 transition-all placeholder:text-stone-400"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-800 mb-1.5 flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-purple-600" /> Education Level
              </label>
              <select
                value={profileForm.educationLevel || 'Undergraduate Senior'}
                onChange={(e) => setProfileForm({ ...profileForm, educationLevel: e.target.value })}
                className="w-full p-3 rounded-xl border border-purple-200/80 bg-white text-stone-900 font-medium focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 transition-all cursor-pointer"
              >
                <option>Undergraduate Senior</option>
                <option>Recent Graduate (0-1 yrs)</option>
                <option>Master's Candidate</option>
                <option>Career Switcher</option>
                <option>High School / Diploma</option>
              </select>
            </div>

            {/* Target Industry & Interactive Questionnaire Section */}
            <div className="sm:col-span-2 pt-2">
              <div className="p-5 rounded-2xl bg-white border border-purple-200/90 shadow-2xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-purple-100 pb-3">
                  <div>
                    <label className="font-extrabold text-stone-900 text-sm flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-purple-700" />
                      Target Industry & Assessment Questionnaire
                    </label>
                    <p className="text-[11px] text-stone-500 mt-0.5">
                      Select an industry with questionnaire access or choose "Others" to enter any custom domain for dynamic AI analysis.
                    </p>
                  </div>

                  {aiTailoredResume && (
                    <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-bold border border-emerald-200 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Resume Tailored
                    </span>
                  )}
                </div>

                {/* Dropdown with arrow */}
                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-stone-700">Choose Industry:</span>
                  <div className="relative" ref={dropdownRef}>
                    <button
                      type="button"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="w-full flex items-center justify-between px-3.5 py-3 rounded-xl border border-purple-200 bg-purple-50/40 hover:bg-purple-50 hover:border-purple-400 text-stone-900 font-bold text-xs transition-all shadow-xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="w-2.5 h-2.5 rounded-full bg-purple-600 shrink-0"></span>
                        <span className="truncate">
                          {isOthersSelected
                            ? 'Others (Custom Industry)'
                            : (currentSelectedObj?.name || profileForm.targetIndustry || 'Software & Technology')}
                        </span>
                      </div>
                      <div className="flex items-center text-purple-600 shrink-0 ml-2">
                        {isDropdownOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </button>

                    {/* Dropdown Menu */}
                    {isDropdownOpen && (
                      <div className="absolute top-full left-0 right-0 mt-1.5 z-40 bg-white rounded-2xl border border-purple-200 shadow-xl py-1.5 max-h-64 overflow-y-auto divide-y divide-purple-50 animate-in fade-in duration-200">
                        {AVAILABLE_INDUSTRIES.map(ind => {
                          const isCurrent = (ind.id === 'others' && isOthersSelected) || (!isOthersSelected && currentSelectedObj?.id === ind.id);

                          return (
                            <div
                              key={ind.id}
                              onClick={() => handleSelectDropdownIndustry(ind)}
                              className={`px-3.5 py-2.5 hover:bg-purple-50/80 cursor-pointer transition-colors flex items-start justify-between gap-2 ${
                                isCurrent ? 'bg-purple-50/90 text-purple-900' : 'text-stone-800'
                              }`}
                            >
                              <div>
                                <div className="text-xs font-bold flex items-center gap-1.5">
                                  {ind.name}
                                  {ind.id === 'others' && (
                                    <span className="px-1.5 py-0.5 rounded-full bg-purple-100 text-purple-700 text-[10px] font-extrabold border border-purple-200">
                                      Custom AI
                                    </span>
                                  )}
                                </div>
                                <p className="text-[11px] text-stone-500 mt-0.5 line-clamp-1">{ind.description}</p>
                              </div>
                              {isCurrent && (
                                <Check className="w-4 h-4 text-purple-700 shrink-0 mt-0.5" />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* Input when "Others" is selected */}
                {isOthersSelected && (
                  <div className="space-y-2 animate-in fade-in duration-200 bg-purple-50/50 p-3.5 rounded-xl border border-purple-200">
                    <label className="block text-xs font-bold text-stone-800">
                      Mention your custom industry:
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={customIndustryInput}
                        onChange={(e) => {
                          setCustomIndustryInput(e.target.value);
                          setProfileForm({ ...profileForm, targetIndustry: e.target.value });
                        }}
                        placeholder="e.g. Aerospace, Robotics, Renewable Energy, Biotechnology..."
                        className="w-full pl-3 pr-8 py-2.5 rounded-xl border border-purple-300 text-xs font-medium focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-500/20 bg-white"
                      />
                      <Pencil className="w-3.5 h-3.5 text-purple-500 absolute right-3 top-3" />
                    </div>

                    {/* Suggestion pills */}
                    <div className="flex flex-wrap gap-1.5 pt-0.5">
                      {['Aerospace', 'Robotics', 'Renewable Energy', 'Biomedical', 'Game Dev', 'Cybersecurity'].map(tag => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => {
                            setCustomIndustryInput(tag);
                            setProfileForm({ ...profileForm, targetIndustry: tag });
                          }}
                          className="px-2.5 py-0.5 rounded-md bg-white hover:bg-purple-100 text-purple-800 text-[10px] font-bold border border-purple-200 transition-colors cursor-pointer"
                        >
                          + {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Checkbox: User wants to take up the questionnaire */}
                <div className="pt-1">
                  <label className="flex items-start gap-2.5 text-xs text-stone-700 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={wantsQuestionnaire}
                      onChange={(e) => setWantsQuestionnaire(e.target.checked)}
                      className="mt-0.5 rounded border-purple-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                    />
                    <span className="leading-tight">
                      I want to take up the questionnaire for this industry
                      <span className="block text-[11px] text-stone-500 font-normal mt-0.5">
                        AI will analyze your industry, prepare questions, suggest matching job roles & tailor your resume.
                      </span>
                    </span>
                  </label>
                </div>

                {/* Direct Action Button to start questionnaire from Profile */}
                <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={handleLaunchIndustryAssessment}
                    disabled={isGeneratingQuestionnaire || (isOthersSelected && !customIndustryInput.trim())}
                    className="px-5 py-3 rounded-xl bg-gradient-to-r from-purple-600 via-purple-700 to-violet-700 hover:from-purple-700 hover:to-violet-800 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-purple-600/25 hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {isGeneratingQuestionnaire ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                        AI Analyzing Industry & Preparing Questions...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-purple-200" />
                        {wantsQuestionnaire ? 'Take Questionnaire & Prepare Resume' : 'Explore Industry Roles'}
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  {aiTailoredResume && (
                    <button
                      type="button"
                      onClick={() => navigate('/career-discovery/results')}
                      className="text-xs font-bold text-purple-700 hover:text-purple-900 underline cursor-pointer text-center"
                    >
                      View Current Tailored Resume →
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-5 border-t border-purple-200/70">
            {saveSuccess ? (
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl flex items-center gap-1.5 animate-bounce">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Profile Saved & Updated Immediately!
              </span>
            ) : (
              <span className="text-xs text-stone-500">Click Save to update your profile immediately.</span>
            )}

            <button
              type="submit"
              className="ml-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-violet-700 hover:from-purple-700 hover:to-violet-800 text-white font-bold text-xs shadow-md shadow-purple-600/25 transition-all flex items-center gap-2 cursor-pointer hover:scale-105 active:scale-95"
            >
              <Save className="w-4 h-4" /> Save Details
            </button>
          </div>
        </form>
      </div>
    </Sidebar>
  );
};

export default ProfilePage;
