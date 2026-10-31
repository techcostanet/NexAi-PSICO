import React, { useState, useEffect } from 'react';
import { useDatabase } from '../../context/DatabaseContext';
import { Paciente, ModoInterfaceEmocao, RegistroEmocao } from '../../types';
import { KidsEmotionTracker } from './KidsEmotionTracker';
import { TeenEmotionTracker } from './TeenEmotionTracker';
import { AdultEmotionTracker } from './AdultEmotionTracker';
import { InstallPwaBanner } from './InstallPwaBanner';
import { BrainJournalIcon } from '../ui/AppLogo';
import { Brain, Heart, Sparkles, Smartphone, ArrowLeft, LogOut, Lock, History, Smile, Zap, ShieldCheck } from 'lucide-react';

interface PatientPortalContainerProps {
  onBackToClinic?: () => void;
  initialPacienteId?: string;
}

export const PatientPortalContainer: React.FC<PatientPortalContainerProps> = ({
  onBackToClinic,
  initialPacienteId,
}) => {
  const { pacientes, obterPacientePorCpfOuToken, adicionarRegistroEmocao, obterEmocoesDoPaciente, atualizarConfiguracaoDiario } = useDatabase();

  const [inputTermo, setInputTermo] = useState('');
  const [erroLogin, setErroLogin] = useState<string | null>(null);
  const [pacienteAtivo, setPacienteAtivo] = useState<Paciente | null>(null);
  const [modoAtivo, setModoAtivo] = useState<ModoInterfaceEmocao>('adulto');
  const [showHistory, setShowHistory] = useState(false);
  const [abaDemo, setAbaDemo] = useState<'kids' | 'teen' | 'adulto'>('kids');

  // Inicialização caso venha ID de fora
  useEffect(() => {
    if (initialPacienteId) {
      const p = pacientes.find((item) => item.id === initialPacienteId);
      if (p) {
        setPacienteAtivo(p);
        setModoAtivo(p.configuracaoDiario?.modoInterfaceDefault || 'adulto');
      }
    }
  }, [initialPacienteId, pacientes]);

  const handleBuscarPaciente = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErroLogin(null);

    const pac = obterPacientePorCpfOuToken(inputTermo);
    if (!pac) {
      setErroLogin('Paciente não encontrado. Verifique seu CPF ou o código recebido no WhatsApp da clínica.');
      return;
    }

    setPacienteAtivo(pac);
    setModoAtivo(pac.configuracaoDiario?.modoInterfaceDefault || 'adulto');
  };

  const handleSelecionarDemo = (pacienteId: string) => {
    const pac = pacientes.find((p) => p.id === pacienteId);
    if (pac) {
      setPacienteAtivo(pac);
      setModoAtivo(pac.configuracaoDiario?.modoInterfaceDefault || 'adulto');
      setErroLogin(null);
    }
  };

  const handleSalvarEmocao = (dados: Omit<RegistroEmocao, 'id'>) => {
    if (!pacienteAtivo) return;

    adicionarRegistroEmocao({
      ...dados,
      pacienteId: pacienteAtivo.id,
      modoUsado: modoAtivo,
    });
  };

  const emocoesDoPaciente = pacienteAtivo ? obterEmocoesDoPaciente(pacienteAtivo.id) : [];

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors">
      
      {/* Barra de Topo do Portal do Paciente */}
      <header className="sticky top-0 z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 py-3 shadow-sm">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-700 to-teal-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
              <Heart className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white">
                Meu Diário <span className="text-brand-600 dark:text-brand-400 font-bold">NexAi</span>
              </span>
              <p className="text-[10px] text-slate-400">Portal do Paciente • Registro de Emoções</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onBackToClinic && (
              <button
                onClick={onBackToClinic}
                className="text-xs bg-slate-200/70 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors"
                title="Voltar ao Painel Médico"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Painel Médico</span>
              </button>
            )}

            {pacienteAtivo && (
              <button
                onClick={() => setPacienteAtivo(null)}
                className="text-xs text-rose-600 dark:text-rose-400 p-1.5 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                title="Sair do Diário"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>

        </div>
      </header>

      {/* Conteúdo Centralizado Mobile-First */}
      <main className="flex-1 max-w-xl w-full mx-auto p-4 sm:p-6 pb-20">
        
        {/* Banner PWA de Instalação no Celular */}
        <InstallPwaBanner />

        {!pacienteAtivo ? (
          /* TELA DE LOGIN / ACESSO DO PACIENTE */
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
            
            <div className="text-center space-y-2">
              <div className="w-14 h-14 bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
                <Brain className="w-8 h-8" />
              </div>
              <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">
                Bem-vindo ao seu Diário de Emoções
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                Digite seu CPF ou código de acesso fornecido pelo seu terapeuta para abrir seu espaço.
              </p>
            </div>

            <form onSubmit={handleBuscarPaciente} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  CPF ou Código de Acesso
                </label>
                <input
                  type="text"
                  value={inputTermo}
                  onChange={(e) => setInputTermo(e.target.value)}
                  placeholder="Ex: 128.459.789-02 ou helena-2026"
                  className="w-full px-4 py-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 dark:text-white text-slate-900"
                />
              </div>

              {erroLogin && (
                <p className="text-xs text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 p-2.5 rounded-xl border border-rose-200 dark:border-rose-800">
                  {erroLogin}
                </p>
              )}

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-lg shadow-brand-500/20 transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                ACESSAR MEU DIÁRIO
              </button>
            </form>

            {/* Demonstração Rápida para o Profissional / Testes - 15 Pacientes */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  🧪 Teste Rápido (15 Pacientes Cadastrados):
                </p>
                <span className="text-[11px] font-bold text-brand-600 bg-brand-50 dark:bg-brand-950/50 px-2 py-0.5 rounded-md">
                  {pacientes.length} Pacientes
                </span>
              </div>

              {/* Seletor de Categoria de Diário */}
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setAbaDemo('kids')}
                  className={`py-2 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                    abaDemo === 'kids'
                      ? 'bg-amber-400 text-amber-950 shadow-sm'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                  }`}
                >
                  <span>🦁</span>
                  <span>Kids ({pacientes.filter(p => p.configuracaoDiario?.modoInterfaceDefault === 'kids').length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAbaDemo('teen')}
                  className={`py-2 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                    abaDemo === 'teen'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                  }`}
                >
                  <span>⚡</span>
                  <span>Teen ({pacientes.filter(p => p.configuracaoDiario?.modoInterfaceDefault === 'teen').length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAbaDemo('adulto')}
                  className={`py-2 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                    abaDemo === 'adulto'
                      ? 'bg-teal-600 text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                  }`}
                >
                  <span>🌿</span>
                  <span>Adulto ({pacientes.filter(p => p.configuracaoDiario?.modoInterfaceDefault === 'adulto').length})</span>
                </button>
              </div>

              {/* Lista dos 5 Pacientes da Categoria Selecionada */}
              <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
                {pacientes
                  .filter((p) => p.configuracaoDiario?.modoInterfaceDefault === abaDemo)
                  .map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handleSelecionarDemo(p.id)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 text-left flex items-center justify-between transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        {p.fotoUrl ? (
                          <img
                            src={p.fotoUrl}
                            alt={p.nomeCompleto}
                            className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700 shadow-sm"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-xs text-slate-700 dark:text-slate-200">
                            {p.nomeCompleto.slice(0, 2).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-brand-600 transition-colors">
                            {p.nomeCompleto}
                          </p>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400">
                            {p.alertasMedicos?.[0] || 'Acompanhamento clínico'}
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200">
                        Abrir →
                      </span>
                    </button>
                  ))}
              </div>
            </div>

          </div>
        ) : (
          /* DIÁRIO ATIVO DO PACIENTE */
          <div className="space-y-5">
            
            {/* Cartão de Identificação do Paciente & Seletor de Modo */}
            <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <p className="text-[11px] text-slate-400 font-medium">Paciente Identificado:</p>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  {pacienteAtivo.nomeCompleto}
                </h3>
                <p className="text-[11px] text-teal-600 dark:text-teal-400 flex items-center gap-1 mt-0.5">
                  <ShieldCheck className="w-3.5 h-3.5" /> Diário Sigiloso
                </p>
              </div>

              {/* Alternador de Modo de Experiência (Kids, Teen, Adulto) */}
              <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setModoAtivo('kids')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                    modoAtivo === 'kids'
                      ? 'bg-amber-400 text-amber-950 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  <span>🦁</span> Kids
                </button>

                <button
                  type="button"
                  onClick={() => setModoAtivo('teen')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                    modoAtivo === 'teen'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  <span>⚡</span> Teen
                </button>

                <button
                  type="button"
                  onClick={() => setModoAtivo('adulto')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                    modoAtivo === 'adulto'
                      ? 'bg-teal-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  <span>🌿</span> Adulto
                </button>
              </div>
            </div>

            {/* Verificação de Permissão SaaS (Se o profissional habilitou) */}
            {pacienteAtivo.configuracaoDiario?.habilitado === false ? (
              <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 p-6 rounded-3xl text-center space-y-3">
                <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900 text-amber-600 rounded-full flex items-center justify-center mx-auto">
                  <Lock className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-amber-900 dark:text-amber-200">Diário Temporariamente Bloqueado</h4>
                <p className="text-xs text-amber-800 dark:text-amber-300 max-w-sm mx-auto">
                  O seu profissional de saúde ainda não habilitou o acesso ao seu Diário de Emoções. Converse com ele na sua próxima sessão para liberação do acesso.
                </p>
              </div>
            ) : (
              /* RENDERIZAÇÃO DO MODO ESCOLHIDO */
              <div className="bg-white dark:bg-slate-900 p-5 sm:p-7 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl">
                {modoAtivo === 'kids' && (
                  <KidsEmotionTracker
                    pacienteNome={pacienteAtivo.nomeCompleto}
                    onSalvar={handleSalvarEmocao}
                  />
                )}
                {modoAtivo === 'teen' && (
                  <TeenEmotionTracker
                    pacienteNome={pacienteAtivo.nomeCompleto}
                    onSalvar={handleSalvarEmocao}
                  />
                )}
                {modoAtivo === 'adulto' && (
                  <AdultEmotionTracker
                    pacienteNome={pacienteAtivo.nomeCompleto}
                    onSalvar={handleSalvarEmocao}
                  />
                )}
              </div>
            )}

            {/* Histórico Recente do Paciente (O que ele já registrou) */}
            {emocoesDoPaciente.length > 0 && (
              <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <History className="w-3.5 h-3.5 text-brand-600" /> Seus Registros Recentes ({emocoesDoPaciente.length})
                  </h4>
                  <button
                    onClick={() => setShowHistory(!showHistory)}
                    className="text-xs text-brand-600 hover:underline font-semibold"
                  >
                    {showHistory ? 'Ocultar' : 'Ver Todos'}
                  </button>
                </div>

                <div className="space-y-2">
                  {emocoesDoPaciente.slice(0, showHistory ? undefined : 3).map((item) => {
                    const dataFormatada = new Date(item.dataHora).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    });

                    return (
                      <div
                        key={item.id}
                        className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-lg">
                            {item.nivelHumor === 5 && '⭐'}
                            {item.nivelHumor === 4 && '😊'}
                            {item.nivelHumor === 3 && '😐'}
                            {item.nivelHumor === 2 && '🌧️'}
                            {item.nivelHumor === 1 && '🌋'}
                          </span>
                          <div>
                            <p className="font-bold text-slate-800 dark:text-slate-200">
                              {item.emocoesPrimarias.join(', ') || `Nível de Humor: ${item.nivelHumor}/5`}
                            </p>
                            {item.gatilhos.length > 0 && (
                              <p className="text-[10px] text-slate-400">
                                Gatilhos: {item.gatilhos.join(', ')}
                              </p>
                            )}
                          </div>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400 shrink-0">
                          {dataFormatada}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          </div>
        )}

      </main>

    </div>
  );
};
