import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Shield, Stethoscope, HeartHandshake, UserCheck, ChevronDown, Check, LogOut } from 'lucide-react';
import { Badge } from '../ui/Badge';

export const RoleSwitcher: React.FC = () => {
  const { currentUser, availableUsers, switchUser, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'medico':
        return <Stethoscope className="w-4 h-4 text-brand-600" />;
      case 'psicologo':
        return <HeartHandshake className="w-4 h-4 text-purple-600" />;
      case 'recepcao':
        return <UserCheck className="w-4 h-4 text-blue-600" />;
      case 'admin':
        return <Shield className="w-4 h-4 text-amber-600" />;
      default:
        return <UserCheck className="w-4 h-4 text-slate-600" />;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'medico':
        return <Badge variant="brand">Médico</Badge>;
      case 'psicologo':
        return <Badge variant="purple">Psicólogo</Badge>;
      case 'recepcao':
        return <Badge variant="info">Recepção</Badge>;
      case 'admin':
        return <Badge variant="warning">Administrador</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 transition-all text-left"
        title="Alternar Papel de Acesso"
      >
        <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center flex-shrink-0">
          {getRoleIcon(currentUser.role)}
        </div>
        <div className="hidden sm:block">
          <div className="text-xs font-semibold text-slate-900 dark:text-white leading-tight">
            {currentUser.nome}
          </div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400 capitalize">
            {currentUser.role === 'medico' ? 'Psiquiatra' : currentUser.role === 'psicologo' ? 'Psicóloga' : currentUser.role}
          </div>
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 mb-1">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Alternar Perfil
              </span>
            </div>
            <div className="space-y-1">
              {availableUsers.map((user) => (
                <button
                  key={user.id}
                  onClick={() => {
                    switchUser(user.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-colors ${
                    currentUser.id === user.id
                      ? 'bg-brand-50/80 dark:bg-brand-950/40 text-brand-900 dark:text-brand-100'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
                      {getRoleIcon(user.role)}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                        {user.nome}
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">
                        {user.registroProfissional || (user.role === 'recepcao' ? 'Recepção' : 'Gestão Global')}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {getRoleBadge(user.role)}
                    {currentUser.id === user.id && <Check className="w-4 h-4 text-brand-600 ml-1" />}
                  </div>
                </button>
              ))}
            </div>

            <div className="pt-2 mt-2 border-t border-slate-100 dark:border-slate-800">
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
