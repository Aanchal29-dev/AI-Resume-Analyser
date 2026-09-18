// src/pages/ProblemsSuggestionsPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import StatusBadge from '../components/common/StatusBadge';
import Modal from '../components/common/Modal';
import ResumePreview from '../components/common/ResumePreview';
import { useApp } from '../context/AppContext';
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Eye,
  Check,
  ArrowRight,
  Filter
} from 'lucide-react';

const ProblemsSuggestionsPage = () => {
  const navigate = useNavigate();
  const { analysis, handleAcceptSuggestion, resumeData } = useApp();
  const [activeTab, setActiveTab] = useState('All'); // 'All' | 'Fix First' | 'Important' | 'Recommended' | 'Passed'
  const [selectedIssueForModal, setSelectedIssueForModal] = useState(null);

  const filterTabs = ['All', 'Fix First', 'Important', 'Recommended', 'Passed'];

  const filteredIssues = activeTab === 'All'
    ? analysis.issues
    : analysis.issues.filter(i => i.severity === activeTab);

  const getSeverityIcon = (sev) => {
    switch (sev) {
      case 'Fix First':
        return <AlertCircle className="w-5 h-5 text-rose-600" />;
      case 'Important':
        return <AlertTriangle className="w-5 h-5 text-amber-600" />;
      case 'Recommended':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'Passed':
      default:
        return <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
    }
  };

  return (
    <Sidebar>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" /> Actionable Resume Audit
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Problems & Suggestions</h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Issues grouped by priority tier. Resolve critical items first to boost ATS compatibility.
            </p>
          </div>

          <button
            onClick={() => navigate('/corrections')}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all shrink-0"
          >
            Launch AI Correction Editor <Sparkles className="w-4 h-4" />
          </button>
        </div>

        {/* Filter Tabs Bar */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
          {filterTabs.map(tab => {
            const count = tab === 'All'
              ? analysis.issues.length
              : analysis.issues.filter(i => i.severity === tab).length;

            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === tab
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span>{tab}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                  activeTab === tab ? 'bg-indigo-700 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Issue Cards Stack */}
        <div className="space-y-4">
          {filteredIssues.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-400 text-sm">
              No issues found in this category filter.
            </div>
          ) : (
            filteredIssues.map(issue => (
              <div
                key={issue.id}
                className={`bg-white rounded-2xl p-6 border shadow-soft transition-all ${
                  issue.status === 'resolved' ? 'border-emerald-200 bg-emerald-50/20' : 'border-slate-200/80 hover:border-slate-300'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-3">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 shrink-0">
                      {getSeverityIcon(issue.severity)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-slate-900 text-base">{issue.title}</h3>
                        <StatusBadge status={issue.severity} size="xs" />
                        {issue.status === 'resolved' && (
                          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                            Resolved
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-indigo-600 font-semibold mt-0.5">Section: {issue.section}</p>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed mb-4">{issue.explanation}</p>

                {/* Why It Matters & Suggested Action Box */}
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/60 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs mb-4">
                  <div>
                    <span className="font-bold text-slate-800 block mb-1">Why It Matters:</span>
                    <p className="text-slate-600">{issue.whyItMatters}</p>
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 block mb-1">Suggested Action:</span>
                    <p className="text-slate-600">{issue.suggestedAction}</p>
                  </div>
                </div>

                {/* Original vs AI Suggestion Snippet */}
                {issue.originalText && issue.aiSuggestion && (
                  <div className="bg-indigo-50/40 rounded-xl p-3 border border-indigo-100 text-xs space-y-1.5 mb-4">
                    <div className="text-[11px] font-bold text-slate-500 uppercase">Original Text:</div>
                    <div className="text-slate-700 font-mono bg-white p-2 rounded border border-slate-200">{issue.originalText}</div>
                    <div className="text-[11px] font-bold text-indigo-600 uppercase pt-1">AI Suggestion:</div>
                    <div className="text-indigo-950 font-medium bg-indigo-50 p-2 rounded border border-indigo-200">{issue.aiSuggestion}</div>
                  </div>
                )}

                {/* Card Actions */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedIssueForModal(issue)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-semibold"
                    >
                      <Eye className="w-3.5 h-3.5" /> View in Resume
                    </button>
                    <button
                      onClick={() => handleAcceptSuggestion(issue.id)}
                      disabled={issue.status === 'resolved'}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold ${
                        issue.status === 'resolved'
                          ? 'bg-emerald-100 text-emerald-800 cursor-default'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" /> {issue.status === 'resolved' ? 'Reviewed' : 'Mark as Reviewed'}
                    </button>
                  </div>

                  {issue.severity !== 'Passed' && (
                    <button
                      onClick={() => navigate('/corrections')}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs"
                    >
                      Fix with AI <Sparkles className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* View in Resume Context Modal */}
        <Modal
          isOpen={!!selectedIssueForModal}
          onClose={() => setSelectedIssueForModal(null)}
          title={`Resume Context: ${selectedIssueForModal?.title || ''}`}
          maxWidth="max-w-4xl"
        >
          <div className="space-y-4">
            <div className="bg-indigo-50 p-3 rounded-xl text-xs text-indigo-900 border border-indigo-200">
              <span className="font-bold">Affected Section:</span> {selectedIssueForModal?.section}
            </div>
            <ResumePreview resume={resumeData} showPrint={false} />
          </div>
        </Modal>
      </div>
    </Sidebar>
  );
};

export default ProblemsSuggestionsPage;
