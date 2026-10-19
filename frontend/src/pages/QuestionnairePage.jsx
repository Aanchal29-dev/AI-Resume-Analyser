// src/pages/QuestionnairePage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import ProgressBar from '../components/common/ProgressBar';
import { useApp } from '../context/AppContext';
import { FIELD_QUESTIONNAIRES } from '../data/mockData';
import { Compass, ArrowRight, ArrowLeft, Check, Sparkles, Loader2, Target, CheckCircle2 } from 'lucide-react';

const QuestionnairePage = () => {
  const navigate = useNavigate();
  const {
    userProfile,
    selectedIndustry,
    activeDynamicQuestionnaire,
    handleCompleteIndustryQuestionnaire,
    isAnalyzingIndustry
  } = useApp();

  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});

  // Resolve questions bank: dynamic AI-generated questionnaire takes first priority
  const activeIndustryName = selectedIndustry || userProfile.targetIndustry || 'Software & Technology';
  const lowerIndustry = activeIndustryName.toLowerCase();

  let fallbackBank = FIELD_QUESTIONNAIRES.tech;
  if (lowerIndustry.includes('lit') || lowerIndustry.includes('pub') || lowerIndustry.includes('write')) {
    fallbackBank = FIELD_QUESTIONNAIRES.literature;
  } else if (lowerIndustry.includes('bus') || lowerIndustry.includes('mark') || lowerIndustry.includes('growth')) {
    fallbackBank = FIELD_QUESTIONNAIRES.business;
  } else if (lowerIndustry.includes('health') || lowerIndustry.includes('medic') || lowerIndustry.includes('clinic')) {
    fallbackBank = FIELD_QUESTIONNAIRES.healthcare || FIELD_QUESTIONNAIRES.tech;
  } else if (lowerIndustry.includes('finan') || lowerIndustry.includes('bank') || lowerIndustry.includes('invest')) {
    fallbackBank = FIELD_QUESTIONNAIRES.finance || FIELD_QUESTIONNAIRES.business;
  } else if (lowerIndustry.includes('design') || lowerIndustry.includes('ui') || lowerIndustry.includes('ux')) {
    fallbackBank = FIELD_QUESTIONNAIRES.design || FIELD_QUESTIONNAIRES.literature;
  }

  const questionsBank = (activeDynamicQuestionnaire && activeDynamicQuestionnaire.length > 0)
    ? activeDynamicQuestionnaire
    : fallbackBank;

  const totalQuestions = questionsBank.length;
  const currentQ = questionsBank[currentStep] || questionsBank[0];
  const progressPercent = Math.round(((currentStep + 1) / totalQuestions) * 100);

  const handleSelectOption = (option) => {
    setAnswers(prev => ({
      ...prev,
      [currentQ.id]: option
    }));
  };

  const handleNext = async () => {
    if (currentStep < totalQuestions - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      await handleCompleteIndustryQuestionnaire(activeIndustryName, answers, navigate);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  return (
    <Sidebar>
      <div className="max-w-3xl mx-auto space-y-8 font-sans">
        {/* Loading Modal / Overlay during AI Analysis */}
        {isAnalyzingIndustry && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full border border-purple-200 shadow-2xl text-center space-y-5 animate-in fade-in zoom-in duration-300">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 to-violet-600 text-white mx-auto flex items-center justify-center shadow-lg shadow-purple-600/30 animate-pulse">
                <Sparkles className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-extrabold text-slate-900">AI Industry Analysis Engine</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Evaluating your responses for <span className="font-bold text-purple-700">{activeIndustryName}</span>...
                </p>
              </div>

              <div className="space-y-2 text-left bg-purple-50/70 p-4 rounded-2xl border border-purple-100 text-xs text-purple-900">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-purple-600" />
                  <span>Synthesizing specialized domain competency map</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Matching high-demand job roles in {activeIndustryName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-purple-600" />
                  <span>Architecting ATS-optimized single-column resume</span>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 font-medium">
                Preparing your tailored roadmap in seconds...
              </div>
            </div>
          </div>
        )}

        {/* Header & Progress Bar */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-bold text-slate-500">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 text-purple-700 font-bold">
                <Compass className="w-4 h-4" /> Career Assessment
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-900 text-[11px] font-extrabold border border-purple-200">
                {activeIndustryName}
              </span>
            </div>
            <span>Question {currentStep + 1} of {totalQuestions}</span>
          </div>

          <ProgressBar progress={progressPercent} showPercentage={false} color="purple" height="h-2" />
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-purple-200/90 shadow-soft space-y-6">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-purple-700 block mb-1">
              Category: {currentQ?.category || 'Domain Assessment'}
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug">
              {currentQ?.question}
            </h2>
          </div>

          {/* Multi-choice options */}
          <div className="space-y-3">
            {currentQ?.options?.map((opt, idx) => {
              const isSelected = answers[currentQ.id]?.label === opt.label;

              return (
                <div
                  key={idx}
                  onClick={() => handleSelectOption(opt)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between group ${
                    isSelected
                      ? 'border-purple-600 bg-purple-50/60 shadow-xs'
                      : 'border-slate-200 hover:border-purple-300 bg-slate-50/40 hover:bg-white'
                  }`}
                >
                  <div className="space-y-0.5">
                    <span className={`text-xs font-bold ${isSelected ? 'text-purple-950' : 'text-slate-800'}`}>
                      {opt.label}
                    </span>
                    {opt.roleHint && (
                      <span className="block text-[10px] text-purple-600 font-semibold">
                        Alignment: {opt.roleHint}
                      </span>
                    )}
                  </div>
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-100">
            <button
              onClick={handleBack}
              disabled={currentStep === 0 || isAnalyzingIndustry}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-600 border border-slate-200 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>

            <button
              onClick={handleNext}
              disabled={!answers[currentQ?.id] || isAnalyzingIndustry}
              className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-violet-700 hover:from-purple-700 hover:to-violet-800 disabled:opacity-40 text-white font-bold text-xs shadow-md shadow-purple-600/20 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
            >
              {currentStep === totalQuestions - 1 ? (
                <>
                  <Sparkles className="w-4 h-4 text-purple-200" />
                  Analyze & Prepare Tailored Resume
                </>
              ) : (
                <>
                  Next Question <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </Sidebar>
  );
};

export default QuestionnairePage;
