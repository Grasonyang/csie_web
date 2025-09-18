# CSIE Web 版面設計全指南

## 目標與適用範圍
- 鎖定 `resources/js/pages` 下所有公開網站、認證流程、設定與後台管理頁面，提供統一的版面規格與開發步驟。
- 目標風格：現代、專業、具企業級可信度，並確保各頁面在手機、平板、桌機皆具良好使用體驗。
- 本指南搭配 Tailwind CSS，所有排版調整應盡量使用原生 utility class 或抽成共用元件。

## 設計原則
- **一致性**：標題階層、間距、按鈕樣式、表格語法都需遵循統一規範。
- **層次清楚**：顏色、字重、留白協助使用者理解資訊優先順序。
- **響應式優先**：先完成手機版，再逐步放寬至平板、桌機；確保任何視窗寬度不出現橫向捲動。
- **易擴充**：將篩選器、卡片、資料表、表單拆為可重複使用的元件，減少重複樣式。
- **可及性**：文字顏色對比符合 WCAG AA，互動元素需保留 focus 樣式與 aria 屬性。

## 全局版面規範
### 斷點與容器
- Tailwind 斷點採 `sm=640px`, `md=768px`, `lg=1024px`, `xl=1280px`, `2xl=1536px`。
- 公開頁面主要內容寬度：`max-w-7xl` (1280px)，左右 `px-4 md:px-6 lg:px-8`。
- 後台內容：列表頁 `max-w-7xl`，表單頁視需要縮至 `max-w-5xl` 或 `max-w-3xl`。

### 文字與色彩
- 字體：優先使用 `"Noto Sans TC"` 或系統預設無襯線，標題可搭配 `"Noto Serif TC"` 強化識別。
- 色彩：
  - 主色 `#151f54`、輔色 `#ffb401`、強調 `#fff809`；保留灰階 `#111` ~ `#f8f9fb`。
  - 公開頁底色以白色或極淺灰，後台背景採 `bg-gray-50`。

### 間距
- 區塊間距 `py-12 md:py-16`，段落間距 `space-y-6`；卡片內距 `p-6`。
- 表單欄位垂直間距 `gap-6`，欄位群組 `gap-4`。

### 共用元件
- 卡片：`rounded-2xl border border-gray-200/80 shadow-sm hover:shadow-md transition`，標題字級 `text-xl font-semibold`。
- 標題：`h1`=`text-3xl md:text-4xl`, `h2`=`text-2xl md:text-3xl`, `h3`=`text-xl md:text-2xl`。
- 行動按鈕：主按鈕 `bg-[#151f54] text-white`, 次要按鈕 `bg-white border border-gray-300`。
- 篩選器：pill 樣式 `rounded-full px-4 py-2 bg-gray-100 hover:bg-[#151f54]/10`。

### RWD 規則
- 小於 `md`：堆疊為單欄，將次要資訊縮到手風琴或折疊區。
- `md`~`lg`：採雙欄或 3 欄 grid。表格改為 card-list 搭配關鍵資訊。
- `lg+`：顯示完整多欄網格、邊欄等輔助資訊。
- 導覽列在手機以漢堡選單或浮動底部導覽（專案已有 `FloatingNav`）呈現。

### 圖片與媒體
- 英雄圖與主視覺採 `object-cover` 並加漸層遮罩。
- 人物/實驗室照片建議比率：人物 4:5、實驗室 16:9。
- 下載附件顯示檔案類型 icon 與大小。

## 開發流程總覽
1. **基礎設施**：更新 Tailwind 設定（字體、顏色、陰影），建立共用 SCSS/Tailwind @layer（如需）。
2. **共用元件**：抽出 `SectionHeader`、`FilterBar`、`DataTable`, `InfoCard`, `StatGrid`, `HeroSection` 等 React 元件。
3. **版面骨架**：先處理 Layout（PublicLayout、AuthLayout、AppLayout、SettingsLayout）的容器與背景。
4. **頁面實作**：依下方頁面指南執行，優先公開頁，再處理後台列表與表單。
5. **RWD 驗證**：使用瀏覽器 DevTools 檢查 375px、768px、1024px、1440px。
6. **互動與易用性**：補上 focus 樣式、hover 回饋、動畫時間 150~200ms。
7. **文件與翻譯**：新增文本請同步更新 i18n JSON，並在 PR 補上截圖。

## 共用佈局模組
### PublicLayout (`resources/js/layouts/public/public-header-layout.tsx`)
- Header 改為雙層：上方資訊列（語系、搜尋、登入），下方主導覽。
- 建議增加大型 Mega Menu（使用員工分類、研究領域等）。手機版以抽屜呈現。
- Main 區塊最外層加 `bg-gradient-to-b from-white via-white to-gray-50` 提升質感。
- Footer 加入三欄資訊（部門介紹、快速連結、聯絡資訊）與底部版權列。

### AuthLayout (`resources/js/layouts/auth/auth-simple-layout.tsx`)
- 背景使用 `from-[#151f54] via-[#1e2968] to-[#050a30]` 漸層，前景卡片投影 `shadow-2xl`。
- 加入側邊靜態宣傳圖或插圖（於 `md+` 顯示）。
- 表單欄位統一 `rounded-xl border border-gray-300 focus:border-[#ffb401] focus:ring-[#ffb401]`。

### AppLayout (`resources/js/layouts/app/app-sidebar-layout.tsx`)
- Sidebar 改為 `min-w-[280px]`，加上群組小標（如「內容管理」、「人事管理」）。
- Content 區背景 `bg-gray-50`, Card 之間 `space-y-6`。
- 在 Header 加入全域搜尋與快速操作下拉。

### SettingsLayout (`resources/js/layouts/settings/layout.tsx`)
- 將 `Heading` 區塊改為 hero：`bg-white shadow-sm rounded-2xl px-6 py-6 mb-8`。
- 左側選單在 `md` 以上固定寬 220px，使用 `nav` + `aria-current`。

## 公開網站頁面
### Welcome (`resources/js/pages/welcome.tsx`)
**排版規格**
- Hero：全螢幕 Banner + 漸層遮罩，上層浮出公告輪播；下方資訊塊使用玻璃擬態卡片。
- Hero 下方依序為「最新公告」、「重點資訊」、「實驗室/課程精選」、「快速連結」。
- 每個區塊採 `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`。
**RWD**
- 手機：Carousel 佔高度 40vh，英雄標題壓縮為 `text-3xl`，資訊卡改為水平捲動 `snap-x`。
- 桌機：Hero 標題 `text-6xl`, 內容使用 `max-w-4xl`。
**開發步驟**
1. 抽離 `HeroSection` 元件，接受背景圖、輪播資料、CTA。
2. 建立 `HighlightCard`、`QuickLinkCard` 共用元件。
3. 追加 `LatestNewsSection`，串接公告 API。
4. 完成 `lg` 版面後，針對 `md`、`sm` 加入橫向捲動與縮放。

### Bulletins Index (`resources/js/pages/bulletins/index.tsx`)
**排版規格**
- 頁首為標題 + 描述 + 搜尋欄位，使用寬版卡片。
- 分類改為橫向可捲動 pill 列，選中狀態 `bg-[#151f54] text-white`。
- 公告列表改為卡片式：標題、摘要、標籤、日期、CTA。
- 右側在 `lg+` 顯示「熱門公告」、「快速篩選」。
**RWD**
- `md-` 轉單欄並將右側資訊移至列表底部 Accordion。
- `xl` 版面採雙欄：主內容 8 欄、側欄 4 欄。
**開發步驟**
1. 建立 `BulletinFilterBar` 元件封裝搜尋+分類。
2. 引入 `BulletinCard`，切換 `list`/`grid` 模式（可留待後續）。
3. 將側欄資料抽至 `BulletinSidebar`，在 `md` 以下收折。
4. 補上空狀態與 Skeleton。

### Bulletins Show (`resources/js/pages/bulletins/show.tsx`)
**排版規格**
- Hero 區顯示標題、類別、發布日期、附件數量。
- 內容區使用 `prose prose-lg` 搭配兩欄排版（主內容 + 附件列表）。
- 增加「分享」按鈕與「回列表」固定在頁面右下角的浮動按鈕。
**RWD**
- 內容在手機版改為單欄，自動縮排圖片。
- 附件列表在手機使用 `accordion`。
**開發步驟**
1. 擴充 `PostMeta` 結構（類別、作者、日期、瀏覽數）。
2. 建立 `AttachmentList` 元件，顯示檔案類型 icon。
3. 套用 `Typography` 樣式，支援 HTML 內容安全渲染。
4. 加入 Breadcrumb 與固定 CTA。

### People Index (`resources/js/pages/people/index.tsx`)
**排版規格**
- 頂部為標題 + 簡介 + 篩選器（角色、研究領域、關鍵字）。
- 人員清單以 `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` 卡片呈現，每張卡片含頭像、姓名、職稱、聯絡方式。
- 支援排序（姓名、職稱、權重）。
**RWD**
- 手機：卡片採 `flex` 左圖右文，篩選器改為下拉抽屜。
- 桌機：卡片加上 hover 陰影與 CTA（查看詳細）。
**開發步驟**
1. 建立 `PeopleFilterPanel`（抽屜 + pill 列）。
2. 製作 `PersonCard` 元件，接受 `locale`、`role`、`highlight`。
3. 將列表資料改為 `grid` 呈現，添加 Skeleton。
4. 串接排序與分頁（如資料量大）。

### People Show (`resources/js/pages/people/show.tsx`)
**排版規格**
- Hero：背景使用淡色漸層 + 圓角卡片呈現姓名、職稱、聯絡資訊、主要研究。
- 內容區拆段：
  1. `簡介`（多語段落）
  2. `研究領域`（標籤）
  3. `學歷與經歷`（時間軸）
  4. `著作`（表格或 Accordion）
  5. `指導學生`（列表）
- 右側（`lg+`）顯示聯絡卡與快速連結。
**RWD**
- 手機：Hero 改為上下堆疊，時間軸改為條列。
- 平板：維持雙欄，僅縮減字級。
**開發步驟**
1. 擴充分段資料結構於後端 API。
2. 實作 `ProfileHero`、`TimelineSection`、`TagList`、`ResourceList` 元件。
3. 完成 `lg` 雙欄後，調整 `md` 斷點為單欄。
4. 增加 `Back to list` CTA 與分享按鈕。

### Labs Index (`resources/js/pages/labs/index.tsx`)
**排版規格**
- 頁首展示總覽：Hero + 統計（實驗室數、教授數、研究主題）。
- 實驗室列表為卡片網格，每張卡含封面圖、名稱、領域標籤、主持人、CTA。
- 提供篩選：主持人、領域、關鍵字。
**RWD**
- 手機：卡片變為水平捲動，圖片佔上方，資訊在下。
- 桌機：`grid-cols-3`，hover 顯示更多資訊。
**開發步驟**
1. 建立 `LabsOverview`（統計 + 搜尋）元件。
2. 建立 `LabCard` 與 `LabFilterBar`。
3. 過濾邏輯外抽 hook（例如 `useFilter`）。
4. 加入空狀態、Skeleton。

### Labs Show (`resources/js/pages/labs/show.tsx`)
**排版規格**
- Hero 使用實驗室封面 + 遮罩，中央顯示名稱、代號、主持人、社群連結。
- 內容：
  1. `實驗室介紹`
  2. `研究主題`（Chip 列）
  3. `成員`（卡片列表）
  4. `研究成果`（Accordion 或列表）
  5. `相簿`（Masonry Gallery）
  6. `加入我們`（CTA）
**RWD**
- 手機：Hero 降為 50vh，Gallery 改為 2 欄。
- 桌機：內容區分兩欄（主文 + 側欄資訊）。
**開發步驟**
1. 後端補齊主題、成果、相簿資料結構。
2. 實作 `LabHero`、`MemberGrid`、`Gallery`。
3. 加上錨點導覽（sticky nav）供快速跳段。
4. 補上 `Contact` CTA 與返回列表按鈕。

## 認證流程頁面 (`resources/js/pages/auth/*`)
### 通用規格
- 標題與描述集中置中，下方卡片統一寬 420px。
- 表單欄位採 `space-y-4`，提示訊息用 `Alert` 元件。
- 加入第三方登入預留區塊（後續可啟用）。

### Login / Register
- `md+` 時加入右側品牌圖像（高 100%，寬 45%），文字置左。
- `Remember me` 與 `忘記密碼` 置於同一行，使用柔和灰色文字。
- `Register` 多欄表單在 `lg` 分兩欄。

### Forgot / Reset Password
- 以流程指示器顯示目前步驟（輸入信箱 → 驗證 → 重設）。
- SF 表單加入驗證圖示（成功/失敗）與即時提示。

### Confirm Password / Verify Email
- 通知卡片加 icon（Shield/Check），並提供「重新寄送」按鈕倒數顯示。

**開發步驟**
1. 擴充 `AuthLayout` 支援左右分欄版型。
2. 建立 `AuthIllustration`、`AuthAlert` 元件。
3. 統一所有表單欄位樣式，抽至 `AuthFormField`。
4. 加入 `motion` 動畫（Framer Motion）可延後實作。

## 後台儀表與模組 (`resources/js/pages/admin/*`)
### Dashboard (`dashboard.tsx`)
- 上方加 `summary bar`：系統狀態、通知、快速建立。
- 主內容分三列：
  1. `StatGrid`（4 卡）
  2. `Quick Actions`（6 個）
  3. `Latest` 區（公告、待辦、系統日誌）
- 右側在 `xl` 顯示「待審批」、「系統公告」。
**RWD**：`md` 轉為雙欄，`sm` 單欄，保留卡片陰影。
**步驟**：抽離 `StatCard`, `ActionCard`, `ActivityList`, `TodoList` 元件；加上資料來源 placeholder。

### Posts 模組 (`resources/js/pages/admin/posts/*`)
- Index：
  - Filter bar 上方佈局成 3x2 網格，使用 `FilterCombobox`。
  - 列表採分離式表格：左欄標題、摘要；右欄狀態、動作。
  - 新增批次操作欄與 `sticky` 表頭。
- Show：提供前台預覽樣式，左側內容、右側 metadata。
- Create/Edit：表單分步驟導覽（基本設定 → 內容 → 附件 → SEO）。
**步驟**
1. 抽出 `AdminFilterBar` 共用元件（支援多欄與折疊）。
2. 將表格轉 `AdminDataTable`（含排序、分頁狀態列）。
3. 將多語 tab 改以 `Tabs` 元件，預設顯示當前語系。
4. 提供 `PreviewDrawer` 即時預覽。

### Staff 模組 (`resources/js/pages/admin/staff/*`)
- Index：卡片與表格可切換，卡片顯示照片、姓名、職稱、聯絡資訊。
- 篩選器包含角色、實驗室、狀態、排序。
- Create/Edit：採兩欄表單 + Sticky 操作列；多語欄位使用 Tab；頭像上傳提供裁切。
**步驟**
1. 先完成 `StaffCard` 與 `StaffTableRow` 元件。
2. 實作 `AvatarUploader`（預覽、重置）。
3. 提供 `RelationPicker` 選取實驗室與個人連結。
4. 調整 RWD：`md` 以上兩欄，`sm` 單欄。

### Labs 模組 (`resources/js/pages/admin/labs/*`)
- Index：圖文表格（左邊縮圖，右邊文字），提供狀態、主持人、領域篩選。
- Create/Edit：步驟式表單（基本資訊 → 圖片 → 成員 → 預覽）。
- 右側顯示更新紀錄與操作人。
**步驟**
1. 抽 `ThumbnailTable` 元件。
2. 完成 `StepWizard` 組件供多模組共用。
3. 建立 `MemberSelector`（支持搜尋、排序）。
4. 加入附件拖放上傳區。

### Users 模組 (`resources/js/pages/admin/users/*`)
- Index：維持卡片模式，但增加表格切換與批次操作列。
- Create/Edit：表單分組（基本資料、權限、狀態），提供角色勾選與暫存。
**步驟**
1. 抽 `UserFilter` 與 `UserCard` 元件。
2. 建立 `RoleBadge` 與 `StatusToggle`。
3. 新增批次操作（啟用、停用、重設密碼）。

### Contact Messages (`resources/js/pages/admin/contact-messages/index.tsx`)
- 將列表改為雙欄：左側訊息卡片列表，右側詳細內容。
- 支援狀態標記、指派負責人、紀錄處理歷程。
**步驟**
1. 建立 `MessageList`、`MessageDetail` 元件。
2. 使用 `ResizablePanelGroup` 在 `lg+` 顯示雙欄。
3. 加入 `AssignAgentModal` 與狀態變更按鈕。

### Courses (`resources/js/pages/admin/courses/index.tsx`)
- 列表顯示課程代碼、名稱、學分、層級、學程。
- 提供 `kanban` 視圖（依學期/層級分類）可延後實作。
**步驟**
1. 抽 `CourseFilter`、`CourseTable`。
2. 支援多語名稱顯示，顯示學程 Badge。
3. 加入 `ExportButton` 下載 CSV。

### Programs (`resources/js/pages/admin/programs/index.tsx`)
- 卡片列出程名稱、層級、課程數、可見狀態、外部連結。
- 表格提供排序與快速切換可見性。
**步驟**
1. 建立 `ProgramCard`、`ProgramTableRow`。
2. 將層級轉成彩色 Badge。
3. 增加 `VisibilityToggle` 與 `LinkPreview`。

### Attachments (`resources/js/pages/admin/attachments/index.tsx`)
- 表格顯示檔名、類型、關聯對象、大小、更新時間。
- 上方 filter 支援檔案類型、來源模型、是否包含刪除資料。
- 列表項 hover 顯示預覽縮圖或檔案資訊。
**步驟**
1. 抽 `AttachmentFilter` 和 `AttachmentRow`。
2. 建立 `AttachmentPreviewDialog`。
3. 加入批次恢復/刪除操作與容量統計。

## 設定頁面 (`resources/js/pages/settings/*`)
- Profile/Password/Appearance 均使用卡片區塊化：標題、描述、表單欄位、操作列。
- 左側選單突出當前選項（粗體 + 背景）。
- 表單欄位置中對齊，提供成功提示 `Alert`。
**步驟**
1. 在 `SettingsLayout` 加入 `settings` Hero。
2. 建立 `SettingsSection` 元件包裹卡片。
3. Profile 表單區分基本資料、聯絡資訊、偏好設定。
4. Password 表單加入密碼強度條，Appearance 提供即時預覽。

## 測試與驗收清單
- 375 / 768 / 1024 / 1440 斷點不出現橫向捲動。
- SR (螢幕閱讀器) 能朗讀主要內容與按鈕意義。
- 表單欄位 focus 突顯且符合 tab 流程。
- 暗色模式若未實作，需確認顏色在深色模式下不失真。
- Lighthouse 得分：Performance > 80、Accessibility > 90、Best Practices > 90。

## 推薦元件目錄整理
- `components/public/`：`hero-section.tsx`, `section-header.tsx`, `highlight-card.tsx`, `bulletin-card.tsx`, `person-card.tsx`, `lab-card.tsx`。
- `components/admin/`：`admin-filter-bar.tsx`, `admin-data-table.tsx`, `stat-grid.tsx`, `quick-action-card.tsx`, `step-wizard.tsx`, `relation-picker.tsx`, `avatar-uploader.tsx`。
- `components/settings/`：`settings-section.tsx`, `password-strength-meter.tsx`, `theme-preview.tsx`。

## 後續迭代建議
- 建立 Storybook 展示主要卡片與表單元件。
- 與設計工具（Figma）同步建立 UI Kit，提供 spacing、色票、圖示規範。
- 規劃單元測試覆蓋核心互動，如篩選器與表單提交流程。

以上指南為所有開發人員執行版面調整與新頁面設計的基準，任何新需求請先更新此檔案再展開實作。
