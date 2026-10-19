import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import ScoreCard from '../components/common/ScoreCard';
import StatusBadge from '../components/common/StatusBadge';
import { useApp } from '../context/AppContext';
import { AVAILABLE_INDUSTRIES } from '../data/mockData';
import {
  FileCheck2,
  Compass,
  Target,
  Sparkles,
  TrendingUp,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Upload,
  CheckCircle2,
  Pencil,
  ArrowRight,
  Check,
  Loader2,
  Briefcase,
  Layers
} from 'lucide-react';

const DashboardPage = () => {
  const navigate = useNavigate();
  const {
    uploadedFileName,
    targetRole,
    analysis,
    userProfile,
    hasAnalyzedResume,
    selectedIndustry,
    setSelectedIndustry,
    customIndustryName,
    setCustomIndustryName,
    handleStartIndustryQuestionnaire,
    isGeneratingQuestionnaire,
    aiTailoredResume,
    aiIndustryAnalysis
  } = useApp();

  // Industry Dropdown & Others State
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isOthersSelected, setIsOthersSelected] = useState(() => {
    const isStandard = AVAILABLE_INDUSTRIES.some(i => i.id !== 'others' && i.name.toLowerCase() === (selectedIndustry || '').toLowerCase());
    return !isStandard && Boolean(selectedIndustry && selectedIndustry !== 'Software & Technology');
  });
  const [customIndustryInput, setCustomIndustryInput] = useState(() => customIndustryName || (selectedIndustry && selectedIndustry !== 'Software & Technology' ? selectedIndustry : ''));
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

  // Clean greeting logic: Only include user name if it's set and not a generic placeholder
  const rawName = (userProfile?.fullName || '').trim();
  const hasRealName = rawName && !['student', 'user', 'alex morgan', 'demo user', 'demo', 'candidate'].includes(rawName.toLowerCase());
  const greetingText = hasRealName ? `Hello, ${rawName} 👋` : 'Hello 👋';

  const currentSelectedObj = isOthersSelected
    ? AVAILABLE_INDUSTRIES.find(i => i.id === 'others')
    : AVAILABLE_INDUSTRIES.find(i => i.name.toLowerCase() === (selectedIndustry || 'Software & Technology').toLowerCase()) || AVAILABLE_INDUSTRIES[0];

  const handleSelectDropdownIndustry = (ind) => {
    if (ind.id === 'others') {
      setIsOthersSelected(true);
      setSelectedIndustry('Others');
    } else {
      setIsOthersSelected(false);
      setSelectedIndustry(ind.name);
    }
    setIsDropdownOpen(false);
  };

  const handleLaunchIndustryAssessment = async () => {
    const effectiveIndustry = isOthersSelected
      ? (customIndustryInput.trim() || 'Custom Industry')
      : (selectedIndustry || 'Software & Technology');

    if (isOthersSelected) {
      setCustomIndustryName(effectiveIndustry);
    }

    if (wantsQuestionnaire) {
      await handleStartIndustryQuestionnaire(effectiveIndustry, isOthersSelected, navigate);
    } else {
      setSelectedIndustry(effectiveIndustry);
      navigate('/career-discovery');
    }
  };

  return (
    <Sidebar>
      <div className="max-w-6xl mx-auto space-y-8 font-sans">
        {/* Sleek Hero Welcome Banner with Dynamic Greeting */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-purple-200/90 hover:border-purple-400 text-stone-900 shadow-soft relative overflow-hidden transition-all duration-300">
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100/90 border border-purple-300 text-purple-800 text-xs font-semibold shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-purple-600 animate-pulse" /> Personal Workspace
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight flex items-center gap-3">
                {greetingText}
              </h1>

              <p className="text-xs sm:text-sm text-stone-600 max-w-xl">
                {hasAnalyzedResume ? (
                  <>Active Resume: <span className="font-semibold text-purple-700">{uploadedFileName}</span> | Target Role: <span className="font-semibold text-purple-700">{targetRole.title}</span></>
                ) : (
                  'Welcome to your workspace! Select an industry or upload a resume to evaluate your ATS compatibility and career alignment.'
                )}
              </p>
            </div>

            <button
              onClick={() => navigate('/upload-resume')}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-purple-600 via-purple-700 to-violet-700 hover:from-purple-700 hover:to-violet-800 text-white font-bold text-xs shadow-md shadow-purple-600/25 hover:shadow-lg hover:shadow-purple-600/40 transition-all flex items-center gap-2 shrink-0 hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Upload className="w-4 h-4" /> {hasAnalyzedResume ? 'Analyze New Resume' : 'Upload Resume'}
            </button>
          </div>
        </div>

        {/* Dynamic Industry Questionnaire & AI Resume Studio Card */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-purple-200/90 hover:border-purple-300 text-stone-900 shadow-soft relative overflow-hidden transition-all duration-300 bg-gradient-to-br from-white via-purple-50/20 to-violet-50/40">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
            <div className="space-y-3 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 border border-purple-300 text-purple-800 text-xs font-semibold shadow-xs">
                <Compass className="w-3.5 h-3.5 text-purple-600" />
                Industry Questionnaire & AI Resume Studio
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight">
                Target Industry Career Studio
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Explore all industries with access to specialized questionnaires. Click the dropdown arrow to pick an industry or select <span className="font-bold text-purple-700">"Others"</span> to enter any custom domain. If you take the questionnaire, AI will analyze your domain, generate questions, recommend matching roles, and prepare an ATS-ready resume!
              </p>

              {/* Status if an AI tailored resume or analysis exists */}
              {aiTailoredResume && (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Tailored Resume Ready for: <strong className="font-bold text-emerald-950">{selectedIndustry}</strong></span>
                  <button
                    onClick={() => navigate('/career-discovery/results')}
                    className="ml-2 font-bold text-purple-700 hover:text-purple-900 underline cursor-pointer"
                  >
                    View Roles & Resume →
                  </button>
                </div>
              )}
            </div>

            {/* Right Controls Container: Dropdown, Custom Industry, Toggle & Button */}
            <div className="w-full lg:w-96 bg-white rounded-2xl p-5 border border-purple-200/90 shadow-sm space-y-4 shrink-0">
              {/* Dropdown with arrow */}
              <div>
                <label className="block text-xs font-extrabold text-stone-800 mb-1.5">
                  Select Industry Questionnaire:
                </label>

                <div className="relative" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border border-purple-200 bg-purple-50/50 hover:bg-purple-50 hover:border-purple-400 text-stone-900 font-bold text-xs transition-all shadow-xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="w-2 h-2 rounded-full bg-purple-600 shrink-0"></span>
                      <span className="truncate">
                        {isOthersSelected
                          ? 'Others (Custom Industry)'
                          : (currentSelectedObj?.name || selectedIndustry || 'Software & Technology')}
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
                <div className="space-y-2 animate-in fade-in duration-200 bg-purple-50/40 p-3 rounded-xl border border-purple-200">
                  <label className="block text-xs font-bold text-stone-800">
                    Mention your industry:
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={customIndustryInput}
                      onChange={(e) => setCustomIndustryInput(e.target.value)}
                      placeholder="e.g. Aerospace, Robotics, Renewable Energy..."
                      className="w-full pl-3 pr-8 py-2 rounded-xl border border-purple-300 text-xs font-medium focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-500/20 bg-white"
                    />
                    <Pencil className="w-3.5 h-3.5 text-purple-500 absolute right-3 top-2.5" />
                  </div>

                  {/* Suggestion pills */}
                  <div className="flex flex-wrap gap-1 pt-0.5">
                    {['Aerospace', 'Robotics', 'Renewable Energy', 'Biomedical', 'Game Dev', 'Cybersecurity'].map(tag => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => setCustomIndustryInput(tag)}
                        className="px-2 py-0.5 rounded-md bg-white hover:bg-purple-100 text-purple-800 text-[10px] font-bold border border-purple-200 transition-colors cursor-pointer"
                      >
                        + {tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Checkbox: User wants to take up the questionnaire */}
              <div className="pt-0.5">
                <label className="flex items-start gap-2.5 text-xs text-stone-700 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={wantsQuestionnaire}
                    onChange={(e) => setWantsQuestionnaire(e.target.checked)}
                    className="mt-0.5 rounded border-purple-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                  />
                  <span className="leading-tight">
                    I want to take up the questionnaire
                    <span className="block text-[11px] text-stone-500 font-normal">
                      AI analyzes your industry, tailors questions & prepares your resume.
                    </span>
                  </span>
                </label>
              </div>

              {/* Launch Action Button */}
              <button
                onClick={handleLaunchIndustryAssessment}
                disabled={isGeneratingQuestionnaire || (isOthersSelected && !customIndustryInput.trim())}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 via-purple-700 to-violet-700 hover:from-purple-700 hover:to-violet-800 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-purple-600/25 hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
              >
                {isGeneratingQuestionnaire ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    AI Analyzing & Generating Questions...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-purple-200" />
                    {wantsQuestionnaire ? 'Take Questionnaire & Prepare Resume' : 'Explore Industry Roles'}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Core Score Gauges - ONLY rendered AFTER user analyzes a resume! */}
        {hasAnalyzedResume && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-stone-900">Evaluation Score Metrics</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <ScoreCard
                title="Overall Score"
                score={analysis.overallScore}
                maxScore={100}
                subtitle={`Last Analyzed: ${analysis.lastAnalyzed}`}
                status={analysis.status}
                color={analysis.overallScore >= 80 ? 'emerald' : 'purple'}
                icon={TrendingUp}
              />
              <ScoreCard
                title="ATS Compatibility"
                score={analysis.atsCompatibility}
                maxScore={100}
                subtitle="Layout & Parser compliance"
                status="Passed"
                color="emerald"
                icon={FileCheck2}
              />
              <ScoreCard
                title="Target Job Match"
                score={analysis.jobMatchScore}
                maxScore={100}
                subtitle={`Target: ${targetRole.title}`}
                status="Tailoring Needed"
                color="amber"
                icon={Target}
              />
            </div>
          </div>
        )}

        {/* Essential Action Cards */}
        <div>
          <h2 className="text-base font-bold text-stone-900 mb-4">Primary Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div
              onClick={() => navigate('/upload-resume')}
              className="glass-panel hover:bg-white/95 p-6 rounded-2xl border border-purple-200/90 hover:border-purple-400 shadow-soft hover:shadow-xl hover:shadow-purple-500/12 hover:-translate-y-1 cursor-pointer group transition-all duration-300"
            >
              <div className="w-11 h-11 rounded-xl bg-purple-100/90 text-purple-700 flex items-center justify-center mb-4 group-hover:bg-purple-600 group-hover:text-white group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-xs">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold text-stone-900 group-hover:text-purple-700 transition-colors">Resume Analyzer</h3>
              <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                Evaluate ATS compatibility, formatting, and section completeness.
              </p>
              <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-purple-600 group-hover:translate-x-1 transition-transform">
                Open Analyzer <ChevronRight className="w-4 h-4" />
              </div>
            </div>

            <div
              onClick={() => navigate('/job-matcher')}
              className="glass-panel hover:bg-white/95 p-6 rounded-2xl border border-purple-200/90 hover:border-purple-400 shadow-soft hover:shadow-xl hover:shadow-purple-500/12 hover:-translate-y-1 cursor-pointer group transition-all duration-300"
            >
              <div className="w-11 h-11 rounded-xl bg-purple-100/90 text-purple-700 flex items-center justify-center mb-4 group-hover:bg-purple-600 group-hover:text-white group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-xs">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold text-stone-900 group-hover:text-purple-700 transition-colors">Job Matcher</h3>
              <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                Compare resume against job descriptions to extract missing skills.
              </p>
              <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-purple-600 group-hover:translate-x-1 transition-transform">
                Open Job Matcher <ChevronRight className="w-4 h-4" />
              </div>
            </div>

            <div
              onClick={() => navigate('/career-discovery')}
              className="glass-panel hover:bg-white/95 p-6 rounded-2xl border border-purple-200/90 hover:border-purple-400 shadow-soft hover:shadow-xl hover:shadow-purple-500/12 hover:-translate-y-1 cursor-pointer group transition-all duration-300"
            >
              <div className="w-11 h-11 rounded-xl bg-purple-100/90 text-purple-700 flex items-center justify-center mb-4 group-hover:bg-purple-600 group-hover:text-white group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-xs">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold text-stone-900 group-hover:text-purple-700 transition-colors">Career Discovery</h3>
              <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                Guided questionnaire matching your interests with tech career roles.
              </p>
              <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-purple-600 group-hover:translate-x-1 transition-transform">
                Explore Careers <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>

        {/* Priority Fixes (Shown when resume is analyzed) */}
        {hasAnalyzedResume && (
          <div className="glass-panel rounded-2xl border border-purple-200/90 hover:border-purple-300 p-6 shadow-soft space-y-4 transition-all duration-300">
            <div className="flex items-center justify-between border-b border-purple-100 pb-3">
              <div>
                <h3 className="font-extrabold text-stone-900 text-sm">Top Priority Resume Fixes</h3>
                <p className="text-xs text-stone-500">Action items identified in active evaluation</p>
              </div>
              <button
                onClick={() => navigate('/issues')}
                className="text-xs font-bold text-purple-700 hover:text-purple-900 cursor-pointer"
              >
                View All Issues ({analysis.issues.length})
              </button>
            </div>

            <div className="space-y-3">
              {analysis.issues.slice(0, 2).map((issue) => (
                <div key={issue.id} className="p-4 rounded-xl border border-purple-200/80 bg-white hover:border-purple-400 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <StatusBadge status={issue.severity} size="xs" />
                      <span className="text-xs font-bold text-stone-900">{issue.title}</span>
                    </div>
                    <p className="text-xs text-stone-500">{issue.explanation}</p>
                  </div>
                  <button
                    onClick={() => navigate('/corrections')}
                    className="shrink-0 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-bold text-xs shadow-xs cursor-pointer"
                  >
                    Fix with AI
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Sidebar>
  );
};

export default DashboardPage;
