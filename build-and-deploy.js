#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 BUILD LOCAL + DEPLOY AUTOMÁTICO');
console.log('====================================');

// Cores para output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function log(message, color = 'green') {
  console.log(`${colors[color]}✅ ${message}${colors.reset}`);
}

function error(message) {
  console.log(`${colors.red}❌ ${message}${colors.reset}`);
}

function warning(message) {
  console.log(`${colors.yellow}⚠️  ${message}${colors.reset}`);
}

function info(message) {
  console.log(`${colors.blue}ℹ️  ${message}${colors.reset}`);
}

try {
  // 1. Verificar se estamos no diretório correto
  if (!fs.existsSync('frontend') || !fs.existsSync('backend')) {
    error('Execute este script na raiz do projeto!');
    process.exit(1);
  }

  // 2. Instalar dependências do frontend (se necessário)
  info('Verificando dependências do frontend...');
  if (!fs.existsSync('frontend/node_modules')) {
    log('Instalando dependências do frontend...');
    execSync('npm install --legacy-peer-deps', { 
      cwd: 'frontend', 
      stdio: 'inherit' 
    });
  } else {
    log('Dependências já instaladas!');
  }

  // 3. Fazer build do frontend
  log('Fazendo build do frontend...');
  execSync('npm run build', { 
    cwd: 'frontend', 
    stdio: 'inherit' 
  });

  // 4. Verificar se build foi criado
  if (!fs.existsSync('frontend/build')) {
    error('Build falhou! Pasta build não foi criada.');
    process.exit(1);
  }

  log('Build criado com sucesso!');

  // 5. Preparar para deploy
  info('Pasta frontend/build está pronta para deploy!');
  
  console.log('\n📋 INSTRUÇÕES PARA DEPLOY:');
  console.log('==========================');
  console.log('1. Comprimir a pasta frontend/build/');
  console.log('2. Fazer upload para o servidor');
  console.log('3. Extrair na pasta do projeto');
  console.log('4. Rodar: npm run server');
  console.log('\n🎉 Seu casino estará rodando!');

} catch (error) {
  console.error(`${colors.red}❌ Erro durante o build:${colors.reset}`, error.message);
  process.exit(1);
}
