// src/pages/LandingPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import ServiceDetailModal from '../components/common/ServiceDetailModal';
import StepDetailModal from '../components/common/StepDetailModal';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  FileCheck2,
  Compass,
  ArrowRight,
  ChevronDown,
  Upload,
  Cpu,
  Edit3,
  TrendingUp
} from 'lucide-react';
import { PLATFORM_SERVICES } from '../data/mockData';

const LandingPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useApp();
  const [openFaq, setOpenFaq] = useState(0);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedStepNumber, setSelectedStepNumber] = useState(null);

  const faqs = [
    {
      q: "How does SkillSync analyze resumes?",
      a: "Our platform parses your uploaded file (PDF, DOCX, DOC, TXT, PNG, JPG), extracts key sections (Education, Experience, Skills), and runs intelligent ATS formatting algorithms alongside semantic skill matching against target job descriptions."
    },
    {
      q: "What if I don't have a resume yet?",
      a: "No problem! Choose 'Discover My Career Path' to complete our guided questionnaire. Based on your interests and chosen field, we'll recommend top technical roles and help you build a high-impact resume from scratch."
    },
    {
      q: "Can I tailor my resume for a specific job description?",
      a: "Yes! Use our Job Matcher feature to compare your resume directly against any target job posting. You will receive a percentage match score, identified skill gaps, and AI bullet rewrites."
    },
    {
      q: "Is this platform suitable for students and fresh graduates?",
      a: "Absolutely! SkillSync is designed specifically for students, entry-level candidates, and career switchers needing clear guidance on presenting coursework, projects, and skills."
    }
  ];

  const handleProtectedAction = (path) => {
    if (!isAuthenticated) {
      navigate('/login');
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
    <div className="min-h-screen bg-[#f8f4fc] text-stone-800 flex flex-col font-sans selection:bg-purple-600 selection:text-white relative">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-10 pb-16 md:pt-16 md:pb-24 border-b border-purple-200/50 bg-gradient-to-b from-purple-100/70 via-purple-50/40 to-[#f8f4fc]">
        {/* Background Ambient Glowing Orbs */}
        <div className="pointer-events-none absolute -top-24 -left-20 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl"></div>
        <div className="pointer-events-none absolute top-1/4 -right-20 w-96 h-96 bg-fuchsia-400/20 rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-100 border border-purple-300/80 text-purple-800 text-xs font-extrabold shadow-xs">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span>Sync Your Resume & Career</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-stone-900 tracking-tight leading-tight">
              Understand Your Resume. <br />
              <span className="gradient-text">Discover Your Next Career Move.</span>
            </h1>

            <p className="text-base sm:text-lg text-stone-600 leading-relaxed font-medium">
              An intelligent career companion that evaluates your ATS compatibility, tailors your resume for target job descriptions, identifies skill gaps, and guides freshers to ideal career roles.
            </p>

            {/* Primary Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => handleProtectedAction('/upload-resume')}
                className="w-full sm:w-auto px-7 py-4 rounded-xl bg-gradient-to-r from-purple-600 via-purple-700 to-violet-700 hover:from-purple-700 hover:to-violet-800 text-white font-extrabold text-sm shadow-xl shadow-purple-600/30 transition-all flex items-center justify-center gap-2 hover:scale-[1.02]"
              >
                <FileCheck2 className="w-5 h-5" /> Analyze My Resume
              </button>
              <button
                onClick={() => handleProtectedAction('/career-discovery')}
                className="w-full sm:w-auto px-7 py-4 rounded-xl bg-white hover:bg-purple-100/60 text-stone-800 font-extrabold text-sm border border-purple-300/80 shadow-sm transition-all flex items-center justify-center gap-2 hover:scale-[1.02]"
              >
                <Compass className="w-5 h-5 text-purple-600" /> Discover My Career Path
              </button>
            </div>
          </div>

          {/* Hero Visual Mockup Card - Soft Purplish Tint */}
          <div className="mt-12 max-w-4xl mx-auto bg-[#fbf7fd] rounded-2xl p-5 sm:p-6 border border-purple-200/80 shadow-2xl relative overflow-hidden text-stone-900">
            <div className="flex items-center justify-between pb-3 border-b border-purple-200/60 text-xs text-stone-500 font-medium">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-400"></span>
                <span className="w-3 h-3 rounded-full bg-amber-400"></span>
                <span className="w-3 h-3 rounded-full bg-emerald-400"></span>
                <span className="ml-2 font-bold text-stone-800">SkillSync Dashboard Preview</span>
              </div>
              <span className="hidden sm:inline bg-purple-100 text-purple-800 border border-purple-300/70 px-3 py-1 rounded-full font-bold">Live AI Preview</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
              <div className="bg-white p-4 rounded-xl border border-purple-100 shadow-xs">
                <div className="text-xs text-stone-500 font-semibold">ATS Score</div>
                <div className="text-2xl font-extrabold text-purple-600 mt-1">84<span className="text-xs text-stone-400">/100</span></div>
                <div className="w-full bg-purple-50 h-2 rounded-full mt-2.5 overflow-hidden">
                  <div className="bg-purple-600 h-full w-[84%]"></div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-purple-100 shadow-xs">
                <div className="text-xs text-stone-500 font-semibold">Target Job Match</div>
                <div className="text-2xl font-extrabold text-violet-600 mt-1">72%</div>
                <div className="w-full bg-purple-50 h-2 rounded-full mt-2.5 overflow-hidden">
                  <div className="bg-violet-600 h-full w-[72%]"></div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-purple-100 shadow-xs">
                <div className="text-xs text-stone-500 font-semibold">Action Items Identified</div>
                <div className="text-2xl font-extrabold text-amber-600 mt-1">2 <span className="text-xs text-stone-400">Fix First</span></div>
                <div className="flex gap-1.5 mt-2">
                  <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md font-bold">Action Verbs</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Entry Cards Section */}
      <section className="py-16 bg-gradient-to-b from-[#f8f4fc] via-purple-50/50 to-white border-b border-purple-200/50 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900">Choose Your Goal</h2>
            <p className="text-sm text-stone-500 mt-2">Select the path that best fits your current career preparation stage.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Entry Card 1 */}
            <div
              onClick={() => handleProtectedAction('/upload-resume')}
              className="bg-[#fbf7fd] hover:bg-purple-100/50 rounded-3xl p-8 border-2 border-purple-200/80 hover:border-purple-600 shadow-soft shadow-card-hover cursor-pointer group transition-all"
            >
              <div className="w-12 h-12 rounded-2xl bg-purple-100/90 text-purple-700 border border-purple-300/60 flex items-center justify-center mb-6 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                <FileCheck2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-extrabold text-stone-900">I Already Have a Resume</h3>
              <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                Upload your existing PDF, DOCX, or image resume to evaluate your overall ATS score, check alignment against target job descriptions, fix weak bullet points, and recheck your score.
              </p>
              <div className="mt-6 flex items-center gap-2 text-xs font-bold text-purple-600 group-hover:translate-x-1.5 transition-transform">
                Start Resume Analysis <ArrowRight className="w-4 h-4" />
              </div>
            </div>

            {/* Entry Card 2 */}
            <div
              onClick={() => handleProtectedAction('/career-discovery')}
              className="bg-[#fbf7fd] hover:bg-purple-100/50 rounded-3xl p-8 border-2 border-purple-200/80 hover:border-purple-600 shadow-soft shadow-card-hover cursor-pointer group transition-all"
            >
              <div className="w-12 h-12 rounded-2xl bg-purple-100/90 text-purple-700 border border-purple-300/60 flex items-center justify-center mb-6 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-extrabold text-stone-900">I'm Not Sure What Career I Want</h3>
              <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                Complete an interactive guided questionnaire based on your background, preferences, and interest to discover matching career roles, skill roadmaps, and build a new resume.
              </p>
              <div className="mt-6 flex items-center gap-2 text-xs font-bold text-purple-600 group-hover:translate-x-1.5 transition-transform">
                Discover Career Path <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Connected 4-Step How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gradient-to-b from-white via-purple-50/40 to-[#f8f4fc] border-b border-purple-200/50 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900">How SkillSync Works</h2>
            <p className="text-sm text-stone-500 mt-2">Click any step to view its detailed step-by-step workflow explanation.</p>
          </div>

          {/* Connected Steps Grid with Connector Line */}
          <div className="relative">
            {/* Horizontal Line Connector on Desktop */}
            <div className="hidden lg:block absolute top-1/2 left-16 right-16 h-1.5 bg-gradient-to-r from-purple-400 via-violet-600 to-fuchsia-500 -translate-y-6 z-0 rounded-full shadow-sm"></div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
              {stepsData.map((st) => {
                const IconComponent = st.icon;

                return (
                  <div
                    key={st.number}
                    onClick={() => setSelectedStepNumber(st.number)}
                    className="bg-[#fbf7fd] p-6 rounded-3xl border border-purple-200/80 shadow-soft hover:shadow-xl hover:border-purple-500 cursor-pointer transition-all hover:-translate-y-2 group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-10 h-10 rounded-2xl bg-gradient-to-tr ${st.color} text-white font-extrabold text-sm flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                          {st.number}
                        </div>
                        <IconComponent className="w-5 h-5 text-purple-400 group-hover:text-purple-700 transition-colors" />
                      </div>

                      <h4 className="font-extrabold text-stone-900 text-base group-hover:text-purple-700 transition-colors">{st.title}</h4>
                      <p className="text-xs text-stone-500 mt-2 leading-relaxed">{st.desc}</p>
                    </div>

                    <div className="mt-6 pt-3 border-t border-purple-200/60 flex items-center justify-between text-xs font-bold text-purple-600 group-hover:translate-x-1 transition-transform">
                      <span>Click for Process Details</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section id="features" className="py-16 bg-gradient-to-b from-[#f8f4fc] via-fuchsia-50/30 to-purple-50/50 border-b border-purple-200/50 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900">Platform Services</h2>
            <p className="text-sm text-stone-500 mt-2">Click any service card to view its detailed step-by-step working process.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PLATFORM_SERVICES.slice(0, 6).map((service) => (
              <div
                key={service.id}
                onClick={() => setSelectedService(service)}
                className="bg-[#fbf7fd] hover:bg-purple-100/60 p-6 rounded-2xl border border-purple-200/80 shadow-soft hover:border-purple-500 hover:shadow-md cursor-pointer transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-purple-100/90 text-purple-700 border border-purple-300/60 flex items-center justify-center font-bold group-hover:bg-purple-600 group-hover:text-white transition-colors">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-purple-100/70 text-purple-800 border border-purple-200">
                      {service.badge}
                    </span>
                  </div>
                  <h3 className="font-bold text-stone-900 text-base group-hover:text-purple-700 transition-colors">{service.title}</h3>
                  <p className="text-xs text-stone-500 mt-2 leading-relaxed">{service.description}</p>
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
              onClick={() => navigate('/resume-services')}
              className="inline-flex items-center gap-2 text-xs font-bold text-purple-700 hover:text-purple-900 bg-white hover:bg-purple-50 px-6 py-3 rounded-xl border border-purple-300 shadow-xs"
            >
              Explore All Services <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 bg-gradient-to-b from-purple-50/50 to-[#f8f4fc] relative z-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900">Frequently Asked Questions</h2>
            <p className="text-sm text-stone-500 mt-2">Everything you need to know about SkillSync.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="border border-purple-200/80 rounded-2xl overflow-hidden bg-[#fbf7fd] shadow-xs">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
                  className="w-full p-5 text-left font-bold text-stone-800 text-sm flex items-center justify-between hover:bg-purple-100/50 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-purple-500 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5 text-xs text-stone-600 leading-relaxed border-t border-purple-200/60 pt-3 bg-white">
                    {faq.a}
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
