# NexAi-PSICO - Especificação dos Módulos e Fluxos Operacionais

---

## 1. Módulo 1: Digitalização do Passivo Histórico (1.500 Prontuários no Google Drive)

### 1.1. Objetivo
Permitir que a clínica fotografe ou escaneie as ~15.000 páginas dos 1.500 prontuários físicos existentes de forma rápida, sem travar o celular ou a internet da clínica, armazenando tudo organizado em pastas por paciente no Google Drive.

### 1.2. Fluxo Passo a Passo

```
 [ Câmera do Celular / Scanner ]
               │
               ▼
 [ 1. Captura Múltipla de Páginas ] (Tira fotos sequenciais: Pág 1, Pág 2... Pág 10)
               │
               ▼
 [ 2. Otimização no Navegador / PWA ]
      - Conversão para WebP / JPEG otimizado
      - Ajuste automático de contraste e corte de bordas
      - Geração de 1 único arquivo PDF compacto por prontuário
               │
               ▼
 [ 3. Upload Direto via Cloud Function ]
               │
               ▼
 [ 4. Google Drive API ]
      - Criação automática da pasta: `Prontuarios / [CPF_ou_ID] - [Nome_Paciente]`
      - Armazenamento do PDF: `Prontuario_Historico_Fisico.pdf`
               │
               ▼
 [ 5. Registro no Firestore ]
      - Salva o `driveFileId` e link de visualização rápida na ficha do paciente
```

### 1.3. Experiência do Usuário (UX na Prática)
1. O recepcionista ou médico abre a ficha do paciente no app (PC ou celular).
2. Clica no botão em destaque: **"Digitalizar Prontuário Antigo"**.
3. No celular: abre o modo câmera contínua. Ele bate as 10 fotos seguidas sem fechar a câmera.
4. Ao clicar em *"Finalizar"*, o app junta as 10 fotos em um PDF de alta legibilidade (comprimido para ~2MB no total) e envia em segundo plano.
5. O prontuário fica instantaneamente disponível na linha do tempo do paciente.

---

## 2. Módulo 2: Prontuário Eletrônico com Áudio e Inteligência Artificial (Google Gemini)

### 2.1. Objetivo
Eliminar a digitação manual exaustiva para psiquiatras e psicólogos, permitindo gravar a consulta (com consentimento do paciente) ou gravar um áudio de resumo de 1 a 2 minutos logo após a sessão, gerando uma evolução clínica estruturada.

### 2.2. Fluxo da IA Clínica

```
 [ Microfone do Celular/PC ]
               │
               ▼
 [ 1. Gravação de Áudio da Sessão ] (WebM / Opus compactado com criptografia)
               │
               ▼
 [ 2. Envio Seguro para Firebase Storage ]
               │
               ▼
 [ 3. Cloud Function + Google Gemini 1.5/2.0 Flash ]
      - Prompt estruturado para psiquiatria e psicologia
      - Extração em formato clínico SOAP (Subjetivo, Objetivo, Avaliação, Plano)
      - Sugestão de hipóteses diagnósticas (CID-10 / CID-11 / DSM-5)
      - Identificação de sintomas-chave (humor, sono, ideação, ansiedade, efeitos colaterais)
               │
               ▼
 [ 4. Tela de Revisão do Médico ]
      - O médico vê o texto gerado na tela do celular em 3 a 5 segundos
      - Pode editar qualquer frase ou aprovar com 1 clique
               │
               ▼
 [ 5. Salva no Firestore ] (Evolução assinada digitalmente)
```

### 2.3. Estrutura do Relatório Gerado pela IA (Exemplo)
- **Subjetivo (S):** Queixa principal relatada pelo paciente, sintomas percebidos desde a última consulta, nível de estresse, padrão de sono e adesão medicamentosa.
- **Objetivo (O) - Exame do Estado Mental (EEM):** Apresentação, contato visual, velocidade do pensamento, humor (eutímico, distímico, expansivo), afeto, psicomotricidade e ausência/presença de sintomas psicóticos.
- **Avaliação (A):** Hipótese diagnóstica e evolução do quadro (ex: *F32.1 - Episódio depressivo moderado em melhora parcial*).
- **Plano Terapêutico (P):** Ajuste de dosagem de medicamentos, orientações de higiene do sono, encaminhamentos e data do retorno.

---

## 3. Módulo 3: Agenda Inteligente com Google Agenda

### 3.1. Objetivo
Manter o fluxo que a clínica já começou a usar no Google Agenda, mas trazendo inteligência, confirmações automáticas e vínculo direto com a ficha do paciente.

### 3.2. Recursos:
1. **Sincronização em 2 Vias (Google Calendar API):**
   - Agendou no sistema da clínica ➡️ Cria automaticamente o evento no Google Agenda do médico.
   - O médico reagendou ou bloqueou horário no Google Agenda pessoal ➡️ O sistema da clínica atualiza o status na hora.
2. **Visão da Recepção vs. Visão do Médico:**
   - **Recepção:** Painel semanal/diário estilo Kanban ou Timeline (Agendados, Confirmados, Sala de Espera, Em Atendimento, Concluídos).
   - **Médico (no celular):** Lista rápida do dia com o botão de 1 toque: *"Abrir Prontuário"* ou *"Iniciar Gravação da Consulta"*.
3. **Lembrete de Consulta:** Botão para envio de lembrete com 1 clique via WhatsApp (link gerado dinamicamente com mensagem personalizada).

---

## 4. Módulo 4: Cadastro Completo e Pesquisa Rápida de Pacientes

### 4.1. Busca Instantânea
- Pesquisa por **Nome**, **CPF** ou **Telefone** com auto-completar no celular.
- Filtros rápidos: *"Meus Pacientes de Hoje"*, *"Pacientes em Tratamento Ativo"*, *"Fichas Antigas Pendentes de Digitalização"*.

### 4.2. Linha do Tempo do Paciente (Timeline Médica)
Ao abrir o paciente no celular, o médico vê:
- **Cabeçalho:** Nome, idade, contato de emergência e alergias/alertas em destaque vermelho.
- **Card 1: Prontuário Físico Histórico (Google Drive):** Botão para abrir o PDF das 10 folhas antigas escaneadas.
- **Card 2: Última Prescrição Ativa:** Quais remédios o paciente está tomando atualmente.
- **Histórico de Sessões:** Lista cronológica de todas as evoluções (áudio/texto/SOAP) com datas e resumos.

---

## 5. Módulo 5: Gestão Financeira e Controle de Pagamentos

### 5.1. Recursos para a Recepção e Administração
1. **Status de Pagamento por Consulta:**
   - Ao finalizar o agendamento, a recepção marca: `Pago (Pix)`, `Pago (Cartão)`, `Dinheiro`, `Pendente` ou `Convênio`.
2. **Emissão de Recibo para Reembolso / IRPF:**
   - Geração automática de recibo médico em PDF com CPF do paciente e CRM/CRP do profissional (preparado para a DMED).
3. **Fechamento Mensal / Repasse dos Profissionais:**
   - Relatório automático de quanto cada médico/psicólogo atendeu no mês, cálculo da porcentagem de repasse da clínica e saldo líquido.
