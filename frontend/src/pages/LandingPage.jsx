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
  Calendar,
  ChevronLeft,
  ChevronRight,
  RotateCw,
  MousePointer2
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

  // Dynamic Gemini Daily FAQs Pool State
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
      },
      {
        q: "How do I optimize my resume for automated HR screening filters?",
        a: "Ensure single-column layout, standard section headers, clean typography, and include relevant technical skills matched to the job description.",
        category: "ATS Tips",
        trendingScore: "High Demand"
      }
    ]
  });

  const [isRefreshingFaqs, setIsRefreshingFaqs] = useState(false);
  const [faqPageIndex, setFaqPageIndex] = useState(0);
  const [isAutoRotatePaused, setIsAutoRotatePaused] = useState(false);

  const ITEMS_PER_VIEW = 3;
  const totalFaqs = dailyFaqPayload.faqs.length;
  const totalPages = Math.ceil(totalFaqs / ITEMS_PER_VIEW) || 1;

  // Active 3 FAQs slice
  const displayedFaqs = dailyFaqPayload.faqs.slice(
    faqPageIndex * ITEMS_PER_VIEW,
    faqPageIndex * ITEMS_PER_VIEW + ITEMS_PER_VIEW
  );

  // Auto-rotate every 8 seconds (if not paused by mouse hover)
  useEffect(() => {
    if (isAutoRotatePaused || totalPages <= 1) return;

    const timer = setInterval(() => {
      setFaqPageIndex((prev) => (prev + 1) % totalPages);
      setOpenFaq(-1); // Reset accordion on rotation
    }, 8000);

    return () => clearInterval(timer);
  }, [totalPages, isAutoRotatePaused]);

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
        setFaqPageIndex(0);
      }
    } catch (e) {
      console.warn('Error refreshing FAQs:', e);
    } finally {
      setIsRefreshingFaqs(false);
    }
  };

  const handleNextFaqSet = () => {
    setFaqPageIndex((prev) => (prev + 1) % totalPages);
    setOpenFaq(-1);
  };

  const handlePrevFaqSet = () => {
    setFaqPageIndex((prev) => (prev - 1 + totalPages) % totalPages);
    setOpenFaq(-1);
  };

  const handleProtectedAction = (path) => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: path } });
    } else {
      navigate(path);
    }
  };

  const scrollToServices = () => {
    const el = document.getElementById('services');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
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

      {/* Hero Section (Full Viewport Height - 100vh Immersion) */}
      <section className="relative min-h-[calc(100vh-4.5rem)] flex flex-col justify-between items-center overflow-hidden pt-8 pb-8 px-4 sm:px-6 lg:px-8 border-b border-purple-200/70 bg-gradient-to-b from-purple-300/40 via-purple-200/30 to-[#f3e8fa]">
        {/* Background Ambient Glowing Orbs */}
        <div className="pointer-events-none absolute -top-24 -left-20 w-[30rem] h-[30rem] bg-purple-400/25 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }}></div>
        <div className="pointer-events-none absolute top-1/4 -right-20 w-[28rem] h-[28rem] bg-fuchsia-400/25 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '10s' }}></div>
        <div className="pointer-events-none absolute bottom-10 left-1/3 w-80 h-80 bg-violet-400/20 rounded-full blur-3xl"></div>

        {/* Top Spacer to balance centering */}
        <div className="hidden sm:block h-2"></div>

        {/* Center Hero Content */}
        <div className="max-w-4xl mx-auto text-center space-y-6 sm:space-y-8 relative z-10 my-auto">
          {/* Tag Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-200/70 border border-purple-300/80 text-purple-900 text-xs font-bold shadow-xs">
            <Sparkles className="w-4 h-4 text-purple-700" /> Next-Gen AI Career & Resume Intelligence Platform
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-stone-950 tracking-tight leading-[1.12]">
            Understand Your Resume. <br />
            <span className="gradient-text">Discover Your Next Career Move.</span>
          </h1>

          <p className="text-base sm:text-xl text-stone-700 max-w-2xl mx-auto leading-relaxed font-medium">
            An intelligent career companion that evaluates ATS compatibility, tailors your resume for target job descriptions, verifies course credentials, and guides freshers to ideal technical roles.
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => handleProtectedAction('/upload-resume')}
              className="w-full sm:w-auto px-9 py-4 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-sm shadow-xl shadow-purple-600/35 transition-all flex items-center justify-center gap-2.5 hover:scale-105"
            >
              <FileCheck2 className="w-5 h-5" /> Analyze My Resume
            </button>

            <button
              onClick={() => handleProtectedAction('/career-discovery-intro')}
              className="w-full sm:w-auto px-9 py-4 rounded-2xl bg-white/95 hover:bg-purple-50 text-purple-950 font-extrabold text-sm border-2 border-purple-300/80 hover:border-purple-400 shadow-md transition-all flex items-center justify-center gap-2.5 hover:scale-105"
            >
              <Compass className="w-5 h-5 text-purple-600" /> Discover My Career Path
            </button>
          </div>
        </div>

        {/* Scroll Down Indicator at Bottom of Full Viewport */}
        <div className="relative z-10 pt-4 pb-2 text-center">
          <button
            onClick={scrollToServices}
            className="group inline-flex flex-col items-center gap-1.5 text-xs font-bold text-purple-700 hover:text-purple-950 transition-colors"
          >
            <span>Scroll down to explore all services</span>
            <div className="w-7 h-7 rounded-full bg-purple-200/80 border border-purple-300 flex items-center justify-center group-hover:bg-purple-300 transition-colors animate-bounce">
              <ChevronDown className="w-4 h-4 text-purple-800" />
            </div>
          </button>
        </div>
      </section>

      {/* Services Section (Revealed Only on Scroll Down) */}
      <section id="services" className="py-20 md:py-28 bg-[#f8f4fc] border-b border-purple-200/70 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" /> All Services & Capabilities
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
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

          <div className="text-center mt-12">
            <button
              onClick={() => handleProtectedAction('/resume-services')}
              className="inline-flex items-center gap-2 text-xs font-bold text-purple-800 hover:text-purple-950 bg-white hover:bg-purple-100/60 px-7 py-3.5 rounded-xl border border-purple-300 shadow-xs transition-colors"
            >
              Explore All Services <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Dynamic Gemini FAQ Section (Showing 3 Rotating Questions) */}
      <section
        id="faq"
        className="py-20 bg-gradient-to-b from-purple-50/40 to-[#f3e8fa] relative z-10"
        onMouseEnter={() => setIsAutoRotatePaused(true)}
        onMouseLeave={() => setIsAutoRotatePaused(false)}
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-bold mb-1 shadow-xs">
              <Sparkles className="w-3.5 h-3.5" /> Powered by Google Gemini AI
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900">Frequently Asked Questions</h2>
            <p className="text-xs sm:text-sm text-stone-600">
              Top 3 daily questions curated directly from live Google Gemini resume & career queries.
            </p>

            {/* Daily Sync & Rotation Status Bar */}
            <div className="mt-4 inline-flex flex-wrap items-center justify-center gap-3 bg-white/90 border border-purple-200/80 px-4 py-2 rounded-2xl shadow-xs text-xs">
              <span className="flex items-center gap-1.5 text-purple-700 font-bold">
                <Calendar className="w-3.5 h-3.5 text-purple-600" /> Daily Sync: {dailyFaqPayload.lastUpdated}
              </span>
              <span className="text-stone-300">|</span>
              <span className="flex items-center gap-1 text-stone-600 font-medium">
                <RotateCw className="w-3 h-3 text-purple-500 animate-spin" style={{ animationDuration: '6s' }} /> Rotating Set {faqPageIndex + 1} of {totalPages}
              </span>
              <span className="text-stone-300">|</span>
              <button
                onClick={handleManualFaqRefresh}
                disabled={isRefreshingFaqs}
                className="flex items-center gap-1 text-purple-600 hover:text-purple-800 font-bold hover:underline transition-all"
                title="Refresh today's FAQs from Gemini AI"
              >
                <RefreshCw className={`w-3 h-3 ${isRefreshingFaqs ? 'animate-spin' : ''}`} />
                {isRefreshingFaqs ? 'Syncing...' : 'Sync Live'}
              </button>
            </div>
          </div>

          {/* 3 Active Rotating Questions */}
          <div className="space-y-4 min-h-[260px]">
            {displayedFaqs.map((faq, idx) => {
              const itemGlobalIndex = faqPageIndex * ITEMS_PER_VIEW + idx;
              const isItemOpen = openFaq === itemGlobalIndex;

              return (
                <div
                  key={itemGlobalIndex}
                  className="border border-purple-200/80 rounded-2xl overflow-hidden bg-[#fbf7fd] shadow-xs transition-all animate-in fade-in duration-300"
                >
                  <button
                    onClick={() => setOpenFaq(isItemOpen ? -1 : itemGlobalIndex)}
                    className="w-full p-5 text-left font-bold text-stone-800 text-sm flex items-center justify-between hover:bg-purple-100/50 transition-colors"
                  >
                    <div className="flex items-center gap-3 pr-2">
                      <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-xs shrink-0 font-bold">
                        Q{itemGlobalIndex + 1}
                      </span>
                      <span>{faq.q}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {faq.category && (
                        <span className="hidden sm:inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                          {faq.category}
                        </span>
                      )}
                      <ChevronDown className={`w-4 h-4 text-purple-500 transition-transform ${isItemOpen ? 'rotate-180' : ''}`} />
                    </div>
                  </button>
                  {isItemOpen && (
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
              );
            })}
          </div>

          {/* Carousel Rotation Controls & Pagination Dots */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-purple-200/60 text-xs">
            <button
              onClick={handlePrevFaqSet}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-purple-200 bg-white hover:bg-purple-50 text-purple-700 font-bold shadow-xs transition-colors"
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>

            {/* Pagination Dots */}
            <div className="flex items-center gap-1.5">
              {Array.from({ length: totalPages }).map((_, pIdx) => (
                <button
                  key={pIdx}
                  onClick={() => { setFaqPageIndex(pIdx); setOpenFaq(-1); }}
                  className={`h-2 rounded-full transition-all ${
                    faqPageIndex === pIdx ? 'w-6 bg-purple-600' : 'w-2 bg-purple-200 hover:bg-purple-300'
                  }`}
                  title={`Go to FAQ Set ${pIdx + 1}`}
                />
              ))}
            </div>

            <button
              onClick={handleNextFaqSet}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-purple-200 bg-white hover:bg-purple-50 text-purple-700 font-bold shadow-xs transition-colors"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
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
