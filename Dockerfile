# 基礎映像：使用較小的 Alpine 版本 (Node 20)
FROM node:20-alpine AS builder

# 設定工作目錄
WORKDIR /app

COPY package.json package-lock.json* ./
# 使用 npm ci 取得一致且乾淨的依賴 (含 devDependencies 供編譯 Tailwind/TypeScript)
RUN npm ci

# 複製原始碼
COPY . .

ARG DATABASE_URL="mysql://root:password@localhost:3306/zeabur"
ENV DATABASE_URL=${DATABASE_URL}
RUN npx prisma generate

# 進行 Next.js 編譯
RUN npm run build

# 移除 devDependencies 降低 runtime 體積
RUN npm prune --production

# ====== Runtime 階段 ======
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

### 請在 Zeabur 平台上設定 DATABASE_URL，這裡留空或使用 ARG 作為 fallback ###
ARG DATABASE_URL="mysql://root:password@localhost:3306/zeabur"
ENV DATABASE_URL=${DATABASE_URL}

# Prisma 於 runtime 常需要查詢資料庫；若需 migrate，可在入口點腳本處理
# 建議：容器啟動時執行 `npx prisma migrate deploy`（可在 ENTRYPOINT 或 CMD 前加一層腳本）

# 複製必要輸出
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/app ./app
COPY --from=builder /app/components ./components
COPY --from=builder /app/lib ./lib

# 可選：健康檢查（依實際 API 路徑）
# HEALTHCHECK --interval=30s --timeout=5s --retries=3 CMD wget -qO- http://localhost:3000/api/health || exit 1

EXPOSE 3000

# 啟動前執行 migrate，然後啟動 Next.js
COPY docker-start.sh ./docker-start.sh
RUN chmod +x docker-start.sh
CMD ["./docker-start.sh"]
