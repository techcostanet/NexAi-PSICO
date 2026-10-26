# NexAi-PSICO - Guia de Integração Técnica (Google Cloud, Drive, Calendar e IA)

---

## 1. Integração com Google Drive API (Armazenamento dos Prontuários Físicos)

### 1.1. Método de Autenticação
Usamos uma **Conta de Serviço (Google Cloud Service Account)** com as seguintes permissões:
- Escopo: `https://www.googleapis.com/auth/drive.file`
- A clínica cria uma pasta raiz no Google Drive (ex: `Prontuarios_NexAi_Clinica`) e compartilha com o e-mail da Conta de Serviço com papel de **Editor**.

### 1.2. Código do Serviço no Backend (TypeScript / Node.js - Cloud Function)

```typescript
import { google } from 'googleapis';
import { Readable } from 'stream';

const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY || '{}'),
  scopes: ['https://www.googleapis.com/auth/drive.file'],
});

const drive = google.drive({ version: 'v3', auth });

const ROOT_FOLDER_ID = process.env.GOOGLE_DRIVE_ROOT_FOLDER_ID;

/**
 * Cria ou recupera a pasta de um paciente no Google Drive
 */
export async function obterOuCriarPastaPaciente(pacienteId: string, nomePaciente: string): Promise<string> {
  const sanitizedNome = nomePaciente.replace(/[^a-zA-Z0-9 _-]/g, '');
  const folderName = `${pacienteId.substring(0, 8)}_${sanitizedNome}`;

  // 1. Verifica se já existe
  const response = await drive.files.list({
    q: `'${ROOT_FOLDER_ID}' in parents and name = '${folderName}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
    fields: 'files(id, name)',
    spaces: 'drive',
  });

  if (response.data.files && response.data.files.length > 0) {
    return response.data.files[0].id!;
  }

  // 2. Se não existe, cria a pasta
  const fileMetadata = {
    name: folderName,
    mimeType: 'application/vnd.google-apps.folder',
    parents: [ROOT_FOLDER_ID!],
  };

  const folder = await drive.files.create({
    requestBody: fileMetadata,
    fields: 'id',
  });

  return folder.data.id!;
}

/**
 * Faz o upload de um PDF com as páginas escaneadas
 */
export async function uploadProntuarioPDF(
  folderId: string,
  bufferPDF: Buffer,
  nomeArquivo: string
) {
  const stream = new Readable();
  stream.push(bufferPDF);
  stream.push(null);

  const fileMetadata = {
    name: nomeArquivo,
    parents: [folderId],
  };

  const media = {
    mimeType: 'application/pdf',
    body: stream,
  };

  const file = await drive.files.create({
    requestBody: fileMetadata,
    media: media,
    fields: 'id, name, webViewLink, webContentLink',
  });

  return file.data;
}
```

---

## 2. Integração com Google Calendar API (Sincronização de Consultas)

### 2.1. Fluxo de Criação e Atualização de Eventos
Ao agendar uma consulta no sistema NexAi-PSICO, disparamos a criação no Google Agenda do médico responsável:

```typescript
import { google } from 'googleapis';

const calendar = google.calendar({ version: 'v3', auth });

export async function sincronizarConsultaComGoogleAgenda(
  calendarIdDoMedico: string,
  consulta: {
    pacienteNome: string;
    telefone: string;
    tipo: string;
    inicioISO: string;
    fimISO: string;
    agendamentoId: string;
  }
) {
  const event = {
    summary: `Consulta: ${consulta.pacienteNome} (${consulta.tipo})`,
    description: `Agendamento NexAi-PSICO ID: ${consulta.agendamentoId}\nContato: ${consulta.telefone}`,
    start: {
      dateTime: consulta.inicioISO,
      timeZone: 'America/Sao_Paulo',
    },
    end: {
      dateTime: consulta.fimISO,
      timeZone: 'America/Sao_Paulo',
    },
    colorId: '2', // Cor verde claro para consultas confirmadas
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'popup', minutes: 15 },
        { method: 'popup', minutes: 60 },
      ],
    },
  };

  const response = await calendar.events.insert({
    calendarId: calendarIdDoMedico,
    requestBody: event,
  });

  return response.data.id; // Salva o googleCalendarEventId no Firestore
}
```

---

## 3. Integração com Inteligência Artificial (Google Gemini 1.5/2.0 Flash)

### 3.1. Processamento Direto de Áudio para Prontuário Estruturado
O modelo **Gemini 1.5/2.0 Flash** possui suporte multimodal nativo para áudio (ingestão de arquivos de voz `.webm` / `.mp3`), gerando a evolução clínica em formato JSON estruturado com altíssima velocidade e custo irrisório.

### 3.2. Prompt Clínico Especializado (System Prompt para Psiquiatria/Psicologia)

```typescript
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const SYSTEM_PROMPT_PSIQUIATRIA = `
Você é um assistente médico sênior especializado em documentação psiquiátrica e psicológica clínica.
Sua função é ouvir a gravação da consulta ou o ditado clínico do profissional e gerar uma evolução clínica formal no padrão SOAP e terminologia psiquiátrica adequada (CID-10/CID-11 e DSM-5).

Retorne APENAS um JSON válido no seguinte formato:
{
  "subjetivo": "Relato do paciente, queixa principal, evolução dos sintomas desde a última sessão, relato sobre o sono e adesão medicamentosa.",
  "objetivo": "Exame do Estado Mental (EEM): aparência geral, contato, humor, afeto, pensamento (curso/forma/conteúdo), sensopercepção, psicomotricidade, juízo crítico.",
  "avaliacao": "Hipótese diagnóstica principal com código CID-10/CID-11 aproximado e justificativa da evolução clínica.",
  "planoTerapeutico": "Conduta prescrita, modificações posológicas de psicofármacos, orientações de rotina/higiene do sono, encaminhamentos e data do próximo retorno.",
  "medicacoesDetectadas": [
    {
      "nome": "Nome do medicamento",
      "dosagem": "Ex: 50mg",
      "posologia": "Ex: 1 comprimido pela manhã",
      "controlada": true
    }
  ],
  "alertasRisco": "Identificação de ideação suicida, automutilação, intoxicação ou risco iminente (ou 'Nenhum alerta crítico detectado')."
}
`;

export async function processarAudioConsultaComIA(
  audioBase64: string,
  mimeType: string = 'audio/webm'
) {
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    systemInstruction: SYSTEM_PROMPT_PSIQUIATRIA,
    generationConfig: { responseMimeType: 'application/json' },
  });

  const result = await model.generateContent([
    {
      inlineData: {
        mimeType: mimeType,
        data: audioBase64,
      },
    },
    { text: 'Extraia os dados clínicos da consulta deste áudio no formato estruturado solicitado.' },
  ]);

  const jsonResponse = JSON.parse(result.response.text());
  return jsonResponse;
}
```
