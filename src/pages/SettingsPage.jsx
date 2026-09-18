// src/pages/SettingsPage.jsx
import React from 'react';
import Sidebar from '../components/common/Sidebar';
import { Settings, Database, Server, Cpu, ShieldCheck, Layers } from 'lucide-react';

const SettingsPage = () => {
  return (
    <Sidebar>
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">System Settings & Architecture Blueprint</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Phase 2 Frontend Prototype architecture overview and integration blueprint for FastAPI, MySQL, and Gemini API.
          </p>
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
