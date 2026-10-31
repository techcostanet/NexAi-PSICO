import React from 'react';
import { Camera, LogOut, Heart, Activity } from 'lucide-react';
import { RoleSwitcher } from './RoleSwitcher';
import { Button } from '../ui/Button';
import { AppLogo } from '../ui/AppLogo';
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
          
          {/* Logo & Marca Oficial: Cérebro com Diário Aberto */}
          <AppLogo
            size="md"
            showText={true}
            showVersionBelow={true}
            subtitle="Gestão Clínica Inteligente"
            onClick={() => onNavigate('dashboard')}
          />

          {/* Ações Rápidas de Topo */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Botão de Demonstração do Diário de Emoções (para mostrar ao paciente/responsável) */}
            {modules.diarioHumor && (
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Heart className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />}
                onClick={() => onNavigate('portal_paciente')}
                className="hidden md:inline-flex border-teal-200 dark:border-teal-800/60 text-teal-700 dark:text-teal-300 hover:bg-teal-50 dark:hover:bg-teal-950/40 text-xs font-semibold"
                title="Demonstrar o Diário de Emoções para o paciente ou responsáveis"
              >
                <span>Demonstração</span>
              </Button>
            )}

            {/* Botão Digitalizar Prontuário Físico (apenas se módulo ativo) */}
            {modules.scannerFichas && (
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Camera className="w-4 h-4 text-brand-600" />}
                onClick={onOpenScanner}
                className="hidden sm:inline-flex border-brand-200 hover:border-brand-300 hover:bg-brand-50/50 text-brand-800"
              >
                <span>Scanner</span>
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
