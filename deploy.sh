#!/bin/bash

# Script de Deploy para aaPanel
# Execute como: bash deploy.sh

echo "🚀 Iniciando deploy do Casino..."

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Função para log
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

error() {
    echo -e "${RED}[ERROR] $1${NC}"
}

warning() {
    echo -e "${YELLOW}[WARNING] $1${NC}"
}

# Verificar se está no diretório correto
if [ ! -f "package.json" ]; then
    error "Execute este script na raiz do projeto!"
    exit 1
fi

log "Verificando dependências..."

# Verificar Node.js
if ! command -v node &> /dev/null; then
    error "Node.js não encontrado! Instale pelo aaPanel."
    exit 1
fi

# Verificar PM2
if ! command -v pm2 &> /dev/null; then
    error "PM2 não encontrado! Instale: npm install -g pm2"
    exit 1
fi

log "Node.js versão: $(node --version)"
log "PM2 versão: $(pm2 --version)"

# Parar aplicação se estiver rodando
log "Parando aplicação anterior..."
pm2 stop casino-backend 2>/dev/null || true

# Instalar dependências do backend
log "Instalando dependências do backend..."
cd backend
npm install --production
if [ $? -ne 0 ]; then
    error "Falha ao instalar dependências do backend!"
    exit 1
fi
cd ..

# Build do frontend
log "Fazendo build do frontend..."
cd frontend
npm install
npm run build
if [ $? -ne 0 ]; then
    error "Falha no build do frontend!"
    exit 1
fi
cd ..

# Verificar arquivo .env
if [ ! -f "backend/.env" ]; then
    warning "Arquivo .env não encontrado!"
    log "Criando .env a partir do exemplo..."
    cp backend/.env.example backend/.env 2>/dev/null || true
    warning "Configure o arquivo backend/.env antes de continuar!"
fi

# Criar diretório de logs
mkdir -p logs

# Iniciar aplicação com PM2
log "Iniciando aplicação com PM2..."
pm2 start ecosystem.config.js
if [ $? -ne 0 ]; then
    error "Falha ao iniciar aplicação!"
    exit 1
fi

# Salvar configuração PM2
pm2 save

# Configurar PM2 para iniciar no boot (apenas uma vez)
if [ ! -f "/etc/systemd/system/pm2-root.service" ]; then
    log "Configurando PM2 para iniciar no boot..."
    pm2 startup
    warning "Execute o comando mostrado acima como root!"
fi

log "✅ Deploy concluído com sucesso!"
log "📊 Status da aplicação:"
pm2 status

log "📝 Para verificar logs:"
log "   pm2 logs casino-backend"

log "🌐 Configure o Nginx no aaPanel conforme o guia em deploy-guide.md"

warning "⚠️  Não esqueça de:"
warning "   1. Configurar o arquivo backend/.env"
warning "   2. Configurar Nginx no aaPanel"
warning "   3. Configurar SSL/HTTPS"
warning "   4. Configurar firewall"
