// src/components/common/StepDetailModal.jsx
import React from 'react';
import Modal from './Modal';
import { Sparkles, CheckCircle2, ArrowRight, Upload, Cpu, Edit3, TrendingUp } from 'lucide-react';

const STEP_DETAILS_DATA = {
  1: {
    title: 'Step 1: Upload Resume or Answer Discovery Quiz',
    subtitle: 'Input Stage & Section Extraction',
    icon: Upload,
    color: 'indigo',
    description: 'Whether you already have a formatted resume or are starting completely from scratch, SkillSync seamlessly processes your input data.',
    processSteps: [
      'Document Parsing: Upload PDF, DOCX, DOC, TXT, PNG, or JPG files. Our parser extracts Contact Info, Education, Experience, Projects, and Skills.',
      'Text Paste Option: Copy-paste raw resume text for instant scanning without needing a file.',
      'Career Discovery Questionnaire: Unsure about your role? Answer 4-6 field-specific questions to get matched with technical roles tailored to your major.'
    ],
    deliverables: ['Extracted Resume Layout Overview', 'Parsed Section Completeness Checklist (100% Score)', 'Matched Target Job Presets']
  },
  2: {
    title: 'Step 2: Analyze & Discover Job Alignment',
    subtitle: 'Evaluation & Keyword Gap Engine',
    icon: Cpu,
    color: 'violet',
    description: 'SkillSync evaluates your resume against industry-standard ATS algorithms and target job descriptions.',
    processSteps: [
      'ATS Structural Compliance Audit: Check font compatibility, line spacing, section ordering, and unparseable element flags.',
      'Target Job Matching: Compare your resume directly against any pasted job posting or preset role (Frontend, Technical Writing, Data Analyst).',
      'Category Score Breakdown: Receive 7 detailed evaluation cards across ATS, Content, Skills Match, Formatting, Experience Impact, and Readability.'
    ],
    deliverables: ['Overall Resume Score / 100', 'ATS Compatibility Score %', 'Target Job Match % & Missing Keywords List']
  },
  3: {
    title: 'Step 3: Improve & Rewrite with AI',
    subtitle: 'Side-by-Side Content Optimization',
    icon: Edit3,
    color: 'amber',
    description: 'Transform passive, weak resume statements into quantified accomplishment statements using side-by-side AI bullet rewrites.',
    processSteps: [
      'Issue Categorization: View issues organized by priority tiers (Fix First, Important, Recommended, Passed).',
      'Side-by-Side AI Editor: Compare your original bullet point side-by-side with AI-rewritten, action-driven suggestions.',
      'One-Click Accept & Edit: Accept suggestions to instantly update your resume data and boost your evaluation score.'
    ],
    deliverables: ['Quantified Accomplishment Statements', 'Verb Impact Optimization', 'Instant Resume Content Updates']
  },
  4: {
    title: 'Step 4: Recheck & Prepare for Applications',
    subtitle: 'Score Evolution Tracking & Roadmaps',
    icon: TrendingUp,
    color: 'emerald',
    description: 'Track your score jump after applying AI edits and prepare for real-world job applications.',
    processSteps: [
      'Before vs After Score Comparison: View exact point boosts (e.g. 68 ➔ 84) resulting from resolved recommendations.',
      'Version History Timeline: Access and export previous saved revisions of your resume (v1.0, v2.0, v3.0).',
      'Personalized Skill Roadmap: Enroll in recommended courses to close remaining technical skill gaps for your dream role.'
    ],
    deliverables: ['Before vs After Score Boost Delta', 'Saved Revision Log', 'Personalized Skill & Course Roadmap']
  }
};

const StepDetailModal = ({ stepNumber, isOpen, onClose, onAction }) => {
  if (!stepNumber) return null;

  const data = STEP_DETAILS_DATA[stepNumber] || STEP_DETAILS_DATA[1];
  const IconComponent = data.icon;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={data.title} maxWidth="max-w-2xl">
      <div className="space-y-6 text-slate-800 font-sans">
        {/* Header Badge */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/60">
            {data.subtitle}
          </span>
          <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-extrabold text-sm">
            {stepNumber}
          </div>
        </div>

        {/* Overview */}
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium bg-slate-50 p-4 rounded-xl border border-slate-200/70">
          {data.description}
        </p>

        {/* Process Steps */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Process Breakdown</h4>
          <div className="space-y-2.5">
            {data.processSteps.map((ps, idx) => (
              <div key={idx} className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-xs text-xs space-y-1">
                <div className="font-bold text-slate-900">{ps.split(':')[0]}</div>
                <div className="text-slate-600 leading-normal text-[11px]">{ps.split(':')[1]}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Deliverables */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Key Outputs & Deliverables</h4>
          <div className="space-y-1.5">
            {data.deliverables.map((del, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{del}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={() => {
              onClose();
              if (onAction) onAction();
            }}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all hover:scale-[1.01]"
          >
            Start Step {stepNumber} Now <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default StepDetailModal;
