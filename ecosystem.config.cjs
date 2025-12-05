  module.exports = {
    apps: [
      {
        name: 'my-next-app', // 应用名称
        script: 'npm',        // 启动脚本（用 npm 命令启动）
        args: 'start',        // npm 的参数（即 npm start）
        cwd: '/var/www/my-next-app', // 工作目录
        env: {
          NODE_ENV: 'production', // 环境变量，生产环境
          PORT: 3000              // 端口号
        },
        env_development: {
          NODE_ENV: 'development', // 开发环境变量
          PORT: 3000
        },
        instances: 1,             // 实例数，1 表示单进程（可改为 'max' 多核）
        autorestart: true,        // 自动重启
        watch: false,             // 是否监听文件变动自动重启
        max_memory_restart: '1G', // 超过 1G 内存自动重启
        error_file: '/var/log/pm2/my-app-error.log', // 错误日志文件
        out_file: '/var/log/pm2/my-app-out.log',     // 普通输出日志
        log_file: '/var/log/pm2/my-app.log',         // 合并日志
        time: true,               // 日志显示时间戳
        merge_logs: true,         // 多实例时合并日志
        pid_file: '/var/run/pm2-my-app.pid', // 进程号文件
        min_uptime: '60s',        // 最短运行时间（防止频繁重启）
        max_restarts: 10,         // 最大重启次数
        restart_delay: 5000,      // 重启间隔（毫秒）
        exec_mode: 'fork',        // 启动模式（fork 或 cluster）
      }
    ]
  };