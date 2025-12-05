#!/bin/bash

# 部署脚本 - 自动更新代码、安装依赖、构建和重启应用
echo "========== 开始部署流程 =========="

# 设置错误时退出
set -e

# 进入项目目录
cd /var/www/my-next-app

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

echo "========== 部署完成！=========="
echo "应用状态:"
pm2 status