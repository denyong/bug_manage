import React from 'react';
import { DefectStatus, DefectPriority } from '../types';

interface StatusBadgeProps {
  status?: DefectStatus;
  priority?: DefectPriority;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, priority }) => {
  if (status) {
    let colorClass = '';
    switch (status) {
      case DefectStatus.OPEN:
        colorClass = 'bg-blue-100 text-blue-800 border-blue-200';
        break;
      case DefectStatus.IN_PROGRESS:
        colorClass = 'bg-yellow-100 text-yellow-800 border-yellow-200';
        break;
      case DefectStatus.RESOLVED:
        colorClass = 'bg-green-100 text-green-800 border-green-200';
        break;
      case DefectStatus.CLOSED:
        colorClass = 'bg-gray-100 text-gray-800 border-gray-200';
        break;
    }
    return (
      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${colorClass}`}>
        {status}
      </span>
    );
  }

  if (priority) {
    let colorClass = '';
    switch (priority) {
      case DefectPriority.LOW:
        colorClass = 'bg-slate-100 text-slate-700';
        break;
      case DefectPriority.MEDIUM:
        colorClass = 'bg-orange-100 text-orange-800';
        break;
      case DefectPriority.HIGH:
        colorClass = 'bg-red-100 text-red-800';
        break;
      case DefectPriority.CRITICAL:
        colorClass = 'bg-red-600 text-white shadow-sm';
        break;
    }
    return (
      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
        {priority}
      </span>
    );
  }

  return null;
};