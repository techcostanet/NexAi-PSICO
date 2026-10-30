import React from 'react';
import {
  LayoutDashboard,
  Calendar,
  Users,
  Camera,
  Mic,
  Receipt,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSaasPlan, SaasModulesState } from '../../context/SaasPlanContext';

interface NavigationProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentView, onNavigate }) => {
  const { logout } = useAuth();
  const { modules } = useSaasPlan();

  interface NavItem {
    id: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    moduleKey?: keyof SaasModulesState;
  }

  // Prontuários e Diário do Paciente agora são acessados diretamente na ficha do paciente
  const allNavItems: NavItem[] = [
    {
      id: 'dashboard',
      label: 'Visão Geral',
      icon: LayoutDashboard,
    },
    {
      id: 'agenda',
      label: 'Agenda',
      icon: Calendar,
    },
    {
      id: 'pacientes',
      label: 'Pacientes',
      icon: Users,
    },
    {
      id: 'scanner',
      label: 'Scanner',
      icon: Camera,
      moduleKey: 'scannerFichas',
    },
    {
      id: 'consulta',
      label: 'Consulta IA',
      icon: Mic,
      moduleKey: 'consultaIa',
    },
    {
      id: 'financeiro',
      label: 'Financeiro',
      icon: Receipt,
    },
  ];

  // Filtra itens desativados no SaaS para não poluir a tela do profissional
  const navItems = allNavItems.filter((item) => {
    if (item.moduleKey && !modules[item.moduleKey]) {
      return false;
    }
    return true;
  });

  return (
    <aside className="w-64 hidden md:flex flex-col border-r border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm p-4 space-y-6">
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 px-3">
            Navegação Principal
          </span>
          <nav className="mt-2 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                    isActive
                      ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20 font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Botão Sair do Sistema no Rodapé do Menu */}
        <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all duration-200"
          >
            <LogOut className="w-5 h-5 text-rose-500" />
            <span>Sair do Sistema</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
