import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Stethoscope, ChevronDown, LogOut, Settings } from 'lucide-react';
import { Badge } from '../ui/Badge';

interface RoleSwitcherProps {
  onOpenSettings?: () => void;
}

export const RoleSwitcher: React.FC<RoleSwitcherProps> = ({ onOpenSettings }) => {
  const { professionalProfile, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 transition-all text-left"
        title="Perfil do Profissional"
      >
        <div className="w-7 h-7 rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center flex-shrink-0">
          <Stethoscope className="w-4 h-4" />
        </div>
        <div className="hidden sm:block">
          <div className="text-xs font-semibold text-slate-900 dark:text-white leading-tight">
            {professionalProfile.nome}
          </div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400">
            {professionalProfile.especialidade}
          </div>
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-3 z-50 animate-in fade-in zoom-in-95 duration-150 space-y-3">
            
            {/* Informações do Profissional */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  {professionalProfile.nome}
                </span>
                <Badge variant="brand" size="sm">Profissional</Badge>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {professionalProfile.especialidade}
              </p>
              <p className="text-[10px] text-slate-400 font-mono">
                {professionalProfile.registroProfissional}
              </p>
              {professionalProfile.nomeConsultorio && (
                <p className="text-[10px] text-brand-600 dark:text-brand-400 font-medium">
                  {professionalProfile.nomeConsultorio}
                </p>
              )}
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1">
              {onOpenSettings && (
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onOpenSettings();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <Settings className="w-4 h-4 text-slate-500" />
                  <span>Configurações</span>
                </button>
              )}

              <button
                onClick={() => {
                  setIsOpen(false);
                  logout();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sair</span>
              </button>
            </div>

          </div>
        </>
      )}
    </div>
  );
};
