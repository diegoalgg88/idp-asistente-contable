'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, TokenResponse } from '@/types/auth';
import { isValidToken } from '@/lib/security';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (data: TokenResponse, user: User) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Load auth from storage
    const storedToken = localStorage.getItem('access_token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      if (isValidToken(storedToken)) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } else {
        // Token corrupted or invalid format
        logout();
      }
    }
    setIsLoading(false);
  }, []);

  const login = (data: TokenResponse, userData: User) => {
    setToken(data.access_token);
    setUser(userData);
    localStorage.setItem('access_token', data.access_token);
    localStorage.setItem('refresh_token', data.refresh_token);
    localStorage.setItem('user', JSON.stringify(userData));
    // Also set a cookie for middleware (simplified)
    document.cookie = `auth-token=${data.access_token}; path=/; max-age=3600; SameSite=Lax`;
    navigate('/dashboard');
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
