#!/bin/sh
set -e

mkdir -p /data/uploads /data/db

# 数据库：首次启动初始化，后续挂载复用
if [ ! -f /data/db/dev.db ]; then
  echo "[entrypoint] 首次启动，初始化数据库..."
  cd /app/api
  npx prisma db push --skip-generate 2>/dev/null
  npx tsx scripts/seed.ts 2>/dev/null
  cp prisma/dev.db /data/db/dev.db
  cd /app
fi
ln -sf /data/db/dev.db /app/api/prisma/dev.db

# 上传文件持久化
ln -sf /data/uploads /app/api/uploads

echo "[entrypoint] 启动 4 个服务..."
exec pm2-runtime ecosystem.config.js
