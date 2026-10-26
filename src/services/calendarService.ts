import { Agendamento } from '../types';

/**
 * Gera link dinâmico para envio de confirmação/lembrete no WhatsApp
 */
export function gerarLinkWhatsAppLembrete(agendamento: Agendamento, nomeClinica: string = 'NexAi Clínica de Psiquiatria & Psicologia'): string {
  // Limpa caracteres do telefone
  const telefoneNumeros = agendamento.pacienteTelefone.replace(/\D/g, '');
  const dataFormatada = new Date(agendamento.dataHoraInicio).toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
  const horaFormatada = new Date(agendamento.dataHoraInicio).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit'
  });

  let texto = `Olá, *${agendamento.pacienteNome}*! Tudo bem?\n\n`;
  texto += `Aqui é da recepção da *${nomeClinica}*.\n`;
  texto += `Gostaríamos de confirmar seu atendimento com *${agendamento.profissionalNome}*:\n\n`;
  texto += `📅 *Data:* ${dataFormatada}\n`;
  texto += `⏰ *Horário:* ${horaFormatada}\n`;
  texto += `📍 *Modalidade:* ${agendamento.modalidade === 'presencial' ? 'Presencial na Clínica' : 'Telemedicina / Online'}\n`;

  if (agendamento.modalidade === 'telemedicina' && agendamento.googleMeetLink) {
    texto += `💻 *Link da Sessão:* ${agendamento.googleMeetLink}\n`;
  }

  texto += `\nPor favor, responda com *1 para CONFIRMAR* ou envie uma mensagem caso precise reagendar.\nObrigado!`;

  return `https://wa.me/${telefoneNumeros}?text=${encodeURIComponent(texto)}`;
}

/**
 * Cria URL do Google Calendar para adicionar evento diretamente no calendário
 */
export function gerarUrlGoogleCalendarWeb(agendamento: Agendamento): string {
  const inicio = new Date(agendamento.dataHoraInicio).toISOString().replace(/-|:|\.\d\d\d/g, '');
  const fim = new Date(agendamento.dataHoraFim).toISOString().replace(/-|:|\.\d\d\d/g, '');
  
  const title = encodeURIComponent(`Consulta: ${agendamento.pacienteNome} (${agendamento.especialidade})`);
  const details = encodeURIComponent(
    `Paciente: ${agendamento.pacienteNome}\nTelefone: ${agendamento.pacienteTelefone}\nTipo: ${agendamento.tipoConsulta}\nProfissional: ${agendamento.profissionalNome}\nNotas: ${agendamento.notasRecepcao || 'Nenhuma'}`
  );
  const location = encodeURIComponent(agendamento.modalidade === 'presencial' ? 'NexAi Clínica de Psiquiatria' : agendamento.googleMeetLink || 'Google Meet');

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${inicio}/${fim}&details=${details}&location=${location}`;
}
