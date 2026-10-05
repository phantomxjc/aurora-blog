# 🌌 Aurora Blog — 前后端分离博客系统

> 灵感来源：[Firefly CMS](https://gitcode.com/phantomxjc/firefly-cms) · 重新设计 · 界面全面升级

一个设计精美的前后端分离博客系统，采用 **Next.js 14 + Express + Vue 3** 架构。

## ✨ 特性

- 🎨 **极简美学设计** — 渐变、玻璃态、微动画，视觉体验一流
- 📝 **Markdown 写作** — 所见即所得编辑器，工具栏 + 实时预览 + 图片拖拽上传
- 🔍 **全文搜索** — 标题、内容、标签多维搜索
- 🏷 **标签 & 分类** — 灵活的内容组织
- 📌 **置顶 & 草稿** — 精细的发布控制
- 💬 **动态发布** — 类似微博的短动态
- 📁 **项目展示** — 作品集页面
- 🖼 **图片管理** — 图库浏览与上传
- 🔐 **JWT 认证** — 安全的后台管理
- 🐳 **Docker 一键部署** — 无需下载源码

## 🚀 方式一：一键拉取（推荐）

无需 clone 源码，直接拉取预构建镜像：

```bash
# 下载 compose 文件
curl -O https://raw.githubusercontent.com/phantomxjc/aurora-blog/main/docker-compose.prod.yml

# 一键启动
docker compose -f docker-compose.prod.yml up -d
```

访问 `http://localhost:9090` 即可使用。

## 🚀 方式二：源码构建部署

```bash
git clone https://github.com/phantomxjc/aurora-blog.git
cd aurora-blog
docker compose up -d --build
```

## 🚀 方式三：推送镜像到自己的 Docker Hub

```bash
git clone https://github.com/phantomxjc/aurora-blog.git
cd aurora-blog

# 登录 Docker Hub
docker login

# 构建并推送（修改 DOCKER_USER 为你的用户名）
DOCKER_USER=your-username ./docker-push.sh
```

推送完成后，任何人只需拉取你的镜像即可部署。

## 📋 访问地址

| 服务       | 地址                         | 说明         |
| ---------- | ---------------------------- | ------------ |
| 统一入口   | http://localhost:9090        | 代理入口     |
| 博客前台   | http://localhost:9090/       | 面向访客     |
| 管理后台   | http://localhost:9090/admin/ | 发文管理     |
| API        | http://localhost:9090/api/   | 后端接口     |

## 🔑 默认管理员

- 用户名: `admin`
- 密码: `admin123`

## 🏗 架构

```
aurora-blog/
├── blog/                  # 博客前台 (Next.js 14 + Tailwind CSS)
├── api/                   # 后端 API (Express + Prisma + SQLite)
├── admin/                 # 管理后台 (Vue 3 + Tailwind CSS)
├── proxy.js               # 统一代理 (Node.js http-proxy)
├── docker-compose.yml     # 源码构建部署
├── docker-compose.prod.yml # 镜像拉取部署
├── docker-push.sh         # 构建推送脚本
└── Dockerfile             # 代理服务镜像
```

### Docker 容器架构

```
docker compose up -d
  ├── api     (Express + Prisma + SQLite)  :3002  ← 自动初始化数据库
  ├── blog    (Next.js 14 SSR)             :3000
  ├── admin   (Vue 3 静态)                 :5174
  └── proxy   (Node.js 统一代理)           :8080  ← 入口
```

## 🔧 开发模式

```bash
# 1. 后端 API (端口 3002)
cd api && npm install && npx prisma db push && npx tsx scripts/seed.ts && npx tsx src/main.ts

# 2. 博客前台 (端口 3000)
cd blog && npm install && npm run dev

# 3. 管理后台 (端口 5174)
cd admin && npm install && npm run dev

# 4. 统一代理 (端口 8080)
cd .. && npm install && node proxy.js
```

## 📄 License

MIT License
