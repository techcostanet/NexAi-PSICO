import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { google } from 'googleapis';

admin.initializeApp();
const db = admin.firestore();

// 1. Processador de Áudio para SOAP via Gemini Flash
export const processarAudioSOAP = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Requer autenticação.');
  }

  const { audioBase64, mimeType = 'audio/webm', especialidade = 'Psiquiatria' } = data;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new functions.https.HttpsError('failed-precondition', 'GEMINI_API_KEY não configurada.');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    systemInstruction: `Você é um assistente médico sênior psiquiátrico/psicológico no Brasil. Retorne apenas JSON no formato SOAP (subjetivo, objetivo, avaliacao, planoTerapeutico, medicacoesPrescritas).`,
    generationConfig: { responseMimeType: 'application/json' },
  });

  const result = await model.generateContent([
    { inlineData: { mimeType, data: audioBase64 } },
    { text: 'Extraia os dados clínicos em SOAP.' },
  ]);

  return JSON.parse(result.response.text());
});

// 2. Criação automática de evento no Google Calendar ao agendar
export const onAgendamentoCriado = functions.firestore
  .document('agendamentos/{agendamentoId}')
  .onCreate(async (snap, context) => {
    const agendamento = snap.data();
    console.log('Novo agendamento recebido para sincronização:', agendamento.pacienteNome);
    // Aqui dispara chamada para a Google Calendar API
    return null;
  });
