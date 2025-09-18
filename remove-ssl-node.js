#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 REMOVENDO SSL DO NODE.JS (aaPanel gerencia HTTPS)...');

const indexPath = path.join(__dirname, 'backend', 'src', 'index.js');

if (fs.existsSync(indexPath)) {
  let content = fs.readFileSync(indexPath, 'utf8');
  
  console.log('✅ Encontrado index.js');
  
  // Remover lógica de SSL e forçar HTTP
  const newContent = content.replace(
    /\/\/ Read SSL certificates only in production[\s\S]*?} else {\s*\/\/ Create HTTP server for development\s*server = HttpServer\.createServer\(app\);\s*}/,
    `// aaPanel gerencia HTTPS, Node.js usa HTTP
    console.log(colors.yellow('Server >> Using HTTP (aaPanel handles HTTPS)...'));
    server = HttpServer.createServer(app);
    console.log(colors.green('Server >> HTTP server created successfully'));`
  );
  
  fs.writeFileSync(indexPath, newContent, 'utf8');
  console.log('✅ SSL removido do Node.js');
  console.log('✅ Agora usa HTTP na porta 2053');
  console.log('✅ aaPanel vai fazer proxy HTTPS → HTTP:2053');
} else {
  console.log('❌ index.js não encontrado!');
}

console.log('🎉 Configuração concluída!');
console.log('Agora o Node.js roda HTTP e aaPanel cuida do HTTPS');
console.log('Teste: npm run server-only');
