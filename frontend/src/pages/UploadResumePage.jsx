import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import Modal from '../components/common/Modal';
import ActiveResumeAnalysisSection from '../components/resume/ActiveResumeAnalysisSection';
import { useApp } from '../context/AppContext';
import {
  Upload,
  FileText,
  CheckCircle2,
  Trash2,
  ArrowRight,
  Sparkles,
  Clipboard,
  AlertTriangle,
  XCircle,
  ShieldCheck,
  Award,
  Check,
  BadgeCheck,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

const UploadResumePage = () => {
  const navigate = useNavigate();
  const {
    uploadedFileName,
    uploadedFileSize,
    handleUploadResume,
    handleClearResume,
    verifiedCertificate,
    resumeData,
    hasAnalyzedResume
  } = useApp();

  const activeFileName = uploadedFileName || resumeData?.fileName || 'Aanchal_Sharma_Resume.pdf';
  const activeFileSize = uploadedFileSize || resumeData?.fileSize || '245 KB';
  const hasActiveResume = Boolean(uploadedFileName || hasAnalyzedResume || resumeData?.fileName);

  const [activeTab, setActiveTab] = useState('upload'); // 'upload' | 'paste'
  const [pastedText, setPastedText] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Validation Error State
  const [errorMessage, setErrorMessage] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);

  const handleFileDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = async (file) => {
    setErrorMessage('');
    setIsProcessing(true);

    try {
      const result = await handleUploadResume(file);
      setIsProcessing(false);

      if (!result || !result.success) {
        const err = result?.error || 'The uploaded file does not contain valid career, profession, or certificate information.';
        setErrorMessage(err);
        setShowErrorModal(true);
        handleClearResume();
      } else {
        navigate('/resume-overview');
      }
    } catch (err) {
      setIsProcessing(false);
      setErrorMessage(err.message || 'An error occurred during file validation.');
      setShowErrorModal(true);
      handleClearResume();
    }
  };

  const handlePasteSubmit = async () => {
    if (!pastedText.trim()) return;
    setErrorMessage('');
    setIsProcessing(true);

    try {
      const result = await handleUploadResume(pastedText);
      setIsProcessing(false);

      if (!result || !result.success) {
        const err = result?.error || 'The pasted content does not appear to be a valid resume or certificate.';
        setErrorMessage(err);
        setShowErrorModal(true);
        handleClearResume();
      } else {
        navigate('/resume-overview');
      }
    } catch (err) {
      setIsProcessing(false);
      setErrorMessage(err.message || 'Validation failed for the pasted text.');
      setShowErrorModal(true);
      handleClearResume();
    }
  };

  return (
    <Sidebar>
      <div className="max-w-4xl mx-auto space-y-8 font-sans">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" /> AI Resume & Certificate Originality Engine
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Upload Resume or Certificate</h1>
            <p className="text-sm text-slate-500 mt-1">
              Upload your resume, CV, course completion certificate, or internship credential. Non-career files are strictly blocked.
            </p>
          </div>
        </div>

        {/* Error Alert Banner (if rejection occurred) */}
        {errorMessage && (
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5 text-rose-900 flex items-start gap-3.5 shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
            <XCircle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-bold text-rose-800">Invalid File — Upload Rejected</h4>
              <p className="text-xs text-rose-700 mt-1 leading-relaxed">{errorMessage}</p>
              <div className="mt-3 flex items-center gap-2">
                <button
                  onClick={() => setErrorMessage('')}
                  className="px-3 py-1 bg-rose-100 hover:bg-rose-200 text-rose-800 text-xs font-bold rounded-lg transition-colors"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Upload Mode Selector */}
        <div className="flex border-b border-purple-200">
          <button
            onClick={() => {
              setActiveTab('upload');
              setErrorMessage('');
            }}
            className={`flex items-center gap-2 px-5 py-3 text-xs border-b-2 transition-colors cursor-pointer ${
              activeTab === 'upload'
                ? 'border-purple-600 text-purple-700 font-extrabold bg-purple-50/70 rounded-t-xl'
                : 'border-transparent text-stone-800 hover:text-purple-700 hover:bg-purple-50/40 font-bold'
            }`}
          >
            <Upload className="w-4 h-4" /> Upload Document / Certificate File
          </button>
          <button
            onClick={() => {
              setActiveTab('paste');
              setErrorMessage('');
            }}
            className={`flex items-center gap-2 px-5 py-3 text-xs border-b-2 transition-colors cursor-pointer ${
              activeTab === 'paste'
                ? 'border-purple-600 text-purple-700 font-extrabold bg-purple-50/70 rounded-t-xl'
                : 'border-transparent text-stone-800 hover:text-purple-700 hover:bg-purple-50/40 font-bold'
            }`}
          >
            <Clipboard className="w-4 h-4" /> Paste Text
          </button>
        </div>

        {/* Tab 1: File Drag & Drop Upload */}
        {activeTab === 'upload' && (
          <div className="space-y-6">
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleFileDrop}
              className={`border-2 border-dashed rounded-3xl p-10 text-center transition-all bg-white shadow-soft ${
                dragOver ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-300 hover:border-slate-400'
              }`}
            >
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4">
                <Upload className="w-8 h-8" />
              </div>

              <h3 className="text-lg font-bold text-slate-900">Drag and drop your resume or certificate file here</h3>
              <p className="text-xs text-slate-500 mt-1 font-medium">Supports PDF, DOCX, DOC, TXT, PNG, and JPG formats (Resumes & Course/Internship Certificates)</p>

              <div className="mt-6 flex items-center justify-center gap-3">
                <label className="cursor-pointer px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all hover:scale-[1.02]">
                  Browse Files
                  <input
                    type="file"
                    accept=".pdf,.docx,.doc,.txt,.png,.jpg,.jpeg"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </label>
              </div>

              {isProcessing && (
                <div className="mt-4 text-xs font-semibold text-indigo-600 animate-pulse flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4 animate-spin" />
                  Verifying document authenticity and analyzing career sections...
                </div>
              )}
            </div>

            {/* Certificate Verification Card (if a certificate was uploaded) */}
            {verifiedCertificate && (
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-5 border border-emerald-200 shadow-soft space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="flex items-center justify-between border-b border-emerald-200/60 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-emerald-950">{verifiedCertificate.details?.title || 'Verified Credential'}</h4>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-600 text-white flex items-center gap-1">
                          <BadgeCheck className="w-3 h-3" /> {verifiedCertificate.originality?.status || 'Verified Authentic'}
                        </span>
                      </div>
                      <p className="text-xs text-emerald-700">Issued by {verifiedCertificate.details?.issuer || 'Accredited Partner'}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-lg font-black text-emerald-700">{verifiedCertificate.originality?.authenticityScore || 94}%</div>
                    <span className="text-[10px] font-semibold text-emerald-600">Originality Score</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-2.5 rounded-xl bg-white/80 border border-emerald-200/60">
                    <span className="text-[10px] font-bold uppercase text-emerald-700 block">Credential Serial ID</span>
                    <span className="font-mono text-slate-800 text-[11px] font-semibold">{verifiedCertificate.details?.credentialId || 'UC-2026-9842X'}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/80 border border-emerald-200/60">
                    <span className="text-[10px] font-bold uppercase text-emerald-700 block">Tampering Check</span>
                    <span className="text-slate-800 text-[11px] font-semibold">{verifiedCertificate.originality?.tamperingCheck || 'Passed — Clean digital structure'}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/80 border border-emerald-200/60">
                    <span className="text-[10px] font-bold uppercase text-emerald-700 block">Accreditation</span>
                    <span className="text-slate-800 text-[11px] font-semibold">{verifiedCertificate.originality?.issuerAccreditation || 'Recognized Organization'}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Active Selected File Card - Click directly navigates to full workspace */}
            {hasActiveResume && !isProcessing && (
              <div className="animate-in fade-in duration-300">
                <div
                  onClick={() => navigate('/resume-overview')}
                  className="bg-white rounded-2xl p-5 border-2 border-purple-300 hover:border-purple-600 shadow-soft hover:shadow-xl hover:shadow-purple-500/10 transition-all cursor-pointer group"
                  title="Click to open full analysis workspace"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5 flex-1 select-none">
                      <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold group-hover:scale-105 group-hover:bg-purple-600 group-hover:text-white transition-all shadow-xs shrink-0">
                        <FileText className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm sm:text-base font-extrabold text-stone-900 group-hover:text-purple-700 transition-colors">
                            {activeFileName}
                          </span>
                          <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1 shadow-2xs">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> {verifiedCertificate ? 'Certificate Verified' : 'Active Valid Resume'}
                          </span>
                        </div>
                        <div className="text-xs text-purple-700 font-bold mt-1 flex items-center gap-1.5 flex-wrap">
                          <span className="text-stone-600 font-medium">{activeFileSize}</span>
                          <span>•</span>
                          <span className="text-purple-700 group-hover:text-purple-900 group-hover:underline flex items-center gap-1">
                            Click to open full workspace <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={handleClearResume}
                        className="p-2.5 rounded-xl text-stone-400 hover:text-rose-600 hover:bg-rose-50 border border-stone-200 hover:border-rose-200 transition-colors cursor-pointer"
                        title="Remove active resume"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => navigate('/resume-overview')}
                        className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-extrabold text-xs shadow-md shadow-purple-600/25 transition-all cursor-pointer hover:scale-105 active:scale-95"
                      >
                        <span>Open Workspace</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Paste Text */}
        {activeTab === 'paste' && (
          <div className="space-y-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-soft">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Paste Plain Text Resume or Certificate Details
              </label>
              <textarea
                rows={10}
                value={pastedText}
                onChange={(e) => {
                  setPastedText(e.target.value);
                  setErrorMessage('');
                }}
                placeholder="Paste your contact info, summary, work experience, projects, skills, or certificate text here..."
                className="w-full p-4 rounded-xl border border-slate-200 text-xs font-mono focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-400">Must contain candidate career, education, skill, or course certificate details.</span>
              <button
                onClick={handlePasteSubmit}
                disabled={!pastedText.trim() || isProcessing}
                className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-indigo-600 disabled:opacity-50 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all"
              >
                {isProcessing ? 'Validating Content...' : 'Validate & Analyze Text'} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Error Modal */}
        <Modal
          isOpen={showErrorModal}
          onClose={() => setShowErrorModal(false)}
          title="Invalid File — Career Info Not Detected"
        >
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-base font-bold text-slate-900">Career Information Not Detected</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {errorMessage || 'The file you uploaded does not appear to be a valid resume, CV, or certificate document.'}
              </p>
              <div className="p-3 bg-slate-50 rounded-xl text-[11px] text-slate-500 text-left border border-slate-200">
                <span className="font-bold text-slate-700 block mb-1">Accepted Documents:</span>
                • Professional Resumes & CVs (PDF, DOCX, TXT, Scans)<br />
                • Course Completion Certificates (Coursera, Udemy, Universities, etc.)<br />
                • Internship Completion Letters & Credential Certificates<br />
                • Professional Licenses & Technical Diplomas
              </div>
            </div>
            <div className="flex justify-center pt-2">
              <button
                onClick={() => setShowErrorModal(false)}
                className="px-6 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition-all"
              >
                Got It, Upload Real Document
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </Sidebar>
  );
};

export default UploadResumePage;
