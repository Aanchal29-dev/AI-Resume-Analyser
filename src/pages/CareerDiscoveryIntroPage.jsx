// src/pages/CareerDiscoveryIntroPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import { Compass, Sparkles, Clock, CheckCircle2, ArrowRight } from 'lucide-react';

const CareerDiscoveryIntroPage = () => {
  const navigate = useNavigate();

  return (
    <Sidebar>
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-50 text-violet-700 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-violet-600" /> Guided Career Path Finder
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Discover Your Career Path</h1>
          <p className="text-sm text-slate-500 mt-1">
            Not sure which role suits your skills? Answer 6 quick questions to receive AI-tailored career role recommendations.
          </p>
        </div>

        {/* Feature Hero Card */}
        <div className="bg-gradient-to-r from-violet-900 via-indigo-900 to-slate-900 rounded-3xl p-8 text-white shadow-xl space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-violet-300">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-white">Guided Technical Career Questionnaire</h2>
              <div className="flex items-center gap-4 text-xs text-violet-200 mt-1">
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Est. Time: 2 mins</span>
                <span>• 6 Guided Steps</span>
              </div>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-violet-100 leading-relaxed max-w-2xl">
            Our questionnaire evaluates your academic background, coding preference, design interest, desired workplace culture, and analytical strengths to match you with realistic tech roles.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="bg-white/10 rounded-xl p-3 border border-white/15 text-xs space-y-1">
              <div className="font-bold text-white flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-violet-400" /> Step 1</div>
              <p className="text-violet-200 text-[11px]">Academic & Skill Mapping</p>
            </div>
            <div className="bg-white/10 rounded-xl p-3 border border-white/15 text-xs space-y-1">
              <div className="font-bold text-white flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-violet-400" /> Step 2</div>
              <p className="text-violet-200 text-[11px]">Coding & Tool Preference</p>
            </div>
            <div className="bg-white/10 rounded-xl p-3 border border-white/15 text-xs space-y-1">
              <div className="font-bold text-white flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-violet-400" /> Step 3</div>
              <p className="text-violet-200 text-[11px]">Role & Skill Roadmap</p>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              onClick={() => navigate('/career-discovery/questionnaire')}
              className="px-8 py-3.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-extrabold text-sm shadow-lg transition-all flex items-center gap-2 hover:scale-[1.02]"
            >
              Start Questionnaire <ArrowRight className="w-5 h-5 text-indigo-600" />
            </button>
          </div>
        </div>
      </div>
    </Sidebar>
  );
};

export default CareerDiscoveryIntroPage;
