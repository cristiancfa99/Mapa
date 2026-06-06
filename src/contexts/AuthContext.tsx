import React, { createContext, useContext, useState } from 'react';
import type { User } from '../types';
import { mockUser } from '../data/mockData';

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextValue>({
  user: null, isAuthenticated: false, isLoading: false,
  login: async () => false, register: async () => false,
  logout: () => {}, updateUser: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('fittrack-user');
    return saved ? JSON.parse(saved) : null;
  });
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, _password: string): Promise<boolean> => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 800));
    const loggedUser = { ...mockUser, email };
    setUser(loggedUser);
    localStorage.setItem('fittrack-user', JSON.stringify(loggedUser));
    setIsLoading(false);
    return true;
  };

  const register = async (name: string, email: string, _password: string): Promise<boolean> => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    const newUser: User = {
      ...mockUser, id: `user-${Date.now()}`,
      name, email,
      joinDate: new Date().toISOString().split('T')[0],
      stats: { totalWorkouts: 0, totalVolume: 0, totalDuration: 0, streak: 0, longestStreak: 0, thisWeekWorkouts: 0, thisWeekVolume: 0 },
      level: 1, xp: 0, xpNextLevel: 500, badges: [],
    };
    setUser(newUser);
    localStorage.setItem('fittrack-user', JSON.stringify(newUser));
    setIsLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('fittrack-user');
  };

  const updateUser = (updates: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    setUser(updated);
    localStorage.setItem('fittrack-user', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{
      user, isAuthenticated: !!user, isLoading,
      login, register, logout, updateUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
