import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types';
import { INITIAL_USERS } from '../services/mockData';

interface AuthContextType {
  currentUser: UserProfile;
  availableUsers: UserProfile[];
  isAuthenticated: boolean;
  login: (userId: string) => void;
  logout: () => void;
  switchUser: (userId: string) => void;
  switchRole: (role: UserRole) => void;
  isProfissionalSaude: boolean;
  isRecepcao: boolean;
  isAdmin: boolean;
  canViewClinicalData: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('nexai_clinic_auth') === 'true';
  });

  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('nexai_current_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return INITIAL_USERS[0]; // Padrão: Dr. Roberto (Médico)
  });

  useEffect(() => {
    localStorage.setItem('nexai_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('nexai_clinic_auth', isAuthenticated ? 'true' : 'false');
  }, [isAuthenticated]);

  const login = (userId: string) => {
    const user = INITIAL_USERS.find(u => u.id === userId);
    if (user) {
      setCurrentUser(user);
    }
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  const switchUser = (userId: string) => {
    const user = INITIAL_USERS.find(u => u.id === userId);
    if (user) {
      setCurrentUser(user);
    }
  };

  const switchRole = (role: UserRole) => {
    const user = INITIAL_USERS.find(u => u.role === role);
    if (user) {
      setCurrentUser(user);
    }
  };

  const isProfissionalSaude = currentUser.role === 'medico' || currentUser.role === 'psicologo' || currentUser.role === 'admin';
  const isRecepcao = currentUser.role === 'recepcao' || isProfissionalSaude;
  const isAdmin = currentUser.role === 'admin';
  const canViewClinicalData = isProfissionalSaude;

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        availableUsers: INITIAL_USERS,
        isAuthenticated,
        login,
        logout,
        switchUser,
        switchRole,
        isProfissionalSaude,
        isRecepcao,
        isAdmin,
        canViewClinicalData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
