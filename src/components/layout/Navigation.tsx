import React from 'react';
import {
  LayoutDashboard,
  Calendar,
  Users,
  Camera,
  Mic,
  Receipt,
  FileText,
  ShieldAlert,
  Heart,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface NavigationProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenSettings?: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentView, onNavigate, onOpenSettings }) => {
  const { canViewClinicalData, currentUser } = useAuth();

  const navItems = [
    {
      id: 'dashboard',
      label: 'Visão Geral & Métricas',
      icon: LayoutDashboard,
      roles: ['admin', 'medico', 'psicologo', 'recepcao'],
    },
    {
      id: 'agenda',
      label: 'Agenda & Recepção',
      icon: Calendar,
      roles: ['admin', 'medico', 'psicologo', 'recepcao'],
    },
    {
      id: 'pacientes',
      label: 'Pacientes',
      icon: Users,
      roles: ['admin', 'medico', 'psicologo', 'recepcao'],
    },
    {
      id: 'portal_paciente',
      label: 'App do Paciente (PWA)',
      icon: Heart,
      roles: ['admin', 'medico', 'psicologo', 'recepcao'],
      badge: 'Diário & Humor',
    },
    {
      id: 'scanner',
      label: 'Scanner de Fichas (Drive)',
      icon: Camera,
      roles: ['admin', 'medico', 'psicologo', 'recepcao'],
      badge: 'Passivo 1.500',
    },
    {
      id: 'consulta',
      label: 'Consulta com Áudio IA',
      icon: Mic,
      roles: ['admin', 'medico', 'psicologo'],
      badge: 'Gemini SOAP',
      clinicalOnly: true,
    },
    {
      id: 'prontuarios',
      label: 'Prontuários & Timeline',
      icon: FileText,
      roles: ['admin', 'medico', 'psicologo'],
      clinicalOnly: true,
    },
    {
      id: 'financeiro',
      label: 'Financeiro & Recibos',
      icon: Receipt,
      roles: ['admin', 'medico', 'psicologo', 'recepcao'],
    },
  ];

  return (
    <aside className="w-64 hidden md:flex flex-col border-r border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm p-4 space-y-6">
      <div>
        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 px-3">
          Navegação Principal
        </span>
        <nav className="mt-2 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isRestricted = item.clinicalOnly && !canViewClinicalData;
            const isActive = currentView === item.id;

            return (
              <button
                key={item.id}
                onClick={() => !isRestricted && onNavigate(item.id)}
                disabled={isRestricted}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                  isActive
                    ? 'bg-brand-600 text-white shadow-sm shadow-brand-500/30'
                    : isRestricted
                    ? 'text-slate-300 dark:text-slate-700 cursor-not-allowed opacity-60'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-md font-semibold ${
                      isActive
                        ? 'bg-brand-700 text-white'
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
                {isRestricted && (
                  <span title="Restrito a Médicos/Psicólogos (LGPD)">
                    <ShieldAlert className="w-3.5 h-3.5 text-slate-400" />
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {onOpenSettings && (
          <button
            onClick={onOpenSettings}
            className="mt-3 w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <span>⚙️ Integrações Google & Backup</span>
          </button>
        )}
      </div>

      {/* Box de Ajuda Rápida / Estratégia de Transição */}
      <div className="mt-auto p-3.5 rounded-2xl bg-gradient-to-br from-brand-50 to-teal-50 dark:from-brand-950/40 dark:to-slate-800/40 border border-brand-100 dark:border-brand-900/50">
        <div className="flex items-center gap-2 mb-1.5 text-brand-900 dark:text-brand-200 font-semibold text-xs">
          <span>Transição Sem Papel</span>
        </div>
        <p className="text-[11px] text-brand-700/80 dark:text-brand-300/80 leading-relaxed">
          Digitalize de 5 a 15 folhas por paciente agendado no dia. As fichas vão direto para o Google Drive em PDF!
        </p>
      </div>
    </aside>
  );
};
