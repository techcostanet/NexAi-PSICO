import React, { useState } from 'react';
import { useDatabase } from '../../context/DatabaseContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Agendamento, StatusAgendamento } from '../../types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Modal } from '../ui/Modal';
import {
  Calendar,
  Clock,
  MessageCircle,
  ExternalLink,
  Plus,
  Video,
  User,
  CheckCircle2,
  CalendarCheck,
  Phone,
} from 'lucide-react';
import { gerarLinkWhatsAppLembrete, gerarUrlGoogleCalendarWeb } from '../../services/calendarService';

interface ScheduleCalendarProps {
  onSelectPaciente?: (pacienteId: string) => void;
  onOpenConsultationForPaciente?: (pacienteId: string) => void;
}

export const ScheduleCalendar: React.FC<ScheduleCalendarProps> = ({
  onSelectPaciente,
  onOpenConsultationForPaciente,
}) => {
  const { agendamentos, pacientes, adicionarAgendamento, atualizarStatusAgendamento } = useDatabase();
  const { currentUser, isProfissionalSaude } = useAuth();
  const { showToast } = useToast();

  const [filterView, setFilterView] = useState<'todos' | 'hoje' | 'meus'>('hoje');
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);

  // Formulário de Novo Agendamento
  const [novoAgendamento, setNovoAgendamento] = useState({
    pacienteId: pacientes[0]?.id || '',
    profissionalId: currentUser.id,
    profissionalNome: currentUser.nome,
    especialidade: currentUser.especialidade || 'Psiquiatria',
    data: new Date().toISOString().split('T')[0],
    hora: '14:00',
    tipoConsulta: 'retorno' as const,
    modalidade: 'presencial' as const,
    valorCobrado: 400.00,
    pagamentoStatus: 'pendente' as const,
    notasRecepcao: '',
  });

  const handleSalvarAgendamento = (e: React.FormEvent) => {
    e.preventDefault();
    const paciente = pacientes.find((p) => p.id === novoAgendamento.pacienteId);
    if (!paciente) return;

    const dataHoraInicio = `${novoAgendamento.data}T${novoAgendamento.hora}:00`;
    const dataHoraFim = new Date(new Date(dataHoraInicio).getTime() + 50 * 60 * 1000).toISOString();

    adicionarAgendamento({
      pacienteId: paciente.id,
      pacienteNome: paciente.nomeCompleto,
      pacienteTelefone: paciente.telefone,
      profissionalId: novoAgendamento.profissionalId,
      profissionalNome: novoAgendamento.profissionalNome,
      especialidade: novoAgendamento.especialidade,
      dataHoraInicio,
      dataHoraFim,
      tipoConsulta: novoAgendamento.tipoConsulta,
      modalidade: novoAgendamento.modalidade,
      status: 'confirmado',
      sincronizadoGoogle: true,
      valorCobrado: novoAgendamento.valorCobrado,
      pagamentoStatus: novoAgendamento.pagamentoStatus,
      notasRecepcao: novoAgendamento.notasRecepcao,
    });

    setIsNewModalOpen(false);
    showToast('Consulta Agendada!', 'Sincronizada automaticamente com o Google Calendar.', 'success');
  };

  // Filtragem de Agendamentos
  const agendamentosFiltrados = agendamentos.filter((a) => {
    if (filterView === 'meus' && isProfissionalSaude) {
      return a.profissionalId === currentUser.id;
    }
    return true;
  });

  const columns: { status: StatusAgendamento; title: string; badge: 'neutral' | 'info' | 'warning' | 'purple' | 'success' }[] = [
    { status: 'agendado', title: 'Agendados', badge: 'neutral' },
    { status: 'confirmado', title: 'Confirmados', badge: 'info' },
    { status: 'em_espera', title: 'Sala de Espera', badge: 'warning' },
    { status: 'em_atendimento', title: 'Em Consulta', badge: 'purple' },
    { status: 'realizado', title: 'Concluídos', badge: 'success' },
  ];

  return (
    <div className="space-y-6">
      
      {/* Topo da Agenda */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Painel de Atendimentos
            </h2>
            <Badge variant="brand" dot>Google Calendar Sync</Badge>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Gestão visual em Kanban, confirmação no WhatsApp com 1 clique e sincronização em tempo real.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-xl flex items-center gap-1 text-xs">
            <button
              onClick={() => setFilterView('hoje')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                filterView === 'hoje' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500'
              }`}
            >
              Hoje
            </button>
            <button
              onClick={() => setFilterView('todos')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                filterView === 'todos' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500'
              }`}
            >
              Todos
            </button>
            {isProfissionalSaude && (
              <button
                onClick={() => setFilterView('meus')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                  filterView === 'meus' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500'
                }`}
              >
                Minha Lista
              </button>
            )}
          </div>

          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => setIsNewModalOpen(true)}
          >
            Novo Agendamento
          </Button>
        </div>
      </div>

      {/* Grid Kanban */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {columns.map((col) => {
          const items = agendamentosFiltrados.filter((a) => a.status === col.status);

          return (
            <div
              key={col.status}
              className="bg-slate-100/70 dark:bg-slate-800/40 rounded-2xl p-3 flex flex-col space-y-3 min-h-[500px]"
            >
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                  {col.title}
                </span>
                <span className="text-xs font-bold bg-white dark:bg-slate-700 px-2 py-0.5 rounded-full text-slate-600 dark:text-slate-300 shadow-sm">
                  {items.length}
                </span>
              </div>

              <div className="space-y-3 flex-1 overflow-y-auto">
                {items.length === 0 ? (
                  <div className="h-32 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl flex items-center justify-center text-[11px] text-slate-400">
                    Nenhum paciente
                  </div>
                ) : (
                  items.map((agend) => {
                    const horaInicio = new Date(agend.dataHoraInicio).toLocaleTimeString('pt-BR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    });

                    return (
                      <Card
                        key={agend.id}
                        className="p-3.5 space-y-2.5 bg-white dark:bg-slate-900 border-slate-200/90 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between gap-1">
                          <div>
                            <span className="text-xs font-mono font-bold text-brand-700 dark:text-brand-400">
                              {horaInicio}
                            </span>
                            <h4
                              onClick={() => onSelectPaciente && onSelectPaciente(agend.pacienteId)}
                              className="text-xs font-bold text-slate-900 dark:text-white hover:text-brand-600 cursor-pointer mt-0.5 line-clamp-1"
                            >
                              {agend.pacienteNome}
                            </h4>
                          </div>

                          {agend.modalidade === 'telemedicina' ? (
                            <span className="p-1 rounded bg-blue-50 text-blue-600 dark:bg-blue-950/40" title="Telemedicina (Meet)">
                              <Video className="w-3.5 h-3.5" />
                            </span>
                          ) : (
                            <span className="p-1 rounded bg-slate-50 text-slate-500 dark:bg-slate-800" title="Presencial">
                              <User className="w-3.5 h-3.5" />
                            </span>
                          )}
                        </div>

                        <div className="text-[11px] text-slate-500 dark:text-slate-400 space-y-0.5">
                          <div>Prof: {agend.profissionalNome}</div>
                          {agend.notasRecepcao && (
                            <div className="italic text-[10px] text-slate-400 line-clamp-1">
                              "{agend.notasRecepcao}"
                            </div>
                          )}
                        </div>

                        {/* Ações Rápidas de Recepção */}
                        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-1">
                          
                          {/* Lembrete WhatsApp */}
                          <a
                            href={gerarLinkWhatsAppLembrete(agend)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-[10px] font-semibold flex items-center gap-1 transition-colors"
                            title="Enviar confirmação no WhatsApp"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>WhatsApp</span>
                          </a>

                          {/* Google Calendar Link */}
                          <a
                            href={gerarUrlGoogleCalendarWeb(agend)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-semibold flex items-center gap-1 transition-colors"
                            title="Ver no Google Agenda"
                          >
                            <CalendarCheck className="w-3.5 h-3.5 text-brand-600" />
                          </a>

                          {/* Se for médico: Iniciar Consulta */}
                          {isProfissionalSaude && onOpenConsultationForPaciente && (
                            <button
                              onClick={() => onOpenConsultationForPaciente(agend.pacienteId)}
                              className="px-2 py-1 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-[10px] font-bold shadow-xs"
                            >
                              Atender
                            </button>
                          )}
                        </div>

                        {/* Mudar Status Rápido */}
                        <select
                          value={agend.status}
                          onChange={(e) => atualizarStatusAgendamento(agend.id, e.target.value as StatusAgendamento)}
                          className="w-full text-[10px] py-1 px-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-300 font-medium"
                        >
                          <option value="agendado">Mudar para: Agendado</option>
                          <option value="confirmado">Mudar para: Confirmado</option>
                          <option value="em_espera">Mudar para: Na Sala de Espera</option>
                          <option value="em_atendimento">Mudar para: Em Atendimento</option>
                          <option value="realizado">Mudar para: Concluído</option>
                          <option value="faltou">Mudar para: Não Compareceu</option>
                        </select>

                      </Card>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Novo Agendamento */}
      <Modal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        title="Agendar Novo Atendimento"
        subtitle="Sincronização automática com o Google Agenda do profissional"
      >
        <form onSubmit={handleSalvarAgendamento} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Paciente:
            </label>
            <select
              value={novoAgendamento.pacienteId}
              onChange={(e) => setNovoAgendamento({ ...novoAgendamento, pacienteId: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl"
              required
            >
              {pacientes.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nomeCompleto} ({p.cpf})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Data:
              </label>
              <input
                type="date"
                value={novoAgendamento.data}
                onChange={(e) => setNovoAgendamento({ ...novoAgendamento, data: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Horário:
              </label>
              <input
                type="time"
                value={novoAgendamento.hora}
                onChange={(e) => setNovoAgendamento({ ...novoAgendamento, hora: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Modalidade:
              </label>
              <select
                value={novoAgendamento.modalidade}
                onChange={(e) => setNovoAgendamento({ ...novoAgendamento, modalidade: e.target.value as any })}
                className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl"
              >
                <option value="presencial">Presencial na Clínica</option>
                <option value="telemedicina">Telemedicina (Google Meet)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Valor da Consulta (R$):
              </label>
              <input
                type="number"
                value={novoAgendamento.valorCobrado}
                onChange={(e) => setNovoAgendamento({ ...novoAgendamento, valorCobrado: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Notas da Recepção:
            </label>
            <input
              type="text"
              placeholder="Ex: Primeira vez, vem acompanhado da mãe..."
              value={novoAgendamento.notasRecepcao}
              onChange={(e) => setNovoAgendamento({ ...novoAgendamento, notasRecepcao: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl"
            />
          </div>

          <div className="pt-3 flex justify-end gap-2">
            <Button variant="outline" type="button" onClick={() => setIsNewModalOpen(false)}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit">
              Confirmar Agendamento
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
