// src/components/common/ServiceDetailModal.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from './Modal';
import { Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const SERVICE_DETAILS_DATA = {
  's1': {
    howItWorks: [
      { step: 1, title: 'Parse Document', desc: 'Extract contact info, education, experience bullets, and skill matrices.' },
      { step: 2, title: 'Structure Audit', desc: 'Scan font readability, margin alignment, and section order compliance.' },
      { step: 3, title: 'Score Report', desc: 'Receive category-by-category scores and actionable improvement tips.' }
    ],
    deliverables: ['Overall Score / 100', '7 Category Breakdown Cards', 'Structure & Formatting Verdict']
  },
  's2': {
    howItWorks: [
      { step: 1, title: 'Parser Simulation', desc: 'Pass resume through Taleo, Workday, and Greenhouse ATS parsing algorithms.' },
      { step: 2, title: 'Structural Flagging', desc: 'Detect missing standard headings, tables, or unparseable images.' },
      { step: 3, title: 'Compliance Check', desc: 'Get an estimated ATS compatibility percentage and parser readability rating.' }
    ],
    deliverables: ['Estimated ATS Compatibility Score', 'Unparseable Element Flags', 'Layout Standardization Tips']
  },
  's3': {
    howItWorks: [
      { step: 1, title: 'Job Description Analysis', desc: 'Extract mandatory tech skills and keyword frequency from target JD.' },
      { step: 2, title: 'Resume Keyword Comparison', desc: 'Cross-reference resume content against target role keywords.' },
      { step: 3, title: 'Match Percentage & Gap Matrix', desc: 'View matching skills vs missing keywords with tailoring advice.' }
    ],
    deliverables: ['Target Job Match Score %', 'Matching Skills List', 'Missing Required Keyword Gap List']
  },
  's4': {
    howItWorks: [
      { step: 1, title: 'Weak Bullet Detection', desc: 'Identify passive statements lacking action verbs or quantifiable metrics.' },
      { step: 2, title: 'AI Bullet Transformation', desc: 'Rewrite phrases into action-driven statements with metric achievements.' },
      { step: 3, title: 'Side-by-Side Review', desc: 'Compare Original vs AI Suggestion with one-click Accept or Edit.' }
    ],
    deliverables: ['Side-by-side Bullet Rewrites', 'Action Verb Density Boost', 'Quantified Outcome Suggestions']
  },
  's5': {
    howItWorks: [
      { step: 1, title: 'Select ATS Template', desc: 'Choose a single-column, recruiter-approved ATS template layout.' },
      { step: 2, title: 'Step-by-Step Entry & AI Assist', desc: 'Fill personal info, summary, experience, and projects with AI helpers.' },
      { step: 3, title: 'Live Preview & Export', desc: 'Inspect live formatted resume preview and export crisp PDF/print file.' }
    ],
    deliverables: ['Live ATS Resume Preview', 'AI Summary & Bullet Generator', 'One-click PDF Export']
  },
  's6': {
    howItWorks: [
      { step: 1, title: '6-Question Guided Quiz', desc: 'Answer questions about background, coding preference, and work type.' },
      { step: 2, title: 'AI Alignment Matrix', desc: 'Match your preferences against 12+ technical role vectors.' },
      { step: 3, title: 'Career Path Roadmap', desc: 'Receive top matching roles, salary ranges, and skill acquisition roadmap.' }
    ],
    deliverables: ['Top 3 Recommended Roles', 'Salary & Market Demand Metrics', 'Skill Roadmap & Resume Start']
  },
  's7': {
    howItWorks: [
      { step: 1, title: 'Target Role Profiling', desc: 'Analyze mandatory skills required for your target technical position.' },
      { step: 2, title: 'Current Skill Audit', desc: 'Compare parsed resume skills against target position requirements.' },
      { step: 3, title: 'Gap Identification', desc: 'Highlight missing technical skills categorized by high/medium priority.' }
    ],
    deliverables: ['Missing Skills Matrix', 'Skill Priority Tiers', 'Direct Link to Learning Roadmap']
  },
  's8': {
    howItWorks: [
      { step: 1, title: 'Skill Gap Prioritization', desc: 'Group missing skills into beginner and intermediate learning topics.' },
      { step: 2, title: 'Curated Resource Assembly', desc: 'Assemble top free documentation, video tutorials, and courses.' },
      { step: 3, title: 'Interactive Tracker', desc: 'Track learning progress with status toggles (To Learn, In Progress, Mastered).' }
    ],
    deliverables: ['Curated Course Cards', 'Est. Learning Hours', 'Interactive Learning Status Tracker']
  },
  's9': {
    howItWorks: [
      { step: 1, title: 'Select Prompt Pill', desc: 'Choose a quick question or type a custom query about your career/resume.' },
      { step: 2, title: 'Contextual AI Processing', desc: 'Analyze query against active resume data and score reports.' },
      { step: 3, title: 'Instant Advice & Coaching', desc: 'Receive tailored career advice, summary rewrites, and skill tips.' }
    ],
    deliverables: ['Instant AI Chat Responses', 'Tailored Resume Summaries', 'Actionable Career Coaching']
  },
  's10': {
    howItWorks: [
      { step: 1, title: 'Baseline Score Snapshot', desc: 'Record initial resume score before making content modifications.' },
      { step: 2, title: 'AI Edit Application', desc: 'Accept AI suggestions or update section bullets in the editor.' },
      { step: 3, title: 'Score Evolution Recheck', desc: 'Re-evaluate score to calculate Before vs After score boost.' }
    ],
    deliverables: ['Before vs After Score Comparison', 'Score Boost Delta (+Points)', 'Saved Revision Timeline']
  }
};

const ServiceDetailModal = ({ service, isOpen, onClose }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useApp();

  if (!service) return null;

  const details = SERVICE_DETAILS_DATA[service.id] || SERVICE_DETAILS_DATA['s1'];

  const handleAction = () => {
    onClose();
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/upload-resume' } });
    } else {
      navigate('/upload-resume');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={service.title} maxWidth="max-w-2xl">
      <div className="space-y-6 text-stone-800 font-sans">
        {/* Header Badge */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-purple-100 text-purple-800 border border-purple-300/80">
            {service.badge} Service
          </span>
          <span className="text-xs text-stone-500 font-medium">Interactive Feature Overview</span>
        </div>

        {/* Overview */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-purple-700 mb-1">Service Description</h4>
          <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-medium bg-purple-50/60 p-4 rounded-xl border border-purple-200/80">
            {service.description}
          </p>
        </div>

        {/* How It Works Step-by-Step */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-purple-700 mb-3">How It Works (Step-by-Step Process)</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {details.howItWorks.map((st) => (
              <div key={st.step} className="p-3.5 rounded-xl border border-purple-200/80 bg-white shadow-xs space-y-1">
                <div className="w-6 h-6 rounded-lg bg-purple-600 text-white font-extrabold text-xs flex items-center justify-center shadow-xs">
                  {st.step}
                </div>
                <div className="font-bold text-stone-900 text-xs mt-1">{st.title}</div>
                <p className="text-[11px] text-stone-500 leading-normal">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Key Deliverables */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-purple-700 mb-2">Key Deliverables & Benefits</h4>
          <div className="space-y-1.5">
            {details.deliverables.map((del, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-stone-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{del}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Button */}
        <div className="pt-4 border-t border-purple-200/60 flex justify-end">
          <button
            onClick={handleAction}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 via-purple-700 to-violet-700 hover:from-purple-700 hover:to-violet-800 text-white font-bold text-xs shadow-lg shadow-purple-600/30 transition-all hover:scale-[1.01]"
          >
            {isAuthenticated ? 'Use Service Now' : 'Sign In to Access Service'} <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ServiceDetailModal;
