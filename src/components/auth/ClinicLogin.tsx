import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Stethoscope, HeartHandshake, UserCheck, Shield, Sparkles, ArrowRight, Lock, Mail } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

interface ClinicLoginProps {
  onLoginSuccess?: () => void;
}

export const ClinicLogin: React.FC<ClinicLoginProps> = ({ onLoginSuccess }) => {
  const { availableUsers, login } = useAuth();
  const [selectedUserId, setSelectedUserId] = useState<string>(availableUsers[0]?.id || '');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [useManualCredentials, setUseManualCredentials] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'medico':
        return <Stethoscope className="w-5 h-5 text-brand-600" />;
      case 'psicologo':
        return <HeartHandshake className="w-5 h-5 text-purple-600" />;
      case 'recepcao':
        return <UserCheck className="w-5 h-5 text-blue-600" />;
      case 'admin':
        return <Shield className="w-5 h-5 text-amber-600" />;
      default:
        return <UserCheck className="w-5 h-5 text-slate-600" />;
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

  const handleQuickLogin = (userId: string) => {
    login(userId);
    if (onLoginSuccess) onLoginSuccess();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (useManualCredentials) {
      const user = availableUsers.find(
        (u) => u.email.toLowerCase() === email.trim().toLowerCase()
      );
      if (user) {
        login(user.id);
        if (onLoginSuccess) onLoginSuccess();
      } else {
        // Se digitou algo desconhecido, entra como o selecionado ou admin
        login(selectedUserId || availableUsers[0].id);
        if (onLoginSuccess) onLoginSuccess();
      }
    } else {
      if (selectedUserId) {
        login(selectedUserId);
        if (onLoginSuccess) onLoginSuccess();
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-950/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        
        {/* Topo / Logo */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-600 to-teal-400 text-white shadow-lg shadow-brand-500/25 mb-1">
            <Sparkles className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">NexAi-PSICO</h1>
          <p className="text-xs text-slate-400">
            Acesso Clínico Integrado
          </p>
        </div>

        {/* Alternância de Modo */}
        <div className="flex rounded-xl bg-slate-900 p-1 border border-slate-800 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setUseManualCredentials(false)}
            className={`flex-1 py-2 rounded-lg transition-all ${
              !useManualCredentials
                ? 'bg-brand-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Perfis Clínicos
          </button>
          <button
            type="button"
            onClick={() => setUseManualCredentials(true)}
            className={`flex-1 py-2 rounded-lg transition-all ${
              useManualCredentials
                ? 'bg-brand-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Credenciais
          </button>
        </div>

        {error && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs rounded-xl">
            {error}
          </div>
        )}

        {/* Modo 1: Seleção Direta de Perfil Clínico */}
        {!useManualCredentials ? (
          <div className="space-y-2.5">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block px-1">
              Selecione seu Perfil
            </span>
            {availableUsers.map((user) => {
              const isSelected = selectedUserId === user.id;
              return (
                <div
                  key={user.id}
                  onClick={() => setSelectedUserId(user.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-brand-950/40 border-brand-500/60 shadow-md shadow-brand-500/10'
                      : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-900 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center flex-shrink-0">
                      {getRoleIcon(user.role)}
                    </div>
                    <div className="text-left">
                      <div className="text-xs font-bold text-white">{user.nome}</div>
                      <div className="text-[10px] text-slate-400">
                        {user.registroProfissional || (user.role === 'recepcao' ? 'Recepção' : 'Gestão Global')}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getRoleBadge(user.role)}
                  </div>
                </div>
              );
            })}

            <Button
              variant="primary"
              size="lg"
              onClick={() => handleQuickLogin(selectedUserId)}
              className="w-full mt-4 justify-center bg-brand-500 hover:bg-brand-400 text-slate-950 font-bold"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Entrar
            </Button>
          </div>
        ) : (
          /* Modo 2: Credenciais Manuais */
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">Email Profissional</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="medico@nexai.com"
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-brand-500 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">Senha</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-brand-500 transition-colors"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full justify-center bg-brand-500 hover:bg-brand-400 text-slate-950 font-bold mt-2"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Entrar
            </Button>
          </form>
        )}

        <div className="text-center pt-2">
          <p className="text-[11px] text-slate-500">
            Ambiente Clínico Protegido • Conformidade LGPD
          </p>
        </div>

      </div>
    </div>
  );
};

