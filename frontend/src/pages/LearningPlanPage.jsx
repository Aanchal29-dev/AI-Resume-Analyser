// src/pages/LearningPlanPage.jsx
import React from 'react';
import Sidebar from '../components/common/Sidebar';
import { useApp } from '../context/AppContext';
import { GraduationCap, BookOpen, ExternalLink, CheckCircle2, Clock, Sparkles } from 'lucide-react';

const LearningPlanPage = () => {
  const { learningPlan, handleToggleResourceStatus, targetRole } = useApp();

  return (
    <Sidebar>
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Personalized Skill Roadmap
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Personalized Learning Plan</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Curated resources to close your skill gaps for <span className="font-bold text-slate-800">{targetRole.title}</span>.
          </p>
        </div>

        {/* Skill Cards */}
        <div className="space-y-6">
          {learningPlan.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-soft space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-900 text-base">{item.skill}</h3>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-800">{item.level}</span>
                    </div>
                    <span className="text-xs text-slate-500">Est. Time: {item.estHours} • Priority: {item.priority}</span>
                  </div>
                </div>

                {/* Status selector */}
                <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                  {['To Learn', 'In Progress', 'Mastered'].map((st) => (
                    <button
                      key={st}
                      onClick={() => handleToggleResourceStatus(item.id, st)}
                      className={`px-3 py-1 rounded-lg transition-colors ${
                        item.status === st ? 'bg-white text-indigo-600 shadow-xs font-bold' : 'text-slate-500'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Resource cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {item.resources.map((res, resIdx) => (
                  <div key={resIdx} className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/60 text-xs flex flex-col justify-between">
                    <div>
                      <div className="font-bold text-slate-900 leading-snug">{res.name}</div>
                      <div className="text-[11px] text-slate-500 mt-1">{res.provider} • {res.type}</div>
                    </div>
                    <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-200/60">
                      <span className="text-[10px] font-bold text-emerald-600">{res.free ? 'Free Resource' : 'Paid Course'}</span>
                      <a
                        href="#"
                        onClick={(e) => { e.preventDefault(); alert(`Opening course resource: ${res.name}`); }}
                        className="text-indigo-600 font-bold hover:underline flex items-center gap-1 text-[11px]"
                      >
                        Open <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Sidebar>
  );
};

export default LearningPlanPage;
