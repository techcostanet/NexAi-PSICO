import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Stethoscope, Sparkles, ArrowRight, Lock, Mail, ArrowLeft, ShieldCheck } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { APP_VERSION } from '../../version';

interface ClinicLoginProps {
  onLoginSuccess?: () => void;
  onBackToLanding?: () => void;
}

export const ClinicLogin: React.FC<ClinicLoginProps> = ({ onLoginSuccess, onBackToLanding }) => {
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans">
      
      {/* Glow suave no fundo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-500/10 dark:bg-brand-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Botão de Retorno à Landing Page */}
      {onBackToLanding && (
        <div className="w-full max-w-md mb-3 flex items-center justify-between">
          <button
            onClick={onBackToLanding}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Voltar ao Início</span>
          </button>
        </div>
      )}

      {/* Card Principal de Login */}
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/50 dark:shadow-none space-y-6 relative z-10">
        
        {/* Topo / Logo e Versão */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-700 via-brand-600 to-teal-400 text-white shadow-lg shadow-brand-500/20 mb-1">
            <Sparkles className="w-7 h-7" />
          </div>
          
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              NexAi<span className="text-brand-600 dark:text-brand-400 font-extrabold">-PSICO</span>
            </h1>
            <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-brand-50 dark:bg-brand-950/50 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800 shadow-sm" title={`Versão atual do sistema: v${APP_VERSION}`}>
              v{APP_VERSION}
            </span>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            Acesso ao Consultório Clínico
          </p>
        </div>

        {!isManual ? (
          /* Modo Direto: Acesso do Profissional Solo */
          <div className="space-y-4">
            <div className="p-4 rounded-2xl border border-teal-200/80 dark:border-teal-900/50 bg-teal-50/60 dark:bg-teal-950/30 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300 flex items-center justify-center flex-shrink-0">
                  <Stethoscope className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {professionalProfile.nome}
                    </h3>
                    <Badge variant="brand" size="sm">Profissional</Badge>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                    {professionalProfile.especialidade}
                  </p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                    {professionalProfile.registroProfissional}
                  </p>
                </div>
              </div>

              {professionalProfile.nomeConsultorio && (
                <p className="text-[11px] text-teal-800 dark:text-teal-200/90 border-t border-teal-200/50 dark:border-teal-900/40 pt-2 font-medium">
                  {professionalProfile.nomeConsultorio}
                </p>
              )}
            </div>

            <Button
              variant="primary"
              size="lg"
              onClick={() => handleLogin()}
              className="w-full justify-center text-sm font-bold shadow-md shadow-brand-500/20"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Entrar
            </Button>

            <div className="text-center pt-1">
              <button
                type="button"
                onClick={() => setIsManual(true)}
                className="text-xs text-slate-500 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400 transition-colors"
              >
                Entrar com outro email
              </button>
            </div>
          </div>
        ) : (
          /* Modo Manual com Email e Senha */
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="profissional@consultorio.com"
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Senha
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full justify-center text-sm font-bold shadow-md shadow-brand-500/20"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Entrar
            </Button>

            <div className="text-center pt-1">
              <button
                type="button"
                onClick={() => setIsManual(false)}
                className="text-xs text-slate-500 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400 transition-colors"
              >
                Voltar para perfil salvo
              </button>
            </div>
          </form>
        )}

        {/* Rodapé Seguro */}
        <div className="pt-2 text-center border-t border-slate-100 dark:border-slate-800 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Ambiente Seguro com Criptografia em Nuvem</span>
        </div>

      </div>

    </div>
  );
};
