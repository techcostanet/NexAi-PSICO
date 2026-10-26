# 📜 Regras de Desenvolvimento e Operação - NexAi-PSICO

Este documento consolida as 3 regras mestras do projeto **NexAi-PSICO**. Todos os commits, deploys e atualizações de código devem obedecer a estas diretrizes.

---

### 1️⃣ REGRA 1: Tudo Construído e Testado Online (Zero Mock / Proibido LocalStorage como Banco)
- **Zero Mocks**: Não utilizar dados mocados locais ou stubs para fluxos que devem persistir dados.
- **Banco de Dados Real em Nuvem**: A persistência oficial de pacientes, prontuários, evoluções clínicas, agendamentos e transações financeiras é realizada diretamente no **Google Cloud Firestore**.
- **Serviços Google Online**: As chamadas ao **Google Gemini AI**, **Google Drive** e **Google Calendar** operam conectadas aos serviços online.
- **Ambiente de Teste**: Os testes e validações de homologação ocorrem no ambiente hospedado online (**Firebase Hosting**).

---

### 2️⃣ REGRA 2: Auto-Versionamento Obrigatório a Cada Deploy
- **Semver Automático**: Qualquer mudança de código enviada ao ambiente de deploy gera um incremento automático de versão (`patch` por padrão: `v1.0.0` ➡️ `v1.0.1` ➡️ `v1.0.2`...).
- **Visibilidade**: A versão ativa é registrada em:
  - `package.json`
  - `src/version.ts`
  - Badge visual no cabeçalho do sistema web para conferência imediata online.
  - Tag correspondente no repositório Git (`vX.Y.Z`).

---

### 3️⃣ REGRA 3: Deploy, Publicação no Site, Git e Versão em Toda Alteração
- Toda correção de bug, nova funcionalidade, ajuste de layout ou melhoria aciona o ciclo unificado:
  1. **Bump de Versão**: Incremento automático de versão.
  2. **Build de Produção**: `npm run build` gerando bundle minificado e validado pelo TypeScript.
  3. **Deploy Online**: Publicação no **Firebase Hosting** e regras de segurança do **Firestore**.
  4. **Git Commit & Tag**: Registro das alterações no Git com tag semântica de versão.
  5. **Git Push**: Cópia e sincronização para o repositório remoto no GitHub (`origin main --tags`).

---

### 🛠️ Comandos Disponíveis:

```bash
# Executa o ciclo completo (auto-versionamento, build, deploy no site, commit, tag e push no GitHub):
npm run deploy

# Opcional: passar mensagem descritiva do que foi alterado:
node scripts/release.js "correcao no modulo de prontuarios"
```
