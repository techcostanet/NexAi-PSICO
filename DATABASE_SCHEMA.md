# NexAi-PSICO - Modelagem de Dados e Regras de Segurança (Cloud Firestore)

---

## 1. Estrutura das Coleções do Cloud Firestore

A modelagem é orientada a documentos (NoSQL), otimizada para consultas rápidas no celular, suporte offline e separação rigorosa de permissões (LGPD e sigilo médico).

```
Firestore Root
│
├── clinicas/{clinicaId}
│   ├── config/ (horários de atendimento, termos de consentimento, chaves de integração)
│   └── convenios/ (tabela de preços de consultas particulares e planos aceitos)
│
├── usuarios/{usuarioId}
│   └── (perfil, role: 'admin' | 'medico' | 'psicologo' | 'recepcao', crm_crp, googleCalendarId)
│
├── pacientes/{pacienteId}
│   │   (dados demográficos: nome, cpf, dataNasc, telefone, contatoEmergencia, driveFolderId)
│   │
│   ├── prontuarios/{prontuarioId}  <--- [ACESSO RESTRITO: Apenas Médicos/Psicólogos]
│   │   └── (tipo: 'evolucao_ia' | 'texto' | 'scan_drive', status, dataAtendimento, medicoId)
│   │
│   └── anamnese/{anamneseId}      <--- [ACESSO RESTRITO: Histórico de base, diagnósticos CID/DSM]
│
├── agendamentos/{agendamentoId}
│   └── (pacienteId, profissionalId, dataHoraInicio, dataHoraFim, status, googleEventId, tipoConsulta)
│
├── financeiro/{transacaoId}
│   └── (agendamentoId, pacienteId, profissionalId, valor, metodoPagamento, status, dataPagamento, reciboEmitido)
│
└── logs_auditoria/{logId}
    └── (usuarioId, acao: 'VIEW_PRONTUARIO' | 'EDIT_EVOLUCAO', recursoId, ip, timestamp)
```

---

## 2. Dicionário de Dados Detalhado

### 2.1. Coleção: `pacientes`
```typescript
interface Paciente {
  id: string;                       // UID gerado automaticamente
  nomeCompleto: string;
  cpf: string;                      // Normalizado (apenas números)
  dataNascimento: string;           // ISO 8601 (YYYY-MM-DD)
  genero: 'M' | 'F' | 'Outro' | 'NaoInformado';
  telefone: string;                 // WhatsApp (E.164: +5511999999999)
  email?: string;
  endereco?: {
    logradouro: string;
    numero: string;
    bairro: string;
    cidade: string;
    uf: string;
    cep: string;
  };
  contatoEmergencia: {
    nome: string;
    parentesco: string;
    telefone: string;
  };
  dadosConvenio?: {
    tipo: 'particular' | 'convenio';
    nomeConvenio?: string;
    numeroCarteirinha?: string;
  };
  
  // Metadados de Integração Google Drive
  driveFolderId: string;            // ID da pasta do paciente criada no Google Drive
  driveFolderUrl: string;           // Link direto (apenas para quem tem autorização)
  totalDocumentosScaneados: number; // Contador de scans legados
  
  status: 'ativo' | 'inativo';
  criadoEm: Timestamp;
  atualizadoEm: Timestamp;
  criadoPor: string;                // UID do usuário da recepção ou médico
}
```

### 2.2. Subcoleção: `pacientes/{pacienteId}/prontuarios`
> ⚠️ **Sigilo Médico:** Esta coleção possui regras do Firestore que bloqueiam o acesso a qualquer usuário com papel de `recepcao`.

```typescript
interface ProntuarioEvolucao {
  id: string;
  pacienteId: string;
  profissionalId: string;           // UID do médico/psicólogo
  profissionalNome: string;
  profissionalRegistro: string;     // Ex: "CRM/SP 123456" ou "CRP 06/99999"
  dataAtendimento: Timestamp;
  tipoRegistro: 'evolucao_ia' | 'evolucao_manual' | 'scan_historico_drive';
  
  // Para Evoluções Clínicas (Formato SOAP / Psiquiátrico Estruturado)
  conteudoClinico?: {
    subjetivo: string;              // Queixa principal, relato do paciente, humor autorreferido
    objetivo: string;               // Exame do Estado Mental (EEM), afeto, psicomotricidade, pensamento
    avaliacao: string;              // Hipótese diagnóstica, CID-10/11 ou DSM-5, impressão clínica
    planoTerapeutico: string;       // Conduta, prescrições, encaminhamentos, metas da sessão
    medicacoesPrescritas?: Array<{
      nome: string;
      dosagem: string;
      posologia: string;
      controlada: boolean;          // Portaria 344/98
    }>;
  };

  // Metadados de Áudio & IA (Quando gerado por gravação)
  audioMetadados?: {
    duracaoSegundos: number;
    audioStorageUrl?: string;       // Link temporário no Cloud Storage (expirável)
    transcricaoBruta?: string;      // Transcrição integral da consulta via Gemini/Speech
    resumoGeradoPorIA: boolean;
    aprovadoPeloMedico: boolean;    // Flag de validação humana obrigatória (CFM)
    editadoAposIA: boolean;
  };

  // Metadados para Documentos Físicos Digitalizados (Passivo de 1.500 fichas)
  scanDriveMetadados?: {
    driveFileId: string;            // ID do arquivo no Google Drive
    driveWebViewLink: string;       // Link seguro de visualização
    driveDownloadLink: string;
    nomeArquivo: string;            // Ex: "Prontuario_Fisico_1998_2025.pdf"
    quantidadePaginas: number;
    dataOriginalDocumento?: string; // Data aproximada do prontuário físico
    observacoes?: string;
  };

  criadoEm: Timestamp;
  atualizadoEm: Timestamp;
}
```

### 2.3. Coleção: `agendamentos`
```typescript
interface Agendamento {
  id: string;
  pacienteId: string;
  pacienteNome: string;
  pacienteTelefone: string;
  profissionalId: string;
  profissionalNome: string;
  
  dataHoraInicio: Timestamp;
  dataHoraFim: Timestamp;
  tipoConsulta: 'primeira_consulta' | 'retorno' | 'sessao_terapia' | 'emergencia';
  modalidade: 'presencial' | 'telemedicina';
  
  status: 'agendado' | 'confirmado' | 'em_atendimento' | 'realizado' | 'cancelado' | 'faltou';
  
  // Integração com Google Agenda
  googleCalendarEventId?: string;   // ID do evento criado no Google Agenda
  googleMeetLink?: string;          // Caso seja teleconsulta
  sincronizadoGoogle: boolean;
  
  // Financeiro vinculado
  valorCobrado: number;
  pagamentoStatus: 'pendente' | 'pago' | 'cortesia' | 'convenio';
  
  notasRecepcao?: string;           // Informações que a recepção pode ver (ex: "chegou acompanhado")
  criadoEm: Timestamp;
  atualizadoEm: Timestamp;
}
```

### 2.4. Coleção: `financeiro`
```typescript
interface TransacaoFinanceira {
  id: string;
  agendamentoId?: string;
  pacienteId: string;
  pacienteNome: string;
  profissionalId: string;
  
  valor: number;
  tipo: 'receita' | 'despesa';
  categoria: 'consulta_particular' | 'repasse_convenio' | 'pacote_sessoes' | 'outro';
  metodoPagamento: 'pix' | 'cartao_credito' | 'cartao_debito' | 'dinheiro' | 'transferencia';
  status: 'pago' | 'pendente' | 'estornado';
  
  dataVencimento: Timestamp;
  dataPagamento?: Timestamp;
  comprovanteUrl?: string;
  
  // Dados Fiscais / Declaração
  reciboEmitido: boolean;
  numeroRecibo?: string;
  emitirParaCpf: string;
  
  criadoEm: Timestamp;
  atualizadoEm: Timestamp;
}
```

---

## 3. Regras de Segurança do Firestore (`firestore.rules`)

Essas regras garantem que recepcionistas **nunca** consigam ler dados clínicos, fotos de prontuários ou áudios gravados, em total conformidade com a LGPD e resoluções do CFM/CFP.

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Funções auxiliares de validação de papéis
    function estaAutenticado() {
      return request.auth != null;
    }
    
    function getUserData() {
      return get(/databases/$(database)/documents/usuarios/$(request.auth.uid)).data;
    }
    
    function isAdmin() {
      return estaAutenticado() && getUserData().role == 'admin';
    }
    
    function isProfissionalSaude() {
      return estaAutenticado() && (getUserData().role == 'medico' || getUserData().role == 'psicologo' || getUserData().role == 'admin');
    }
    
    function isRecepcao() {
      return estaAutenticado() && (getUserData().role == 'recepcao' || isProfissionalSaude());
    }

    // 1. Coleção Usuários
    match /usuarios/{usuarioId} {
      allow read: if estaAutenticado();
      allow write: if isAdmin();
    }

    // 2. Coleção Pacientes (Dados Cadastrais)
    match /pacientes/{pacienteId} {
      // Recepção e Médicos podem ler e cadastrar pacientes
      allow read, create, update: if isRecepcao();
      allow delete: if isAdmin();

      // 3. SUBCOLEÇÃO PRONTUÁRIOS (Dados Clínicos Sensíveis)
      // ⚠️ BLOQUEIO TOTAL PARA RECEPÇÃO
      match /prontuarios/{prontuarioId} {
        allow read, write: if isProfissionalSaude();
      }

      // 4. SUBCOLEÇÃO ANAMNESE
      match /anamnese/{anamneseId} {
        allow read, write: if isProfissionalSaude();
      }
    }

    // 5. Coleção Agendamentos
    match /agendamentos/{agendamentoId} {
      allow read, write: if isRecepcao();
    }

    // 6. Coleção Financeiro
    match /financeiro/{transacaoId} {
      allow read, write: if isRecepcao();
    }

    // 7. Logs de Auditoria (Apenas gravação ou leitura de Admin)
    match /logs_auditoria/{logId} {
      allow create: if estaAutenticado();
      allow read: if isAdmin();
      allow update, delete: if false; // Imutável
    }
  }
}
```
