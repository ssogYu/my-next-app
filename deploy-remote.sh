#!/bin/bash

# 方案 1: SSH 远程执行部署脚本
# 使用方式: ./deploy-remote.sh

echo "========== SSH 远程部署脚本 =========="

# 服务器配置
SERVER_IP="47.100.82.151"
SERVER_USER="root"
PROJECT_PATH="/var/www/my-next-app"

# 使用 SSH ControlMaster 建立复用连接，避免多次输入密码
CONTROL_DIR="$HOME/.ssh/controlmasters"
CONTROL_PATH="$CONTROL_DIR/cm-%r@%h:%p"
mkdir -p "$CONTROL_DIR"

echo "[0/2] 建立 SSH 控制主连接（可能会要求输入一次密码）..."
# -Nf: 不执行远程命令，后台运行
ssh -o ControlMaster=auto -o ControlPath="$CONTROL_PATH" -o ControlPersist=600 -Nf $SERVER_USER@$SERVER_IP
if [ $? -ne 0 ]; then
    echo "❌ 无法建立 SSH 主连接 $SERVER_USER@$SERVER_IP"
    echo "请检查网络或使用 SSH 密钥免密登录"
    exit 1
fi
echo "✅ SSH 主连接已建立，后续连接将复用该连接（不再重复询问密码）"

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

# 执行远程部署命令，所有 ssh 连接使用 ControlPath 复用主连接
echo ""
echo "[1/2] 使用复用连接执行远程部署..."
ssh -o ControlPath="$CONTROL_PATH" $SERVER_USER@$SERVER_IP bash -s << 'DEPLOY_SCRIPT'
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

# 关闭 ControlMaster 主连接，以释放资源
echo "[2/2] 关闭 SSH 控制主连接..."
ssh -O exit -o ControlPath="$CONTROL_PATH" $SERVER_USER@$SERVER_IP 2>/dev/null || true
echo "✅ 控制连接已关闭"
