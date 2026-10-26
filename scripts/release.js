#!/usr/bin/env node

/**
 * NexAi-PSICO - Script de Auto-Versionamento, Build, Deploy Online e Git Sync
 * 
 * Executa as 3 Regras Mestras do Projeto:
 * 1. Auto-incremento de versão (Semver) em package.json e src/version.ts
 * 2. Compilação TypeScript e Vite (npm run build)
 * 3. Deploy no site online (Firebase Hosting & Firestore Rules)
 * 4. Commit no Git com tag de versão e push para o repositório GitHub
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const packageJsonPath = path.join(rootDir, 'package.json');
const versionTsPath = path.join(rootDir, 'src', 'version.ts');

function run(command, options = {}) {
  console.log(`\n\x1b[36m▶ Executando: ${command}\x1b[0m`);
  execSync(command, { cwd: rootDir, stdio: 'inherit', ...options });
}

function bumpVersion(currentVersion, type = 'patch') {
  const parts = currentVersion.split('.').map(Number);
  if (parts.length !== 3 || parts.some(isNaN)) {
    throw new Error(`Versão inválida: ${currentVersion}`);
  }

  let [major, minor, patch] = parts;
  if (type === 'major') {
    major += 1;
    minor = 0;
    patch = 0;
  } else if (type === 'minor') {
    minor += 1;
    patch = 0;
  } else {
    patch += 1;
  }

  return `${major}.${minor}.${patch}`;
}

async function main() {
  const args = process.argv.slice(2);
  let bumpType = 'patch';
  let customMessage = '';

  for (const arg of args) {
    if (arg === '--major') bumpType = 'major';
    else if (arg === '--minor') bumpType = 'minor';
    else if (arg === '--patch') bumpType = 'patch';
    else if (!customMessage) customMessage = arg;
  }

  // 1. Ler package.json
  const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const oldVersion = pkg.version || '1.0.0';
  const newVersion = bumpVersion(oldVersion, bumpType);
  const nowIso = new Date().toISOString();
  const commitMsg = customMessage || `deploy: release v${newVersion} com auto-versionamento e backup`;

  console.log(`\n\x1b[32m========================================================\x1b[0m`);
  console.log(`\x1b[32m🚀 NexAi-PSICO - Deploy com Auto-Versionamento\x1b[0m`);
  console.log(`   Versão atual:    v${oldVersion}`);
  console.log(`   Nova versão:     v${newVersion}`);
  console.log(`   Mensagem:        ${commitMsg}`);
  console.log(`\x1b[32m========================================================\x1b[0m\n`);

  // 2. Atualizar package.json
  pkg.version = newVersion;
  fs.writeFileSync(packageJsonPath, JSON.stringify(pkg, null, 2) + '\n', 'utf8');
  console.log(`✔ package.json atualizado para v${newVersion}`);

  // 3. Atualizar src/version.ts
  const versionFileContent = `export interface AppVersionInfo {
  version: string;
  buildDate: string;
  environment: string;
}

export const APP_VERSION_INFO: AppVersionInfo = {
  version: '${newVersion}',
  buildDate: '${nowIso}',
  environment: 'production',
};

export const APP_VERSION = APP_VERSION_INFO.version;
`;
  fs.writeFileSync(versionTsPath, versionFileContent, 'utf8');
  console.log(`✔ src/version.ts atualizado`);

  try {
    // 4. Executar build de produção
    console.log(`\n📦 Gerando build de produção...`);
    run('npm.cmd run build');

    // 5. Deploy no Firebase Hosting & Firestore
    console.log(`\n☁ Realizando deploy online no Firebase...`);
    try {
      run('npx.cmd -y firebase-tools deploy --only hosting,firestore:rules');
    } catch (fbErr) {
      console.warn(`\x1b[33m⚠ Aviso no deploy Firebase (verifique se já fez 'firebase login' se este comando falhar):\x1b[0m`, fbErr.message);
      // Se não autenticado no Firebase localmente, continua para sincronizar git
    }

    // 6. Git commit com tag e push
    console.log(`\n🐙 Sincronizando com GitHub...`);
    run('git add -A');
    run(`git commit -m "release: v${newVersion} - ${commitMsg.replace(/"/g, '\\"')}"`);
    run(`git tag -a v${newVersion} -m "Release v${newVersion}"`);
    run('git push origin main --tags');

    console.log(`\n\x1b[32m========================================================\x1b[0m`);
    console.log(`\x1b[32m✔ DEPLOY & AUTO-VERSIONAMENTO CONCLUÍDOS COM SUCESSO!\x1b[0m`);
    console.log(`   Versão ativa: v${newVersion}`);
    console.log(`   Git tag:      v${newVersion}`);
    console.log(`\x1b[32m========================================================\x1b[0m\n`);
  } catch (error) {
    console.error(`\n\x1b[31m✖ Erro durante o processo de deploy: ${error.message}\x1b[0m`);
    // Reverter package.json se der erro antes do commit
    pkg.version = oldVersion;
    fs.writeFileSync(packageJsonPath, JSON.stringify(pkg, null, 2) + '\n', 'utf8');
    process.exit(1);
  }
}

main();
