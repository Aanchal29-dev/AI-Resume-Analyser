// src/components/common/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Heart, ArrowUp } from 'lucide-react';

const Footer = () => {
  const scrollToTop = (e) => {
    if (e && window.location.pathname === '/') {
      e.preventDefault();
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    if (document.documentElement) {
      document.documentElement.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }
    if (document.body) {
      document.body.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-[#dec7f1] text-stone-800 border-t border-purple-300 pt-12 pb-8 font-sans relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-purple-300/70">
          {/* Brand Col - SkillSync */}
          <div className="space-y-4 md:col-span-1">
            <Link
              to="/"
              onClick={scrollToTop}
              className="flex items-center gap-2.5 group cursor-pointer"
              title="Scroll to Top"
            >
              <div className="w-8.5 h-8.5 rounded-xl bg-gradient-to-tr from-purple-700 via-purple-600 to-fuchsia-500 flex items-center justify-center text-white shadow-md shadow-purple-600/20 group-hover:scale-105 transition-transform border border-purple-400/40">
                <Sparkles className="w-4 h-4 fill-white/20 text-white" />
              </div>
              <span className="font-extrabold text-lg text-stone-900 tracking-tight group-hover:text-purple-900 transition-colors">
                Skill<span className="text-purple-800">Sync</span>
              </span>
            </Link>
            <p className="text-xs text-stone-700 leading-relaxed font-medium">
              Sync your resume & career. An intelligent ATS analyzer and career companion designed for students and job seekers.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-purple-950 mb-3">Core Features</h4>
            <ul className="space-y-2 text-xs font-semibold text-stone-800">
              <li><Link to="/upload-resume" className="hover:text-purple-950 hover:underline transition-colors">Resume Analyzer</Link></li>
              <li><Link to="/job-matcher" className="hover:text-purple-950 hover:underline transition-colors">Job Matcher</Link></li>
              <li><Link to="/career-discovery" className="hover:text-purple-950 hover:underline transition-colors">Career Path Finder</Link></li>
              <li><Link to="/resume-builder" className="hover:text-purple-950 hover:underline transition-colors">AI Resume Builder</Link></li>
              <li><Link to="/ai-assistant" className="hover:text-purple-950 hover:underline transition-colors">AI Assistant</Link></li>
            </ul>
          </div>

          {/* Platform Services */}
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-purple-950 mb-3">Services</h4>
            <ul className="space-y-2 text-xs font-semibold text-stone-800">
              <li><Link to="/resume-services" className="hover:text-purple-950 hover:underline transition-colors">ATS Compatibility Check</Link></li>
              <li><Link to="/recommendations" className="hover:text-purple-950 hover:underline transition-colors">Skill Recommendations</Link></li>
              <li><Link to="/learning-plan" className="hover:text-purple-950 hover:underline transition-colors">Learning Roadmap</Link></li>
              <li><Link to="/history" className="hover:text-purple-950 hover:underline transition-colors">Analysis History</Link></li>
            </ul>
          </div>

          {/* Platform Status */}
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-purple-950 mb-3">Platform Status</h4>
            <div className="bg-white/90 rounded-2xl p-4 border border-purple-300/80 shadow-xs text-xs space-y-1.5">
              <div className="text-purple-950 font-extrabold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-purple-700 animate-pulse"></span> SkillSync Engine Active
              </div>
              <div className="text-stone-700 font-medium">React + AI Intelligence Architecture</div>
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-700 font-medium gap-4">
          <p>
            © 2026{' '}
            <button
              onClick={scrollToTop}
              className="font-bold text-stone-900 hover:text-purple-900 transition-colors cursor-pointer"
            >
              SkillSync
            </button>
            . All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <span>Built with</span> <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" /> <span>for Students & Job Seekers</span>
            </div>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/90 hover:bg-white text-purple-900 font-bold text-xs shadow-xs border border-purple-300 transition-all cursor-pointer hover:scale-105"
            >
              <ArrowUp className="w-3.5 h-3.5" /> Back to Top
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
