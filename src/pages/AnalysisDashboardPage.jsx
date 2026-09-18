// src/pages/AnalysisDashboardPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import ScoreCard from '../components/common/ScoreCard';
import StatusBadge from '../components/common/StatusBadge';
import { useApp } from '../context/AppContext';
import {
  FileCheck2,
  Target,
  TrendingUp,
  Cpu,
  Layers,
  ArrowRight,
  Sparkles,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';

const AnalysisDashboardPage = () => {
  const navigate = useNavigate();
  const { analysis, targetRole, analysisType, uploadedFileName, handleRunRecheck } = useApp();
  const [isRechecking, setIsRechecking] = useState(false);

  const triggerRecheck = () => {
    setIsRechecking(true);
    setTimeout(() => {
      handleRunRecheck();
      setIsRechecking(false);
      navigate('/recheck');
    }, 1000);
  };

  return (
    <Sidebar>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" /> Analysis Report Dashboard
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Resume Analysis Report</h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Active File: <span className="font-bold text-slate-800">{uploadedFileName}</span> | Mode: <span className="font-bold text-indigo-600 uppercase">{analysisType}</span> | Role: <span className="font-bold text-slate-800">{targetRole.title}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={triggerRecheck}
              disabled={isRechecking}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs shadow-xs transition-all"
            >
              <RefreshCw className={`w-4 h-4 ${isRechecking ? 'animate-spin' : ''}`} /> Recheck Resume
            </button>
            <button
              onClick={() => navigate('/issues')}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all"
            >
              View Issues & Suggestions <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Prototype Honest Disclaimer */}
        <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 text-xs text-amber-900 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Illustrative Prototype Evaluation Data:</span> Scores are calculated based on parsed section density and simulated ATS matching. Scores do not guarantee job interview invitations.
          </div>
        </div>

        {/* Top Hero Score Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <ScoreCard
            title="Overall Resume Score"
            score={analysis.overallScore}
            maxScore={100}
            subtitle={`Status: ${analysis.status}`}
            status={analysis.overallScore >= 80 ? 'Good' : 'Needs Tailoring'}
            color={analysis.overallScore >= 80 ? 'emerald' : 'indigo'}
            icon={TrendingUp}
          />
          <ScoreCard
            title="Estimated ATS Compatibility"
            score={analysis.atsCompatibility}
            maxScore={100}
            subtitle="Structure, Fonts & Layout compliance"
            status="Passed"
            color="emerald"
            icon={Cpu}
          />
          <ScoreCard
            title="Target Job Match"
            score={analysis.jobMatchScore}
            maxScore={100}
            subtitle={`Compared against ${targetRole.title}`}
            status="Tailoring Needed"
            color="amber"
            icon={Target}
          />
        </div>

        {/* 7 Category Cards Breakdown Grid */}
        <div>
          <h2 className="text-lg font-bold text-slate-900 mb-4">Detailed Category Evaluation</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {analysis.categories.map((cat) => (
              <div key={cat.id} className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-soft hover:border-indigo-300 transition-colors flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-slate-800 text-sm">{cat.name}</h3>
                    <StatusBadge status={cat.status} size="xs" />
                  </div>

                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-2xl font-extrabold text-slate-900">{cat.score}</span>
                    <span className="text-xs text-slate-400">/100</span>
                  </div>

                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-3">
                    <div
                      className={`h-full transition-all duration-500 ${
                        cat.score >= 80 ? 'bg-emerald-500' : cat.score >= 70 ? 'bg-amber-500' : 'bg-rose-500'
                      }`}
                      style={{ width: `${cat.score}%` }}
                    />
                  </div>

                  <p className="text-xs text-slate-500 leading-relaxed">{cat.summary}</p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={() => navigate('/issues')}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                  >
                    View Details <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Action Navigation CTAs */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-soft flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Ready to fix critical resume issues?</h3>
            <p className="text-xs text-slate-500 mt-1">Review categorized suggestions and use side-by-side AI bullet rewrites.</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/corrections')}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
            >
              Open AI Correction Suite <Sparkles className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </Sidebar>
  );
};

export default AnalysisDashboardPage;
