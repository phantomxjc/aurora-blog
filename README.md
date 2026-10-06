# 🌌 Aurora Blog

> 一个设计精美的前后端分离博客系统，单镜像一键部署，CI/CD 自动构建。

灵感来源：[Firefly CMS](https://gitcode.com/phantomxjc/firefly-cms) · 重新设计 · 界面全面升级

---

## 📐 架构

```
                    ┌──────────────────────────────────────────┐
                    │            Aurora Blog (单容器)            │
                    │                                          │
   用户 ──────────► │  Proxy (9090)                            │
                    │    ├── /          → Blog  (Next.js 3000)  │
                    │    ├── /admin     → Admin (Vue 3  5174)   │
                    │    ├── /api       → API   (Express 3002)  │
                    │    └── /uploads   → API   (静态文件)       │
                    │                                          │
                    │  SQLite (Prisma) + 图片存储 → /data 持久化  │
                    └──────────────────────────────────────────┘
```

四个服务在一个容器内通过 **PM2** 进程管理器运行，对外暴露 4 个端口。

## 🛠 技术栈

| 层 | 技术 | 版本 | 说明 |
|----|------|------|------|
| **前端 Blog** | Next.js | 14.2 | App Router, SSR, Tailwind CSS |
| **管理后台** | Vue 3 | 3.5 | Vite 6, Pinia, TypeScript |
| **后端 API** | Express | 4.21 | RESTful, JWT 认证 |
| **数据库** | SQLite + Prisma | 6.2 | 轻量级，零配置，文件存储 |
| **反向代理** | Node http-proxy | — | 路由分发，单端口入口 |
| **进程管理** | PM2 | — | 单容器多进程 |
| **CI/CD** | GitHub Actions | — | 自动构建推送 GHCR |

## ✨ 特性

- 🎨 **极简美学设计** — 渐变、玻璃态、微动画，视觉体验一流
- 📝 **Markdown 写作** — 工具栏 + 实时预览 + 图片拖拽上传
- 🔍 **全文搜索** — 标题、内容、标签多维搜索
- 🏷 **标签 & 分类** — 灵活的内容组织
- 📌 **置顶 & 草稿 & 精选** — 精细的发布控制
- 💬 **动态发布** — 类似微博的短动态
- 📁 **项目展示** — 作品集页面
- 🖼 **图片管理** — 图库浏览与上传
- 🔐 **JWT 认证** — 安全的后台管理
- 🐳 **单镜像部署** — 一条 `docker run` 搞定全部

## 🚀 快速开始

### 方式一：单容器部署（推荐）

一个镜像包含全部服务，一条命令搞定：

```bash
docker run -d --name aurora \
  -p 9090:9090 -p 3000:3000 -p 3002:3002 -p 5174:5174 \
  -v ./data:/data \
  ghcr.io/phantomxjc/aurora-blog:latest
```

| 端口 | 服务 | 说明 |
|------|------|------|
| `9090` | Proxy | **统一入口**，自动路由到各服务 |
| `3000` | Blog | Next.js 前端（可直连） |
| `3002` | API | Express 后端（可直连） |
| `5174` | Admin | Vue 3 管理后台（可直连） |

数据持久化在 `./data` 目录（SQLite 数据库 + 上传图片）。

启动后：
- 🌐 博客首页 → `http://localhost:9090`
- ⚙️ 管理后台 → `http://localhost:9090/admin`（或直连 `:5174`）
- 🔑 默认账号 → `admin` / `admin123`（**首次登录后请修改密码**）

### 方式二：Docker Compose 多容器部署

适合需要独立扩展单个服务的场景：

```bash
curl -O https://raw.githubusercontent.com/phantomxjc/aurora-blog/main/docker-compose.prod.yml
docker compose -f docker-compose.prod.yml up -d
```

### 方式三：源码构建部署

```bash
git clone https://github.com/phantomxjc/aurora-blog.git
cd aurora-blog
docker compose up -d --build
```

## 📁 项目结构

```
aurora-blog/
├── blog/                  # Next.js 14 前端（博客展示）
│   ├── src/app/           # App Router 页面
│   │   ├── page.tsx       # 首页
│   │   ├── posts/[slug]/  # 文章详情
│   │   ├── search/        # 搜索
│   │   ├── tags/          # 标签
│   │   ├── archive/       # 归档
│   │   ├── dynamics/      # 动态
│   │   └── projects/      # 项目展示
│   ├── src/components/    # 组件
│   └── src/lib/api.ts    # API 封装
├── admin/                 # Vue 3 管理后台
│   ├── src/views/         # 页面
│   │   ├── Dashboard.vue  # 仪表盘
│   │   ├── Posts/         # 文章管理
│   │   ├── Dynamics.vue   # 动态管理
│   │   ├── Images.vue     # 图片管理
│   │   ├── Projects.vue   # 项目管理
│   │   ├── Settings.vue   # 系统设置
│   │   └── Tags.vue       # 标签管理
│   └── nginx.conf         # Nginx 配置
├── api/                   # Express 后端
│   ├── src/routes/        # API 路由
│   │   ├── auth.ts        # 认证
│   │   ├── posts.ts       # 文章 CRUD
│   │   ├── dynamics.ts    # 动态
│   │   ├── projects.ts    # 项目
│   │   ├── tags.ts        # 标签
│   │   ├── images.ts      # 图片上传
│   │   └── settings.ts    # 设置
│   └── prisma/            # 数据库
│       ├── schema.prisma  # 数据模型
│       └── dev.db         # SQLite 文件
├── proxy.js               # 反向代理（路由分发）
├── Dockerfile.allinone    # 单容器多阶段构建
├── ecosystem.config.js    # PM2 进程配置
├── entrypoint.sh          # 容器启动脚本
├── docker-compose.yml     # 开发环境
├── docker-compose.prod.yml# 生产环境（GHCR 镜像）
└── .github/workflows/     # CI/CD
    └── docker-publish.yml # 自动构建推送
```

## 🔧 环境变量

| 变量 | 默认值 | 说明 |
|------|--------|------|
| `PORT` | `3002` | API 服务端口 |
| `JWT_SECRET` | `aurora-secret-key-2026` | JWT 签名密钥（**生产环境请修改**） |
| `INTERNAL_API_URL` | `http://localhost:3002` | Blog 调用 API 的内部地址 |
| `PROXY_PORT` | `8080` / `9090` | 代理服务监听端口 |
| `API_TARGET` | `http://localhost:3002` | 代理 → API 目标 |
| `BLOG_TARGET` | `http://localhost:3000` | 代理 → Blog 目标 |
| `ADMIN_TARGET` | `http://localhost:5174` | 代理 → Admin 目标 |

## 🔄 CI/CD 自动构建

本项目使用 GitHub Actions + GHCR 实现零配置自动构建。

- **触发条件**：推送到 `main` 分支，或打 `v*` 标签（如 `v1.0.0`）
- **认证方式**：GitHub 内置 `GITHUB_TOKEN`，无需手动配置任何 secrets
- **构建矩阵**：5 个镜像并行构建

| 镜像 | GHCR 地址 | 说明 |
|------|-----------|------|
| All-in-one | `ghcr.io/phantomxjc/aurora-blog` | 单容器全量（推荐） |
| Blog | `ghcr.io/phantomxjc/aurora-blog-blog` | Next.js 前端 |
| API | `ghcr.io/phantomxjc/aurora-blog-api` | Express 后端 |
| Admin | `ghcr.io/phantomxjc/aurora-blog-admin` | Vue 3 管理后台 |
| Proxy | `ghcr.io/phantomxjc/aurora-blog-proxy` | 反向代理 |

**标签策略**：
- `latest` — main 分支最新构建
- `1.0.0` / `1.0` — 打 `v1.0.0` 标签时自动生成语义化版本标签
- `sha-xxxxxx` — 每次构建的 commit 短哈希

## 💻 本地开发

```bash
# 1. 启动 API（端口 3002）
cd api && npm install && npx prisma db push && npx tsx src/main.ts

# 2. 启动 Blog（端口 3000）
cd blog && npm install && npm run dev

# 3. 启动 Admin（端口 5174）
cd admin && npm install && npm run dev
```

或一键启动全部服务：

```bash
docker compose up -d --build
```

## 📄 License

MIT License
