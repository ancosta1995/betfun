#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 CORRIGINDO IMPORTS DOS CONTROLLERS...');

// Função para corrigir imports em um arquivo
function fixControllerImports(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;

    // Para arquivos em controllers/ e middleware/, usar ../config
    // Para arquivos em routes/, usar ../config  
    // Para arquivos em routes/auth/, usar ../../config
    // Para arquivos em routes/external/v1/, usar ../../../config

    if (content.includes('require("./config")')) {
      const relativePath = path.relative(path.join(__dirname, 'backend', 'src'), filePath);
      
      let newImport = '';
      if (relativePath.startsWith('controllers/') || relativePath.startsWith('middleware/') || relativePath.startsWith('utils/')) {
        newImport = 'require("../config")';
      } else if (relativePath.startsWith('routes/auth/')) {
        newImport = 'require("../../config")';
      } else if (relativePath.startsWith('routes/external/v1/')) {
        newImport = 'require("../../../config")';
      } else if (relativePath.startsWith('routes/')) {
        newImport = 'require("../config")';
      } else {
        // Arquivo na raiz de src/
        newImport = 'require("./config")';
      }

      content = content.replace(/require\("\.\/config"\)/g, newImport);
      changed = true;
      
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ ${relativePath} → ${newImport}`);
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

jsFiles.forEach(fixControllerImports);

console.log('🎉 Correção concluída!');
console.log('Agora tente rodar: npm run server-only');
