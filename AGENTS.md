# REGRAS DO PROJETO NEXAI-PSICO

Toda atividade realizada neste projeto deve obedecer estritamente às seguintes regras:

1. **Construção e Teste 100% Online (Zero Mock / Sem LocalStorage)**:
   - Todo fluxo é construído e testado online.
   - Nada de mocks locais ou dados simulados em memória/localStorage para pacientes, prontuários, finanças ou consultas.
   - Banco oficial de dados é o Cloud Firestore em tempo real.
   - APIs integradas (Google Gemini, Google Drive, Google Calendar, Cloud Functions) são online.

2. **Auto-Versionamento Obrigatório**:
   - Todo deploy possui auto-versionamento automático (ex: 1.0.0 -> 1.0.1 -> 1.0.2).
   - O número da versão deve estar registrado no `package.json`, em `src/version.ts`, visível no cabeçalho/UI da aplicação e no Git tag.

3. **Deploy, Publicação no Site, Git e Versão em Cada Alteração**:
   - Toda correção, melhoria, ajuste e adição de código deve obrigatoriamente:
     1. Receber uma nova versão (auto-versionamento).
     2. Ser compilado e testado sem erros (`npm run build`).
     3. Ter o deploy executado e postado no site oficial (Firebase Hosting).
     4. Ser comitado e copiado para o GitHub com a tag da versão criada (`git push origin main --tags`).

4. **Vocabulário Único e UX Limpo (Proibido Termos Duplos com '&' ou '/')**:
   - É terminantemente proibido utilizar 2 termos ou palavras para o mesmo campo, botão, aba, card ou item de menu (ex: evitar 'A & B' ou 'A / B').
   - Termos compostos desnecessários deixam o visual carregado e prejudicam a experiência do usuário (UX).
   - Todo rótulo deve ser conciso, direto, profissional e com termo único.
