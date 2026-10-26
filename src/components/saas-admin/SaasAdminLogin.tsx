import React, { useState } from 'react';
import { ShieldCheck, Lock, User, ArrowLeft, KeyRound, AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { useSaasPlan } from '../../context/SaasPlanContext';

interface SaasAdminLoginProps {
  onBackToClinic: () => void;
  onLoginSuccess: () => void;
}

export const SaasAdminLogin: React.FC<SaasAdminLoginProps> = ({ onBackToClinic, onLoginSuccess }) => {
  const { loginSaasAdmin } = useSaasPlan();
  const [username, setUsername] = useState('master');
  const [password, setPassword] = useState('master2026');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      const ok = loginSaasAdmin(username, password);
      setIsLoading(false);
      if (ok) {
        onLoginSuccess();
      } else {
        setError('Credenciais inválidas. Verifique o usuário e a senha master.');
      }
    }, 400);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 text-slate-100">
      <div className="w-full max-w-md space-y-6">
        
        {/* Botão de Retorno */}
        <button
          onClick={onBackToClinic}
          className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar para Sistema Clínico</span>
        </button>

        {/* Card de Login Master */}
        <Card className="bg-slate-900/90 border-slate-800 p-8 rounded-3xl shadow-2xl backdrop-blur-xl">
          <div className="text-center space-y-2 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-slate-950 mx-auto shadow-lg shadow-amber-500/20">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Painel SaaS Master
            </h1>
            <p className="text-xs text-slate-400">
              Acesso restrito ao administrador para gestão de planos e módulos
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Usuário Master
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  placeholder="master"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Senha Master
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isLoading}
                leftIcon={<KeyRound className="w-4 h-4" />}
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold border-none shadow-lg shadow-amber-500/20"
              >
                Acessar Painel
              </Button>
            </div>
          </form>

          {/* Dica para homologação rápida */}
          <div className="mt-6 pt-4 border-t border-slate-800 text-center">
            <p className="text-[11px] text-slate-400">
              Usuário: <span className="font-mono text-amber-300">master</span> • Senha: <span className="font-mono text-amber-300">master2026</span>
            </p>
          </div>
        </Card>

      </div>
    </div>
  );
};
