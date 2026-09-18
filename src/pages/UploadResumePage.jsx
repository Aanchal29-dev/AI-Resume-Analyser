// src/pages/UploadResumePage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import { useApp } from '../context/AppContext';
import { Upload, FileText, CheckCircle2, Trash2, ArrowRight, Sparkles, File, Clipboard } from 'lucide-react';

const UploadResumePage = () => {
  const navigate = useNavigate();
  const { uploadedFileName, uploadedFileSize, handleUploadResume, handleClearResume } = useApp();
  const [activeTab, setActiveTab] = useState('upload'); // 'upload' | 'paste'
  const [pastedText, setPastedText] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [isSimulatingUpload, setIsSimulatingUpload] = useState(false);

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

  const processFile = (file) => {
    setIsSimulatingUpload(true);
    setTimeout(() => {
      handleUploadResume(file);
      setIsSimulatingUpload(false);
    }, 800);
  };

  const handlePasteSubmit = () => {
    if (!pastedText.trim()) return;
    handleUploadResume(pastedText);
    navigate('/resume-overview');
  };

  return (
    <Sidebar>
      <div className="max-w-4xl mx-auto space-y-8 font-sans">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Resume Analyzer Engine
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Upload Your Resume</h1>
          <p className="text-sm text-slate-500 mt-1">
            Upload your resume file or image to evaluate ATS compatibility, formatting, and target job alignment.
          </p>
        </div>

        {/* Upload Mode Selector */}
        <div className="flex border-b border-slate-200">
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex items-center gap-2 px-5 py-3 font-semibold text-xs border-b-2 transition-colors ${
              activeTab === 'upload'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Upload className="w-4 h-4" /> Upload Document / Image File
          </button>
          <button
            onClick={() => setActiveTab('paste')}
            className={`flex items-center gap-2 px-5 py-3 font-semibold text-xs border-b-2 transition-colors ${
              activeTab === 'paste'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Clipboard className="w-4 h-4" /> Paste Resume Text
          </button>
        </div>

        {/* Tab 1: File Drag & Drop Upload (Accepts PDF, DOCX, DOC, TXT, PNG, JPG, JPEG) */}
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

              {isSimulatingUpload && (
                <div className="mt-4 text-xs font-semibold text-indigo-600 animate-pulse">
                  Extracting document sections and analyzing layout structure...
                </div>
              )}
            </div>

            {/* Active Selected File Card */}
            {uploadedFileName && !isSimulatingUpload && (
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-soft flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900">{uploadedFileName}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">Ready</span>
                    </div>
                    <span className="text-xs text-slate-400 mt-0.5 block">{uploadedFileSize || '245 KB'} • Selected File</span>
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
                onChange={(e) => setPastedText(e.target.value)}
                placeholder="Paste your contact info, summary, work experience, projects, and skills here..."
                className="w-full p-4 rounded-xl border border-slate-200 text-xs font-mono focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
            <div className="flex justify-end">
              <button
                onClick={handlePasteSubmit}
                disabled={!pastedText.trim()}
                className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-indigo-600 disabled:opacity-50 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all"
              >
                Analyze Text <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </Sidebar>
  );
};

export default UploadResumePage;
