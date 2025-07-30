
import React, { useState, useEffect, useCallback } from 'react';
import { Ticket, StatusHistory } from '../types';
import StatusBadge from './StatusBadge';

interface TicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: Ticket | null;
  createTicket: (title: string, description: string) => Promise<void>;
  updateTicket: (id: string, data: { title: string; description: string }) => Promise<void>;
  getTicketHistory: (id: string) => Promise<StatusHistory[]>;
}

const TicketModal: React.FC<TicketModalProps> = ({ isOpen, onClose, ticket, createTicket, updateTicket, getTicketHistory }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [history, setHistory] = useState<StatusHistory[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const isEditing = ticket !== null;

  const fetchHistory = useCallback(async () => {
    if (isEditing && ticket) {
      setIsLoadingHistory(true);
      const ticketHistory = await getTicketHistory(ticket.id);
      setHistory(ticketHistory);
      setIsLoadingHistory(false);
    }
  }, [isEditing, ticket?.id, getTicketHistory]);
  
  useEffect(() => {
    if (isEditing && ticket) {
      setTitle(ticket.title);
      setDescription(ticket.description);
    } else if (!isEditing) {
      setTitle('');
      setDescription('');
      setHistory([]);
    }
  }, [isEditing, ticket?.id]);

  useEffect(() => {
    if (isEditing && ticket) {
      fetchHistory();
    }
  }, [fetchHistory, isEditing, ticket?.id]);
  
  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim()) {
      return;
    }
    
    if (isEditing) {
      await updateTicket(ticket.id, { title, description });
    } else {
      await createTicket(title, description);
    }
    onClose();
  };
  
  const timeAgo = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{isEditing ? 'Edit Ticket' : 'Create Ticket'}</h2>
          <button onClick={onClose} className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6 overflow-y-auto">
              <div className="mb-4">
                <label htmlFor="title" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Title</label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={100}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-brand-secondary focus:border-brand-secondary bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                />
              </div>
              <div className="mb-6">
                <label htmlFor="description" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={5}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-brand-secondary focus:border-brand-secondary bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                ></textarea>
              </div>

              {isEditing && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3">Status History</h3>
                  {isLoadingHistory ? <p>Loading history...</p> : (
                    <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 max-h-48 overflow-y-auto">
                        <ul>
                            {history.slice().reverse().map((h, index) => (
                                <li key={index} className="flex items-center space-x-4 mb-2 last:mb-0">
                                    <StatusBadge status={h.status} />
                                    <span className="text-sm text-slate-500 dark:text-slate-400">{timeAgo(h.timestamp)}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                  )}
                </div>
              )}

        </div>
        <div className="p-6 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-4">
          <button onClick={onClose} className="px-4 py-2 bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-200 rounded-md hover:bg-slate-300 dark:hover:bg-slate-500">Cancel</button>
          <button onClick={handleSubmit} className="px-4 py-2 bg-brand-primary text-white rounded-md hover:bg-brand-primary/90">{isEditing ? 'Save Changes' : 'Create Ticket'}</button>
        </div>
      </div>
    </div>
  );
};

export default TicketModal;