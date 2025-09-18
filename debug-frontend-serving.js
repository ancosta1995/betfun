#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 DEBUG: VERIFICANDO FRONTEND BUILD...');

const paths = [
  '/www/wwwroot/vult777.site/frontend/build',
  '/www/wwwroot/vult777.site/frontend/build/index.html',
  '/www/wwwroot/vult777.site/frontend/build/static',
];

console.log('📍 Verificando caminhos do build...\n');

paths.forEach(checkPath => {
  const exists = fs.existsSync(checkPath);
  console.log(`${exists ? '✅' : '❌'} ${checkPath}`);
  
  if (exists) {
    const stat = fs.statSync(checkPath);
    if (stat.isDirectory()) {
      console.log(`   📁 Diretório com ${fs.readdirSync(checkPath).length} itens`);
    } else {
      console.log(`   📄 Arquivo (${(stat.size / 1024).toFixed(1)}KB)`);
    }
  }
});

// Verificar estrutura do express-app.js
console.log('\n🔍 Verificando express-app.js...');
const expressAppPath = path.join(__dirname, 'backend', 'src', 'controllers', 'express-app.js');

if (fs.existsSync(expressAppPath)) {
  const content = fs.readFileSync(expressAppPath, 'utf8');
  
  console.log('✅ express-app.js encontrado');
  
  // Verificar se tem configuração para servir arquivos estáticos
  if (content.includes('express.static')) {
    console.log('✅ express.static configurado');
    
    // Extrair o caminho
    const staticMatch = content.match(/express\.static\(([^)]+)\)/);
    if (staticMatch) {
      console.log(`   Caminho: ${staticMatch[1]}`);
    }
  } else {
    console.log('❌ express.static NÃO configurado!');
  }
  
  // Verificar se tem fallback para index.html
  if (content.includes('index.html')) {
    console.log('✅ Fallback para index.html configurado');
  } else {
    console.log('❌ Fallback para index.html NÃO configurado!');
  }
} else {
  console.log('❌ express-app.js não encontrado!');
}

// Simular request para /
console.log('\n🎯 DIAGNÓSTICO:');
console.log('Quando você acessa https://vult777.site/');
console.log('1. Apache faz proxy para http://localhost:2053/');
console.log('2. Node.js tenta servir arquivos estáticos de: frontend/build/');
console.log('3. Se não encontrar, deveria servir: frontend/build/index.html');
console.log('4. Mas está retornando a API response...');
console.log('\nPossíveis problemas:');
console.log('- Caminho do build incorreto no código');
console.log('- Build não está na localização esperada');
console.log('- Middleware de static files não configurado corretamente');
