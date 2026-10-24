// src/components/common/PageTransition.jsx
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

const PageTransition = () => {
  const location = useLocation();
  const [stage, setStage] = useState('hidden'); // 'entering' | 'exiting' | 'hidden'

  useEffect(() => {
    setStage('entering');
    const exitTimer = setTimeout(() => {
      setStage('exiting');
    }, 450);

    const doneTimer = setTimeout(() => {
      setStage('hidden');
    }, 750);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(doneTimer);
    };
  }, [location.pathname]);

  if (stage === 'hidden') return null;

  return (
    <div
      className={`fixed inset-0 z-50 pointer-events-none flex items-center justify-center transition-all duration-300 font-sans ${
        stage === 'entering' ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
      }`}
      style={{
        background: 'linear-gradient(135deg, rgba(46, 16, 101, 0.95) 0%, rgba(76, 29, 149, 0.95) 50%, rgba(88, 28, 135, 0.95) 100%)',
        backdropFilter: 'blur(20px)'
      }}
    >
      <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-purple-500 via-violet-500 to-fuchsia-400 flex items-center justify-center text-white shadow-2xl shadow-purple-500/60 border border-purple-300/40 animate-pulse">
          <Sparkles className="w-9 h-9 fill-white/20 text-white" />
        </div>
        <div>
          <span className="font-extrabold text-3xl sm:text-4xl text-white tracking-tight block">
            SkillSync
          </span>
          <span className="text-xs sm:text-sm text-purple-200 font-semibold tracking-wider uppercase block mt-1">
            AI Resume & Career Platform
          </span>
        </div>
      </div>
    </div>
  );
};

export default PageTransition;
