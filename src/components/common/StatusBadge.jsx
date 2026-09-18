// src/components/common/StatusBadge.jsx
import React from 'react';

const StatusBadge = ({ status, size = 'sm' }) => {
  const getBadgeStyle = (s) => {
    switch (s) {
      case 'Fix First':
      case 'Critical':
      case 'High':
        return 'bg-rose-50 text-rose-700 border-rose-200 icon-rose';
      case 'Important':
      case 'Medium':
        return 'bg-amber-50 text-amber-700 border-amber-200 icon-amber';
      case 'Recommended':
      case 'Low':
        return 'bg-yellow-50 text-yellow-800 border-yellow-200 icon-yellow';
      case 'Passed':
      case 'Good':
      case 'Resolved':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 icon-emerald';
      default:
        return 'bg-indigo-50 text-indigo-700 border-indigo-200 icon-indigo';
    }
  };

  const sizeClasses = size === 'xs' ? 'px-2 py-0.5 text-[10px]' : size === 'lg' ? 'px-3 py-1 text-sm' : 'px-2.5 py-1 text-xs';

  return (
    <span className={`inline-flex items-center gap-1 font-semibold rounded-full border ${sizeClasses} ${getBadgeStyle(status)}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
      {status}
    </span>
  );
};

export default StatusBadge;
