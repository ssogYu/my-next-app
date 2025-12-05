# GitHub Actions 自动部署配置

## 第 1 步：生成 SSH 密钥（如果没有）

在本地执行：

```bash
# 生成 SSH 密钥（使用已有密钥则跳过）
ssh-keygen -t ed25519 -C "your-email@example.com"

# 查看公钥
cat ~/.ssh/id_ed25519.pub

# 查看私钥
cat ~/.ssh/id_ed25519
```

## 第 2 步：在服务器上添加公钥

在服务器上执行：

```bash
# 编辑 authorized_keys
ssh root@47.100.82.151 "vim ~/.ssh/authorized_keys"

# 或者直接追加
echo "your_public_key_here" | ssh root@47.100.82.151 "cat >> ~/.ssh/authorized_keys"
```

## 第 3 步：在 GitHub 中添加 Secrets

1. 进入 GitHub 项目页面
2. 点击 **Settings** → **Secrets and variables** → **Actions**
3. 点击 **New repository secret**
4. 添加以下 Secret：

### Secret 1: SSH_PRIVATE_KEY
- **Name**: `SSH_PRIVATE_KEY`
- **Value**: 你的 SSH 私钥内容（从 `~/.ssh/id_ed25519` 复制）

```bash
# 查看并复制私钥
cat ~/.ssh/id_ed25519
```

### Secret 2: SLACK_WEBHOOK（可选）
- **Name**: `SLACK_WEBHOOK`
- **Value**: 你的 Slack Webhook URL（用于部署通知）

获取 Slack Webhook：
1. 进入 https://api.slack.com/apps
2. 创建或选择应用
3. 开启 **Incoming Webhooks**
4. 创建新的 Webhook URL
5. 复制 Webhook URL

## 第 4 步：提交并推送

```bash
# 提交文件
git add .github/workflows/deploy.yml

# 提交
git commit -m "feat: 添加 GitHub Actions 自动部署"

# 推送到 GitHub
git push origin master
```

## 第 5 步：验证部署

1. 进入 GitHub 项目的 **Actions** 标签页
2. 查看最新的 workflow 运行
3. 如果成功会显示 ✅，失败显示 ❌

## 工作流程说明

```
本地代码修改
    ↓
git push origin master
    ↓
GitHub 检测到 push
    ↓
GitHub Actions 启动
    ↓
[1] 检出代码
[2] 配置 SSH
[3] 连接到服务器
[4] 执行远程部署脚本
    ↓
部署完成（部署成功/失败通知）
    ↓
服务器应用自动更新
```

## 常见问题

### Q: 如何查看部署日志？
- 进入 **Actions** → 点击最新的 workflow run → 查看详细日志

### Q: SSH 连接失败？
1. 检查 SSH_PRIVATE_KEY 是否正确
2. 检查服务器 ~/.ssh/authorized_keys 是否包含公钥
3. 检查服务器 IP 和端口是否正确

### Q: 部署超时？
在 deploy.yml 中的 `ssh root@47.100.82.151` 前加入：
```yaml
  env:
    TIMEOUT: 600
```

### Q: 如何禁用某个分支的自动部署？
编辑 .github/workflows/deploy.yml 的 `on` 部分：
```yaml
on:
  push:
    branches:
      - master
      # - develop  # 注释掉 develop 分支
```

## 环境变量（可选）

在 deploy.yml 中可以访问以下 GitHub 上下文变量：

- `${{ github.ref_name }}` - 分支名称
- `${{ github.actor }}` - 提交者
- `${{ github.sha }}` - 提交 SHA
- `${{ github.event.head_commit.message }}` - 提交信息

## 更多参考

- GitHub Actions 文档: https://docs.github.com/en/actions
- SSH Action: https://github.com/webfactory/ssh-agent
