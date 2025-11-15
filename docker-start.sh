#!/bin/sh
set -e

echo "Prisma migrate deploy..."
# 若尚未有 migration 檔案，這指令會安全跳過
npx prisma migrate deploy || echo "migrate deploy skipped"

echo "Starting Next.js (port: ${PORT:-3000})"
exec npm run start
