// src/pages/UploadResumePage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import Modal from '../components/common/Modal';
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
  KeyRound,
  ShieldCheck,
  Check
} from 'lucide-react';

const UploadResumePage = () => {
  const navigate = useNavigate();
  const {
    uploadedFileName,
    uploadedFileSize,
    handleUploadResume,
    handleClearResume,
    geminiApiKey,
    updateGeminiApiKey
  } = useApp();

  const [activeTab, setActiveTab] = useState('upload'); // 'upload' | 'paste'
  const [pastedText, setPastedText] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Validation Error State
  const [errorMessage, setErrorMessage] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState(geminiApiKey || '');

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
        const err = result?.error || 'The uploaded file does not contain valid career, profession, or resume information.';
        setErrorMessage(err);
        setShowErrorModal(true);
        handleClearResume();
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
        const err = result?.error || 'The pasted content does not appear to be a valid resume or career document.';
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

  const handleSaveApiKey = () => {
    updateGeminiApiKey(apiKeyInput.trim());
    setShowApiKeyModal(false);
  };

  return (
    <Sidebar>
      <div className="max-w-4xl mx-auto space-y-8 font-sans">
        {/* Top Header & API Engine Badge */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" /> AI Resume Parser & Career Validator
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Upload Your Resume</h1>
            <p className="text-sm text-slate-500 mt-1">
              Upload your resume file or paste text. Only genuine career, CV, and professional profile documents are accepted.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setApiKeyInput(geminiApiKey || '');
                setShowApiKeyModal(true);
              }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
                geminiApiKey
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>{geminiApiKey ? 'Gemini AI Active' : 'Configure Gemini API Key'}</span>
            </button>
          </div>
        </div>

        {/* Error Alert Banner (if rejection occurred) */}
        {errorMessage && (
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5 text-rose-900 flex items-start gap-3.5 shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
            <XCircle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-bold text-rose-800">Invalid Resume File — Upload Rejected</h4>
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
        <div className="flex border-b border-slate-200">
          <button
            onClick={() => {
              setActiveTab('upload');
              setErrorMessage('');
            }}
            className={`flex items-center gap-2 px-5 py-3 font-semibold text-xs border-b-2 transition-colors ${
              activeTab === 'upload'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Upload className="w-4 h-4" /> Upload Document / Image File
          </button>
          <button
            onClick={() => {
              setActiveTab('paste');
              setErrorMessage('');
            }}
            className={`flex items-center gap-2 px-5 py-3 font-semibold text-xs border-b-2 transition-colors ${
              activeTab === 'paste'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Clipboard className="w-4 h-4" /> Paste Resume Text
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

              <h3 className="text-lg font-bold text-slate-900">Drag and drop your resume file here</h3>
              <p className="text-xs text-slate-500 mt-1 font-medium">Supports PDF, DOCX, DOC, TXT, PNG, and JPG formats up to 10 MB</p>

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
                  Verifying career document structure and validating ATS sections...
                </div>
              )}
            </div>

            {/* Active Selected File Card */}
            {uploadedFileName && !isProcessing && (
              <div className="bg-white rounded-2xl p-5 border border-emerald-200/80 shadow-soft flex items-center justify-between animate-in fade-in duration-300">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900">{uploadedFileName}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Valid Resume Verified
                      </span>
                    </div>
                    <span className="text-xs text-slate-400 mt-0.5 block">{uploadedFileSize || '245 KB'} • Professional Profile Ready</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleClearResume}
                    className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Remove file"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => navigate('/resume-overview')}
                    className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all"
                  >
                    Continue to Overview <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Paste Resume Text */}
        {activeTab === 'paste' && (
          <div className="space-y-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-soft">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Paste Plain Text Resume
              </label>
              <textarea
                rows={10}
                value={pastedText}
                onChange={(e) => {
                  setPastedText(e.target.value);
                  setErrorMessage('');
                }}
                placeholder="Paste your contact info, summary, work experience, projects, and skills here..."
                className="w-full p-4 rounded-xl border border-slate-200 text-xs font-mono focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-400">Must contain candidate career, education, or skill details.</span>
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
          title="Invalid File — Not a Resume"
        >
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-base font-bold text-slate-900">Career Information Not Detected</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {errorMessage || 'The file you uploaded does not appear to be a valid resume, CV, or career-related document.'}
              </p>
              <div className="p-3 bg-slate-50 rounded-xl text-[11px] text-slate-500 text-left border border-slate-200">
                <span className="font-bold text-slate-700 block mb-1">A valid resume should contain:</span>
                • Contact information (Name, Email, Phone)<br />
                • Work experience, internships, or employment history<br />
                • Technical, soft, or functional skills<br />
                • Education, degree, or certifications
              </div>
            </div>
            <div className="flex justify-center pt-2">
              <button
                onClick={() => setShowErrorModal(false)}
                className="px-6 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition-all"
              >
                Got It, Upload Real Resume
              </button>
            </div>
          </div>
        </Modal>

        {/* Gemini API Key Configuration Modal */}
        <Modal
          isOpen={showApiKeyModal}
          onClose={() => setShowApiKeyModal(false)}
          title="Gemini API Key Integration"
        >
          <div className="space-y-4">
            <p className="text-xs text-slate-500 leading-relaxed">
              Enter your Google Gemini API key to enable direct, deep AI document extraction, OCR parsing for images/PDFs, and live semantic ATS scoring.
            </p>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Google Gemini API Key</label>
              <input
                type="password"
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full p-3 rounded-xl border border-slate-200 text-xs font-mono focus:outline-none focus:border-indigo-600"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Key is saved securely in your browser's local storage.</span>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              {geminiApiKey && (
                <button
                  onClick={() => {
                    updateGeminiApiKey('');
                    setApiKeyInput('');
                    setShowApiKeyModal(false);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50"
                >
                  Clear Key
                </button>
              )}
              <button
                onClick={handleSaveApiKey}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md"
              >
                Save API Key
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </Sidebar>
  );
};

export default UploadResumePage;
