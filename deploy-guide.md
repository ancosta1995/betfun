# 🚀 Guia de Deploy - Casino no aaPanel

## 📋 Pré-requisitos no aaPanel

### 1. Instalar Node.js
- No aaPanel: **Painel** → **Gerenciador de Software** → **Runtime Environment**
- Instalar **Node.js** (versão 18+ recomendada)
- Instalar **PM2** (para gerenciar o processo)

### 2. Instalar MongoDB
- **Gerenciador de Software** → **Database** → **MongoDB**
- Ou usar MongoDB Atlas (recomendado para produção)

### 3. Configurar Nginx
- Nginx já vem instalado com aaPanel

## 🔧 Passos para Deploy

### Passo 1: Fazer Upload dos Arquivos
1. Comprimir seu projeto: `casino.zip`
2. No aaPanel: **Arquivos** → **Gerenciador de Arquivos**
3. Navegar para `/www/wwwroot/seudominio.com/`
4. Fazer upload e extrair o arquivo

### Passo 2: Configurar Variáveis de Ambiente
```bash
# No terminal do aaPanel ou SSH
cd /www/wwwroot/seudominio.com/backend
cp .env.example .env
nano .env
```

Editar o arquivo `.env` com suas configurações:
```env
NODE_ENV=production
PORT=2053
MONGODB_URI=mongodb://localhost:27017/casino_db
JWT_SECRET=seu_jwt_secret_super_seguro_aqui
FRONTEND_URL=https://seudominio.com
```

### Passo 3: Instalar Dependências
```bash
# Backend
cd /www/wwwroot/seudominio.com/backend
npm install --production

# Frontend (build)
cd /www/wwwroot/seudominio.com/frontend
npm install
npm run build
```

### Passo 4: Configurar PM2
```bash
cd /www/wwwroot/seudominio.com
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### Passo 5: Configurar Nginx

No aaPanel: **Site** → **Seu Domínio** → **Configurações** → **Rewrite**

Adicionar esta configuração:

```nginx
# Servir arquivos estáticos do frontend
location / {
    try_files $uri $uri/ /index.html;
    root /www/wwwroot/seudominio.com/frontend/build;
    index index.html;
}

# Proxy para API do backend
location /api/ {
    proxy_pass http://127.0.0.1:2053;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;
    proxy_read_timeout 300s;
    proxy_connect_timeout 75s;
}

# WebSocket para Socket.IO
location /socket.io/ {
    proxy_pass http://127.0.0.1:2053;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}

# Cache para assets estáticos
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
    root /www/wwwroot/seudominio.com/frontend/build;
}
```

### Passo 6: Configurar SSL
1. No aaPanel: **Site** → **Seu Domínio** → **SSL**
2. Usar **Let's Encrypt** (gratuito) ou fazer upload do seu certificado
3. Ativar **Force HTTPS**

### Passo 7: Configurar Firewall
No aaPanel: **Segurança** → **Firewall**
- Liberar porta **80** (HTTP)
- Liberar porta **443** (HTTPS)
- **NÃO** expor porta **2053** publicamente (só localhost)

## ✅ Verificações Finais

### 1. Testar Backend
```bash
curl http://localhost:2053/api/site
```

### 2. Verificar PM2
```bash
pm2 status
pm2 logs casino-backend
```

### 3. Verificar Nginx
```bash
nginx -t
systemctl reload nginx
```

### 4. Testar Frontend
Acesse: `https://seudominio.com`

## 🔄 Comandos Úteis para Manutenção

```bash
# Reiniciar aplicação
pm2 restart casino-backend

# Ver logs
pm2 logs casino-backend

# Parar aplicação
pm2 stop casino-backend

# Atualizar aplicação
cd /www/wwwroot/seudominio.com
git pull  # se usar Git
pm2 restart casino-backend

# Rebuild frontend
cd frontend
npm run build
```

## 🚨 Troubleshooting

### Backend não inicia:
1. Verificar logs: `pm2 logs casino-backend`
2. Verificar arquivo `.env`
3. Verificar se MongoDB está rodando

### Frontend não carrega:
1. Verificar se build foi criado: `ls frontend/build/`
2. Verificar configuração Nginx
3. Verificar logs do Nginx: `/www/wwwlogs/seudominio.com.log`

### API não responde:
1. Verificar se PM2 está rodando: `pm2 status`
2. Verificar firewall interno
3. Testar diretamente: `curl http://localhost:2053/api/site`

## 📊 Monitoramento

Configure no aaPanel:
- **Monitor** → **System Monitor** para CPU/RAM
- **Monitor** → **Process Monitor** para PM2
- **Logs** → **Access Logs** para traffic
