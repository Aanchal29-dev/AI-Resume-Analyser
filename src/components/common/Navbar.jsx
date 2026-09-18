// src/components/common/Navbar.jsx
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Sparkles, Menu, X, ArrowRight } from 'lucide-react';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavClick = (anchorId) => {
    setMobileMenuOpen(false);
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const el = document.getElementById(anchorId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(anchorId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#fbf7fd]/95 backdrop-blur-md border-b border-purple-200/80 shadow-xs font-sans text-stone-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo & Product Name - SkillSync */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9.5 h-9.5 rounded-xl bg-gradient-to-tr from-purple-700 via-purple-600 to-fuchsia-500 flex items-center justify-center text-white shadow-md shadow-purple-600/30 group-hover:scale-105 transition-transform border border-purple-400/40">
            <Sparkles className="w-5 h-5 fill-white/20 text-white animate-pulse" />
          </div>
          <div>
            <span className="font-extrabold text-lg text-stone-900 tracking-tight block leading-none">
              Skill<span className="text-purple-600">Sync</span>
            </span>
            <span className="text-[10px] text-purple-700/80 font-semibold">Sync Your Resume & Career</span>
          </div>
        </Link>

        {/* Desktop Navigation Links - Styled in Purple */}
        <div className="hidden md:flex items-center gap-7 text-xs font-bold text-purple-700">
          <button onClick={() => handleNavClick('features')} className="hover:text-purple-900 hover:bg-purple-50 px-2.5 py-1 rounded-lg transition-all">
            Features
          </button>
          <button onClick={() => handleNavClick('how-it-works')} className="hover:text-purple-900 hover:bg-purple-50 px-2.5 py-1 rounded-lg transition-all">
            How It Works
          </button>
          <Link to="/resume-services" className="hover:text-purple-900 hover:bg-purple-50 px-2.5 py-1 rounded-lg transition-all">
            Services
          </Link>
          <button onClick={() => handleNavClick('faq')} className="hover:text-purple-900 hover:bg-purple-50 px-2.5 py-1 rounded-lg transition-all">
            FAQ
          </button>
        </div>

        {/* Action CTAs */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => navigate('/login')}
            className="px-4 py-2 text-xs font-bold text-purple-800 hover:text-purple-950 hover:bg-purple-100/70 rounded-xl transition-colors"
          >
            Sign In
          </button>
          <button
            onClick={() => navigate('/upload-resume')}
            className="flex items-center gap-1.5 px-4.5 py-2.5 text-xs font-extrabold text-white bg-gradient-to-r from-purple-600 via-purple-700 to-violet-700 hover:from-purple-700 hover:to-violet-800 rounded-xl shadow-md shadow-purple-600/30 transition-all hover:scale-[1.02]"
          >
            Analyze Resume <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-purple-700 hover:text-purple-950 rounded-lg"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#fdfafc] border-b border-purple-200/80 px-4 pt-3 pb-6 space-y-3 shadow-lg">
          <button onClick={() => handleNavClick('features')} className="block w-full text-left py-2 text-purple-700 font-bold hover:text-purple-900">
            Features
          </button>
          <button onClick={() => handleNavClick('how-it-works')} className="block w-full text-left py-2 text-purple-700 font-bold hover:text-purple-900">
            How It Works
          </button>
          <Link to="/resume-services" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-purple-700 font-bold hover:text-purple-900">
            Services
          </Link>
          <button onClick={() => handleNavClick('faq')} className="block w-full text-left py-2 text-purple-700 font-bold hover:text-purple-900">
            FAQ
          </button>
          <div className="pt-3 border-t border-purple-200/80 flex flex-col gap-2">
            <button
              onClick={() => { setMobileMenuOpen(false); navigate('/login'); }}
              className="w-full text-center py-2.5 text-xs font-bold text-purple-800 border border-purple-200 bg-white rounded-xl"
            >
              Sign In
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); navigate('/upload-resume'); }}
              className="w-full text-center py-2.5 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-md"
            >
              Analyze Resume
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
