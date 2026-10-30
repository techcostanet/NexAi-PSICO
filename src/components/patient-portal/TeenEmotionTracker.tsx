import React, { useState } from 'react';
import { NivelHumor, RegistroEmocao } from '../../types';
import { Zap, Moon, BatteryCharging, Check, MessageSquare, Sparkles, Palette, ShieldCheck, Clock } from 'lucide-react';

interface TeenEmotionTrackerProps {
  pacienteNome: string;
  onSalvar: (dados: Omit<RegistroEmocao, 'id'>) => void;
  temaPadrao?: string;
  onAtualizarPreferencia?: (tema: string) => void;
}

const TEEN_MOODS: { nivel: NivelHumor; emoji: string; label: string; desc: string; color: string }[] = [
  { nivel: 5, emoji: '⚡', label: 'No Topo', desc: 'Energia alta, vibe boa e focado', color: 'from-fuchsia-500 to-purple-600' },
  { nivel: 4, emoji: '✨', label: 'Suave', desc: 'Tranquilo, tudo sob controle', color: 'from-cyan-500 to-blue-600' },
  { nivel: 3, emoji: '😐', label: 'Automático', desc: 'Nem bem nem mal, apenas vivendo', color: 'from-slate-500 to-zinc-600' },
  { nivel: 2, emoji: '🌧️', label: 'Desanimado', desc: 'Pesado, ansioso ou frustrado', color: 'from-amber-500 to-orange-600' },
  { nivel: 1, emoji: '💥', label: 'Esgotado', desc: 'Bateria zerada, crise ou sobrecarga', color: 'from-rose-500 to-red-600' },
];

const TEMAS_TEEN = [
  { id: 'cyberpunk', nome: 'Cyberpunk Neon', cardClass: 'bg-slate-950 border-fuchsia-500/40 text-white', accentText: 'text-fuchsia-400' },
  { id: 'synthwave', nome: 'Synthwave Sunset', cardClass: 'bg-indigo-950 border-cyan-500/40 text-white', accentText: 'text-cyan-400' },
  { id: 'dark_minimal', nome: 'Dark Minimalist', cardClass: 'bg-zinc-950 border-zinc-800 text-zinc-100', accentText: 'text-emerald-400' },
  { id: 'matrix', nome: 'Terminal Matrix', cardClass: 'bg-black border-emerald-500/50 text-emerald-300 font-mono', accentText: 'text-emerald-400' },
];

const ESTILOS_TEEN = [
  { id: 'gamer', label: '⚡ Gamer' },
  { id: 'lofi', label: '🎧 Lo-Fi' },
  { id: 'indie', label: '🪐 Indie' },
  { id: 'criativo', label: '🎨 Criativo' },
  { id: 'street', label: '🛹 Street' },
];

const TEEN_TAGS = [
  'Música me salvou',
  'Rolando feed por horas',
  'Estudos e provas',
  'Pensamentos acelerados',
  'Bateria social zerada',
  'Conversa com amigos',
  'Clima pesado em casa',
  'Exercício físico',
  'Insônia de madrugada',
  'Fome por ansiedade',
  'Foco excelente hoje',
  'Sentimento de solidão',
];

export const TeenEmotionTracker: React.FC<TeenEmotionTrackerProps> = ({
  pacienteNome,
  onSalvar,
  temaPadrao = 'cyberpunk',
  onAtualizarPreferencia,
}) => {
  const [humor, setHumor] = useState<NivelHumor | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [bateriaSocial, setBateriaSocial] = useState<number>(75);
  const [tempoTela, setTempoTela] = useState<string>('2 a 4h');
  const [focoProdutividade, setFocoProdutividade] = useState<string>('Equilibrado');
  const [qualidadeSono, setQualidadeSono] = useState<'bom' | 'regular' | 'pessimo'>('regular');
  const [tomouMedicacao, setTomouMedicacao] = useState<boolean>(true);
  const [desabafo, setDesabafo] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Personalização
  const [temaAtivo, setTemaAtivo] = useState(temaPadrao);
  const [estiloAtivo, setEstiloAtivo] = useState('⚡ Gamer');
  const [mostrarPersonalizacao, setMostrarPersonalizacao] = useState(false);

  const temaObj = TEMAS_TEEN.find((t) => t.id === temaAtivo) || TEMAS_TEEN[0];

  const handleTrocarTema = (novoTema: string) => {
    setTemaAtivo(novoTema);
    if (onAtualizarPreferencia) {
      onAtualizarPreferencia(novoTema);
    }
  };

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
      bateriaSocial,
      tempoTela,
      focoProdutividade,
      temaVisual: temaAtivo,
    });

    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className={`p-8 rounded-3xl text-center space-y-4 shadow-2xl border ${temaObj.cardClass}`}>
        <div className="w-16 h-16 bg-gradient-to-tr from-fuchsia-600 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-fuchsia-500/20">
          <Zap className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-black tracking-tight">Check-in Concluído! ⚡</h2>
        <p className="text-sm text-slate-300 max-w-sm mx-auto">
          Valeu, {pacienteNome.split(' ')[0]}. Seu momento ficou registrado com total sigilo. Seu terapeuta vai analisar suas oscilações para conversar na próxima sessão.
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
    <div className={`p-4 sm:p-6 rounded-3xl border shadow-xl space-y-6 ${temaObj.cardClass} transition-all`}>
      
      {/* Topo com Vibe e Personalização */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-slate-400">
              Check-in Jovem
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/10 font-bold">
              {estiloAtivo}
            </span>
          </div>
          <h2 className="text-xl font-black tracking-tight mt-0.5">
            E aí, {pacienteNome.split(' ')[0]}?
          </h2>
        </div>

        <button
          type="button"
          onClick={() => setMostrarPersonalizacao(!mostrarPersonalizacao)}
          className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold flex items-center gap-1.5 transition-all"
        >
          <Palette className="w-3.5 h-3.5 text-cyan-400" />
          <span>Tema & Vibe</span>
        </button>
      </div>

      {/* Painel Expansível de Temas */}
      {mostrarPersonalizacao && (
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1.5">
              Escolha seu Estilo de Interface:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {TEMAS_TEEN.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => handleTrocarTema(t.id)}
                  className={`p-2 rounded-xl text-xs font-bold border transition-all text-center ${
                    temaAtivo === t.id
                      ? 'border-fuchsia-500 bg-fuchsia-500/20 text-white shadow-sm'
                      : 'border-white/10 bg-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  {t.nome}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1.5">
              Sua Identidade / Tag:
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {ESTILOS_TEEN.map((est) => (
                <button
                  key={est.id}
                  type="button"
                  onClick={() => setEstiloAtivo(est.label)}
                  className={`p-1.5 rounded-xl text-xs font-bold border transition-all text-center ${
                    estiloAtivo === est.label
                      ? 'border-cyan-500 bg-cyan-500/20 text-cyan-300 shadow-sm'
                      : 'border-white/10 bg-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  {est.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* 1. Vibe Geral */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-cyan-400" />
            1. Qual é a sua Vibe geral agora?
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
            {TEEN_MOODS.map((m) => (
              <button
                key={m.nivel}
                type="button"
                onClick={() => setHumor(m.nivel)}
                className={`p-3 rounded-2xl border text-center transition-all flex sm:flex-col items-center justify-between sm:justify-center gap-2 ${
                  humor === m.nivel
                    ? `bg-gradient-to-tr ${m.color} border-white shadow-lg text-white scale-105 ring-2 ring-white/50 font-black`
                    : 'bg-white/5 border-white/10 hover:bg-white/10 text-slate-300'
                }`}
              >
                <span className="text-2xl">{m.emoji}</span>
                <div className="text-left sm:text-center">
                  <p className="text-xs font-bold">{m.label}</p>
                  <p className="text-[10px] text-white/80 hidden sm:block">{m.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 2. Bateria Social (0 a 100%) */}
        <div className="space-y-2 p-3.5 rounded-2xl bg-white/5 border border-white/10">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <BatteryCharging className="w-4 h-4 text-emerald-400" />
              2. Bateria Social:
            </label>
            <span className="text-xs font-mono font-bold text-cyan-300">{bateriaSocial}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            step="25"
            value={bateriaSocial}
            onChange={(e) => setBateriaSocial(Number(e.target.value))}
            className="w-full accent-cyan-400 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-semibold px-0.5">
            <span>Zerada (0%)</span>
            <span>Pouca (25%)</span>
            <span>Média (50%)</span>
            <span>Boa (75%)</span>
            <span>100% Top</span>
          </div>
        </div>

        {/* 3. Tempo de Tela & Foco */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-fuchsia-400" />
              Tempo em Telas / Feed:
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {['Menos de 2h', '2 a 4h', '4 a 6h', 'Mais de 6h'].map((temp) => (
                <button
                  key={temp}
                  type="button"
                  onClick={() => setTempoTela(temp)}
                  className={`p-1.5 rounded-xl text-[11px] font-bold border text-center transition-all ${
                    tempoTela === temp
                      ? 'bg-fuchsia-600 border-fuchsia-400 text-white'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  {temp}
                </button>
              ))}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Foco & Atenção:
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {['Hiperfoco', 'Foco Estável', 'Disperso', 'Procrastinação'].map((fc) => (
                <button
                  key={fc}
                  type="button"
                  onClick={() => setFocoProdutividade(fc)}
                  className={`p-1.5 rounded-xl text-[11px] font-bold border text-center transition-all ${
                    focoProdutividade === fc
                      ? 'bg-amber-600 border-amber-400 text-white'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  {fc}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 4. Sono & Remédio */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Moon className="w-3.5 h-3.5 text-indigo-400" />
              Sono da Noite:
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => setQualidadeSono('bom')}
                className={`p-1.5 rounded-xl text-xs font-bold border transition-all ${
                  qualidadeSono === 'bom' ? 'bg-emerald-600 text-white border-emerald-400' : 'bg-white/5 border-white/10 text-slate-400'
                }`}
              >
                Dormi Bem
              </button>
              <button
                type="button"
                onClick={() => setQualidadeSono('regular')}
                className={`p-1.5 rounded-xl text-xs font-bold border transition-all ${
                  qualidadeSono === 'regular' ? 'bg-amber-600 text-white border-amber-400' : 'bg-white/5 border-white/10 text-slate-400'
                }`}
              >
                Agitado
              </button>
              <button
                type="button"
                onClick={() => setQualidadeSono('pessimo')}
                className={`p-1.5 rounded-xl text-xs font-bold border transition-all ${
                  qualidadeSono === 'pessimo' ? 'bg-rose-600 text-white border-rose-400' : 'bg-white/5 border-white/10 text-slate-400'
                }`}
              >
                Insônia
              </button>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <label className="text-xs font-bold text-slate-300">
              Tomou a medicação prescrita hoje?
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setTomouMedicacao(true)}
                className={`p-1.5 rounded-xl text-xs font-bold border transition-all ${
                  tomouMedicacao ? 'bg-cyan-600 text-white border-cyan-400' : 'bg-white/5 border-white/10 text-slate-400'
                }`}
              >
                Sim, tomei
              </button>
              <button
                type="button"
                onClick={() => setTomouMedicacao(false)}
                className={`p-1.5 rounded-xl text-xs font-bold border transition-all ${
                  !tomouMedicacao ? 'bg-rose-600 text-white border-rose-400' : 'bg-white/5 border-white/10 text-slate-400'
                }`}
              >
                Não tomei
              </button>
            </div>
          </div>
        </div>

        {/* 5. Tags Rápidas */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
            5. O que marcou o seu dia? (Selecione o que rolou)
          </label>
          <div className="flex flex-wrap gap-2">
            {TEEN_TAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                  selectedTags.includes(tag)
                    ? 'bg-gradient-to-r from-fuchsia-600 to-purple-600 border-fuchsia-400 text-white shadow-md'
                    : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* 6. Desabafo em Texto */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
            6. Desabafo Livre (Só você e seu terapeuta leem)
          </label>
          <textarea
            rows={2}
            value={desabafo}
            onChange={(e) => setDesabafo(e.target.value)}
            placeholder="Se quiser colocar algo pra fora em palavras, escreva aqui..."
            className="w-full px-3 py-2 text-xs bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-cyan-400 text-white placeholder-slate-500"
          />
        </div>

        <button
          type="submit"
          disabled={!humor}
          className={`w-full py-3.5 rounded-2xl font-black text-sm transition-all shadow-lg flex items-center justify-center gap-2 ${
            humor
              ? 'bg-gradient-to-r from-fuchsia-600 via-purple-600 to-cyan-500 text-white shadow-fuchsia-500/30'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>Salvar Check-in no Diário</span>
        </button>

      </form>

    </div>
  );
};
