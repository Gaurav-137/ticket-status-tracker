import { useState, useEffect, useCallback, useRef } from 'react';
import { Ticket, TicketStatus, User } from '../types';
import * as api from '../services/api';

export const useTickets = (user: User | null) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const lastFetchTime = useRef<number>(0);
  const fetchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasInitialized = useRef<boolean>(false);

  const fetchTickets = useCallback(async (showLoading = true, force = false) => {
    if (!user) return;
    
    const now = Date.now();
    // Prevent multiple simultaneous requests and add debouncing
    if (!force && now - lastFetchTime.current < 1000) {
      return;
    }
    
    try {
      if (showLoading) setLoading(true);
      lastFetchTime.current = now;
      
      const userTickets = await api.getTickets(user.id);
      setTickets(userTickets);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch tickets.');
      console.error(err);
    } finally {
      if (showLoading) setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user && !hasInitialized.current) {
      hasInitialized.current = true;
      fetchTickets(true, true); // Force initial fetch

      // Poll for updates every 30 seconds to reflect automated changes from backend
      const intervalId = setInterval(() => {
        fetchTickets(false); // Fetch without showing the main loading spinner
      }, 30000);

      return () => {
        clearInterval(intervalId);
        if (fetchTimeoutRef.current) {
          clearTimeout(fetchTimeoutRef.current);
        }
      };
    }
  }, [user, fetchTickets]);

  const createTicket = async (title: string, description: string) => {
    if (!user) return;
    try {
      await api.createTicket({ title, description, ownerId: user.id });
      // Use debounced refresh to avoid immediate refetch
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current);
      }
      fetchTimeoutRef.current = setTimeout(() => fetchTickets(false), 500);
    } catch (err: any) {
      setError(err.message || 'Failed to create ticket.');
      console.error(err);
    }
  };

  const updateTicket = async (id: string, data: Partial<Pick<Ticket, 'title' | 'description'>>) => {
    if (!user) return;
    try {
      await api.updateTicket(id, data);
      // Optimistic update for better UX
      setTickets(prev => prev.map(ticket => 
        ticket.id === id ? { ...ticket, ...data } : ticket
      ));
    } catch (err: any) {
      setError(err.message || 'Failed to update ticket.');
      // Revert on error
      fetchTickets(false);
      console.error(err);
    }
  };
  
  const updateTicketStatus = async (id: string, status: TicketStatus) => {
    if (!user) return;
    try {
      await api.updateTicketStatus(id, status);
      // Optimistic update for better UX
      setTickets(prev => prev.map(ticket => 
        ticket.id === id ? { ...ticket, status } : ticket
      ));
    } catch (err: any) {
      setError(err.message || 'Failed to update ticket status.');
      // Revert on error
      fetchTickets(false);
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

  return { 
    tickets, 
    loading, 
    error, 
    createTicket, 
    updateTicket, 
    updateTicketStatus, 
    deleteTicket, 
    getTicketHistory, 
    refreshTickets: () => fetchTickets(true, true) 
  };
};