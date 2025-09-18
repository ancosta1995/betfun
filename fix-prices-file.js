#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 CORRIGINDO LOCALIZAÇÃO DO PRICES.JSON...');

// 1. Verificar se Prices.json existe no backend/
const pricesOriginal = path.join(__dirname, 'backend', 'Prices.json');
const pricesTarget = path.join(__dirname, 'backend', 'src', 'Prices.json');

if (fs.existsSync(pricesOriginal)) {
  console.log('✅ Encontrado Prices.json em backend/');
  
  // Copiar para backend/src/
  const pricesContent = fs.readFileSync(pricesOriginal, 'utf8');
  fs.writeFileSync(pricesTarget, pricesContent, 'utf8');
  console.log('✅ Copiado para backend/src/Prices.json');
  
} else {
  console.log('❌ Prices.json não encontrado em backend/');
  console.log('⚡ Criando Prices.json básico...');
  
  const basicPrices = {
    "BTC": {
      "USD": 57936.13,
      "EUR": 52632.17,
      "BRL": 327669.71
    },
    "ETH": {
      "USD": 2359.64,
      "EUR": 2142.92,
      "BRL": 13342.36
    },
    "USDT": {
      "USD": 1,
      "EUR": 0.9085,
      "BRL": 5.658
    },
    "USD": {
      "USD": 1,
      "EUR": 0.91,
      "BRL": 4.97
    }
  };
  
  fs.writeFileSync(pricesTarget, JSON.stringify(basicPrices, null, 2), 'utf8');
  console.log('✅ Prices.json básico criado!');
}

// 2. Corrigir imports de Prices.json
function fixPricesImports(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      fixPricesImports(filePath);
    } else if (file.endsWith('.js')) {
      try {
        let content = fs.readFileSync(filePath, 'utf8');
        let changed = false;
        
        // Corrigir caminhos para Prices.json
        const patterns = [
          { old: "fs.readFileSync('Prices.json')", new: "fs.readFileSync('./Prices.json')" },
          { old: "fs.readFileSync('../../Prices.json')", new: "fs.readFileSync('../Prices.json')" },
          { old: "require('Prices.json')", new: "require('./Prices.json')" },
          { old: "require('../../Prices.json')", new: "require('../Prices.json')" }
        ];
        
        patterns.forEach(pattern => {
          if (content.includes(pattern.old)) {
            content = content.replace(new RegExp(pattern.old.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), pattern.new);
            changed = true;
          }
        });
        
        if (changed) {
          fs.writeFileSync(filePath, content, 'utf8');
          const relativePath = path.relative(path.join(__dirname, 'backend', 'src'), filePath);
          console.log(`✅ Corrigido: ${relativePath}`);
        }
      } catch (error) {
        // Ignorar erros de leitura
      }
    }
  });
}

console.log('🔧 Corrigindo imports de Prices.json...');
const backendSrc = path.join(__dirname, 'backend', 'src');
fixPricesImports(backendSrc);

console.log('🎉 Prices.json configurado!');
console.log('Agora tente rodar: npm run server-only');
