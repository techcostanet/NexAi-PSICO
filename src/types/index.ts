export * from './paciente';
export * from './prontuario';
export * from './agendamento';
export * from './financeiro';
export * from './emocao';

export type UserRole = 'admin' | 'medico' | 'psicologo' | 'recepcao';

export interface UserProfile {
  id: string;
  nome: string;
  email: string;
  role: UserRole;
  especialidade?: string;
  registroProfissional?: string; // Ex: CRM/SP 123456 ou CRP 06/78910
  avatarUrl?: string;
  googleCalendarId?: string;
}
