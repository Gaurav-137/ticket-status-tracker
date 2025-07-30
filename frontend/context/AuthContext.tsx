
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User } from '../types';
import * as api from '../services/api';

interface AuthContextType {
  user: User | null;
  login: (email: string) => Promise<User | null>;
  register: (name: string, email: string) => Promise<User | null>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Use synchronous getCurrentUser for faster initial load
    const storedUser = api.getCurrentUser();
    setUser(storedUser);
    setLoading(false);
  }, []);

  const login = async (email: string) => {
    setLoading(true);
    try {
      const loggedInUser = await api.login(email);
      setUser(loggedInUser);
      return loggedInUser;
    } catch (error) {
      console.error('Login error:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string) => {
    setLoading(true);
    try {
      const newUser = await api.register(name, email);
      setUser(newUser);
      return newUser;
    } catch (error) {
      console.error('Registration error:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    api.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};