import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Stethoscope, Sparkles, ArrowRight, Lock, Mail } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

interface ClinicLoginProps {
  onLoginSuccess?: () => void;
}

export const ClinicLogin: React.FC<ClinicLoginProps> = ({ onLoginSuccess }) => {
  const { professionalProfile, login } = useAuth();
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState(professionalProfile.email || '');
  const [isManual, setIsManual] = useState(false);

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    login();
    if (onLoginSuccess) onLoginSuccess();
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
            Acesso ao Consultório
          </p>
        </div>

        {!isManual ? (
          /* Modo Direto: Acesso do Profissional Solo */
          <div className="space-y-4">
            <div className="p-4 rounded-2xl border border-brand-500/40 bg-brand-950/30 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-brand-500/20 text-brand-400 flex items-center justify-center flex-shrink-0">
                  <Stethoscope className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white">{professionalProfile.nome}</h3>
                    <Badge variant="brand" size="sm">Profissional</Badge>
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5">{professionalProfile.especialidade}</p>
                  <p className="text-[10px] text-slate-400 font-mono">{professionalProfile.registroProfissional}</p>
                </div>
              </div>
              {professionalProfile.nomeConsultorio && (
                <p className="text-[11px] text-brand-300/80 border-t border-brand-500/20 pt-2">
                  {professionalProfile.nomeConsultorio}
                </p>
              )}
            </div>

            <Button
              variant="primary"
              size="lg"
              onClick={() => handleLogin()}
              className="w-full justify-center bg-brand-500 hover:bg-brand-400 text-slate-950 font-bold"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Entrar
            </Button>

            <div className="text-center pt-1">
              <button
                type="button"
                onClick={() => setIsManual(true)}
                className="text-[11px] text-slate-400 hover:text-slate-200 transition-colors"
              >
                Entrar com email e senha
              </button>
            </div>
          </div>
        ) : (
          /* Modo Manual com Email e Senha */
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="profissional@consultorio.com"
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-brand-500"
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
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-brand-500"
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

            <div className="text-center pt-1">
              <button
                type="button"
                onClick={() => setIsManual(false)}
                className="text-[11px] text-slate-400 hover:text-slate-200 transition-colors"
              >
                Voltar ao perfil do consultório
              </button>
            </div>
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
