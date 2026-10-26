import React, { useState } from 'react';
import { NivelHumor, RegistroEmocao } from '../../types';
import { Sparkles, Heart, Star, Smile, Frown, Flame, CloudRain, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface KidsEmotionTrackerProps {
  pacienteNome: string;
  onSalvar: (dados: Omit<RegistroEmocao, 'id'>) => void;
}

interface EmotionOption {
  nivel: NivelHumor;
  nome: string;
  emoji: string;
  corBg: string;
  corBorda: string;
  corTexto: string;
  descricao: string;
}

const KIDS_EMOTIONS: EmotionOption[] = [
  {
    nivel: 5,
    nome: 'Super Feliz!',
    emoji: '⭐🦁',
    corBg: 'from-amber-400 to-yellow-300',
    corBorda: 'border-amber-400',
    corTexto: 'text-amber-900',
    descricao: 'Muito animado, alegre e com vontade de brincar!',
  },
  {
    nivel: 4,
    nome: 'Bem / Contente',
    emoji: '😊🐸',
    corBg: 'from-emerald-400 to-teal-300',
    corBorda: 'border-emerald-400',
    corTexto: 'text-emerald-900',
    descricao: 'Tudo tranquilo, em paz e relaxado.',
  },
  {
    nivel: 3,
    nome: 'Mais ou Menos',
    emoji: '😐🐢',
    corBg: 'from-blue-300 to-cyan-300',
    corBorda: 'border-blue-400',
    corTexto: 'text-blue-900',
    descricao: 'Nem triste, nem feliz. Um dia normal.',
  },
  {
    nivel: 2,
    nome: 'Triste / Para Baixo',
    emoji: '🌧️🐻',
    corBg: 'from-indigo-400 to-blue-400',
    corBorda: 'border-indigo-400',
    corTexto: 'text-white',
    descricao: 'Vontade de ficar quietinho ou com vontade de chorar.',
  },
  {
    nivel: 1,
    nome: 'Bravo / Zangado',
    emoji: '🌋🔥',
    corBg: 'from-rose-500 to-red-500',
    corBorda: 'border-rose-600',
    corTexto: 'text-white',
    descricao: 'Muita raiva, chateado com algo injusto.',
  },
];

const KIDS_GATILHOS = [
  { id: 'Escola / Lição', label: '🎒 Escola / Professora', cor: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
  { id: 'Brinquedos / Jogos', label: '🎮 Jogos / Brinquedos', cor: 'bg-purple-100 text-purple-800 border-purple-300' },
  { id: 'Família / Pais', label: '👨‍👩‍👦 Mamãe ou Papai', cor: 'bg-pink-100 text-pink-800 border-pink-300' },
  { id: 'Amiguinhos', label: '👫 Amigos / Colegas', cor: 'bg-blue-100 text-blue-800 border-blue-300' },
  { id: 'Dormir / Pesadelo', label: '🌙 Sono / Pesadelo', cor: 'bg-indigo-100 text-indigo-800 border-indigo-300' },
  { id: 'Comida / Lanche', label: '🍕 Comida / Guloseima', cor: 'bg-orange-100 text-orange-800 border-orange-300' },
  { id: 'Parque / Ar Livre', label: '🌳 Parque / Passeio', cor: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
  { id: 'Bronca / Discussão', label: '⚡ Bronca / Castigo', cor: 'bg-red-100 text-red-800 border-red-300' },
];

export const KidsEmotionTracker: React.FC<KidsEmotionTrackerProps> = ({
  pacienteNome,
  onSalvar,
}) => {
  const [selectedHumor, setSelectedHumor] = useState<NivelHumor | null>(null);
  const [selectedGatilhos, setSelectedGatilhos] = useState<string[]>([]);
  const [recadinho, setRecadinho] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const toggleGatilho = (gatilhoId: string) => {
    setSelectedGatilhos((prev) =>
      prev.includes(gatilhoId) ? prev.filter((g) => g !== gatilhoId) : [...prev, gatilhoId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHumor) return;

    const opcao = KIDS_EMOTIONS.find((e) => e.nivel === selectedHumor);

    onSalvar({
      pacienteId: '', // preenchido pelo container
      dataHora: new Date().toISOString(),
      nivelHumor: selectedHumor,
      emocoesPrimarias: [opcao ? opcao.nome : ''],
      gatilhos: selectedGatilhos,
      anotacaoLivre: recadinho.trim() || undefined,
      modoUsado: 'kids',
      qualidadeSono: selectedHumor >= 3 ? 'bom' : 'regular',
    });

    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="bg-gradient-to-b from-amber-100 via-yellow-50 to-emerald-100 p-8 rounded-3xl border-4 border-amber-300 shadow-xl text-center space-y-4 animate-fadeIn">
        <div className="w-20 h-20 bg-amber-400 text-white rounded-full flex items-center justify-center mx-auto shadow-lg animate-bounce">
          <Star className="w-12 h-12 fill-white" />
        </div>
        <h2 className="text-2xl font-extrabold text-amber-900 font-sans tracking-tight">
          Parabéns, {pacienteNome.split(' ')[0]}! 🌟
        </h2>
        <p className="text-base text-amber-800 font-medium">
          Suas emoções foram guardadas com carinho no seu Diário! O seu psicólogo vai ficar muito orgulhoso de ver como você se cuidou hoje.
        </p>
        <div className="pt-4">
          <button
            onClick={() => {
              setIsSubmitted(false);
              setSelectedHumor(null);
              setSelectedGatilhos([]);
              setRecadinho('');
            }}
            className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-6 rounded-2xl shadow-md transition-transform transform active:scale-95"
          >
            Fazer outro registro 🎈
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      
      {/* Saudação Carinhosa Infantil */}
      <div className="bg-gradient-to-r from-amber-300 via-orange-300 to-pink-300 p-5 rounded-3xl shadow-sm text-slate-800 border-2 border-white/50">
        <div className="flex items-center gap-3">
          <span className="text-4xl animate-pulse">🎨</span>
          <div>
            <h2 className="text-xl font-black text-amber-950">
              Oi, {pacienteNome.split(' ')[0]}!
            </h2>
            <p className="text-xs font-semibold text-amber-900/80">
              Como está o seu coraçãozinho hoje? Escolha o monstrinho ou bichinho que mais parece com você:
            </p>
          </div>
        </div>
      </div>

      {/* 1. Escolha da Emoção (Grandes Botões Visuais) */}
      <div className="space-y-3">
        <label className="block text-sm font-black text-slate-700 dark:text-slate-200">
          1. Toque em como você está se sentindo agora:
        </label>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {KIDS_EMOTIONS.map((option) => {
            const isSelected = selectedHumor === option.nivel;
            return (
              <button
                key={option.nivel}
                type="button"
                onClick={() => setSelectedHumor(option.nivel)}
                className={`flex items-center gap-4 p-4 rounded-2xl border-4 transition-all text-left ${
                  isSelected
                    ? `bg-gradient-to-r ${option.corBg} ${option.corBorda} shadow-lg scale-[1.02] ring-4 ring-amber-400/40`
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-amber-300 hover:scale-[1.01]'
                }`}
              >
                <span className="text-4xl shrink-0 drop-shadow">{option.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className={`text-base font-extrabold ${isSelected ? option.corTexto : 'text-slate-800 dark:text-white'}`}>
                      {option.nome}
                    </span>
                    {isSelected && <CheckCircle2 className="w-5 h-5 text-amber-900 shrink-0" />}
                  </div>
                  <p className={`text-xs mt-0.5 leading-snug ${isSelected ? `${option.corTexto} opacity-90 font-medium` : 'text-slate-500 dark:text-slate-400'}`}>
                    {option.descricao}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. O que aconteceu? (Gatilhos Infantis com Tags Grandes) */}
      <div className="space-y-3">
        <label className="block text-sm font-black text-slate-700 dark:text-slate-200">
          2. O que fez você sentir isso? (pode marcar mais de um)
        </label>
        <div className="flex flex-wrap gap-2.5">
          {KIDS_GATILHOS.map((gatilho) => {
            const isSelected = selectedGatilhos.includes(gatilho.id);
            return (
              <button
                key={gatilho.id}
                type="button"
                onClick={() => toggleGatilho(gatilho.id)}
                className={`px-4 py-2.5 rounded-2xl font-bold text-xs border-2 transition-all shadow-sm ${
                  isSelected
                    ? `${gatilho.cor} border-current scale-105 shadow-md ring-2 ring-amber-400`
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                }`}
              >
                {gatilho.label} {isSelected && '✓'}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Recadinho / Segredo para o Psicólogo */}
      <div className="space-y-2">
        <label className="block text-sm font-black text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-amber-500" />
          3. Quer deixar um recadinho pro seu psicólogo? (Opcional)
        </label>
        <textarea
          rows={3}
          value={recadinho}
          onChange={(e) => setRecadinho(e.target.value)}
          placeholder="Escreva aqui algo que aconteceu hoje ou um segredo que você quer conversar na próxima sessão..."
          className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-200 transition-all text-slate-800 dark:text-white"
        />
      </div>

      {/* Botão de Envio com Efeito Vibrante */}
      <button
        type="submit"
        disabled={!selectedHumor}
        className={`w-full py-4 rounded-2xl font-black text-base shadow-xl flex items-center justify-center gap-2 transition-all transform active:scale-95 ${
          selectedHumor
            ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 text-white hover:brightness-105 shadow-amber-500/25 cursor-pointer'
            : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
        }`}
      >
        <Star className="w-5 h-5 fill-current" />
        SALVAR MEU DIA NO DIÁRIO! ⭐
      </button>

    </form>
  );
};
