# Member Admin Portal

依據 `SPEC.md` 實作的 Next.js + Prisma 會員後台。

## 開發需求

- Node.js 18+
- MySQL 8 / PlanetScale / 其他兼容 MySQL

## 安裝

```bash
npm install
```

## Prisma

```bash
npx prisma generate
npx prisma migrate dev --name init   # 需要先設定 DATABASE_URL
npm run seed                         # 建立管理員
```

## 啟動

```bash
npm run dev
```

## 測試

```bash
npm test
```

## 環境變數 (.env)

參考 `.env.example`。

## TODO

- 改用更安全的 Session / NextAuth
- 增加刪除確認與軟刪除
- 加入分頁元件抽離、UI 優化
