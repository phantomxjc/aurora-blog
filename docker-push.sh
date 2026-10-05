#!/bin/bash
# ============================================================================
# 🌌 Aurora Blog — Docker 镜像构建 & 推送脚本
# 
# 使用方法:
#   1. 确保已安装 Docker 并已启动
#   2. 登录 Docker Hub: docker login
#   3. 运行: ./docker-push.sh
#
# 推送完成后，任何人只需:
#   docker compose -f docker-compose.prod.yml up -d
# ============================================================================

set -e

# 配置 — 修改为你的 Docker Hub 用户名
DOCKER_USER="${DOCKER_USER:-phantomxjc}"
IMAGE_PREFIX="${DOCKER_USER}/aurora-blog"
VERSION="${VERSION:-latest}"

echo "🌌 Aurora Blog — Docker 镜像构建推送"
echo "   Docker Hub 用户: $DOCKER_USER"
echo "   镜像前缀: $IMAGE_PREFIX"
echo "   版本: $VERSION"
echo ""

# 检查 Docker
if ! command -v docker &>/dev/null; then
  echo "❌ Docker 未安装，请先安装 Docker"
  exit 1
fi

# 检查登录状态
if ! docker info 2>/dev/null | grep -q "Username:"; then
  echo "⚠️  未登录 Docker Hub，请先执行: docker login"
  docker login
fi

echo ""
echo "📦 构建 4 个镜像..."

# 1. API
echo "  [1/4] 构建 API 镜像..."
docker build -t "${IMAGE_PREFIX}-api:${VERSION}" ./api

# 2. Blog
echo "  [2/4] 构建 Blog 镜像..."
docker build -t "${IMAGE_PREFIX}-blog:${VERSION}" ./blog

# 3. Admin
echo "  [3/4] 构建 Admin 镜像..."
docker build -t "${IMAGE_PREFIX}-admin:${VERSION}" ./admin

# 4. Proxy
echo "  [4/4] 构建 Proxy 镜像..."
docker build -t "${IMAGE_PREFIX}-proxy:${VERSION}" .

echo ""
echo "📤 推送镜像到 Docker Hub..."

docker push "${IMAGE_PREFIX}-api:${VERSION}"
docker push "${IMAGE_PREFIX}-blog:${VERSION}"
docker push "${IMAGE_PREFIX}-admin:${VERSION}"
docker push "${IMAGE_PREFIX}-proxy:${VERSION}"

echo ""
echo "✅ 全部完成！"
echo ""
echo "📋 镜像列表:"
echo "   ${IMAGE_PREFIX}-api:${VERSION}"
echo "   ${IMAGE_PREFIX}-blog:${VERSION}"
echo "   ${IMAGE_PREFIX}-admin:${VERSION}"
echo "   ${IMAGE_PREFIX}-proxy:${VERSION}"
echo ""
echo "🚀 一键拉取部署:"
echo "   docker compose -f docker-compose.prod.yml up -d"
echo ""
echo "   访问地址:"
echo "   博客前台: http://localhost:8080/"
echo "   管理后台: http://localhost:8080/admin/"
echo "   默认账号: admin / admin123"
