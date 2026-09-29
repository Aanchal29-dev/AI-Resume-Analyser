// src/pages/AICorrectionPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import { useApp } from '../context/AppContext';
import { generateBulletOptimizationWithGemini } from '../services/geminiService';
import {
  Sparkles,
  Check,
  Edit3,
  X,
  ArrowRight,
  RefreshCw,
  AlertTriangle,
  RotateCcw,
  Save,
  CheckCircle2,
  Wand2
} from 'lucide-react';

const AICorrectionPage = () => {
  const navigate = useNavigate();
  const { analysis, targetRole, handleAcceptSuggestion, handleRunRecheck } = useApp();
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [ignoredIds, setIgnoredIds] = useState([]);
  const [mobileToggle, setMobileToggle] = useState({}); // { [issueId]: 'original' | 'suggested' }
  const [generatingId, setGeneratingId] = useState(null);
  const [customSuggestions, setCustomSuggestions] = useState({}); // { [issueId]: string }

  const pendingIssues = analysis.issues.filter(i => i.severity !== 'Passed');

  const handleStartEdit = (issue) => {
    setEditingId(issue.id);
    setEditText(customSuggestions[issue.id] || issue.aiSuggestion || issue.originalText);
  };

  const handleSaveEdit = (issueId) => {
    handleAcceptSuggestion(issueId);
    setEditingId(null);
  };

  const handleIgnore = (issueId) => {
    setIgnoredIds(prev => [...prev, issueId]);
  };

  const toggleMobileView = (issueId, mode) => {
    setMobileToggle(prev => ({ ...prev, [issueId]: mode }));
  };

  const handleRegenerateWithGemini = async (issue) => {
    setGeneratingId(issue.id);
    try {
      const res = await generateBulletOptimizationWithGemini(
        issue.originalText || issue.title,
        targetRole?.title || 'Software Developer'
      );
      if (res?.improvedBullet) {
        setCustomSuggestions(prev => ({
          ...prev,
          [issue.id]: res.improvedBullet
        }));
      }
    } catch (err) {
      console.warn('Gemini bullet regeneration fallback:', err);
    } finally {
      setGeneratingId(null);
    }
  };

  return (
    <Sidebar>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" /> Gemini AI Content Optimization Engine
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">AI Resume Corrections</h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Compare original bullet points side-by-side with Gemini AI rewrites. Accept suggestions to boost your ATS compatibility score.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/analysis')}
              className="px-4 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs"
            >
              Back to Report
            </button>
            <button
              onClick={() => { handleRunRecheck(); navigate('/recheck'); }}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all"
            >
              Save & Continue to Recheck <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Responsible AI Warning Banner */}
        <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Responsible AI Policy:</span> Review all AI-generated suggestions carefully. Ensure that generated metrics and action statements accurately reflect your genuine experience. Do not fabricate accomplishments.
          </div>
        </div>

        {/* Side-by-side Correction Cards */}
        <div className="space-y-6">
          {pendingIssues.map((issue) => {
            const isIgnored = ignoredIds.includes(issue.id);
            const isResolved = issue.status === 'resolved';
            const activeMobileTab = mobileToggle[issue.id] || 'suggested';
            const currentSuggestion = customSuggestions[issue.id] || issue.aiSuggestion;
            const isGenerating = generatingId === issue.id;

            if (isIgnored) return null;

            return (
              <div
                key={issue.id}
                className={`bg-white rounded-2xl border shadow-soft p-6 transition-all ${
                  isResolved ? 'border-emerald-300 bg-emerald-50/10' : 'border-slate-200'
                }`}
              >
                {/* Header info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 mb-4">
                  <div>
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-600 block">
                      Section: {issue.section}
                    </span>
                    <h3 className="font-bold text-slate-900 text-base mt-0.5">{issue.title}</h3>
                  </div>

                  {/* Mobile toggle button bar */}
                  <div className="flex md:hidden items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                    <button
                      onClick={() => toggleMobileView(issue.id, 'original')}
                      className={`px-3 py-1 rounded-lg ${activeMobileTab === 'original' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-500'}`}
                    >
                      Original
                    </button>
                    <button
                      onClick={() => toggleMobileView(issue.id, 'suggested')}
                      className={`px-3 py-1 rounded-lg ${activeMobileTab === 'suggested' ? 'bg-indigo-600 text-white' : 'text-slate-500'}`}
                    >
                      AI Suggestion
                    </button>
                  </div>
                </div>

                {/* Main Side-by-side Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left: Original Version */}
                  <div className={`p-4 rounded-xl border border-slate-200 bg-slate-50 ${
                    activeMobileTab === 'original' ? 'block' : 'hidden md:block'
                  }`}>
                    <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                      <span>Original Content</span>
                      <span className="text-[10px] bg-slate-200 px-2 py-0.5 rounded text-slate-600">Current</span>
                    </div>
                    <p className="text-xs text-slate-800 font-mono leading-relaxed bg-white p-3 rounded-lg border border-slate-200/80">
                      "{issue.originalText}"
                    </p>
                  </div>

                  {/* Right: AI Suggestion */}
                  <div className={`p-4 rounded-xl border border-indigo-200 bg-indigo-50/40 ${
                    activeMobileTab === 'suggested' ? 'block' : 'hidden md:block'
                  }`}>
                    <div className="flex items-center justify-between text-xs font-bold text-indigo-700 uppercase tracking-wider mb-2">
                      <span className="flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> Gemini Quantified Bullet
                      </span>
                      {isResolved && <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">Accepted</span>}
                    </div>

                    {editingId === issue.id ? (
                      <div className="space-y-2">
                        <textarea
                          rows={3}
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          className="w-full p-3 rounded-lg border border-indigo-300 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-200 bg-white"
                        />
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setEditingId(null)}
                            className="px-3 py-1 rounded text-xs font-semibold text-slate-500 hover:bg-slate-200"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleSaveEdit(issue.id)}
                            className="px-3 py-1 rounded bg-indigo-600 text-white text-xs font-semibold shadow-xs"
                          >
                            Save Edit
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-indigo-950 font-medium leading-relaxed bg-white p-3 rounded-lg border border-indigo-100">
                        "{currentSuggestion}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Explanation Note & Actions */}
                <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <p>💡 <span className="font-semibold text-slate-700">Improvement Rationale:</span> {issue.suggestedAction}</p>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleRegenerateWithGemini(issue)}
                      disabled={isGenerating || isResolved}
                      className="px-3 py-1.5 rounded-lg border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
                      title="Generate fresh rewrite with Gemini AI"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
                      {isGenerating ? 'Rewriting...' : 'Gemini AI Rewrite'}
                    </button>
                    <button
                      onClick={() => handleIgnore(issue.id)}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 text-xs font-semibold"
                    >
                      Ignore
                    </button>
                    <button
                      onClick={() => handleStartEdit(issue)}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-semibold flex items-center gap-1"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Edit
                    </button>
                    <button
                      onClick={() => handleAcceptSuggestion(issue.id)}
                      disabled={isResolved}
                      className={`px-4 py-1.5 rounded-xl font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 ${
                        isResolved
                          ? 'bg-emerald-600 text-white cursor-default'
                          : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                      }`}
                    >
                      <Check className="w-4 h-4" /> {isResolved ? 'Accepted' : 'Accept Suggestion'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Sidebar>
  );
};

export default AICorrectionPage;
