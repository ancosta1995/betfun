#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 DEBUG: VERIFICANDO ONDE ESTÁ O CONFIG...');

const locations = [
  './config',
  './config/index.js',
  '../config',
  '../config/index.js',
  './backend/src/config',
  './backend/src/config/index.js',
  path.join(__dirname, 'backend', 'src', 'config'),
  path.join(__dirname, 'backend', 'src', 'config', 'index.js'),
];

console.log('📍 Diretório atual:', __dirname);
console.log('');

locations.forEach(location => {
  const fullPath = path.resolve(location);
  const exists = fs.existsSync(fullPath);
  const type = exists ? (fs.statSync(fullPath).isDirectory() ? 'DIR' : 'FILE') : 'MISSING';
  
  console.log(`${exists ? '✅' : '❌'} ${type.padEnd(7)} ${location}`);
  console.log(`   → ${fullPath}`);
});

// Verificar estrutura do backend/src
console.log('\n📁 Conteúdo de backend/src/:');
const backendSrcPath = path.join(__dirname, 'backend', 'src');
if (fs.existsSync(backendSrcPath)) {
  const items = fs.readdirSync(backendSrcPath);
  items.forEach(item => {
    const itemPath = path.join(backendSrcPath, item);
    const isDir = fs.statSync(itemPath).isDirectory();
    console.log(`   ${isDir ? '📁' : '📄'} ${item}`);
  });
} else {
  console.log('   ❌ backend/src não existe!');
}

// Verificar de onde o Node está tentando importar
console.log('\n🎯 Simulando require("./config") de backend/src/controllers/:');
const fromController = path.join(__dirname, 'backend', 'src', 'controllers');
const configFromController = path.resolve(fromController, './config');
console.log(`   Tentando: ${configFromController}`);
console.log(`   Existe: ${fs.existsSync(configFromController) ? '✅' : '❌'}`);

console.log('\n🎯 Simulando require("./config") de backend/src/:');
const fromSrc = path.join(__dirname, 'backend', 'src');
const configFromSrc = path.resolve(fromSrc, './config');
console.log(`   Tentando: ${configFromSrc}`);
console.log(`   Existe: ${fs.existsSync(configFromSrc) ? '✅' : '❌'}`);

console.log('\n📋 RESUMO:');
console.log('1. Node executa de: backend/src/');
console.log('2. Controllers fazem: require("./config")');
console.log('3. Deveria encontrar: backend/src/config/');
console.log('4. Vamos verificar se existe...');
