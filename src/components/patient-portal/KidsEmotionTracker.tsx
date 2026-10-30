import React, { useState } from 'react';
import { NivelHumor, RegistroEmocao } from '../../types';
import { Sparkles, Heart, Star, CheckCircle2, Smile, Sparkle, ShieldCheck, Palette } from 'lucide-react';

interface KidsEmotionTrackerProps {
  pacienteNome: string;
  onSalvar: (dados: Omit<RegistroEmocao, 'id'>) => void;
  temaPadrao?: string;
  mascotePadrao?: string;
  onAtualizarPreferencia?: (tema: string, mascote: string) => void;
}

interface EmotionOption {
  nivel: NivelHumor;
  nome: string;
  emoji: string;
  bichinho: string;
  corBg: string;
  corBorda: string;
  descricao: string;
}

const KIDS_EMOTIONS: EmotionOption[] = [
  {
    nivel: 5,
    nome: 'Super Feliz',
    emoji: '⭐',
    bichinho: '🦁 Leãozinho Radiante',
    corBg: 'from-amber-400 to-yellow-300',
    corBorda: 'border-amber-400',
    descricao: 'Muito animado e alegre hoje!',
  },
  {
    nivel: 4,
    nome: 'Contente',
    emoji: '😊',
    bichinho: '🐸 Sapinho Tranquilo',
    corBg: 'from-emerald-400 to-teal-300',
    corBorda: 'border-emerald-400',
    descricao: 'Dia calmo, em paz e relaxado.',
  },
  {
    nivel: 3,
    nome: 'Neutro',
    emoji: '😐',
    bichinho: '🐢 Tartaruguinha Serena',
    corBg: 'from-blue-300 to-cyan-300',
    corBorda: 'border-blue-400',
    descricao: 'Nem triste, nem alegre. Normal.',
  },
  {
    nivel: 2,
    nome: 'Chateado',
    emoji: '🌧️',
    bichinho: '🐻 Ursinho Tristonho',
    corBg: 'from-indigo-400 to-blue-400',
    corBorda: 'border-indigo-400',
    descricao: 'Vontade de ficar no meu cantinho.',
  },
  {
    nivel: 1,
    nome: 'Zangado',
    emoji: '🌋',
    bichinho: '🐲 Dragãozinho Bravo',
    corBg: 'from-rose-500 to-red-500',
    corBorda: 'border-rose-600',
    descricao: 'Muita raiva ou irritação.',
  },
];

const MASCOTES = [
  { id: 'leao', nome: 'Leo o Leão', emoji: '🦁', frase: 'Você é muito corajoso hoje!' },
  { id: 'sapo', nome: 'Pepe o Sapo', emoji: '🐸', frase: 'Pule de alegria ou respire fundo!' },
  { id: 'urso', nome: 'Tobi o Urso', emoji: '🐻', frase: 'Um abraço bem fofinho para você!' },
  { id: 'dragao', nome: 'Pipoca o Dragão', emoji: '🐲', frase: 'Juntos superamos qualquer desafio!' },
  { id: 'estrela', nome: 'Luna a Estrela', emoji: '⭐', frase: 'Você tem um brilho especial!' },
];

const TEMAS_KIDS = [
  { id: 'safari', nome: 'Safári Aventura', bgClass: 'bg-gradient-to-b from-amber-50 to-orange-50 border-amber-200' },
  { id: 'floresta', nome: 'Bosque Mágico', bgClass: 'bg-gradient-to-b from-emerald-50 to-teal-50 border-emerald-200' },
  { id: 'galaxia', nome: 'Galáxia Estelar', bgClass: 'bg-gradient-to-b from-indigo-50 to-purple-50 border-indigo-200' },
  { id: 'reino', nome: 'Reino Encantado', bgClass: 'bg-gradient-to-b from-pink-50 to-rose-50 border-pink-200' },
];

const ATIVIDADES_LUDICAS = [
  '🎨 Desenhei ou pintei',
  '🎮 Joguei no videogame',
  '⚽ Brinquei com amigos',
  '📚 Lição da escola',
  '🌳 Passeio no parque',
  '📺 Desenho na TV',
  '🧩 Montei quebra-cabeça',
  '🐾 Brinquei com meu pet',
];

const CONQUISTAS_KIDS = [
  '⭐ Fui corajoso',
  '⭐ Comi tudinho no almoço',
  '⭐ Arrumei meus brinquedos',
  '⭐ Não tive medo de dormir',
  '⭐ Ajudei meus pais',
  '⭐ Fiz um amigo novo',
];

export const KidsEmotionTracker: React.FC<KidsEmotionTrackerProps> = ({
  pacienteNome,
  onSalvar,
  temaPadrao = 'safari',
  mascotePadrao = 'leao',
  onAtualizarPreferencia,
}) => {
  const [selectedHumor, setSelectedHumor] = useState<NivelHumor | null>(null);
  const [selectedAtividades, setSelectedAtividades] = useState<string[]>([]);
  const [selectedConquistas, setSelectedConquistas] = useState<string[]>([]);
  const [qualidadeSono, setQualidadeSono] = useState<'bom' | 'regular' | 'pessimo'>('bom');
  const [recadinho, setRecadinho] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Estados de Personalização
  const [temaAtivo, setTemaAtivo] = useState(temaPadrao);
  const [mascoteAtivo, setMascoteAtivo] = useState(mascotePadrao);
  const [mostrarPersonalizacao, setMostrarPersonalizacao] = useState(false);

  const mascoteAtual = MASCOTES.find((m) => m.id === mascoteAtivo) || MASCOTES[0];
  const temaAtual = TEMAS_KIDS.find((t) => t.id === temaAtivo) || TEMAS_KIDS[0];

  const handleTrocarTema = (novoTema: string) => {
    setTemaAtivo(novoTema);
    if (onAtualizarPreferencia) {
      onAtualizarPreferencia(novoTema, mascoteAtivo);
    }
  };

  const handleTrocarMascote = (novoMascote: string) => {
    setMascoteAtivo(novoMascote);
    if (onAtualizarPreferencia) {
      onAtualizarPreferencia(temaAtivo, novoMascote);
    }
  };

  const toggleAtividade = (atv: string) => {
    setSelectedAtividades((prev) =>
      prev.includes(atv) ? prev.filter((a) => a !== atv) : [...prev, atv]
    );
  };

  const toggleConquista = (cq: string) => {
    setSelectedConquistas((prev) =>
      prev.includes(cq) ? prev.filter((c) => c !== cq) : [...prev, cq]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHumor) return;

    const opcao = KIDS_EMOTIONS.find((e) => e.nivel === selectedHumor);

    onSalvar({
      pacienteId: '',
      dataHora: new Date().toISOString(),
      nivelHumor: selectedHumor,
      emocoesPrimarias: [opcao ? opcao.nome : ''],
      gatilhos: [...selectedAtividades, ...selectedConquistas],
      qualidadeSono,
      anotacaoLivre: recadinho.trim() || undefined,
      modoUsado: 'kids',
      atividadesLudicas: selectedAtividades,
      mascoteEscolhido: mascoteAtivo,
      temaVisual: temaAtivo,
    });

    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="bg-gradient-to-b from-amber-100 to-yellow-50 border-2 border-amber-300 rounded-3xl p-8 text-center space-y-4 shadow-xl">
        <div className="text-6xl animate-bounce">🎉</div>
        <div className="text-5xl">{mascoteAtual.emoji}</div>
        <h2 className="text-2xl font-black text-amber-950 tracking-tight">
          Registro Incrível, {pacienteNome.split(' ')[0]}!
        </h2>
        <p className="text-sm font-semibold text-amber-900 max-w-sm mx-auto">
          {mascoteAtual.nome} guardou tudinho em segredo para mostrar ao seu terapeuta!
        </p>
        <button
          type="button"
          onClick={() => {
            setIsSubmitted(false);
            setSelectedHumor(null);
            setSelectedAtividades([]);
            setSelectedConquistas([]);
            setRecadinho('');
          }}
          className="mt-4 px-6 py-2.5 rounded-full bg-amber-500 hover:bg-amber-600 text-white font-black text-sm shadow-md"
        >
          Registrar Novamente
        </button>
      </div>
    );
  }

  return (
    <div className={`p-4 sm:p-6 rounded-3xl border ${temaAtual.bgClass} shadow-md space-y-5 transition-all`}>
      
      {/* Topo com Mascote e Personalização */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-4xl p-2 rounded-2xl bg-white/80 shadow-sm border border-amber-200">
            {mascoteAtual.emoji}
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-900">
              Oi, {pacienteNome.split(' ')[0]}!
            </h2>
            <p className="text-xs font-semibold text-slate-600">
              {mascoteAtual.frase}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setMostrarPersonalizacao(!mostrarPersonalizacao)}
          className="px-3 py-1.5 rounded-xl bg-white/90 hover:bg-white text-xs font-bold text-slate-700 shadow-sm border border-slate-200 flex items-center gap-1.5 transition-all"
        >
          <Palette className="w-3.5 h-3.5 text-amber-600" />
          <span>Meu Estilo</span>
        </button>
      </div>

      {/* Painel Expansível de Personalização Kids */}
      {mostrarPersonalizacao && (
        <div className="p-4 bg-white/90 rounded-2xl border border-amber-300 shadow-sm space-y-3">
          <div>
            <label className="text-xs font-extrabold text-slate-800 block mb-1.5">
              Escolha seu Mascote Amigo:
            </label>
            <div className="grid grid-cols-5 gap-2">
              {MASCOTES.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => handleTrocarMascote(m.id)}
                  className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                    mascoteAtivo === m.id
                      ? 'border-amber-500 bg-amber-100 shadow-sm ring-2 ring-amber-400'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <span className="text-2xl">{m.emoji}</span>
                  <span className="text-[10px] font-bold text-slate-700 truncate w-full text-center">
                    {m.nome.split(' ')[0]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-extrabold text-slate-800 block mb-1.5">
              Escolha o Tema do seu Diário:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {TEMAS_KIDS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => handleTrocarTema(t.id)}
                  className={`p-2 rounded-xl text-xs font-bold border transition-all text-center ${
                    temaAtivo === t.id
                      ? 'border-amber-500 bg-amber-500 text-white shadow-sm'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {t.nome}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* Pergunta 1: Emoção com Bichinhos */}
        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
            <Heart className="w-4 h-4 text-rose-500" />
            1. Como você está se sentindo agora?
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
            {KIDS_EMOTIONS.map((opcao) => (
              <button
                key={opcao.nivel}
                type="button"
                onClick={() => setSelectedHumor(opcao.nivel)}
                className={`p-3 rounded-2xl border text-center transition-all flex sm:flex-col items-center justify-between sm:justify-center gap-2 ${
                  selectedHumor === opcao.nivel
                    ? `bg-gradient-to-tr ${opcao.corBg} ${opcao.corBorda} shadow-md scale-105 ring-2 ring-amber-400 font-black text-slate-950`
                    : 'bg-white/80 border-slate-200 hover:bg-white text-slate-700'
                }`}
              >
                <span className="text-3xl">{opcao.emoji}</span>
                <div className="text-left sm:text-center">
                  <p className="text-xs font-bold leading-tight">{opcao.nome}</p>
                  <p className="text-[10px] text-slate-600 font-medium sm:hidden">{opcao.descricao}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Pergunta 2: O que você fez de legal hoje? */}
        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500" />
            2. O que você fez hoje? (Selecione o que rolou)
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {ATIVIDADES_LUDICAS.map((atv) => (
              <button
                key={atv}
                type="button"
                onClick={() => toggleAtividade(atv)}
                className={`p-2.5 rounded-xl text-xs font-bold border transition-all text-left ${
                  selectedAtividades.includes(atv)
                    ? 'bg-amber-400 border-amber-500 text-amber-950 shadow-sm'
                    : 'bg-white/80 border-slate-200 text-slate-700 hover:bg-white'
                }`}
              >
                {atv}
              </button>
            ))}
          </div>
        </div>

        {/* Pergunta 3: Conquistas do Dia */}
        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
            <Star className="w-4 h-4 text-yellow-500" />
            3. Suas Vitórias do Dia:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {CONQUISTAS_KIDS.map((cq) => (
              <button
                key={cq}
                type="button"
                onClick={() => toggleConquista(cq)}
                className={`p-2 rounded-xl text-xs font-bold border transition-all text-left ${
                  selectedConquistas.includes(cq)
                    ? 'bg-emerald-400 border-emerald-500 text-emerald-950 shadow-sm'
                    : 'bg-white/80 border-slate-200 text-slate-700 hover:bg-white'
                }`}
              >
                {cq}
              </button>
            ))}
          </div>
        </div>

        {/* Pergunta 4: Como foi a noite de sono? */}
        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-wider text-slate-800">
            4. Como foi o seu soninho ontem à noite?
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setQualidadeSono('bom')}
              className={`p-2.5 rounded-xl text-xs font-bold border text-center transition-all ${
                qualidadeSono === 'bom'
                  ? 'bg-emerald-400 border-emerald-500 text-emerald-950 shadow-sm'
                  : 'bg-white/80 border-slate-200 text-slate-700'
              }`}
            >
              😴 Dormi Super Bem
            </button>
            <button
              type="button"
              onClick={() => setQualidadeSono('regular')}
              className={`p-2.5 rounded-xl text-xs font-bold border text-center transition-all ${
                qualidadeSono === 'regular'
                  ? 'bg-yellow-400 border-yellow-500 text-yellow-950 shadow-sm'
                  : 'bg-white/80 border-slate-200 text-slate-700'
              }`}
            >
              😐 Acordei Várias Vezes
            </button>
            <button
              type="button"
              onClick={() => setQualidadeSono('pessimo')}
              className={`p-2.5 rounded-xl text-xs font-bold border text-center transition-all ${
                qualidadeSono === 'pessimo'
                  ? 'bg-rose-400 border-rose-500 text-rose-950 shadow-sm'
                  : 'bg-white/80 border-slate-200 text-slate-700'
              }`}
            >
              🌩️ Tive Pesadelo
            </button>
          </div>
        </div>

        {/* Recadinho Secreto */}
        <div className="space-y-1.5">
          <label className="text-xs font-black uppercase tracking-wider text-slate-800">
            5. Quer escrever algo para o seu terapeuta?
          </label>
          <textarea
            rows={2}
            value={recadinho}
            onChange={(e) => setRecadinho(e.target.value)}
            placeholder="Conte algo que aconteceu hoje..."
            className="w-full px-3 py-2 text-xs bg-white/90 border border-slate-300 rounded-2xl focus:ring-2 focus:ring-amber-500 text-slate-900"
          />
        </div>

        <button
          type="submit"
          disabled={!selectedHumor}
          className={`w-full py-3.5 rounded-2xl font-black text-sm transition-all shadow-md flex items-center justify-center gap-2 ${
            selectedHumor
              ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-amber-500/20'
              : 'bg-slate-300 text-slate-500 cursor-not-allowed'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Salvar Meu Dia no Diário</span>
        </button>

      </form>

    </div>
  );
};
