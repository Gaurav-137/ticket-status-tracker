import { User, Ticket, TicketStatus, StatusHistory } from '../types';

const API_BASE_URL = 'http://localhost:5000/api';

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

const apiFetch = async (url: string, options: RequestInit = {}) => {
    const res = await fetch(`${API_BASE_URL}${url}`, {
        headers: {
            'Content-Type': 'application/json',
        },
        ...options,
    });

    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.message || 'An API error occurred');
    }
    return data.data;
};


// --- User API ---
export const register = async (name: string, email: string): Promise<User> => {
  const user = await apiFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email }),
  });
  storeUser(user);
  return user;
};

export const login = async (email: string): Promise<User> => {
  const user = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email }),
  });
  storeUser(user);
  return user;
};

export const logout = (): Promise<void> => {
    return new Promise((resolve) => {
        removeStoredUser();
        resolve();
    });
};

export const getCurrentUser = (): Promise<User | null> => {
    return new Promise((resolve) => {
        resolve(getStoredUser());
    });
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
    return formatTicket(newTicket);
};

export const updateTicket = async (id: string, data: Partial<Pick<Ticket, 'title' | 'description'>>): Promise<Ticket> => {
    const updatedTicket = await apiFetch(`/tickets/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
    });
    return formatTicket(updatedTicket);
};

export const updateTicketStatus = async (id: string, status: TicketStatus): Promise<Ticket> => {
    const updatedTicket = await apiFetch(`/tickets/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status })
    });
    return formatTicket(updatedTicket);
};

export const deleteTicket = (id: string): Promise<void> => {
    return apiFetch(`/tickets/${id}`, { method: 'DELETE' });
};

export const getTicketHistory = async (id: string): Promise<StatusHistory[]> => {
    return apiFetch(`/tickets/${id}/history`);
};
