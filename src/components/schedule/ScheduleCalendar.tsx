import React, { useState, useMemo } from 'react';
import { useDatabase } from '../../context/DatabaseContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useSaasPlan } from '../../context/SaasPlanContext';
import { Agendamento, StatusAgendamento } from '../../types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Modal } from '../ui/Modal';
import {
  Calendar,
  Clock,
  MessageCircle,
  Plus,
  Video,
  User,
  ChevronLeft,
  ChevronRight,
  Columns,
  CalendarDays,
  CalendarRange,
  ExternalLink,
} from 'lucide-react';
import { gerarLinkWhatsAppLembrete, gerarUrlGoogleCalendarWeb } from '../../services/calendarService';

interface ScheduleCalendarProps {
  onSelectPaciente?: (pacienteId: string) => void;
  onOpenConsultationForPaciente?: (pacienteId: string) => void;
}

type ViewMode = 'kanban' | 'diario' | 'semanal' | 'mensal';

export const ScheduleCalendar: React.FC<ScheduleCalendarProps> = ({
  onSelectPaciente,
  onOpenConsultationForPaciente,
}) => {
  const { agendamentos, pacientes, adicionarAgendamento, atualizarStatusAgendamento, adicionarPaciente } = useDatabase();
  const { currentUser, isProfissionalSaude } = useAuth();
  const { modules } = useSaasPlan();
  const { showToast } = useToast();

  const [viewMode, setViewMode] = useState<ViewMode>('kanban');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [filterPeriod, setFilterPeriod] = useState<'hoje' | 'todos'>('hoje');
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);

  // Verifica se o Google Agenda foi configurado nas configurações
  const isGoogleCalendarSynced = Boolean(localStorage.getItem('nexai_calendar_email'));

  // Formulário de Novo Agendamento
  // Cadastro rápido na agenda
  const [tipoSelecaoPaciente, setTipoSelecaoPaciente] = useState<'existente' | 'rapido'>('existente');
  const [pacienteRapido, setPacienteRapido] = useState({
    nomeCompleto: '',
    telefone: '+55 11 9',
    dataNascimento: '1995-01-01',
  });

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

    let pacienteIdFinal = novoAgendamento.pacienteId;
    let pacienteNomeFinal = '';
    let pacienteTelefoneFinal = '';

    if (tipoSelecaoPaciente === 'rapido') {
      if (!pacienteRapido.nomeCompleto.trim() || !pacienteRapido.telefone.trim()) {
        showToast('Dados incompletos', 'Informe o nome e o telefone do novo paciente.', 'warning');
        return;
      }
      const novoPac = adicionarPaciente({
        nomeCompleto: pacienteRapido.nomeCompleto.trim(),
        telefone: pacienteRapido.telefone.trim(),
        cpf: `000.000.${Math.floor(100 + Math.random() * 900)}-00`,
        dataNascimento: pacienteRapido.dataNascimento || '1995-01-01',
        genero: 'NaoInformado',
        status: 'ativo',
        contatoEmergencia: {
          nome: 'Contato',
          parentesco: 'Responsável',
          telefone: pacienteRapido.telefone.trim(),
        },
        criadoPor: currentUser.id,
        configuracaoDiario: {
          habilitado: true,
          modoInterfaceDefault: 'adulto',
          tokenAcesso: `pac-${Date.now().toString().slice(-6)}`,
          atualizadoEm: new Date().toISOString(),
        },
      });

      pacienteIdFinal = novoPac.id;
      pacienteNomeFinal = novoPac.nomeCompleto;
      pacienteTelefoneFinal = novoPac.telefone;
    } else {
      const paciente = pacientes.find((p) => p.id === novoAgendamento.pacienteId);
      if (!paciente) return;
      pacienteIdFinal = paciente.id;
      pacienteNomeFinal = paciente.nomeCompleto;
      pacienteTelefoneFinal = paciente.telefone;
    }

    const dataHoraInicio = `${novoAgendamento.data}T${novoAgendamento.hora}:00`;
    const dataHoraFim = new Date(new Date(dataHoraInicio).getTime() + 50 * 60 * 1000).toISOString();

    adicionarAgendamento({
      pacienteId: pacienteIdFinal,
      pacienteNome: pacienteNomeFinal,
      pacienteTelefone: pacienteTelefoneFinal,
      profissionalId: novoAgendamento.profissionalId,
      profissionalNome: novoAgendamento.profissionalNome,
      especialidade: novoAgendamento.especialidade,
      dataHoraInicio,
      dataHoraFim,
      tipoConsulta: novoAgendamento.tipoConsulta,
      modalidade: novoAgendamento.modalidade,
      status: 'confirmado',
      sincronizadoGoogle: isGoogleCalendarSynced,
      valorCobrado: novoAgendamento.valorCobrado,
      pagamentoStatus: novoAgendamento.pagamentoStatus,
      notasRecepcao: novoAgendamento.notasRecepcao,
    });

    setIsNewModalOpen(false);
    showToast('Consulta Agendada!', 'Atendimento registrado com sucesso.', 'success');
  };

  // Filtragem de Agendamentos por período
  const agendamentosFiltrados = useMemo(() => {
    if (viewMode === 'kanban') {
      if (filterPeriod === 'hoje') {
        const hojeIso = new Date().toISOString().split('T')[0];
        return agendamentos.filter((a) => a.dataHoraInicio.startsWith(hojeIso));
      }
      return agendamentos;
    }
    return agendamentos;
  }, [agendamentos, viewMode, filterPeriod]);

  // Colunas do Kanban com vocabulário único e conciso (Regra 4)
  const columns: { status: StatusAgendamento; title: string; color: string }[] = [
    { status: 'agendado', title: 'Agendados', color: 'border-t-slate-400' },
    { status: 'confirmado', title: 'Confirmados', color: 'border-t-blue-500' },
    { status: 'em_espera', title: 'Espera', color: 'border-t-amber-500' },
    { status: 'em_atendimento', title: 'Atendimento', color: 'border-t-brand-600' },
    { status: 'realizado', title: 'Concluídos', color: 'border-t-emerald-500' },
  ];

  // Helper de Datas
  const formatHour = (iso: string) => {
    return new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  const selectedDateStr = selectedDate.toISOString().split('T')[0];

  // Agendamentos do dia selecionado (para modo Diário e Mensal)
  const agendamentosDoDia = useMemo(() => {
    return agendamentos
      .filter((a) => a.dataHoraInicio.startsWith(selectedDateStr))
      .sort((a, b) => new Date(a.dataHoraInicio).getTime() - new Date(b.dataHoraInicio).getTime());
  }, [agendamentos, selectedDateStr]);

  // Agendamentos da semana selecionada
  const semanaDias = useMemo(() => {
    const current = new Date(selectedDate);
    const day = current.getDay();
    // Inicia na segunda-feira
    const diffToMonday = current.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(current.setDate(diffToMonday));

    const dias = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      dias.push(d);
    }
    return dias;
  }, [selectedDate]);

  // Grid do Mês selecionado
  const mesDias = useMemo(() => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const startDayIndex = firstDay.getDay(); // 0 = Domingo
    const totalDays = lastDay.getDate();

    const dias: { date: Date; isCurrentMonth: boolean; count: number }[] = [];

    // Dias do mês anterior para preencher a primeira semana
    for (let i = startDayIndex - 1; i >= 0; i--) {
      const d = new Date(year, month, -i);
      dias.push({ date: d, isCurrentMonth: false, count: 0 });
    }

    // Dias do mês atual
    for (let i = 1; i <= totalDays; i++) {
      const d = new Date(year, month, i);
      const dStr = d.toISOString().split('T')[0];
      const count = agendamentos.filter((a) => a.dataHoraInicio.startsWith(dStr)).length;
      dias.push({ date: d, isCurrentMonth: true, count });
    }

    // Dias do próximo mês para completar grid de 35 ou 42
    const remaining = (7 - (dias.length % 7)) % 7;
    for (let i = 1; i <= remaining; i++) {
      const d = new Date(year, month + 1, i);
      dias.push({ date: d, isCurrentMonth: false, count: 0 });
    }

    return dias;
  }, [selectedDate, agendamentos]);

  return (
    <div className="space-y-6">
      
      {/* Topo da Agenda */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Agenda
            </h2>
            {isGoogleCalendarSynced && (
              <Badge variant="brand" dot>Google Agenda</Badge>
            )}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Gestão dos horários de atendimento do consultório.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          
          {/* Seletor de Tipo de Visualização (Kanban, Diário, Semanal, Mensal) */}
          <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-xl flex items-center gap-1 text-xs">
            <button
              onClick={() => setViewMode('kanban')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
                viewMode === 'kanban'
                  ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              <span>Kanban</span>
            </button>

            <button
              onClick={() => setViewMode('diario')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
                viewMode === 'diario'
                  ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Diário</span>
            </button>

            <button
              onClick={() => setViewMode('semanal')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
                viewMode === 'semanal'
                  ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <CalendarRange className="w-3.5 h-3.5" />
              <span>Semanal</span>
            </button>

            <button
              onClick={() => setViewMode('mensal')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
                viewMode === 'mensal'
                  ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <CalendarDays className="w-3.5 h-3.5" />
              <span>Mensal</span>
            </button>
          </div>

          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => setIsNewModalOpen(true)}
          >
            Agendar
          </Button>
        </div>
      </div>

      {/* 1. VISUALIZAÇÃO KANBAN */}
      {viewMode === 'kanban' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500">
              Fluxo sequencial do atendimento do paciente.
            </span>

            {/* Filtro do Kanban: Hoje ou Todos */}
            <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-xl flex items-center gap-1 text-xs">
              <button
                onClick={() => setFilterPeriod('hoje')}
                className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                  filterPeriod === 'hoje'
                    ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-xs'
                    : 'text-slate-500'
                }`}
              >
                Hoje
              </button>
              <button
                onClick={() => setFilterPeriod('todos')}
                className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                  filterPeriod === 'todos'
                    ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-xs'
                    : 'text-slate-500'
                }`}
              >
                Todos
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
            {columns.map((col) => {
              const items = agendamentosFiltrados.filter((a) => a.status === col.status);

              return (
                <div
                  key={col.status}
                  className={`bg-slate-100/70 dark:bg-slate-800/40 rounded-2xl p-3 flex flex-col space-y-3 min-h-[480px] border-t-4 ${col.color}`}
                >
                  <div className="flex items-center justify-between px-1">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {col.title}
                    </span>
                    <span className="text-[11px] font-bold bg-white dark:bg-slate-700 px-2 py-0.5 rounded-full text-slate-600 dark:text-slate-300 shadow-xs">
                      {items.length}
                    </span>
                  </div>

                  <div className="space-y-3 flex-1 overflow-y-auto">
                    {items.length === 0 ? (
                      <div className="h-28 border border-dashed border-slate-200 dark:border-slate-700/80 rounded-xl flex items-center justify-center text-[11px] text-slate-400">
                        Nenhum atendimento
                      </div>
                    ) : (
                      items.map((agend) => {
                        const horaInicio = formatHour(agend.dataHoraInicio);

                        return (
                          <Card
                            key={agend.id}
                            className="p-3 space-y-3 bg-white dark:bg-slate-900 border-slate-200/90 shadow-xs hover:shadow-md transition-shadow"
                          >
                            <div>
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-mono font-bold text-brand-600 dark:text-brand-400">
                                  {horaInicio}
                                </span>
                                {agend.modalidade === 'telemedicina' ? (
                                  <span className="p-1 rounded bg-blue-50 text-blue-600 dark:bg-blue-950/40" title="Telemedicina">
                                    <Video className="w-3 h-3" />
                                  </span>
                                ) : (
                                  <span className="p-1 rounded bg-slate-50 text-slate-500 dark:bg-slate-800" title="Presencial">
                                    <User className="w-3 h-3" />
                                  </span>
                                )}
                              </div>
                              <h4
                                onClick={() => onSelectPaciente && onSelectPaciente(agend.pacienteId)}
                                className="text-xs font-bold text-slate-900 dark:text-white hover:text-brand-600 cursor-pointer mt-1 truncate"
                                title={agend.pacienteNome}
                              >
                                {agend.pacienteNome}
                              </h4>
                            </div>

                            {/* Ações do Card Corrigidas (sem quebras visuais) */}
                            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-1.5">
                              <div className="flex items-center gap-1">
                                {/* Botão WhatsApp */}
                                <a
                                  href={gerarLinkWhatsAppLembrete(agend)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 transition-colors"
                                  title="WhatsApp"
                                >
                                  <MessageCircle className="w-3.5 h-3.5" />
                                </a>

                                {/* Link Google Agenda */}
                                <a
                                  href={gerarUrlGoogleCalendarWeb(agend)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
                                  title="Google Agenda"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                              </div>

                              {/* Ação Atender */}
                              {isProfissionalSaude && onOpenConsultationForPaciente && (
                                <button
                                  onClick={() => onOpenConsultationForPaciente(agend.pacienteId)}
                                  className="px-2.5 py-1 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-[11px] font-bold shadow-xs transition-colors"
                                >
                                  Atender
                                </button>
                              )}
                            </div>

                            {/* Seletor de Status Limpo */}
                            <select
                              value={agend.status}
                              onChange={(e) => atualizarStatusAgendamento(agend.id, e.target.value as StatusAgendamento)}
                              className="w-full text-[10px] py-1 px-1.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 font-medium focus:outline-none"
                            >
                              <option value="agendado">Status: Agendado</option>
                              <option value="confirmado">Status: Confirmado</option>
                              <option value="em_espera">Status: Espera</option>
                              <option value="em_atendimento">Status: Atendimento</option>
                              <option value="realizado">Status: Concluído</option>
                              <option value="faltou">Status: Faltou</option>
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
        </div>
      )}

      {/* 2. VISUALIZAÇÃO DIÁRIA */}
      {viewMode === 'diario' && (
        <div className="space-y-4">
          
          {/* Navegador de Dias */}
          <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const d = new Date(selectedDate);
                  d.setDate(d.getDate() - 1);
                  setSelectedDate(d);
                }}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setSelectedDate(new Date())}
                className="px-3 py-1 rounded-lg text-xs font-semibold bg-brand-500/10 text-brand-600 dark:text-brand-400"
              >
                Hoje
              </button>
              <button
                onClick={() => {
                  const d = new Date(selectedDate);
                  d.setDate(d.getDate() + 1);
                  setSelectedDate(d);
                }}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="text-sm font-bold text-slate-900 dark:text-white capitalize">
              {selectedDate.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}
            </div>

            <span className="text-xs text-slate-500">
              {agendamentosDoDia.length} atendimento(s)
            </span>
          </div>

          {/* Lista em Timeline do Dia */}
          {agendamentosDoDia.length === 0 ? (
            <Card className="p-12 text-center text-slate-400">
              <Clock className="w-8 h-8 mx-auto opacity-30 mb-2" />
              <p className="text-sm">Nenhum atendimento agendado para este dia.</p>
            </Card>
          ) : (
            <div className="space-y-3">
              {agendamentosDoDia.map((agend) => (
                <Card
                  key={agend.id}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-300 transition-all"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300 flex flex-col items-center justify-center font-mono font-bold text-xs flex-shrink-0">
                      <span>{formatHour(agend.dataHoraInicio)}</span>
                      <span className="text-[10px] font-normal text-slate-400">50 min</span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4
                          onClick={() => onSelectPaciente && onSelectPaciente(agend.pacienteId)}
                          className="text-sm font-bold text-slate-900 dark:text-white hover:text-brand-600 cursor-pointer"
                        >
                          {agend.pacienteNome}
                        </h4>
                        <Badge variant="neutral" size="sm">
                          {agend.modalidade === 'telemedicina' ? 'Online' : 'Presencial'}
                        </Badge>
                      </div>

                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex flex-wrap items-center gap-3">
                        <span>Tel: {agend.pacienteTelefone}</span>
                        <span>•</span>
                        <span>Valor: R$ {agend.valorCobrado}</span>
                        {agend.notasRecepcao && (
                          <>
                            <span>•</span>
                            <span className="italic">"{agend.notasRecepcao}"</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={gerarLinkWhatsAppLembrete(agend)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 text-xs font-semibold flex items-center gap-1.5"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>WhatsApp</span>
                    </a>

                    {isProfissionalSaude && onOpenConsultationForPaciente && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => onOpenConsultationForPaciente(agend.pacienteId)}
                      >
                        Atender
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 3. VISUALIZAÇÃO SEMANAL */}
      {viewMode === 'semanal' && (
        <div className="space-y-4">
          
          {/* Navegador Semanal */}
          <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const d = new Date(selectedDate);
                  d.setDate(d.getDate() - 7);
                  setSelectedDate(d);
                }}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setSelectedDate(new Date())}
                className="px-3 py-1 rounded-lg text-xs font-semibold bg-brand-500/10 text-brand-600 dark:text-brand-400"
              >
                Hoje
              </button>
              <button
                onClick={() => {
                  const d = new Date(selectedDate);
                  d.setDate(d.getDate() + 7);
                  setSelectedDate(d);
                }}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="text-sm font-bold text-slate-900 dark:text-white">
              Semana de {semanaDias[0].toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })} a{' '}
              {semanaDias[6].toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
            </div>
          </div>

          {/* Grid de 7 Dias da Semana */}
          <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
            {semanaDias.map((dia) => {
              const diaStr = dia.toISOString().split('T')[0];
              const isHoje = diaStr === new Date().toISOString().split('T')[0];
              const agendsDoDia = agendamentos.filter((a) => a.dataHoraInicio.startsWith(diaStr));

              return (
                <div
                  key={diaStr}
                  className={`rounded-2xl p-3 space-y-3 min-h-[360px] flex flex-col ${
                    isHoje
                      ? 'bg-brand-500/5 dark:bg-brand-950/20 border-2 border-brand-500/40'
                      : 'bg-slate-100/70 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800'
                  }`}
                >
                  <div className="text-center pb-2 border-b border-slate-200 dark:border-slate-700/60">
                    <span className="text-[11px] font-bold text-slate-500 uppercase block">
                      {dia.toLocaleDateString('pt-BR', { weekday: 'short' })}
                    </span>
                    <span className={`text-base font-extrabold ${isHoje ? 'text-brand-600' : 'text-slate-900 dark:text-white'}`}>
                      {dia.getDate()}
                    </span>
                  </div>

                  <div className="space-y-2 flex-1 overflow-y-auto">
                    {agendsDoDia.length === 0 ? (
                      <div className="h-20 flex items-center justify-center text-[10px] text-slate-400">
                        Livre
                      </div>
                    ) : (
                      agendsDoDia.map((a) => (
                        <div
                          key={a.id}
                          onClick={() => onSelectPaciente && onSelectPaciente(a.pacienteId)}
                          className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/70 shadow-2xs hover:border-brand-500 cursor-pointer transition-all"
                        >
                          <div className="flex items-center justify-between text-[10px] font-mono font-bold text-brand-600 dark:text-brand-400">
                            <span>{formatHour(a.dataHoraInicio)}</span>
                            {a.modalidade === 'telemedicina' && <Video className="w-2.5 h-2.5" />}
                          </div>
                          <div className="text-[11px] font-semibold text-slate-800 dark:text-slate-100 truncate mt-0.5">
                            {a.pacienteNome}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. VISUALIZAÇÃO MENSAL */}
      {viewMode === 'mensal' && (
        <div className="space-y-4">
          
          {/* Navegador Mensal */}
          <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const d = new Date(selectedDate);
                  d.setMonth(d.getMonth() - 1);
                  setSelectedDate(d);
                }}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setSelectedDate(new Date())}
                className="px-3 py-1 rounded-lg text-xs font-semibold bg-brand-500/10 text-brand-600 dark:text-brand-400"
              >
                Hoje
              </button>
              <button
                onClick={() => {
                  const d = new Date(selectedDate);
                  d.setMonth(d.getMonth() + 1);
                  setSelectedDate(d);
                }}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="text-sm font-bold text-slate-900 dark:text-white capitalize">
              {selectedDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
            </div>
          </div>

          {/* Grid de Dias do Mês */}
          <Card className="p-4">
            <div className="grid grid-cols-7 gap-2 mb-2 text-center text-xs font-bold text-slate-400">
              <span>Dom</span>
              <span>Seg</span>
              <span>Ter</span>
              <span>Qua</span>
              <span>Qui</span>
              <span>Sex</span>
              <span>Sáb</span>
            </div>

            <div className="grid grid-cols-7 gap-2">
              {mesDias.map((item, idx) => {
                const itemStr = item.date.toISOString().split('T')[0];
                const isSelected = itemStr === selectedDateStr;
                const isHoje = itemStr === new Date().toISOString().split('T')[0];

                return (
                  <div
                    key={idx}
                    onClick={() => setSelectedDate(item.date)}
                    className={`h-20 sm:h-24 p-2 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-950/30'
                        : isHoje
                        ? 'border-brand-300 dark:border-brand-800 bg-slate-50 dark:bg-slate-800/40'
                        : item.isCurrentMonth
                        ? 'border-slate-100 dark:border-slate-800 hover:border-slate-300'
                        : 'border-transparent text-slate-300 dark:text-slate-700 opacity-40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-bold ${isHoje ? 'text-brand-600 font-extrabold' : ''}`}>
                        {item.date.getDate()}
                      </span>
                    </div>

                    {item.count > 0 && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-brand-500/10 text-brand-600 dark:text-brand-400 self-start">
                        {item.count} agend.
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Atendimentos do Dia Selecionado no Calendário */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Atendimentos em {selectedDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' })}
            </h4>

            {agendamentosDoDia.length === 0 ? (
              <p className="text-xs text-slate-400">Nenhum atendimento nesta data.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {agendamentosDoDia.map((a) => (
                  <Card key={a.id} className="p-3 space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono font-bold text-brand-600">
                      <span>{formatHour(a.dataHoraInicio)}</span>
                      <Badge variant="neutral" size="sm">{a.status}</Badge>
                    </div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      {a.pacienteNome}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

        </div>
      )}

      {/* Modal Novo Agendamento */}
      <Modal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        title="Agendar Consulta"
      >
        <form onSubmit={handleSalvarAgendamento} className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Paciente da Sessão *
              </label>
              <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg text-xs">
                <button
                  type="button"
                  onClick={() => setTipoSelecaoPaciente('existente')}
                  className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                    tipoSelecaoPaciente === 'existente'
                      ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Cadastrado
                </button>
                <button
                  type="button"
                  onClick={() => setTipoSelecaoPaciente('rapido')}
                  className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                    tipoSelecaoPaciente === 'rapido'
                      ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  + Rápido
                </button>
              </div>
            </div>

            {tipoSelecaoPaciente === 'existente' ? (
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
            ) : (
              <div className="p-3 bg-brand-50/60 dark:bg-brand-950/30 border border-brand-200 dark:border-brand-900/40 rounded-xl space-y-2.5">
                <p className="text-[11px] text-brand-800 dark:text-brand-300 font-medium">
                  Cadastro Rápido: Agende agora e conclua os dados depois na ficha.
                </p>
                <div>
                  <input
                    type="text"
                    required
                    placeholder="Nome Completo do Paciente *"
                    value={pacienteRapido.nomeCompleto}
                    onChange={(e) => setPacienteRapido({ ...pacienteRapido, nomeCompleto: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-brand-300 dark:border-brand-700 rounded-lg focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Telefone WhatsApp *"
                    value={pacienteRapido.telefone}
                    onChange={(e) => setPacienteRapido({ ...pacienteRapido, telefone: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-brand-300 dark:border-brand-700 rounded-lg focus:ring-2 focus:ring-brand-500"
                  />
                  <input
                    type="date"
                    value={pacienteRapido.dataNascimento}
                    onChange={(e) => setPacienteRapido({ ...pacienteRapido, dataNascimento: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-brand-300 dark:border-brand-700 rounded-lg focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Data *
              </label>
              <input
                type="date"
                required
                value={novoAgendamento.data}
                onChange={(e) => setNovoAgendamento({ ...novoAgendamento, data: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Horário *
              </label>
              <input
                type="time"
                required
                value={novoAgendamento.hora}
                onChange={(e) => setNovoAgendamento({ ...novoAgendamento, hora: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Modalidade
              </label>
              <select
                value={novoAgendamento.modalidade}
                onChange={(e) => setNovoAgendamento({ ...novoAgendamento, modalidade: e.target.value as any })}
                className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl"
              >
                <option value="presencial">Presencial</option>
                <option value="telemedicina">Telemedicina</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Tipo
              </label>
              <select
                value={novoAgendamento.tipoConsulta}
                onChange={(e) => setNovoAgendamento({ ...novoAgendamento, tipoConsulta: e.target.value as any })}
                className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl"
              >
                <option value="primeira_vez">Primeira Vez</option>
                <option value="retorno">Retorno</option>
                <option value="emergencia">Urgência</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Observações
            </label>
            <textarea
              rows={2}
              value={novoAgendamento.notasRecepcao}
              onChange={(e) => setNovoAgendamento({ ...novoAgendamento, notasRecepcao: e.target.value })}
              placeholder="Ex: Paciente solicitou atendimento pontual."
              className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsNewModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
            >
              Salvar
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
