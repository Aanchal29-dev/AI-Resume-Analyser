// src/pages/ChooseAnalysisPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import { useApp } from '../context/AppContext';
import { SAMPLE_JOB_ROLES } from '../data/mockData';
import { FileCheck2, Target, Search, ArrowRight, Sparkles, Building2, Check } from 'lucide-react';

const ChooseAnalysisPage = () => {
  const navigate = useNavigate();
  const {
    targetRole,
    handleSelectJobRole,
    customJobDescription,
    setCustomJobDescription,
    setAnalysisType
  } = useApp();

  const [selectedType, setSelectedType] = useState('job'); // 'general' | 'job'
  const [searchTerm, setSearchTerm] = useState('');
  const [companyName, setCompanyName] = useState('TechCorp Labs');

  const filteredRoles = SAMPLE_JOB_ROLES.filter(r =>
    r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStartAnalysis = () => {
    setAnalysisType(selectedType);
    navigate('/analysis');
  };

  return (
    <Sidebar>
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Step 2 — Analysis Strategy
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Choose Analysis Type</h1>
          <p className="text-sm text-slate-500 mt-1">
            Evaluate overall ATS quality or tailor your resume against a specific target role.
          </p>
        </div>

        {/* Dual Option Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: General Check */}
          <div
            onClick={() => setSelectedType('general')}
            className={`p-6 rounded-2xl border-2 cursor-pointer transition-all bg-white shadow-soft ${
              selectedType === 'general'
                ? 'border-indigo-600 ring-2 ring-indigo-100'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                <FileCheck2 className="w-5 h-5" />
              </div>
              {selectedType === 'general' && (
                <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                  <Check className="w-4 h-4" />
                </div>
              )}
            </div>
            <h3 className="font-bold text-slate-900 text-base">General Resume Check</h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Overall evaluation of formatting, ATS parser compatibility, grammar, bullet impact, and structural completeness without matching a specific job description.
            </p>
          </div>

          {/* Card 2: Check Against a Job */}
          <div
            onClick={() => setSelectedType('job')}
            className={`p-6 rounded-2xl border-2 cursor-pointer transition-all bg-white shadow-soft ${
              selectedType === 'job'
                ? 'border-indigo-600 ring-2 ring-indigo-100'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <Target className="w-5 h-5" />
              </div>
              {selectedType === 'job' && (
                <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                  <Check className="w-4 h-4" />
                </div>
              )}
            </div>
            <h3 className="font-bold text-slate-900 text-base">Check Against a Target Job</h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Compare your resume directly against a job role or pasted job description. Identifies missing skill keywords, match percentage, and tailoring advice.
            </p>
          </div>
        </div>

        {/* Target Job Configuration (Active when 'job' selected) */}
        {selectedType === 'job' && (
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-soft space-y-6 animate-in fade-in duration-300">
            <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-3">Target Role & Job Description Configuration</h3>

            {/* Role Search & Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Select Target Job Role</label>
              <div className="relative mb-3">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search roles (e.g., Frontend, Machine Learning, Data Analyst)..."
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-indigo-600"
                />
              </div>

              {/* Sample Role Chips */}
              <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-1">
                {filteredRoles.map(role => (
                  <button
                    key={role.id}
                    onClick={() => handleSelectJobRole(role)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                      targetRole.id === role.id
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {role.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Optional Company Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Company Name (Optional)</label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Google, Nexus Tech, Local Startup"
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-indigo-600"
                />
              </div>
            </div>

            {/* Paste Custom Job Description Textarea */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Paste Job Description (Optional)</label>
              <textarea
                rows={4}
                value={customJobDescription}
                onChange={(e) => setCustomJobDescription(e.target.value)}
                placeholder="Paste the full job posting text here to perform real-time keyword vector matching..."
                className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-indigo-600"
              />
            </div>
          </div>
        )}

        {/* Continue Button */}
        <div className="flex justify-end">
          <button
            onClick={handleStartAnalysis}
            className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-600/20 transition-all hover:scale-[1.02]"
          >
            Analyze Resume Now <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </Sidebar>
  );
};

export default ChooseAnalysisPage;
