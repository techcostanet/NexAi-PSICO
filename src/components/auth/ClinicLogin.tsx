import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ArrowRight, Lock, Mail, ShieldCheck, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { BrainJournalIcon } from '../ui/AppLogo';
import { APP_VERSION } from '../../version';

interface ClinicLoginProps {
  onLoginSuccess?: () => void;
  onBackToLanding?: () => void;
}

export const ClinicLogin: React.FC<ClinicLoginProps> = ({ onLoginSuccess }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim()) {
      setErrorMessage('Informe o e-mail de acesso ao consultório.');
      return;
    }

    if (!password.trim()) {
      setErrorMessage('Informe sua senha de acesso.');
      return;
    }

    // Autenticação no consultório
    login();
    if (onLoginSuccess) {
      onLoginSuccess();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans">
      
      {/* Brilho decorativo suave de fundo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-500/10 dark:bg-brand-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Card Principal de Login */}
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/50 dark:shadow-none space-y-6 relative z-10">
        
        {/* Topo: Logomarca (Cérebro + Diário Aberto) e Nome Alinhados */}
        <div className="text-center space-y-3">
          
          {/* Símbolo Oficial da Marca: Cérebro com Diário Aberto */}
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-700 via-brand-600 to-teal-400 text-white shadow-xl shadow-brand-500/25 p-3.5 mx-auto transition-transform hover:scale-105">
            <BrainJournalIcon />
          </div>
          
          {/* Nome do Sistema Perfeitamente Centralizado com a Logomarca */}
          <div className="space-y-1">
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              NexAi<span className="text-brand-600 dark:text-brand-400 font-extrabold">-PSICO</span>
            </h1>

            {/* Número da Versão Debaixo do Nome do Sistema */}
            <div className="flex items-center justify-center gap-1.5 pt-0.5">
              <span 
                className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800 shadow-2xs" 
                title={`Versão ativa do sistema: v${APP_VERSION}`}
              >
                v{APP_VERSION}
              </span>
              <span className="text-xs text-slate-400 dark:text-slate-600">•</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Acesso ao Consultório Clínico
              </span>
            </div>
          </div>

        </div>

        {/* Mensagem de Erro se houver */}
        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Formulário de Login */}
        <form onSubmit={handleLogin} className="space-y-5">
          
          {/* Container com cor sutil diferenciada para os campos de usuário e senha */}
          <div className="p-4 sm:p-5 bg-slate-50/80 dark:bg-slate-800/40 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-inner">
            
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                E-mail Profissional
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu.email@consultorio.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none shadow-2xs transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                Senha de Acesso
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Sua senha"
                  className="w-full pl-10 pr-10 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none shadow-2xs transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

          </div>

          {/* Botão de Entrar */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full justify-center text-sm font-bold shadow-md shadow-brand-500/20"
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Entrar no Consultório
          </Button>

        </form>

        {/* Rodapé Seguro e Certificado */}
        <div className="pt-2 text-center border-t border-slate-100 dark:border-slate-800 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Ambiente Seguro com Criptografia em Nuvem</span>
        </div>

      </div>

    </div>
  );
};
