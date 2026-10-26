import React, { useState } from 'react';
import { Paciente, RegistroEmocao, ModoInterfaceEmocao } from '../../types';
import { useDatabase } from '../../context/DatabaseContext';
import { useToast } from '../../context/ToastContext';
import {
  Heart,
  TrendingUp,
  AlertTriangle,
  Sparkles,
  MessageCircle,
  Share2,
  ExternalLink,
  ShieldCheck,
  Moon,
  Pill,
  Check,
  Copy,
  ChevronRight,
  Smile,
  Zap,
  Info,
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

interface EmotionAnalyticsViewProps {
  paciente: Paciente;
  registros: RegistroEmocao[];
  onOpenPatientPortal?: (pacienteId: string) => void;
}

export const EmotionAnalyticsView: React.FC<EmotionAnalyticsViewProps> = ({
  paciente,
  registros,
  onOpenPatientPortal,
}) => {
  const { atualizarConfiguracaoDiario } = useDatabase();
  const { showToast } = useToast();

  const config = paciente.configuracaoDiario || {
    habilitado: true,
    modoInterfaceDefault: 'adulto',
    tokenAcesso: `pac-${paciente.id.substring(4)}`,
    pinAcesso: '1234',
    atualizadoEm: new Date().toISOString(),
  };

  const [isHabilitado, setIsHabilitado] = useState(config.habilitado);
  const [modoDefault, setModoDefault] = useState<ModoInterfaceEmocao>(config.modoInterfaceDefault);
  const [pinAcesso, setPinAcesso] = useState(config.pinAcesso || '1234');
  
  // Estado da Síntese IA
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiSynthesis, setAiSynthesis] = useState<string | null>(null);

  // Manipular alteração de configuração
  const handleToggleHabilitado = (habilitar: boolean) => {
    setIsHabilitado(habilitar);
    atualizarConfiguracaoDiario(paciente.id, { habilitado: habilitar });
    showToast(habilitar ? 'Diário de Emoções ativado para este paciente!' : 'Diário desativado.', habilitar ? 'success' : 'info');
  };

  const handleMudarModo = (novoModo: ModoInterfaceEmocao) => {
    setModoDefault(novoModo);
    atualizarConfiguracaoDiario(paciente.id, { modoInterfaceDefault: novoModo });
    showToast(`Modo alterado para ${novoModo.toUpperCase()}`, 'success');
  };

  // Link de Acesso do Paciente
  const portalUrl = `${window.location.origin}/?portal=true&termo=${config.tokenAcesso || paciente.cpf.replace(/\D/g, '')}`;

  const handleCopiarLink = () => {
    navigator.clipboard.writeText(portalUrl);
    showToast('Link do Diário copiado para a área de transferência!', 'success');
  };

  const handleEnviarWhatsApp = () => {
    const primeiroNome = paciente.nomeCompleto.split(' ')[0];
    const modoTexto = modoDefault === 'kids' ? 'Infantil' : modoDefault === 'teen' ? 'Jovem' : 'Adulto';
    
    const mensagem = encodeURIComponent(
      `Olá, ${primeiroNome}! Seu psicólogo/médico liberou seu acesso ao Diário de Emoções NexAi (Modo ${modoTexto}).\n\n` +
      `Para registrar seus sentimentos pelo celular, toque no link abaixo e selecione "Adicionar à Tela de Início":\n` +
      `${portalUrl}\n\n` +
      `Código de acesso rápido: ${config.tokenAcesso || paciente.cpf}`
    );

    const telefoneLimpo = paciente.telefone.replace(/\D/g, '');
    window.open(`https://api.whatsapp.com/send?phone=${telefoneLimpo}&text=${mensagem}`, '_blank');
  };

  // Cálculos Estatísticos
  const totalRegistros = registros.length;
  const mediaHumor = totalRegistros > 0
    ? (registros.reduce((acc, curr) => acc + curr.nivelHumor, 0) / totalRegistros).toFixed(1)
    : '0';

  // Contagem de Gatilhos
  const gatilhosCount: Record<string, number> = {};
  registros.forEach((r) => {
    r.gatilhos.forEach((g) => {
      gatilhosCount[g] = (gatilhosCount[g] || 0) + 1;
    });
  });

  const gatilhosOrdenados = Object.entries(gatilhosCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Alerta de Humor Crítico (se os 2 registros mais recentes foram <= 2)
  const alertaCritico = registros.length >= 2 && registros[0].nivelHumor <= 2 && registros[1].nivelHumor <= 2;

  // Gerador de Síntese Clínica com IA
  const handleGerarSinteseIA = () => {
    setIsGeneratingAi(true);
    setTimeout(() => {
      setIsGeneratingAi(false);
      
      const principaisGatilhos = gatilhosOrdenados.map(([g]) => g).join(', ');
      const nomeCurto = paciente.nomeCompleto.split(' ')[0];

      let sintese = `**Síntese Tímica (${totalRegistros} registros analisados)**\n\n`;
      sintese += `• **Oscilação do Humor:** Média de ${mediaHumor}/5.0 no período inter-sessões. O paciente demonstrou oscilação com picos positivos associados a momentos de lazer/sono adequado, intercalados com episódios de sobrecarga.\n`;
      sintese += `• **Gatilhos Preponderantes:** As maiores associações registradas foram: ${principaisGatilhos || 'Trabalho e Rotina'}.\n`;
      
      if (alertaCritico) {
        sintese += `• ⚠️ **Ponto de Atenção Clínico:** Registrados episódios consecutivos de humor baixo com queixas de insônia e ansiedade.\n`;
      }

      sintese += `• **Sugestão para a Sessão de Hoje:** Investigar a reestruturação cognitiva em relação à cobrança interpessoal e revisar a adesão à higiene do sono e psicofármacos.`;

      setAiSynthesis(sintese);
      showToast('Síntese clínica gerada com sucesso!', 'success');
    }, 1200);
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Card de Controle SaaS & Compartilhamento WhatsApp */}
      <div className="bg-gradient-to-r from-teal-900 via-brand-900 to-slate-900 text-white p-5 rounded-3xl shadow-md border border-teal-500/20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xl">📱</span>
              <h3 className="text-base font-bold text-white">
                Módulo SaaS: Diário de Emoções do Paciente
              </h3>
              <Badge variant={isHabilitado ? 'success' : 'neutral'}>
                {isHabilitado ? 'Acesso Ativo' : 'Acesso Desativado'}
              </Badge>
            </div>
            <p className="text-xs text-teal-200">
              O paciente registra sentimentos pelo celular (PWA) e você analisa as oscilações na consulta.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            
            {/* Toggle de Ativação */}
            <button
              onClick={() => handleToggleHabilitado(!isHabilitado)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                isHabilitado
                  ? 'bg-rose-500/20 text-rose-200 border-rose-400/30 hover:bg-rose-500/30'
                  : 'bg-emerald-500 text-white border-emerald-400 hover:bg-emerald-600'
              }`}
            >
              {isHabilitado ? 'Desativar Acesso' : 'Ativar Diário'}
            </button>

            {/* Botão de Enviar WhatsApp */}
            <button
              onClick={handleEnviarWhatsApp}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              Enviar pelo WhatsApp
            </button>

            {/* Abrir Visão do Paciente (Para testar na hora) */}
            {onOpenPatientPortal && (
              <button
                onClick={() => onOpenPatientPortal(paciente.id)}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 border border-white/20 transition-all"
                title="Abrir como o paciente enxerga no celular"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Visualizar Portal
              </button>
            )}

          </div>

        </div>

        {/* Configuração de Modo (Kids, Teen, Adulto) */}
        <div className="mt-4 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-teal-200 font-semibold">Perfil de Interface Recomendado:</span>
            <div className="inline-flex bg-black/20 p-1 rounded-xl border border-white/10">
              <button
                onClick={() => handleMudarModo('kids')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  modoDefault === 'kids' ? 'bg-amber-400 text-amber-950' : 'text-teal-200 hover:text-white'
                }`}
              >
                🦁 Kids (Infantil)
              </button>
              <button
                onClick={() => handleMudarModo('teen')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  modoDefault === 'teen' ? 'bg-indigo-500 text-white' : 'text-teal-200 hover:text-white'
                }`}
              >
                ⚡ Teen (Jovem)
              </button>
              <button
                onClick={() => handleMudarModo('adulto')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  modoDefault === 'adulto' ? 'bg-teal-500 text-white' : 'text-teal-200 hover:text-white'
                }`}
              >
                🌿 Adulto
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-teal-200 font-mono">Código WhatsApp: <strong>{config.tokenAcesso || paciente.cpf}</strong></span>
            <button
              onClick={handleCopiarLink}
              className="text-teal-300 hover:text-white p-1 rounded hover:bg-white/10 transition-colors"
              title="Copiar Link"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* 2. Alerta Crítico Clínico (Se houver) */}
      {alertaCritico && (
        <div className="bg-rose-50 dark:bg-rose-950/40 border-2 border-rose-300 dark:border-rose-800 p-4 rounded-2xl flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500 text-white flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-rose-900 dark:text-rose-200">
                Alerta de Humor Crítico Inter-sessões
              </p>
              <p className="text-xs text-rose-700 dark:text-rose-300 mt-0.5">
                O paciente registrou nível de humor difícil/crise por 2 ou mais dias consecutivos associado a insônia.
              </p>
            </div>
          </div>
          <Badge variant="danger">Atenção Prioritária</Badge>
        </div>
      )}

      {/* 3. Indicadores Gerais & Síntese com Gemini */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Card Média de Humor */}
        <Card className="p-4 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Média Tímica (Humor)
            </span>
            <Heart className="w-4 h-4 text-rose-500" />
          </div>
          <div className="my-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{mediaHumor}</span>
            <span className="text-xs text-slate-400">/ 5.0</span>
          </div>
          <p className="text-[11px] text-slate-500">
            Baseado em {totalRegistros} check-ins registrados pelo paciente
          </p>
        </Card>

        {/* Card Principais Gatilhos */}
        <Card className="p-4 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Maiores Gatilhos
            </span>
            <TrendingUp className="w-4 h-4 text-brand-600" />
          </div>
          <div className="my-1 space-y-1">
            {gatilhosOrdenados.slice(0, 2).map(([gatilho, qtd]) => (
              <div key={gatilho} className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-300 truncate">{gatilho}</span>
                <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full font-mono">
                  {qtd}x
                </span>
              </div>
            ))}
            {gatilhosOrdenados.length === 0 && (
              <p className="text-xs text-slate-400">Nenhum gatilho apontado ainda.</p>
            )}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Fatores que mais influenciaram o humor</p>
        </Card>

        {/* Card Botão Síntese IA */}
        <Card className="p-4 rounded-2xl bg-gradient-to-br from-brand-50 to-teal-50 dark:from-slate-900 dark:to-teal-950/30 border-brand-200 dark:border-brand-800/40 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-brand-800 dark:text-brand-300 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Síntese Clínica IA
            </span>
            <span className="text-[10px] bg-brand-600 text-white px-2 py-0.5 rounded-md font-bold">Gemini</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 my-2">
            Gere uma correlação entre oscilações de humor, sono e gatilhos para orientar a sessão.
          </p>
          <Button
            size="sm"
            variant="primary"
            onClick={handleGerarSinteseIA}
            disabled={isGeneratingAi || totalRegistros === 0}
            className="w-full text-xs shadow-md shadow-brand-500/20"
          >
            {isGeneratingAi ? 'Analisando registros...' : 'Analisar Padrões com IA'}
          </Button>
        </Card>

      </div>

      {/* Caixa de Texto da Síntese IA (Quando gerada) */}
      {aiSynthesis && (
        <Card className="p-5 rounded-2xl bg-brand-50/70 dark:bg-brand-950/30 border border-brand-200 dark:border-brand-800 space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-600" />
              <h4 className="text-xs font-bold text-brand-950 dark:text-brand-200 uppercase tracking-wider">
                Relatório de Padrões Emocionais (Gerado por IA)
              </h4>
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(aiSynthesis);
                showToast('Síntese copiada para a área de transferência!', 'success');
              }}
              className="text-xs font-semibold text-brand-700 dark:text-brand-300 hover:underline flex items-center gap-1"
            >
              <Copy className="w-3.5 h-3.5" /> Copiar para o SOAP
            </button>
          </div>
          <div className="text-xs text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed bg-white/70 dark:bg-slate-900/70 p-4 rounded-xl border border-brand-200/60 dark:border-brand-900/60">
            {aiSynthesis}
          </div>
        </Card>
      )}

      {/* 4. Gráfico Visual Interativo de Oscilação Tímica */}
      <Card className="p-5 rounded-3xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-brand-600" />
              Gráfico Evolutivo de Oscilação de Humor (Inter-sessões)
            </h4>
            <p className="text-xs text-slate-400">
              Variação do humor do paciente ao longo dos dias registrados
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-500">
            Escala: 1 (Crise) a 5 (Radiante)
          </span>
        </div>

        {totalRegistros === 0 ? (
          <div className="text-center py-10 text-xs text-slate-400">
            Nenhum registro de emoção realizado por este paciente ainda. Envie o link do WhatsApp para ele começar.
          </div>
        ) : (
          <div className="space-y-3 pt-2">
            
            {/* Visualização em Linha do Tempo / Barras Dinâmicas */}
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2.5">
              {[...registros].reverse().map((reg) => {
                const data = new Date(reg.dataHora);
                const dataLabel = data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
                const horaLabel = data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

                const humorConfig = {
                  5: { cor: 'bg-emerald-500', label: 'Muito Bem', emoji: '⭐' },
                  4: { cor: 'bg-teal-500', label: 'Bem', emoji: '😊' },
                  3: { cor: 'bg-blue-400', label: 'Neutro', emoji: '😐' },
                  2: { cor: 'bg-amber-500', label: 'Difícil', emoji: '🌧️' },
                  1: { cor: 'bg-rose-500', label: 'Crise', emoji: '🌋' },
                }[reg.nivelHumor];

                const alturaPorcentagem = (reg.nivelHumor / 5) * 100;

                return (
                  <div
                    key={reg.id}
                    className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 flex flex-col justify-between hover:shadow-md transition-all group"
                  >
                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mb-2">
                      <span>{dataLabel}</span>
                      <span>{horaLabel}</span>
                    </div>

                    <div className="my-2 flex items-center justify-center">
                      <span className="text-2xl group-hover:scale-125 transition-transform">
                        {humorConfig.emoji}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${humorConfig.cor} transition-all rounded-full`}
                          style={{ width: `${alturaPorcentagem}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="font-bold text-slate-700 dark:text-slate-300 truncate">
                          {humorConfig.label}
                        </span>
                        <span className="font-bold text-slate-500">{reg.nivelHumor}/5</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        )}
      </Card>

      {/* 5. Tabela Completa de Registros do Paciente */}
      <Card className="p-5 rounded-3xl space-y-4">
        <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          Histórico Detalhado dos Registros ({registros.length})
        </h4>

        <div className="space-y-2.5">
          {registros.map((item) => {
            const dataFmt = new Date(item.dataHora).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-white dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 space-y-2 hover:border-slate-300 transition-colors"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">
                      {item.nivelHumor === 5 && '⭐'}
                      {item.nivelHumor === 4 && '😊'}
                      {item.nivelHumor === 3 && '😐'}
                      {item.nivelHumor === 2 && '🌧️'}
                      {item.nivelHumor === 1 && '🌋'}
                    </span>
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {item.emocoesPrimarias.join(', ') || `Humor ${item.nivelHumor}/5`}
                    </span>
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                      Modo {item.modoUsado}
                    </span>
                  </div>

                  <span className="text-xs text-slate-400 font-mono">
                    {dataFmt}
                  </span>
                </div>

                {/* Gatilhos e Tags */}
                {item.gatilhos.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[11px] font-semibold text-slate-400">Gatilhos:</span>
                    {item.gatilhos.map((gat) => (
                      <span
                        key={gat}
                        className="text-[11px] bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-lg border border-slate-200 dark:border-slate-600"
                      >
                        {gat}
                      </span>
                    ))}
                  </div>
                )}

                {/* Sono e Remédio */}
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                  {item.qualidadeSono && (
                    <span className="flex items-center gap-1">
                      <Moon className="w-3.5 h-3.5 text-indigo-500" />
                      Sono: <strong>{item.qualidadeSono === 'bom' ? 'Bom / Repousador' : item.qualidadeSono === 'pessimo' ? 'Ruim / Insônia' : 'Regular'}</strong>
                    </span>
                  )}
                  {item.tomouMedicacao !== undefined && (
                    <span className="flex items-center gap-1">
                      <Pill className="w-3.5 h-3.5 text-teal-600" />
                      Medicação: <strong>{item.tomouMedicacao ? 'Tomou' : 'Não tomou'}</strong>
                    </span>
                  )}
                </div>

                {/* Anotação do Paciente */}
                {item.anotacaoLivre && (
                  <div className="mt-2 p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl text-xs text-slate-700 dark:text-slate-300 border-l-2 border-brand-500 italic">
                    "{item.anotacaoLivre}"
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>

    </div>
  );
};
