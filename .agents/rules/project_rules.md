# Diretrizes e Regras Mandatórias do Projeto NexAi-PSICO

Estas regras são MANDATÓRIAS e aplicam-se a todo o desenvolvimento, refatoração, manutenção e interação no projeto NexAi-PSICO.

---

## REGRA 1: Construção e Testes 100% Online (Zero Mock / Proibido LocalStorage como Banco)
1. **Ambiente Online Real**: Toda funcionalidade, integração e fluxo de dados deve ser construído e testado conectado aos serviços reais em nuvem (Firebase Hosting, Cloud Firestore, Cloud Storage, Google Gemini AI, Google Drive, Google Calendar).
2. **Sem Mocks Locais**: Proibido implementar mocks locais, dados estáticos fictícios ou simulações temporárias para substituir serviços de produção.
3. **Proibido LocalStorage como Banco de Dados**: O `localStorage` ou `sessionStorage` não devem ser utilizados como banco de dados principal de pacientes, prontuários, transações, evoluções clínicas ou agendamentos. A fonte única de verdade é o Cloud Firestore em tempo real.
4. **Validação em Produção**: Qualquer teste funcional deve ser validado no ambiente online publicado (Firebase Hosting).

---

## REGRA 2: Auto-Versionamento Obrigatório a Cada Deploy
1. **Incremento Automático de Versão**: Toda e qualquer alteração de código enviada para deploy deve sofrer incremento automático de versão seguindo Semantic Versioning (`patch`: `v1.0.1` -> `v1.0.2`, etc.).
2. **Rastreabilidade**: A versão atual do sistema deve estar sincronizada em:
   - `package.json`
   - `src/version.ts`
   - Visível na interface gráfica do usuário (UI) para conferência online imediata.
   - Tag no repositório Git (`vX.Y.Z`).

---

## REGRA 3: Ciclo Completo Obrigatório (Correção/Melhoria -> Deploy -> Publicado no Site -> Git + Tag)
Para **toda e qualquer** correção, melhoria, ajuste, refatoração ou adição ao código:
1. **Auto-incremento da Versão**: Atualizar versão em `package.json` e `src/version.ts`.
2. **Build de Produção**: Executar validação rigorosa com `npm run build` (`tsc && vite build`).
3. **Deploy Online Imediato**: Publicar a aplicação no site oficial do Firebase Hosting (`firebase deploy --only hosting,firestore:rules`).
4. **Sincronização no Git**: Comitar todas as alterações com mensagem descritiva da versão e criar a tag correspondente (`git tag vX.Y.Z`).
5. **Push Remoto**: Enviar código e tags para o GitHub (`git push origin main --tags`).

---

## Como Executar o Ciclo de Release:
Utilizar o script automatizado:
```bash
npm run deploy
# ou com mensagem personalizada:
npm run deploy -- "descricao da alteracao realizada"
```
