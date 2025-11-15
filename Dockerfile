# ====== Dependencies 階段 ======
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

# ====== Builder 階段 ======
FROM node:20-alpine AS builder
WORKDIR /app

# 複製依賴
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# 設定構建時的環境變數
ARG DATABASE_URL="mysql://root:password@localhost:3306/zeabur"
ENV DATABASE_URL=${DATABASE_URL}
ENV NEXT_TELEMETRY_DISABLED=1

# 產生 Prisma 客戶端
RUN npx prisma generate

# 構建應用程式 (這會處理所有的 CSS 和 PostCSS)
RUN npm run build

# ====== Production dependencies 階段 ======
FROM node:20-alpine AS prod-deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --only=production && npm cache clean --force

# ====== Runtime 階段 ======
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# 創建 nextjs 用戶
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# 設定數據庫 URL (會被 Zeabur 環境變數覆蓋)
ARG DATABASE_URL="mysql://root:password@localhost:3306/zeabur"
ENV DATABASE_URL=${DATABASE_URL}

# 複製必要文件
COPY --from=builder /app/package.json ./
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma

# 複製構建產物 (.next 資料夾包含所有處理過的 CSS)
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=prod-deps --chown=nextjs:nodejs /app/node_modules ./node_modules

# 複製啟動腳本
COPY --chown=nextjs:nodejs docker-start.sh ./docker-start.sh
RUN chmod +x docker-start.sh

# 切換到 nextjs 用戶
USER nextjs

EXPOSE 3000

# 啟動前執行 migrate，然後啟動 Next.js
CMD ["./docker-start.sh"]
