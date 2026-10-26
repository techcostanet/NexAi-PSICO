# NexAi-PSICO - Sistema de Gestão Clínica & Prontuário Inteligente
**Arquitetura, Especificação Técnica e Plano de Implementação**

---

## 1. Visão Geral do Produto

O **NexAi-PSICO** é uma plataforma médica moderna, projetada especificamente para clínicas de psiquiatria e psicologia que estão realizando a transição definitiva do modelo em papel para o digital. O sistema combina a robustez e segurança do ecossistema Google (Firebase, Firestore, Google Drive, Google Agenda e Google Cloud AI) com uma interface focada em usabilidade extrema no celular e no computador.

### Pilares Fundamentais:
1. **Zero Fricção para Profissionais Tradicionais:** Interface limpa, mobile-first (PWA), sem complexidade desnecessária.
2. **Digitalização de Passivo Histórico:** Módulo de captura rápida de fotos/scans de prontuários antigos com envio direto e estruturado para o Google Drive da clínica.
3. **Prontuário com Inteligência Artificial (Voz para SOAP):** O médico grava o áudio da consulta (ou dita um resumo pós-sessão), e a IA gera automaticamente a evolução psiquiátrica/psicológica estruturada.
4. **Sincronização Bidirecional com Google Agenda:** Aproveitamento do fluxo que os médicos já adotaram.
5. **Controle Financeiro e de Pagamentos:** Gestão de consultas pagas, pendentes, emissão de recibos e controle de faturamento por profissional.
6. **Segurança Máxima e LGPD / Sigilo Médico (CFM / CFP):** Separação estrita de privilégios (a recepção nunca tem acesso ao conteúdo clínico dos pacientes).

---

## 2. Arquitetura da Solução (Google Cloud Platform & Firebase)

```
                              [ MÉDICO / PSICÓLOGO ]            [ RECEPÇÃO ]
                               (Smartphone / Desktop)          (Computador / Tablet)
                                        │                                │
                                        ▼                                ▼
                     ┌───────────────────────────────────────────────────────────┐
                     │          Frontend: PWA (Next.js / React + Tailwind)       │
                     │          - Responsivo, Offline-Ready, Câmera Integrada    │
                     └─────────────────────────────┬─────────────────────────────┘
                                                   │
                                                   ▼
                     ┌───────────────────────────────────────────────────────────┐
                     │            Firebase Authentication (RBAC)                 │
                     │     - Roles: ADMIN | MEDICO | PSICOLOGO | RECEPCAO        │
                     └─────────────────────────────┬─────────────────────────────┘
                                                   │
                ┌──────────────────────────────────┴──────────────────────────────────┐
                ▼                                                                     ▼
┌────────────────────────────────┐                                    ┌────────────────────────────────┐
│   Cloud Firestore (NoSQL DB)   │                                    │    Firebase Cloud Functions    │
│  - Pacientes                   │                                    │  (Backend Serverless Node/TS)  │
│  - Agendamentos                │                                    └───────┬────────────┬───────────┘
│  - Prontuários / Evoluções     │                                            │            │
│  - Transações Financeiras      │                                            │            │
└────────────────────────────────┘                                            │            │
                                            ┌─────────────────────────────────┘            └────────────────────┐
                                            ▼                                                                   ▼
                             ┌──────────────────────────────┐                                    ┌──────────────────────────────┐
                             │       Google Drive API       │                                    │       Google Gemini AI       │
                             │ (Service Account / Workspace)│                                    │  (Speech-to-Text + LLM Flash)│
                             │ - Pastas por Paciente        │                                    │ - Transcrição de Áudio       │
                             │ - Scans de Prontuários (PDF) │                                    │ - Estruturação em Formato    │
                             └──────────────────────────────┘                                    │   SOAP / Psiquiátrico        │
                                            │                                                    └──────────────────────────────┘
                                            ▼
                             ┌──────────────────────────────┐
                             │     Google Calendar API      │
                             │ - Sincronização em 2 vias    │
                             │ - Lembretes automáticos      │
                             └──────────────────────────────┘
```

---

## 3. Estrutura dos Arquivos de Documentação do Projeto

O plano completo está organizado nos seguintes documentos:

1. **`README.md`** (este documento): Visão geral, arquitetura e decisões de engenharia.
2. **`DATABASE_SCHEMA.md`**: Modelo completo de coleções do Firestore, índices e regras de segurança (Security Rules).
3. **`FLUXOS_E_MODULOS.md`**: Especificação detalhada de cada tela, do fluxo de gravação de áudio com IA e do upload de prontuários antigos.
4. **`INTEGRACOES_GOOGLE.md`**: Guia técnico de integração com Google Drive API, Google Calendar API e Gemini AI.
5. **`ROADMAP_IMPLEMENTACAO.md`**: Guia passo a passo de desenvolvimento em 4 fases, do MVP ao deploy de produção.
