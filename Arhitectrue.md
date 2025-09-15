# CSIE Web 重構架構與實作規劃（v1）

本文件定義網站的整體架構、資料模型、前後端分工與落地計畫。目標是將舊版原生實作改為框架化、模組化與可維護的系統。

---

## 一、目標與原則
- 現代化：Laravel + Inertia(React) + TailwindCSS。
- 模組化：UI 元件化、資料模型正規化、清晰的授權邏輯。
- 多語系：支援 zh-TW、en，預設 zh-TW；使用 Laravel 內建 i18n 與 session 設定 locale。
- 遷移友善：舊資料庫 newcsieweb → 新資料庫 csie_web，保留可追溯性。
- 靜態頁不入庫：純文字型介紹頁以程式/翻譯檔維護；動態資訊（公告/師資/實驗室/課程等）入庫。
- 檔案策略：資料庫紀錄檔案「連結/中介資訊」，檔案本體可於外部或本地儲存（可混用）。

---

## 二、技術堆疊
- Backend：Laravel 11、Eloquent、HTTP Resource/Policy、Queue/Cron、Storage。
- Frontend：React 18、Inertia、Vite、TailwindCSS、Headless 元件庫（專案現有 UI 元件）。
- 資料庫：MySQL 8（或相容）。
- 部署：Nginx/Apache + PHP-FPM、Node/Vite build、ENV-based 設定。

---

## 三、前端架構
- 版型/元件（已完成初版）
  - 前台：`PublicHeader`、`PublicFooter`、`LanguageSwitcher`、`PublicLayout`。
  - 後台：`AppHeader`（已加入語系切換）、`AppSidebar`、`AdminFooter`。
  - Inertia 分享：`locale`、`locales`、`i18n.common`。
- 導覽（對齊需求）
  - 簡介、系所成員、學術研究、課程修業、招生專區、公告、聯絡我們（第二列導覽）。
  - 首波實作：首頁、公告列表/詳情、師資列表/詳情、實驗室列表/詳情。
- i18n
  - 路由：`GET /locale/{locale}` 寫入 session（支援 `zh-TW`、`en`）。
  - 翻譯檔：`resources/lang/{locale}/*.php`（已建 `common.php`）。
  - 元件文案全部走翻譯 key；動態資料採欄位多語（見資料模型）。

---

## 四、後端架構
- 分層
  - Controller（含 Inertia 回傳） → Service/Action（業務） → Repository（資料存取，可直接用 Eloquent） → Model（關聯/Scope）。
  - 中介層：`HandleAppearance`、`SetLocale`（已加入）、`HandleInertiaRequests`（共享資料）。
- 授權
  - 使用 Laravel Policy/Gate。
  - 角色：`admin`、`teacher`、`user`（User 表新增 `role`，或採套件擴充）。
  - 後台路由以 `auth`+`verified`+Policy 保護，教師可維護其相關資料（個人簡介、連結、研究/論文等）。
- 檔案
  - 儲存於 `storage` 或外部連結；DB 僅存中繼資訊（disk/path/url/mime/size/hash）。

---

## 五、資料模型（首波）
> 原則：依 navbar 分類、正規化、可多語。多語欄位建議採 JSON（`{"zh-TW": "...", "en": "..."}`），以 Eloquent cast 封裝讀寫；或後續引入套件（例如 spatie/laravel-translatable）。

- User（已存在）
  - 欄位：name、email、password、`locale?`、`role`(admin|teacher|user)、avatar 等。

- Staff（師資/行政）
  - 欄位：name(json)、title(json)、email、phone、office、photo_url、status、sort。
  - 關聯：`hasMany(TeacherLink)`、`belongsToMany(Lab)`。

- TeacherLink（教師個人連結）
  - 欄位：staff_id、label(json)、url、type(optional)。

- Lab（實驗室）
  - 欄位：name(json)、slug、intro(json)、website、cover_url、pi_staff_id、status。
  - 關聯：`belongsTo(Staff as PI)`、`belongsToMany(Staff)`。

- Program（學程/學位）
  - 欄位：name(json)、type(undergrad|master|inservice_ai|dual|other)、intro(json)、website。

- Course（課程）
  - 欄位：code、title(json)、credits、level(undergrad|grad)、semester、syllabus_url、program_id?。

- PostCategory（公告分類）
  - 內建：全部、一般、新聞、演講與活動、獲獎、獎助學金、徵人、學士招生、研究所招生、置頂。
  - 欄位：name(json)、slug、parent_id?、sort。

- Post（公告/新聞）
  - 欄位：category_id、title(json)、slug、excerpt(json)、content(json/markdown)、status(draft|published)、pinned(bool)、published_at、author_id。
  - 關聯：`belongsTo(PostCategory)`、`morphMany(Attachment)`。

- Attachment（檔案/連結）
  - 欄位：attachable_type、attachable_id、disk、path、external_url?、original_name、mime、size、hash、uploader_id。
  - 策略：外部連結以 `external_url`，本地檔案以 `disk+path`。

- Publication/Project（第二階段）
  - 與 Staff/Lab/Program 關聯以支援學術成果。

---

## 六、頁面與路由規劃（首波）
- 首頁：Hero、最新公告 6 筆、快速連結。
- 公告
  - 列表 `/bulletins?cat=...&q=...`、詳情 `/bulletins/{slug}`。
- 師資
  - 列表 `/people`（教師/行政 tab）、詳情 `/people/{slug}`。
- 實驗室
  - 列表 `/labs`、詳情 `/labs/{slug}`。
- 課程/學程（第二階段）：`/courses`、`/programs`。
- 招生（第二階段）：`/admission` 分頁或連結外網。
- 聯絡我們：表單送出紀錄（已存在 `contact_messages`）。

後台對應 CRUD（Inertia 頁面）：`/admin/posts`、`/admin/staff`、`/admin/labs`、`/admin/courses`、`/admin/programs` 等。

---

## 七、多語內容設計
- JSON 欄位：title/intro/content/excerpt 等皆為 `{locale: value}`。
- 後端存取：提供 `Translatable` cast（helper）讓 `model->title_localized` 以 `app()->getLocale()` 回傳對應文字，fallback 至 `zh-TW`。
- 前端：顯示時直接用已本地化的欄位；UI 文案走翻譯檔。

---

## 八、資料遷移策略
1) 盤點舊表（newcsieweb）→ 對映到新模型（csie_web）。
2) 撰寫一次性 Artisan 指令：讀舊表、轉換欄位、建立關聯、寫入新表。
3) 附件處理：
   - 如為外部連結：寫 `attachments.external_url`。
   - 如檔案可取得：搬至 Laravel `storage`，建立紀錄（disk/path/mime/size/hash）。
4) 稽核：資料筆數、主要欄位 checksum、抽樣檢視頁面。

---

## 九、權限與資安
- 角色：`admin` 全權；`teacher` 可編輯個人與關聯內容；`user` 只讀。
- Policy 細節：Post（作者或 admin）、Lab（PI 或 admin）、Staff（本人或 admin）。
- 後台操作紀錄：活動日誌（第二階段）。
- 表單驗證、防 XSS/CSRF（Laravel 內建），檔案 MIME/大小限制。

---

## 十、搜尋與 SEO（第二階段）
- 站內搜尋：公告/師資/實驗室，關鍵字 + 分類篩選。
- SEO：動態 meta、OpenGraph、站台地圖（sitemap.xml）、結構化資料。

---

## 十一、部署與維運
- ENV 區分：local/staging/prod；APP_LOCALE=zh-TW、APP_FALLBACK_LOCALE=en。
- 快取：`route:cache`、`config:cache`、`view:cache`，快取公告列表（短 TTL）。
- 任務排程：每日產生 sitemap、清理過期附件、重新整理快取。
- 監控：日誌輪替、健康檢查 `/up`、簡單告警（第二階段）。

---

## 十二、里程碑與待辦

已完成（v1 基礎）：
- [x] 前台 `PublicHeader`/`PublicFooter`/`PublicLayout`、成大資工風格導覽。
- [x] 管理台 Header 加入語系切換、簡易 `AdminFooter`。
- [x] 語言切換：`/locale/{locale}` + `SetLocale` 中介層 + Inertia share。
- [x] 翻譯檔 scaffold：`resources/lang/en|zh-TW/common.php`。

下一步（Sprint 1：公告/師資/實驗室）
1. 資料庫：建立 Post/PostCategory/Staff/TeacherLink/Lab/Attachment 等 migration 與 Model、Policy。
2. 後台 CRUD：`/admin/posts`（列表/建立/編輯/上傳附件/分類/置頂）、`/admin/staff`、`/admin/labs`。
3. 前台頁面：公告列表/詳情、師資列表/詳情、實驗室列表/詳情（含篩選/分頁）。
4. 多語欄位 cast 與 helper；前後端串接顯示。
5. 導覽連結改為實際路由；Welcome 改成首頁版面。

Sprint 2（課程/學程 + 招生/聯絡）
1. Program/Course 模型與後台 CRUD；前台列表/詳情。
2. 招生專區頁（可連外或管理公告分類檢視）。
3. 聯絡我們：表單前端與後台瀏覽/處理（現有 API 可沿用）。

Sprint 3（遷移/SEO/搜尋）
1. 舊資料遷移腳本；抽樣驗證。
2. SEO 標籤/OG、sitemap、站內搜尋。
3. 活動日誌與基本報表（可視情況）。

驗收標準（首波）
- 公告/師資/實驗室在前台可搜尋、分頁、雙語切換；後台具備完整 CRUD 與權限管控。
- 所有 UI 文案使用翻譯檔；動態內容支援 zh-TW/en 欄位。
- 檔案以連結或本地儲存皆可運作；連結失效有標記。

---

## 十三、配色與品牌（暫定）
- LOGO：`https://www.csie.ncue.edu.tw/csie/resources/images/ncue-csie-logo.png`
- 主色：`#151f54`、輔色：`#ffb401`、點綴：`#fff809`（可於 Tailwind theme 變數化）。
