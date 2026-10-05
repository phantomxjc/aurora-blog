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
- 🐳 **Docker 一键部署** — `docker compose up -d`

## 🏗 架构

```
aurora-blog/
├── blog/           # 博客前台 (Next.js 14 + Tailwind CSS)
├── api/            # 后端 API (Express + Prisma + SQLite)
├── admin/          # 管理后台 (Vue 3 + Tailwind CSS)
├── proxy.js        # 统一代理 (Node.js http-proxy)
├── docker-compose.yml
└── Dockerfile      # 代理服务镜像
```

## 🚀 一键部署 (Docker)

```bash
git clone https://github.com/phantomxjc/aurora-blog.git
cd aurora-blog
docker compose up -d --build
```

启动后访问：

| 服务       | 地址                    | 说明         |
| ---------- | ----------------------- | ------------ |
| 统一入口   | http://localhost:8080   | 代理入口     |
| 博客前台   | http://localhost:8080/  | 面向访客     |
| 管理后台   | http://localhost:8080/admin/ | 发文管理 |
| 后端 API   | http://localhost:8080/api/   | API 接口 |

## 🔧 开发模式

```bash
# 1. 启动后端 API (端口 3002)
cd api && npm install && npx prisma db push && npx tsx scripts/seed.ts && npx tsx src/main.ts

# 2. 启动博客前台 (端口 3000)
cd blog && npm install && npm run dev

# 3. 启动管理后台 (端口 5174)
cd admin && npm install && npm run dev

# 4. 启动统一代理 (端口 8080)
cd .. && npm install && node proxy.js
```

## 🔑 默认管理员

- 用户名: `admin`
- 密码: `admin123`

## 📁 目录结构

```
blog/
├── src/app/             # Next.js App Router 页面
│   ├── page.tsx         # 首页
│   ├── posts/[slug]/    # 文章详情
│   ├── archive/         # 归档
│   ├── tags/            # 标签
│   ├── search/          # 搜索
│   ├── dynamics/        # 动态
│   ├── projects/        # 项目
│   └── about/           # 关于
├── src/components/      # 组件
└── src/lib/api.ts       # API 客户端

api/
├── src/routes/          # API 路由
│   ├── auth.ts          # 认证
│   ├── posts.ts         # 文章 CRUD
│   ├── dynamics.ts      # 动态
│   ├── projects.ts      # 项目
│   ├── tags.ts          # 标签
│   ├── images.ts        # 图片上传
│   └── settings.ts      # 设置
├── src/utils/           # 工具函数
├── prisma/schema.prisma # 数据模型
└── scripts/seed.ts      # 种子数据

admin/
├── src/views/           # 页面组件
├── src/layout/          # 布局
├── src/router/          # 路由
├── src/stores/          # Pinia 状态
└── src/api/             # API 客户端
```

## 📄 License

MIT License
