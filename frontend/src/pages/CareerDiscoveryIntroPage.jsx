// src/pages/CareerDiscoveryIntroPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import MandatoryProfileWarningModal from '../components/common/MandatoryProfileWarningModal';
import { useApp } from '../context/AppContext';
import { Compass, Sparkles, Clock, CheckCircle2, ArrowRight } from 'lucide-react';

const CareerDiscoveryIntroPage = () => {
  const navigate = useNavigate();
  const { userProfile, setUserProfile, selectedIndustry, setSelectedIndustry, updateIndustryRoles } = useApp();

  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);
  const [missingFieldsList, setMissingFieldsList] = useState([]);

  const handleStartQuestionnaire = () => {
    const activeIndustry = (selectedIndustry || userProfile.targetIndustry || '').trim();
    if (!activeIndustry || activeIndustry === 'Others') {
      setMissingFieldsList([{ key: 'targetIndustry', label: 'Target Industry / Field' }]);
      setIsWarningModalOpen(true);
      return;
    }
    navigate('/career-discovery/questionnaire');
  };

  const handleModalSaveAndProceed = (completedForm) => {
    setIsWarningModalOpen(false);
    const updated = {
      ...userProfile,
      ...completedForm
    };
    setUserProfile(updated);
    if (completedForm.targetIndustry) {
      setSelectedIndustry(completedForm.targetIndustry);
      updateIndustryRoles(completedForm.targetIndustry);
    }
    navigate('/career-discovery/questionnaire');
  };

  return (
    <Sidebar>
      <div className="max-w-4xl mx-auto space-y-8 font-sans relative">
        {/* Animated Background Ambience */}
        <div className="pointer-events-none absolute -top-16 -left-16 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="pointer-events-none absolute top-1/2 -right-16 w-80 h-80 bg-fuchsia-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '7s' }} />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 border border-purple-300 text-purple-800 text-xs font-semibold mb-2 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-purple-600 animate-pulse" /> Guided Career Path Finder
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">Discover Your Career Path</h1>
          <p className="text-sm text-stone-600 mt-1">
            Not sure which role suits your skills? Answer 6 quick questions to receive AI-tailored career role recommendations.
          </p>
        </div>

        {/* Feature Hero Card with Deep Purple Gradient & Glowing Mesh */}
        <div className="relative z-10 bg-gradient-to-br from-[#2e1065] via-[#4c1d95] to-[#581c87] rounded-3xl p-8 text-white shadow-2xl border border-purple-400/30 space-y-6 overflow-hidden">
          {/* Subtle Ambient Sphere within card */}
          <div className="pointer-events-none absolute -bottom-10 -right-10 w-64 h-64 bg-fuchsia-500/20 rounded-full blur-2xl" />

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-purple-200 shadow-inner">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-white">Guided Technical Career Questionnaire</h2>
              <div className="flex items-center gap-4 text-xs text-purple-200 mt-1">
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Est. Time: 2 mins</span>
                <span>• 6 Guided Steps</span>
              </div>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-purple-100 leading-relaxed max-w-2xl">
            Our questionnaire evaluates your academic background, coding preference, design interest, desired workplace culture, and analytical strengths to match you with realistic tech roles.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 text-xs space-y-1.5 hover:bg-white/15 transition-all">
              <div className="font-bold text-white flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-purple-300" /> Step 1</div>
              <p className="text-purple-200 text-xs">Academic & Skill Mapping</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 text-xs space-y-1.5 hover:bg-white/15 transition-all">
              <div className="font-bold text-white flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-purple-300" /> Step 2</div>
              <p className="text-purple-200 text-xs">Coding & Tool Preference</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 text-xs space-y-1.5 hover:bg-white/15 transition-all">
              <div className="font-bold text-white flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-purple-300" /> Step 3</div>
              <p className="text-purple-200 text-xs">Role & Skill Roadmap</p>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              onClick={handleStartQuestionnaire}
              className="px-8 py-3.5 rounded-xl bg-white hover:bg-purple-50 text-purple-950 font-black text-sm shadow-xl shadow-purple-950/40 transition-all flex items-center gap-2 hover:scale-[1.02] cursor-pointer"
            >
              Start Questionnaire <ArrowRight className="w-5 h-5 text-purple-700" />
            </button>
          </div>
        </div>

        {/* Mandatory Profile / Industry Warning Modal */}
        <MandatoryProfileWarningModal
          isOpen={isWarningModalOpen}
          onClose={() => setIsWarningModalOpen(false)}
          missingFields={missingFieldsList}
          userProfile={userProfile}
          selectedIndustry={selectedIndustry}
          onSaveAndProceed={handleModalSaveAndProceed}
        />
      </div>
    </Sidebar>
  );
};

export default CareerDiscoveryIntroPage;
