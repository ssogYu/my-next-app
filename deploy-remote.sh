#!/bin/bash

# 方案 1: SSH 远程执行部署脚本
# 使用方式: ./deploy-remote.sh

echo "========== SSH 远程部署脚本 =========="

# 服务器配置
SERVER_IP="47.100.82.151"
SERVER_USER="root"
PROJECT_PATH="/var/www/my-next-app"

# 检查 SSH 连接
echo "[0/2] 检查 SSH 连接..."
if ! ssh -o ConnectTimeout=5 $SERVER_USER@$SERVER_IP "echo 'SSH连接成功'" > /dev/null 2>&1; then
    echo "❌ 无法连接到服务器 $SERVER_IP"
    exit 1
fi
echo "✅ SSH 连接成功"

# 提示用户
echo ""
echo "将在服务器上执行以下步骤:"
echo "1. 进入项目目录: $PROJECT_PATH"
echo "2. 拉取最新代码"
echo "3. 安装依赖并构建"
echo "4. 重启 PM2 应用"
echo "5. 重载 Nginx"
echo ""
read -p "确认执行部署? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ 用户取消部署"
    exit 1
fi

# 执行远程部署脚本
echo ""
echo "[1/2] 连接到服务器并执行部署..."
ssh $SERVER_USER@$SERVER_IP << "DEPLOY_SCRIPT"
#!/bin/bash
set -e
cd /var/www/my-next-app

echo "========== 开始部署流程 =========="

echo "[1/7] 拉取最新代码..."
git pull origin master

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

echo ""
echo "========== 部署完成！=========="
echo "应用状态:"
pm2 status

DEPLOY_SCRIPT

DEPLOY_STATUS=$?

# 输出结果
echo ""
echo "[2/2] 部署状态检查..."
if [ $DEPLOY_STATUS -eq 0 ]; then
    echo "✅ 部署成功！"
    echo "访问: https://nextapp.tankswift.top"
else
    echo "❌ 部署失败，请检查错误信息"
    exit 1
fi
