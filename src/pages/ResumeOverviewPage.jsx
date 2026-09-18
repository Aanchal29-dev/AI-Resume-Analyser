// src/pages/ResumeOverviewPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import ResumePreview from '../components/common/ResumePreview';
import ProgressBar from '../components/common/ProgressBar';
import { useApp } from '../context/AppContext';
import { FileText, CheckCircle2, ArrowRight, Layers, Edit3, Target } from 'lucide-react';

const ResumeOverviewPage = () => {
  const navigate = useNavigate();
  const { resumeData, uploadedFileName } = useApp();

  const sectionsCount = 6;
  const detectedCount = 6;

  return (
    <Sidebar>
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Resume Overview</h1>
            <p className="text-sm text-slate-500 mt-1">
              Active file: <span className="font-semibold text-slate-800">{uploadedFileName}</span>
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

        {/* Section Completeness Indicators */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-soft grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1 space-y-2 border-r-0 md:border-r border-slate-100 pr-0 md:pr-6">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Completeness</div>
            <div className="text-3xl font-extrabold text-emerald-600">100%</div>
            <ProgressBar progress={100} showPercentage={false} color="emerald" />
            <p className="text-[11px] text-slate-500">{detectedCount} of {sectionsCount} standard ATS sections detected cleanly.</p>
          </div>

          <div className="md:col-span-3 grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Contact Info
              </div>
              <div className="text-[11px] text-slate-500 mt-1 truncate">{resumeData.contact?.email}</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Summary
              </div>
              <div className="text-[11px] text-slate-500 mt-1">Detected</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Experience
              </div>
              <div className="text-[11px] text-slate-500 mt-1">{resumeData.experience?.length || 0} positions</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Projects
              </div>
              <div className="text-[11px] text-slate-500 mt-1">{resumeData.projects?.length || 0} projects</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Skills
              </div>
              <div className="text-[11px] text-slate-500 mt-1">{resumeData.skills?.technical?.length || 0} tech skills</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Education
              </div>
              <div className="text-[11px] text-slate-500 mt-1">B.S. Computer Science</div>
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
