// src/pages/ResumeOverviewPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import ResumePreview from '../components/common/ResumePreview';
import ProgressBar from '../components/common/ProgressBar';
import { useApp } from '../context/AppContext';
import { calculateSectionCompleteness } from '../utils/resumeValidator';
import { FileText, CheckCircle2, AlertCircle, ArrowRight, Layers, Edit3, Target } from 'lucide-react';

const ResumeOverviewPage = () => {
  const navigate = useNavigate();
  const { resumeData, uploadedFileName } = useApp();

  const completeness = calculateSectionCompleteness(resumeData);
  const { sections, detectedCount, totalCount, percentage } = completeness;

  return (
    <Sidebar>
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Resume Overview</h1>
            <p className="text-sm text-slate-500 mt-1">
              Active file: <span className="font-semibold text-slate-800">{uploadedFileName || 'Candidate_Resume.pdf'}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/upload-resume')}
              className="px-4 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-xs font-semibold text-slate-700"
            >
              Replace File
            </button>
            <button
              onClick={() => navigate('/choose-analysis')}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all"
            >
              Choose Analysis Type <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Section Completeness Indicators (Calculated Dynamically) */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-soft grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1 space-y-2 border-r-0 md:border-r border-slate-100 pr-0 md:pr-6">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Completeness</div>
            <div className={`text-3xl font-extrabold ${percentage >= 80 ? 'text-emerald-600' : percentage >= 50 ? 'text-amber-600' : 'text-rose-600'}`}>
              {percentage}%
            </div>
            <ProgressBar progress={percentage} showPercentage={false} color={percentage >= 80 ? 'emerald' : percentage >= 50 ? 'amber' : 'rose'} />
            <p className="text-[11px] text-slate-500">{detectedCount} of {totalCount} standard ATS sections detected cleanly.</p>
          </div>

          <div className="md:col-span-3 grid grid-cols-2 sm:grid-cols-3 gap-3">
            {/* Contact Info */}
            <div className={`p-3 rounded-xl border ${sections.contact ? 'bg-slate-50 border-slate-200/70' : 'bg-rose-50/60 border-rose-200'}`}>
              <div className={`flex items-center gap-1.5 text-xs font-bold ${sections.contact ? 'text-emerald-700' : 'text-rose-700'}`}>
                {sections.contact ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
                Contact Info
              </div>
              <div className="text-[11px] text-slate-500 mt-1 truncate">
                {resumeData.contact?.email || (sections.contact ? 'Detected' : 'Missing')}
              </div>
            </div>

            {/* Summary */}
            <div className={`p-3 rounded-xl border ${sections.summary ? 'bg-slate-50 border-slate-200/70' : 'bg-amber-50/60 border-amber-200'}`}>
              <div className={`flex items-center gap-1.5 text-xs font-bold ${sections.summary ? 'text-emerald-700' : 'text-amber-700'}`}>
                {sections.summary ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-amber-600" />}
                Summary / Bio
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                {sections.summary ? 'Detected' : 'Recommended'}
              </div>
            </div>

            {/* Experience */}
            <div className={`p-3 rounded-xl border ${sections.experience ? 'bg-slate-50 border-slate-200/70' : 'bg-rose-50/60 border-rose-200'}`}>
              <div className={`flex items-center gap-1.5 text-xs font-bold ${sections.experience ? 'text-emerald-700' : 'text-rose-700'}`}>
                {sections.experience ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
                Experience
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                {resumeData.experience?.length || 0} positions
              </div>
            </div>

            {/* Projects */}
            <div className={`p-3 rounded-xl border ${sections.projects ? 'bg-slate-50 border-slate-200/70' : 'bg-amber-50/60 border-amber-200'}`}>
              <div className={`flex items-center gap-1.5 text-xs font-bold ${sections.projects ? 'text-emerald-700' : 'text-amber-700'}`}>
                {sections.projects ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-amber-600" />}
                Projects
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                {resumeData.projects?.length || 0} projects
              </div>
            </div>

            {/* Skills */}
            <div className={`p-3 rounded-xl border ${sections.skills ? 'bg-slate-50 border-slate-200/70' : 'bg-rose-50/60 border-rose-200'}`}>
              <div className={`flex items-center gap-1.5 text-xs font-bold ${sections.skills ? 'text-emerald-700' : 'text-rose-700'}`}>
                {sections.skills ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
                Skills
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                {Array.isArray(resumeData.skills?.technical) ? resumeData.skills.technical.length : 0} tech skills
              </div>
            </div>

            {/* Education */}
            <div className={`p-3 rounded-xl border ${sections.education ? 'bg-slate-50 border-slate-200/70' : 'bg-rose-50/60 border-rose-200'}`}>
              <div className={`flex items-center gap-1.5 text-xs font-bold ${sections.education ? 'text-emerald-700' : 'text-rose-700'}`}>
                {sections.education ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
                Education
              </div>
              <div className="text-[11px] text-slate-500 mt-1 truncate">
                {resumeData.education?.[0]?.degree || (sections.education ? 'Detected' : 'Missing')}
              </div>
            </div>
          </div>
        </div>

        {/* Formatted Live Resume Preview */}
        <div>
          <h2 className="text-lg font-bold text-slate-900 mb-3">Extracted Layout Preview</h2>
          <ResumePreview resume={resumeData} />
        </div>
      </div>
    </Sidebar>
  );
};

export default ResumeOverviewPage;
