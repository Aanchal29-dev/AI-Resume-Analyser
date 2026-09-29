// src/pages/HistoryPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import { useApp } from '../context/AppContext';
import { History, Trash2, Eye, FileText, ArrowRight } from 'lucide-react';

const HistoryPage = () => {
  const navigate = useNavigate();
  const { historyItems, handleDeleteHistoryItem } = useApp();

  return (
    <Sidebar>
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Analysis History</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">View, inspect, or delete previous resume analysis reports.</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-soft overflow-hidden">
          {historyItems.length === 0 ? (
            <div className="p-12 text-center text-slate-400 space-y-3">
              <History className="w-10 h-10 mx-auto text-slate-300" />
              <p className="text-sm">No past analyses yet. Upload a resume to get started!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold">
                    <th className="p-4">Resume File</th>
                    <th className="p-4">Target Job Role</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Overall Score</th>
                    <th className="p-4">ATS Compatibility</th>
                    <th className="p-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {historyItems.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-4 font-bold text-slate-900 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-indigo-600" /> {item.fileName}
                      </td>
                      <td className="p-4 text-slate-700 font-medium">{item.jobRole}</td>
                      <td className="p-4 text-slate-500">{item.date}</td>
                      <td className="p-4 font-extrabold text-indigo-600 text-sm">{item.overallScore}/100</td>
                      <td className="p-4 font-bold text-emerald-600">{item.atsScore}%</td>
                      <td className="p-4 flex items-center gap-2">
                        <button
                          onClick={() => navigate('/analysis')}
                          className="px-3 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-semibold flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" /> View Report
                        </button>
                        <button
                          onClick={() => handleDeleteHistoryItem(item.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                          title="Delete History Item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Sidebar>
  );
};

export default HistoryPage;
