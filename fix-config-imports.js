#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 CORRIGINDO IMPORTS DO CONFIG...');

// Função para corrigir imports em um arquivo
function fixConfigImports(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;

    // Diferentes padrões de import para corrigir
    const patterns = [
      {
        old: 'require("../config")',
        new: 'require("./config")'
      },
      {
        old: "require('../config')",
        new: "require('./config')"
      },
      {
        old: 'require("../../config")',
        new: 'require("../config")'
      },
      {
        old: "require('../../config')",
        new: "require('../config')"
      },
      {
        old: 'require("../../../config")',
        new: 'require("../../config")'
      },
      {
        old: "require('../../../config')",
        new: "require('../../config')"
      }
    ];

    // Aplicar correções baseadas na localização do arquivo
    const relativePath = path.relative(path.join(__dirname, 'backend'), filePath);
    
    patterns.forEach(pattern => {
      if (content.includes(pattern.old)) {
        content = content.replace(new RegExp(pattern.old.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), pattern.new);
        changed = true;
      }
    });

    if (changed) {
      fs.writeFileSync(filePath, content, 'utf8');
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
      // Recursão para subdiretórios
      results = results.concat(findJSFiles(filePath));
    } else if (path.extname(file) === '.js') {
      results.push(filePath);
    }
  });
  
  return results;
}

// Corrigir todos os arquivos no backend
const backendDir = path.join(__dirname, 'backend', 'src');
const jsFiles = findJSFiles(backendDir);

console.log(`Encontrados ${jsFiles.length} arquivos .js`);

jsFiles.forEach(fixConfigImports);

console.log('🎉 Correção concluída!');
console.log('Agora tente rodar: npm run server-only');
