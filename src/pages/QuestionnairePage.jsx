// src/pages/QuestionnairePage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import ProgressBar from '../components/common/ProgressBar';
import { useApp } from '../context/AppContext';
import { FIELD_QUESTIONNAIRES } from '../data/mockData';
import { Compass, ArrowRight, ArrowLeft, Check, Sparkles, BookOpen } from 'lucide-react';

const QuestionnairePage = () => {
  const navigate = useNavigate();
  const { handleSubmitQuestionnaire, userProfile } = useApp();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});

  // Dynamic Questionnaire Selection based on Profile Industry
  const activeIndustryKey = (userProfile.targetIndustry || '').toLowerCase();
  let questionsBank = FIELD_QUESTIONNAIRES.tech;
  let industryBadge = "Software & Tech";

  if (activeIndustryKey.includes('lit') || activeIndustryKey.includes('pub') || activeIndustryKey.includes('write') || activeIndustryKey.includes('art')) {
    questionsBank = FIELD_QUESTIONNAIRES.literature;
    industryBadge = "Literature & Publishing";
  } else if (activeIndustryKey.includes('bus') || activeIndustryKey.includes('fin') || activeIndustryKey.includes('mark')) {
    questionsBank = FIELD_QUESTIONNAIRES.business;
    industryBadge = "Business & Marketing";
  }

  const totalQuestions = questionsBank.length;
  const currentQ = questionsBank[currentStep];
  const progressPercent = Math.round(((currentStep + 1) / totalQuestions) * 100);

  const handleSelectOption = (option) => {
    setAnswers(prev => ({
      ...prev,
      [currentQ.id]: option
    }));
  };

  const handleNext = () => {
    if (currentStep < totalQuestions - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleSubmitQuestionnaire(answers);
      navigate('/career-discovery/results');
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
        {/* Header & Progress Bar */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 text-indigo-600 font-bold">
                <Compass className="w-4 h-4" /> Career Discovery Quiz
              </span>
              <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-[10px] font-extrabold">
                {industryBadge}
              </span>
            </div>
            <span>Question {currentStep + 1} of {totalQuestions}</span>
          </div>

          <ProgressBar progress={progressPercent} showPercentage={false} color="indigo" height="h-2" />
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-soft space-y-6">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 block mb-1">
              Category: {currentQ.category}
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug">
              {currentQ.question}
            </h2>
          </div>

          {/* Multi-choice options */}
          <div className="space-y-3">
            {currentQ.options.map((opt, idx) => {
              const isSelected = answers[currentQ.id]?.label === opt.label;

              return (
                <div
                  key={idx}
                  onClick={() => handleSelectOption(opt)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/50 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-slate-50/40'
                  }`}
                >
                  <span className={`text-xs font-bold ${isSelected ? 'text-indigo-950' : 'text-slate-800'}`}>
                    {opt.label}
                  </span>
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0">
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
              disabled={currentStep === 0}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-600 border border-slate-200 hover:bg-slate-100 disabled:opacity-30"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>

            <button
              onClick={handleNext}
              disabled={!answers[currentQ.id]}
              className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-indigo-600 disabled:opacity-40 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all"
            >
              {currentStep === totalQuestions - 1 ? 'Calculate Matches' : 'Next Question'} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </Sidebar>
  );
};

export default QuestionnairePage;
