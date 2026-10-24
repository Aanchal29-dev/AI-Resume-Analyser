import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import ResumePreview from '../components/common/ResumePreview';
import ProgressBar from '../components/common/ProgressBar';
import ActiveResumeAnalysisSection from '../components/resume/ActiveResumeAnalysisSection';
import { useApp } from '../context/AppContext';
import { calculateSectionCompleteness } from '../utils/resumeValidator';
import {
  FileText,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Briefcase,
  Sparkles,
  Award,
  BadgeCheck
} from 'lucide-react';

const ResumeOverviewPage = () => {
  const navigate = useNavigate();
  const {
    resumeData,
    uploadedFileName,
    verifiedCertificate
  } = useApp();

  const activeFileName = uploadedFileName || resumeData?.fileName || 'Active_Resume.pdf';
  const completeness = calculateSectionCompleteness(resumeData);
  const { sections, detectedCount, totalCount, percentage } = completeness;

  return (
    <Sidebar>
      <div className="max-w-6xl mx-auto space-y-8 font-sans pb-12">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-900 text-xs font-bold mb-2 border border-purple-200">
              <Sparkles className="w-3.5 h-3.5 text-purple-600" /> Resume Analyzer Workspace
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">Active Resume & Role Fit</h1>
            <p className="text-xs sm:text-sm text-stone-600 mt-1">
              Active file: <span className="font-bold text-purple-900">{activeFileName}</span> | Direct real-time keyword alignment & ATS parser inspection.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => navigate('/upload-resume')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-purple-200 bg-white hover:bg-purple-50 text-xs font-bold text-stone-700 shadow-xs transition-colors cursor-pointer hover:border-purple-300"
            >
              <ArrowLeft className="w-4 h-4 text-purple-700" /> Back to Upload Resume
            </button>
            <button
              onClick={() => navigate('/job-matcher')}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-violet-700 hover:from-purple-700 hover:to-violet-800 text-white font-extrabold text-xs shadow-md shadow-purple-600/30 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Briefcase className="w-4 h-4" /> View Matching Jobs <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modular Screenshot Info: Active Resume Context + Target Job Role + Match Score Breakdown */}
        <ActiveResumeAnalysisSection />

        {/* Verified Certificate Banner (if available) */}
        {verifiedCertificate && (
          <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-5 shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-stone-900 text-sm">{verifiedCertificate.details?.title}</span>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-600 text-white flex items-center gap-1">
                    <BadgeCheck className="w-3 h-3" /> {verifiedCertificate.originality?.status || 'Verified Authentic'}
                  </span>
                </div>
                <p className="text-xs text-stone-600 font-medium mt-0.5">
                  Issued by <span className="font-bold text-stone-800">{verifiedCertificate.details?.issuer}</span> • ID: <span className="font-mono text-stone-800">{verifiedCertificate.details?.credentialId}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="text-right">
                <div className="text-lg font-black text-emerald-800">{verifiedCertificate.originality?.authenticityScore || 94}%</div>
                <div className="text-[10px] font-bold text-stone-600">Originality Score</div>
              </div>
            </div>
          </div>
        )}

        {/* Section Completeness Indicators */}
        <div className="bg-[#fbf7fd] rounded-2xl p-6 border border-purple-200/90 shadow-soft grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1 space-y-2 border-r-0 md:border-r border-purple-100 pr-0 md:pr-6">
            <div className="text-xs font-extrabold text-stone-700 uppercase tracking-wider">Completeness</div>
            <div
              className={`text-3xl font-extrabold ${
                percentage >= 80 ? 'text-emerald-700' : percentage >= 50 ? 'text-amber-700' : 'text-rose-700'
              }`}
            >
              {percentage}%
            </div>
            <ProgressBar progress={percentage} showPercentage={false} color={percentage >= 80 ? 'emerald' : percentage >= 50 ? 'amber' : 'rose'} />
            <p className="text-xs text-stone-600 font-medium">{detectedCount} of {totalCount} standard ATS sections detected cleanly.</p>
          </div>

          <div className="md:col-span-3 grid grid-cols-2 sm:grid-cols-3 gap-3">
            {/* Contact Info */}
            <div className={`p-3 rounded-xl border ${sections.contact ? 'bg-white border-purple-200' : 'bg-rose-50 border-rose-200'}`}>
              <div className={`flex items-center gap-1.5 text-xs font-bold ${sections.contact ? 'text-emerald-800' : 'text-rose-800'}`}>
                {sections.contact ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
                Contact Info
              </div>
              <div className="text-xs text-stone-600 font-medium mt-1 truncate">
                {resumeData.contact?.email || (sections.contact ? 'Detected' : 'Missing')}
              </div>
            </div>

            {/* Summary */}
            <div className={`p-3 rounded-xl border ${sections.summary ? 'bg-white border-purple-200' : 'bg-amber-50 border-amber-200'}`}>
              <div className={`flex items-center gap-1.5 text-xs font-bold ${sections.summary ? 'text-emerald-800' : 'text-amber-800'}`}>
                {sections.summary ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-amber-600" />}
                Summary / Bio
              </div>
              <div className="text-xs text-stone-600 font-medium mt-1">
                {sections.summary ? 'Detected' : 'Recommended'}
              </div>
            </div>

            {/* Experience */}
            <div className={`p-3 rounded-xl border ${sections.experience ? 'bg-white border-purple-200' : 'bg-rose-50 border-rose-200'}`}>
              <div className={`flex items-center gap-1.5 text-xs font-bold ${sections.experience ? 'text-emerald-800' : 'text-rose-800'}`}>
                {sections.experience ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
                Experience
              </div>
              <div className="text-xs text-stone-600 font-medium mt-1">
                {resumeData.experience?.length || 0} positions
              </div>
            </div>

            {/* Projects */}
            <div className={`p-3 rounded-xl border ${sections.projects ? 'bg-white border-purple-200' : 'bg-amber-50 border-amber-200'}`}>
              <div className={`flex items-center gap-1.5 text-xs font-bold ${sections.projects ? 'text-emerald-800' : 'text-amber-800'}`}>
                {sections.projects ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-amber-600" />}
                Projects
              </div>
              <div className="text-xs text-stone-600 font-medium mt-1">
                {resumeData.projects?.length || 0} projects
              </div>
            </div>

            {/* Skills */}
            <div className={`p-3 rounded-xl border ${sections.skills ? 'bg-white border-purple-200' : 'bg-rose-50 border-rose-200'}`}>
              <div className={`flex items-center gap-1.5 text-xs font-bold ${sections.skills ? 'text-emerald-800' : 'text-rose-800'}`}>
                {sections.skills ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
                Skills
              </div>
              <div className="text-xs text-stone-600 font-medium mt-1">
                {Array.isArray(resumeData.skills?.technical) ? resumeData.skills.technical.length : 0} tech skills
              </div>
            </div>

            {/* Education */}
            <div className={`p-3 rounded-xl border ${sections.education ? 'bg-white border-purple-200' : 'bg-rose-50 border-rose-200'}`}>
              <div className={`flex items-center gap-1.5 text-xs font-bold ${sections.education ? 'text-emerald-800' : 'text-rose-800'}`}>
                {sections.education ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
                Education
              </div>
              <div className="text-xs text-stone-600 font-medium mt-1 truncate">
                {resumeData.education?.[0]?.degree || (sections.education ? 'Detected' : 'Missing')}
              </div>
            </div>
          </div>
        </div>

        {/* Formatted Live Resume Layout Preview */}
        <div className="bg-[#fbf7fd] rounded-2xl p-6 border border-purple-200/90 shadow-soft">
          <div className="flex items-center justify-between mb-4 border-b border-purple-100 pb-3">
            <div>
              <h2 className="text-lg font-extrabold text-stone-900 tracking-tight">Extracted ATS Layout Preview</h2>
              <p className="text-xs text-stone-600 font-medium">Verify how automated applicant tracking systems parse your sections.</p>
            </div>
            <button
              onClick={() => navigate('/corrections')}
              className="text-xs font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1 bg-purple-100/70 hover:bg-purple-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              Optimize with AI <Sparkles className="w-3.5 h-3.5" />
            </button>
          </div>
          <ResumePreview resume={resumeData} />
        </div>
      </div>
    </Sidebar>
  );
};

export default ResumeOverviewPage;
