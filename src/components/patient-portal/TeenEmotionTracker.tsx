import React, { useState } from 'react';
import { NivelHumor, RegistroEmocao } from '../../types';
import { Zap, Moon, BatteryMedium, BatteryCharging, Check, MessageSquare, Sparkles } from 'lucide-react';

interface TeenEmotionTrackerProps {
  pacienteNome: string;
  onSalvar: (dados: Omit<RegistroEmocao, 'id'>) => void;
}

const TEEN_MOODS: { nivel: NivelHumor; emoji: string; label: string; desc: string; color: string }[] = [
  { nivel: 5, emoji: '⚡', label: 'No Topo', desc: 'Energia alta, vibe boa, produtivo', color: 'from-fuchsia-500 to-purple-600' },
  { nivel: 4, emoji: '✨', label: 'Suave / De Boa', desc: 'Tranquilo, tudo sob controle', color: 'from-cyan-500 to-blue-600' },
  { nivel: 3, emoji: '😐', label: 'No Automático', desc: 'Nem bem nem mal, só vivendo', color: 'from-slate-500 to-zinc-600' },
  { nivel: 2, emoji: '🌧️', label: 'Pesado / Bad', desc: 'Desânimo, ansioso ou frustrado', color: 'from-amber-500 to-orange-600' },
  { nivel: 1, emoji: '💥', label: 'Em Crise / Esgotado', desc: 'Bateria zerada, sobrecarga extrema', color: 'from-rose-500 to-red-600' },
];

const TEEN_TAGS = [
  '🎧 Música me salvou',
  '📱 Vício no feed / Reels',
  '📚 Estudos / Prova',
  '🧠 Overthinking',
  '🔋 Bateria social zerada',
  '💬 Treta no Whats / Amigos',
  '🏠 Clima tenso em casa',
  '🏃‍♂️ Academia / Treino',
  '💤 Insônia / Sono ruim',
  '🍕 Comi por ansiedade',
  '🎯 Foco absurdo hoje',
  '💔 Vazio / Solidão',
];

export const TeenEmotionTracker: React.FC<TeenEmotionTrackerProps> = ({
  pacienteNome,
  onSalvar,
}) => {
  const [humor, setHumor] = useState<NivelHumor | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [qualidadeSono, setQualidadeSono] = useState<'bom' | 'regular' | 'pessimo'>('regular');
  const [tomouMedicacao, setTomouMedicacao] = useState<boolean>(true);
  const [desabafo, setDesabafo] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!humor) return;

    const moodObj = TEEN_MOODS.find((m) => m.nivel === humor);

    onSalvar({
      pacienteId: '',
      dataHora: new Date().toISOString(),
      nivelHumor: humor,
      emocoesPrimarias: [moodObj ? moodObj.label : ''],
      gatilhos: selectedTags,
      qualidadeSono,
      tomouMedicacao,
      anotacaoLivre: desabafo.trim() || undefined,
      modoUsado: 'teen',
    });

    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="bg-slate-900 border border-fuchsia-500/30 text-white p-8 rounded-3xl text-center space-y-4 shadow-2xl">
        <div className="w-16 h-16 bg-gradient-to-tr from-fuchsia-600 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-fuchsia-500/20">
          <Zap className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-black tracking-tight">Check-in Concluído! ⚡</h2>
        <p className="text-sm text-slate-400 max-w-sm mx-auto">
          Valeu, {pacienteNome.split(' ')[0]}. Seu momento ficou registrado com total sigilo. Seu psicólogo vai acompanhar as oscilações para trabalhar com você na próxima sessão.
        </p>
        <button
          onClick={() => {
            setIsSubmitted(false);
            setHumor(null);
            setSelectedTags([]);
            setDesabafo('');
          }}
          className="mt-2 text-xs font-semibold text-cyan-400 hover:text-cyan-300 underline"
        >
          Fazer novo registro
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      
      {/* Header Teen */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-5 rounded-3xl border border-indigo-500/20 shadow-sm text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">✌️</span>
              <h2 className="text-lg font-black text-white">E aí, {pacienteNome.split(' ')[0]}</h2>
            </div>
            <p className="text-xs text-indigo-300 mt-0.5">
              Como tá a vibe hoje? 15 segundos para atualizar seu humor:
            </p>
          </div>
          <span className="text-xs font-mono bg-indigo-500/20 text-indigo-300 px-2.5 py-1 rounded-full border border-indigo-500/30">
            Modo Jovem
          </span>
        </div>
      </div>

      {/* 1. Nível de Humor */}
      <div className="space-y-2.5">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Qual a sua vibe de hoje?
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
          {TEEN_MOODS.map((m) => {
            const isSelected = humor === m.nivel;
            return (
              <button
                key={m.nivel}
                type="button"
                onClick={() => setHumor(m.nivel)}
                className={`p-3 rounded-2xl border text-center transition-all ${
                  isSelected
                    ? `bg-gradient-to-b ${m.color} text-white border-transparent shadow-lg scale-105 ring-2 ring-white/20`
                    : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-indigo-400'
                }`}
              >
                <div className="text-2xl mb-1">{m.emoji}</div>
                <div className="text-xs font-bold leading-tight">{m.label}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Tags e Gatilhos */}
      <div className="space-y-2.5">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          O que pesou ou rolou de bom no seu dia?
        </label>
        <div className="flex flex-wrap gap-2">
          {TEEN_TAGS.map((tag) => {
            const isSelected = selectedTags.includes(tag);
            return (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                  isSelected
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm shadow-indigo-500/30 scale-105'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-400'
                }`}
              >
                {tag}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Sono & Medicação */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        <div className="bg-white dark:bg-slate-800 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Moon className="w-3.5 h-3.5 text-indigo-500" /> Como foi o sono?
          </label>
          <div className="grid grid-cols-3 gap-1.5">
            {[
              { id: 'pessimo', label: 'Ruim' },
              { id: 'regular', label: 'Ok' },
              { id: 'bom', label: 'Ótimo' },
            ].map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setQualidadeSono(s.id as any)}
                className={`py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                  qualidadeSono === s.id
                    ? 'bg-indigo-600 text-white border-indigo-600'
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
            <BatteryCharging className="w-3.5 h-3.5 text-teal-500" /> Tomou a medicação hoje?
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            <button
              type="button"
              onClick={() => setTomouMedicacao(true)}
              className={`py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                tomouMedicacao
                  ? 'bg-teal-600 text-white border-teal-600'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-transparent'
              }`}
            >
              Sim, tomei
            </button>
            <button
              type="button"
              onClick={() => setTomouMedicacao(false)}
              className={`py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                !tomouMedicacao
                  ? 'bg-rose-600 text-white border-rose-600'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-transparent'
              }`}
            >
              Não / Esqueci
            </button>
          </div>
        </div>
      </div>

      {/* 4. Espaço Desabafo */}
      <div className="space-y-1.5">
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
          <MessageSquare className="w-3.5 h-3.5 text-fuchsia-500" />
          Espaço Desabafo (Opcional - só seu psicólogo lê)
        </label>
        <textarea
          rows={3}
          value={desabafo}
          onChange={(e) => setDesabafo(e.target.value)}
          placeholder="Solta o que tiver na cabeça... algo que irritou, uma vitória ou um pensamento repetitivo..."
          className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-white"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!humor}
        className={`w-full py-3.5 rounded-2xl font-bold text-sm shadow-xl flex items-center justify-center gap-2 transition-all ${
          humor
            ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-fuchsia-600 text-white hover:brightness-110 cursor-pointer shadow-indigo-500/20'
            : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
        }`}
      >
        <Zap className="w-4 h-4" />
        SALVAR CHECK-IN DE HOJE
      </button>

    </form>
  );
};
