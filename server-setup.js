#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🖥️  SETUP SERVIDOR (SEM BUILD)');
console.log('==============================');

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

// 1. Instalar dependências do backend
console.log('1️⃣ Instalando dependências do BACKEND...');
if (!runCommand('npm install', path.join(__dirname, 'backend'))) {
  process.exit(1);
}

// 2. Verificar se frontend/build existe
console.log('2️⃣ Verificando build do FRONTEND...');
const buildPath = path.join(__dirname, 'frontend', 'build');
if (!fs.existsSync(buildPath)) {
  console.log('❌ Pasta frontend/build não encontrada!');
  console.log('💡 Você precisa fazer o build local primeiro:');
  console.log('   1. No seu PC: npm run build-local');
  console.log('   2. Upload da pasta frontend/build/');
  console.log('   3. Rodar este script novamente');
  process.exit(1);
}
console.log('✅ Build do frontend encontrado!');

// 3. Verificar se .env existe
console.log('3️⃣ Verificando arquivo .env...');
const envPath = path.join(__dirname, 'backend', '.env');
if (!fs.existsSync(envPath)) {
  console.log('4️⃣ Criando arquivo .env...');
  const envContent = `NODE_ENV=production
PORT=2053
MONGODB_URI=mongodb://localhost:27017/casino_db
JWT_SECRET=seu_jwt_secret_super_seguro_123456789
FRONTEND_URL=http://localhost:2053
`;
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Arquivo .env criado!\n');
} else {
  console.log('✅ Arquivo .env já existe!\n');
}

console.log('🎉 SETUP CONCLUÍDO!');
console.log('==================');
console.log('');
console.log('Para iniciar o casino:');
console.log('  npm run server-only');
console.log('');
console.log('O casino estará disponível em: http://localhost:2053');
console.log('- Frontend: http://localhost:2053');
console.log('- API: http://localhost:2053/api/');
console.log('');
console.log('⚠️  Certifique-se que o MongoDB está rodando!');
