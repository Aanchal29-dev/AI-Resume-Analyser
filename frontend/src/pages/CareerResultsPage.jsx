// src/pages/CareerResultsPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import ResumePreview from '../components/common/ResumePreview';
import { useApp, getDefaultRolesForIndustry } from '../context/AppContext';
import {
  Compass,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Hammer,
  BookOpen,
  Star,
  FileText,
  TrendingUp,
  Download,
  Check,
  Briefcase,
  Layers,
  ArrowUpRight,
  IndianRupee
} from 'lucide-react';

const CareerResultsPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const requestedTab = searchParams.get('tab');
  const {
    userProfile,
    selectedIndustry,
    recommendedRoles,
    handleSelectJobRole,
    targetRole,
    aiIndustryAnalysis,
    aiTailoredResume,
    resumeData
  } = useApp();

  const [activeTab, setActiveTab] = useState(requestedTab || 'roles'); // 'roles' | 'resume' | 'roadmap'

  useEffect(() => {
    if (requestedTab) {
      setActiveTab(requestedTab);
    }
  }, [requestedTab]);
  const activeIndustryName = selectedIndustry || userProfile.targetIndustry || 'Software & Technology';

  // Active resume to preview: prioritize aiTailoredResume, otherwise active resumeData
  const previewResume = aiTailoredResume || resumeData;

  const rolesToDisplay = (recommendedRoles && recommendedRoles.length > 0)
    ? recommendedRoles
    : getDefaultRolesForIndustry(activeIndustryName);

  return (
    <Sidebar>
      <div className="max-w-6xl mx-auto space-y-8 font-sans">
        {/* Hero Header with dynamic Industry Confirmation */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-purple-200/90 text-stone-900 shadow-soft relative overflow-hidden">
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100/90 border border-purple-300 text-purple-800 text-xs font-semibold shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-purple-600 animate-pulse" /> AI Assessment & Tailoring Studio
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
                Career Alignment: <span className="text-purple-700">{activeIndustryName}</span>
              </h1>
              <p className="text-xs sm:text-sm text-stone-600 max-w-2xl">
                AI has analyzed your questionnaire responses, identified your optimal job roles, and synthesized an ATS-optimized resume tailored specifically for <span className="font-semibold text-stone-900">{activeIndustryName}</span>.
              </p>
            </div>

            <div className="flex sm:flex-col items-center sm:items-end gap-3 shrink-0">
              <button
                onClick={() => navigate('/resume-builder')}
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-purple-600 via-purple-700 to-violet-700 hover:from-purple-700 hover:to-violet-800 text-white font-bold text-xs shadow-md shadow-purple-600/25 hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer hover:scale-105 active:scale-95"
              >
                <Hammer className="w-4 h-4" /> Open in Resume Builder
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="px-4 py-2 rounded-xl border border-purple-200 bg-white hover:bg-purple-50 text-purple-800 font-bold text-xs shadow-xs transition-colors cursor-pointer"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        </div>

        {/* Studio View Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-purple-200/80 pb-3 flex-wrap">
          <button
            onClick={() => setActiveTab('roles')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'roles'
                ? 'bg-purple-700 text-white shadow-md shadow-purple-700/25'
                : 'bg-white hover:bg-purple-50 text-stone-700 border border-purple-200/70'
            }`}
          >
            <Briefcase className="w-4 h-4" /> See Matching Job Roles ({rolesToDisplay.length})
          </button>

          <button
            onClick={() => setActiveTab('resume')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'resume'
                ? 'bg-purple-700 text-white shadow-md shadow-purple-700/25'
                : 'bg-white hover:bg-purple-50 text-stone-700 border border-purple-200/70'
            }`}
          >
            <FileText className="w-4 h-4" /> AI-Prepared Resume Preview
          </button>

          {aiIndustryAnalysis && (
            <button
              onClick={() => setActiveTab('roadmap')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'roadmap'
                  ? 'bg-purple-700 text-white shadow-md shadow-purple-700/25'
                  : 'bg-white hover:bg-purple-50 text-stone-700 border border-purple-200/70'
              }`}
            >
              <TrendingUp className="w-4 h-4" /> Industry Strategy & Roadmap
            </button>
          )}

          <button
            onClick={() => navigate('/job-matcher')}
            className="ml-auto px-4 py-2.5 rounded-xl text-xs font-bold bg-purple-100 hover:bg-purple-200 text-purple-900 border border-purple-300 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
            title="Browse all active job vacancies in Job Matcher"
          >
            <Briefcase className="w-4 h-4 text-purple-700" /> Apply to Open Jobs →
          </button>
        </div>

        {/* TAB 1: Suggested Job Roles Grid */}
        {activeTab === 'roles' && (
          <div className="space-y-6">
            {rolesToDisplay.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 border border-purple-200 text-center space-y-3">
                <Briefcase className="w-10 h-10 text-purple-400 mx-auto" />
                <h3 className="font-extrabold text-stone-900 text-lg">No matching job roles found</h3>
                <p className="text-xs text-stone-600">Explore our curated roles or customize your target industry in your profile.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {rolesToDisplay.map((role, idx) => {
                  const isTargetRole = targetRole?.id === role.id || targetRole?.title === role.title;

                  return (
                    <div
                      key={role.id || idx}
                      className={`bg-white rounded-2xl p-6 border transition-all duration-300 flex flex-col justify-between shadow-soft hover:shadow-xl hover:-translate-y-1 ${
                        isTargetRole ? 'border-purple-600 ring-2 ring-purple-600/20' : 'border-purple-200/80 hover:border-purple-400'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-100 px-3 py-1 rounded-full border border-purple-200">
                            {role.category || activeIndustryName}
                          </span>
                          <div className="flex items-center gap-1.5 text-sm font-extrabold text-emerald-600">
                            <Star className="w-4 h-4 fill-emerald-500 text-emerald-500" />
                            <span>{role.matchPercentage || (95 - idx * 4)}% Match</span>
                          </div>
                        </div>

                        <h3 className="font-extrabold text-stone-900 text-xl leading-tight">{role.title}</h3>

                        {role.avgSalary && (
                          <div className="flex items-center gap-1 text-xs font-bold text-emerald-700 mt-1.5">
                            <IndianRupee className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>{role.avgSalary.includes('₹') ? role.avgSalary : `₹${role.avgSalary}`}</span>
                          </div>
                        )}

                        <p className="text-sm text-stone-600 mt-3 leading-relaxed">{role.description}</p>

                        {role.whyFit && (
                          <div className="mt-3.5 p-3 rounded-xl bg-purple-50/70 border border-purple-100 text-xs text-purple-900 leading-normal">
                            <span className="font-bold">Why it fits you: </span>{role.whyFit}
                          </div>
                        )}

                        <div className="mt-4 pt-3.5 border-t border-purple-100">
                          <span className="text-xs font-bold text-stone-700 block mb-2">Required Skills:</span>
                          <div className="flex flex-wrap gap-2">
                            {(role.requiredSkills || []).slice(0, 5).map((sk, skIdx) => (
                              <span key={skIdx} className="bg-stone-100 text-stone-800 px-2.5 py-1 rounded-lg text-xs font-semibold border border-stone-200">
                                {sk}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="pt-6 mt-6 border-t border-stone-100 flex flex-col gap-2.5">
                        <button
                          onClick={() => {
                            handleSelectJobRole(role);
                          }}
                          className={`w-full py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                            isTargetRole
                              ? 'bg-purple-100 text-purple-800 border border-purple-300'
                              : 'bg-stone-100 hover:bg-purple-100 hover:text-purple-800 text-stone-800'
                          }`}
                        >
                          {isTargetRole ? (
                            <>
                              <Check className="w-4 h-4 text-purple-700" /> Active Target Role
                            </>
                          ) : (
                            'Select as Target Role'
                          )}
                        </button>

                        <button
                          onClick={() => {
                            handleSelectJobRole(role);
                            navigate('/resume-builder');
                          }}
                          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-violet-700 hover:from-purple-700 hover:to-violet-800 text-white font-bold text-xs sm:text-sm shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          Build Resume for Role <Hammer className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => {
                            handleSelectJobRole(role);
                            navigate('/job-matcher');
                          }}
                          className="w-full py-2 rounded-xl border border-purple-200 hover:bg-purple-50 text-purple-800 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                        >
                          <Briefcase className="w-3.5 h-3.5" /> View Openings in Job Matcher
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: AI-Prepared Tailored Resume Preview */}
        {activeTab === 'resume' && (
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2 font-bold text-xs text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Tailored Industry Resume Generated by AI
                </div>
                <p className="text-xs text-emerald-700">
                  Crafted specifically for <span className="font-semibold">{activeIndustryName}</span> with quantified Google X-Y-Z achievement bullets and matching technical skills.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0 flex-wrap">
                <button
                  onClick={() => setActiveTab('roles')}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-violet-700 hover:from-purple-700 hover:to-violet-800 text-white font-bold text-xs shadow-md shadow-purple-600/25 flex items-center gap-1.5 cursor-pointer hover:scale-105 transition-all"
                >
                  <Briefcase className="w-3.5 h-3.5" /> See Matching Job Roles ({rolesToDisplay.length})
                </button>
                <button
                  onClick={() => navigate('/resume-builder')}
                  className="px-4 py-2 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-900 border border-purple-300 font-bold text-xs shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Hammer className="w-3.5 h-3.5 text-purple-700" /> Edit in Resume Builder
                </button>
              </div>
            </div>

            {/* Live Resume Preview Card */}
            <div className="max-w-4xl mx-auto">
              <ResumePreview resume={previewResume} showPrint={true} />
            </div>
          </div>
        )}

        {/* TAB 3: Industry Strategy & Growth Roadmap */}
        {activeTab === 'roadmap' && aiIndustryAnalysis && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Suitability & Strengths */}
              <div className="bg-white rounded-2xl p-6 border border-purple-200 shadow-soft space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-stone-900 text-base">Candidate Suitability Score</h3>
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200">
                    {aiIndustryAnalysis.candidateSuitabilityScore || 92}% Match
                  </span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {aiIndustryAnalysis.strengthsOverview}
                </p>
              </div>

              {/* Market Demand Summary */}
              <div className="bg-white rounded-2xl p-6 border border-purple-200 shadow-soft space-y-4">
                <h3 className="font-extrabold text-stone-900 text-base">Industry Hiring & Tech Trends</h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {aiIndustryAnalysis.marketDemandSummary}
                </p>
              </div>
            </div>

            {/* Recommended Next Steps */}
            {aiIndustryAnalysis.recommendedNextSteps && (
              <div className="bg-white rounded-2xl p-6 border border-purple-200 shadow-soft space-y-3">
                <h3 className="font-extrabold text-stone-900 text-sm">Actionable Career Roadmap:</h3>
                <div className="space-y-2">
                  {aiIndustryAnalysis.recommendedNextSteps.map((step, sIdx) => (
                    <div key={sIdx} className="flex items-start gap-2.5 p-3 rounded-xl bg-purple-50/60 border border-purple-100 text-xs text-purple-950 font-medium">
                      <div className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center shrink-0 font-bold text-[10px]">
                        {sIdx + 1}
                      </div>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Sidebar>
  );
};

export default CareerResultsPage;
