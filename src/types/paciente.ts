import { ConfiguracaoDiarioPaciente } from './emocao';

export interface Endereco {
  logradouro: string;
  numero: string;
  bairro: string;
  cidade: string;
  uf: string;
  cep: string;
}

export interface ContatoEmergencia {
  nome: string;
  parentesco: string;
  telefone: string;
}

export interface DadosConvenio {
  tipo: 'particular' | 'convenio';
  nomeConvenio?: string;
  numeroCarteirinha?: string;
}

export interface Paciente {
  id: string;
  nomeCompleto: string;
  cpf: string;
  fotoUrl?: string;
  dataNascimento: string;
  genero: 'M' | 'F' | 'Outro' | 'NaoInformado';
  telefone: string;
  email?: string;
  endereco?: Endereco;
  contatoEmergencia: ContatoEmergencia;
  dadosConvenio?: DadosConvenio;
  
  // Alertas médicos em destaque
  alertasMedicos?: string[];
  alergias?: string[];

  // Google Drive
  driveFolderId?: string;
  driveFolderUrl?: string;
  totalDocumentosScaneados: number;
  
  // Módulo Diário de Emoções / Portal do Paciente
  configuracaoDiario?: ConfiguracaoDiarioPaciente;

  status: 'ativo' | 'inativo';
  criadoEm: string;
  atualizadoEm: string;
  criadoPor: string;
}
