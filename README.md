# vasbc

Victory Avenue Swatow Baptist Church（勝利道潮語浸信會）與木川共享空間網站原型，使用 Next.js App Router、Tailwind CSS、Framer Motion 與 Shadcn-style UI 元件。

## 開發

```bash
npm install
npm run dev
```

## 後台登入

- 路徑：`/admin/login`
- 預設密碼：`vasbc-admin`（可用 `ADMIN_PASSCODE` 環境變數覆蓋）

## 近期更新

### 分頁功能與詳細頁面
- 新增 `Pagination` 元件（`src/components/pagination.tsx`），供所有列表頁共用。
- 文章（`/articles`）、宣教（`/missions`）、公告（`/announcements`）、佈道（`/sermons-topics`）、招聘（`/recruitment`）頁面均改為伺服器端分頁。
- 新增文章詳細頁 `/articles/[id]` 與宣教報導詳細頁 `/missions/[id]`。
- 新增 `WritingDetail` 元件（`src/components/writing-detail.tsx`）作為詳細頁共用模板。

### 宣教工場管理（後台）
- 後台新增「宣教工場」區塊（`admin-sections.ts`），支援新增、編輯、刪除宣教報導。
- 對應 CMS 動作：`addMissionaryAction`、`updateMissionaryAction`、`deleteMissionaryAction`（`src/app/actions/cms.ts`）。

### 資料層分頁函式
- `src/lib/cms-storage.ts` 新增：
  - `getNewsPaginated` — 公告分頁查詢
  - `getAssemblyPaginated` — 佈道/崇拜分頁查詢
  - `getWritingsByTypePaginated` — 文章依類型分頁查詢
  - `getWritingById` — 依 ID 取得單筆文章

### 其他
- 聯絡表單拆分為獨立元件 `contact-form.tsx`（`/contact-us`）。
- UI 元件（`badge`、`button`、`card`）與全域樣式小幅調整。
- 首頁、導覽列、`SimplePage` 元件重構。
