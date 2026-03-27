import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import api from '@/lib/api';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: string;
  createdAt?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (data: { email: string; password: string; firstName: string; lastName: string; phone?: string }) => Promise<User>;
  logout: () => void;
  updateProfile: (data: { firstName?: string; lastName?: string; phone?: string }) => Promise<User>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('botola_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('botola_token'));
  const [isLoading, setIsLoading] = useState(false);

  const isAuthenticated = !!user && !!token;
  const isAdmin = user?.role === 'ADMIN';

  // Verify token on mount
  useEffect(() => {
    if (token && !user) {
      setIsLoading(true);
      api.get('/auth/me').then(res => {
        setUser(res.data.data);
        localStorage.setItem('botola_user', JSON.stringify(res.data.data));
      }).catch(() => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('botola_token');
        localStorage.removeItem('botola_user');
      }).finally(() => setIsLoading(false));
    }
  }, [token, user]);

  const login = useCallback(async (email: string, password: string) => {
    const res = await api.post('/auth/login', { email, password });
    const { user: u, token: t } = res.data.data;
    setUser(u);
    setToken(t);
    localStorage.setItem('botola_token', t);
    localStorage.setItem('botola_user', JSON.stringify(u));
    return u;
  }, []);

  const register = useCallback(async (data: { email: string; password: string; firstName: string; lastName: string; phone?: string }) => {
    const res = await api.post('/auth/register', data);
    const { user: u, token: t } = res.data.data;
    setUser(u);
    setToken(t);
    localStorage.setItem('botola_token', t);
    localStorage.setItem('botola_user', JSON.stringify(u));
    return u;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('botola_token');
    localStorage.removeItem('botola_user');
    window.location.href = '/login';
  }, []);

  const updateProfile = useCallback(async (data: { firstName?: string; lastName?: string; phone?: string }) => {
    const res = await api.patch('/auth/profile', data);
    const updated = res.data.data;
    setUser(updated);
    localStorage.setItem('botola_user', JSON.stringify(updated));
    return updated;
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, isAdmin, isLoading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
