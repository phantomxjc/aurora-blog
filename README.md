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
- 🐳 **Docker 一键部署** — 单条命令拉起全部服务
- 🔄 **CI/CD 自动构建** — 推送代码即自动发布镜像，零配置

## 🚀 方式一：单容器部署（推荐）

一个镜像包含全部服务，一条命令搞定：

```bash
docker run -d --name aurora \
  -p 9090:9090 -p 3000:3000 -p 3002:3002 -p 5174:5174 \
  -v ./data:/data \
  ghcr.io/phantomxjc/aurora-blog:latest
```

| 端口 | 服务 | 说明 |
|------|------|------|
| 9090 | Proxy | 统一入口，自动路由到各服务 |
| 3000 | Blog | Next.js 前端（可直连） |
| 3002 | API | Express 后端（可直连） |
| 5174 | Admin | Vue 3 管理后台（可直连） |

数据持久化在 `./data` 目录（数据库 + 上传图片）。访问 `http://localhost:9090` 即可使用。

## 🚀 方式二：Docker Compose 部署

适合需要独立扩展单个服务的场景：

```bash
curl -O https://raw.githubusercontent.com/phantomxjc/aurora-blog/main/docker-compose.prod.yml
docker compose -f docker-compose.prod.yml up -d
```

## 🚀 方式三：源码构建部署

```bash
git clone https://github.com/phantomxjc/aurora-blog.git
cd aurora-blog
docker compose up -d --build
```

## 🔄 CI/CD 自动构建

本项目使用 GitHub Actions + GHCR（GitHub Container Registry）实现零配置自动构建。

- **触发条件**：推送到 `main` 分支，或打 `v*` 标签（如 `v1.0.0`）
- **镜像仓库**：`ghcr.io/phantomxjc/aurora-blog`（all-in-one）+ `aurora-blog-{api,blog,admin,proxy}`（独立服务）
- **认证方式**：GitHub 内置 `GITHUB_TOKEN`，无需手动配置任何 secrets
- **标签策略**：
  - `latest` — main 分支最新构建
  - `1.0.0` / `1.0` — 打 `v1.0.0` 标签时自动生成语义化版本标签
  - `sha-xxxxxx` — 每次构建的 commit 短哈希

### 可选：同步到 Docker Hub

如果还想同步推送到 Docker Hub，在仓库 Settings → Secrets 添加：

- `DOCKERHUB_USERNAME` — Docker Hub 用户名
- `DOCKERHUB_TOKEN` — Docker Hub access token

配置后 CI 会自动将镜像同步到 `docker.io/<username>/aurora-blog-*`，不配置则跳过。

## 📄 License

MIT License
