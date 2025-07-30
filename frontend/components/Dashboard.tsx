
import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTickets } from '../hooks/useTickets';
import TicketCard from './TicketCard';
import TicketModal from './TicketModal';
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
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">My Tickets</h1>
        <button
          onClick={handleOpenCreateModal}
          className="px-6 py-2 bg-brand-primary text-white font-semibold rounded-lg shadow-md hover:bg-brand-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-secondary dark:focus:ring-offset-slate-900 transition-colors"
        >
          Create Ticket
        </button>
      </div>

      {loading && tickets.length === 0 && (
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <Spinner />
            <p className="mt-4 text-slate-600 dark:text-slate-400">Loading tickets...</p>
          </div>
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
          <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-300">No tickets yet!</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2">Click "Create Ticket" to get started.</p>
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