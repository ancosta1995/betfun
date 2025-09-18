#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 CORRIGINDO IMPORTS DOS GAMES (SUBPASTA)...');

function fixGameImports(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;

    const relativePath = path.relative(path.join(__dirname, 'backend', 'src'), filePath);
    
    // Para arquivos em controllers/games/, usar ../../config
    if (relativePath.startsWith('controllers/games/')) {
      if (content.includes('require("../config")')) {
        content = content.replace(/require\("\.\.\/(config[^"]*?)"\)/g, 'require("../../$1")');
        changed = true;
        console.log(`✅ ${relativePath} → require("../../config")`);
      }
    }

    if (changed) {
      fs.writeFileSync(filePath, content, 'utf8');
    }

  } catch (error) {
    console.log(`❌ Erro: ${error.message}`);
  }
}

// Encontrar todos os arquivos em controllers/games/
const gamesDir = path.join(__dirname, 'backend', 'src', 'controllers', 'games');
if (fs.existsSync(gamesDir)) {
  const gameFiles = fs.readdirSync(gamesDir)
    .filter(file => file.endsWith('.js'))
    .map(file => path.join(gamesDir, file));

  console.log(`Corrigindo ${gameFiles.length} arquivos em controllers/games/`);
  gameFiles.forEach(fixGameImports);
} else {
  console.log('❌ Pasta controllers/games não encontrada!');
}

console.log('🎉 Correção dos games concluída!');
console.log('Agora tente rodar: npm run server-only');
