// src/pages/JobMatcherPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import ScoreCard from '../components/common/ScoreCard';
import StatusBadge from '../components/common/StatusBadge';
import { useApp } from '../context/AppContext';
import { SAMPLE_JOB_ROLES } from '../data/mockData';
import {
  Target,
  FileText,
  Building2,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Search,
  BookOpen
} from 'lucide-react';

const JobMatcherPage = () => {
  const navigate = useNavigate();
  const {
    targetRole,
    handleSelectJobRole,
    customJobDescription,
    setCustomJobDescription,
    analysis,
    uploadedFileName,
    userProfile
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('match'); // 'match' | 'skills' | 'tailor'

  const filteredRoles = SAMPLE_JOB_ROLES.filter(r =>
    r.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const matchingSkills = ['React', 'JavaScript (ES6+)', 'HTML5/CSS3', 'Tailwind CSS', 'Node.js', 'Git/GitHub', 'REST APIs'];
  const missingSkills = ['TypeScript', 'Web Performance & Core Vitals', 'Automated Testing (Jest)', 'GraphQL'];

  return (
    <Sidebar>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" /> Dedicated Job Description Matcher
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Job Matcher Workspace</h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Compare your resume directly against any target position to extract missing keywords and skill requirements.
            </p>
          </div>

          <button
            onClick={() => navigate('/corrections')}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all shrink-0"
          >
            Tailor Resume with AI <Sparkles className="w-4 h-4" />
          </button>
        </div>

        {/* Two Column Input Workspace: Desktop 2 Cols / Mobile Stacked */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Column 1: Active Resume Context */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-soft space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-600" /> Active Resume File
              </h3>
              <span className="text-xs font-semibold text-slate-500">{uploadedFileName || 'Sample_Resume_Uploaded.pdf'}</span>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-2 text-xs text-slate-700">
              <div><span className="font-bold text-slate-900">Applicant Name:</span> {(userProfile && userProfile.fullName) || 'User'}</div>
              <div><span className="font-bold text-slate-900">Degree:</span> B.S. in Computer Science & Engineering</div>
              <div>
                <span className="font-bold text-slate-900 block mb-1">Detected Skill Tags:</span>
                <div className="flex flex-wrap gap-1.5">
                  {matchingSkills.map((s, idx) => (
                    <span key={idx} className="bg-white px-2 py-0.5 rounded border border-slate-200 font-medium text-[11px]">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Target Job Description Config */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-soft space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Target className="w-4 h-4 text-emerald-600" /> Target Job Role
              </h3>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                {targetRole?.title || 'Frontend Developer'}
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Select Role Preset</label>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {SAMPLE_JOB_ROLES.slice(0, 4).map(r => (
                    <button
                      key={r.id}
                      onClick={() => handleSelectJobRole(r)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold shrink-0 border ${
                        targetRole?.id === r.id ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      {r.title}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Pasted Job Description</label>
                <textarea
                  rows={4}
                  value={customJobDescription || targetRole?.description || ''}
                  onChange={(e) => setCustomJobDescription(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs font-sans focus:outline-none focus:border-indigo-600"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Job Match Analysis Breakdown */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-soft space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-4">
              <div className="text-4xl font-extrabold text-indigo-600">{analysis?.jobMatchScore || 72}%</div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Match Score for {targetRole?.title || 'Frontend Developer'}</h3>
                <p className="text-xs text-slate-500">Based on technical skills, experience alignment, and keyword density.</p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('match')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold ${activeTab === 'match' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}`}
              >
                Keyword Breakdown
              </button>
              <button
                onClick={() => setActiveTab('skills')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold ${activeTab === 'skills' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}`}
              >
                Missing Skills ({missingSkills.length})
              </button>
            </div>
          </div>

          {/* Tab 1: Keyword Breakdown */}
          {activeTab === 'match' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Present Matching Skills ({matchingSkills.length})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {matchingSkills.map((sk, idx) => (
                    <span key={idx} className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-xl text-xs font-semibold">
                      ✓ {sk}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-rose-700 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-600" /> Missing Required Keywords ({missingSkills.length})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {missingSkills.map((sk, idx) => (
                    <span key={idx} className="bg-rose-50 text-rose-800 border border-rose-200 px-3 py-1 rounded-xl text-xs font-semibold">
                      ✗ {sk}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Missing Skills & Learning Suggestions */}
          {activeTab === 'skills' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-600">
                Adding these 4 critical skill keywords to your resume will boost your Job Match score from <span className="font-bold text-slate-900">72%</span> to <span className="font-bold text-emerald-600">88%</span>.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {missingSkills.map((sk, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-slate-900">{sk}</div>
                      <div className="text-[11px] text-slate-500">Target Role Requirement</div>
                    </div>
                    <button
                      onClick={() => navigate('/learning-plan')}
                      className="px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-600 font-bold hover:bg-indigo-100 flex items-center gap-1"
                    >
                      <BookOpen className="w-3.5 h-3.5" /> Learn Skill
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Sidebar>
  );
};

export default JobMatcherPage;
