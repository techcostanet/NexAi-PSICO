# NexAi-PSICO - Roadmap de Implementação e Estratégia de Adoção

---

## 1. Visão Geral do Cronograma de Desenvolvimento (Fases Ágeis)

```
[ FASE 1: FUNDAÇÃO & SCANNER DE PAPEL ] ────► [ FASE 2: PRONTUÁRIO & ÁUDIO IA ] ────► [ FASE 3: AGENDA & GOOGLE CALENDAR ] ────► [ FASE 4: FINANCEIRO & PRODUÇÃO ]
   - Auth Firebase & Regras LGPD                 - Módulo de Evolução SOAP                     - Sincronização Google Calendar               - Controle de Pagamentos / Pix
   - Cadastro Rápido de Pacientes                - Gravação de Áudio no Celular                - Painel da Recepção (Kanban)                 - Emissão de Recibos / Relatórios
   - Integração Google Drive API                 - Integração com Gemini Flash AI              - Lembretes via WhatsApp (1 toque)            - Treinamento da Equipe e Go-Live
   - Câmera Contínua & Criação de PDFs           - Timeline Clínica do Paciente
```

---

## 2. Detalhamento das Fases

### 🚀 Fase 1: Fundação, Cadastro e Digitalização de Papel (Semanas 1 e 2)
**Meta:** A clínica já começa a cadastrar pacientes e esvaziar o arquivo de aço físico para o Google Drive.
- [x] Configuração do projeto Firebase (Firestore, Auth, Storage, Cloud Functions).
- [x] Criação da Service Account no Google Cloud e permissões do Google Drive.
- [x] Desenvolvimento da interface PWA responsiva (Mobile & Desktop).
- [x] Tela de Cadastro e Busca Instantânea de Pacientes.
- [x] **Módulo de Captura de Fotos do Celular:** Tirar 5 a 15 fotos em sequência, converter em PDF comprimido de alta resolução e salvar na pasta do paciente no Google Drive.
- [x] Aplicação das regras de segurança LGPD no Firestore (bloqueio de acesso a dados clínicos para a recepção).

### 🧠 Fase 2: Prontuário Eletrônico e IA de Áudio (Semanas 3 e 4)
**Meta:** Os médicos/psicólogos passam a atender pelo sistema e ditar/gravar suas evoluções.
- [x] Estrutura da Timeline do Paciente (visualizador de scans do Drive + evoluções digitais).
- [x] Componente de Gravação de Áudio com cancelamento de ruído e compressão local (WebM/Opus).
- [x] Cloud Function de integração com o **Google Gemini 1.5/2.0 Flash** para geração automática do formato SOAP (Subjetivo, Objetivo, Avaliação, Plano).
- [x] Tela de revisão e edição rápida no celular em menos de 3 toques.
- [x] Módulo de Anamnese inicial e histórico de medicações ativas.

### 📅 Fase 3: Agenda e Sincronização com Google Agenda (Semanas 5 e 6)
**Meta:** Unificar a marcação de consultas da recepção com os celulares dos profissionais.
- [x] Painel de Agenda da Recepção (visão diária, semanal e lista de presença).
- [x] Webhook e sincronização bidirecional com a API do Google Calendar.
- [x] Notificação e atalho rápido no WhatsApp para envio de confirmação ao paciente.
- [x] Visão do Médico no Celular: *"Lista de Atendimentos de Hoje"* com acesso direto ao prontuário.

### 💰 Fase 4: Financeiro, Relatórios e Go-Live (Semanas 7 e 8)
**Meta:** Controle financeiro completo da clínica e transição 100% sem papel.
- [x] Controle de pagamentos por consulta (Pix, Cartão, Dinheiro, Convênio).
- [x] Emissão de Recibo em PDF pronto para o paciente declarar no Imposto de Renda.
- [x] Relatório de repasse financeiro por médico/psicólogo.
- [x] Treinamento operacional da recepção e do corpo clínico.
- [x] Deploy final em produção no Firebase Hosting com domínio próprio da clínica.

---

## 3. Estratégia de Transição para Usuários Leigos (Zero Papel)

Como a equipe nunca utilizou tecnologia para gestão clínica, a estratégia de transição deve seguir estas regras:

1. **Digitalização "Just-in-Time" (Sob Demanda):**
   - Não tente digitalizar os 1.500 prontuários de uma só vez no primeiro dia.
   - Toda manhã, a recepção pega as pastas físicas apenas dos pacientes agendados para aquele dia, fotografa em 1 minuto cada e coloca no sistema.
   - Em 6 a 8 semanas, mais de 80% do passivo ativo estará 100% digitalizado sem sobrecarregar ninguém.

2. **Atalhos no Celular dos Médicos (PWA):**
   - Instalar o ícone do sistema direto na tela inicial do celular dos médicos.
   - O médico abre o app, vê a lista com os nomes do dia, clica no paciente e já tem na mão tanto as fotos da ficha antiga quanto o botão de gravar a sessão.

3. **Scanner de Apoio (Opcional):**
   - Para lotes grandes, um scanner de mesa com alimentador automático (ADF) como o *Epson WorkForce* ou *Brother ADS* conectado ao PC da recepção pode digitalizar 10 folhas em 10 segundos direto para PDF.

---

## 4. Estimativa de Custos de Infraestrutura (Google Cloud / Firebase)

O uso do ecossistema Google para essa clínica é extremamente econômico:

| Serviço | Nível Gratuito / Custo Estimado | Custo Mensal (Até 1.500 pacientes) |
| :--- | :--- | :--- |
| **Firebase Auth** | 50.000 usuários ativos/mês grátis | **R$ 0,00** |
| **Cloud Firestore** | 50.000 leituras e 20.000 escritas diárias grátis | **R$ 0,00 a R$ 15,00** |
| **Google Drive** | Espaço já contratado no Google Workspace / Google One | **R$ 0,00 adicionais** |
| **Google Gemini Flash** | ~R$ 0,002 por áudio/consulta processado | **~R$ 5,00 a R$ 20,00 / mês** |
| **Firebase Hosting (SSL)** | 10 GB de tráfego grátis por mês | **R$ 0,00** |
| **Total Estimado** | **Extremamente acessível e previsível** | **~R$ 15,00 a R$ 50,00 / mês** |
