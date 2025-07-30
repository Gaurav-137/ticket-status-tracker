
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
    const checkUser = async () => {
      const storedUser = await api.getCurrentUser();
      setUser(storedUser);
      setLoading(false);
    };
    checkUser();
  }, []);

  const login = async (email: string) => {
    setLoading(true);
    const loggedInUser = await api.login(email);
    setUser(loggedInUser);
    setLoading(false);
    return loggedInUser;
  };

  const register = async (name: string, email: string) => {
    setLoading(true);
    const newUser = await api.register(name, email);
    setUser(newUser);
    setLoading(false);
    return newUser;
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