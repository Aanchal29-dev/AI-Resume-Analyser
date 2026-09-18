// src/components/common/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-stone-900 text-stone-400 border-t border-stone-800 pt-12 pb-8 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-stone-800">
          {/* Brand Col - SkillSync */}
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 text-white group">
              <div className="w-8.5 h-8.5 rounded-xl bg-gradient-to-tr from-purple-600 via-violet-600 to-fuchsia-500 flex items-center justify-center group-hover:scale-105 transition-transform border border-purple-400/40">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-extrabold text-lg text-white">Skill<span className="text-purple-400">Sync</span></span>
            </Link>
            <p className="text-xs text-stone-400 leading-relaxed">
              Sync your resume & career. An intelligent ATS analyzer and career companion designed for students and job seekers.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-purple-300 mb-3">Core Features</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/upload-resume" className="hover:text-purple-300 transition-colors">Resume Analyzer</Link></li>
              <li><Link to="/job-matcher" className="hover:text-purple-300 transition-colors">Job Matcher</Link></li>
              <li><Link to="/career-discovery" className="hover:text-purple-300 transition-colors">Career Path Finder</Link></li>
              <li><Link to="/resume-builder" className="hover:text-purple-300 transition-colors">AI Resume Builder</Link></li>
              <li><Link to="/ai-assistant" className="hover:text-purple-300 transition-colors">AI Assistant</Link></li>
            </ul>
          </div>

          {/* Platform Services */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-purple-300 mb-3">Services</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/resume-services" className="hover:text-purple-300 transition-colors">ATS Compatibility Check</Link></li>
              <li><Link to="/recommendations" className="hover:text-purple-300 transition-colors">Skill Recommendations</Link></li>
              <li><Link to="/learning-plan" className="hover:text-purple-300 transition-colors">Learning Roadmap</Link></li>
              <li><Link to="/history" className="hover:text-purple-300 transition-colors">Analysis History</Link></li>
              <li><Link to="/settings" className="hover:text-purple-300 transition-colors">Architecture & Settings</Link></li>
            </ul>
          </div>

          {/* Platform Status */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-purple-300 mb-3">Platform Status</h4>
            <div className="bg-stone-800/80 rounded-xl p-3 border border-purple-900/40 text-xs space-y-1.5">
              <div className="text-purple-300 font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></span> SkillSync Engine Active
              </div>
              <div className="text-stone-400">React + AI Intelligence Architecture</div>
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 SkillSync. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Built with</span> <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" /> <span>for Students & Job Seekers</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
