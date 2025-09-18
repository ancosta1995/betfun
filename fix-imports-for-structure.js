#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 CORRIGINDO IMPORTS PARA ESTRUTURA backend/src/...');

// Função para corrigir imports em um arquivo
function fixConfigImports(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;

    // Todos os arquivos em src/ devem usar "./config" pois o node está rodando DE DENTRO do src/
    const patterns = [
      'require("./config")',
      "require('./config')",
      'require("../config")', 
      "require('../config')",
      'require("../../config")',
      "require('../../config')"
    ];

    patterns.forEach(pattern => {
      if (content.includes(pattern)) {
        content = content.replace(new RegExp(pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), 'require("./config")');
        changed = true;
      }
    });

    if (changed) {
      fs.writeFileSync(filePath, content, 'utf8');
      const relativePath = path.relative(path.join(__dirname, 'backend'), filePath);
      console.log(`✅ Corrigido: ${relativePath}`);
    }

  } catch (error) {
    console.log(`❌ Erro ao corrigir ${filePath}: ${error.message}`);
  }
}

// Função para encontrar todos os arquivos .js recursivamente
function findJSFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat && stat.isDirectory()) {
      results = results.concat(findJSFiles(filePath));
    } else if (path.extname(file) === '.js') {
      results.push(filePath);
    }
  });
  
  return results;
}

// Corrigir todos os arquivos no backend/src
const backendDir = path.join(__dirname, 'backend', 'src');
const jsFiles = findJSFiles(backendDir);

console.log(`Encontrados ${jsFiles.length} arquivos .js`);

jsFiles.forEach(fixConfigImports);

console.log('🎉 Correção concluída!');
console.log('Todos os imports agora usam require("./config")');
console.log('Agora tente rodar: npm run server-only');
