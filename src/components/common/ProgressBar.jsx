// src/components/common/ProgressBar.jsx
import React from 'react';

const ProgressBar = ({ progress = 0, label, showPercentage = true, color = 'indigo', height = 'h-2.5' }) => {
  const clampedProgress = Math.min(100, Math.max(0, Math.round(progress)));

  const getColorClass = (c) => {
    switch (c) {
      case 'emerald':
      case 'green':
        return 'bg-emerald-500';
      case 'amber':
      case 'yellow':
        return 'bg-amber-500';
      case 'rose':
      case 'red':
        return 'bg-rose-500';
      case 'indigo':
      default:
        return 'bg-indigo-600';
    }
  };

  return (
    <div className="w-full">
      {(label || showPercentage) && (
        <div className="flex justify-between items-center text-xs font-medium text-slate-700 mb-1.5">
          {label && <span>{label}</span>}
          {showPercentage && <span>{clampedProgress}%</span>}
        </div>
      )}
      <div className={`w-full bg-slate-100 rounded-full overflow-hidden ${height}`}>
        <div
          className={`h-full transition-all duration-700 ease-out rounded-full ${getColorClass(color)}`}
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
