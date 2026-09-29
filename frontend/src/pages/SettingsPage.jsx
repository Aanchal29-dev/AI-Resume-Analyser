// src/pages/SettingsPage.jsx
import React, { useState } from 'react';
import Sidebar from '../components/common/Sidebar';
import { useApp } from '../context/AppContext';
import { Settings, Database, Server, Cpu, ShieldCheck, KeyRound, Check, Sparkles, AlertCircle } from 'lucide-react';

const SettingsPage = () => {
  const { geminiApiKey, updateGeminiApiKey } = useApp();
  const [apiKeyInput, setApiKeyInput] = useState(geminiApiKey || '');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveKey = (e) => {
    e.preventDefault();
    updateGeminiApiKey(apiKeyInput.trim());
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <Sidebar>
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">System Settings & AI API Integration</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Configure live Gemini API keys for resume deep-parsing, ATS compatibility auditing, and AI career recommendations.
          </p>
        </div>

        {/* Gemini API Key Configuration Box */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-soft space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Google Gemini AI Engine Configuration</h3>
                <p className="text-xs text-slate-500">Provide a Gemini API key to activate multimodal parsing and strict resume verification</p>
              </div>
            </div>

            <span className={`text-[11px] font-bold px-3 py-1 rounded-full ${
              geminiApiKey ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
            }`}>
              {geminiApiKey ? '● Live AI Connected' : '● Built-in Heuristic Mode'}
            </span>
          </div>

          <form onSubmit={handleSaveKey} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Gemini API Key</label>
              <div className="flex gap-2">
                <input
                  type="password"
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  placeholder="AIzaSy..."
                  className="flex-1 p-2.5 rounded-xl border border-slate-200 text-xs font-mono focus:outline-none focus:border-indigo-600"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all shrink-0"
                >
                  Save Key
                </button>
                {geminiApiKey && (
                  <button
                    type="button"
                    onClick={() => {
                      updateGeminiApiKey('');
                      setApiKeyInput('');
                      setSaveSuccess(true);
                      setTimeout(() => setSaveSuccess(false), 3000);
                    }}
                    className="px-3.5 py-2.5 rounded-xl border border-slate-200 hover:bg-rose-50 hover:text-rose-600 text-slate-600 font-bold text-xs transition-colors"
                  >
                    Clear
                  </button>
                )}
              </div>
              {saveSuccess && (
                <p className="text-xs text-emerald-600 font-bold mt-2 flex items-center gap-1 animate-in fade-in duration-200">
                  <Check className="w-4 h-4" /> API configuration updated successfully!
                </p>
              )}
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl text-xs text-slate-600 border border-slate-200/80 space-y-1">
              <span className="font-bold text-slate-800 block">How Validation Works:</span>
              <p className="text-[11px] text-slate-500">
                • <strong>When Gemini API Key is saved:</strong> Files (images, PDFs, text) are processed directly by Gemini 1.5/2.0 Flash with prompt rules to reject any non-resume/non-career documents with an alert.<br />
                • <strong>When API Key is blank:</strong> The built-in ATS heuristic engine analyzes career indicators (contact, job titles, education, action verbs, skills). Non-resume files are strictly rejected with an alert.
              </p>
            </div>
          </form>
        </div>

        {/* Database Entities Readiness Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-soft space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Target Relational Database Entities (MySQL Schema)</h3>
              <p className="text-xs text-slate-500">Frontend state objects map 1:1 with these backend database models</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 font-mono text-indigo-900 font-bold">Users</div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 font-mono text-indigo-900 font-bold">Resumes</div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 font-mono text-indigo-900 font-bold">Job_Descriptions</div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 font-mono text-indigo-900 font-bold">Analyses</div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 font-mono text-indigo-900 font-bold">Analysis_Skills</div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 font-mono text-indigo-900 font-bold">Career_Recommendations</div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 font-mono text-indigo-900 font-bold">Resume_Versions</div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 font-mono text-indigo-900 font-bold">Learning_Recommendations</div>
          </div>
        </div>

        {/* Proposed Architecture Diagram / Tech Stack Blueprint */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-soft space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Full-Stack Tech Architecture Plan</h3>
              <p className="text-xs text-slate-500">Decoupled API endpoints strategy for production rollout</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-1">
              <div className="font-bold text-indigo-700">Frontend Layer</div>
              <div className="text-slate-800 font-semibold">React + Vite + Tailwind CSS</div>
              <p className="text-slate-500 text-[11px]">Component-based responsive UI with React Context state engine.</p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-1">
              <div className="font-bold text-indigo-700">Backend API Layer</div>
              <div className="text-slate-800 font-semibold">FastAPI (Python 3.11)</div>
              <p className="text-slate-500 text-[11px]">Asynchronous REST endpoints for PDF extraction & database CRUD.</p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-1">
              <div className="font-bold text-indigo-700">Database Layer</div>
              <div className="text-slate-800 font-semibold">MySQL / MariaDB</div>
              <p className="text-slate-500 text-[11px]">Relational tables storing user profiles, resumes, and score versions.</p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-1">
              <div className="font-bold text-indigo-700">AI Intelligence Layer</div>
              <div className="text-slate-800 font-semibold">Google Gemini API</div>
              <p className="text-slate-500 text-[11px]">Generative bullet optimization, career questionnaire, and chat.</p>
            </div>
          </div>
        </div>
      </div>
    </Sidebar>
  );
};

export default SettingsPage;
