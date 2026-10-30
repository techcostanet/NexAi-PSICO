import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import { useDatabase } from './context/DatabaseContext';
import { useSaasPlan } from './context/SaasPlanContext';
import { LandingPage } from './components/landing/LandingPage';
import { ClinicLogin } from './components/auth/ClinicLogin';
import { Header } from './components/layout/Header';
import { Navigation } from './components/layout/Navigation';
import { MobileBottomBar } from './components/layout/MobileBottomBar';
import { DashboardOverview } from './components/dashboard/DashboardOverview';
import { ScheduleCalendar } from './components/schedule/ScheduleCalendar';
import { PatientList } from './components/patients/PatientList';
import { PhysicalChartScanner } from './components/scanner/PhysicalChartScanner';
import { PatientTimeline } from './components/consultation/PatientTimeline';
import { FinancialDashboard } from './components/financial/FinancialDashboard';
import { ConsultationSessionModal } from './components/consultation/ConsultationSessionModal';
import { ProfessionalSettingsModal } from './components/settings/ProfessionalSettingsModal';
import { PatientPortalContainer } from './components/patient-portal/PatientPortalContainer';
import { SaasAdminLogin } from './components/saas-admin/SaasAdminLogin';
import { SaasAdminDashboard } from './components/saas-admin/SaasAdminDashboard';
import { ArrowLeft } from 'lucide-react';
import { Button } from './components/ui/Button';

type AppRoute = 'landing' | 'login' | 'psico' | 'admin' | 'portal';

const resolveInitialRoute = (): AppRoute => {
  const path = window.location.pathname.toLowerCase().replace(/\/+$/, '') || '/';
  const params = new URLSearchParams(window.location.search);

  if (path === '/admin' || params.get('admin') === 'saas' || params.get('master') === 'true') {
    return 'admin';
  }
  if (path === '/portal' || params.get('portal') === 'true' || params.get('t') || params.get('termo')) {
    return 'portal';
  }
  if (path === '/login') {
    return 'login';
  }
  if (path === '/psico') {
    return 'psico';
  }
  return 'landing';
};

export const App: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { pacientes, obterProntuariosDoPaciente } = useDatabase();
  const { modules, isSaasAdmin } = useSaasPlan();

  // Roteamento de Primeiro Nível (URLs limpas do sistema)
  const [route, setRoute] = useState<AppRoute>(resolveInitialRoute);

  // Sub-visualizações internas da clínica (/psico)
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [selectedPacienteId, setSelectedPacienteId] = useState<string | null>(null);

  // Modais de Ação Rápida
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [activeConsultationPacienteId, setActiveConsultationPacienteId] = useState<string | undefined>(undefined);

  // Função central de navegação entre rotas com atualização da URL do navegador
  const navigateRoute = (targetRoute: AppRoute, subview?: string) => {
    const routePaths: Record<AppRoute, string> = {
      landing: '/',
      login: '/login',
      psico: '/psico',
      admin: '/admin',
      portal: '/portal',
    };

    const targetPath = routePaths[targetRoute];
    if (window.location.pathname !== targetPath) {
      window.history.pushState(null, '', targetPath);
    }

    setRoute(targetRoute);
    if (subview) {
      setCurrentView(subview);
    }
  };

  // Sincronização com o histórico do navegador (botão voltar/avançar)
  useEffect(() => {
    const handlePopState = () => {
      setRoute(resolveInitialRoute());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Proteção da rota clínica /psico: se não autenticado, redireciona suavemente para /login
  useEffect(() => {
    if (route === 'psico' && !isAuthenticated) {
      navigateRoute('login');
    }
  }, [route, isAuthenticated]);

  // Redireciona caso o usuário tente acessar uma tela cujo módulo foi desativado no SaaS
  useEffect(() => {
    if (currentView === 'scanner' && !modules.scannerFichas) {
      setCurrentView('dashboard');
    }
    if (route === 'portal' && !modules.diarioHumor) {
      navigateRoute('landing');
    }
  }, [currentView, modules, route]);

  // Handlers Clínicos
  const handleSelectPaciente = (pacienteId: string) => {
    setSelectedPacienteId(pacienteId);
    setCurrentView('prontuario_detalhe');
  };

  const handleOpenScanner = (pacienteId?: string) => {
    if (!modules.scannerFichas) return;
    if (pacienteId) setSelectedPacienteId(pacienteId);
    setCurrentView('scanner');
  };

  const handleOpenConsultation = (pacienteId?: string) => {
    if (!modules.consultaIa) return;
    setActiveConsultationPacienteId(pacienteId || selectedPacienteId || undefined);
    setIsConsultationModalOpen(true);
  };

  const selectedPaciente = selectedPacienteId
    ? pacientes.find((p) => p.id === selectedPacienteId)
    : null;

  // 1. Rota Raiz (/) -> LANDING PAGE
  if (route === 'landing') {
    return (
      <LandingPage
        onGoToLogin={() => navigateRoute(isAuthenticated ? 'psico' : 'login')}
        onGoToPortalDemo={() => navigateRoute('portal')}
        onGoToAdmin={() => navigateRoute('admin')}
      />
    );
  }

  // 2. Rota de Login (/login) -> TELA DE LOGIN DO CONSULTÓRIO
  if (route === 'login') {
    return (
      <ClinicLogin
        onLoginSuccess={() => {
          navigateRoute('psico', 'dashboard');
        }}
        onBackToLanding={() => {
          navigateRoute('landing');
        }}
      />
    );
  }

  // 3. Rota Admin (/admin) -> PAINEL SAAS MASTER
  if (route === 'admin') {
    if (isSaasAdmin) {
      return (
        <SaasAdminDashboard
          onBackToClinic={() => {
            navigateRoute('psico', 'dashboard');
          }}
        />
      );
    }
    return (
      <SaasAdminLogin
        onBackToClinic={() => {
          navigateRoute('landing');
        }}
        onLoginSuccess={() => {
          setRoute('admin');
        }}
      />
    );
  }

  // 4. Rota Portal (/portal) -> DIÁRIO DO PACIENTE PWA
  if (route === 'portal') {
    return (
      <PatientPortalContainer
        onBackToClinic={() => {
          setSelectedPacienteId(null);
          navigateRoute('psico', 'dashboard');
        }}
        initialPacienteId={selectedPacienteId || undefined}
      />
    );
  }

  // 5. Rota do Consultório (/psico) -> SISTEMA CLÍNICO
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-sans">
      
      {/* Cabeçalho Global */}
      <Header
        onOpenScanner={() => handleOpenScanner()}
        onOpenConsultation={() => handleOpenConsultation()}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        onNavigate={(view) => {
          if (view === 'portal_paciente') {
            navigateRoute('portal');
          } else {
            setSelectedPacienteId(null);
            setCurrentView(view);
          }
        }}
      />

      {/* Conteúdo Principal com Sidebar */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        
        {/* Barra Lateral de Navegação Desktop */}
        <Navigation
          currentView={currentView}
          onNavigate={(view) => {
            setSelectedPacienteId(null);
            setCurrentView(view);
          }}
        />

        {/* Área de Visualização Principal */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 md:pb-8 overflow-y-auto max-w-full">
          
          {/* 1. Visão Geral */}
          {currentView === 'dashboard' && (
            <DashboardOverview
              onNavigate={setCurrentView}
              onSelectPaciente={handleSelectPaciente}
              onOpenScanner={() => handleOpenScanner()}
              onOpenConsultation={() => handleOpenConsultation()}
            />
          )}

          {/* 2. Agenda */}
          {currentView === 'agenda' && (
            <ScheduleCalendar
              onSelectPaciente={handleSelectPaciente}
              onOpenConsultationForPaciente={(pacId) => handleOpenConsultation(pacId)}
            />
          )}

          {/* 3. Lista de Pacientes */}
          {currentView === 'pacientes' && (
            <PatientList
              onSelectPaciente={handleSelectPaciente}
              onOpenScannerForPaciente={(pacId) => handleOpenScanner(pacId)}
              onOpenConsultationForPaciente={(pacId) => handleOpenConsultation(pacId)}
            />
          )}

          {/* 4. Scanner de Fichas (somente se módulo ativo) */}
          {currentView === 'scanner' && modules.scannerFichas && (
            <PhysicalChartScanner
              initialPacienteId={selectedPacienteId || undefined}
              onFinished={() => {
                if (selectedPacienteId) {
                  setCurrentView('prontuario_detalhe');
                } else {
                  setCurrentView('pacientes');
                }
              }}
            />
          )}

          {/* 5. Detalhes do Prontuário / Timeline Clínica */}
          {currentView === 'prontuario_detalhe' && selectedPaciente && (
            <div className="space-y-4">
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<ArrowLeft className="w-4 h-4" />}
                onClick={() => setCurrentView('pacientes')}
                className="text-slate-600 dark:text-slate-400"
              >
                Voltar para Lista de Pacientes
              </Button>

              <PatientTimeline
                paciente={selectedPaciente}
                prontuarios={obterProntuariosDoPaciente(selectedPaciente.id)}
                onOpenScanner={() => handleOpenScanner(selectedPaciente.id)}
                onOpenConsultation={() => handleOpenConsultation(selectedPaciente.id)}
                onOpenPatientPortal={(pacId) => {
                  setSelectedPacienteId(pacId);
                  navigateRoute('portal');
                }}
              />
            </div>
          )}

          {/* 6. Módulo Financeiro */}
          {currentView === 'financeiro' && <FinancialDashboard />}

        </main>
      </div>

      {/* Menu Inferior Mobile (PWA Smartphone) */}
      <MobileBottomBar
        currentView={currentView}
        onNavigate={(view) => {
          setSelectedPacienteId(null);
          setCurrentView(view);
        }}
        onOpenScanner={() => handleOpenScanner()}
        onOpenConsultation={() => handleOpenConsultation()}
      />

      {/* Modal de Consulta IA */}
      <ConsultationSessionModal
        isOpen={isConsultationModalOpen}
        onClose={() => setIsConsultationModalOpen(false)}
        initialPacienteId={activeConsultationPacienteId}
        onFinishedSession={(pacienteId) => {
          setSelectedPacienteId(pacienteId);
          setCurrentView('prontuario_detalhe');
        }}
      />

      {/* Modal de Configurações, Dados Cadastrais, Cores e Google */}
      <ProfessionalSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
      />

    </div>
  );
};
