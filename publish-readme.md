# 项目部署指南 - 阿里云服务器

本文档详细说明如何将 Next.js + MongoDB 项目部署到阿里云服务器上。

## 项目技术栈分析

- **前端框架**: Next.js 16.0.6 (React 19.2.0)
- **后端**: Next.js API Routes
- **数据库**: MongoDB (使用 Mongoose ODM)
- **语言**: TypeScript
- **样式**: TailwindCSS v4
- **认证**: JWT + bcryptjs
- **部署工具**: PM2 + Nginx

## 1. 服务器环境配置

### 1.1 购买和初始化服务器

```bash
# 更新系统
sudo apt update && sudo apt upgrade -y

# 安装必要工具
sudo apt install -y curl wget git vim ufw
```

### 1.2 配置防火墙

```bash
# 启用防火墙
sudo ufw enable

# 允许SSH
sudo ufw allow ssh

# 允许HTTP和HTTPS
sudo ufw allow 80
sudo ufw allow 443

# 允许自定义端口（可选，如果你使用不同的端口）
sudo ufw allow 3000

# 查看防火墙状态
sudo ufw status
```

### 1.3 安装 Node.js

```bash
# 安装Node.js 20.x (推荐LTS版本)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 验证安装
node --version
npm --version

# 安装PM2
sudo npm install -g pm2

# 安装yarn（可选，项目使用npm）
sudo npm install -g yarn
```

### 1.4 安装Nginx

```bash
# 安装Nginx
sudo apt install -y nginx

# 启动并设置开机自启
sudo systemctl start nginx
sudo systemctl enable nginx

# 检查Nginx状态
sudo systemctl status nginx

# 测试Nginx
curl http://localhost
```

## 2. 数据库安装配置

### 2.1 创建 Repo 文件
```bash
sudo vi /etc/yum.repos.d/mongodb-org-6.0.repo

粘贴下面内容：
[mongodb-org-6.0]
name=MongoDB Repository
baseurl=https://repo.mongodb.org/yum/redhat/8/mongodb-org/6.0/x86_64/
gpgcheck=1
enabled=1
gpgkey=https://www.mongodb.org/static/pgp/server-6.0.asc

```
### 2.2 安装
```bash
sudo yum install -y mongodb-org
```
### 2.2 启动
```bash
sudo systemctl start mongod
sudo systemctl enable mongod
```

### 2.3 配置MongoDB

```bash
# 编辑MongoDB配置文件
sudo vim /etc/mongod.conf

# 修改以下配置：
# security:
#   authorization: enabled

# 修改bindIp（允许外部连接，生产环境建议使用127.0.0.1 + 防火墙规则）
net:
  port: 27017
  bindIp: 127.0.0.1

# 重启MongoDB
sudo systemctl restart mongod
```

### 2.4 创建数据库用户

```bash
# 连接到MongoDB
mongosh

# 切换到admin数据库
use admin

# 创建管理员用户
db.createUser({
  user: "admin",
  pwd: "your_strong_password",
  roles: ["userAdminAnyDatabase", "dbAdminAnyDatabase", "readWriteAnyDatabase"]
})

# 切换到应用数据库
use my-auth-app

# 创建应用专用用户
db.createUser({
  user: "app_user",
  pwd: "your_app_password",
  roles: ["readWrite"]
})

exit
```

## 3. 项目部署

### 3.1 克隆项目

```bash
# 创建项目目录
sudo mkdir -p /var/www
cd /var/www

# 克隆项目（替换为你的Git仓库地址）
sudo git clone https://github.com/your-username/my-app.git
sudo chown -R $USER:$USER /var/www/my-app
cd /var/www/my-app
```

### 3.2 安装依赖和构建

```bash
# 安装依赖
npm install
```

### 3.3 配置环境变量

创建 `.env.local` （开发环境）和 `.env.production` （生产环境）文件：

**.env.production:**

```env
# 数据库连接（使用之前创建的用户）
MONGODB_URI=mongodb://app_user:your_app_password@localhost:27017/my-app?authSource=admin

# JWT密钥（生成一个强密钥）
JWT_SECRET=your_super_secret_jwt_key_at_least_32_characters_long

# 应用配置
NODE_ENV=production
NEXT_PUBLIC_API_BASE_URL=https://your-domain.com
PORT=3000

# 可选：如果使用OAuth或其他认证方式
# GITHUB_ID=xxxx
# GITHUB_SECRET=xxxx
```

**.env.local:**（开发环境）

```env
MONGODB_URI=mongodb://localhost:27017/my-app
JWT_SECRET=dev_jwt_secret_key_change_in_production
NODE_ENV=development
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
PORT=3000
```

生成JWT密钥：
```bash
# 生成随机密钥
openssl rand -base64 32
```

### 3.4 构建项目

```bash
# 构建生产版本
npm run build

# 测试构建是否成功
npm start
```

按 `Ctrl+C` 停止测试服务器。

## 4. PM2配置

### 4.1 创建PM2配置文件

在项目根目录创建 `ecosystem.config.js`：

```javascript
module.exports = {
  apps: [{
    name: 'my-app',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/my-app',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    node_args: '--max-old-space-size=1024'
  }]
};
```

### 4.2 创建日志目录

```bash
# 创建日志目录
mkdir -p /var/www/my-app/logs

# 设置权限
chmod 755 /var/www/my-app/logs
```

### 4.3 启动PM2应用

```bash
# 启动应用
pm2 start ecosystem.config.js --env production

# 保存PM2配置
pm2 save

# 设置PM2开机自启
pm2 startup

# 按照提示执行生成的命令（通常需要sudo）
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u $USER --hp $HOME

# 查看PM2状态
pm2 status

# 查看日志
pm2 logs my-app

# 重启应用
pm2 restart my-app
```

## 5. Nginx配置

### 5.1 创建Nginx配置文件

根据你的系统类型，选择相应的方法：

**方法A：如果 `/etc/nginx/conf.d` 目录存在（CentOS/RHEL 推荐）**

```bash
# 创建配置文件到 conf.d 目录
sudo vim /etc/nginx/conf.d/my-app.conf
```

**方法B：如果 `/etc/nginx/sites-available` 目录存在（Ubuntu/Debian）**

```bash
# 创建配置文件到 sites-available 目录
sudo vim /etc/nginx/sites-available/my-app
```

配置文件内容（替换 `your-domain.com` 为你的域名）：

```nginx
# HTTP重定向到HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name your-domain.com www.your-domain.com;
    
    # 重定向到HTTPS
    return 301 https://$server_name$request_uri;
}

# HTTPS配置
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name your-domain.com www.your-domain.com;
    
    # SSL证书配置（使用Let's Encrypt）
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    
    # 安全头
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    # Gzip压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript 
               application/x-javascript application/xml+rss 
               application/javascript application/json;
    
    # Next.js 静态资源缓存（_next/static 下的资源）
    location ~* ^/_next/static/ {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        # 长期缓存 Next.js 哈希资源
        expires 365d;
        add_header Cache-Control "public, immutable";
    }
    
    # 公共资源（public 文件夹）
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot|webp)$ {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        expires 30d;
        add_header Cache-Control "public";
    }
    
    # 反向代理到Node.js应用（其他所有请求）
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # 超时设置
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # 访问日志
    access_log /var/log/nginx/your-domain.com.access.log;
    error_log /var/log/nginx/your-domain.com.error.log;
}
```

### 5.2 启用站点配置

**使用 conf.d 的方式（conf.d 中的配置自动加载）**

```bash
# 只需测试和重载 Nginx
sudo nginx -t

# 重载Nginx
sudo systemctl reload nginx

# 查看Nginx状态
sudo systemctl status nginx
```

**或使用 sites-available/sites-enabled 的方式（如果目录存在）**

```bash
# 创建符号链接启用配置
sudo ln -s /etc/nginx/sites-available/my-app /etc/nginx/sites-enabled/

# 测试Nginx配置文件是否正确
sudo nginx -t

# 重载Nginx
sudo systemctl reload nginx

# 查看Nginx状态
sudo systemctl status nginx
```

### 5.3 验证配置是否生效

```bash
# 检查 Nginx 是否正确监听了 80 和 443 端口
sudo ss -tlnp | grep -E 'nginx|:80|:443'

# 或者使用 netstat 命令
sudo netstat -tlnp | grep -E 'nginx|:80|:443'
```

## 6. 域名绑定和DNS配置

### 6.1 DNS解析配置

在你的域名服务商（如阿里云、腾讯云等）后台进行以下配置：

**A记录配置（根域名）**

```
记录类型: A
主机记录: @ (表示根域名)
解析线路: 默认
记录值: <你的服务器公网IP>
TTL: 600
```

**A记录配置（www子域名）**

```
记录类型: A
主机记录: www
解析线路: 默认
记录值: <你的服务器公网IP>
TTL: 600
```

**验证DNS解析**

```bash
# 查询DNS记录
nslookup your-domain.com
dig your-domain.com

# 应该看到你的服务器IP
```

## 7. SSL证书安装（Let's Encrypt + Certbot）

### 7.1 安装Certbot

```bash
# 安装certbot和nginx插件
sudo apt install -y certbot python3-certbot-nginx
```

### 7.2 申请证书

```bash
# 自动申请证书并配置Nginx
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# 根据提示选择（通常选择 2 - 重定向HTTP到HTTPS）

# 查看已申请的证书
sudo certbot certificates
```

### 7.3 证书自动续期

```bash
# Certbot自动续期任务已在系统运行，每天运行两次
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer

# 测试续期过程（不会真正续期）
sudo certbot renew --dry-run

# 查看续期任务状态
sudo systemctl status certbot.timer
```

### 7.4 手动续期

```bash
# 如果需要立即续期
sudo certbot renew

# 续期后重载Nginx
sudo nginx -t && sudo systemctl reload nginx
```

## 8. 数据库备份策略

### 8.1 创建备份脚本

```bash
# 创建备份目录
sudo mkdir -p /var/backups/mongodb

# 创建备份脚本
sudo vim /usr/local/bin/backup-mongodb.sh
```

脚本内容：

```bash
#!/bin/bash

# 配置
DB_NAME="my-auth-app"
DB_USER="app_user"
DB_PASS="your_app_password"
BACKUP_DIR="/var/backups/mongodb"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/mongodb_backup_$DATE.gz"

# 创建备份
mongodump --db $DB_NAME --username $DB_USER --password $DB_PASS --gzip --archive=$BACKUP_FILE

# 删除7天前的备份
find $BACKUP_DIR -name "mongodb_backup_*.gz" -mtime +7 -delete

echo "Backup completed: $BACKUP_FILE"
```

设置权限和定时任务：

```bash
# 设置执行权限
sudo chmod +x /usr/local/bin/backup-mongodb.sh

# 添加定时任务（每天凌晨3点备份）
sudo crontab -e

# 添加以下行
0 3 * * * /usr/local/bin/backup-mongodb.sh
```

## 9. 监控和维护

### 9.1 系统监控

```bash
# 安装htop和iotop
sudo apt install -y htop iotop

# 查看系统资源使用
htop

# 查看磁盘使用
df -h

# 查看内存使用
free -h
```

### 9.2 应用监控

```bash
# 查看PM2状态
pm2 status

# 查看应用日志
pm2 logs my-app

# 监控模式
pm2 monit

# 重启应用
pm2 restart my-app

# 查看详细信息
pm2 show my-app
```

### 9.3 Nginx日志监控

```bash
# 查看访问日志
sudo tail -f /var/log/nginx/your-domain.com.access.log

# 查看错误日志
sudo tail -f /var/log/nginx/your-domain.com.error.log

# 分析访问统计
sudo awk '{print $1}' /var/log/nginx/your-domain.com.access.log | sort | uniq -c | sort -nr
```

## 10. 安全配置

### 10.1 SSH安全配置

```bash
# 编辑SSH配置
sudo vim /etc/ssh/sshd_config

# 修改以下配置
Port 22                    # 可以改为其他端口
PermitRootLogin no         # 禁止root登录
PasswordAuthentication no  # 禁用密码认证，使用密钥认证
UsePAM no

# 重启SSH服务
sudo systemctl restart sshd
```

### 10.2 fail2ban防护

```bash
# 安装fail2ban
sudo apt install -y fail2ban

# 创建配置文件
sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local

# 编辑配置
sudo vim /etc/fail2ban/jail.local

# 启用Nginx和SSH保护
[sshd]
enabled = true
port = ssh
filter = sshd
logpath = /var/log/auth.log
maxretry = 3
bantime = 3600

[nginx-http-auth]
enabled = true
filter = nginx-http-auth
port = http,https
logpath = /var/log/nginx/error.log
maxretry = 3
bantime = 3600

# 启动fail2ban
sudo systemctl start fail2ban
sudo systemctl enable fail2ban
```

## 11. 部署检查清单

- [ ] 服务器系统更新完成
- [ ] 防火墙配置正确
- [ ] Node.js 和 PM2 安装完成
- [ ] Nginx 安装并运行正常
- [ ] MongoDB 安装并配置用户权限
- [ ] 项目代码已部署到服务器
- [ ] 环境变量配置正确
- [ ] 项目构建成功
- [ ] PM2 应用正常运行
- [ ] Nginx 反向代理配置正确
- [ ] SSL 证书已安装
- [ ] 域名解析配置正确
- [ ] 数据库备份脚本已配置
- [ ] 监控和日志系统正常
- [ ] 安全配置已启用

## 12. 故障排除

### 12.1 常见问题

1. **应用无法启动**
   ```bash
   # 检查PM2日志
   pm2 logs my-app

   # 检查环境变量
   pm2 env 0

   # 检查端口占用
   sudo netstat -tlnp | grep :3000
   ```

2. **数据库连接失败**
   ```bash
   # 检查MongoDB状态
   sudo systemctl status mongod

   # 测试数据库连接
   mongosh --username app_user --password your_app_password --authenticationDatabase admin my-auth-app
   ```

3. **Nginx 502错误**
   ```bash
   # 检查Nginx错误日志
   sudo tail -f /var/log/nginx/your-domain.com.error.log

   # 检查PM2应用状态
   pm2 status
   ```

4. **SSL证书问题**
   ```bash
   # 检查证书状态
   sudo certbot certificates

   # 重新获取证书
   sudo certbot --nginx -d your-domain.com -d www.your-domain.com
   ```

### 12.2 性能优化

1. **启用Nginx缓存** - 已在配置中通过 `expires` 和 `Cache-Control` 实现
2. **配置MongoDB索引** - 对频繁查询的字段创建索引，如 `email`、`username`
3. **启用Gzip压缩** - 已在Nginx配置中启用
4. **优化图片和静态资源** - 使用 Next.js 的 `Image` 组件和优化
5. **配置CDN（可选）** - 使用阿里云CDN加速静态资源

**创建MongoDB索引示例：**

```javascript
// 在项目初始化时创建索引
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ username: 1 });
db.tasks.createIndex({ userId: 1 });
db.tasks.createIndex({ createdAt: -1 });
```

## 13. 自动化部署和更新策略

### 13.1 自动化部署脚本

创建 `deploy.sh`：

```bash
#!/bin/bash

# 部署脚本 - 自动更新代码、安装依赖、构建和重启应用
echo "========== 开始部署流程 =========="

# 设置错误时退出
set -e

# 进入项目目录
cd /var/www/my-next-app

echo "[1/7] 拉取最新代码..."
git pull origin main

echo "[2/7] 安装新依赖..."
npm install

echo "[3/7] 构建项目..."
npm run build

echo "[4/7] 停止旧PM2应用..."
pm2 stop my-next-app || true

echo "[5/7] 启动PM2应用..."
pm2 start ecosystem.config.cjs --env production

echo "[6/7] 清理Nginx缓存..."
sudo rm -rf /var/cache/nginx/*

echo "[7/7] 重载Nginx..."
sudo nginx -t && sudo systemctl reload nginx

echo "========== 部署完成！=========="
echo "应用状态:"
pm2 status
```

设置执行权限：
```bash
chmod +x deploy.sh
```

### 13.2 快速启动脚本

创建 `init-deploy.sh`（一键初始化完整部署）：

```bash
#!/bin/bash

# 完整初始化部署脚本
echo "========== 开始完整部署初始化 =========="

set -e

# 第1步：配置防火墙
echo "[1/8] 配置防火墙..."
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443

# 第2步：安装依赖
echo "[2/8] 安装系统依赖..."
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl wget git vim ufw nodejs npm

# 第3步：安装PM2和Nginx
echo "[3/8] 安装PM2和Nginx..."
sudo npm install -g pm2
sudo apt install -y nginx
sudo systemctl enable nginx

# 第4步：创建项目目录
echo "[4/8] 创建项目目录..."
sudo mkdir -p /var/www
cd /var/www

# 第5步：克隆项目
echo "[5/8] 克隆项目代码..."
sudo git clone https://github.com/your-username/my-app.git
sudo chown -R $USER:$USER /var/www/my-app
cd /var/www/my-app

# 第6步：安装项目依赖
echo "[6/8] 安装项目依赖..."
npm install

# 第7步：配置环境变量
echo "[7/8] 创建环境变量文件..."
echo "MONGODB_URI=mongodb://localhost:27017/my-app" > .env.production
echo "JWT_SECRET=$(openssl rand -base64 32)" >> .env.production
echo "NODE_ENV=production" >> .env.production
echo "请编辑 .env.production 文件，填入正确的配置值"

# 第8步：构建和启动
echo "[8/8] 构建项目并启动..."
npm run build
pm2 start ecosystem.config.js --env production
pm2 save

echo "========== 初始化完成！=========="
echo "✅ 项目已部署到 /var/www/my-app"
echo "⚠️  请完成以下步骤："
echo "  1. 编辑 /var/www/my-app/.env.production"
echo "  2. 配置Nginx: sudo vim /etc/nginx/sites-available/my-app"
echo "  3. 启用Nginx配置: sudo ln -s /etc/nginx/sites-available/my-app /etc/nginx/sites-enabled/"
echo "  4. 配置SSL证书: sudo certbot --nginx -d your-domain.com"
echo "  5. 测试应用: http://localhost:3000"
```

设置执行权限：
```bash
chmod +x init-deploy.sh
```

### 13.3 使用定时任务自动备份

```bash
# 编辑crontab
sudo crontab -e

# 添加每天凌晨3点的数据库备份
0 3 * * * /usr/local/bin/backup-mongodb.sh

# 添加每周日凌晨2点的完整系统备份
0 2 * * 0 /usr/local/bin/backup-system.sh
```

## 总结

通过以上步骤，您已经成功将 Next.js + MongoDB 项目部署到阿里云服务器上。定期监控和维护可以确保应用的稳定运行。

如有问题，请参考故障排除部分或查看相关日志文件。