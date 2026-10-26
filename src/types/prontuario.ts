export interface Medicacao {
  nome: string;
  dosagem: string;
  posologia: string;
  controlada: boolean;
  usoContinuo?: boolean;
}

export interface ConteudoClinicoSOAP {
  subjetivo: string;        // Relato do paciente, queixa principal, evolução dos sintomas, sono
  objetivo: string;          // Exame do Estado Mental (EEM), afeto, psicomotricidade, pensamento
  avaliacao: string;         // Hipótese diagnóstica, CID-10/CID-11 ou DSM-5
  planoTerapeutico: string;  // Condutas, orientações, encaminhamentos, retorno
  medicacoesPrescritas: Medicacao[];
  alertasRisco?: string;     // Risco de suicídio, automutilação, intoxicação
}

export interface AudioMetadados {
  duracaoSegundos: number;
  audioBlobUrl?: string;
  transcricaoBruta?: string;
  resumoGeradoPorIA: boolean;
  aprovadoPeloMedico: boolean;
  editadoAposIA: boolean;
}

export interface ScanDriveMetadados {
  driveFileId: string;
  driveWebViewLink: string;
  driveDownloadLink?: string;
  nomeArquivo: string;
  quantidadePaginas: number;
  dataOriginalDocumento?: string;
  observacoes?: string;
  paginasBase64?: string[]; // Para visualização em cache local
}

export interface ProntuarioRegistro {
  id: string;
  pacienteId: string;
  profissionalId: string;
  profissionalNome: string;
  profissionalRegistro: string; // Ex: CRM/SP 123456 ou CRP 06/12345
  especialidade: 'Psiquiatria' | 'Psicologia' | 'Clínica Geral';
  dataAtendimento: string; // ISO
  tipoRegistro: 'evolucao_ia' | 'evolucao_manual' | 'scan_historico_drive';
  
  conteudoClinico?: ConteudoClinicoSOAP;
  audioMetadados?: AudioMetadados;
  scanDriveMetadados?: ScanDriveMetadados;
  
  criadoEm: string;
  atualizadoEm: string;
}
