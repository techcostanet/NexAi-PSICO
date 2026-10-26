import React, { useState } from 'react';
import { NivelHumor, RegistroEmocao } from '../../types';
import { Heart, Moon, Pill, Sparkles, CheckCircle2, ShieldCheck, Calendar } from 'lucide-react';

interface AdultEmotionTrackerProps {
  pacienteNome: string;
  onSalvar: (dados: Omit<RegistroEmocao, 'id'>) => void;
}

const ADULT_MOODS: { nivel: NivelHumor; label: string; sublabel: string; color: string; border: string }[] = [
  { nivel: 5, label: 'Muito Bem', sublabel: 'Pleno, motivado, em equilíbrio', color: 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300', border: 'border-emerald-500' },
  { nivel: 4, label: 'Bem', sublabel: 'Disposto, produtivo, tranquilo', color: 'bg-teal-50 text-teal-800 dark:bg-teal-950/40 dark:text-teal-300', border: 'border-teal-500' },
  { nivel: 3, label: 'Neutro', sublabel: 'Dia equilibrado, sem oscilações', color: 'bg-slate-50 text-slate-800 dark:bg-slate-800/60 dark:text-slate-300', border: 'border-slate-400' },
  { nivel: 2, label: 'Difícil', sublabel: 'Cansaço, desânimo ou ansiedade', color: 'bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300', border: 'border-amber-500' },
  { nivel: 1, label: 'Muito Difícil', sublabel: 'Crise, sobrecarga aguda, angústia', color: 'bg-rose-50 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300', border: 'border-rose-500' },
];

const EMOCOES_LISTA = [
  'Ansiedade', 'Calma / Paz', 'Gratidão', 'Tristeza', 'Raiva / Irritação',
  'Sobrecarga', 'Esperança', 'Entusiasmo', 'Sensação de Vazio', 'Insegurança',
  'Foco / Produtividade', 'Cansaço Mental'
];

const GATILHOS_LISTA = [
  'Trabalho / Carreira', 'Família', 'Relacionamento Afetivo', 'Sono / Insônia',
  'Finanças', 'Saúde Física', 'Exercício Físico', 'Cobrança Interna',
  'Conflito Interpessoal', 'Lazer / Descanso'
];

export const AdultEmotionTracker: React.FC<AdultEmotionTrackerProps> = ({
  pacienteNome,
  onSalvar,
}) => {
  const [humor, setHumor] = useState<NivelHumor | null>(null);
  const [emocoes, setEmocoes] = useState<string[]>([]);
  const [gatilhos, setGatilhos] = useState<string[]>([]);
  const [sono, setSono] = useState<'bom' | 'regular' | 'pessimo'>('bom');
  const [medicacao, setMedicacao] = useState<boolean>(true);
  const [anotacao, setAnotacao] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

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
      tomouMedicacao: medicacao,
      anotacaoLivre: anotacao.trim() || undefined,
      modoUsado: 'adulto',
    });

    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-teal-500/30 p-8 rounded-3xl shadow-xl text-center space-y-4">
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
    <form onSubmit={handleSubmit} className="space-y-6">
      
      {/* Header Adulto */}
      <div className="bg-gradient-to-r from-teal-800 to-brand-900 text-white p-5 rounded-3xl shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold">Olá, {pacienteNome}</h2>
            <p className="text-xs text-teal-100 mt-0.5">
              Como tem sido seu estado emocional hoje? Leva menos de 30 segundos:
            </p>
          </div>
          <div className="flex items-center gap-1 text-[11px] bg-white/10 px-2.5 py-1 rounded-full border border-white/20">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-300" />
            <span>Sigilo Médico</span>
          </div>
        </div>
      </div>

      {/* 1. Escala de Humor Geral */}
      <div className="space-y-2.5">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          1. Estado de Humor Geral:
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
          {ADULT_MOODS.map((m) => {
            const isSelected = humor === m.nivel;
            return (
              <button
                key={m.nivel}
                type="button"
                onClick={() => setHumor(m.nivel)}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  isSelected
                    ? `${m.color} ${m.border} border-2 shadow-md ring-2 ring-teal-500/20 scale-[1.02]`
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                }`}
              >
                <div className="text-sm font-bold">{m.label}</div>
                <div className="text-[10px] mt-0.5 opacity-80 leading-snug">{m.sublabel}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Emoções Predominantes */}
      <div className="space-y-2">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          2. Sentimentos que marcaram seu dia:
        </label>
        <div className="flex flex-wrap gap-2">
          {EMOCOES_LISTA.map((emo) => {
            const isSelected = emocoes.includes(emo);
            return (
              <button
                key={emo}
                type="button"
                onClick={() => toggleItem(emocoes, setEmocoes, emo)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                  isSelected
                    ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                }`}
              >
                {emo} {isSelected && '✓'}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Fatores e Gatilhos */}
      <div className="space-y-2">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          3. Principais gatilhos ou áreas envolvidas:
        </label>
        <div className="flex flex-wrap gap-2">
          {GATILHOS_LISTA.map((gat) => {
            const isSelected = gatilhos.includes(gat);
            return (
              <button
                key={gat}
                type="button"
                onClick={() => toggleItem(gatilhos, setGatilhos, gat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                  isSelected
                    ? 'bg-brand-700 text-white border-brand-700 shadow-sm'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                }`}
              >
                {gat} {isSelected && '✓'}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Sono & Medicação Prescrita */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        <div className="bg-white dark:bg-slate-800 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Moon className="w-3.5 h-3.5 text-indigo-500" /> Qualidade do Sono:
          </label>
          <div className="grid grid-cols-3 gap-1.5">
            {[
              { id: 'pessimo', label: 'Insônia / Ruim' },
              { id: 'regular', label: 'Regular' },
              { id: 'bom', label: 'Repousador' },
            ].map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setSono(s.id as any)}
                className={`py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                  sono === s.id
                    ? 'bg-teal-600 text-white border-teal-600'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-transparent'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Pill className="w-3.5 h-3.5 text-teal-600" /> Medicação Prescrita:
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            <button
              type="button"
              onClick={() => setMedicacao(true)}
              className={`py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                medicacao
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-transparent'
              }`}
            >
              Tomou conforme prescrito
            </button>
            <button
              type="button"
              onClick={() => setMedicacao(false)}
              className={`py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                !medicacao
                  ? 'bg-rose-600 text-white border-rose-600'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-transparent'
              }`}
            >
              Não tomou / Esqueceu
            </button>
          </div>
        </div>
      </div>

      {/* 5. Anotação para a Sessão */}
      <div className="space-y-1.5">
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
          Nota para discussão na próxima consulta (Opcional):
        </label>
        <textarea
          rows={3}
          value={anotacao}
          onChange={(e) => setAnotacao(e.target.value)}
          placeholder="Anote algum evento pontual, reflexão ou sintoma que gostaria de aprofundar com seu terapeuta..."
          className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:outline-none focus:border-teal-500 text-slate-800 dark:text-white"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!humor}
        className={`w-full py-3.5 rounded-2xl font-bold text-sm shadow-xl flex items-center justify-center gap-2 transition-all ${
          humor
            ? 'bg-gradient-to-r from-teal-600 to-brand-800 text-white hover:brightness-105 cursor-pointer shadow-teal-700/20'
            : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
        }`}
      >
        <CheckCircle2 className="w-4 h-4" />
        REGISTRAR NO MEU DIÁRIO
      </button>

    </form>
  );
};
