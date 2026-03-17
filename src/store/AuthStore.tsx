import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { IUser } from '../types/contracts';
import usersData from '../../data/users.json';

interface AuthContextType {
  currentUser: IUser | null;
  users: IUser[];
  login: (userId: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'persianas_auth_v1';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [users] = useState<IUser[]>(usersData);
  const [currentUser, setCurrentUser] = useState<IUser | null>(null);

  useEffect(() => {
    const savedUserId = localStorage.getItem(AUTH_STORAGE_KEY);
    if (savedUserId) {
      const user = users.find((u) => u.id === savedUserId);
      if (user) setCurrentUser(user);
    }
  }, [users]);

  const login = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (user) {
      setCurrentUser(user);
      localStorage.setItem(AUTH_STORAGE_KEY, userId);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{ currentUser, users, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthStore = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuthStore must be used within an AuthProvider');
  return context;
};
