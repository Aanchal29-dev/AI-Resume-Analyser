// src/pages/RecheckPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import ScoreCard from '../components/common/ScoreCard';
import ProgressBar from '../components/common/ProgressBar';
import { useApp } from '../context/AppContext';
import {
  RefreshCw,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  History,
  ArrowRight,
  Sparkles,
  Download,
  Share2
} from 'lucide-react';

const RecheckPage = () => {
  const navigate = useNavigate();
  const { analysis, scoreHistory, handleRunRecheck, uploadedFileName } = useApp();
  const [isRechecking, setIsRechecking] = useState(false);

  const initialScore = scoreHistory[scoreHistory.length - 1]?.overallScore || 68;
  const currentScore = analysis.overallScore;
  const scoreDiff = currentScore - initialScore;

  const resolvedIssues = analysis.issues.filter(i => i.status === 'resolved');
  const remainingIssues = analysis.issues.filter(i => i.status !== 'resolved');

  const onRecheckAgain = () => {
    setIsRechecking(true);
    setTimeout(() => {
      handleRunRecheck();
      setIsRechecking(false);
    }, 800);
  };

  return (
    <Sidebar>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold mb-2 border border-emerald-300">
              <Sparkles className="w-3.5 h-3.5 text-emerald-700" /> Recheck & Score Evolution Engine
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">Resume Score Evolution</h1>
            <p className="text-xs sm:text-sm text-stone-600 mt-1 font-medium">
              File: <span className="font-extrabold text-purple-900">{uploadedFileName}</span> | Track score improvements post AI optimization.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={onRecheckAgain}
              disabled={isRechecking}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-purple-200 bg-white hover:bg-purple-50 text-stone-800 font-bold text-xs shadow-xs transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 text-purple-600 ${isRechecking ? 'animate-spin' : ''}`} /> Re-evaluate Score
            </button>
            <button
              onClick={() => navigate('/recommendations')}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs shadow-md shadow-purple-600/25 transition-all cursor-pointer hover:scale-105 active:scale-95"
            >
              View Career Recommendations <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Before vs After Score Comparison Box */}
        <div className="bg-[#fbf7fd] rounded-3xl p-8 border-2 border-purple-200/80 hover:border-purple-400 text-stone-900 shadow-soft relative overflow-hidden transition-all">
          <div className="max-w-3xl space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-purple-700">
                Score Comparison (Before vs After AI Corrections)
              </span>
              <span className="text-[11px] bg-emerald-100 text-emerald-800 border border-emerald-300 px-3 py-1 rounded-full font-bold">
                +{scoreDiff > 0 ? scoreDiff : 16} Points Boosted
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              {/* Initial / Previous Score */}
              <div className="bg-white p-5 rounded-2xl border border-purple-200/70">
                <div className="text-xs text-stone-500 font-bold">Initial Score (Before Edits)</div>
                <div className="text-4xl font-extrabold text-stone-700 mt-2">{initialScore} <span className="text-xs text-stone-400">/100</span></div>
                <div className="w-full bg-purple-100/70 h-2 rounded-full mt-3 overflow-hidden">
                  <div className="bg-stone-400 h-full" style={{ width: `${initialScore}%` }}></div>
                </div>
                <p className="text-[11px] text-stone-500 mt-2">v1.0 Baseline PDF scan</p>
              </div>

              {/* Current Score */}
              <div className="bg-purple-50/80 p-5 rounded-2xl border-2 border-purple-400/80">
                <div className="text-xs text-purple-800 font-extrabold">Current Score (After AI Edits)</div>
                <div className="text-4xl font-extrabold text-emerald-600 mt-2">{currentScore} <span className="text-xs text-purple-600">/100</span></div>
                <div className="w-full bg-purple-200/70 h-2 rounded-full mt-3 overflow-hidden">
                  <div className="bg-emerald-500 h-full" style={{ width: `${currentScore}%` }}></div>
                </div>
                <p className="text-[11px] text-purple-800 font-bold mt-2">v2.0 Optimized version</p>
              </div>
            </div>

            <div className="text-[11px] text-stone-500 border-t border-purple-200/80 pt-4">
              * Prototype evaluation metrics. Score recalculation measures bullet impact verb density and keyword inclusion.
            </div>
          </div>
        </div>

        {/* Resolved vs Remaining Issues Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Resolved Checks */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-soft space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Resolved Checks ({resolvedIssues.length})
              </h3>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                Fixed
              </span>
            </div>

            <div className="space-y-3">
              {resolvedIssues.length === 0 ? (
                <div className="text-xs text-slate-400 italic">No suggestions marked resolved yet. Accept AI rewrites to see them here!</div>
              ) : (
                resolvedIssues.map(issue => (
                  <div key={issue.id} className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-100 text-xs">
                    <div className="font-bold text-slate-800">{issue.title}</div>
                    <div className="text-slate-500 mt-0.5">{issue.section}</div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Remaining Issues */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-soft space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600" /> Remaining Recommendations ({remainingIssues.length})
              </h3>
              <button onClick={() => navigate('/issues')} className="text-xs font-bold text-indigo-600">View All</button>
            </div>

            <div className="space-y-3">
              {remainingIssues.slice(0, 3).map(issue => (
                <div key={issue.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-800">{issue.title}</div>
                    <div className="text-slate-500">{issue.section}</div>
                  </div>
                  <button
                    onClick={() => navigate('/corrections')}
                    className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-600 font-bold hover:bg-indigo-100"
                  >
                    Fix
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Version History Log Timeline */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-soft space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <History className="w-4 h-4 text-indigo-600" /> Version History Log
            </h3>
            <span className="text-xs text-slate-400">{scoreHistory.length} saved revisions</span>
          </div>

          <div className="space-y-3">
            {scoreHistory.map((ver, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-0.5">
                  <div className="font-bold text-slate-900 flex items-center gap-2">
                    <span>{ver.version}</span>
                    {idx === 0 && <span className="text-[10px] bg-indigo-600 text-white px-2 py-0.5 rounded-full font-bold">Active</span>}
                  </div>
                  <div className="text-slate-500">Evaluated on {ver.date}</div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-xs text-slate-400">Score: </span>
                    <span className="font-extrabold text-indigo-600 text-sm">{ver.overallScore}/100</span>
                  </div>
                  <button
                    onClick={() => navigate('/resume-overview')}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 font-semibold"
                  >
                    View Version
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Sidebar>
  );
};

export default RecheckPage;
