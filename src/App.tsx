import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { useDatabase } from './context/DatabaseContext';
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
import { GoogleIntegrationsModal } from './components/settings/GoogleIntegrationsModal';
import { PatientPortalContainer } from './components/patient-portal/PatientPortalContainer';
import { Modal } from './components/ui/Modal';
import { ArrowLeft } from 'lucide-react';
import { Button } from './components/ui/Button';

export const App: React.FC = () => {
  const { canViewClinicalData } = useAuth();
  const { pacientes, obterProntuariosDoPaciente } = useDatabase();

  const [currentView, setCurrentView] = useState<string>(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('portal') === 'true' || params.get('t') || params.get('termo')) {
      return 'portal_paciente';
    }
    return 'dashboard';
  });
  const [selectedPacienteId, setSelectedPacienteId] = useState<string | null>(null);

  // Modais de Ação Rápida
  const [isScannerModalOpen, setIsScannerModalOpen] = useState(false);
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [activeConsultationPacienteId, setActiveConsultationPacienteId] = useState<string | undefined>(undefined);

  // Handlers
  const handleSelectPaciente = (pacienteId: string) => {
    setSelectedPacienteId(pacienteId);
    setCurrentView('prontuario_detalhe');
  };

  const handleOpenScanner = (pacienteId?: string) => {
    if (pacienteId) setSelectedPacienteId(pacienteId);
    setCurrentView('scanner');
  };

  const handleOpenConsultation = (pacienteId?: string) => {
    setActiveConsultationPacienteId(pacienteId || selectedPacienteId || undefined);
    setIsConsultationModalOpen(true);
  };

  const selectedPaciente = selectedPacienteId
    ? pacientes.find((p) => p.id === selectedPacienteId)
    : null;

  // Se a rota for o Portal do Paciente (isolado como App PWA no celular)
  if (currentView === 'portal_paciente') {
    return (
      <PatientPortalContainer
        onBackToClinic={() => {
          setSelectedPacienteId(null);
          setCurrentView('dashboard');
        }}
        initialPacienteId={selectedPacienteId || undefined}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-sans">
      
      {/* Cabeçalho Global */}
      <Header
        onOpenScanner={() => handleOpenScanner()}
        onOpenConsultation={() => handleOpenConsultation()}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        onNavigate={(view) => {
          setSelectedPacienteId(null);
          setCurrentView(view);
        }}
      />

      {/* Conteúdo Principal com Sidebar */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        
        {/* Barra Lateral de Navegação Desktop */}
        <Navigation
          currentView={currentView}
          onOpenSettings={() => setIsSettingsModalOpen(true)}
          onNavigate={(view) => {
            setSelectedPacienteId(null);
            setCurrentView(view);
          }}
        />

        {/* Área de Visualização Principal */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 md:pb-8 overflow-y-auto max-w-full">
          
          {/* 1. Visão Geral / Dashboard */}
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

          {/* 4. Scanner de Prontuários Físicos (Google Drive) */}
          {currentView === 'scanner' && (
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
                  setCurrentView('portal_paciente');
                }}
              />
            </div>
          )}

          {/* 6. Módulo de Prontuários (Lista Geral de Timeline) */}
          {currentView === 'prontuarios' && (
            <div className="space-y-4">
              {pacientes.length > 0 && (
                <PatientTimeline
                  paciente={selectedPaciente || pacientes[0]}
                  prontuarios={obterProntuariosDoPaciente(selectedPaciente?.id || pacientes[0].id)}
                  onOpenScanner={() => handleOpenScanner(selectedPaciente?.id || pacientes[0].id)}
                  onOpenConsultation={() => handleOpenConsultation(selectedPaciente?.id || pacientes[0].id)}
                  onOpenPatientPortal={(pacId) => {
                    setSelectedPacienteId(pacId);
                    setCurrentView('portal_paciente');
                  }}
                />
              )}
            </div>
          )}

          {/* 7. Módulo Financeiro */}
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

      {/* Modal de Integrações Google */}
      <GoogleIntegrationsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
      />

    </div>
  );
};
