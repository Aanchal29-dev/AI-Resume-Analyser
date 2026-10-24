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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-900 text-xs font-bold mb-2 border border-purple-200">
              <Sparkles className="w-3.5 h-3.5 text-purple-600" /> Analysis Report Dashboard
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">Resume Analysis Report</h1>
            <p className="text-xs sm:text-sm text-stone-600 mt-1 font-medium">
              Active File: <span className="font-extrabold text-purple-900">{uploadedFileName}</span> | Mode: <span className="font-extrabold text-purple-700 uppercase">{analysisType}</span> | Role: <span className="font-extrabold text-stone-900">{targetRole?.title || 'Selected Role'}</span>
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={triggerRecheck}
              disabled={isRechecking}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-purple-200 bg-white hover:bg-purple-50 text-stone-800 font-bold text-xs shadow-xs transition-all cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 text-purple-600 ${isRechecking ? 'animate-spin' : ''}`} /> Recheck Resume
            </button>
            <button
              onClick={() => navigate('/issues')}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs shadow-md shadow-purple-600/25 transition-all cursor-pointer hover:scale-105 active:scale-95"
            >
              View Issues & Suggestions <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Prototype Honest Disclaimer */}
        <div className="bg-amber-50/90 border border-amber-300 rounded-2xl p-4 text-xs text-amber-950 flex items-start gap-3 shadow-2xs">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="font-medium">
            <strong className="font-bold text-amber-950">ATS Evaluation Data:</strong> Scores are calculated based on parsed section density, structural formatting, and simulated keyword matching.
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
            color={analysis.overallScore >= 80 ? 'emerald' : 'purple'}
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
            subtitle={`Compared against ${targetRole?.title || 'Target Role'}`}
            status="Tailoring Needed"
            color="amber"
            icon={Target}
          />
        </div>

        {/* 7 Category Cards Breakdown Grid */}
        <div>
          <h2 className="text-lg font-extrabold text-stone-900 mb-4 tracking-tight">Detailed Category Evaluation</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {analysis.categories.map((cat) => (
              <div key={cat.id} className="bg-white rounded-2xl p-5 border border-purple-200/90 shadow-soft hover:border-purple-400 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-extrabold text-stone-900 text-sm">{cat.name}</h3>
                    <StatusBadge status={cat.status} size="xs" />
                  </div>

                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-2xl font-black text-stone-900">{cat.score}</span>
                    <span className="text-xs text-stone-500 font-bold">/100</span>
                  </div>

                  <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden mb-3">
                    <div
                      className={`h-full transition-all duration-500 ${
                        cat.score >= 80 ? 'bg-emerald-500' : cat.score >= 70 ? 'bg-amber-500' : 'bg-rose-500'
                      }`}
                      style={{ width: `${cat.score}%` }}
                    />
                  </div>

                  <p className="text-xs text-stone-700 leading-relaxed font-medium">{cat.summary}</p>
                </div>

                <div className="pt-4 mt-4 border-t border-purple-100 flex justify-end">
                  <button
                    onClick={() => navigate('/issues')}
                    className="text-xs font-bold text-purple-700 hover:text-purple-950 flex items-center gap-1 cursor-pointer"
                  >
                    View Details <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Action Navigation CTAs */}
        <div className="bg-[#fbf7fd] rounded-2xl p-6 border border-purple-200/90 shadow-soft flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-extrabold text-stone-900 text-base">Ready to fix critical resume issues?</h3>
            <p className="text-xs text-stone-600 mt-1 font-medium">Review categorized suggestions and use side-by-side AI bullet rewrites.</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/corrections')}
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs shadow-md shadow-purple-600/25 transition-all flex items-center gap-1.5 cursor-pointer hover:scale-105 active:scale-95"
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
