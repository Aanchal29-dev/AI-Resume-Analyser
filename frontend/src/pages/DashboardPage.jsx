// src/pages/DashboardPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import ScoreCard from '../components/common/ScoreCard';
import StatusBadge from '../components/common/StatusBadge';
import { useApp } from '../context/AppContext';
import {
  FileCheck2,
  Compass,
  Target,
  Sparkles,
  TrendingUp,
  ChevronRight,
  Upload
} from 'lucide-react';

const DashboardPage = () => {
  const navigate = useNavigate();
  const {
    uploadedFileName,
    targetRole,
    analysis,
    userProfile,
    hasAnalyzedResume
  } = useApp();

  // Clean greeting logic: Only include user name if it's set and not a generic placeholder
  const rawName = (userProfile.fullName || '').trim();
  const hasRealName = rawName && rawName.toLowerCase() !== 'student' && rawName.toLowerCase() !== 'user';
  const greetingText = hasRealName ? `Hello ${rawName} 👋` : 'Hello 👋';

  return (
    <Sidebar>
      <div className="max-w-6xl mx-auto space-y-8 font-sans">
        {/* Sleek Hero Welcome Banner with Dynamic Greeting */}
        <div className="bg-[#fbf7fd] rounded-3xl p-6 sm:p-8 border-2 border-purple-200/80 hover:border-purple-400 text-stone-900 shadow-soft relative overflow-hidden transition-all">
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 border border-purple-300 text-purple-800 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-purple-600" /> Personal Workspace
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
                {greetingText}
              </h1>
              <p className="text-xs sm:text-sm text-stone-600 max-w-xl">
                {hasAnalyzedResume ? (
                  <>Active Resume: <span className="font-semibold text-purple-700">{uploadedFileName}</span> | Target Role: <span className="font-semibold text-purple-700">{targetRole.title}</span></>
                ) : (
                  'Welcome to your workspace! Upload a resume to evaluate your ATS compatibility and job alignment.'
                )}
              </p>
            </div>

            <button
              onClick={() => navigate('/upload-resume')}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-purple-600 via-purple-700 to-violet-700 hover:from-purple-700 hover:to-violet-800 text-white font-bold text-xs shadow-md shadow-purple-600/20 transition-all flex items-center gap-2 shrink-0 hover:scale-[1.02]"
            >
              <Upload className="w-4 h-4" /> {hasAnalyzedResume ? 'Analyze New Resume' : 'Upload Resume'}
            </button>
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
              className="bg-[#fbf7fd] hover:bg-purple-50/60 p-6 rounded-2xl border-2 border-purple-200/80 hover:border-purple-500 shadow-soft shadow-card-hover cursor-pointer group transition-all"
            >
              <div className="w-11 h-11 rounded-xl bg-purple-100/90 text-purple-700 flex items-center justify-center mb-4 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold text-stone-900">Resume Analyzer</h3>
              <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                Evaluate ATS compatibility, formatting, and section completeness.
              </p>
              <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-purple-600 group-hover:translate-x-1 transition-transform">
                Open Analyzer <ChevronRight className="w-4 h-4" />
              </div>
            </div>

            <div
              onClick={() => navigate('/job-matcher')}
              className="bg-[#fbf7fd] hover:bg-purple-50/60 p-6 rounded-2xl border-2 border-purple-200/80 hover:border-purple-500 shadow-soft shadow-card-hover cursor-pointer group transition-all"
            >
              <div className="w-11 h-11 rounded-xl bg-purple-100/90 text-purple-700 flex items-center justify-center mb-4 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold text-stone-900">Job Matcher</h3>
              <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                Compare resume against job descriptions to extract missing skills.
              </p>
              <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-purple-600 group-hover:translate-x-1 transition-transform">
                Open Job Matcher <ChevronRight className="w-4 h-4" />
              </div>
            </div>

            <div
              onClick={() => navigate('/career-discovery')}
              className="bg-[#fbf7fd] hover:bg-purple-50/60 p-6 rounded-2xl border-2 border-purple-200/80 hover:border-purple-500 shadow-soft shadow-card-hover cursor-pointer group transition-all"
            >
              <div className="w-11 h-11 rounded-xl bg-purple-100/90 text-purple-700 flex items-center justify-center mb-4 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold text-stone-900">Career Discovery</h3>
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
          <div className="bg-[#fbf7fd] rounded-2xl border-2 border-purple-200/80 hover:border-purple-400 p-6 shadow-soft space-y-4 transition-all">
            <div className="flex items-center justify-between border-b border-purple-100 pb-3">
              <div>
                <h3 className="font-extrabold text-stone-900 text-sm">Top Priority Resume Fixes</h3>
                <p className="text-xs text-stone-500">Action items identified in active evaluation</p>
              </div>
              <button
                onClick={() => navigate('/issues')}
                className="text-xs font-bold text-purple-700 hover:text-purple-900"
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
                    className="shrink-0 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-bold text-xs shadow-xs"
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
