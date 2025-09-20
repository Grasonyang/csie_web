# Manage 後台規劃指南（v1）

本文描述 `/manage` 相關頁面的資訊架構、元件配置、資料流程、語系規則與測試策略，提供前後端協作時的詳細規範。所有描述皆以「背景乾淨、元件簡潔、語系完整」為基準。

---

## 1. 全域架構

### 1.1 Layout 與共享元素
- 採用 `resources/js/layouts/manage/manage-layout.tsx` 為骨架：
  - 左側 Sidebar 依角色載入對應版本，固定寬度、支援折疊；右側主內容置於 `AppContent`。
  - 右側背景使用 `#f5f7fb`，內容區塊以白色卡片呈現（圓角 + 陰影 + `ring-1`）。
  - `AppSidebarHeader` 產生 Breadcrumbs 與標題列；所有頁面需傳入 `breadcrumbs` 陣列。
  - Footer 以 `AdminFooter` 渲染於白卡片內，維持簡潔。
- 所有頁面盡量復用現有 `Card`、`PageHeader`、`FormSection`、`DataTable` 等元件，避免自製複雜 UI。
- 頁面背景禁止放置多餘圖片/花紋，如需裝飾採用單色漸層或淡色區塊。

### 1.2 語言切換
- 語系切換統一走 `/lang/{locale}` 路由（`locale` 與 `lang` 皆可，用 `lang` 為主要 entry）。
- 每個 Manage 元件使用 `useTranslator('manage')` 存取字串；新增功能時需同步更新 `lang/en/manage.php` 與 `lang/zh-TW/manage.php`。
- 共用字串（例如通知訊息）可置於 `lang/*/common.php`，但需提供命名空間區分。
- 後端回傳資料若含文字欄位（title/content 等），必須同時提供 zh-TW/en，前端依 `usePage().props.locale` 顯示。

### 1.3 資料流與授權
- 所有 Controller 先透過 Policy 驗證角色權限，再載入資料。
- 列表頁面使用 Inertia 回傳分頁資料、篩選條件、統計資訊；前端不要自行拼 query。
- 建立/更新動作須透過 FormRequest 或 `validate()`，並在 Controller 呼叫 `Action`/Service 處理商業邏輯（如附件同步）。
- 每個 Controller method 需撰寫對應 Feature Test（詳見 §8）。

---

## 2. 角色導覽與路由

### 2.1 Sidebar 設計
| 角色 | 導覽項目 | 備註 |
| --- | --- | --- |
| Admin | Dashboard、公告、附件、系所成員、實驗室、學程/課程、研究成果、聯絡訊息、使用者 | 沿用 `AppSidebar` 配置，新增項目需在 `lang/*/manage.php` 更新對應 key。 |
| Teacher | Dashboard、公告、研究、課程活動、個人設定、教學指南 | 現有 `teacher/sidebar.tsx` 已定義項目；實作頁面時須建立 `/manage/teacher/*` 路由。 |
| User | Dashboard、個人資料、外觀、資安、支援文件 | 導向既有 `/settings` 表單；後續可加上通知中心。 |

### 2.2 路由
- 根據 `routes/manage.php`：
  - `/manage` → `/manage/dashboard`（共用首頁）。
  - `/manage/admin/*`：完整資源路由（`Route::resource`）+ 自訂附件還原/永久刪除。
  - `/manage/teacher/*`、`/manage/user/*`：目前為空白群組，需依本文件規劃逐步補齊。
- 路由命名規則：`manage.{role}.{resource}.{action}`，例如 `manage.admin.posts.index`、`manage.teacher.posts.create`。
- 語言切換連結：`route('lang.set', ['locale' => 'en'])`，任何自訂切換 UI 必須呼叫該路由。

---

## 3. Admin 頁面規劃

### 3.1 Dashboard
- Controller：`Manage\Admin\DashboardController`（需透過 `BuildAdminDashboardData` Action 取得資料）。
- 資料欄位：
  - 指標：`totalPosts`、`publishedPosts`、`draftPosts`、`archivedPosts`、`pinnedPosts`、`totalUsers`。
  - 附件統計：`total`、`images`、`documents`、`links`、`trashed`、`totalSize`（byte）。
  - 最新公告：陣列包含 `id`、`title`、`title_en`、`status`、`publish_at`、`attachments_count`、`category`。
  - 最新附件：`id`、`title`、`type`、`file_size`、`created_at`、`attachable`（含 type/id/label）。
- 前端組成：
  - 兩行卡片：第一行顯示指標統計、第二行顯示附件統計。
  - 列表卡片：最近公告、最近附件、聯絡訊息狀態餅圖。
  - 頂部提供「快速建立公告」等 CTA，使用 `useForm` 串連。

### 3.2 公告管理 `/manage/admin/posts`
- 列表 (index)：
  - 篩選條件：`search`、`category`、`status`、`pinned`（all/only/exclude）、`per_page`。
  - 資料表欄：標題（含語系切換 tooltip）、分類、狀態、發布時間、附件數、操作按鈕。
  - 操作：查看、編輯、刪除、管理附件（導向附件頁帶入 query）。
- 建立/編輯 (create/edit)：
  - 表單分區：
    1. 基本資訊：分類、作者（唯讀）、狀態、置頂、發布/下架時間。
    2. 內容：標題 zh-TW/en、摘要 zh-TW/en、內容 zh-TW/en。
    3. 來源：`source_type`（manual/link），`source_url`（link 必填且需 URL 驗證）。
    4. 附件：
       - 檔案上傳（多檔、上限 20MB/檔）。
       - 外部連結表格（欄位：標題、URL）。
       - 附件清單，可調整排序（後續迭代）。
  - 驗證回饋：以 `toast` 呈現成功訊息；錯誤訊息需顯示於欄位下方並支援雙語。
- 詳情 (show)：
  - 顯示多語內容、發布狀態、附件列表（含下載/開啟連結）。
  - 提供「切換語系」按鈕直接呼叫 `/lang/*`。

### 3.3 附件管理 `/manage/admin/attachments`
- 篩選：`search`、`type`、`attachable_type`、`attachable_id`、`trashed`（all/with/only）、`per_page`。
- 表格：檔名/標題、類型、大小、關聯物件（含連結至來源頁）、建立時間、操作。
- 操作：軟刪除、還原、永久刪除；刪除前需確認對話框。
- 導覽整合：從公告列表點「管理附件」時，帶入 `attachable_type=Post` 與 `attachable_id`，頁面需顯示目前的過濾條件。
- 後端同步：刪除本地檔案時由 Controller 處理（目前 `PostController::syncAttachments` 已實作）。

### 3.4 其他資源（後續迭代）
- Staff/Teacher/Lab/Program/Course/Project/Publication 控制器已存在路由，需依模型補齊畫面：
  - 共通元素：列表 + 詳情 + 表單，多語欄位輸入規則與公告一致。
  - 教師/實驗室關聯需提供關聯選單與排序功能。

---

## 4. Teacher 管理區

### 4.1 Dashboard
- 顯示教師專屬指標：個人公告數、最近更新課程、實驗室動態。
- 提供常用操作卡片（公告、研究、課程、個人設定），語系字串取自 `manage.sidebar.teacher` 與 `manage.dashboard.teacher`。

### 4.2 公告
- 路由建議：`/manage/teacher/posts`。
- 權限：限制只可操作自己建立的 `Post` 或指派給該教師的公告。
- 功能：
  - 列表與 Admin 類似，但篩選項目簡化（僅顯示自己資料）。
  - 建立公告時預設 `source_type=manual`，可選擇是否同步到系統公告（需後端討論）。

### 4.3 研究與實驗室
- 頁面：
  - `labs`：顯示教師參與的實驗室，可編輯介紹與聯絡方式。
  - `projects`、`publications`：提供列表與編輯表單；可上傳相關附件。
- 欄位：沿用模型欄位，維持多語輸入。

### 4.4 課程與活動
- 管理教師授課資訊（與 `Course` 模型或外部連結整合）。
- 表單需支援：課程名稱 zh-TW/en、學期、課程代碼、課綱連結、附件。

### 4.5 個人設定
- 整合既有 `/settings/profile`、`/settings/security`、`/settings/appearance`；於 Sidebar 提供捷徑。
- 表單提交後顯示成功訊息並停留在 Manage layout。

---

## 5. User 管理區
- Dashboard：顯示最近活動、通知、帳號安全狀態。
- Profile：沿用 Settings 表單，需將語系字串拆分至 `manage.sidebar.user` 與 `settings` 模組。
- Appearance：切換主題、語言（與 `/lang` 路由互動）。
- Security：更改密碼、2FA（預留）。
- Support：連結 FAQ 或 GitHub issue。

---

## 6. 表單與元件細節
- 共用樣式：卡片採 `rounded-3xl`、`shadow-sm`、`ring-1 ring-black/5`；表單欄位保持 `space-y-6` 間距。
- 按鈕：主色為 `bg-[#0f1c3f]`（深藍），hover 變亮；次要按鈕使用 `outline` 樣式。
- 表單驗證：`errors` 需支援 zh-TW/en，並在欄位下方顯示；整體錯誤使用 `Alert`。
- 附件上傳：
  - 使用現有 `FileUploader` 元件（若無需新增時請實作簡潔版本）。
  - 上傳完成後即時更新附件列表，並提供刪除/預覽按鈕。
- Breadcrumbs：格式 `[ { label: t('layout.breadcrumbs.posts'), href: route('manage.admin.posts.index') }, ... ]`。

---

## 7. 後端整合需求
- PostController：維持 `index/create/store/show/edit/update/destroy`，並確保 `syncAttachments` 支援排序、刪除、連結。
- AttachmentController：補齊還原/永久刪除的授權測試，並確保查詢條件支援教師模式。
- DashboardController：透過 Action 注入資料，避免 Controller 塞滿查詢。
- Teacher/User 控制器：建立共用 Trait 處理 Breadcrumb 與語系資料。
- API 回傳：
  - 分頁資料需含 `meta` 與 `links`，前端 `DataTable` 以此渲染。
  - 所有日期採 ISO8601 字串；前端使用 `dayjs` 顯示。

---

## 8. 測試策略
- Feature Test：
  - `Manage/Admin/PostControllerTest`
    - index 篩選（狀態/分類/置頂）
    - create/store（manual/link 兩種來源，附件建立）
    - update（內容修改、附件刪除、連結新增）
    - destroy（軟刪除、權限限制）
  - `Manage/Admin/AttachmentControllerTest`
    - index 篩選、含軟刪除
    - destroy/restore/forceDelete 行為
  - Dashboard：驗證 Action 回傳資料格式與數值。
- 前端測試：
  - Jest：公告表單（切換來源、上傳附件、語系切換）、附件列表（篩選/翻頁）。
  - Storybook（若可）：建立公告表單與附件列表的視覺案例，方便討論樣式。
- 手動 QA：
  - 語言切換 `/lang/en` / `/lang/zh-TW` 後所有文案需同步更新。
  - 驗證在 RWD（>=1024px / <768px）時 Sidebar 折疊、內容保持易讀。

---

## 9. Backlog 與待辦
1. 補齊 Teacher/User 控制器與頁面骨架（含 Breadcrumb、語系）。
2. 將公告附件排序改為可拖曳（以 `@dnd-kit` 實作）。
3. Dashboard 新增聯絡訊息回應率圖表與附件使用量趨勢圖。
4. 規劃公告的審核流程（草稿 → 審核 → 發布）。
5. 規劃通知中心（公告建立成功時推送給教師/管理者）。
6. 建立 Cypress E2E 腳本涵蓋：登入 → 切換語言 → 建立公告（含附件） → 刪除附件。

---

## 10. 文件維護
- 本文件與 `ARCHITECTURE.md` 應同步更新；新增功能時先補計畫再實作。
- 任務完成後於里程碑清單勾選，並在 PR 描述附上相關章節連結。

