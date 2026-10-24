// src/pages/ProfilePage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import MandatoryProfileWarningModal from '../components/common/MandatoryProfileWarningModal';
import { useApp, validateProfileForResumeCreation } from '../context/AppContext';
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
  ArrowRight,
  Globe,
  AlertTriangle,
  Info,
  Target
} from 'lucide-react';

const LinkedinIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const GithubIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

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
    aiTailoredResume,
    updateIndustryRoles,
    targetRole,
    handleSelectJobRole,
    availableRoles
  } = useApp();

  const [profileForm, setProfileForm] = useState(userProfile);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);
  const [missingFieldsList, setMissingFieldsList] = useState([]);

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
      if (customIndustryInput.trim()) {
        updateIndustryRoles(customIndustryInput.trim());
      }
    } else {
      setIsOthersSelected(false);
      setSelectedIndustry(ind.name);
      setProfileForm(prev => ({ ...prev, targetIndustry: ind.name }));
      updateIndustryRoles(ind.name);
    }
    setIsDropdownOpen(false);
  };

  const handleLaunchIndustryAssessment = async () => {
    const effectiveIndustry = isOthersSelected
      ? customIndustryInput.trim()
      : (selectedIndustry || profileForm.targetIndustry || '');

    // Validate mandatory profile fields and target industry
    if (!effectiveIndustry || effectiveIndustry === 'Others') {
      setMissingFieldsList([{ key: 'targetIndustry', label: 'Target Industry / Field' }]);
      setIsWarningModalOpen(true);
      return;
    }

    const validation = validateProfileForResumeCreation(profileForm, effectiveIndustry);
    if (!validation.isValid) {
      setMissingFieldsList(validation.missingFields);
      setIsWarningModalOpen(true);
      return;
    }

    // Save profile details first
    const updated = {
      ...profileForm,
      targetIndustry: effectiveIndustry
    };
    setUserProfile(updated);
    setSelectedIndustry(effectiveIndustry);
    updateIndustryRoles(effectiveIndustry);

    if (isOthersSelected) {
      setCustomIndustryName(effectiveIndustry);
    }

    if (wantsQuestionnaire) {
      await handleStartIndustryQuestionnaire(effectiveIndustry, isOthersSelected, navigate);
    } else {
      navigate('/career-discovery');
    }
  };

  const handleModalSaveAndProceed = async (modalData) => {
    setIsWarningModalOpen(false);
    const updated = {
      ...profileForm,
      ...modalData
    };
    setProfileForm(updated);
    setUserProfile(updated);
    setSelectedIndustry(modalData.targetIndustry);
    updateIndustryRoles(modalData.targetIndustry);

    if (isOthersSelected && modalData.targetIndustry) {
      setCustomIndustryName(modalData.targetIndustry);
    }

    await handleStartIndustryQuestionnaire(modalData.targetIndustry, isOthersSelected, navigate);
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
    updateIndustryRoles(effectiveIndustry);
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block font-bold text-stone-800 mb-1.5 flex items-center justify-between text-sm">
                <span className="flex items-center gap-1.5">
                  <User className="w-4 h-4 text-purple-600" /> Full Name <span className="text-rose-600">*</span>
                </span>
                <span className="text-xs font-bold text-purple-700 bg-purple-100/70 px-2 py-0.5 rounded-md">Required for Resume</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Alex Morgan"
                value={profileForm.fullName || ''}
                onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                className="w-full p-3.5 rounded-xl border border-purple-200/80 bg-white text-stone-900 font-medium text-sm focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 transition-all placeholder:text-stone-400"
              />
              <p className="text-xs text-stone-500 mt-1">Updates your dashboard welcome and resume applicant name immediately.</p>
            </div>

            <div>
              <label className="block font-bold text-stone-800 mb-1.5 flex items-center justify-between text-sm">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-purple-600" /> Email Address <span className="text-rose-600">*</span>
                </span>
                <span className="text-xs font-bold text-purple-700 bg-purple-100/70 px-2 py-0.5 rounded-md">Required for Resume</span>
              </label>
              <input
                type="email"
                placeholder="e.g. alex.morgan@college.edu"
                value={profileForm.email || ''}
                onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                className="w-full p-3.5 rounded-xl border border-purple-200/80 bg-white text-stone-900 font-medium text-sm focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 transition-all placeholder:text-stone-400"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-800 mb-1.5 flex items-center justify-between text-sm">
                <span className="flex items-center gap-1.5">
                  <Phone className="w-4 h-4 text-purple-600" /> Phone Number <span className="text-rose-600">*</span>
                </span>
                <span className="text-xs font-bold text-purple-700 bg-purple-100/70 px-2 py-0.5 rounded-md">Required for Resume</span>
              </label>
              <input
                type="tel"
                placeholder="+1 (555) 234-5678"
                value={profileForm.phone || ''}
                onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                className="w-full p-3.5 rounded-xl border border-purple-200/80 bg-white text-stone-900 font-medium text-sm focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 transition-all placeholder:text-stone-400"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-800 mb-1.5 flex items-center justify-between text-sm">
                <span className="flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-purple-600" /> Education Level <span className="text-rose-600">*</span>
                </span>
                <span className="text-xs font-bold text-purple-700 bg-purple-100/70 px-2 py-0.5 rounded-md">Required for Resume</span>
              </label>
              <select
                value={profileForm.educationLevel || 'Undergraduate Senior'}
                onChange={(e) => setProfileForm({ ...profileForm, educationLevel: e.target.value })}
                className="w-full p-3.5 rounded-xl border border-purple-200/80 bg-white text-stone-900 font-medium text-sm focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 transition-all cursor-pointer"
              >
                <option>Undergraduate Senior</option>
                <option>Recent Graduate (0-1 yrs)</option>
                <option>Master's Candidate</option>
                <option>Career Switcher</option>
                <option>High School / Diploma</option>
              </select>
            </div>

            {/* LinkedIn Profile URL (Optional) */}
            <div>
              <label className="block font-bold text-stone-800 mb-1.5 flex items-center justify-between text-sm">
                <span className="flex items-center gap-1.5">
                  <LinkedinIcon className="w-4 h-4 text-purple-600" /> LinkedIn Profile URL
                </span>
                <span className="text-xs font-semibold text-stone-500 bg-stone-100 px-2 py-0.5 rounded-md">Optional</span>
              </label>
              <input
                type="url"
                placeholder="https://linkedin.com/in/your-handle"
                value={profileForm.linkedin || ''}
                onChange={(e) => setProfileForm({ ...profileForm, linkedin: e.target.value })}
                className="w-full p-3.5 rounded-xl border border-purple-200/80 bg-white text-stone-900 font-medium text-sm focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 transition-all placeholder:text-stone-400"
              />
              <p className="text-xs text-stone-500 mt-1">Included in your resume header only if provided. Never randomly generated.</p>
            </div>

            {/* GitHub Profile URL (Optional) */}
            <div>
              <label className="block font-bold text-stone-800 mb-1.5 flex items-center justify-between text-sm">
                <span className="flex items-center gap-1.5">
                  <GithubIcon className="w-4 h-4 text-purple-600" /> GitHub Profile URL
                </span>
                <span className="text-xs font-semibold text-stone-500 bg-stone-100 px-2 py-0.5 rounded-md">Optional</span>
              </label>
              <input
                type="url"
                placeholder="https://github.com/your-username"
                value={profileForm.github || ''}
                onChange={(e) => setProfileForm({ ...profileForm, github: e.target.value })}
                className="w-full p-3.5 rounded-xl border border-purple-200/80 bg-white text-stone-900 font-medium text-sm focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 transition-all placeholder:text-stone-400"
              />
              <p className="text-xs text-stone-500 mt-1">Included in your resume header only if provided. Never randomly generated.</p>
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
                <div className="space-y-2">
                  <span className="text-sm font-bold text-stone-700">Choose Industry:</span>
                  <div className="relative" ref={dropdownRef}>
                    <button
                      type="button"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl border border-purple-200 bg-purple-50/40 hover:bg-purple-50 hover:border-purple-400 text-stone-900 font-bold text-sm transition-all shadow-xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <span className="w-2.5 h-2.5 rounded-full bg-purple-600 shrink-0"></span>
                        <span className="truncate">
                          {isOthersSelected
                            ? 'Others (Custom Industry)'
                            : (currentSelectedObj?.name || profileForm.targetIndustry || 'Software & Technology')}
                        </span>
                      </div>
                      <div className="flex items-center text-purple-600 shrink-0 ml-2">
                        {isDropdownOpen ? <ChevronUp className="w-4.5 h-4.5" /> : <ChevronDown className="w-4.5 h-4.5" />}
                      </div>
                    </button>

                    {/* Dropdown Menu */}
                    {isDropdownOpen && (
                      <div className="absolute top-full left-0 right-0 mt-1.5 z-40 bg-white rounded-2xl border border-purple-200 shadow-xl py-2 max-h-64 overflow-y-auto divide-y divide-purple-50 animate-in fade-in duration-200">
                        {AVAILABLE_INDUSTRIES.map(ind => {
                          const isCurrent = (ind.id === 'others' && isOthersSelected) || (!isOthersSelected && currentSelectedObj?.id === ind.id);

                          return (
                            <div
                              key={ind.id}
                              onClick={() => handleSelectDropdownIndustry(ind)}
                              className={`px-4 py-3 hover:bg-purple-50/80 cursor-pointer transition-colors flex items-start justify-between gap-2 ${
                                isCurrent ? 'bg-purple-50/90 text-purple-900' : 'text-stone-800'
                              }`}
                            >
                              <div>
                                <div className="text-sm font-bold flex items-center gap-2">
                                  {ind.name}
                                  {ind.id === 'others' && (
                                    <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 text-xs font-extrabold border border-purple-200">
                                      Custom AI
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-stone-500 mt-0.5 line-clamp-1">{ind.description}</p>
                              </div>
                              {isCurrent && (
                                <Check className="w-4.5 h-4.5 text-purple-700 shrink-0 mt-0.5" />
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
                  <div className="space-y-2.5 animate-in fade-in duration-200 bg-purple-50/50 p-4 rounded-xl border border-purple-200">
                    <label className="block text-sm font-bold text-stone-800">
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
                        className="w-full pl-3.5 pr-8 py-3 rounded-xl border border-purple-300 text-sm font-medium focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-500/20 bg-white"
                      />
                      <Pencil className="w-4 h-4 text-purple-500 absolute right-3.5 top-3.5" />
                    </div>

                    {/* Suggestion pills */}
                    <div className="flex flex-wrap gap-2 pt-1">
                      {['Aerospace', 'Robotics', 'Renewable Energy', 'Biomedical', 'Game Dev', 'Cybersecurity'].map(tag => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => {
                            setCustomIndustryInput(tag);
                            setProfileForm({ ...profileForm, targetIndustry: tag });
                          }}
                          className="px-3 py-1 rounded-lg bg-white hover:bg-purple-100 text-purple-800 text-xs font-bold border border-purple-200 transition-colors cursor-pointer"
                        >
                          + {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Target Role Selector within Industry */}
                {availableRoles && availableRoles.length > 0 && (
                  <div className="space-y-2 pt-3 border-t border-purple-100">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
                        <Target className="w-3.5 h-3.5 text-purple-600" /> Target Job Role:
                      </span>
                      <span className="text-xs font-extrabold text-purple-900 bg-purple-100 px-2.5 py-0.5 rounded-full border border-purple-200">
                        {targetRole?.title || availableRoles[0]?.title}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {availableRoles.slice(0, 6).map((role) => {
                        const isSelected = targetRole?.id === role.id || targetRole?.title === role.title;
                        return (
                          <button
                            key={role.id || role.title}
                            type="button"
                            onClick={() => handleSelectJobRole(role)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                              isSelected
                                ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                                : 'bg-white hover:bg-purple-50 text-stone-700 border-purple-200'
                            }`}
                          >
                            {isSelected && <Check className="w-3.5 h-3.5 inline mr-1" />}
                            {role.title}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Checkbox: User wants to take up the questionnaire */}
                <div className="pt-2">
                  <label className="flex items-start gap-3 text-sm text-stone-800 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={wantsQuestionnaire}
                      onChange={(e) => setWantsQuestionnaire(e.target.checked)}
                      className="mt-1 w-4 h-4 rounded border-purple-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                    />
                    <span className="leading-snug">
                      <span className="font-semibold text-stone-900">I want to take up the questionnaire for this industry</span>
                      <span className="block text-xs text-stone-500 font-normal mt-0.5">
                        AI will analyze your industry, prepare questions, suggest matching job roles & tailor your resume.
                      </span>
                    </span>
                  </label>
                </div>

                {/* Direct Action Button to start questionnaire from Profile */}
                <div className="pt-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 flex-wrap">
                  <button
                    type="button"
                    onClick={handleLaunchIndustryAssessment}
                    disabled={isGeneratingQuestionnaire || (isOthersSelected && !customIndustryInput.trim())}
                    className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 via-purple-700 to-violet-700 hover:from-purple-700 hover:to-violet-800 disabled:opacity-50 text-white font-bold text-sm shadow-md shadow-purple-600/25 hover:shadow-lg transition-all flex items-center justify-center gap-2.5 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {isGeneratingQuestionnaire ? (
                      <>
                        <Loader2 className="w-4.5 h-4.5 animate-spin text-white" />
                        AI Analyzing Industry & Preparing Questions...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4.5 h-4.5 text-purple-200" />
                        {wantsQuestionnaire ? 'Take Questionnaire & Prepare Resume' : 'Explore Industry Roles'}
                        <ArrowRight className="w-4.5 h-4.5" />
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate('/career-discovery/results?tab=resume')}
                    className="text-xs sm:text-sm font-bold text-purple-700 hover:text-purple-900 hover:underline cursor-pointer text-center py-2 px-3 rounded-lg hover:bg-purple-50 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>{aiTailoredResume ? 'View Current Tailored Resume' : 'View Tailored Resume & Matching Roles'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-5 border-t border-purple-200/70">
            {saveSuccess ? (
              <span className="text-sm font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-xl flex items-center gap-2 animate-bounce">
                <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600" /> Profile Saved & Updated Immediately!
              </span>
            ) : (
              <span className="text-xs sm:text-sm font-extrabold text-purple-950 bg-purple-100/90 border border-purple-300 px-4 py-2 rounded-xl flex items-center gap-2 shadow-2xs">
                <Info className="w-4 h-4 text-purple-700 shrink-0" />
                Click Save Details to apply your changes across SkillSync.
              </span>
            )}

            <button
              type="submit"
              className="ml-auto px-7 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-violet-700 hover:from-purple-700 hover:to-violet-800 text-white font-bold text-sm shadow-md shadow-purple-600/25 transition-all flex items-center gap-2 cursor-pointer hover:scale-105 active:scale-95"
            >
              <Save className="w-4.5 h-4.5" /> Save Details
            </button>
          </div>
        </form>

        {/* Mandatory Profile Details Warning Modal */}
        <MandatoryProfileWarningModal
          isOpen={isWarningModalOpen}
          onClose={() => setIsWarningModalOpen(false)}
          missingFields={missingFieldsList}
          userProfile={profileForm}
          selectedIndustry={isOthersSelected ? customIndustryInput : selectedIndustry}
          onSaveAndProceed={handleModalSaveAndProceed}
        />
      </div>
    </Sidebar>
  );
};

export default ProfilePage;
