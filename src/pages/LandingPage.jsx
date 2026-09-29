// src/pages/LandingPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import ServiceDetailModal from '../components/common/ServiceDetailModal';
import StepDetailModal from '../components/common/StepDetailModal';
import { useApp } from '../context/AppContext';
import { fetchDailyGeminiFAQs } from '../services/geminiService';
import {
  Sparkles,
  FileCheck2,
  Compass,
  ArrowRight,
  ChevronDown,
  Upload,
  Cpu,
  Edit3,
  TrendingUp,
  RefreshCw,
  HelpCircle,
  Flame,
  Calendar
} from 'lucide-react';
import { PLATFORM_SERVICES } from '../data/mockData';

const LandingPage = () => {
  const navigate = useNavigate();
  const {
    isAuthenticated,
    hasAnalyzedResume,
    resumeData,
    uploadedFileName,
    targetRole,
    analysis
  } = useApp();

  const atsScore = analysis?.atsCompatibility || 84;
  const jobMatchScore = analysis?.jobMatchScore || 72;
  const pendingIssues = analysis?.issues ? analysis.issues.filter(i => i.status !== 'resolved') : [];
  const pendingCount = pendingIssues.length;

  const technicalSkills = Array.isArray(resumeData?.skills?.technical)
    ? resumeData.skills.technical
    : (typeof resumeData?.skills?.technical === 'string'
      ? resumeData.skills.technical.split(',').map(s => s.trim()).filter(Boolean)
      : ['React', 'JavaScript', 'TypeScript', 'HTML5/CSS3', 'Tailwind CSS', 'Node.js']);

  const [openFaq, setOpenFaq] = useState(0);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedStepNumber, setSelectedStepNumber] = useState(null);

  // Dynamic Gemini Daily FAQs State
  const [dailyFaqPayload, setDailyFaqPayload] = useState({
    lastUpdated: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    trendingTheme: 'AI Screening & ATS Optimization',
    faqs: [
      {
        q: "How does SkillSync's Gemini AI analyze resumes differently from standard keyword checkers?",
        a: "Unlike traditional keyword-counting tools, SkillSync uses Google Gemini to semantically evaluate context, quantified impact (Google X-Y-Z formula), section completeness, and genuine alignment against target job descriptions.",
        category: "ATS Optimization",
        trendingScore: "Top Question"
      },
      {
        q: "Can I upload course completion or internship certificates for verification?",
        a: "Yes! SkillSync automatically recognizes certificates from Coursera, Udemy, Meta, Google, universities, and internship employers, performing an originality and authenticity audit before adding them to your profile.",
        category: "Certifications",
        trendingScore: "Trending"
      },
      {
        q: "How often are the resume suggestions and industry trends updated?",
        a: "The AI analysis model and FAQ trends are updated daily via Google Gemini to reflect current tech industry hiring demands and algorithm changes.",
        category: "Industry Trends",
        trendingScore: "Daily Update"
      },
      {
        q: "What should I do if I am a fresher with no previous work experience?",
        a: "Use our 'Discover My Career Path' questionnaire. Gemini AI maps your academic coursework, projects, and strengths to high-demand roles, generating tailored resume bullets from scratch.",
        category: "Career Strategy",
        trendingScore: "Student Favorite"
      },
      {
        q: "How does the side-by-side AI bullet point rewrite work?",
        a: "The AI Correction Suite examines weak or passive phrases and rewrites them into metric-driven accomplishment statements tailored specifically for your target role.",
        category: "Formatting",
        trendingScore: "Hot Topic"
      }
    ]
  });
  const [isRefreshingFaqs, setIsRefreshingFaqs] = useState(false);

  useEffect(() => {
    const loadFaqs = async () => {
      try {
        const data = await fetchDailyGeminiFAQs(false);
        if (data && data.faqs) {
          setDailyFaqPayload(data);
        }
      } catch (err) {
        console.warn('Initial FAQ fetch fallback:', err);
      }
    };
    loadFaqs();
  }, []);

  const handleManualFaqRefresh = async () => {
    setIsRefreshingFaqs(true);
    try {
      const fresh = await fetchDailyGeminiFAQs(true);
      if (fresh && fresh.faqs) {
        setDailyFaqPayload(fresh);
      }
    } catch (e) {
      console.warn('Error refreshing FAQs:', e);
    } finally {
      setIsRefreshingFaqs(false);
    }
  };

  const handleProtectedAction = (path) => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: path } });
    } else {
      navigate(path);
    }
  };

  const stepsData = [
    { number: 1, title: 'Upload / Answer', desc: 'Upload your resume or complete our field-specific discovery quiz.', icon: Upload, color: 'from-purple-600 to-violet-700' },
    { number: 2, title: 'Analyze / Discover', desc: 'Receive instant ATS evaluation, job match %, and keyword gaps.', icon: Cpu, color: 'from-violet-600 to-purple-800' },
    { number: 3, title: 'Improve & Rewrite', desc: 'Use side-by-side AI rewrites to transform weak phrasing into outcomes.', icon: Edit3, color: 'from-purple-700 to-fuchsia-700' },
    { number: 4, title: 'Recheck & Prepare', desc: 'Track your score boost and access personalized skill learning roadmaps.', icon: TrendingUp, color: 'from-fuchsia-600 to-pink-600' }
  ];

  return (
    <div className="min-h-screen bg-[#f3e8fa] text-stone-800 flex flex-col font-sans selection:bg-purple-600 selection:text-white relative">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-10 pb-16 md:pt-16 md:pb-24 border-b border-purple-200/70 bg-gradient-to-b from-purple-200/35 via-purple-100/25 to-[#f3e8fa]">
        <div className="pointer-events-none absolute -top-24 -left-20 w-96 h-96 bg-purple-400/12 rounded-full blur-3xl"></div>
        <div className="pointer-events-none absolute top-1/4 -right-20 w-96 h-96 bg-fuchsia-400/12 rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-stone-900 tracking-tight leading-tight">
              Understand Your Resume. <br />
              <span className="gradient-text">Discover Your Next Career Move.</span>
            </h1>

            <p className="text-base sm:text-lg text-stone-700 leading-relaxed font-medium">
              An intelligent career companion that evaluates your ATS compatibility, tailors your resume for target job descriptions, identifies skill gaps, and guides freshers to ideal career roles.
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <button
                onClick={() => handleProtectedAction('/upload-resume')}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm shadow-xl shadow-purple-600/30 transition-all flex items-center justify-center gap-2 hover:scale-[1.02]"
              >
                <FileCheck2 className="w-5 h-5" /> Analyze My Resume
              </button>

              <button
                onClick={() => handleProtectedAction('/career-discovery-intro')}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white hover:bg-purple-50 text-purple-900 font-bold text-sm border-2 border-purple-200 hover:border-purple-300 shadow-sm transition-all flex items-center justify-center gap-2 hover:scale-[1.02]"
              >
                <Compass className="w-5 h-5 text-purple-600" /> Discover My Career Path
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 md:py-24 bg-[#f8f4fc] border-b border-purple-200/70 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" /> All Services & Capabilities
            </div>
            <h2 className="text-3xl font-extrabold text-stone-900 tracking-tight">
              A Complete AI Career Acceleration Suite
            </h2>
            <p className="text-sm text-stone-600 leading-relaxed">
              Explore 8 dedicated tools engineered to evaluate ATS compatibility, bridge technical skill gaps, and optimize your hireability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {PLATFORM_SERVICES.map((srv) => (
              <div
                key={srv.id}
                onClick={() => setSelectedService(srv)}
                className="group relative bg-[#fbf7fd] rounded-2xl p-6 border-2 border-purple-200/80 hover:border-purple-400 shadow-soft hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between hover:-translate-y-1"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-purple-600 group-hover:text-white transition-all shadow-xs">
                    <Sparkles className="w-6 h-6" />
                  </div>

                  <h3 className="font-bold text-stone-900 text-base mb-2 group-hover:text-purple-700 transition-colors">
                    {srv.title}
                  </h3>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {srv.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-purple-200/60 flex items-center justify-between text-xs font-bold text-purple-600 group-hover:translate-x-1 transition-transform">
                  <span>View Process & Details</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <button
              onClick={() => handleProtectedAction('/resume-services')}
              className="inline-flex items-center gap-2 text-xs font-bold text-purple-800 hover:text-purple-950 bg-white hover:bg-purple-100/60 px-6 py-3 rounded-xl border border-purple-300 shadow-xs transition-colors"
            >
              Explore All Services <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Dynamic Gemini FAQ Section (Updated Daily via Gemini AI) */}
      <section id="faq" className="py-16 bg-gradient-to-b from-purple-50/40 to-[#f3e8fa] relative z-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-bold mb-1 shadow-xs">
              <Sparkles className="w-3.5 h-3.5" /> Powered by Google Gemini AI
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900">Frequently Asked Questions</h2>
            <p className="text-xs sm:text-sm text-stone-600">
              Live questions & insights directly curated from daily resume & job queries on Google Gemini.
            </p>

            {/* Daily Sync & Refresh Status Bar */}
            <div className="mt-4 inline-flex flex-wrap items-center justify-center gap-3 bg-white/90 border border-purple-200/80 px-4 py-2 rounded-2xl shadow-xs text-xs">
              <span className="flex items-center gap-1.5 text-purple-700 font-bold">
                <Calendar className="w-3.5 h-3.5 text-purple-600" /> Daily Sync: {dailyFaqPayload.lastUpdated}
              </span>
              <span className="text-stone-300">|</span>
              <span className="flex items-center gap-1 text-stone-600 font-medium">
                <Flame className="w-3.5 h-3.5 text-amber-500" /> {dailyFaqPayload.trendingTheme}
              </span>
              <span className="text-stone-300">|</span>
              <button
                onClick={handleManualFaqRefresh}
                disabled={isRefreshingFaqs}
                className="flex items-center gap-1 text-purple-600 hover:text-purple-800 font-bold hover:underline transition-all"
                title="Refresh today's FAQs from Gemini AI"
              >
                <RefreshCw className={`w-3 h-3 ${isRefreshingFaqs ? 'animate-spin' : ''}`} />
                {isRefreshingFaqs ? 'Syncing...' : 'Sync Today\'s FAQs'}
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {dailyFaqPayload.faqs.map((faq, idx) => (
              <div key={idx} className="border border-purple-200/80 rounded-2xl overflow-hidden bg-[#fbf7fd] shadow-xs transition-all">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
                  className="w-full p-5 text-left font-bold text-stone-800 text-sm flex items-center justify-between hover:bg-purple-100/50 transition-colors"
                >
                  <div className="flex items-center gap-3 pr-2">
                    <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-xs shrink-0 font-bold">
                      Q{idx + 1}
                    </span>
                    <span>{faq.q}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {faq.category && (
                      <span className="hidden sm:inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                        {faq.category}
                      </span>
                    )}
                    <ChevronDown className={`w-4 h-4 text-purple-500 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
                  </div>
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5 text-xs text-stone-600 leading-relaxed border-t border-purple-200/60 pt-3 bg-white">
                    <p className="whitespace-pre-wrap">{faq.a}</p>
                    {faq.trendingScore && (
                      <div className="mt-3 flex items-center gap-1 text-[10px] font-bold text-purple-600">
                        <Flame className="w-3 h-3 text-amber-500" /> {faq.trendingScore}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Detail Modal */}
      <ServiceDetailModal
        service={selectedService}
        isOpen={!!selectedService}
        onClose={() => setSelectedService(null)}
      />

      {/* Step Detail Modal */}
      <StepDetailModal
        stepNumber={selectedStepNumber}
        isOpen={!!selectedStepNumber}
        onClose={() => setSelectedStepNumber(null)}
        onAction={() => handleProtectedAction('/upload-resume')}
      />

      <Footer />
    </div>
  );
};

export default LandingPage;
