# 🚀 NexAi-PSICO - Guia Completo de Execução e Instalação

Este documento contém o passo a passo detalhado para você executar e testar o **NexAi-PSICO** em qualquer computador (Windows, Mac ou Linux), além das instruções para configurar as integrações com **Google Gemini AI**, **Google Drive** e **Google Calendar**.

---

## 📌 1. Como Rodar o Projeto na Sua Máquina (Passo a Passo Rápido)

### Pré-requisitos:
- **Node.js** instalado (versão 18 ou superior). Se não tiver, baixe em [nodejs.org](https://nodejs.org).

### Passos no Terminal (Prompt de Comando ou PowerShell):

1. **Abra o terminal na pasta do projeto:**
   ```bash
   cd c:\Nexa\NexAi-PSICO
   ```

2. **Instale as dependências (caso seja a primeira vez):**
   ```bash
   npm install
   ```

3. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

4. **Acesse no seu navegador:**
   - Abra [http://localhost:5173](http://localhost:5173) no Chrome, Edge, Safari ou Firefox.
   - Para testar no celular conectado no mesmo Wi-Fi, acesse o IP exibido no terminal (ex: `http://192.168.1.15:5173`).

---

## 📱 2. Módulos Prontos para Testar

O sistema vem com dados médicos e psicológicos pré-carregados para você testar tudo imediatamente:

1. **🎙️ Consulta com Áudio & IA (Gemini SOAP):**
   - Clique em **"Consulta IA (SOAP)"** no topo.
   - Grave sua voz com o microfone ou clique em **"Simular Processamento com IA"**.
   - O sistema gerará na hora o relatório completo: **Subjetivo**, **Objetivo (EEM)**, **Avaliação (CID-10)**, **Plano Terapêutico** e **Prescrição de Psicofármacos**.
   - Clique em **"Validar & Assinar Evolução Clínica"** para salvar na ficha do paciente.

2. **📷 Scanner de Prontuários Físicos (Passivo no Google Drive):**
   - Clique em **"Scanner Físico"** no menu.
   - Abra a câmera contínua e bata 3 a 5 fotos em sequência (ou selecione imagens do PC).
   - Clique em **"Gerar PDF & Salvar no Google Drive"**.
   - O app compila tudo em 1 único PDF no padrão A4 médico e gera o link direto da pasta do Google Drive.

3. **📅 Agenda & Recepção (Kanban + WhatsApp):**
   - Visualize os pacientes nas colunas: *Agendados*, *Confirmados*, *Sala de Espera*, *Em Atendimento* e *Concluídos*.
   - Clique no botão **"WhatsApp"** para abrir a mensagem de confirmação personalizada pronta para envio com 1 toque.
   - Clique no ícone do **Google Calendar** para abrir o evento no Google Agenda.

4. **👥 Prontuários & Timeline do Paciente:**
   - Acesse **"Pacientes"**, selecione um paciente (ex: *Helena Vasconcelos* ou *Gabriel Menezes*).
   - Veja os alertas clínicos em vermelho, as fichas físicas antigas escaneadas e o histórico cronológico de consultas.

5. **💰 Financeiro & Emissão de Recibos Oficiais (PDF):**
   - Acesse **"Financeiro"**.
   - Veja os totais recebidos e pendentes.
   - Clique em **"Gerar Recibo"** em qualquer atendimento para baixar instantaneamente o **Recibo Médico Oficial em PDF** com CRM/CRP e CPF pronto para declaração de Imposto de Renda (DMED).

6. **🛡️ Alternador de Papéis (RBAC & LGPD):**
   - No canto superior direito, clique no perfil e troque entre:
     - **Dr. Roberto Silveira (Médico Psiquiatra)**: Acesso clínico completo.
     - **Dra. Camila Nogueira (Psicóloga)**: Acesso clínico completo.
     - **Juliana Mendes (Recepção)**: Bloqueio estrito de acesso a dados clínicos e áudios de pacientes (em conformidade com a LGPD e resoluções do CFM/CFP).
     - **Administrador**: Gestão financeira e operacional.

---

## 🔑 3. Configuração de Chaves Reais (Opcional)

Para conectar sua própria chave do **Google Gemini** ou seu projeto do **Firebase**:

1. Crie uma cópia do arquivo `.env.example` e renomeie para `.env`:
   ```bash
   copy .env.example .env
   ```

2. Adicione sua chave do Gemini:
   ```env
   VITE_GEMINI_API_KEY=sua_chave_do_google_ai_studio_aqui
   ```
   *(Obtenha uma chave gratuita em: [aistudio.google.com](https://aistudio.google.com))*

---

## 📦 4. Como Gerar o Pacote de Produção (Build)

Quando quiser colocar o sistema no ar para a clínica:

```bash
npm run build
```
Os arquivos otimizados e prontos para deploy estarão na pasta `dist/`, prontos para serem hospedados no **Firebase Hosting**, **Vercel**, **Netlify** ou servidor próprio da clínica.
