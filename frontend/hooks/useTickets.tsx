import { useState, useEffect, useCallback } from 'react';
import { Ticket, TicketStatus, User } from '../types';
import * as api from '../services/api';

export const useTickets = (user: User | null) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTickets = useCallback(async (showLoading = true) => {
    if (!user) return;
    try {
      if(showLoading) setLoading(true);
      const userTickets = await api.getTickets(user.id);
      setTickets(userTickets);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch tickets.');
      console.error(err);
    } finally {
      if(showLoading) setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
        fetchTickets();

        // Poll for updates every 15 seconds to reflect automated changes from backend
        const intervalId = setInterval(() => {
            console.log('Polling for ticket updates...');
            fetchTickets(false); // Fetch without showing the main loading spinner
        }, 15000);

        return () => clearInterval(intervalId);
    }
  }, [user, fetchTickets]);

  const createTicket = async (title: string, description: string) => {
    if (!user) return;
    try {
      // The old api took ownerName, the new backend resolves it from ownerId
      await api.createTicket({ title, description, ownerId: user.id });
      await fetchTickets(false);
    } catch (err: any) {
      setError(err.message || 'Failed to create ticket.');
      console.error(err);
    }
  };

  const updateTicket = async (id: string, data: Partial<Pick<Ticket, 'title' | 'description'>>) => {
    if (!user) return;
    try {
      await api.updateTicket(id, data);
      await fetchTickets(false);
    } catch (err: any) {
      setError(err.message || 'Failed to update ticket.');
      console.error(err);
    }
  };
  
  const updateTicketStatus = async (id: string, status: TicketStatus) => {
    if (!user) return;
    try {
      await api.updateTicketStatus(id, status);
      await fetchTickets(false);
    } catch (err: any) {
        setError(err.message || 'Failed to update ticket status.');
        console.error(err);
    }
  };

  const deleteTicket = async (id: string) => {
    if (!user) return;
    try {
      await api.deleteTicket(id);
      // Optimistic update
      setTickets(prev => prev.filter(t => t.id !== id));
    } catch (err: any) {
      setError(err.message || 'Failed to delete ticket.');
      // Revert if failed
      fetchTickets(false);
      console.error(err);
    }
  };
  
  const getTicketHistory = async (id: string) => {
    if(!user) return [];
    try {
        return await api.getTicketHistory(id);
    } catch (err: any) {
        setError(err.message || 'Failed to get ticket history.');
        return [];
    }
  }

  return { tickets, loading, error, createTicket, updateTicket, updateTicketStatus, deleteTicket, getTicketHistory, refreshTickets: fetchTickets };
};