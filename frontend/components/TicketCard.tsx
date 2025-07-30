
import React, { useState } from 'react';
import { Ticket, TicketStatus } from '../types';
import StatusBadge from './StatusBadge';
import { STATUS_WORKFLOW } from '../constants';

interface TicketCardProps {
  ticket: Ticket;
  onEdit: (ticket: Ticket) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: TicketStatus) => void;
}

const TicketCard: React.FC<TicketCardProps> = ({ ticket, onEdit, onDelete, onStatusChange }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [statusMenuOpen, setStatusMenuOpen] = useState(false);

  const timeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between">
      <div className="p-5">
        <div className="flex justify-between items-start">
          <StatusBadge status={ticket.status} />
          <div className="relative">
            <button onClick={() => setMenuOpen(!menuOpen)} className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-700 rounded-md shadow-lg z-10">
                <button onClick={() => { onEdit(ticket); setMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600">Edit / View</button>
                <button onClick={() => { onDelete(ticket.id); setMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-600">Delete</button>
              </div>
            )}
          </div>
        </div>
        <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white truncate">{ticket.title}</h3>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 h-10 overflow-hidden text-ellipsis">{ticket.description}</p>
      </div>
      <div className="px-5 py-3 bg-slate-50 dark:bg-slate-700/50 rounded-b-lg flex justify-between items-center">
        <div className="text-xs text-slate-500 dark:text-slate-400">
            Updated {timeAgo(ticket.updatedAt)}
        </div>
        <div className="relative">
            <button onClick={() => setStatusMenuOpen(!statusMenuOpen)} disabled={ticket.status === TicketStatus.Done} className="px-3 py-1 text-sm bg-brand-secondary text-white rounded-md hover:bg-brand-secondary/90 disabled:bg-slate-400 disabled:cursor-not-allowed">
                Change Status
            </button>
            {statusMenuOpen && (
                 <div className="absolute right-0 bottom-full mb-2 w-48 bg-white dark:bg-slate-700 rounded-md shadow-lg z-10">
                    {STATUS_WORKFLOW.map(status => (
                        <button 
                            key={status}
                            onClick={() => { onStatusChange(ticket.id, status); setStatusMenuOpen(false); }}
                            className="block w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600 disabled:text-slate-400"
                            disabled={ticket.status === status}
                        >
                            {status}
                        </button>
                    ))}
                 </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default TicketCard;