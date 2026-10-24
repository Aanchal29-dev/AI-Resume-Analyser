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
      <div className="max-w-4xl mx-auto space-y-8 font-sans pb-12">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-900 text-xs font-bold mb-2 border border-purple-200">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" /> Step 2 — Analysis Strategy
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">Choose Analysis Strategy</h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1 font-medium">
            Evaluate overall ATS parser compatibility or tailor your resume directly against a target job role.
          </p>
        </div>

        {/* Dual Option Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: General Check */}
          <div
            onClick={() => setSelectedType('general')}
            className={`p-6 rounded-2xl border-2 cursor-pointer transition-all bg-white shadow-soft ${
              selectedType === 'general'
                ? 'border-purple-600 ring-2 ring-purple-100 shadow-md'
                : 'border-purple-200/90 hover:border-purple-300'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-11 h-11 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                <FileCheck2 className="w-6 h-6" />
              </div>
              {selectedType === 'general' && (
                <div className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center">
                  <Check className="w-4 h-4" />
                </div>
              )}
            </div>
            <h3 className="font-extrabold text-stone-900 text-base">General Resume Health Check</h3>
            <p className="text-xs text-stone-700 mt-2 leading-relaxed font-medium">
              Overall evaluation of formatting, ATS parser compatibility, grammar, bullet impact, and structural completeness without matching a specific job description.
            </p>
          </div>

          {/* Card 2: Check Against a Job */}
          <div
            onClick={() => setSelectedType('job')}
            className={`p-6 rounded-2xl border-2 cursor-pointer transition-all bg-white shadow-soft ${
              selectedType === 'job'
                ? 'border-purple-600 ring-2 ring-purple-100 shadow-md'
                : 'border-purple-200/90 hover:border-purple-300'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                <Target className="w-6 h-6 text-emerald-700" />
              </div>
              {selectedType === 'job' && (
                <div className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center">
                  <Check className="w-4 h-4" />
                </div>
              )}
            </div>
            <h3 className="font-extrabold text-stone-900 text-base">Check Against a Target Job</h3>
            <p className="text-xs text-stone-700 mt-2 leading-relaxed font-medium">
              Compare your resume directly against a job role or pasted job description. Identifies missing skill keywords, match percentage, and tailoring advice.
            </p>
          </div>
        </div>

        {/* Target Job Configuration (Active when 'job' selected) */}
        {selectedType === 'job' && (
          <div className="bg-[#fbf7fd] rounded-2xl p-6 border border-purple-200/90 shadow-soft space-y-6 animate-in fade-in duration-300">
            <h3 className="font-extrabold text-stone-900 text-sm border-b border-purple-100 pb-3">Target Role & Job Description Configuration</h3>

            {/* Role Search & Selection */}
            <div>
              <label className="block text-xs font-extrabold text-stone-800 mb-2">Select Target Job Role</label>
              <div className="relative mb-3">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search roles (e.g., Frontend, Machine Learning, Data Analyst)..."
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-purple-200 bg-white text-xs font-medium text-stone-900 focus:outline-none focus:border-purple-600 placeholder:text-stone-400"
                />
              </div>

              {/* Sample Role Chips */}
              <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-1">
                {filteredRoles.map(role => (
                  <button
                    key={role.id}
                    onClick={() => handleSelectJobRole(role)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      targetRole.id === role.id
                        ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                        : 'bg-white text-stone-800 border-purple-200 hover:bg-purple-50'
                    }`}
                  >
                    {role.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Optional Company Name */}
            <div>
              <label className="block text-xs font-extrabold text-stone-800 mb-1">Company Name (Optional)</label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Tata Power, Siemens, Google, Startup"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-purple-200 bg-white text-xs font-medium text-stone-900 focus:outline-none focus:border-purple-600"
                />
              </div>
            </div>

            {/* Paste Custom Job Description Textarea */}
            <div>
              <label className="block text-xs font-extrabold text-stone-800 mb-1">Paste Job Description (Optional)</label>
              <textarea
                rows={4}
                value={customJobDescription}
                onChange={(e) => setCustomJobDescription(e.target.value)}
                placeholder="Paste the full job posting text here to perform real-time keyword vector matching..."
                className="w-full p-3.5 rounded-xl border border-purple-200 bg-white text-xs font-sans text-stone-900 focus:outline-none focus:border-purple-600 placeholder:text-stone-400"
              />
            </div>
          </div>
        )}

        {/* Continue Button */}
        <div className="flex justify-end">
          <button
            onClick={handleStartAnalysis}
            className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-sm shadow-md shadow-purple-600/30 transition-all hover:scale-[1.02] cursor-pointer"
          >
            Analyze Resume Now <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </Sidebar>
  );
};

export default ChooseAnalysisPage;
