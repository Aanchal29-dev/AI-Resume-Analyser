// src/pages/CareerResultsPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import { useApp } from '../context/AppContext';
import { SAMPLE_JOB_ROLES } from '../data/mockData';
import { Compass, Sparkles, CheckCircle2, ArrowRight, Hammer, BookOpen, Star } from 'lucide-react';

const CareerResultsPage = () => {
  const navigate = useNavigate();
  const { userProfile, handleSelectJobRole } = useApp();

  const activeIndustryKey = (userProfile.targetIndustry || '').toLowerCase();
  let matchedRoles = SAMPLE_JOB_ROLES.slice(0, 3);

  if (activeIndustryKey.includes('lit') || activeIndustryKey.includes('pub') || activeIndustryKey.includes('write') || activeIndustryKey.includes('art')) {
    matchedRoles = SAMPLE_JOB_ROLES.filter(r => r.category.includes('Literature') || r.id === 'tech-writer' || r.id === 'content-strategist' || r.id === 'ux-writer');
  } else if (activeIndustryKey.includes('bus') || activeIndustryKey.includes('fin') || activeIndustryKey.includes('mark')) {
    matchedRoles = SAMPLE_JOB_ROLES.filter(r => r.id === 'data-analyst' || r.id === 'content-strategist');
  }

  return (
    <Sidebar>
      <div className="max-w-6xl mx-auto space-y-8 font-sans">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Career Role Alignment Matrix
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Recommended Career Paths</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Based on your answers and selected industry (<span className="font-bold text-slate-800">{userProfile.targetIndustry || 'Software & Technology'}</span>), these roles best match your profile.
          </p>
        </div>

        {/* Roles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {matchedRoles.map((role, idx) => (
            <div key={role.id} className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-soft flex flex-col justify-between hover:border-indigo-300 transition-colors">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full">
                    {role.category}
                  </span>
                  <div className="flex items-center gap-1 text-xs font-bold text-emerald-600">
                    <Star className="w-3.5 h-3.5 fill-emerald-500 text-emerald-500" />
                    <span>{94 - idx * 4}% Match</span>
                  </div>
                </div>

                <h3 className="font-extrabold text-slate-900 text-lg">{role.title}</h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">{role.description}</p>

                <div className="mt-4 pt-3 border-t border-slate-100">
                  <span className="text-[11px] font-bold text-slate-700 block mb-1.5">Required Skills Matrix:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {role.requiredSkills.slice(0, 5).map((sk, skIdx) => (
                      <span key={skIdx} className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px] font-medium">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100 flex flex-col gap-2">
                <button
                  onClick={() => navigate(`/career-discovery/role/${role.id}`)}
                  className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-100 flex items-center justify-center gap-1.5"
                >
                  Explore Role Details
                </button>
                <button
                  onClick={() => {
                    handleSelectJobRole(role);
                    navigate('/resume-builder');
                  }}
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs flex items-center justify-center gap-1.5"
                >
                  Build Resume for Role <Hammer className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Sidebar>
  );
};

export default CareerResultsPage;
