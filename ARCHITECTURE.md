# CSIE Web 重構架構與實作規劃（v1.1）

本文件定義網站的整體架構、資料模型、前後端分工與落地計畫。目標是將舊版原生實作改為框架化、模組化與可維護的系統，並補齊管理後台（Manage）與認證流程在介面、語系與測試上的缺口。

---

## 一、目標與原則
- 現代化：Laravel 11 + Inertia(React) + TailwindCSS。
- 模組化：UI 元件化、資料模型正規化、清晰的授權邏輯。
- 多語系：支援 zh-TW、en，預設 zh-TW；使用 Laravel 內建 i18n 與 session 設定 locale。
- 遷移友善：舊資料庫 newcsieweb → 新資料庫 csie_web，保留可追溯性。
- 靜態頁不入庫：純文字型介紹頁以程式/翻譯檔維護；動態資訊（公告/師資/實驗室/課程等）入庫。
- 檔案策略：資料庫紀錄檔案「連結/中介資訊」，檔案本體可於外部或本地儲存（可混用）。

---

## 二、技術堆疊
- Backend：Laravel 11、Eloquent、HTTP Resource/Policy、Queue/Cron、Storage。
- Frontend：React 18、Inertia、Vite、TailwindCSS、Headless UI 元件庫（專案現有 UI 元件）。
- 資料庫：MySQL 8（或相容）。
- 部署：Nginx/Apache + PHP-FPM、Node/Vite build、ENV-based 設定。

---

## 三、視覺與前端架構
- 介面原則
  - 背景保持乾淨，避免花俏圖案；強調內容區塊與排版層次。
  - 文字採清楚的字級與字重，標題/內文要有對比；沿用系所視覺色票（深藍/灰白）避免「醜醜的」配色。
  - Logo 與品牌元素需在 Header 中清楚呈現，避免縮放失真。
- 版型/元件
  - 前台：`PublicHeader`、`PublicFooter`、`LanguageSwitcher`、`PublicLayout`。
  - 後台：`AppHeader`（含語系切換）、`AppSidebar`、`AdminFooter`、`ManageLayout`（sidebar + main content）。
  - Inertia 分享：`locale`、`locales`、`i18n.common`、使用者資訊、可見角色。
- 管理後台 Layout
  - 基礎由 `resources/js/layouts/manage/manage-layout.tsx` 提供，左側為角色化 Sidebar，右側為主內容。
  - 背景使用 `#f5f7fb` 與白色卡片組合，維持乾淨視覺；元件應盡量重用現有 `AppShell`、`AppContent`、`Sidebar`，避免重複實作。
  - Main content 區塊寬度鎖在 `max-w-6xl`，表單/列表以卡片呈現，保留足夠留白。
  - Footer 採 `AdminFooter` 置於白色卡片內，搭配淡陰影。
- 認證（Auth）頁面
  - 需共用 `auth-layout.tsx`，背景以純白或淡灰、加入明顯的品牌色 CTA。
  - 將現有樣式統一為 3 欄/中央卡片佈局，調整字級、按鈕粗細，避免閱讀痛苦。

---

## 四、後端架構與資料流
- 分層
  - Controller（含 Inertia 回傳） → Service/Action（業務） → Repository（資料存取，可直接用 Eloquent） → Model（關聯/Scope）。
  - 中介層：`HandleAppearance`、`SetLocale`（寫入 session 與 app locale）、`HandleInertiaRequests`（共享資料）。
  - 行為（Action）：例如 `App\Actions\Admin\BuildAdminDashboardData` 負責彙整儀表板資料，前端僅接收已整理好的 JSON。
- 授權
  - 使用 Laravel Policy/Gate；角色：`admin`、`teacher`、`user`（User 表新增 `role` 欄位）。
  - 後台路由以 `auth` + `verified` + Policy 保護，教師可維護個人資料與關聯資訊。
- 資料傳遞
  - Controller 需明確整理資料傳至前端（使用 Resource / DTO 或 Action 輸出），避免在 React 端再做繁重轉換。
  - 所有與語系有關的欄位，後端需提供 zh-TW 與 en 版本；若缺 en，需 fallback 到 zh-TW。
  - 附件與公告等關聯資料應一次載入（`with`、`withCount`），確保前端使用 Inertia 頁面時不需額外請求。
- 框架特性
  - 優先使用 Laravel 內建功能（表單 Request、Action、Storage、Resource、Policy）。
  - React 端善用 Inertia action helper、`useForm`、`usePage`，減少客製 fetch。

---

## 五、資料模型（現況對齊）
> 多語欄位目前採「獨立欄位」策略（`title` + `title_en` 等），後續可視需要改為 JSON cast。

- **User**：`name`、`email`、`password`、`locale?`、`role`(admin|teacher|user)、`avatar`、`remember_token`、timestamps。
- **Staff**：`name`、`name_en`、`position`、`position_en`、`email`、`phone`、`photo_url`、`bio`、`bio_en`、`sort_order`、`visible`、軟刪除。
- **Teacher**：`user_id?`、`name`、`name_en`、`title`、`title_en`、`bio`、`bio_en`、`expertise`、`expertise_en`、`education`、`education_en`、`office`、`phone`、`job_title`、`photo_url`、`sort_order`、`visible`、軟刪除；關聯 `hasMany(TeacherLink)`、`belongsToMany(Lab)`。
- **TeacherLink**：`teacher_id`、`type`(website|scholar|github|linkedin|other)、`label`、`url`、`sort_order`。
- **Lab**：`code`、`name`、`name_en`、`description`、`description_en`、`website_url`、`email`、`phone`、`cover_image_url`、`sort_order`、`visible`、軟刪除；`belongsToMany(Teacher)`。
- **Program**：`name`、`name_en`、`type`、`intro`、`intro_en`、`website_url`、`visible`、軟刪除。
- **Course**（待補資料表，對應 `courses` 模型）：`code`、`title`、`title_en`、`credits`、`level`、`semester`、`syllabus_url`、`program_id?`、`visible`。
- **PostCategory**：`parent_id?`、`slug`、`name`、`name_en`、`sort_order`、`visible`、軟刪除。
- **Post**：`category_id`、`slug`、`status`(draft|published|archived)、`source_type`(manual|link)、`source_url?`、`publish_at?`、`expire_at?`、`pinned`、`cover_image_url?`、`title`、`title_en`、`summary?`、`summary_en?`、`content`、`content_en`、`created_by`、`updated_by`、軟刪除；`morphMany(Attachment)`。
- **Attachment**：`attachable_type`、`attachable_id`、`type`(image|document|link)、`title?`、`file_url?`、`external_url?`、`mime_type?`、`file_size?`、`alt_text?`、`alt_text_en?`、`sort_order`、軟刪除。
- **ContactMessage**：`name`、`email`、`phone`、`subject`、`message`、`status`(new|in_progress|resolved|spam)、`handled_by?`、timestamps。
- **Project / Publication**：對應研究成果資料；含多語標題、摘要、年份等欄位。

---

## 六、頁面與路由規劃（首波）
- 前台頁面
  - 首頁：Hero、最新公告 6 筆、快速連結。
  - 公告：列表 `/bulletins?cat=...&q=...`、詳情 `/bulletins/{slug}`。
  - 師資：列表 `/people`（教師/行政 tab）、詳情 `/people/{slug}`。
  - 實驗室：列表 `/labs`、詳情 `/labs/{slug}`。
  - 課程/學程（第二階段）：`/courses`、`/programs`。
  - 招生（第二階段）：`/admission` 分頁或連結外網。
  - 聯絡我們：表單送出紀錄（`contact_messages`）。
- 後台路由
  - 主群組：`routes/manage.php`，套用 `auth`、`verified`、`manage.role` 中介層。
  - `/manage` 轉址至 `/manage/dashboard`，提供角色共用首頁。
  - Admin 前綴：`/manage/admin/*`，含 Dashboard、使用者、公告、附件、學術、課程等資源路由。
  - Teacher 前綴：預留 `/manage/teacher/*`，將支援個人公告/研究/課程管理。
  - User 前綴：預留 `/manage/user/*`，供一般使用者操作個人設定。
  - 語系切換：`GET /locale/{locale}` 與 `GET /lang/{locale}`（等價路由），寫入 session 後 redirect back。

---

## 七、後台（Manage）專區規劃
- Layout Template
  - Sidebar + Main content（右側）構成基本骨架，Sidebar 依角色載入對應模板：
    - Admin：沿用 `AppSidebar`，顯示全功能導覽。
    - Teacher：`resources/js/components/manage/teacher/sidebar.tsx`，僅呈現教學相關項目。
    - User：精簡版會員導覽，保留個人設定、支援與文件連結。
  - Main content 需提供 breadcrumbs（`AppSidebarHeader`）與卡片化內容，避免雜訊；背景保持純白/淡灰。
- i18n 與語言切換
  - 每個 Manage 元件透過 `useTranslator('manage')` 讀取 `lang/{locale}/manage.php`；新增新功能時需同步補 zh-TW/en。
  - 不再於元件內硬編字串；共用文案置於 `lang/*/common.php`，專屬文案放 `manage.php` 對應區塊。
- Admin 功能
  - 公告管理
    - 列表：支援搜尋、分類、狀態、置頂篩選，顯示附件數量。
    - 表單：
      - 內容區：`title.zh-TW` / `title.en`、`summary.zh-TW/en`、`content.zh-TW/en`（手動類型必填 zh-TW，en 可自動帶入 zh-TW）。
      - 發布設定：`status`、`pinned`、`publish_at`、`expire_at`。
      - 資料來源：`source_type`（manual/link），`source_url`（link 必填）。
      - 附件：可同時上傳檔案與新增外部連結，排序以 `sort_order` 累加。
    - 顯示頁：呈現多語內容、附件列表、建立/更新人員，提供附件管理捷徑。
  - 附件管理
    - 列表：支援關聯類型、附件類型、關鍵字、是否包含軟刪除。
    - 操作：軟刪除、還原、永久刪除；預留重新整理統計資訊。
    - 與公告同步：`PostController@syncAttachments` 會維護附件紀錄，附件管理頁需能檢視到來源。
  - 角色/權限：所有後台 Controller 需套用 Policy；操作行為（建立/更新/刪除）記錄使用者 id。
- Teacher / User 功能（規劃）
  - Teacher：
    - 公告：可管理個人公告（限制分類、預設作者），共享附件邏輯。
    - 研究：連動 `labs`、`projects`、`publications`，可編輯與自己有關的資料。
    - 課程：維護個人授課資訊，支援手動建立或連結課程資料。
  - User：
    - Dashboard：顯示個人資料摘要、快速進入設定。
    - Profile / Appearance / Security：串接現有 `/settings` 表單，統一從 Manage 入口進入。
- Post 與附件連動
  - Post 可分為「手動建立」（存內容）與「連結模式」（僅存來源連結），兩種皆可掛附件。
  - `attachments` 表以 morph 多型關聯（`attachable_type` + `attachable_id`）串接公告、研究、課程等模型。
  - 建立/更新時需處理：
    - 新檔案上傳至 `storage/app/public/attachments`，file_url 儲存 `/storage/` 路徑。
    - 外部連結以 `type=link` + `external_url` 紀錄。
    - 刪除時若為本地檔案需同步刪實體檔案。
- 元件簡化
  - 優先拆成可以覆用的卡片、表單欄位（例如公告表單欄位共用 `FormSection`）；避免為單一頁面打造複雜客製元件。
  - 若要新增新元件，需確認是否能在 `components` 或 `ui` 目錄下以通用形式存在。

---

## 八、多語內容設計
- 路由：`GET /locale/{locale}` 與 `/lang/{locale}` 皆可切換語系，會轉為小寫帶入 session，僅接受 `zh-TW`、`en`。
- 翻譯檔：`lang/{locale}/common.php`、`manage.php`、`auth.php` 等；任何新頁面需在對應檔案建立 key。
- 元件文案全部走翻譯 key；動態資料採兩語欄位（`title`/`title_en` 等）。
- Laravel 層面：可透過自訂 accessor 例如 `getTitleLocalizedAttribute()` 封裝語系 fallback。
- React 層面：使用 `usePage().props.locale` 與 `useTranslator(namespace)` 取得當前語言；語言切換事件應導至 `/lang/{locale}`。
- 針對 Manage/Settings/Auth 等子系統，必要時可在 `lang/{locale}/{module}.php` 下建立次命名空間，確保維護清晰。

---

## 九、Auth 與整體視覺優化
- 語系：所有 Auth 頁面（登入/註冊/忘記密碼/重設/驗證）需連結 `lang/*/auth.php` 字串，並在頁面內透過 `useTranslator('auth')` 使用。
- 佈局：
  - 採中央卡片 + 背景留白；側邊可放置系所照片或純色漸層，需保持柔和。
  - Logo 顯示於卡片上方，尺寸固定，維持清晰度。
- 文字：
  - 標題字重 600、字級 `text-2xl` 起跳；段落使用 `text-sm`~`text-base`，提供足夠行距。
  - 按鈕採品牌色（深藍）搭配白色文字，hover 狀態明顯。
- 無障礙：
  - 顏色對比至少 4.5:1。
  - 為表單欄位與錯誤訊息提供 ARIA label 與 `aria-live`。
- 任務：統一 Auth Layout、更新翻譯、重構樣式，並撰寫相關頁面快照/視覺測試。

---

## 十、資料遷移策略
1. 盤點舊表（newcsieweb）→ 對映到新模型（csie_web）。
2. 撰寫一次性 Artisan 指令：讀舊表、轉換欄位、建立關聯、寫入新表。
3. 附件處理：
   - 外部連結：寫入 `attachments.external_url`。
   - 本地檔案：搬至 Laravel `storage`，建立紀錄（disk/path/mime/size）。
4. 稽核：資料筆數、主要欄位 checksum、抽樣檢視頁面。

---

## 十一、權限與資安
- 角色：`admin` 全權；`teacher` 可編輯個人與關聯內容；`user` 只讀。
- Policy 細節：Post（作者或 admin）、Lab（PI 或 admin）、Staff（本人或 admin）。
- 後台操作紀錄：活動日誌（第二階段）。
- 表單驗證、防 XSS/CSRF（Laravel 內建），檔案 MIME/大小限制。

---

## 十二、搜尋與 SEO（第二階段）
- 站內搜尋：公告/師資/實驗室，關鍵字 + 分類篩選。
- SEO：動態 meta、OpenGraph、站台地圖（sitemap.xml）、結構化資料。

---

## 十三、部署與維運
- ENV 區分：local/staging/prod；APP_LOCALE=zh-TW、APP_FALLBACK_LOCALE=en。
- 快取：`route:cache`、`config:cache`、`view:cache`；對公告列表採用短 TTL 快取。
- 任務排程：每日產生 sitemap、清理過期附件、重新整理快取。
- 監控：日誌輪替、健康檢查 `/up`、簡單告警（第二階段）。

---

## 十四、測試與品質保障
- Controller 測試：每個公開的 controller method（尤其 Manage/Api）需有對應 Feature Test，涵蓋授權、驗證、成功/失敗案例。
- Action/Service 測試：對聚合資料的 Action（如 `BuildAdminDashboardData`）撰寫單元測試，確保統計數正確。
- 前端測試：
  - 使用 Jest/Testing Library 建立頁面快照與互動測試（公告表單、附件列表、語言切換）。
  - 對關鍵表單（Auth、公告）加入 Cypress E2E（可於後續迭代導入）。
- QA 檢查：
  - 語系：新增/修改功能時，須檢查 zh-TW/en 是否同步。
  - 可存取性：執行 Lighthouse/axe 檢查，確保對比與 ARIA。

---

## 十五、里程碑與待辦

已完成（v1 基礎）：
- [x] 前台 `PublicHeader`/`PublicFooter`/`PublicLayout`、成大資工風格導覽。
- [x] 管理台 Header 加入語系切換、簡易 `AdminFooter`。
- [x] 語言切換：`/locale/{locale}` + `SetLocale` 中介層 + Inertia share。
- [x] 翻譯檔 scaffold：`lang/en|zh-TW/common.php`、`manage.php`。

進行中與下一步（Sprint 1-2）
1. 資料庫：調整 Course/Program/Settings 欄位，補齊缺失 migration。
2. 後台 CRUD：
   - [ ] 完成 `/manage/admin/posts` 列表/建立/編輯/附件串接。
   - [ ] 完成 `/manage/admin/attachments` 的檢索/還原/永久刪除流程。
   - [ ] 規劃 `/manage/teacher` 相關頁面與資料權限。
3. 語系：
   - [ ] 管理後台新增頁面皆需補 zh-TW/en 翻譯。
   - [ ] Auth 頁面語系整併至 `lang/*/auth.php`。
4. 視覺：
   - [ ] 重製 Auth 版面（乾淨背景、品牌色）。
   - [ ] 調整 Manage Layout 卡片與空間，維持簡潔視覺。
5. 測試：
   - [ ] 為 Manage Admin Controller（Post/Attachment）撰寫 Feature Test。
   - [ ] 建立公告表單 React 測試覆蓋手動/連結兩種模式。

