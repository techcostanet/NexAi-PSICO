import React, { useState } from 'react';
import { NivelHumor, RegistroEmocao } from '../../types';
import { Heart, Moon, Pill, Sparkles, CheckCircle2, ShieldCheck, Palette, Activity, Brain } from 'lucide-react';

interface AdultEmotionTrackerProps {
  pacienteNome: string;
  onSalvar: (dados: Omit<RegistroEmocao, 'id'>) => void;
  temaPadrao?: string;
  onAtualizarPreferencia?: (tema: string) => void;
}

const ADULT_MOODS: { nivel: NivelHumor; label: string; sublabel: string; color: string; border: string }[] = [
  { nivel: 5, label: 'Muito Bem', sublabel: 'Pleno, motivado e em equilíbrio', color: 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300', border: 'border-emerald-500' },
  { nivel: 4, label: 'Bem', sublabel: 'Disposto, produtivo e calmo', color: 'bg-teal-50 text-teal-800 dark:bg-teal-950/40 dark:text-teal-300', border: 'border-teal-500' },
  { nivel: 3, label: 'Neutro', sublabel: 'Dia equilibrado, sem oscilações', color: 'bg-slate-50 text-slate-800 dark:bg-slate-800/60 dark:text-slate-300', border: 'border-slate-400' },
  { nivel: 2, label: 'Difícil', sublabel: 'Cansaço, desânimo ou ansiedade', color: 'bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300', border: 'border-amber-500' },
  { nivel: 1, label: 'Muito Difícil', sublabel: 'Crise, sobrecarga aguda ou angústia', color: 'bg-rose-50 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300', border: 'border-rose-500' },
];

const TEMAS_ADULTO = [
  { id: 'zen_sage', nome: 'Zen Sálvia', bgClass: 'bg-gradient-to-b from-emerald-50/50 to-teal-50/30 border-teal-200 dark:from-slate-900 dark:to-teal-950/30 dark:border-teal-900/50', accent: 'text-teal-600 dark:text-teal-400' },
  { id: 'deep_ocean', nome: 'Oceano Sereno', bgClass: 'bg-gradient-to-b from-sky-50/50 to-cyan-50/30 border-sky-200 dark:from-slate-900 dark:to-cyan-950/30 dark:border-cyan-900/50', accent: 'text-sky-600 dark:text-sky-400' },
  { id: 'sunset_calm', nome: 'Pôr do Sol Calmo', bgClass: 'bg-gradient-to-b from-amber-50/50 to-orange-50/30 border-amber-200 dark:from-slate-900 dark:to-amber-950/30 dark:border-amber-900/50', accent: 'text-amber-600 dark:text-amber-400' },
  { id: 'minimal_slate', nome: 'Ardósia Minimal', bgClass: 'bg-slate-50/80 border-slate-200 dark:bg-slate-900 dark:border-slate-800', accent: 'text-slate-700 dark:text-slate-300' },
];

const EMOCOES_LISTA = [
  'Ansiedade', 'Calma', 'Gratidão', 'Tristeza', 'Irritação',
  'Sobrecarga', 'Esperança', 'Entusiasmo', 'Sensação de Vazio', 'Insegurança',
  'Foco', 'Cansaço Mental'
];

const SINTOMAS_FISICOS = [
  'Tensão Muscular', 'Dor de Cabeça', 'Taquicardia', 'Aperto Torácico',
  'Fadiga Corporal', 'Falta de Ar', 'Sem Sintomas Físicos'
];

const GATILHOS_LISTA = [
  'Carreira', 'Família', 'Relacionamento Afetivo', 'Sono Insuficiente',
  'Finanças', 'Saúde Física', 'Exercício Físico', 'Cobrança Interna',
  'Conflito Interpessoal', 'Lazer e Descanso'
];

export const AdultEmotionTracker: React.FC<AdultEmotionTrackerProps> = ({
  pacienteNome,
  onSalvar,
  temaPadrao = 'zen_sage',
  onAtualizarPreferencia,
}) => {
  const [humor, setHumor] = useState<NivelHumor | null>(null);
  const [nivelAnsiedade, setNivelAnsiedade] = useState<number>(3);
  const [nivelEstresse, setNivelEstresse] = useState<string>('moderado');
  const [emocoes, setEmocoes] = useState<string[]>([]);
  const [sintomasFisicos, setSintomasFisicos] = useState<string[]>([]);
  const [gatilhos, setGatilhos] = useState<string[]>([]);
  const [sono, setSono] = useState<'bom' | 'regular' | 'pessimo'>('bom');
  const [horasSono, setHorasSono] = useState<string>('7 a 9h');
  const [medicacao, setMedicacao] = useState<boolean>(true);
  const [anotacao, setAnotacao] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Personalização
  const [temaAtivo, setTemaAtivo] = useState(temaPadrao);
  const [mostrarPersonalizacao, setMostrarPersonalizacao] = useState(false);

  const temaObj = TEMAS_ADULTO.find((t) => t.id === temaAtivo) || TEMAS_ADULTO[0];

  const handleTrocarTema = (novoTema: string) => {
    setTemaAtivo(novoTema);
    if (onAtualizarPreferencia) {
      onAtualizarPreferencia(novoTema);
    }
  };

  const toggleItem = (lista: string[], setLista: React.Dispatch<React.SetStateAction<string[]>>, item: string) => {
    setLista((prev) => (prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!humor) return;

    onSalvar({
      pacienteId: '',
      dataHora: new Date().toISOString(),
      nivelHumor: humor,
      emocoesPrimarias: emocoes,
      gatilhos,
      qualidadeSono: sono,
      horasSono,
      tomouMedicacao: medicacao,
      nivelAnsiedade,
      nivelEstresse,
      sintomasFisicos,
      anotacaoLivre: anotacao.trim() || undefined,
      modoUsado: 'adulto',
      temaVisual: temaAtivo,
    });

    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className={`border p-8 rounded-3xl shadow-xl text-center space-y-4 ${temaObj.bgClass}`}>
        <div className="w-16 h-16 bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400 rounded-full flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Registro Concluído</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
          Obrigado, {pacienteNome}. Seus dados foram sincronizados de forma segura e confidencial com o prontuário do seu profissional.
        </p>
        <button
          onClick={() => {
            setIsSubmitted(false);
            setHumor(null);
            setEmocoes([]);
            setGatilhos([]);
            setSintomasFisicos([]);
            setAnotacao('');
          }}
          className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline"
        >
          Fazer novo registro
        </button>
      </div>
    );
  }

  return (
    <div className={`p-4 sm:p-6 rounded-3xl border shadow-sm space-y-6 ${temaObj.bgClass} transition-all`}>
      
      {/* Topo com Título e Personalização de Tema */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Acompanhamento Psicoterapêutico
          </span>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
            Olá, {pacienteNome.split(' ')[0]}
          </h2>
        </div>

        <button
          type="button"
          onClick={() => setMostrarPersonalizacao(!mostrarPersonalizacao)}
          className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-1.5 transition-all"
        >
          <Palette className="w-3.5 h-3.5 text-teal-600" />
          <span>Tema Visual</span>
        </button>
      </div>

      {/* Seletor de Tema Adulto */}
      {mostrarPersonalizacao && (
        <div className="p-3.5 bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
            Escolha o Tema do seu Ambiente de Reflexão:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {TEMAS_ADULTO.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => handleTrocarTema(t.id)}
                className={`p-2 rounded-xl text-xs font-bold border transition-all text-center ${
                  temaAtivo === t.id
                    ? 'border-teal-500 bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300 shadow-sm'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                {t.nome}
              </button>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* 1. Humor Geral */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
            1. Como você avalia seu humor geral hoje?
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
            {ADULT_MOODS.map((opcao) => (
              <button
                key={opcao.nivel}
                type="button"
                onClick={() => setHumor(opcao.nivel)}
                className={`p-3 rounded-2xl border text-center transition-all ${
                  humor === opcao.nivel
                    ? `${opcao.color} ${opcao.border} shadow-md ring-2 ring-teal-500/20 font-bold scale-102`
                    : 'bg-white dark:bg-slate-800/70 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                }`}
              >
                <div className="text-sm font-bold">{opcao.label}</div>
                <div className="text-[11px] opacity-75 mt-0.5 line-clamp-1">{opcao.sublabel}</div>
              </button>
            ))}
          </div>
        </div>

        {/* 2. Escala de Ansiedade (0 a 10) & Nível de Estresse */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3.5 bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-amber-500" />
                Escala de Ansiedade (0 a 10):
              </label>
              <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-md ${
                nivelAnsiedade <= 3 ? 'bg-emerald-100 text-emerald-800' :
                nivelAnsiedade <= 6 ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
              }`}>
                {nivelAnsiedade}/10
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              value={nivelAnsiedade}
              onChange={(e) => setNivelAnsiedade(Number(e.target.value))}
              className="w-full accent-teal-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-medium">
              <span>0 (Sem Ansiedade)</span>
              <span>5 (Moderada)</span>
              <span>10 (Aguda)</span>
            </div>
          </div>

          <div className="p-3.5 bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Brain className="w-3.5 h-3.5 text-indigo-500" />
              Nível de Estresse Percebido:
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {['baixo', 'moderado', 'elevado', 'critico'].map((est) => (
                <button
                  key={est}
                  type="button"
                  onClick={() => setNivelEstresse(est)}
                  className={`p-1.5 rounded-xl text-[11px] font-bold border capitalize transition-all ${
                    nivelEstresse === est
                      ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {est}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 3. Sintomas Físicos / Somáticos */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
            3. Sintomas Físicos e Corporais:
          </label>
          <div className="flex flex-wrap gap-2">
            {SINTOMAS_FISICOS.map((sintoma) => (
              <button
                key={sintoma}
                type="button"
                onClick={() => toggleItem(sintomasFisicos, setSintomasFisicos, sintoma)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                  sintomasFisicos.includes(sintoma)
                    ? 'bg-teal-50 dark:bg-teal-950/60 border-teal-500 text-teal-800 dark:text-teal-200 shadow-sm'
                    : 'bg-white dark:bg-slate-800/70 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                }`}
              >
                {sintoma}
              </button>
            ))}
          </div>
        </div>

        {/* 4. Sentimentos e Emoções Primárias */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
            4. Sentimentos Predominantes (Selecione o que se aplica):
          </label>
          <div className="flex flex-wrap gap-2">
            {EMOCOES_LISTA.map((emocao) => (
              <button
                key={emocao}
                type="button"
                onClick={() => toggleItem(emocoes, setEmocoes, emocao)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                  emocoes.includes(emocao)
                    ? 'bg-teal-500 border-teal-600 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-800/70 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                }`}
              >
                {emocao}
              </button>
            ))}
          </div>
        </div>

        {/* 5. Gatilhos do Dia */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
            5. Fatores e Gatilhos Relevantes:
          </label>
          <div className="flex flex-wrap gap-2">
            {GATILHOS_LISTA.map((gatilho) => (
              <button
                key={gatilho}
                type="button"
                onClick={() => toggleItem(gatilhos, setGatilhos, gatilho)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                  gatilhos.includes(gatilho)
                    ? 'bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900 border-slate-800 shadow-sm'
                    : 'bg-white dark:bg-slate-800/70 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                }`}
              >
                {gatilho}
              </button>
            ))}
          </div>
        </div>

        {/* 6. Sono & Medicamentos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-3.5 bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Moon className="w-3.5 h-3.5 text-teal-600" />
              Sono da Última Noite:
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => setSono('bom')}
                className={`p-1.5 rounded-xl text-xs font-bold border transition-all ${
                  sono === 'bom' ? 'bg-teal-600 text-white border-teal-600' : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                Repousante
              </button>
              <button
                type="button"
                onClick={() => setSono('regular')}
                className={`p-1.5 rounded-xl text-xs font-bold border transition-all ${
                  sono === 'regular' ? 'bg-amber-600 text-white border-amber-600' : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                Agitado
              </button>
              <button
                type="button"
                onClick={() => setSono('pessimo')}
                className={`p-1.5 rounded-xl text-xs font-bold border transition-all ${
                  sono === 'pessimo' ? 'bg-rose-600 text-white border-rose-600' : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                Insônia
              </button>
            </div>
          </div>

          <div className="p-3.5 bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Pill className="w-3.5 h-3.5 text-teal-600" />
              Adesão Medicamentosa:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setMedicacao(true)}
                className={`p-1.5 rounded-xl text-xs font-bold border transition-all ${
                  medicacao ? 'bg-teal-600 text-white border-teal-600' : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                Sim, tomei
              </button>
              <button
                type="button"
                onClick={() => setMedicacao(false)}
                className={`p-1.5 rounded-xl text-xs font-bold border transition-all ${
                  !medicacao ? 'bg-rose-600 text-white border-rose-600' : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                Não tomei
              </button>
            </div>
          </div>
        </div>

        {/* 7. Registro de Pensamento Automático / Reflexão */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
            7. Pensamento Automático ou Reflexão Livre:
          </label>
          <textarea
            rows={3}
            value={anotacao}
            onChange={(e) => setAnotacao(e.target.value)}
            placeholder="Qual pensamento predominou em sua mente hoje? Como ele fez você se sentir?"
            className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-teal-500 text-slate-900 dark:text-white"
          />
        </div>

        <button
          type="submit"
          disabled={!humor}
          className={`w-full py-3.5 rounded-2xl font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 ${
            humor
              ? 'bg-teal-600 hover:bg-teal-700 text-white shadow-teal-500/20'
              : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Salvar Registro no Prontuário</span>
        </button>

      </form>

    </div>
  );
};
