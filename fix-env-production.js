#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 CONFIGURANDO .env PARA PRODUÇÃO...');

const envPath = path.join(__dirname, 'backend', '.env');

if (fs.existsSync(envPath)) {
  let content = fs.readFileSync(envPath, 'utf8');
  
  console.log('✅ Encontrado .env');
  
  // Atualizar para produção
  const updates = {
    'NODE_ENV=development': 'NODE_ENV=production',
    'BACKEND_URL=http://localhost:2053': 'BACKEND_URL=https://vult777.site',
    'FRONTEND_URL=http://localhost:3010': 'FRONTEND_URL=https://vult777.site',
    'ADMIN_FRONTEND_URL=http://localhost:3011': 'ADMIN_FRONTEND_URL=https://admin.vult777.site'
  };
  
  let changed = false;
  Object.entries(updates).forEach(([old, newVal]) => {
    if (content.includes(old)) {
      content = content.replace(old, newVal);
      changed = true;
      console.log(`✅ ${old} → ${newVal}`);
    }
  });
  
  if (changed) {
    fs.writeFileSync(envPath, content, 'utf8');
    console.log('✅ .env atualizado para produção!');
  } else {
    console.log('ℹ️  .env já estava correto');
  }
} else {
  console.log('❌ .env não encontrado!');
}

console.log('🎉 Configuração concluída!');
console.log('Agora reinicie o servidor: npm run server-only');
