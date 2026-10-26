# 🌐 Guia Prático: Como Configurar as Ferramentas Google Online

Este guia rápido mostra exatamente onde você clica para obter as chaves e links das ferramentas Google e conectá-las ao seu sistema **NexAi-PSICO**.

> 💡 **Dica de Ouro:** Você pode colar essas chaves direto no botão **"⚙️ Google Cloud & IA"** no topo da tela do sistema ou no arquivo `.env`.

---

## 1. 🧠 Google Gemini AI (Áudio para SOAP com IA) — *Leva 2 minutos*

O Gemini Flash é a IA do Google que escuta a consulta ou ditado médico e preenche automaticamente o prontuário SOAP.

### Como gerar sua chave gratuita:
1. Acesse o portal oficial: **[aistudio.google.com](https://aistudio.google.com)**
2. Faça login com qualquer conta Google (Gmail ou Workspace da clínica).
3. No canto superior esquerdo, clique no botão azul **"Get API key"** (ou *"Obter chave de API"*).
4. Clique em **"Create API key in new project"** (Criar chave em novo projeto).
5. Copie a chave gerada (ela começa com `AIzaSy...`).
6. **No NexAi-PSICO:** Clique no botão **"Google Cloud & IA"** no topo da tela, cole sua chave no campo e clique em **"Testar Chave"**.
7. Pronto! A luz verde aparecerá confirmando que a IA do Google está conectada.

---

## 2. 📁 Google Drive (Armazenamento dos Prontuários Escaneados) — *Leva 30 segundos*

Para que as fichas antigas de papel fotografadas fiquem salvas no Google Drive da clínica:

### Como configurar a pasta:
1. Abra o seu **[Google Drive](https://drive.google.com)**.
2. Crie uma pasta chamada **`Prontuários NexAi`** (ou o nome que preferir).
3. Abra essa pasta criada e olhe para a barra de endereços do seu navegador (URL).
4. O link terá este formato:
   ```
   https://drive.google.com/drive/folders/1A2b3C4d5E6F7g8H9xYz...
   ```
5. Copie apenas o código final após `folders/` (este é o **ID da Pasta Raiz**).
6. **No NexAi-PSICO:** Cole este código no campo **"ID da Pasta Raiz no Google Drive"**.

---

## 3. 📅 Google Agenda (Google Calendar) — *Leva 1 minuto*

Para que os atendimentos agendados na recepção apareçam no Google Agenda do celular dos médicos:

### Como configurar:
1. Abra o **[Google Agenda](https://calendar.google.com)**.
2. Certifique-se de qual é o e-mail Google usado pelo médico/psicólogo (ex: `dr.roberto.silveira@gmail.com`).
3. **No NexAi-PSICO:** No modal de configurações, confirme o e-mail do Google Calendar do profissional.
4. Quando a recepção clicar no ícone do calendário em qualquer agendamento, o evento já abrirá preenchido no Google Agenda.

---

## 4. 🔥 Firebase & Firestore (Opcional - Para Banco na Nuvem)

O sistema já funciona 100% no seu computador e celular com persistência local. Se você quiser sincronizar múltiplos computadores na nuvem:

1. Acesse o **[Firebase Console](https://console.firebase.google.com)**.
2. Clique em **"Adicionar projeto"** e dê o nome `nexai-psico`.
3. Ative o **Cloud Firestore** no modo de produção.
4. Vá em *Configurações do Projeto (ícone da engrenagem)* ➔ *Geral* ➔ *Seus aplicativos* ➔ Adicione um app Web `</>`.
5. O Firebase gerará o bloco `firebaseConfig`. Basta preencher os valores no arquivo `.env` ou nas configurações.
6. As regras de segurança para proteger o sigilo médico contra a recepção já estão prontas no arquivo [`firestore.rules`](file:///c:/Nexa/NexAi-PSICO/firestore.rules).

---

## 🚀 Resumo do Status

| Ferramenta | Onde Configurar | Tempo Necessário | Status no NexAi-PSICO |
| :--- | :--- | :--- | :--- |
| **Google Gemini Flash** | [AI Studio](https://aistudio.google.com) | ~2 min | ✅ Integrado com teste de conexão ao vivo |
| **Google Drive** | [Google Drive](https://drive.google.com) | ~30 seg | ✅ Integrado com geração de PDFs |
| **Google Agenda** | [Google Calendar](https://calendar.google.com) | ~1 min | ✅ Integrado com lembretes WhatsApp |
| **Firebase Firestore** | [Firebase Console](https://console.firebase.google.com) | Opcional | ✅ Regras LGPD e Cloud Functions prontas |
