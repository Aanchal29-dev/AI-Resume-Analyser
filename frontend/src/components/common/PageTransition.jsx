// src/components/common/PageTransition.jsx
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

const PageTransition = () => {
  const location = useLocation();
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    setAnimating(true);
    const timer = setTimeout(() => {
      setAnimating(false);
    }, 450); // 450ms purple wipe transition

    return () => clearTimeout(timer);
  }, [location.pathname]);

  if (!animating) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none overflow-hidden flex items-center justify-center font-sans">
      {/* Purple Gradient Sliding Curtain Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-violet-900 via-indigo-900 to-fuchsia-900 animate-in slide-in-from-left duration-300 ease-out flex items-center justify-center">
        {/* Glowing Brand Logo in Center */}
        <div className="flex items-center gap-3 animate-in zoom-in-75 duration-200">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-500 via-indigo-500 to-fuchsia-400 flex items-center justify-center text-white shadow-2xl shadow-purple-500/50">
            <Sparkles className="w-6 h-6 fill-white/20 animate-pulse" />
          </div>
          <div>
            <span className="font-extrabold text-2xl text-white tracking-tight block">SkillSync</span>
            <span className="text-xs text-purple-200 font-semibold tracking-wider uppercase block">Sync Your Resume & Career</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageTransition;
