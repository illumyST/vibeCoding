# 會員管理系統規格書 (Member Admin Portal)

## 1. 專案總覽
- 專案名稱：會員管理系統 (Member Admin Portal)
- 目標：提供管理員登入後進行會員 CRUD、搜尋、列表檢視的後台介面。
- 技術堆疊：
  - 前端：Next.js (React) + TypeScript (App Router)
  - UI：Tailwind CSS（可替換為其他 UI Library）
  - ORM：Prisma
  - 資料庫：MySQL
  - 驗證：管理員 Email + 密碼（建議使用 NextAuth.js Credentials Provider）
  - Zeabur 部署

## 2. 角色與權限
| 角色 | 說明 | 權限 |
|------|------|------|
| Admin | 系統管理員 | 登入、會員新增/編輯/刪除、搜尋、列表瀏覽 |
| Guest | 未登入使用者 | 只能看到登入頁 |

> 未來可擴充一般會員角色（目前不在範圍）。

## 3. 功能需求 (Functional Requirements)
1. 登入：輸入 Email + 密碼，成功後建立 Session。
2. 登出：清除 Session/Cookie。
3. 新增會員：提交表單（姓名、電話、email、生日、備註）。
4. 編輯會員：更新任一欄位（email 變更需檢查唯一）。
5. 刪除會員：硬刪除（可擴充軟刪除）。
6. 會員列表：分頁顯示、可排序（預設建立時間 DESC）。
7. 搜尋會員：支援姓名、電話、email 模糊/部分比對；可多條件 AND 組合。
8. 表單驗證：前端初步 + 後端最終驗證；錯誤回傳統一格式。
9. 管理員初始化：首次執行若無管理員，自動建立 seed 帳號。
10. 錯誤處理：統一錯誤物件格式。  

## 4. 非功能需求 (NFR)
- 安全性：密碼使用 bcrypt 雜湊（cost 10-12）。
- 效能：查詢分頁 + 關鍵欄位索引；避免 N+1。
- 可維護性：TypeScript 全型別；結構清晰（分層：pages/app、components、lib）。
- 可測試性：後端單元測試 + 基礎 E2E。 
- 可擴充性：可增加角色、標籤、匯出功能。

## 5. 資料模型 (Prisma Schema 草稿)
```prisma
model Admin {
  id           Int      @id @default(autoincrement())
  email        String   @unique
  passwordHash String
  name         String
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}

model Member {
  id        Int      @id @default(autoincrement())
  name      String
  phone     String
  email     String   @unique
  birthday  DateTime?  // 生日可為空
  note      String?    // 備註可為空
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  // 若要軟刪除可加: deletedAt DateTime?

  @@index([name])
  @@index([phone])
  @@index([email])
}
```

## 6. API 規格 (REST / Route Handlers)
Base Path: `/api`

### Auth
- POST `/api/auth/login`
  - Body: `{ email, password }`
  - Response: `{ success: true }` 或錯誤
- POST `/api/auth/logout`

### Members
- GET `/api/members`
  - Query: `page`, `pageSize`, `searchName?`, `searchPhone?`, `searchEmail?`
  - Response: `{ data: Member[], page, total, totalPages }`
- POST `/api/members`
  - Body: `{ name, phone, email, birthday?, note? }`
  - Response: `Member`
- GET `/api/members/:id`
  - Response: `Member`
- PUT `/api/members/:id`
  - Body: 同新增
  - Response: `Member`
- DELETE `/api/members/:id`
  - Response: `{ success: true }`

### 統一錯誤格式
```json
{
  "errorCode": "VALIDATION_ERROR",
  "message": "欄位格式錯誤",
  "details": { "email": "已存在" }
}
```

HTTP 狀態碼：400 驗證失敗 / 401 未授權 / 404 資源不存在 / 409 衝突 (Email 重複) / 500 伺服器錯誤。

## 7. 驗證規則 (Validation Rules)
| 欄位 | 規則 |
|------|------|
| name | 長度 1-100 |
| phone | 僅數字或加號、減號；長度 6-20 |
| email | 基本 email 格式；唯一 |
| birthday | 不可晚於今日 |
| note | 最長 2000 字 |
| password (admin seed) | >= 8 字，含至少 1 數字 |

## 8. 前端頁面與元件
Pages/Routes：
- `/login`
- `/dashboard`（總覽：會員總數等簡易統計）
- `/members`（列表 + 搜尋 + 分頁）
- `/members/new`
- `/members/[id]/edit`
- （可選）`/members/[id]` 詳細頁

核心元件：
- `MemberForm`
- `MemberSearchBar`
- `Pagination`
- `ProtectedLayout` / `AuthGuard`
- `Navbar` / `Sidebar`

狀態管理：SWR 或 React Query（建議 React Query）。
UI：Tailwind + Headless UI（可選）。

## 9. 認證與授權
建議使用 NextAuth.js：
- Credentials Provider：比對 email + passwordHash。
- Session 儲存在加密 Cookie。
- Middleware 保護 `/dashboard`, `/members*` 路由。

若自行實作：
- POST login 時簽發 HttpOnly Cookie（JWT / session id）。
- 建立 `lib/auth.ts` 處理驗證邏輯。

## 10. 系統架構分層
```
/copilot
  ├─ app/                # Next.js App Router
  │   ├─ login/page.tsx
  │   ├─ dashboard/page.tsx
  │   ├─ members/page.tsx
  │   ├─ members/new/page.tsx
  │   ├─ members/[id]/edit/page.tsx
  │   └─ api/            # Route Handlers
  │        ├─ auth/login/route.ts
  │        ├─ auth/logout/route.ts
  │        ├─ members/route.ts      (GET, POST)
  │        ├─ members/[id]/route.ts (GET, PUT, DELETE)
  ├─ prisma/
  │   └─ schema.prisma
  ├─ lib/
  │   ├─ prisma.ts        # Prisma client 單例
  │   ├─ validation.ts    # Zod schema
  │   ├─ auth.ts          # 登入驗證封裝
  │   └─ errors.ts        # 錯誤型別與建立工具
  ├─ components/
  │   ├─ MemberForm.tsx
  │   ├─ MemberTable.tsx
  │   ├─ SearchBar.tsx
  │   ├─ Pagination.tsx
  │   ├─ Layout.tsx
  │   └─ AuthGuard.tsx
  ├─ scripts/
  │   └─ seed-admin.ts
  ├─ .env.example
  └─ README.md
```

## 11. 環境設定 (.env)
```
DATABASE_URL="mysql://user:password@localhost:3306/members"
ADMIN_SEED_EMAIL="admin@example.com"
ADMIN_SEED_PASSWORD="ChangeMe123"
NEXTAUTH_SECRET="請使用 `openssl rand -base64 32` 產生"
NEXTAUTH_URL="http://localhost:3000"
```

## 12. 開發流程步驟
1. 建立 Next.js 專案：`npx create-next-app@latest copilot --typescript`
2. 安裝套件：`npm install prisma @prisma/client bcrypt next-auth @types/bcrypt zod react-query`
3. 初始化 Prisma：`npx prisma init`
4. 編寫 `schema.prisma` 模型 → `npx prisma migrate dev --name init`
5. 撰寫 `lib/prisma.ts`、驗證 schema（Zod）。
6. 撰寫 seed 腳本建立管理員：`ts-node scripts/seed-admin.ts`。
7. 實作 Auth Route Handler → 套入 NextAuth。
8. 實作 Members API（列表 / 新增 / 編輯 / 刪除）。
9. 前端頁面與元件。
10. 加入分頁與搜尋邏輯。
11. 撰寫測試（基本單元 / E2E）。
12. 文件與部署設定（Docker 或雲端）。

## 13. 測試規劃
- 單元測試：
  - 驗證函式（email、phone、birthday）
  - 登入密碼比對
  - 會員建立邏輯（唯一性）
- E2E：
  - 登入流程
  - 新增→搜尋→編輯→刪除流程閉環
- 工具：Jest + Testing Library（前端） / Playwright（E2E 可選）。

## 14. 安全性
- 密碼：bcrypt（避免明文）
- Cookie：HttpOnly + Secure（Production）
- CSRF：NextAuth 預設防護（自行實作需再補）
- Rate Limiting：登入失敗次數限制（可後續加）
- XSS：不使用 `dangerouslySetInnerHTML`；顯示文字做 escape（React 預設安全）
- SQL Injection：Prisma ORM 已處理

## 15. 效能與索引
- 分頁 `LIMIT/OFFSET` 或 cursor（未來大量資料可改 cursor）。
- 索引：`name`, `phone`, `email`。
- 搜尋策略：LIKE '%keyword%'（後續可升級全文搜尋）。

## 16. 里程碑 (Milestones)
| Milestone | 描述 | 預估 | 交付物 |
|-----------|------|------|--------|
| M1 | 專案初始化 + Prisma | Day 1 | 專案骨架、schema.prisma | 
| M2 | 管理員登入 | Day 2 | Auth API + Login Page |
| M3 | 會員 CRUD API | Day 2-3 | Route Handlers 完成 |
| M4 | 前端頁面與表單 | Day 3-4 | Members UI |
| M5 | 搜尋 + 分頁 | Day 4 | 搜尋介面與 API 參數 |
| M6 | 測試撰寫 | Day 5 | 單元 + 基本 E2E |
| M7 | 文件與部署 | Day 6 | README、環境設定 |

## 17. 風險與備援
| 風險 | 說明 | 緩解 |
|------|------|------|
| DB 結構頻繁變動 | 功能迭代初期 | 嚴格使用 migration + PR review |
| 管理員密碼遺失 | 無重設功能 | 增加 reset script 或後台修改功能 |
| 大量搜尋性能 | LIKE 效能差 | 未來引入全文索引或 ElasticSearch |
| 部署連線數限制 | 無 pool 管理 | 調整 Prisma 連線設定 / 使用 serverless-friendly DB |

## 18. 未來擴充方向
- 會員角色登入前台
- 匯入/匯出 CSV
- 標籤與群組分類
- 行為/操作紀錄 (Audit Log)
- 活動訂閱 / Email 通知
- Cursor-based 分頁 + 高級搜尋（ElasticSearch）

## 19. Acceptance Criteria (驗收標準)
- 管理員可成功登入登出。
- 新增會員後可於列表與搜尋結果看到。
- 編輯與刪除操作後資料正確更新或移除。
- Email 唯一性後端強制；錯誤訊息易讀。
- 分頁與搜尋在 1000 筆測試資料下反應 < 1s（本地）。
- 失敗登入給出明確錯誤（不洩漏是否帳號存在）。

## 20. 待決策項目（Needs Decision）
| 項目 | 選項 | 建議 |
|------|------|------|
| Auth 實作方式 | NextAuth / Custom | NextAuth 加快速度 |
| 刪除方式 | 硬刪 / 軟刪 | 先硬刪，之後再加軟刪欄位 |
| 分頁策略 | offset / cursor | 先 offset，未來升級 cursor |
| UI 套件 | Tailwind / MUI / Chakra | Tailwind + Headless UI |
| 測試框架 | Jest / Vitest | Jest（Next.js 範例多） |

---
如需接下來直接生成初始 Next.js 專案與 Prisma 檔案，請告訴我，我會開始建立骨架。