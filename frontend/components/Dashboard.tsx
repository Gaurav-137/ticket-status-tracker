
import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTickets } from '../hooks/useTickets';
import TicketCard from './TicketCard';
import TicketModal from './TicketModal';
import StatsCard from './StatsCard';
import Spinner from './Spinner';
import { Ticket } from '../types';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { tickets, loading, error, createTicket, updateTicket, updateTicketStatus, deleteTicket, getTicketHistory } = useTickets(user);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);

  // Memoize sorted tickets for better performance
  const sortedTickets = useMemo(() => {
    return [...tickets].sort((a, b) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }, [tickets]);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = tickets.length;
    const open = tickets.filter(t => t.status === 'Open').length;
    const inProgress = tickets.filter(t => t.status === 'In Progress').length;
    const done = tickets.filter(t => t.status === 'Done').length;
    return { total, open, inProgress, done };
  }, [tickets]);

  const handleOpenCreateModal = () => {
    setEditingTicket(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (ticket: Ticket) => {
    setEditingTicket(ticket);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTicket(null);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">Welcome back, {user?.name}!</p>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="px-4 sm:px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl hover:scale-105 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-slate-900 transition-all duration-300 flex items-center justify-center gap-2 w-full sm:w-auto"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span className="hidden sm:inline">Create Ticket</span>
          <span className="sm:hidden">Create</span>
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Tickets"
          value={stats.total}
          icon={<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
          color="bg-gradient-to-r from-blue-500 to-blue-600"
        />
        <StatsCard
          title="Open Tickets"
          value={stats.open}
          icon={<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          color="bg-gradient-to-r from-red-500 to-red-600"
        />
        <StatsCard
          title="In Progress"
          value={stats.inProgress}
          icon={<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
          color="bg-gradient-to-r from-yellow-500 to-yellow-600"
        />
        <StatsCard
          title="Completed"
          value={stats.done}
          icon={<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          color="bg-gradient-to-r from-green-500 to-green-600"
        />
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Recent Tickets</h2>
      </div>

      {loading && tickets.length === 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-5 animate-pulse">
              <div className="flex justify-between items-start mb-4">
                <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-20"></div>
                <div className="h-6 w-6 bg-slate-200 dark:bg-slate-700 rounded"></div>
              </div>
              <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded mb-2"></div>
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded mb-4"></div>
              <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded"></div>
            </div>
          ))}
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
          <p className="text-red-600 dark:text-red-400 text-center">{error}</p>
        </div>
      )}
      
      {!loading && !error && (
        sortedTickets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedTickets.map((ticket) => (
              <TicketCard 
                key={ticket.id} 
                ticket={ticket} 
                onEdit={handleOpenEditModal} 
                onDelete={deleteTicket}
                onStatusChange={updateTicketStatus}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-blue-500 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2">No tickets yet!</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-md mx-auto">Create your first ticket to start tracking your tasks and issues efficiently.</p>
            <button
              onClick={handleOpenCreateModal}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl hover:scale-105 hover:from-blue-700 hover:to-blue-800 transition-all duration-300 inline-flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Your First Ticket
            </button>
          </div>
        )
      )}

      {isModalOpen && (
        <TicketModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          ticket={editingTicket}
          createTicket={createTicket}
          updateTicket={updateTicket}
          getTicketHistory={getTicketHistory}
        />
      )}
    </div>
  );
};

export default Dashboard;