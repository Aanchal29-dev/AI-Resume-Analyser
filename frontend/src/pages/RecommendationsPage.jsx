// src/pages/RecommendationsPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import { useApp } from '../context/AppContext';
import { SAMPLE_JOB_ROLES } from '../data/mockData';
import { Sparkles, ArrowRight, Hammer, BookOpen, Star } from 'lucide-react';

const RecommendationsPage = () => {
  const navigate = useNavigate();
  const { handleSelectJobRole } = useApp();

  const suggestedRoles = SAMPLE_JOB_ROLES.slice(0, 5);

  return (
    <Sidebar>
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Resume-Based Career Alignment
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Role & Skill Recommendations</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Based on your parsed resume experience, here are suitable tech roles you are currently qualified for or close to matching.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {suggestedRoles.map((role, idx) => (
            <div key={role.id} className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-soft flex flex-col justify-between hover:border-indigo-300 transition-colors">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full">
                    {role.category}
                  </span>
                  <div className="flex items-center gap-1 text-xs font-bold text-emerald-600">
                    <Star className="w-3.5 h-3.5 fill-emerald-500 text-emerald-500" />
                    <span>{90 - idx * 5}% Match</span>
                  </div>
                </div>

                <h3 className="font-bold text-slate-900 text-lg">{role.title}</h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">{role.description}</p>

                <div className="mt-4 pt-3 border-t border-slate-100">
                  <span className="text-[11px] font-bold text-slate-700 block mb-1">Key Required Skills:</span>
                  <div className="flex flex-wrap gap-1">
                    {role.requiredSkills.slice(0, 4).map((sk, skIdx) => (
                      <span key={skIdx} className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px]">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100 flex flex-col gap-2">
                <button
                  onClick={() => {
                    handleSelectJobRole(role);
                    navigate('/job-matcher');
                  }}
                  className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs"
                >
                  Tailor Resume for Role
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Sidebar>
  );
};

export default RecommendationsPage;
