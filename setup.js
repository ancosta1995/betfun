#!/usr/bin/env node

const { spawn, execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 SETUP AUTOMÁTICO DO CASINO');
console.log('===============================');

// Função para executar comandos
function runCommand(command, cwd = process.cwd()) {
  console.log(`📦 Executando: ${command}`);
  try {
    execSync(command, { cwd, stdio: 'inherit' });
    console.log('✅ Sucesso!\n');
    return true;
  } catch (error) {
    console.log(`❌ Erro: ${error.message}\n`);
    return false;
  }
}

// Função para executar comandos que podem falhar
function runCommandSafe(command, cwd = process.cwd()) {
  console.log(`📦 Executando: ${command}`);
  try {
    execSync(command, { cwd, stdio: 'inherit' });
    console.log('✅ Sucesso!\n');
    return true;
  } catch (error) {
    console.log(`⚠️ Falhou: ${error.message}\n`);
    return false;
  }
}

// 1. Instalar dependências do backend
console.log('1️⃣ Instalando dependências do BACKEND...');
if (!runCommand('npm install', path.join(__dirname, 'backend'))) {
  process.exit(1);
}

// 2. Instalar dependências do frontend
console.log('2️⃣ Instalando dependências do FRONTEND...');
if (!runCommand('npm run install:linux', path.join(__dirname, 'frontend'))) {
  process.exit(1);
}

// 3. Fazer build do frontend
console.log('3️⃣ Fazendo BUILD do FRONTEND...');
const buildSuccess = runCommandSafe('npm run build:linux', path.join(__dirname, 'frontend'));

if (!buildSuccess) {
  console.log('⚠️  Build com versioning falhou, tentando build simples...');
  if (!runCommand('npm run build:simple', path.join(__dirname, 'frontend'))) {
    process.exit(1);
  }
}

// 4. Verificar se .env existe
const envPath = path.join(__dirname, 'backend', '.env');
if (!fs.existsSync(envPath)) {
  console.log('4️⃣ Criando arquivo .env...');
  const envContent = `NODE_ENV=development
PORT=2053
MONGODB_URI=mongodb://localhost:27017/casino_db
JWT_SECRET=seu_jwt_secret_super_seguro_123456789
FRONTEND_URL=http://localhost:2053
`;
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Arquivo .env criado!\n');
} else {
  console.log('4️⃣ Arquivo .env já existe!\n');
}

console.log('🎉 SETUP CONCLUÍDO!');
console.log('==================');
console.log('');
console.log('Para iniciar o servidor:');
console.log('  npm run server');
console.log('');
console.log('O casino estará disponível em: http://localhost:2053');
console.log('- Frontend: http://localhost:2053');
console.log('- API: http://localhost:2053/api/');
console.log('');
console.log('⚠️  Certifique-se que o MongoDB está rodando!');
