export type NivelHumor = 1 | 2 | 3 | 4 | 5; 
// 1: Muito Difícil / Crise
// 2: Difícil / Para baixo
// 3: Neutro / Equilibrado
// 4: Bem / Confiante
// 5: Muito Bem / Radiante

export type ModoInterfaceEmocao = 'kids' | 'teen' | 'adulto';

export interface RegistroEmocao {
  id: string;
  pacienteId: string;
  dataHora: string; // ISO String
  nivelHumor: NivelHumor;
  emocoesPrimarias: string[]; // ex Kids: ['Muito Feliz', 'Bravo', 'Medo'] | Adulto: ['Ansiedade', 'Paz']
  gatilhos: string[];         // ex: ['Trabalho', 'Família', 'Sono', 'Remédio', 'Escola']
  qualidadeSono?: 'pessimo' | 'regular' | 'bom';
  tomouMedicacao?: boolean;
  anotacaoLivre?: string;
  modoUsado: ModoInterfaceEmocao;
}

export interface ConfiguracaoDiarioPaciente {
  habilitado: boolean;
  pinAcesso?: string; // 4 dígitos para privacidade
  modoInterfaceDefault: ModoInterfaceEmocao;
  tokenAcesso: string; // Token único para link direto no WhatsApp
  permitirAudio?: boolean;
  ultimoAcesso?: string;
  atualizadoEm: string;
}

export interface MetricasEmocionaisPaciente {
  totalRegistros: number;
  mediaHumorUltimos7Dias: number;
  gatilhosFrequentes: { gatilho: string; contagem: number }[];
  emocoesFrequentes: { emocao: string; contagem: number }[];
  alertaHumorCritico: boolean;
  ultimoRegistro?: RegistroEmocao;
}
