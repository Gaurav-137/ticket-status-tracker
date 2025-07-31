import { User, Ticket, TicketStatus, StatusHistory } from '../types';

// API URL with environment detection
const API_BASE_URL = (import.meta as any).env.VITE_API_URL || (
  window.location.hostname === 'localhost'
    ? 'http://localhost:5001/api'
    : 'https://ticket-status-tracker.onrender.com/api'
);

// Cache for API responses to improve performance
const apiCache = new Map();
const CACHE_DURATION = 30000; // 30 seconds

// --- Helper Functions ---
const getStoredUser = (): User | null => {
  try {
    const item = window.localStorage.getItem('currentUser');
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error('Error reading user from localStorage:', error);
    return null;
  }
};

const storeUser = (user: User): void => {
  try {
    window.localStorage.setItem('currentUser', JSON.stringify(user));
  } catch (error) {
    console.error('Error saving user to localStorage:', error);
  }
};

const removeStoredUser = (): void => {
    window.localStorage.removeItem('currentUser');
};

const getCachedResponse = (url: string) => {
  const cached = apiCache.get(url);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  return null;
};

const setCachedResponse = (url: string, data: any) => {
  apiCache.set(url, {
    data,
    timestamp: Date.now()
  });
};

const apiFetch = async (url: string, options: RequestInit = {}) => {
    const fullUrl = `${API_BASE_URL}${url}`;
    
    // Check cache for GET requests
    if (!options.method || options.method === 'GET') {
      const cached = getCachedResponse(fullUrl);
      if (cached) {
        return cached;
      }
    }
    
    try {
        const res = await fetch(fullUrl, {
            headers: {
                'Content-Type': 'application/json',
            },
            ...options,
        });

        const data = await res.json();
        if (!res.ok) {
            throw new Error(data.message || 'An API error occurred');
        }
        
        // Cache successful GET responses
        if (!options.method || options.method === 'GET') {
          setCachedResponse(fullUrl, data.data);
        }
        
        return data.data;
    } catch (error) {
        console.error(`API Error for ${fullUrl}:`, error);
        throw error;
    }
};

// Clear cache when needed
export const clearApiCache = () => {
  apiCache.clear();
};

// --- User API ---
export const register = async (name: string, email: string): Promise<User> => {
  const user = await apiFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email }),
  });
  storeUser(user);
  clearApiCache(); // Clear cache after user changes
  return user;
};

export const login = async (email: string): Promise<User> => {
  const user = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email }),
  });
  storeUser(user);
  clearApiCache(); // Clear cache after user changes
  return user;
};

export const logout = (): Promise<void> => {
    return new Promise((resolve) => {
        removeStoredUser();
        clearApiCache(); // Clear cache on logout
        resolve();
    });
};

export const getCurrentUser = (): User | null => {
    return getStoredUser();
};

// --- Ticket API ---
const formatTicket = (ticket: any): Ticket => ({
  id: ticket._id,
  title: ticket.title,
  description: ticket.description,
  status: ticket.status,
  ownerId: ticket.owner._id,
  ownerName: ticket.owner.name,
  createdAt: ticket.createdAt,
  updatedAt: ticket.updatedAt,
  history: ticket.history,
});

export const getTickets = async (ownerId: string): Promise<Ticket[]> => {
    const tickets = await apiFetch(`/tickets/user/${ownerId}`);
    return tickets.map(formatTicket);
};

export const createTicket = async (data: { title: string; description: string; ownerId: string; }): Promise<Ticket> => {
    const newTicket = await apiFetch('/tickets', {
        method: 'POST',
        body: JSON.stringify(data)
    });
    clearApiCache(); // Clear cache after creating ticket
    return formatTicket(newTicket);
};

export const updateTicket = async (id: string, data: Partial<Pick<Ticket, 'title' | 'description'>>): Promise<Ticket> => {
    const updatedTicket = await apiFetch(`/tickets/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
    });
    clearApiCache(); // Clear cache after updating ticket
    return formatTicket(updatedTicket);
};

export const updateTicketStatus = async (id: string, status: TicketStatus): Promise<Ticket> => {
    const updatedTicket = await apiFetch(`/tickets/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status })
    });
    clearApiCache(); // Clear cache after status change
    return formatTicket(updatedTicket);
};

export const deleteTicket = (id: string): Promise<void> => {
    return apiFetch(`/tickets/${id}`, { method: 'DELETE' }).then(() => {
        clearApiCache(); // Clear cache after deleting ticket
    });
};

export const getTicketHistory = async (id: string): Promise<StatusHistory[]> => {
    return apiFetch(`/tickets/${id}/history`);
};