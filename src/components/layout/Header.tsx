import React from 'react';
import { Camera, Brain, Activity, Sparkles, LogOut } from 'lucide-react';
import { RoleSwitcher } from './RoleSwitcher';
import { Button } from '../ui/Button';
import { APP_VERSION } from '../../version';
import { useSaasPlan } from '../../context/SaasPlanContext';
import { useAuth } from '../../context/AuthContext';

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
  const { modules } = useSaasPlan();
  const { logout } = useAuth();

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
                <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-mono font-medium px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700" title={`Versão ativa: v${APP_VERSION}`}>
                  v{APP_VERSION}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block">Gestão Clínica Inteligente</p>
            </div>
          </div>

          {/* Ações Rápidas de Topo */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Botão Digitalizar Prontuário Físico (apenas se módulo ativo) */}
            {modules.scannerFichas && (
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Camera className="w-4 h-4 text-brand-600" />}
                onClick={onOpenScanner}
                className="hidden sm:inline-flex border-brand-200 hover:border-brand-300 hover:bg-brand-50/50 text-brand-800"
              >
                <span>Scanner Físico</span>
              </Button>
            )}

            {/* Botão Gravar Consulta IA (apenas se módulo ativo) */}
            {modules.consultaIa && (
              <Button
                variant="primary"
                size="sm"
                leftIcon={<Activity className="w-4 h-4" />}
                onClick={onOpenConsultation}
                className="hidden sm:inline-flex"
              >
                <span>Consulta IA</span>
              </Button>
            )}

            {/* Perfil do Profissional Solo */}
            <RoleSwitcher onOpenSettings={onOpenSettings} />

            {/* Botão Sair do Sistema */}
            <Button
              variant="outline"
              size="sm"
              leftIcon={<LogOut className="w-3.5 h-3.5 text-rose-500" />}
              onClick={logout}
              className="border-slate-200 dark:border-slate-700 hover:bg-rose-50 dark:hover:bg-rose-950/30 hover:border-rose-300 dark:hover:border-rose-800 text-slate-700 dark:text-slate-200 hover:text-rose-600 transition-colors"
              title="Sair do sistema e voltar para tela de login"
            >
              <span>Sair</span>
            </Button>
          </div>

        </div>
      </div>
    </header>
  );
};
