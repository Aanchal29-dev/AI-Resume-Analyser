// src/pages/RoleDetailsPage.jsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import { useApp } from '../context/AppContext';
import { SAMPLE_JOB_ROLES } from '../data/mockData';
import {
  Briefcase,
  IndianRupee,
  TrendingUp,
  CheckCircle2,
  BookOpen,
  Hammer,
  ArrowLeft,
  Sparkles
} from 'lucide-react';

const RoleDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { handleSelectJobRole } = useApp();

  const role = SAMPLE_JOB_ROLES.find(r => r.id === id) || SAMPLE_JOB_ROLES[0];

  const handleStartBuilder = () => {
    handleSelectJobRole(role);
    navigate('/resume-builder');
  };

  return (
    <Sidebar>
      <div className="max-w-4xl mx-auto space-y-8">
        <button
          onClick={() => navigate('/career-discovery/results')}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Role Recommendations
        </button>

        {/* Hero Role Card */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-soft space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                {role.category}
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">{role.title}</h1>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">{role.description}</p>
            </div>

            <button
              onClick={handleStartBuilder}
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shrink-0 flex items-center gap-1.5"
            >
              Build Resume for Role <Hammer className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-purple-50/70 border border-purple-200/80 flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-emerald-100 text-emerald-800 font-bold">
                <IndianRupee className="w-5 h-5 text-emerald-700" />
              </div>
              <div>
                <div className="text-xs text-stone-600 font-semibold">Est. Salary Range</div>
                <div className="text-sm font-extrabold text-stone-900">{role.avgSalary}</div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-indigo-100 text-indigo-700 font-bold">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] text-slate-500 font-medium">Market Demand Level</div>
                <div className="text-sm font-extrabold text-slate-900">{role.demand} Demand</div>
              </div>
            </div>
          </div>

          {/* Responsibilities */}
          <div>
            <h3 className="font-bold text-slate-900 text-sm mb-3">Key Core Responsibilities</h3>
            <ul className="space-y-2 text-xs text-slate-700">
              {role.responsibilities.map((resp, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <span>{resp}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Required vs Nice to Have Skills */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            <div>
              <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2">Required Core Skills</h3>
              <div className="flex flex-wrap gap-2">
                {role.requiredSkills.map((sk, idx) => (
                  <span key={idx} className="bg-indigo-50 text-indigo-900 border border-indigo-200 px-3 py-1 rounded-xl text-xs font-semibold">
                    {sk}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2">Nice-To-Have Skills</h3>
              <div className="flex flex-wrap gap-2">
                {role.niceToHave.map((sk, idx) => (
                  <span key={idx} className="bg-slate-100 text-slate-700 border border-slate-200 px-3 py-1 rounded-xl text-xs font-medium">
                    {sk}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Sidebar>
  );
};

export default RoleDetailsPage;
