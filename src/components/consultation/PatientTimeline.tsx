import React, { useState } from 'react';
import { ProntuarioRegistro, Paciente } from '../../types';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import {
  FileText,
  Calendar,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  FolderSync,
  Sparkles,
  Heart,
  Pill,
} from 'lucide-react';
import { useDatabase } from '../../context/DatabaseContext';
import { useSaasPlan } from '../../context/SaasPlanContext';
import { EmotionAnalyticsView } from '../emotions/EmotionAnalyticsView';

interface PatientTimelineProps {
  paciente: Paciente;
  prontuarios: ProntuarioRegistro[];
  onOpenConsultation?: () => void;
  onOpenScanner?: () => void;
  onOpenPatientPortal?: (pacienteId: string) => void;
}

export const PatientTimeline: React.FC<PatientTimelineProps> = ({
  paciente,
  prontuarios,
  onOpenConsultation,
  onOpenScanner,
  onOpenPatientPortal,
}) => {
  const { obterEmocoesDoPaciente } = useDatabase();
  const { modules } = useSaasPlan();
  const emocoes = obterEmocoesDoPaciente(paciente.id);

  const [activeTab, setActiveTab] = useState<'prontuarios' | 'emocoes'>('prontuarios');
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({
    [prontuarios[0]?.id || '']: true, // Primeiro registro aberto por padrão
  });

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const calcularIdade = (dataNasc: string) => {
    if (!dataNasc) return '';
    const hoje = new Date();
    const nasc = new Date(dataNasc);
    let anos = hoje.getFullYear() - nasc.getFullYear();
    const m = hoje.getMonth() - nasc.getMonth();
    if (m < 0 || (m === 0 && hoje.getDate() < nasc.getDate())) {
      anos--;
    }
    return anos > 0 ? `${anos} anos` : '';
  };

  return (
    <div className="space-y-6">
      
      {/* Cabeçalho Claro do Paciente com Foto e Alertas */}
      <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="flex items-start sm:items-center gap-4">
            {/* Foto ou Avatar com Iniciais */}
            {paciente.fotoUrl ? (
              <img
                src={paciente.fotoUrl}
                alt={paciente.nomeCompleto}
                className="w-16 h-16 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 shadow-sm shrink-0"
              />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300 font-extrabold text-xl flex items-center justify-center border border-brand-200 dark:border-brand-800 shrink-0">
                {paciente.nomeCompleto.split(' ').map((n) => n[0]).slice(0, 2).join('')}
              </div>
            )}

            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                  {paciente.nomeCompleto}
                </h2>
                <Badge variant={paciente.status === 'ativo' ? 'success' : 'neutral'}>
                  {paciente.status === 'ativo' ? 'Tratamento Ativo' : 'Inativo'}
                </Badge>
                {paciente.configuracaoDiario?.habilitado && (
                  <Badge variant="brand" size="sm">
                    {paciente.configuracaoDiario.modoInterfaceDefault === 'kids'
                      ? 'Diário Kids'
                      : paciente.configuracaoDiario.modoInterfaceDefault === 'teen'
                      ? 'Diário Teen'
                      : 'Diário Adulto'}
                  </Badge>
                )}
              </div>

              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                <span>CPF: {paciente.cpf}</span>
                <span>•</span>
                <span>
                  {new Date(paciente.dataNascimento).toLocaleDateString('pt-BR')}
                  {calcularIdade(paciente.dataNascimento) ? ` (${calcularIdade(paciente.dataNascimento)})` : ''}
                </span>
                <span>•</span>
                <span>Tel: {paciente.telefone}</span>
                {paciente.dadosConvenio?.nomeConvenio && (
                  <>
                    <span>•</span>
                    <span>Convênio: {paciente.dadosConvenio.nomeConvenio}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {modules.diarioHumor && paciente.configuracaoDiario?.habilitado && onOpenPatientPortal && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onOpenPatientPortal(paciente.id)}
                className="text-xs flex items-center gap-1.5"
                title="Abrir o diário como o paciente vê no smartphone"
              >
                <Heart className="w-3.5 h-3.5 text-teal-600" />
                Portal
              </Button>
            )}
            {modules.scannerFichas && onOpenScanner && (
              <Button
                variant="outline"
                size="sm"
                onClick={onOpenScanner}
                className="text-xs"
              >
                Digitalizar
              </Button>
            )}
            {modules.consultaIa && onOpenConsultation && (
              <Button
                variant="primary"
                size="sm"
                onClick={onOpenConsultation}
                className="text-xs shadow-md shadow-brand-500/20"
              >
                Nova Consulta
              </Button>
            )}
          </div>
        </div>

        {/* Alertas Clínicos em Destaque Claro */}
        {((paciente.alertasMedicos && paciente.alertasMedicos.length > 0) ||
          (paciente.alergias && paciente.alergias.length > 0)) && (
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" /> Alertas Clínicos:
            </span>
            {paciente.alertasMedicos?.map((alerta, i) => (
              <span
                key={i}
                className="text-[11px] bg-rose-50 border border-rose-200 text-rose-700 dark:bg-rose-950/40 dark:border-rose-900/50 dark:text-rose-300 px-2.5 py-0.5 rounded-full font-medium"
              >
                {alerta}
              </span>
            ))}
            {paciente.alergias?.map((alergia, i) => (
              <span
                key={i}
                className="text-[11px] bg-amber-50 border border-amber-200 text-amber-800 dark:bg-amber-950/40 dark:border-amber-900/50 dark:text-amber-300 px-2.5 py-0.5 rounded-full font-medium"
              >
                Alergia: {alergia}
              </span>
            ))}
          </div>
        )}
      </Card>

      {/* Barra de Abas do Prontuário (somente se Diário de Humor estiver ativo) */}
      {modules.diarioHumor && (
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
          <button
            onClick={() => setActiveTab('prontuarios')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all ${
              activeTab === 'prontuarios'
                ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Consultas ({prontuarios.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('emocoes')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all ${
              activeTab === 'emocoes'
                ? 'bg-gradient-to-r from-teal-600 to-brand-700 text-white shadow-md shadow-teal-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Heart className="w-4 h-4 text-teal-400" />
            <span>Diário de Emoções</span>
            <span className="bg-teal-500 text-white text-[10px] font-mono px-2 py-0.5 rounded-full">
              {emocoes.length}
            </span>
          </button>
        </div>
      )}

      {/* Conteúdo da Aba 2: Diário de Emoções & Analytics */}
      {modules.diarioHumor && activeTab === 'emocoes' && (
        <EmotionAnalyticsView
          paciente={paciente}
          registros={emocoes}
          onOpenPatientPortal={onOpenPatientPortal}
        />
      )}

      {/* Conteúdo da Linha do Tempo Clínica */}
      {(!modules.diarioHumor || activeTab === 'prontuarios') && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-brand-600" />
              Linha do Tempo Clínica ({prontuarios.length} Registros)
            </h3>
            <span className="text-xs text-slate-400">Ordenado por data mais recente</span>
          </div>

          {prontuarios.length === 0 ? (
            <Card className="text-center py-10">
              <p className="text-sm text-slate-500">Nenhum prontuário registrado para este paciente ainda.</p>
            </Card>
          ) : (
            <div className="space-y-4 relative before:absolute before:inset-0 before:left-6 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
              {prontuarios.map((reg) => {
                const isExpanded = !!expandedIds[reg.id];
                const isScan = reg.tipoRegistro === 'scan_historico_drive';

                return (
                  <div key={reg.id} className="relative pl-12">
                    
                    {/* Marcador do nó na timeline */}
                    <div
                      className={`absolute left-3.5 -translate-x-1/2 top-4 w-6 h-6 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900 shadow-sm ${
                        isScan ? 'bg-amber-500 text-white' : 'bg-brand-600 text-white'
                      }`}
                    >
                      {isScan ? (
                        <FolderSync className="w-3 h-3" />
                      ) : (
                        <Sparkles className="w-3 h-3" />
                      )}
                    </div>

                    <Card className="overflow-hidden transition-all duration-200 hover:border-slate-300 dark:hover:border-slate-700">
                      
                      {/* Header do Card */}
                      <div
                        onClick={() => toggleExpand(reg.id)}
                        className="flex items-center justify-between cursor-pointer p-1"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-slate-900 dark:text-white">
                              {isScan ? 'Prontuário Físico Histórico Digitalizado' : 'Evolução Clínica com IA (SOAP)'}
                            </span>
                            {isScan ? (
                              <Badge variant="warning">Scan Google Drive</Badge>
                            ) : (
                              <Badge variant="brand">Atendimento Clínico</Badge>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            {new Date(reg.dataAtendimento).toLocaleDateString('pt-BR')} às{' '}
                            {new Date(reg.dataAtendimento).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} • Responsável: {reg.profissionalNome} ({reg.profissionalRegistro})
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-slate-400" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-slate-400" />
                          )}
                        </div>
                      </div>

                      {/* Conteúdo Expandido */}
                      {isExpanded && (
                        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
                          
                          {/* Se for Scan do Google Drive */}
                          {isScan && reg.scanDriveMetadados && (
                            <div className="bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-amber-900 dark:text-amber-200">
                                  Documento em PDF ({reg.scanDriveMetadados.quantidadePaginas} páginas escaneadas)
                                </span>
                                <span className="text-xs text-amber-700 dark:text-amber-300">
                                  Período: {reg.scanDriveMetadados.dataOriginalDocumento || 'Anterior a 2026'}
                                </span>
                              </div>
                              <p className="text-xs text-slate-600 dark:text-slate-300">
                                {reg.scanDriveMetadados.observacoes}
                              </p>

                              <div className="flex items-center gap-3 pt-1">
                                <a
                                  href={reg.scanDriveMetadados.driveWebViewLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600 text-white text-xs font-semibold hover:bg-amber-700 shadow-sm"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                  Abrir PDF no Google Drive
                                </a>
                              </div>
                            </div>
                          )}

                          {/* Se for Evolução Clínica SOAP */}
                          {!isScan && reg.conteudoClinico && (
                            <div className="space-y-3 text-xs">
                              
                              {/* Subjetivo */}
                              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
                                <span className="font-bold text-brand-700 dark:text-brand-300 block mb-1">
                                  [S] Subjetivo:
                                </span>
                                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                                  {reg.conteudoClinico.subjetivo}
                                </p>
                              </div>

                              {/* Objetivo */}
                              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
                                <span className="font-bold text-blue-700 dark:text-blue-300 block mb-1">
                                  [O] Objetivo:
                                </span>
                                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                                  {reg.conteudoClinico.objetivo}
                                </p>
                              </div>

                              {/* Avaliação */}
                              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
                                <span className="font-bold text-purple-700 dark:text-purple-300 block mb-1">
                                  [A] Avaliação Diagnóstica:
                                </span>
                                <p className="text-slate-900 dark:text-white font-semibold">
                                  {reg.conteudoClinico.avaliacao}
                                </p>
                              </div>

                              {/* Plano Terapêutico */}
                              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
                                <span className="font-bold text-emerald-700 dark:text-emerald-300 block mb-1">
                                  [P] Plano Terapêutico:
                                </span>
                                <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                                  {reg.conteudoClinico.planoTerapeutico}
                                </p>
                              </div>

                              {/* Prescrição de Medicamentos */}
                              {reg.conteudoClinico.medicacoesPrescritas &&
                                reg.conteudoClinico.medicacoesPrescritas.length > 0 && (
                                  <div className="p-3 bg-brand-50/40 dark:bg-brand-950/20 border border-brand-200 dark:border-brand-900 rounded-xl space-y-2">
                                    <span className="font-bold text-brand-900 dark:text-brand-200 flex items-center gap-1.5">
                                      <Pill className="w-3.5 h-3.5 text-brand-600" />
                                      Prescrição Emitida nesta Sessão:
                                    </span>
                                    <div className="space-y-1">
                                      {reg.conteudoClinico.medicacoesPrescritas.map((med, idx) => (
                                        <div
                                          key={idx}
                                          className="flex items-center justify-between text-[11px] bg-white dark:bg-slate-800 p-2 rounded-lg border border-slate-200/60 dark:border-slate-700"
                                        >
                                          <span className="font-semibold text-slate-800 dark:text-slate-200">
                                            {med.nome} {med.dosagem} — {med.posologia}
                                          </span>
                                          {med.controlada && (
                                            <Badge variant="warning" size="sm">Portaria 344</Badge>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                            </div>
                          )}

                        </div>
                      )}

                    </Card>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
