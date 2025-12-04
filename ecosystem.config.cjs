  module.exports = {
    apps: [{
      name: 'my-next-app',
      script: 'npm',
      args: 'start',
      cwd: '/var/www/my-next-app',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      error_file: '/var/log/pm2/my-app-error.log',
      out_file: '/var/log/pm2/my-app-out.log',
      log_file: '/var/log/pm2/my-app.log',
      time: true
    }]
  };