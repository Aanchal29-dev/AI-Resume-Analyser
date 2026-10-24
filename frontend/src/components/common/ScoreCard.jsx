// src/components/common/ScoreCard.jsx
import React from 'react';

const ScoreCard = ({ title, score, maxScore = 100, subtitle, status, color = 'purple', icon: Icon, size = 'md', onClick }) => {
  const percentage = Math.min(100, Math.max(0, Math.round((score / maxScore) * 100)));
  const circumference = 2 * Math.PI * 36;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const getColorClasses = (c) => {
    switch (c) {
      case 'emerald':
      case 'green':
        return {
          stroke: 'stroke-emerald-500',
          text: 'text-emerald-600',
          bg: 'bg-emerald-50 border-emerald-200',
          badge: 'bg-emerald-100 text-emerald-800 border-emerald-300'
        };
      case 'amber':
      case 'yellow':
        return {
          stroke: 'stroke-amber-500',
          text: 'text-amber-600',
          bg: 'bg-amber-50 border-amber-200',
          badge: 'bg-amber-100 text-amber-800 border-amber-300'
        };
      case 'rose':
      case 'red':
        return {
          stroke: 'stroke-rose-500',
          text: 'text-rose-600',
          bg: 'bg-rose-50 border-rose-200',
          badge: 'bg-rose-100 text-rose-800 border-rose-300'
        };
      case 'indigo':
      case 'purple':
      default:
        return {
          stroke: 'stroke-purple-600',
          text: 'text-purple-600',
          bg: 'bg-purple-50 border-purple-200',
          badge: 'bg-purple-100 text-purple-800 border-purple-300'
        };
    }
  };

  const theme = getColorClasses(color);

  return (
    <div
      onClick={onClick}
      className={`bg-[#fbf7fd] hover:bg-purple-50/70 rounded-3xl p-6 border-2 border-purple-200/80 hover:border-purple-500 shadow-soft shadow-card-hover transition-all duration-300 flex flex-col justify-between group ${
        onClick ? 'cursor-pointer hover:-translate-y-1 hover:shadow-lg' : ''
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {Icon && (
            <div className={`p-2.5 rounded-xl ${theme.bg} ${theme.text}`}>
              <Icon className="w-5 h-5" />
            </div>
          )}
          <div>
            <h3 className="text-base font-extrabold text-stone-900 tracking-tight">{title}</h3>
            {subtitle && <p className="text-sm text-stone-600 font-medium mt-0.5">{subtitle}</p>}
          </div>
        </div>
        {status && (
          <span className={`text-xs font-bold px-3 py-1 rounded-full border shadow-2xs ${theme.badge}`}>
            {status}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between mt-3">
        <div className="flex items-baseline gap-1">
          <span className={`text-3xl sm:text-4xl font-black tracking-tight ${theme.text}`}>
            {score}
          </span>
          <span className="text-base font-bold text-stone-400">/{maxScore}</span>
        </div>

        <div className="relative w-16 h-16 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 80 80">
            <circle
              cx="40"
              cy="40"
              r="36"
              className="stroke-purple-100/70"
              strokeWidth="7"
              fill="transparent"
            />
            <circle
              cx="40"
              cy="40"
              r="36"
              className={`transition-all duration-1000 ease-out ${theme.stroke}`}
              strokeWidth="7"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>
          <span className="absolute text-sm font-extrabold text-stone-800">
            {percentage}%
          </span>
        </div>
      </div>

      {onClick && (
        <div className="mt-4 pt-2.5 border-t border-purple-100 flex items-center justify-between text-xs font-bold text-purple-700 group-hover:text-purple-900 transition-all">
          <span>Explore Detailed Breakdown</span>
          <span className="text-purple-600 font-extrabold group-hover:translate-x-1 transition-transform">→</span>
        </div>
      )}
    </div>
  );
};

export default ScoreCard;
