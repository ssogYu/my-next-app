# 婚礼倒计时应用

一个基于 Next.js 16 的浪漫婚礼倒计时应用，集成了任务管理功能，帮助新人完美筹备婚礼。

## 项目概览

## ✨ 功能特性

### 🏠 首页倒计时 (/home)
- **背景轮播** - 支持多张浪漫背景图片自动切换
- **实时倒计时** - 精确到秒的婚礼倒计时显示
- **新人信息** - 优雅展示新郎新娘姓名
- **高级设计** - 采用玻璃拟态效果，简约而浪漫

### 📝 任务管理 (/task)
- **分类管理** - 支持婚礼、个人、其他任务分类
- **优先级设置** - 高、中、低三个优先级
- **状态管理** - 待完成、已完成状态切换
- **编辑功能** - 支持任务的增删改查
- **统计面板** - 实时显示任务完成统计

### ⚙️ 设置页面 (/setting)
- **新人信息设置** - 自定义新郎新娘姓名
- **婚礼日期设置** - 灵活选择婚礼日期时间
- **背景图片管理** - 支持添加、删除背景图片，提供推荐图片
- **主题切换** - 浅色/深色主题随心切换
- **数据管理** - 支持重置设置、退出登录

## 🛠 技术栈

- **前端框架**: Next.js 16 (App Router)
- **UI 框架**: React 19
- **样式方案**: Tailwind CSS 4
- **开发语言**: TypeScript
- **字体**: Google Fonts (Playfair Display, Great Vibes, Montserrat)
- **数据存储**: localStorage (客户端状态管理)
- **认证系统**: MongoDB + JWT + bcrypt.js

## 项目目录结构

```
my-app/
├── src/                     # 源代码目录
│   ├── app/                 # App Router 目录 (Next.js 13+)
│   │   ├── api/             # API 路由
│   │   │   └── auth/        # 认证相关API
│   │   │       ├── login/   # 登录API
│   │   │       ├── register/# 注册API
│   │   │       ├── logout/  # 登出API
│   │   │       └── me/      # 用户信息API
│   │   ├── auth/            # 认证页面
│   │   │   ├── login/       # 登录页面
│   │   │   └── register/    # 注册页面
│   │   ├── globals.css      # 全局样式文件
│   │   ├── layout.tsx       # 根布局组件
│   │   ├── favicon.ico      # 网站图标
│   │   └── page.tsx         # 首页组件
│   ├── components/          # React 组件
│   │   ├── icons.tsx        # 图标组件
│   │   └── navigation.tsx   # 导航组件
│   ├── contexts/            # React 上下文
│   │   └── AuthContext.tsx  # 认证上下文
│   ├── models/              # MongoDB 数据模型
│   │   └── User.ts          # 用户数据模型和Schema
│   └── lib/                 # 工具库和服务
│       ├── auth.ts          # 认证服务
│       ├── db.ts            # MongoDB数据库操作服务
│       ├── mongodb.ts       # MongoDB连接配置
│       └── types.ts         # TypeScript 类型定义
│
├── public/                  # 静态资源目录
│   ├── next.svg            # Next.js logo
│   ├── vercel.svg          # Vercel logo
│   ├── globe.svg           # 地球图标
│   ├── window.svg          # 窗口图标
│   └── file.svg            # 文件图标
│
├── .next/                   # Next.js 构建输出目录 (自动生成)
├── node_modules/            # 项目依赖包目录 (自动生成)
├── .gitignore              # Git 忽略文件配置
├── .claude/                # Claude Code 配置目录
│
├── package.json            # 项目配置和依赖信息
├── package-lock.json       # 锁定依赖版本
├── tsconfig.json           # TypeScript 配置文件
├── next.config.ts          # Next.js 框架配置
├── next-env.d.ts           # Next.js TypeScript 类型声明
├── eslint.config.mjs       # ESLint 代码检查配置
├── postcss.config.mjs      # PostCSS 处理器配置
└── README.md               # 项目说明文档
```

## 核心文件说明

### 配置文件

- **`package.json`** - 项目元数据、依赖包和脚本命令
- **`tsconfig.json`** - TypeScript 编译器配置，包含路径映射 `@/*` → `./src/*`
- **`next.config.ts`** - Next.js 框架配置，启用了 React 编译器
- **`eslint.config.mjs`** - 代码质量检查配置，使用 Next.js 推荐规则
- **`postcss.config.mjs`** - PostCSS 配置，集成 Tailwind CSS
- **`next-env.d.ts`** - Next.js 环境类型声明（自动生成，请勿编辑）

### 源代码

#### 认证系统
- **`src/contexts/AuthContext.tsx`** - 全局认证状态管理，提供登录、注册、登出功能
- **`src/lib/auth.ts`** - 认证服务，处理密码加密、JWT生成和验证
- **`src/lib/db.ts`** - MongoDB数据库操作服务，用户数据CRUD操作
- **`src/lib/types.ts`** - 认证相关的TypeScript类型定义

#### 数据库
- **`src/models/User.ts`** - 用户数据模型和Mongoose Schema定义
- **`src/lib/mongodb.ts`** - MongoDB连接管理和配置

#### API 路由
- **`src/app/api/auth/login/route.ts`** - 用户登录API端点
- **`src/app/api/auth/register/route.ts`** - 用户注册API端点
- **`src/app/api/auth/logout/route.ts`** - 用户登出API端点
- **`src/app/api/auth/me/route.ts`** - 获取当前用户信息API端点

#### 页面组件
- **`src/app/page.tsx`** - 首页组件，根据登录状态显示不同内容
- **`src/app/auth/login/page.tsx`** - 登录页面，包含登录表单和验证逻辑
- **`src/app/auth/register/page.tsx`** - 注册页面，包含注册表单和验证逻辑
- **`src/components/navigation.tsx`** - 导航组件，显示用户登录状态和退出按钮
- **`src/components/icons.tsx`** - 图标组件

#### 布局和样式
- **`src/app/layout.tsx`** - 应用程序的根布局，包含AuthProvider
- **`src/app/globals.css`** - 全局样式，定义 CSS 变量和 Tailwind 主题配置

### 静态资源

- **`public/`** - 存放静态文件，如图标、图片等，可通过根路径直接访问

### 构建和开发

- **`.next/`** - Next.js 构建输出目录
- **`node_modules/`** - 项目依赖包
- **`.gitignore`** - Git 版本控制忽略文件配置

## 快速开始

安装依赖：

```bash
npm install
```

启动开发服务器：

```bash
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看应用。

其他可用命令：

```bash
npm run build    # 构建生产版本
npm run start    # 启动生产服务器
npm run lint     # 运行代码检查
```

## 项目特性

- **TypeScript 支持** - 完整的类型安全
- **Tailwind CSS** - 原子化 CSS 样式系统，支持深色模式
- **React 编译器** - 启用了实验性的 React 编译器
- **字体优化** - 自动优化 Geist 字体家族
- **现代 ESLint** - 使用最新版本的 ESLint 配置
- **App Router** - 使用 Next.js 13+ 的 App Router 模式
- **JWT 认证系统** - 完整的用户注册、登录、登出功能
- **MongoDB 集成** - 使用 MongoDB 作为持久化数据存储
- **Mongoose ODM** - 强类型的数据模型和验证
- **数据库连接池** - 优化的数据库连接管理
- **密码安全** - 使用 bcrypt.js 进行密码加密存储
- **Token 管理** - HTTP-Only Cookie 存储 JWT Token，防止 XSS 攻击
- **响应式设计** - 移动端友好的用户界面
- **状态管理** - 基于 React Context 的全局认证状态管理

## 认证系统使用说明

### 用户注册流程
1. 访问 `/auth/register` 页面
2. 填写用户名、邮箱和密码（密码至少6位）
3. 提交表单完成注册
4. 注册成功后自动跳转到首页并显示欢迎信息

### 用户登录流程
1. 访问 `/auth/login` 页面
2. 输入邮箱和密码
3. 提交表单完成登录
4. 登录成功后自动跳转到首页
5. 导航栏会显示用户名和退出按钮

### 安全特性
- **密码加密**: 使用 bcrypt.js 对用户密码进行加密存储
- **JWT Token**: 使用 JSON Web Token 进行身份验证
- **HTTP-Only Cookie**: Token 存储在 HTTP-Only Cookie 中，防止 XSS 攻击
- **表单验证**: 前端和后端都进行完整的数据验证
- **错误处理**: 统一的错误处理机制，用户友好的错误提示

### API 接口

#### 用户注册
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

#### 用户登录
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "string",
  "password": "string"
}
```

#### 用户登出
```http
POST /api/auth/logout
```

#### 获取用户信息
```http
GET /api/auth/me
```

## 🚀 开始使用

### 安装依赖
```bash
npm install
```

### 启动开发服务器
```bash
npm run dev
```

应用将在 [http://localhost:3000](http://localhost:3000) 启动

### 构建生产版本
```bash
npm run build
npm start
```

## 📱 页面结构

```
/src/app/
├── (auth)/           # 认证相关页面
│   ├── login/       # 登录页面
│   └── register/    # 注册页面
├── (protected)/     # 需要认证的页面
│   ├── home/        # 首页倒计时
│   ├── task/        # 任务管理
│   └── setting/     # 设置页面
└── layout.tsx       # 根布局
```

## 🎨 设计理念

### 视觉设计
- **浪漫配色**: 以玫瑰色为主色调，营造浪漫温馨氛围
- **玻璃拟态**: 采用现代玻璃拟态设计风格
- **优雅字体**: 结合 Playfair Display 和 Great Vibes 字体
- **响应式布局**: 完美适配手机、平板、桌面设备

### 交互体验
- **流畅动画**: 页面元素淡入、心跳、浮动等动画效果
- **即时反馈**: 所有操作都有即时的视觉反馈
- **直观操作**: 简洁明了的用户界面，易于上手

## 💾 数据存储

应用使用 localStorage 在客户端存储所有数据：
- **weddingSettings**: 婚礼设置信息
- **weddingTodos**: 任务清单数据

数据会自动保存，刷新页面后不会丢失。

## 🔒 认证系统

应用已集成完整的认证系统：
- 用户注册和登录
- 路由保护机制
- 安全的会话管理

## 📸 背景图片

默认提供多张精选的浪漫背景图片，用户也可以：
- 添加自定义背景图片 URL
- 从推荐图片中选择
- 删除不需要的背景图片

## 🎯 使用场景

1. **婚礼筹备**: 作为婚礼倒计时和任务管理工具
2. **婚礼网站**: 可以作为婚礼邀请网站的倒计时模块
3. **纪念日庆祝**: 也可用于其他重要纪念日的倒计时

## 🌟 特色功能

- **零配置**: 开箱即用，无需额外配置
- **离线使用**: 所有功能都在本地运行，无需网络连接
- **数据安全**: 数据存储在本地，保护用户隐私
- **高度可定制**: 支持个性化设置各种参数

## 了解更多

- [Next.js 官方文档](https://nextjs.org/docs)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)
- [TypeScript 手册](https://www.typescriptlang.org/docs/)
- [React 学习资源](https://react.dev/learn)
- [JWT 官方文档](https://jwt.io/)
- [bcrypt.js 文档](https://www.npmjs.com/package/bcryptjs)

## 🤝 贡献

欢迎提交 Issues 和 Pull Requests 来改进这个项目。

## 📄 许可证

MIT License

---

💕 为爱而生，让每一刻都充满期待

## 部署

推荐使用 [Vercel 平台](https://vercel.com/new) 部署此 Next.js 应用。查看 [Next.js 部署文档](https://nextjs.org/docs/app/building-your-application/deploying) 了解更多部署选项。

### 环境变量
在生产环境中，建议设置以下环境变量：

```bash
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/my-auth-app

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
NODE_ENV=production
```

### 数据库设置

#### 本地开发
1. **安装 MongoDB**:
   ```bash
   # macOS 使用 Homebrew
   brew tap mongodb/brew
   brew install mongodb-community

   # 启动 MongoDB 服务
   brew services start mongodb-community
   ```

2. **创建数据库**:
   - MongoDB 会自动创建在连接字符串中指定的数据库

#### 云端部署
推荐使用 MongoDB Atlas 免费版本：
1. 访问 [MongoDB Atlas](https://www.mongodb.com/atlas)
2. 创建免费集群
3. 获取连接字符串并更新 `.env.local` 文件

### 数据模型

用户数据模型结构：
```typescript
interface User {
  username: string;      // 用户名，2-50字符
  email: string;         // 邮箱地址，唯一
  password: string;      // 加密后的密码
  createdAt: Date;       // 创建时间
  updatedAt: Date;       // 更新时间
}
```
