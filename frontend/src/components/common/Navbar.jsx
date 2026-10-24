// src/components/common/Navbar.jsx
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Sparkles, Menu, X, ArrowRight, LayoutDashboard, LogOut, UserCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, logout, userProfile } = useApp();

  const handleLogoClick = (e) => {
    setMobileMenuOpen(false);
    if (location.pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      if (document.documentElement) {
        document.documentElement.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      }
      if (document.body) {
        document.body.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      }
    } else {
      navigate('/');
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }
  };

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

  const handleProtectedNavigation = (path) => {
    setMobileMenuOpen(false);
    if (!isAuthenticated) {
      navigate('/login', { state: { from: path } });
    } else {
      navigate(path);
    }
  };

  const handleLogout = () => {
    setMobileMenuOpen(false);
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#fbf7fd]/95 backdrop-blur-md border-b border-purple-200/80 shadow-xs font-sans text-stone-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo & Product Name - SkillSync */}
        <Link to="/" onClick={handleLogoClick} className="flex items-center gap-2.5 group cursor-pointer" title="Back to Top of SkillSync">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-700 via-purple-600 to-fuchsia-500 flex items-center justify-center text-white shadow-md shadow-purple-600/30 group-hover:shadow-purple-600/50 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 border border-purple-400/40">
            <Sparkles className="w-5 h-5 fill-white/20 text-white group-hover:rotate-12 transition-transform duration-300" />
          </div>
          <div>
            <span className="font-extrabold text-lg text-stone-900 tracking-tight block leading-none group-hover:text-purple-700 transition-colors">
              Skill<span className="text-purple-600">Sync</span>
            </span>
            <span className="text-[10px] text-purple-700/80 font-semibold group-hover:text-purple-900 transition-colors">Sync Your Resume & Career</span>
          </div>
        </Link>

        {/* Desktop Navigation Links with Rich Hover States */}
        <div className="hidden md:flex items-center gap-2 text-xs font-bold text-purple-800">
          <button
            onClick={() => handleNavClick('features')}
            className="px-3.5 py-2 rounded-xl text-purple-700 hover:text-purple-950 hover:bg-purple-100/90 hover:shadow-xs hover:-translate-y-0.5 active:translate-y-0 border border-transparent hover:border-purple-200/80 transition-all duration-200 cursor-pointer"
          >
            Features
          </button>
          <button
            onClick={() => handleNavClick('how-it-works')}
            className="px-3.5 py-2 rounded-xl text-purple-700 hover:text-purple-950 hover:bg-purple-100/90 hover:shadow-xs hover:-translate-y-0.5 active:translate-y-0 border border-transparent hover:border-purple-200/80 transition-all duration-200 cursor-pointer"
          >
            How It Works
          </button>
          <button
            onClick={() => handleProtectedNavigation('/resume-services')}
            className="px-3.5 py-2 rounded-xl text-purple-700 hover:text-purple-950 hover:bg-purple-100/90 hover:shadow-xs hover:-translate-y-0.5 active:translate-y-0 border border-transparent hover:border-purple-200/80 transition-all duration-200 cursor-pointer"
          >
            Services
          </button>
          <button
            onClick={() => handleNavClick('faq')}
            className="px-3.5 py-2 rounded-xl text-purple-700 hover:text-purple-950 hover:bg-purple-100/90 hover:shadow-xs hover:-translate-y-0.5 active:translate-y-0 border border-transparent hover:border-purple-200/80 transition-all duration-200 cursor-pointer"
          >
            FAQ
          </button>
        </div>

        {/* Action CTAs based on Auth status */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <button
                onClick={() => navigate('/profile')}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-100/70 border border-purple-200 text-purple-800 text-xs font-bold hover:bg-purple-100 hover:border-purple-300 transition-colors cursor-pointer"
                title="View & Edit Profile"
              >
                <UserCheck className="w-4 h-4 text-purple-600" />
                <span>
                  {userProfile?.fullName?.trim() && !['student', 'user', 'alex morgan', 'demo user', 'demo', 'candidate'].includes(userProfile.fullName.trim().toLowerCase())
                    ? userProfile.fullName.trim()
                    : 'Hello'}
                </span>
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-purple-900 bg-purple-100 hover:bg-purple-200 hover:shadow-xs hover:-translate-y-0.5 active:translate-y-0 rounded-xl transition-all duration-200 cursor-pointer"
              >
                <LayoutDashboard className="w-4 h-4" /> Workspace
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 px-3 py-2 text-xs font-bold text-stone-500 hover:text-rose-600 hover:bg-rose-50 hover:shadow-xs hover:-translate-y-0.5 rounded-xl transition-all duration-200 cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate('/login')}
                className="px-4 py-2 text-xs font-bold text-purple-800 hover:text-purple-950 hover:bg-purple-100/80 hover:shadow-xs hover:-translate-y-0.5 active:translate-y-0 rounded-xl transition-all duration-200 cursor-pointer"
              >
                Sign In
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="px-4 py-2 text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 hover:text-purple-900 hover:border-purple-300 hover:shadow-xs hover:-translate-y-0.5 active:translate-y-0 border border-purple-200 rounded-xl transition-all duration-200 cursor-pointer"
              >
                Sign Up
              </button>
              <button
                onClick={() => handleProtectedNavigation('/upload-resume')}
                className="flex items-center gap-1.5 px-5 py-2.5 text-xs font-extrabold text-white bg-gradient-to-r from-purple-600 via-purple-700 to-violet-700 hover:from-purple-700 hover:to-violet-800 rounded-xl shadow-md shadow-purple-600/30 hover:shadow-lg hover:shadow-purple-600/40 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
              >
                Analyze Resume <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </>
          )}
        </div>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-purple-700 hover:text-purple-950 hover:bg-purple-100 rounded-lg transition-colors cursor-pointer"
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
          <button onClick={() => handleProtectedNavigation('/resume-services')} className="block w-full text-left py-2 text-purple-700 font-bold hover:text-purple-900">
            Services
          </button>
          <button onClick={() => handleNavClick('faq')} className="block w-full text-left py-2 text-purple-700 font-bold hover:text-purple-900">
            FAQ
          </button>
          <div className="pt-3 border-t border-purple-200/80 flex flex-col gap-2">
            {isAuthenticated ? (
              <>
                <button
                  onClick={() => { setMobileMenuOpen(false); navigate('/dashboard'); }}
                  className="w-full text-center py-2.5 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-md flex items-center justify-center gap-2"
                >
                  <LayoutDashboard className="w-4 h-4" /> Go to Workspace
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-center py-2.5 text-xs font-bold text-rose-600 border border-rose-200 bg-rose-50 rounded-xl"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => { setMobileMenuOpen(false); navigate('/login'); }}
                  className="w-full text-center py-2.5 text-xs font-bold text-purple-800 border border-purple-200 bg-white rounded-xl"
                >
                  Sign In
                </button>
                <button
                  onClick={() => { setMobileMenuOpen(false); navigate('/signup'); }}
                  className="w-full text-center py-2.5 text-xs font-bold text-purple-700 bg-purple-50 border border-purple-200 rounded-xl"
                >
                  Create Account
                </button>
                <button
                  onClick={() => handleProtectedNavigation('/upload-resume')}
                  className="w-full text-center py-2.5 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-md"
                >
                  Analyze Resume
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
