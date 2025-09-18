#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 VERIFICANDO E CORRIGINDO ESTRUTURA CONFIG...');

const backendDir = path.join(__dirname, 'backend');
const configDir = path.join(backendDir, 'src', 'config');
const configFile = path.join(configDir, 'index.js');

// 1. Verificar se pasta config existe
if (!fs.existsSync(configDir)) {
  console.log('❌ Pasta config não existe! Criando...');
  fs.mkdirSync(configDir, { recursive: true });
  console.log('✅ Pasta config criada!');
} else {
  console.log('✅ Pasta config existe!');
}

// 2. Verificar se arquivo index.js existe
if (!fs.existsSync(configFile)) {
  console.log('❌ Arquivo config/index.js não existe! Criando...');
  
  const configContent = `// Site configuration
module.exports = {
  site: {
    enableMaintenanceOnStart: false,
    enableLoginOnStart: true,
    backend: {
      developmentUrl: process.env.BACKEND_URL || 'http://localhost:2053',
      productionUrl: process.env.BACKEND_URL || 'https://vult777.site'
    },
    frontend: {
      developmentUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
      productionUrl: process.env.FRONTEND_URL || 'https://vult777.site'
    },
    adminFrontend: {
      developmentUrl: process.env.ADMIN_FRONTEND_URL || 'http://localhost:3001',
      productionUrl: process.env.ADMIN_FRONTEND_URL || 'https://admin.vult777.site'
    }
  },
  database: {
    productionMongoURI: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/casino_db',
    developmentMongoURI: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/casino_db'
  },
  authentication: {
    twilio: {
      accountSid: process.env.TWILIO_ACCOUNT_SID || 'ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
      authToken: process.env.TWILIO_AUTH_TOKEN || 'your_auth_token',
      verifyServiceSid: process.env.TWILIO_VERIFY_SERVICE_SID || 'VAXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
    },
    steam: {
      apiKey: process.env.STEAM_API_KEY || 'your_steam_api_key'
    },
    googleOauth: {
      clientId: process.env.GOOGLE_CLIENT_ID || 'your_google_client_id',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'your_google_client_secret'
    },
    jwtSecret: process.env.JWT_SECRET || 'seu_jwt_secret_super_seguro_123456789',
    jwtExpirationTime: process.env.JWT_EXPIRATION_TIME || '7d',
    reCaptcha: {
      secretKey: process.env.RECAPTCHA_SECRET_KEY || '6Ldw--0nAAAAAFjim4U44uy7b3f8rF83QQQhY5T'
    },
    skinsback: {
      shop_id: process.env.SKINSBACK_SHOP_ID || 'your_skinsback_shop_id',
      secret_key: process.env.SKINSBACK_SECRET_KEY || 'your_skinsback_secret_key',
      withdrawFee: process.env.SKINSBACK_WITHDRAW_FEE || 10,
      withdrawMinItemPrice: process.env.SKINSBACK_WITHDRAW_MIN_ITEM_PRICE || 0.05
    }
  },
  games: {
    vip: {
      numLevels: process.env.VIP_NUM_LEVELS || 10,
      minWager: process.env.VIP_MIN_WAGER || 100,
      maxWager: process.env.VIP_MAX_WAGER || 1000000,
      rakeback: process.env.VIP_RAKEBACK || 10,
      vipLevelNAME: process.env.VIP_LEVEL_NAMES ? process.env.VIP_LEVEL_NAMES.split(',') : ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Master', 'Grandmaster', 'Legend', 'Mythic', 'Immortal'],
      vipLevelCOLORS: process.env.VIP_LEVEL_COLORS ? process.env.VIP_LEVEL_COLORS.split(',') : ['#CD7F32', '#C0C0C0', '#FFD700', '#E5E4E2', '#B9F2FF', '#8A2BE2', '#FF4500', '#FF0000', '#0000FF', '#9400D3']
    },
    jackpot: {
      waitingTime: process.env.JACKPOT_WAITING_TIME || 30,
      AnimationDuration: process.env.JACKPOT_ANIMATION_DURATION || 10000
    },
    roulette: {
      waitingTime: process.env.ROULETTE_WAITING_TIME || 30,
      AnimationDuration: process.env.ROULETTE_ANIMATION_DURATION || 5500,
      AnimationDurationTotal: process.env.ROULETTE_ANIMATION_DURATION_TOTAL || 11500
    },
    shuffle: {
      waitingTime: process.env.SHUFFLE_WAITING_TIME || 30
    },
    crash: {
      houseEdge: process.env.CRASH_HOUSE_EDGE || 0.05
    }
  },
  blochain: {
    httpProviderApi: process.env.BLOCKCHAIN_HTTP_PROVIDER || 'https://eos.greymass.com'
  }
};`;

  fs.writeFileSync(configFile, configContent, 'utf8');
  console.log('✅ Arquivo config/index.js criado!');
} else {
  console.log('✅ Arquivo config/index.js existe!');
}

// 3. Verificar se items.json existe (usado por alguns routes)
const itemsFile = path.join(configDir, 'items.json');
if (!fs.existsSync(itemsFile)) {
  console.log('❌ Arquivo items.json não existe! Criando...');
  fs.writeFileSync(itemsFile, '{}', 'utf8');
  console.log('✅ Arquivo items.json criado!');
} else {
  console.log('✅ Arquivo items.json existe!');
}

// 4. Verificar se items.js existe
const itemsJsFile = path.join(configDir, 'items.js');
if (!fs.existsSync(itemsJsFile)) {
  console.log('❌ Arquivo items.js não existe! Criando...');
  const itemsJsContent = `// Items configuration
module.exports = {
  // Add your items configuration here
};`;
  fs.writeFileSync(itemsJsFile, itemsJsContent, 'utf8');
  console.log('✅ Arquivo items.js criado!');
} else {
  console.log('✅ Arquivo items.js existe!');
}

console.log('🎉 Verificação concluída!');
console.log('📁 Estrutura criada:');
console.log('   backend/src/config/');
console.log('   ├── index.js');
console.log('   ├── items.js');
console.log('   └── items.json');
console.log('');
console.log('Agora tente rodar: npm run server-only');
