
import React from 'react';
import { TicketStatus } from '../types';
import { STATUS_COLORS } from '../constants';

interface StatusBadgeProps {
  status: TicketStatus;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const colorClass = STATUS_COLORS[status] || 'bg-slate-500';

  return (
    <span
      className={`px-3 py-1 text-xs font-semibold text-white rounded-full ${colorClass}`}
    >
      {status}
    </span>
  );
};

export default StatusBadge;