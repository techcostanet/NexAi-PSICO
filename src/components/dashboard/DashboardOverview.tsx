import React from 'react';
import { useDatabase } from '../../context/DatabaseContext';
import { useAuth } from '../../context/AuthContext';
import { useSaasPlan } from '../../context/SaasPlanContext';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import {
  Users,
  Calendar,
  Camera,
  DollarSign,
  Clock,
  ArrowRight,
  FolderSync,
  MessageCircle,
} from 'lucide-react';
import { gerarLinkWhatsAppLembrete } from '../../services/calendarService';

interface DashboardOverviewProps {
  onNavigate: (view: string) => void;
  onSelectPaciente: (pacienteId: string) => void;
  onOpenScanner: () => void;
  onOpenConsultation: () => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  onNavigate,
  onSelectPaciente,
  onOpenScanner,
  onOpenConsultation,
}) => {
  const { pacientes, agendamentos, transacoes, prontuarios } = useDatabase();
  const { isProfissionalSaude } = useAuth();
  const { modules } = useSaasPlan();

  // Métricas
  const totalPacientes = pacientes.length;
  const atendimentosHoje = agendamentos.length;
  const totalScans = prontuarios.filter((p) => p.tipoRegistro === 'scan_historico_drive').length;
  const totalFaturado = transacoes
    .filter((t) => t.status === 'pago')
    .reduce((acc, curr) => acc + curr.valor, 0);

  // Estimativa do Passivo de 1.500 fichas
  const metaTotalPassivo = 1500;
  const porcentagemDigitalizada = Math.min(100, Math.round((totalScans / metaTotalPassivo) * 100) + 1);

  return (
    <div className="space-y-6">
      
      {/* Grid de Métricas Principais */}
      <div className={`grid ${modules.scannerFichas ? 'grid-cols-2 lg:grid-cols-4' : 'grid-cols-1 sm:grid-cols-3'} gap-4`}>
        
        <Card
          onClick={() => onNavigate('pacientes')}
          hoverable
          className="p-5 border-l-4 border-l-brand-500"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Pacientes Ativos</span>
            <Users className="w-4 h-4 text-brand-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            {totalPacientes}
          </div>
          <p className="text-[11px] text-brand-600 mt-1 flex items-center gap-1 font-medium">
            Ver todos <ArrowRight className="w-3 h-3" />
          </p>
        </Card>

        <Card
          onClick={() => onNavigate('agenda')}
          hoverable
          className="p-5 border-l-4 border-l-blue-500"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Atendimentos Hoje</span>
            <Calendar className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            {atendimentosHoje}
          </div>
          <p className="text-[11px] text-blue-600 mt-1 flex items-center gap-1 font-medium">
            Google Calendar <ArrowRight className="w-3 h-3" />
          </p>
        </Card>

        {/* Métrica de Scanner (somente se módulo ativo) */}
        {modules.scannerFichas && (
          <Card
            onClick={() => onNavigate('scanner')}
            hoverable
            className="p-5 border-l-4 border-l-amber-500"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Passivo no Google Drive</span>
              <FolderSync className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
              {totalScans} <span className="text-xs font-normal text-slate-400">/ 1.500 fichas</span>
            </div>
            <p className="text-[11px] text-amber-600 mt-1 flex items-center gap-1 font-medium">
              Digitalização <ArrowRight className="w-3 h-3" />
            </p>
          </Card>
        )}

        <Card
          onClick={() => onNavigate('financeiro')}
          hoverable
          className="p-5 border-l-4 border-l-emerald-500"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Faturamento Mês</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1 font-mono">
            R$ {totalFaturado.toFixed(0)}
          </div>
          <p className="text-[11px] text-emerald-600 mt-1 flex items-center gap-1 font-medium">
            Recibos <ArrowRight className="w-3 h-3" />
          </p>
        </Card>

      </div>

      {/* Seção Central: Atendimentos de Hoje */}
      <div className={`grid grid-cols-1 ${modules.scannerFichas ? 'lg:grid-cols-3' : ''} gap-6`}>
        
        {/* Atendimentos do Dia */}
        <div className={`${modules.scannerFichas ? 'lg:col-span-2' : 'w-full'} space-y-4`}>
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-brand-600" />
              Atendimentos Programados para Hoje
            </h3>
            <button
              onClick={() => onNavigate('agenda')}
              className="text-xs font-bold text-brand-600 hover:text-brand-700"
            >
              Abrir Agenda
            </button>
          </div>

          <div className="space-y-3">
            {agendamentos.slice(0, 3).map((agend) => (
              <Card
                key={agend.id}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-300 transition-all"
              >
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300 flex flex-col items-center justify-center font-mono font-bold text-xs flex-shrink-0">
                    <span>
                      {new Date(agend.dataHoraInicio).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div>
                    <h4
                      onClick={() => onSelectPaciente(agend.pacienteId)}
                      className="text-sm font-bold text-slate-900 dark:text-white hover:text-brand-600 cursor-pointer"
                    >
                      {agend.pacienteNome}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Profissional: {agend.profissionalNome} ({agend.especialidade})
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={gerarLinkWhatsAppLembrete(agend)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    title="Confirmar no WhatsApp"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span className="hidden sm:inline">WhatsApp</span>
                  </a>

                  {isProfissionalSaude && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => {
                        onSelectPaciente(agend.pacienteId);
                        if (modules.consultaIa) {
                          onOpenConsultation();
                        }
                      }}
                      className="text-xs"
                    >
                      {modules.consultaIa ? 'Atender com IA' : 'Prontuário'}
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Card de Transição Físico ➔ Drive (somente se módulo scanner ativo) */}
        {modules.scannerFichas && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Camera className="w-4 h-4 text-amber-600" />
              Transição Físico ➔ Drive
            </h3>

            <Card className="p-5 space-y-4 bg-gradient-to-br from-amber-50/50 to-orange-50/20 dark:from-slate-900 dark:to-slate-800 border-amber-200/80 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-900 dark:text-amber-200">
                  Digitalização
                </span>
                <Badge variant="warning">{porcentagemDigitalizada}% concluído</Badge>
              </div>

              {/* Barra de Progresso */}
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-amber-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.max(5, porcentagemDigitalizada)}%` }}
                />
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                <strong>Dica de Operação:</strong> Toda manhã, a recepção pega apenas as pastas dos pacientes que têm consulta hoje e fotografa em 1 minuto cada.
              </p>

              <Button
                variant="outline"
                size="sm"
                leftIcon={<Camera className="w-4 h-4 text-amber-600" />}
                onClick={onOpenScanner}
                className="w-full justify-center border-amber-300 text-amber-900 hover:bg-amber-100/50"
              >
                Abrir Scanner
              </Button>
            </Card>
          </div>
        )}

      </div>

    </div>
  );
};
