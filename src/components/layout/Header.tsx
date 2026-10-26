import React from 'react';
import { Camera, Brain, Activity, Sparkles, FolderSync, Heart } from 'lucide-react';
import { RoleSwitcher } from './RoleSwitcher';
import { Button } from '../ui/Button';

interface HeaderProps {
  onOpenScanner: () => void;
  onOpenConsultation: () => void;
  onOpenSettings: () => void;
  onNavigate: (view: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenScanner,
  onOpenConsultation,
  onOpenSettings,
  onNavigate,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Marca */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-700 via-brand-600 to-teal-400 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
              <Brain className="w-6 h-6 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white">
                  NexAi<span className="text-brand-600 dark:text-brand-400 font-extrabold">-PSICO</span>
                </span>
                <span className="text-[10px] bg-brand-500/10 text-brand-600 dark:text-brand-300 font-semibold px-1.5 py-0.5 rounded-md border border-brand-500/20 flex items-center gap-0.5">
                  <Sparkles className="w-2.5 h-2.5" /> IA
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block">Gestão Clínica, Prontuário IA & Google Cloud</p>
            </div>
          </div>

          {/* Ações Rápidas de Topo */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Status Sincronização Google Cloud / Botão de Configuração */}
            {/* Botão Status Sincronização Google Cloud */}
            <button
              onClick={onOpenSettings}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800 text-[11px] font-medium text-emerald-700 dark:text-emerald-300 transition-colors"
              title="Configurar Integrações Google (Gemini, Drive, Calendar)"
            >
              <FolderSync className="w-3.5 h-3.5 text-emerald-600 animate-spin" style={{ animationDuration: '8s' }} />
              <span>Google Cloud & IA</span>
            </button>

            {/* Botão Acesso Rápido ao Portal do Paciente / Diário */}
            <button
              onClick={() => onNavigate('portal_paciente')}
              className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-teal-50 hover:bg-teal-100 dark:bg-teal-950/40 dark:hover:bg-teal-900/60 border border-teal-200 dark:border-teal-800 text-[11px] font-semibold text-teal-700 dark:text-teal-300 transition-colors"
              title="Acessar App / Diário de Emoções do Paciente"
            >
              <Heart className="w-3.5 h-3.5 text-teal-600 animate-pulse" />
              <span>App do Paciente (PWA)</span>
            </button>

            {/* Botão Digitalizar Prontuário Físico */}
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Camera className="w-4 h-4 text-brand-600" />}
              onClick={onOpenScanner}
              className="hidden sm:inline-flex border-brand-200 hover:border-brand-300 hover:bg-brand-50/50 text-brand-800"
            >
              Scanner Físico
            </Button>

            {/* Botão Gravar Consulta IA */}
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Activity className="w-4 h-4" />}
              onClick={onOpenConsultation}
              className="hidden sm:inline-flex"
            >
              Consulta IA (SOAP)
            </Button>

            {/* Alternador de Perfil / RBAC */}
            <RoleSwitcher />
          </div>

        </div>
      </div>
    </header>
  );
};
