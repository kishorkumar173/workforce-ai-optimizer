import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: UserProfile;
  login: (identifier: string, password: string) => Promise<boolean>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  availableProfiles: Record<UserRole, UserProfile>;
}

const DEFAULT_PROFILES: Record<UserRole, UserProfile> = {
  EMPLOYER: {
    id: 'prof-1',
    email: 'sarah.johnson@teampulse.ai',
    full_name: 'Sarah Johnson',
    role: 'EMPLOYER',
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
  },
  ADMIN: {
    id: 'prof-2',
    email: 'alex.rivera@teampulse.ai',
    full_name: 'Alex Rivera',
    role: 'ADMIN',
    avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
  },
  EMPLOYEE: {
    id: 'prof-3',
    email: 'john.doe@teampulse.ai',
    full_name: 'John Doe',
    role: 'EMPLOYEE',
    employeeId: 'emp-1',
    employeeCode: 'EMP-1001',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
  },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const savedUser = localStorage.getItem('teampulse_user');
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch (e) {
        // fallback
      }
    }
    const role = (localStorage.getItem('teampulse_role') as UserRole) || 'EMPLOYER';
    return DEFAULT_PROFILES[role] || DEFAULT_PROFILES.EMPLOYER;
  });

  const syncStorage = (user: UserProfile, token?: string) => {
    localStorage.setItem('teampulse_user', JSON.stringify(user));
    localStorage.setItem('teampulse_role', user.role);
    localStorage.setItem('teampulse_user_name', user.full_name);
    localStorage.setItem('teampulse_user_id', user.id);
    localStorage.setItem('teampulse_user_email', user.email);
    if (user.employeeId) {
      localStorage.setItem('teampulse_user_employee_id', user.employeeId);
    } else {
      localStorage.removeItem('teampulse_user_employee_id');
    }
    if (user.employeeCode) {
      localStorage.setItem('teampulse_user_employee_code', user.employeeCode);
    } else {
      localStorage.removeItem('teampulse_user_employee_code');
    }
    if (token) {
      localStorage.setItem('teampulse_token', token);
    }
  };

  const login = async (identifier: string, password: string): Promise<boolean> => {
    const res = await api.login(identifier, password);
    if (res && res.user) {
      setCurrentUser(res.user);
      syncStorage(res.user, res.token);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('teampulse_token');
    localStorage.removeItem('teampulse_user');
    const fallback = DEFAULT_PROFILES.EMPLOYER;
    setCurrentUser(fallback);
    syncStorage(fallback);
    window.location.reload();
  };

  const switchRole = (newRole: UserRole) => {
    const target = DEFAULT_PROFILES[newRole];
    setCurrentUser(target);
    syncStorage(target);
    window.location.reload(); // Refresh to clean queries and simulate real login switch
  };

  return (
    <AuthContext.Provider
      value={{
        user: currentUser,
        login,
        logout,
        switchRole,
        availableProfiles: DEFAULT_PROFILES,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
