import React from 'react';
import { Calendar, Users, Mic, Camera, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface MobileBottomBarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenScanner: () => void;
  onOpenConsultation: () => void;
}

export const MobileBottomBar: React.FC<MobileBottomBarProps> = ({
  currentView,
  onNavigate,
  onOpenScanner,
  onOpenConsultation,
}) => {
  const { canViewClinicalData } = useAuth();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200/80 dark:border-slate-800 px-2 py-2 flex items-center justify-around">
      
      {/* Visão Geral */}
      <button
        onClick={() => onNavigate('dashboard')}
        className={`flex flex-col items-center gap-1 p-1.5 rounded-xl transition-colors ${
          currentView === 'dashboard' ? 'text-brand-600 dark:text-brand-400 font-bold' : 'text-slate-500'
        }`}
      >
        <LayoutDashboard className="w-5 h-5" />
        <span className="text-[10px]">Início</span>
      </button>

      {/* Agenda */}
      <button
        onClick={() => onNavigate('agenda')}
        className={`flex flex-col items-center gap-1 p-1.5 rounded-xl transition-colors ${
          currentView === 'agenda' ? 'text-brand-600 dark:text-brand-400 font-bold' : 'text-slate-500'
        }`}
      >
        <Calendar className="w-5 h-5" />
        <span className="text-[10px]">Agenda</span>
      </button>

      {/* Botão Central de Ação Rápida (Gravar IA ou Scanner) */}
      <div className="relative -top-5">
        <button
          onClick={canViewClinicalData ? onOpenConsultation : onOpenScanner}
          className="w-13 h-13 p-3.5 rounded-full bg-gradient-to-tr from-brand-600 to-teal-400 text-white shadow-lg shadow-brand-500/40 flex items-center justify-center active:scale-95 transition-transform"
          title={canViewClinicalData ? 'Gravar Consulta com IA' : 'Digitalizar Prontuário Antigo'}
        >
          {canViewClinicalData ? <Mic className="w-6 h-6" /> : <Camera className="w-6 h-6" />}
        </button>
      </div>

      {/* Pacientes */}
      <button
        onClick={() => onNavigate('pacientes')}
        className={`flex flex-col items-center gap-1 p-1.5 rounded-xl transition-colors ${
          currentView === 'pacientes' ? 'text-brand-600 dark:text-brand-400 font-bold' : 'text-slate-500'
        }`}
      >
        <Users className="w-5 h-5" />
        <span className="text-[10px]">Pacientes</span>
      </button>

      {/* Scanner Físico */}
      <button
        onClick={onOpenScanner}
        className={`flex flex-col items-center gap-1 p-1.5 rounded-xl transition-colors ${
          currentView === 'scanner' ? 'text-brand-600 dark:text-brand-400 font-bold' : 'text-slate-500'
        }`}
      >
        <Camera className="w-5 h-5" />
        <span className="text-[10px]">Scanner</span>
      </button>

    </div>
  );
};
