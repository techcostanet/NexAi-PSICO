import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types';

export interface ProfessionalProfile {
  nome: string;
  especialidade: string;
  registroProfissional: string;
  nomeConsultorio: string;
  email: string;
  telefone: string;
}

const DEFAULT_PROFESSIONAL: ProfessionalProfile = {
  nome: 'Dr. Roberto Silveira',
  especialidade: 'Médico Psiquiatra',
  registroProfissional: 'CRM/SP 142.890 - RQE 58912',
  nomeConsultorio: 'Consultório de Psiquiatria Integrada',
  email: 'roberto.silveira@nexai.com',
  telefone: '+55 11 98765-4321',
};

interface AuthContextType {
  professionalProfile: ProfessionalProfile;
  updateProfessionalProfile: (dados: Partial<ProfessionalProfile>) => void;
  currentUser: UserProfile;
  availableUsers: UserProfile[];
  isAuthenticated: boolean;
  login: (userId?: string) => void;
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

  const [professionalProfile, setProfessionalProfile] = useState<ProfessionalProfile>(() => {
    const saved = localStorage.getItem('nexai_professional_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return DEFAULT_PROFESSIONAL;
  });

  useEffect(() => {
    localStorage.setItem('nexai_professional_profile', JSON.stringify(professionalProfile));
  }, [professionalProfile]);

  useEffect(() => {
    localStorage.setItem('nexai_clinic_auth', isAuthenticated ? 'true' : 'false');
  }, [isAuthenticated]);

  const updateProfessionalProfile = (dados: Partial<ProfessionalProfile>) => {
    setProfessionalProfile((prev) => ({ ...prev, ...dados }));
  };

  const currentUser: UserProfile = {
    id: 'usr_solo_1',
    nome: professionalProfile.nome,
    email: professionalProfile.email,
    role: 'medico',
    especialidade: professionalProfile.especialidade,
    registroProfissional: professionalProfile.registroProfissional,
  };

  const login = () => {
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  const switchUser = () => {};
  const switchRole = () => {};

  return (
    <AuthContext.Provider
      value={{
        professionalProfile,
        updateProfessionalProfile,
        currentUser,
        availableUsers: [currentUser],
        isAuthenticated,
        login,
        logout,
        switchUser,
        switchRole,
        isProfissionalSaude: true,
        isRecepcao: true,
        isAdmin: true,
        canViewClinicalData: true,
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
