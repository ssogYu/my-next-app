#!/bin/bash

# 方案 2: 配置 Git Hook 自动部署
# 执行此脚本在服务器上创建 Git Hook
# 使用方式: ./setup-git-hook.sh

echo "========== Git Hook 自动部署配置 =========="

SERVER_IP="47.100.82.151"
SERVER_USER="root"

# 第一步：创建服务器端的配置脚本
echo "[1/3] 生成服务器配置脚本..."

ssh $SERVER_USER@$SERVER_IP << 'SETUP_SCRIPT'
#!/bin/bash
set -e

echo "========== 在服务器上配置 Git Hook =========="

# 创建裸仓库
echo "[1/4] 创建裸仓库..."
mkdir -p /var/repo/my-next-app.git
cd /var/repo/my-next-app.git
git init --bare

# 创建 post-receive hook
echo "[2/4] 创建 post-receive hook..."
cat > /var/repo/my-next-app.git/hooks/post-receive << 'EOF'
#!/bin/bash

# 部署日志文件
LOG_FILE="/var/log/my-next-app-deploy.log"

# 记录时间戳
echo "========== $(date '+%Y-%m-%d %H:%M:%S') 检测到代码推送，开始部署 ==========" >> $LOG_FILE

# 项目路径
PROJECT_PATH="/var/www/my-next-app"

# 进入项目目录
cd $PROJECT_PATH

# 拉取最新代码
echo "拉取最新代码..." >> $LOG_FILE
git fetch origin master >> $LOG_FILE 2>&1
git reset --hard origin/master >> $LOG_FILE 2>&1

# 安装依赖
echo "安装依赖..." >> $LOG_FILE
npm install >> $LOG_FILE 2>&1

# 构建项目
echo "构建项目..." >> $LOG_FILE
npm run build >> $LOG_FILE 2>&1

# 重启 PM2 应用
echo "重启 PM2 应用..." >> $LOG_FILE
pm2 stop my-next-app >> $LOG_FILE 2>&1 || true
pm2 start ecosystem.config.cjs --env production >> $LOG_FILE 2>&1

# 清理缓存并重载 Nginx
echo "重载 Nginx..." >> $LOG_FILE
sudo rm -rf /var/cache/nginx/* >> $LOG_FILE 2>&1
sudo nginx -t >> $LOG_FILE 2>&1
sudo systemctl reload nginx >> $LOG_FILE 2>&1

echo "部署完成！" >> $LOG_FILE
echo "" >> $LOG_FILE

# 输出反馈给客户端
echo "✅ 代码已成功部署到服务器！"
echo "应用地址: https://nextapp.tankswift.top"

EOF

# 给予执行权限
chmod +x /var/repo/my-next-app.git/hooks/post-receive

# 配置 Git 仓库
echo "[3/4] 配置 Git 仓库..."
git config receive.denyCurrentBranch ignore

# 创建项目目录（如果不存在）
echo "[4/4] 初始化项目目录..."
if [ ! -d "/var/www/my-next-app/.git" ]; then
    git clone /var/repo/my-next-app.git /var/www/my-next-app 2>/dev/null || true
fi

echo ""
echo "========== Git Hook 配置完成！=========="
echo "裸仓库位置: /var/repo/my-next-app.git"
echo "项目位置: /var/www/my-next-app"
echo "部署日志: /var/log/my-next-app-deploy.log"
echo ""
echo "接下来请在本地项目中执行:"
echo "  git remote add server root@47.100.82.151:/var/repo/my-next-app.git"
echo "  git push server master"

SETUP_SCRIPT

echo ""
echo "[2/3] 服务器配置完成！"

# 第二步：输出本地配置说明
echo ""
echo "[3/3] 生成本地配置说明..."
cat > ./git-hook-setup-local.md << 'LOCAL_SETUP'
# Git Hook 本地配置说明

## 步骤 1：添加服务器远程仓库

在本地项目目录执行：

```bash
git remote add server root@47.100.82.151:/var/repo/my-next-app.git
```

## 步骤 2：验证远程仓库

```bash
git remote -v
# 应该显示:
# origin  https://github.com/your-username/my-next-app.git (fetch)
# origin  https://github.com/your-username/my-next-app.git (push)
# server  root@47.100.82.151:/var/repo/my-next-app.git (fetch)
# server  root@47.100.82.151:/var/repo/my-next-app.git (push)
```

## 步骤 3：推送代码以触发自动部署

```bash
# 推送到 GitHub（可选）
git push origin master

# 推送到服务器（自动触发部署）
git push server master
```

## 步骤 4：查看部署日志

```bash
ssh root@47.100.82.151 "tail -f /var/log/my-next-app-deploy.log"
```

## 常见问题

### Q: 如何撤销 push？
```bash
git push server +master  # 强制推送当前版本
```

### Q: 如何查看部署进度？
```bash
ssh root@47.100.82.151 "tail -100 /var/log/my-next-app-deploy.log"
```

### Q: 部署失败怎么办？
1. 查看部署日志找出错误
2. 修复代码或配置
3. 重新 push

LOCAL_SETUP

echo "✅ 本地配置说明已生成: git-hook-setup-local.md"
echo ""
echo "========== 配置完成！=========="
