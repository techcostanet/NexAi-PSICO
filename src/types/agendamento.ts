export type StatusAgendamento = 
  | 'agendado' 
  | 'confirmado' 
  | 'em_espera' 
  | 'em_atendimento' 
  | 'realizado' 
  | 'cancelado' 
  | 'faltou';

export type ModalidadeConsulta = 'presencial' | 'telemedicina';

export type TipoConsulta = 'primeira_consulta' | 'retorno' | 'sessao_terapia' | 'emergencia';

export interface Agendamento {
  id: string;
  pacienteId: string;
  pacienteNome: string;
  pacienteTelefone: string;
  profissionalId: string;
  profissionalNome: string;
  especialidade: string;
  
  dataHoraInicio: string; // ISO
  dataHoraFim: string;    // ISO
  tipoConsulta: TipoConsulta;
  modalidade: ModalidadeConsulta;
  status: StatusAgendamento;
  
  // Google Calendar
  googleCalendarEventId?: string;
  googleMeetLink?: string;
  sincronizadoGoogle: boolean;
  
  // Financeiro
  valorCobrado: number;
  pagamentoStatus: 'pendente' | 'pago' | 'cortesia' | 'convenio';
  
  notasRecepcao?: string;
  criadoEm: string;
  atualizadoEm: string;
}
