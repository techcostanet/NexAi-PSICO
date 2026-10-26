import React, { createContext, useContext, useState, useEffect } from 'react';

export interface SaasModulesState {
  diarioHumor: boolean;     // Diário de Emoções / Diário do Paciente (ATIVO por padrão)
  scannerFichas: boolean;   // Scanner de Fichas Físicas (DESATIVADO por padrão)
  consultaIa: boolean;      // Consulta com IA Gemini SOAP (DESATIVADO por padrão)
}

export interface SaasTenantConfig {
  id: string;
  nomeClinica: string;
  cnpj: string;
  planoBase: number;
  modulos: SaasModulesState;
  dataAssinatura: string;
  statusAssinatura: 'ativo' | 'pendente' | 'cancelado';
}

interface SaasPlanContextType {
  config: SaasTenantConfig;
  modules: SaasModulesState;
  isSaasAdmin: boolean;
  loginSaasAdmin: (user: string, pass: string) => boolean;
  logoutSaasAdmin: () => void;
  toggleModule: (moduleKey: keyof SaasModulesState) => void;
  setModuleActive: (moduleKey: keyof SaasModulesState, active: boolean) => void;
  updateClinicInfo: (nome: string, cnpj: string) => void;
  calculateTotalMonthly: () => number;
  upsellModalModule: keyof SaasModulesState | null;
  openUpsellModal: (moduleKey: keyof SaasModulesState) => void;
  closeUpsellModal: () => void;
}

const MODULE_PRICES: Record<keyof SaasModulesState, number> = {
  diarioHumor: 49.0,
  scannerFichas: 89.0,
  consultaIa: 149.0,
};

const INITIAL_TENANT_CONFIG: SaasTenantConfig = {
  id: 'clinica-nexai-demo',
  nomeClinica: 'NexAi Clínica Integrada',
  cnpj: '34.567.890/0001-12',
  planoBase: 199.0,
  // Conforme solicitação do usuário: somente Diário de Humor ativado no ambiente de teste
  modulos: {
    diarioHumor: true,
    scannerFichas: false,
    consultaIa: false,
  },
  dataAssinatura: '2026-01-15',
  statusAssinatura: 'ativo',
};

const SaasPlanContext = createContext<SaasPlanContextType | undefined>(undefined);

export const SaasPlanProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<SaasTenantConfig>(() => {
    const saved = localStorage.getItem('nexai_saas_tenant_config');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return INITIAL_TENANT_CONFIG;
  });

  const [isSaasAdmin, setIsSaasAdmin] = useState<boolean>(() => {
    return localStorage.getItem('nexai_saas_admin_auth') === 'true';
  });

  const [upsellModalModule, setUpsellModalModule] = useState<keyof SaasModulesState | null>(null);

  useEffect(() => {
    localStorage.setItem('nexai_saas_tenant_config', JSON.stringify(config));
  }, [config]);

  useEffect(() => {
    localStorage.setItem('nexai_saas_admin_auth', isSaasAdmin ? 'true' : 'false');
  }, [isSaasAdmin]);

  const loginSaasAdmin = (user: string, pass: string): boolean => {
    const cleanUser = user.trim().toLowerCase();
    const cleanPass = pass.trim();

    // Credenciais do Administrador Master SaaS
    if (
      (cleanUser === 'admin' || cleanUser === 'master' || cleanUser === 'admin@nexai.com') &&
      (cleanPass === 'admin123' || cleanPass === 'master2026' || cleanPass === 'admin')
    ) {
      setIsSaasAdmin(true);
      return true;
    }
    return false;
  };

  const logoutSaasAdmin = () => {
    setIsSaasAdmin(false);
  };

  const toggleModule = (moduleKey: keyof SaasModulesState) => {
    setConfig((prev) => ({
      ...prev,
      modulos: {
        ...prev.modulos,
        [moduleKey]: !prev.modulos[moduleKey],
      },
    }));
  };

  const setModuleActive = (moduleKey: keyof SaasModulesState, active: boolean) => {
    setConfig((prev) => ({
      ...prev,
      modulos: {
        ...prev.modulos,
        [moduleKey]: active,
      },
    }));
  };

  const updateClinicInfo = (nome: string, cnpj: string) => {
    setConfig((prev) => ({
      ...prev,
      nomeClinica: nome,
      cnpj,
    }));
  };

  const calculateTotalMonthly = (): number => {
    let total = config.planoBase;
    if (config.modulos.diarioHumor) total += MODULE_PRICES.diarioHumor;
    if (config.modulos.scannerFichas) total += MODULE_PRICES.scannerFichas;
    if (config.modulos.consultaIa) total += MODULE_PRICES.consultaIa;
    return total;
  };

  const openUpsellModal = (moduleKey: keyof SaasModulesState) => {
    setUpsellModalModule(moduleKey);
  };

  const closeUpsellModal = () => {
    setUpsellModalModule(null);
  };

  return (
    <SaasPlanContext.Provider
      value={{
        config,
        modules: config.modulos,
        isSaasAdmin,
        loginSaasAdmin,
        logoutSaasAdmin,
        toggleModule,
        setModuleActive,
        updateClinicInfo,
        calculateTotalMonthly,
        upsellModalModule,
        openUpsellModal,
        closeUpsellModal,
      }}
    >
      {children}
    </SaasPlanContext.Provider>
  );
};

export const useSaasPlan = () => {
  const context = useContext(SaasPlanContext);
  if (!context) {
    throw new Error('useSaasPlan deve ser usado dentro de SaasPlanProvider');
  }
  return context;
};

export { MODULE_PRICES };
