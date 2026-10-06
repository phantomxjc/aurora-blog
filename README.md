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
- 🔄 **CI/CD 自动构建** — 推送代码即自动发布镜像，零配置

## 🚀 方式一：一键拉取（推荐）

无需 clone 源码，直接拉取预构建镜像（来自 GitHub Container Registry，由 CI 自动构建）：

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

## 🔄 CI/CD 自动构建

本项目使用 GitHub Actions + GHCR（GitHub Container Registry）实现零配置自动构建。

- **触发条件**：推送到 `main` 分支，或打 `v*` 标签（如 `v1.0.0`）
- **镜像仓库**：`ghcr.io/phantomxjc/aurora-blog-{api,blog,admin,proxy}`
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
