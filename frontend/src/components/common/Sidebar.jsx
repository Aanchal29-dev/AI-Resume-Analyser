// src/components/common/Sidebar.jsx
import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate, Link } from 'react-router-dom';
import {
  LayoutGrid,
  FileSearch,
  Briefcase,
  Compass,
  Bot,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

const Sidebar = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const { userProfile, logout, uploadedFileName, hasAnalyzedResume } = useApp();
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { name: 'Home Workspace', path: '/dashboard', icon: LayoutGrid },
    {
      name: 'Resume Analyzer',
      path: '/upload-resume',
      icon: FileSearch,
      matchPaths: ['/upload-resume', '/resume-overview', '/analysis', '/issues', '/recheck', '/corrections', '/choose-analysis']
    },
    { name: 'Job Matcher', path: '/job-matcher', icon: Briefcase },
    { name: 'Career Path', path: '/career-discovery', icon: Compass },
    { name: 'AI Assistant', path: '/ai-assistant', icon: Bot, badge: 'AI' }
  ];

  const handleSignOut = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="h-screen w-full bg-[#eee3f8] text-stone-900 flex flex-col md:flex-row font-sans selection:bg-purple-600 selection:text-white relative overflow-hidden">
      {/* Dynamic Animated Ambient Background Texture & Glowing Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-28 -left-28 w-[34rem] h-[34rem] bg-purple-500/26 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute top-1/4 -right-20 w-[30rem] h-[30rem] bg-fuchsia-500/22 rounded-full blur-3xl animate-float-reverse" />
        <div className="absolute bottom-10 left-1/3 w-[32rem] h-[32rem] bg-violet-500/26 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
        {/* Fine Micro-Dot Mesh Matrix Texture */}
        <div
          className="absolute inset-0 opacity-70"
          style={{
            backgroundImage: 'radial-gradient(rgba(124, 58, 237, 0.12) 1.5px, transparent 1.5px)',
            backgroundSize: '24px 24px'
          }}
        />
      </div>

      {/* Mobile Header Bar */}
      <div className="md:hidden bg-[#fbf7fd]/95 backdrop-blur-md border-b border-purple-200/80 px-4 py-3 flex items-center justify-between sticky top-0 z-30 shadow-xs shrink-0">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-violet-600 flex items-center justify-center text-white border border-purple-400/40">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-extrabold text-base text-purple-950">SkillSync</span>
        </Link>
        <button
          onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
          className="p-2 rounded-lg text-purple-700 hover:bg-purple-100/70"
        >
          {mobileDrawerOpen ? <X className="w-6 h-6 text-purple-700" /> : <Menu className="w-6 h-6 text-purple-700" />}
        </button>
      </div>

      {/* Floating Expand Trigger when Sidebar is entirely collapsed */}
      {collapsed && (
        <button
          type="button"
          onClick={() => setCollapsed(false)}
          className="hidden md:flex items-center gap-1.5 fixed top-3 left-3 z-50 px-3.5 py-2 rounded-xl bg-white/95 backdrop-blur-md border border-purple-300 shadow-md hover:shadow-lg text-purple-800 hover:text-purple-950 hover:bg-purple-50 hover:border-purple-400 transition-all cursor-pointer hover:scale-105 active:scale-95 group"
          title="Open Sidebar"
        >
          <Menu className="w-4 h-4 text-purple-700 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-bold text-purple-950">Sidebar</span>
          <ChevronRight className="w-3.5 h-3.5 text-purple-500 group-hover:translate-x-0.5 transition-transform" />
        </button>
      )}

      {/* Desktop Sidebar / Mobile Drawer with subtle ambient glass effects */}
      <aside
        className={`fixed md:relative top-0 z-40 h-full bg-[#fcf9fe]/95 backdrop-blur-xl border-r border-purple-200/90 flex flex-col justify-between transition-all duration-300 shadow-[4px_0_24px_-4px_rgba(147,51,234,0.06)] shrink-0 overflow-hidden ${
          collapsed ? 'w-0 border-r-0 opacity-0 pointer-events-none p-0' : 'w-64 opacity-100'
        } ${
          mobileDrawerOpen ? 'translate-x-0 w-64 opacity-100 pointer-events-auto' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Top Brand Header - SkillSync */}
        <div className="flex-1 flex flex-col min-h-0 overflow-y-auto">
          <div className="h-16 px-5 flex items-center justify-between border-b border-purple-100 shrink-0">
            <Link to="/" className="flex items-center gap-3 overflow-hidden group" title="Return to SkillSync Landing Page">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 via-violet-600 to-fuchsia-500 flex items-center justify-center text-white shrink-0 shadow-sm group-hover:scale-105 transition-transform border border-purple-400/30">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="font-black text-base text-purple-950 tracking-tight block group-hover:text-purple-700 transition-colors">
                SkillSync
              </span>
            </Link>
            <button
              onClick={() => setCollapsed(true)}
              className="hidden md:flex p-1.5 rounded-lg text-stone-400 hover:text-purple-700 hover:bg-purple-50 cursor-pointer transition-colors"
              title="Collapse Sidebar Entirely"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>

          {/* Clean Navigation Items with Rich Purple Text & Modern Symbols */}
          <nav className="p-3 space-y-1.5 mt-2 flex-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.matchPaths
                ? item.matchPaths.some(p => location.pathname === p || location.pathname.startsWith(p))
                : (location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path)));

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileDrawerOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all group ${
                    isActive
                      ? 'bg-purple-100/90 text-purple-950 border border-purple-300 shadow-xs'
                      : 'text-purple-900 hover:text-purple-950 hover:bg-purple-50/80 border border-transparent'
                  }`}
                  title={item.name}
                >
                  <div className="flex items-center gap-3.5">
                    <Icon className={`w-4.5 h-4.5 shrink-0 transition-colors ${isActive ? 'text-purple-700' : 'text-purple-600/70 group-hover:text-purple-800'}`} />
                    <span className="text-xs tracking-wide">{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-md bg-purple-600 text-white">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom User Profile & Sign Out Widget */}
        <div className="p-3 border-t border-purple-100 space-y-1 shrink-0">
          <div
            onClick={() => navigate('/profile')}
            className="flex items-center gap-3 p-2 rounded-xl bg-purple-50/70 border border-purple-200/60 hover:border-purple-300 hover:bg-purple-100/50 transition-colors cursor-pointer"
            title="Manage Profile & Settings"
          >
            <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs shrink-0 border border-purple-300 shadow-xs">
              {userProfile?.fullName?.trim() && !['student', 'user', 'alex morgan', 'demo user', 'demo', 'candidate'].includes(userProfile.fullName.trim().toLowerCase())
                ? userProfile.fullName.trim().slice(0, 2).toUpperCase()
                : '👋'}
            </div>
            <div className="overflow-hidden text-left flex-1">
              <div className="text-xs font-bold text-stone-900 truncate">
                {userProfile?.fullName?.trim() && !['student', 'user', 'alex morgan', 'demo user', 'demo', 'candidate'].includes(userProfile.fullName.trim().toLowerCase())
                  ? userProfile.fullName.trim()
                  : 'Hello'}
              </div>
              <div className="text-[10px] text-purple-700/80 truncate">{userProfile.email || 'Personal Workspace'}</div>
            </div>
          </div>

          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-stone-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Workspace Content with Dynamic Ambient Layering */}
      <main className={`flex-1 h-full overflow-y-auto p-4 sm:p-6 lg:p-8 min-w-0 relative z-10 transition-all duration-300 ${collapsed ? 'md:pt-5 md:pl-28' : ''}`}>
        {children}
      </main>
    </div>
  );
};

export default Sidebar;
