### 前端项目自动化构建方式详解

#### 方案一 SSH 远程执行
```bash
chmod +x deploy-remote.sh
./deploy-remote.sh
```
 
#### 方案二 Git Hook 自动触发
1. 第一步：在服务器上配置裸仓库和 Hook
2. 创建一个脚本来帮你配置服务器（本地执行）：
```bash
chmod +x setup-git-hook.sh
./setup-git-hook.sh
```
3. 之后只需要
git push server master  # 自动部署

创建配置说明文档: git-hook-setup-local.md 说明配置本地。

#### 方案三 GitHub Actions 自动化 CI/CD
1. 设置 GitHub Actions 的详细步骤：
创建配置说明文档：GITHUB_ACTIONS_SETUP.md
2. 提交文件
git push origin master  # 自动触发部署

#### 方案四 综合部署脚本（结合本地推送）
使用方式（本地执行）：
```bash
chmod +x deploy-full.sh
./deploy-full.sh "修复: 静态资源加载问题"
# 或者
./deploy-full.sh
```
创建配置说明文档：DEPLOYMENT_GUIDE.md