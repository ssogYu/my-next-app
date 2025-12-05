#!/bin/bash

# 方案 4: 综合部署脚本 - 结合本地推送和远程部署
# 功能: 1. 提交本地改动到 Git
#      2. 推送到 GitHub
#      3. 推送到服务器并自动部署
# 使用方式: ./deploy-full.sh "提交信息" 或 ./deploy-full.sh

set -e

echo "╔════════════════════════════════════════╗"
echo "║   🚀 综合部署脚本 - 本地 → GitHub → 服务器   ║"
echo "╚════════════════════════════════════════╝"
echo ""

# 配置
SERVER_IP="47.100.82.151"
SERVER_USER="root"
PROJECT_PATH="/var/www/my-next-app"
GITHUB_REMOTE="origin"
SERVER_REMOTE="server"

# 获取提交信息
COMMIT_MESSAGE="${1:-Update: $(date '+%Y-%m-%d %H:%M:%S')}"

# 颜色输出函数
print_step() {
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "🔹 $1"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
}

print_success() {
    echo "✅ $1"
}

print_error() {
    echo "❌ $1"
}

# 第 1 步：检查 Git 配置
print_step "第 1 步: 检查 Git 配置"

if ! git rev-parse --git-dir > /dev/null 2>&1; then
    print_error "当前不是 Git 仓库"
    exit 1
fi

# 检查远程仓库
if ! git remote get-url $GITHUB_REMOTE > /dev/null 2>&1; then
    print_error "未找到 GitHub 远程仓库 ($GITHUB_REMOTE)"
    exit 1
fi

# 检查服务器远程（如果不存在则添加）
if ! git remote get-url $SERVER_REMOTE > /dev/null 2>&1; then
    echo "⚠️  未找到服务器远程仓库，尝试添加..."
    git remote add $SERVER_REMOTE $SERVER_USER@$SERVER_IP:/var/repo/my-next-app.git || true
fi

print_success "Git 配置正常"

# 第 2 步：检查本地改动
print_step "第 2 步: 检查本地改动"

CHANGES=$(git status --porcelain)
if [ -z "$CHANGES" ]; then
    echo "⚠️  没有本地改动"
    read -p "是否继续推送并部署? (y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_error "用户取消"
        exit 1
    fi
else
    echo "检测到以下改动:"
    echo "$CHANGES"
    echo ""
fi

# 第 3 步：提交本地改动
print_step "第 3 步: 提交本地改动"

if [ ! -z "$CHANGES" ]; then
    read -p "是否提交所有改动? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git add .
        git commit -m "$COMMIT_MESSAGE"
        print_success "本地改动已提交"
    else
        echo "⚠️  跳过本地提交"
    fi
else
    echo "⚠️  没有改动需要提交"
fi

# 第 4 步：推送到 GitHub
print_step "第 4 步: 推送到 GitHub"

read -p "是否推送到 GitHub? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    if git push $GITHUB_REMOTE $(git rev-parse --abbrev-ref HEAD); then
        print_success "代码已推送到 GitHub"
    else
        print_error "推送到 GitHub 失败"
        exit 1
    fi
else
    echo "⚠️  跳过推送到 GitHub"
fi

# 第 5 步：推送到服务器
print_step "第 5 步: 推送到服务器并自动部署"

read -p "是否推送到服务器并部署? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    if ! git remote get-url $SERVER_REMOTE > /dev/null 2>&1; then
        print_error "服务器远程不存在，添加失败"
        exit 1
    fi
    
    echo "推送到服务器..."
    if git push $SERVER_REMOTE $(git rev-parse --abbrev-ref HEAD); then
        print_success "代码已推送到服务器，自动部署已启动"
    else
        print_error "推送到服务器失败"
        exit 1
    fi
else
    echo "⚠️  跳过推送到服务器"
fi

# 第 6 步：显示部署状态（可选）
print_step "第 6 步: 显示部署状态"

read -p "是否查看服务器部署状态? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "连接到服务器查看状态..."
    ssh $SERVER_USER@$SERVER_IP << 'EOF'
echo "========== 服务器状态 =========="
echo ""
echo "📍 应用状态:"
pm2 status

echo ""
echo "📊 系统信息:"
echo "- 磁盘使用: $(df -h / | tail -1 | awk '{print $5}')"
echo "- 内存使用: $(free -h | grep Mem | awk '{print $3 "/" $2}')"
echo "- CPU 负载: $(uptime | awk -F'load average:' '{print $2}')"

echo ""
echo "🌐 Nginx 状态:"
sudo systemctl status nginx | grep "Active:"

echo ""
echo "📝 最近部署日志:"
if [ -f /var/log/my-next-app-deploy.log ]; then
    tail -10 /var/log/my-next-app-deploy.log
fi

echo ""
echo "========== 状态检查完成 =========="
EOF
fi

# 完成
print_step "🎉 部署完成"
echo ""
echo "📋 总结:"
echo "1️⃣  本地改动已提交"
echo "2️⃣  代码已推送到 GitHub"
echo "3️⃣  代码已推送到服务器"
echo "4️⃣  服务器已自动部署"
echo ""
echo "🌐 访问应用:"
echo "   https://nextapp.tankswift.top"
echo ""
echo "📊 查看日志:"
echo "   ssh root@$SERVER_IP 'tail -f /var/log/my-next-app-deploy.log'"
echo ""
