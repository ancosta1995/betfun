module.exports = {
  apps: [
    {
      name: 'casino-backend',
      script: './backend/src/index.js',
      cwd: '/www/wwwroot/seudominio.com', // Mude para o caminho do seu site
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 2053
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 2053
      },
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_file: './logs/combined.log',
      time: true
    }
  ]
};
