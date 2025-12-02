# Next.js 项目结构说明

这是一个基于 [Next.js](https://nextjs.org) 官方脚手架 `create-next-app` 创建的现代 React 应用程序。

## 项目概览

本项目使用了以下技术栈：
- **Next.js 16.0.6** - React 全栈框架
- **React 19.2.0** - UI 库
- **TypeScript 5** - 类型安全的 JavaScript
- **Tailwind CSS 4** - 实用优先的 CSS 框架
- **ESLint 9** - 代码质量检查

## 项目目录结构

```
my-app/
├── src/                     # 源代码目录
│   └── app/                 # App Router 目录 (Next.js 13+)
│       ├── globals.css      # 全局样式文件
│       ├── layout.tsx       # 根布局组件
│       ├── favicon.ico      # 网站图标
│       └── page.tsx         # 首页组件
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

- **`src/app/layout.tsx`** - 应用程序的根布局，设置元数据、字体和全局结构
- **`src/app/page.tsx`** - 首页组件，使用 Tailwind CSS 样式和 Next.js Image 组件
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

## 了解更多

- [Next.js 官方文档](https://nextjs.org/docs)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)
- [TypeScript 手册](https://www.typescriptlang.org/docs/)
- [React 学习资源](https://react.dev/learn)

## 部署

推荐使用 [Vercel 平台](https://vercel.com/new) 部署此 Next.js 应用。查看 [Next.js 部署文档](https://nextjs.org/docs/app/building-your-application/deploying) 了解更多部署选项。
