// src/components/resume/ActiveResumeAnalysisSection.jsx
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp, getDefaultRolesForIndustry } from '../../context/AppContext';
import { SAMPLE_JOB_ROLES } from '../../data/mockData';
import {
  FileText,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Target,
  GraduationCap,
  Briefcase,
  Sparkles,
  BookOpen,
  IndianRupee,
  ExternalLink
} from 'lucide-react';

const ActiveResumeAnalysisSection = ({ isCompact = false }) => {
  const navigate = useNavigate();
  const {
    resumeData,
    uploadedFileName,
    targetRole,
    handleSelectJobRole,
    customJobDescription,
    setCustomJobDescription,
    userProfile,
    recommendedRoles,
    selectedIndustry
  } = useApp();

  const [activeTab, setActiveTab] = useState('match'); // 'match' | 'skills'

  // Extract candidate skills from active resume
  const candidateSkills = useMemo(() => {
    const rawTech = resumeData?.skills?.technical;
    const tech = Array.isArray(rawTech)
      ? rawTech
      : (typeof rawTech === 'string' ? rawTech.split(',').map(s => s.trim()) : []);

    const rawTools = resumeData?.skills?.tools;
    const tools = Array.isArray(rawTools)
      ? rawTools
      : (typeof rawTools === 'string' ? rawTools.split(',').map(s => s.trim()) : []);

    const rawSoft = resumeData?.skills?.soft;
    const soft = Array.isArray(rawSoft)
      ? rawSoft
      : (typeof rawSoft === 'string' ? rawSoft.split(',').map(s => s.trim()) : []);

    const combined = Array.from(new Set([...tech, ...tools, ...soft])).filter(Boolean);
    return combined.length > 0 ? combined : ['Python', 'SQL', 'C++', 'Data Structures', 'System Integration', 'Git'];
  }, [resumeData]);

  // Determine active domain context
  const activeDomain = useMemo(() => {
    if (selectedIndustry && selectedIndustry !== 'Others') return selectedIndustry;
    if (userProfile?.targetIndustry && userProfile.targetIndustry !== 'Others') return userProfile.targetIndustry;

    const fileName = (uploadedFileName || resumeData?.fileName || '').toLowerCase();
    const degree = (resumeData?.education?.[0]?.degree || '').toLowerCase();
    const allSkillsStr = candidateSkills.join(' ').toLowerCase();

    if (fileName.includes('robot') || degree.includes('robot') || allSkillsStr.includes('robot')) {
      return 'Robotics';
    }
    if (fileName.includes('health') || degree.includes('health') || allSkillsStr.includes('ehr')) {
      return 'Healthcare & Medical Sciences';
    }
    if (fileName.includes('literat') || fileName.includes('writ') || degree.includes('writ')) {
      return 'Literature & Publishing';
    }
    if (fileName.includes('financ') || degree.includes('financ') || allSkillsStr.includes('financial')) {
      return 'Finance, Banking & Accounting';
    }
    return 'Software & Technology';
  }, [selectedIndustry, userProfile, uploadedFileName, resumeData, candidateSkills]);

  // Construct comprehensive dynamic roles matching the active domain
  const availableRoles = useMemo(() => {
    const list = [];
    const seen = new Set();

    const addRole = (r) => {
      if (!r || !r.id || !r.title) return;
      const key = r.title.toLowerCase().trim();
      if (!seen.has(key)) {
        seen.add(key);
        list.push(r);
      }
    };

    if (targetRole) addRole(targetRole);
    if (Array.isArray(recommendedRoles)) recommendedRoles.forEach(addRole);
    const domainRoles = getDefaultRolesForIndustry(activeDomain);
    domainRoles.forEach(addRole);
    SAMPLE_JOB_ROLES.forEach(addRole);

    return list;
  }, [targetRole, recommendedRoles, activeDomain]);

  // Extract required skills for active position or pasted JD
  const targetRequiredSkills = useMemo(() => {
    if (customJobDescription && customJobDescription.trim()) {
      const descLower = customJobDescription.toLowerCase();
      const fromCandidate = candidateSkills.filter(sk => descLower.includes(sk.toLowerCase()));
      const fromRole = targetRole?.requiredSkills || [];
      const combined = Array.from(new Set([...fromRole, ...fromCandidate]));
      return combined.length > 0 ? combined : ['Domain Core Competencies', 'Technical Execution', 'Problem Solving'];
    }
    return targetRole?.requiredSkills || ['Domain Core Competencies', 'Technical Execution', 'Problem Solving'];
  }, [customJobDescription, targetRole, candidateSkills]);

  // Compute matching and missing skills dynamically
  const { matchingSkills, missingSkills, matchScore } = useMemo(() => {
    const matched = [];
    const missing = [];

    const isMatch = (reqSkill, candidateSkill) => {
      const r = reqSkill.toLowerCase().replace(/[^a-z0-9+#]/g, ' ');
      const c = candidateSkill.toLowerCase().replace(/[^a-z0-9+#]/g, ' ');

      if (r.includes(c) || c.includes(r)) return true;

      if ((r.includes('ros') && c.includes('ros')) ||
          (r.includes('c++') && (c.includes('c++') || c.includes('c/c++'))) ||
          (r.includes('control') && c.includes('control')) ||
          (r.includes('robot') && c.includes('robot')) ||
          (r.includes('python') && c.includes('python')) ||
          (r.includes('sql') && c.includes('sql')) ||
          (r.includes('javascript') && (c.includes('js') || c.includes('javascript'))) ||
          (r.includes('react') && c.includes('react'))) {
        return true;
      }

      const rTokens = r.split(/\s+/).filter(w => w.length > 2 && !['and', 'the', 'for', 'with'].includes(w));
      const cTokens = c.split(/\s+/).filter(w => w.length > 2 && !['and', 'the', 'for', 'with'].includes(w));

      return rTokens.some(rt => cTokens.some(ct => ct === rt || (ct.length > 3 && rt.startsWith(ct)) || (rt.length > 3 && ct.startsWith(rt))));
    };

    targetRequiredSkills.forEach(req => {
      const isPresent = candidateSkills.some(userSkill => isMatch(req, userSkill));
      if (isPresent) {
        matched.push(req);
      } else {
        missing.push(req);
      }
    });

    const ratio = targetRequiredSkills.length > 0 ? (matched.length / targetRequiredSkills.length) : 0.70;
    const computedScore = Math.min(98, Math.max(30, Math.round(ratio * 100)));

    return {
      matchingSkills: matched,
      missingSkills: missing,
      matchScore: computedScore
    };
  }, [candidateSkills, targetRequiredSkills]);

  const applicantName = resumeData?.contact?.fullName?.trim() || userProfile?.fullName?.trim() || 'Aanchal Sharma';
  const candidateDegree = resumeData?.education?.[0]?.degree || 'Bachelor of Science in Electrical Engineering & Computer Applications';
  const activeFileName = uploadedFileName || resumeData?.fileName || 'Active_Resume.pdf';
  const projectedScore = Math.min(98, matchScore + Math.max(12, missingSkills.length * 6));

  return (
    <div className="space-y-6 font-sans">
      {/* ========================================================================= */}
      {/* TWO COLUMN WORKSPACE: ACTIVE RESUME FILE + TARGET JOB ROLE                */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Column 1: Active Resume Context */}
        <div className="bg-[#fbf7fd] rounded-2xl p-6 border border-purple-200/90 shadow-soft space-y-4">
          <div className="flex items-center justify-between border-b border-purple-100 pb-3">
            <h3 className="font-extrabold text-stone-900 text-base flex items-center gap-2">
              <FileText className="w-4.5 h-4.5 text-purple-600" /> Active Resume File
            </h3>
            <span className="text-xs sm:text-sm font-bold text-purple-800 bg-purple-100/90 px-3 py-1 rounded-full border border-purple-200 truncate max-w-[220px]">
              {activeFileName}
            </span>
          </div>

          <div className="bg-white/95 p-5 rounded-xl border border-purple-100 space-y-3.5 text-sm text-stone-700 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-stone-900">Applicant:</span>{' '}
                <span className="font-semibold text-stone-800">{applicantName}</span>
              </div>
              <div className="text-xs font-extrabold text-purple-800 bg-purple-50 px-2.5 py-1 rounded-md border border-purple-200">
                {activeDomain} Domain
              </div>
            </div>

            <div className="flex items-center gap-2 text-stone-700 text-sm">
              <GraduationCap className="w-4 h-4 text-purple-600 shrink-0" />
              <span className="font-bold text-stone-900">Degree:</span>{' '}
              <span className="font-medium text-stone-800">{candidateDegree}</span>
            </div>

            <div>
              <span className="font-bold text-stone-900 block mb-2 flex items-center justify-between">
                <span>Detected Skill Tags ({candidateSkills.length}):</span>
                <span className="text-xs text-stone-500 font-semibold">Extracted from resume</span>
              </span>
              <div className="flex flex-wrap gap-2 max-h-44 overflow-y-auto pr-1">
                {candidateSkills.map((s, idx) => (
                  <span
                    key={idx}
                    className="bg-purple-50 text-purple-900 px-3 py-1 rounded-lg border border-purple-200 font-bold text-xs shadow-2xs hover:bg-purple-100 transition-colors"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Column 2: Target Job Role Config */}
        <div className="bg-[#fbf7fd] rounded-2xl p-6 border border-purple-200/90 shadow-soft space-y-4">
          <div className="flex items-center justify-between border-b border-purple-100 pb-3">
            <h3 className="font-extrabold text-stone-900 text-base flex items-center gap-2">
              <Target className="w-4.5 h-4.5 text-emerald-600" /> Target Job Role
            </h3>
            <span className="text-xs sm:text-sm font-extrabold text-emerald-800 bg-emerald-100/90 px-3.5 py-1 rounded-full border border-emerald-300 shadow-2xs">
              {targetRole?.title || 'Grid Integration Software Engineer'}
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4 text-purple-600" /> Select Role Preset
                </label>

                {/* USER REQUIREMENT: Clickable 'roles available' that navigates directly to Job Matcher section! */}
                <button
                  type="button"
                  onClick={() => navigate('/job-matcher')}
                  className="group inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold text-purple-800 bg-purple-100/90 hover:bg-purple-200 border border-purple-300 hover:border-purple-400 shadow-xs transition-all cursor-pointer hover:scale-105 active:scale-95"
                  title="Click to view all jobs you can apply for in Job Matcher"
                >
                  <span>{availableRoles.length} roles available</span>
                  <ArrowRight className="w-3.5 h-3.5 text-purple-700 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>

              {/* Role Preset Horizontal Buttons */}
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
                {availableRoles.slice(0, 6).map((r) => {
                  const isSelected = targetRole?.id === r.id || targetRole?.title === r.title;
                  return (
                    <button
                      key={r.id || r.title}
                      type="button"
                      onClick={() => handleSelectJobRole(r)}
                      className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-extrabold shrink-0 transition-all cursor-pointer border ${
                        isSelected
                          ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                          : 'bg-white text-stone-800 border-purple-200 hover:bg-purple-50 hover:border-purple-300'
                      }`}
                    >
                      {r.title}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-stone-900 mb-1.5">Pasted Job Description</label>
              <textarea
                rows={3}
                value={customJobDescription || targetRole?.description || ''}
                onChange={(e) => setCustomJobDescription(e.target.value)}
                placeholder="Develops and maintains simulation software and data pipelines for power system grid integration..."
                className="w-full p-3.5 rounded-xl border border-purple-200/90 bg-white text-sm font-sans text-stone-900 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 placeholder:text-stone-400 shadow-2xs"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MATCH SCORE BREAKDOWN SECTION (MATCH SCORE, PRESENT SKILLS, MISSING SKILLS) */}
      {/* ========================================================================= */}
      <div className="bg-[#fbf7fd] rounded-2xl p-6 sm:p-7 border border-purple-200/90 shadow-soft space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-purple-100 pb-4">
          <div className="flex items-center gap-4">
            <div className="text-4xl sm:text-5xl font-black text-purple-700 tracking-tight">{matchScore}%</div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h3 className="font-extrabold text-stone-900 text-lg">
                  Match Score for {targetRole?.title || 'Grid Integration Software Engineer'}
                </h3>
                <span
                  className={`text-xs font-extrabold px-3 py-1 rounded-full border shadow-2xs ${
                    matchScore >= 80
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                      : matchScore >= 60
                      ? 'bg-purple-100 text-purple-800 border-purple-300'
                      : 'bg-amber-100 text-amber-800 border-amber-300'
                  }`}
                >
                  {matchScore >= 80 ? 'Strong Fit' : matchScore >= 60 ? 'Good Fit' : 'Tailoring Recommended'}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-stone-600 mt-1 font-medium">
                Evaluated against {targetRequiredSkills.length} core requirements based on active resume technical skills and tools.
              </p>
            </div>
          </div>

          <div className="flex gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('match')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'match'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-white text-stone-700 border border-purple-200 hover:bg-purple-50'
              }`}
            >
              Keyword Breakdown
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('skills')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'skills'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-white text-stone-700 border border-purple-200 hover:bg-purple-50'
              }`}
            >
              Missing Skills ({missingSkills.length})
            </button>
          </div>
        </div>

        {/* Tab 1: Keyword Breakdown */}
        {activeTab === 'match' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="text-sm font-extrabold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600" /> PRESENT MATCHING SKILLS ({matchingSkills.length})
              </h4>
              {matchingSkills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {matchingSkills.map((sk, idx) => (
                    <span
                      key={idx}
                      className="bg-emerald-50 text-emerald-900 border border-emerald-300 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold shadow-2xs hover:bg-emerald-100 transition-colors"
                    >
                      ✓ {sk}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-stone-600 italic bg-white p-4 rounded-xl border border-stone-200">
                  No matching skills detected for this position yet.
                </p>
              )}
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-extrabold uppercase tracking-wider text-rose-800 flex items-center gap-1.5">
                <AlertTriangle className="w-4.5 h-4.5 text-rose-600" /> MISSING REQUIRED KEYWORDS ({missingSkills.length})
              </h4>
              {missingSkills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {missingSkills.map((sk, idx) => (
                    <span
                      key={idx}
                      className="bg-rose-50 text-rose-900 border border-rose-300 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold shadow-2xs hover:bg-rose-100 transition-colors"
                    >
                      ✗ {sk}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-emerald-800 font-bold bg-emerald-50 p-4 rounded-xl border border-emerald-200">
                  🎉 Excellent! Your resume covers all core keywords for this role.
                </p>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Missing Skills & Learning Suggestions */}
        {activeTab === 'skills' && (
          <div className="space-y-4">
            <p className="text-sm text-stone-700 leading-relaxed font-medium">
              Adding these <span className="font-bold text-stone-900">{missingSkills.length}</span> critical skill keywords to your resume will boost your Job Match score from{' '}
              <span className="font-bold text-purple-700">{matchScore}%</span> to{' '}
              <span className="font-bold text-emerald-700">{projectedScore}%</span>.
            </p>
            {missingSkills.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {missingSkills.map((sk, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-purple-200 bg-white flex items-center justify-between text-sm shadow-xs"
                  >
                    <div>
                      <div className="font-extrabold text-stone-900 text-sm">{sk}</div>
                      <div className="text-xs text-stone-600 font-medium mt-0.5">Required for {targetRole?.title}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => navigate('/learning-plan')}
                      className="px-3.5 py-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-800 font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-colors cursor-pointer border border-purple-200"
                    >
                      <BookOpen className="w-4 h-4 text-purple-600" /> Learn Skill
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 bg-white rounded-xl border border-emerald-200 text-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                <h4 className="font-bold text-stone-900 text-base">No Skill Gaps Detected</h4>
                <p className="text-sm text-stone-600 mt-1">Your resume demonstrates complete coverage of the required qualifications for {targetRole?.title}.</p>
              </div>
            )}
          </div>
        )}

        {/* Quick Footer Links */}
        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-purple-100">
          <div className="text-xs text-stone-600 font-medium">
            Ready to apply? Explore verified live openings tailored to your target skillset.
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/job-matcher')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Briefcase className="w-3.5 h-3.5" /> View Matching Jobs <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActiveResumeAnalysisSection;
