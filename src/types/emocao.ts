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
  emocoesPrimarias: string[];
  gatilhos: string[];
  qualidadeSono?: 'pessimo' | 'regular' | 'bom';
  horasSono?: string;
  tomouMedicacao?: boolean;
  anotacaoLivre?: string;
  modoUsado: ModoInterfaceEmocao;

  // Novos campos de aprofundamento clínico
  nivelAnsiedade?: number;     // Escala 0 a 10
  nivelEstresse?: string;      // 'baixo' | 'moderado' | 'elevado' | 'critico'
  bateriaSocial?: number;      // Escala 0 a 100 (%)
  tempoTela?: string;          // '< 2h', '2-4h', '4-6h', '> 6h'
  focoProdutividade?: string;  // 'Foco Alto', 'Disperso', 'Procrastinei', 'Hiperfoco'
  sintomasFisicos?: string[];  // 'Tensão Muscular', 'Dor de Cabeça', 'Taquicardia', etc.
  atividadesLudicas?: string[];// Kids: 'Brincadeiras', 'Desenho', 'Esportes', etc.
  mascoteEscolhido?: string;   // Kids: 'leao', 'sapo', 'urso', 'dragao', 'estrela'
  temaVisual?: string;         // Identificador do tema visual escolhido
}

export interface ConfiguracaoDiarioPaciente {
  habilitado: boolean;
  pinAcesso?: string; // 4 dígitos para privacidade
  modoInterfaceDefault: ModoInterfaceEmocao;
  tokenAcesso: string; // Token único para link direto no WhatsApp
  permitirAudio?: boolean;
  ultimoAcesso?: string;
  atualizadoEm: string;
  temaVisual?: string;
  mascote?: string;
}

export interface MetricasEmocionaisPaciente {
  totalRegistros: number;
  mediaHumorUltimos7Dias: number;
  gatilhosFrequentes: { gatilho: string; contagem: number }[];
  emocoesFrequentes: { emocao: string; contagem: number }[];
  alertaHumorCritico: boolean;
  ultimoRegistro?: RegistroEmocao;
}
