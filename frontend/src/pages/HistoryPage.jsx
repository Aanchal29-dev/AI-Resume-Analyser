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
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">Analysis History</h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1 font-medium">View, inspect, or delete previous resume analysis reports.</p>
        </div>

        <div className="bg-white rounded-2xl border border-purple-200/90 shadow-soft overflow-hidden">
          {historyItems.length === 0 ? (
            <div className="p-12 text-center text-stone-500 space-y-3">
              <History className="w-10 h-10 mx-auto text-stone-400" />
              <p className="text-sm font-medium">No past analyses yet. Upload a resume to get started!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#fbf7fd] border-b border-purple-200 text-stone-800 uppercase tracking-wider font-extrabold">
                    <th className="p-4">Resume File</th>
                    <th className="p-4">Target Job Role</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Overall Score</th>
                    <th className="p-4">ATS Compatibility</th>
                    <th className="p-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-100">
                  {historyItems.map((item) => (
                    <tr key={item.id} className="hover:bg-purple-50/50 transition-colors">
                      <td className="p-4 font-bold text-stone-900 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-purple-700" /> {item.fileName}
                      </td>
                      <td className="p-4 text-stone-800 font-semibold">{item.jobRole}</td>
                      <td className="p-4 text-stone-600 font-medium">{item.date}</td>
                      <td className="p-4 font-black text-purple-700 text-sm">{item.overallScore}/100</td>
                      <td className="p-4 font-extrabold text-emerald-700">{item.atsScore}%</td>
                      <td className="p-4 flex items-center gap-2">
                        <button
                          onClick={() => navigate('/analysis')}
                          className="px-3 py-1.5 rounded-lg border border-purple-200 bg-white hover:bg-purple-50 text-stone-800 font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                        >
                          <Eye className="w-3.5 h-3.5 text-purple-600" /> View Report
                        </button>
                        <button
                          onClick={() => handleDeleteHistoryItem(item.id)}
                          className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer transition-colors"
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
