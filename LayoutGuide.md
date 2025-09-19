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
### Page Layout Registry
- 新增 `resources/js/styles/layout-system.ts` 與 `resources/js/styles/page-layouts.ts` 作為唯一資訊來源，集中定義頁面配色、版面分區（hero、sections、surfaces）與語意化 class。
- 每個頁面於元件內透過 `getPageLayout('<pageKey>')` 取得預設，並以 `cn(layout.section.container, ...)` 套用，避免手寫重複 utility class。
- 頁面 key 與描述詳見 `page-layouts.ts`，目前涵蓋 `welcome`、`dashboard`、`bulletinsIndex` 等 17 個頁面，未來新增頁面時請同步補登記。
- 若需新增 surface 或版型變化，應先擴充 `layout-system.ts` 的 `surfaceTokens`、`heroVariants` 或 `sectionVariants`，再於 `page-layouts.ts` 使用，避免在頁面內直接拼接 class。
- 針對 Sidebar/Timeline/Metric 等易重複模組，優先使用 `page-layouts.ts` 內預留的 `surfaces.*`，並視情況抽成共用 React component。

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
- **Layout**：Split hero（左側訊息、右側輪播 + 指標），接續最新公告時間線、常用快捷、研究實驗室 spotlight + 支援卡網格、全師資滑桿、產學合作清單與聯絡 CTA。每個分段皆透過 `pageLayouts.welcome.sections` 定義容器與間距，確保模組化。
- **Color Palette**：Hero 與 labs 使用品牌深藍 `#050f2e`/`#1d3bb8` 漸層，搭配亮黃 `#fca311`、青綠 `#4dd5c8` 作為強調；文字維持 `text-neutral-900` / `text-white`。玻璃卡採 `bg-white/80` + `border-white/40`。
- **Components & Interactions**：`TopCarousel` 處理 hero 輪播；`SectionHeader` 統一標題層級；最新公告採 timeline 樣式；師資區為全等尺寸卡片，提供水平滑桿與「瀏覽全部師資」連結，手機端可直接水平滑動；各區搭配 `useScrollReveal` 漸進出現。
- **RWD**：`<md` 時 hero 改為單欄堆疊、卡片 track 轉水平捲動；`md~lg` 顯示兩欄、保留陰影；`xl+` 將 labs spotlight 與 quick links 擴展為多欄。師資滑桿在窄螢幕仍可滑動，並提供按鈕於桌機控制。
- **Optimization Ideas**：後續可串接實際公告 API 替換暫存資料、在 quick links 加入 icon 或統計徽章、於師資滑桿顯示分頁指示或自動播放（可透過 IntersectionObserver 啟停）。

### Bulletins Index (`resources/js/pages/bulletins/index.tsx`)
- **Layout**：採 `heroVariants.split` 呈現標題與搜尋卡片；下方為 pill 篩選列，主體為「列表 + 側欄」組合，列表用 editorial 卡片、側欄顯示置頂與快速分類。布局全部來自 `pageLayouts.bulletinsIndex`。
- **Color Palette**：背景維持品牌淺灰 `var(--surface-muted)`，卡片採白底加 `border-primary/12`，pill 選中狀態使用 `bg-primary` 與白字對比。
- **Components & Interactions**：搜尋欄保留清除、submit；分類 pill 可即時呼叫 `router.get`；列表使用 `hover:bg-primary/5` 提供視覺回饋；側欄顯示置頂公告、分類導覽、快速連結。
- **RWD**：`<lg` 自動堆疊為單欄，側欄內容移至主欄底部； pill 列在手機啟用 `overflow-x-auto`；hero 於手機保留搜尋表單並縮小 padding。
- **Optimization Ideas**：後續可加入排序（日期/瀏覽數）、顯示結果統計、在 pill 上加上筆數徽章；另可記錄使用者最後一次篩選條件。

### Bulletins Show (`resources/js/pages/bulletins/show.tsx`)
- **Layout**：全寬 hero banner 疊加遮罩與回列表 CTA，下方使用 `sectionVariants.withAside` 分成文章主体與附件/延伸資訊側欄。
- **Color Palette**：Hero 使用封面圖與黑色漸層確保文字對比；內文區採 `bg-surface-soft`，側欄沿用白底/淺灰，重點按鈕使用品牌藍。
- **Components & Interactions**：文章使用 `prose` 樣式，附件列表依檔案型別顯示 icon；支援原生分享或複製連結；提供來源連結與回到列表互動。
- **RWD**：`<lg` 自動將側欄落在主內容下方；Hero 高度縮短並讓 CTA 轉為 pill；附件列表在窄螢幕維持可點擊區域。
- **Optimization Ideas**：補強上一篇/下一篇導覽、引入「相關公告」模組、針對長篇文章新增目錄軸或浮動分享按鈕。

### People Index (`resources/js/pages/people/index.tsx`)
- **Layout**：Hero split 展示師資/行政統計與篩選表單，列表區以主人物 spotlight + 卡片網格呈現；抽屜式篩選與 `SectionHeader` 導引內容。
- **Color Palette**：Hero 仍採品牌藍 + 玻璃卡；人物卡背底為白色搭配 `border-primary/10`，重點統計使用漸層晶片。
- **Components & Interactions**：支援角色 pill、關鍵字搜尋、清除按鈕；卡片顯示專長標籤與聯絡方式；列表備有 skeleton 與空狀態提示。
- **RWD**：`<md` 篩選器落在卡片底、列表改為單欄；`lg` 以上顯示 spotlight + grid；保留 `no-scrollbar` 避免溢出。
- **Optimization Ideas**：加入排序下拉、提供快速切換「卡片/表格」檢視、在 spotlight 加入輪播或隨機顯示，並串接追蹤熱門搜尋。

### People Show (`resources/js/pages/people/show.tsx`)
- **Layout**：Hero 漸層卡片顯示姓名、職稱、聯絡資訊與社群；主體包含介紹、研究標籤、學經歷時間軸、著作、指導學生，側欄提供聯絡卡與快速連結。
- **Color Palette**：Hero 用品牌藍→青綠漸層，主內容卡片為白底 + `border-primary/12`；標籤 `bg-primary/10`；CTA 採品牌藍。
- **Components & Interactions**：`ProfileHero`、`TimelineSection`、`TagList`、`ResourceList` 等片段化組件便於重用；支援社群連結、分享與回列表 CTA。
- **RWD**：`<lg` 側欄內容移至底部，時間軸改為直向條列；Hero 在小螢幕縮短高度並上下堆疊元素。
- **Optimization Ideas**：加入「相關課程/實驗室」區塊、PDF 履歷匯出、標籤快速過濾、校友推薦語等行銷內容。

### Labs Index (`resources/js/pages/labs/index.tsx`)
- **Layout**：Split hero 顯示統計與搜尋欄，列表區包含一張 spotlight 深色卡與白底卡片網格（來源自 `pageLayouts.labsIndex.sections.listing`）。
- **Color Palette**：Hero 與 spotlight 使用午夜藍漸層搭配品牌黃，列表卡片採白底與 `border-primary/10`，統計晶片使用玻璃效果。
- **Components & Interactions**：搜尋欄支援清除、提交；卡片露出教師數、研究重點與 CTA；`useScrollReveal` 提供漸進顯示；空狀態與篩選文案需雙語。
- **RWD**：`<md` 單欄並啟用水平滑動卡片；`lg+` 展開為 spotlight + 雙/三欄網格；保持 `line-clamp` 避免文字溢出。
- **Optimization Ideas**：加入領域篩選與排序、收藏對比、lazy loading 圖片與骨架佔位；搜尋參數可同步到 URL 分享。

### Labs Show (`resources/js/pages/labs/show.tsx`)
- **Layout**：Hero 以封面漸層呈現關鍵資料；內容依序為介紹、主題 chip、成員卡片、成果列表、相簿、CTA，並提供側欄聯絡資訊與快速導覽。
- **Color Palette**：Hero 使用品牌藍到青綠漸層；主內容卡片採白底 + `border-primary/12`；主題 chip 與 CTA 以品牌黃/藍強調；時間軸/列表節點用品牌藍。
- **Components & Interactions**：`TagList` 顯示研究主題、`MemberGrid` 列出成員、成果採 `Accordion`/list、相簿使用 Masonry + lightbox。頂部 sticky nav 協助跳段。
- **RWD**：`<lg` 將側欄內容移至底部；相簿在手機縮為二列；Hero 高度減少並調整文字大小；CTA 改為滿版按鈕。
- **Optimization Ideas**：新增「下載簡介」按鈕、串接活動或成果連結、相簿導入懶加載、成員支援篩選與排序。

## 認證流程頁面 (`resources/js/pages/auth/*`)
- **Base Layout**：`AuthLayout` 提供雙欄（插圖 + 表單）與單欄簡約兩種；表單容器寬 420px，使用玻璃感白底與 `shadow-2xl`。
- **Color Palette**：背景採品牌漸層 `#151f54 → #1e2968 → #050a30`，按鈕使用品牌藍與輔色黃；錯誤訊息採 `text-rose-600` 與 `bg-rose-50`。
- **Components & Interactions**：表單欄位統一使用 `rounded-xl border border-gray-300 focus:border-[#ffb401] focus:ring-[#ffb401]`；訊息採 `Alert`; 支援第三方登入區塊預留；所有按鈕提供 loading 狀態。
- **RWD**：`<md` 移除插圖僅保留表單；將次要連結（註冊、忘記密碼）堆疊；表單邊距使用 `px-6` 保留呼吸空間。
- **Optimization Ideas**：導入表單驗證即時提示、提供密碼強度條、整合社群登入與安全公告，並於成功頁提供導引至 Dashboard 或公開頁。

### Login / Register
- **Layout**：左右分欄；左側表單含標題、表單欄位與第三方登入預留；右側顯示品牌插圖或學生故事。
- **Color Palette**：插圖背景使用品牌藍漸層搭配白色文字；表單按鈕 `bg-primary`，次要連結為灰色。
- **Interactions**：Remember me 與忘記密碼同列；註冊表單於 `lg` 分兩欄；提供密碼顯示切換與即時驗證。
- **RWD**：`<md` 隱藏插圖、表單滿版；`md+` 顯示插圖並固定高度。
- **Enhancements**：加入社群登入按鈕、顯示密碼強度，不同步驟提示與伺服器錯誤訊息。

### Forgot / Reset Password
- **Layout**：流程導覽（輸入信箱 → 驗證 → 重設），每步驟使用卡片與說明文字。
- **Color Palette**：成功/警示採品牌黃與紅色系；主要 CTA 使用品牌藍。
- **Interactions**：顯示倒數重新寄送、提供複製連結；密碼重設加入即時比對與顯示需求列表。
- **RWD**：保持單欄並縮短說明文字；CTA 寬度 100% 方便點擊。
- **Enhancements**：記錄最後一次寄送時間、提供客服連結、加入鍵盤快捷（Enter 送出）。

### Confirm Password / Verify Email
- **Layout**：通知卡片置中顯示狀態，底部提供返回與重新寄送按鈕。
- **Color Palette**：使用品牌藍 + 綠色成功顏色搭配；錯誤狀態以紅色提示。
- **Interactions**：提供倒數計時、顯示收件信箱、支援再次送出 email（失敗時顯示訊息）。
- **RWD**：卡片保持 360~420px；在手機縮減陰影與邊距；CTA 全寬。
- **Enhancements**：加入裝置信任選項、顯示最近登入活動、整合客服連結。

## 後台儀表與模組 (`resources/js/pages/admin/*`)
### Dashboard (`dashboard.tsx`)
- **Layout**：沉浸式 hero 顯示營運摘要與 KPI 晶片，後續為四格指標卡、六格快速操作、雙欄活動與待辦。所有區塊由 `pageLayouts.dashboard` 控制。
- **Color Palette**：採 `palettes.midnight` 深藍底，指標卡與任務列以白色/透明度白作對比；快速操作卡根據 tone 套入 indigo/emerald/violet/amber 營造成熟感。
- **Components & Interactions**：`StatCard`、`QuickActionCard`、`Activity` timeline、`TaskSummary`、`ScheduleList`；快速操作提供 hover 位移與焦點樣式；Hero CTA 連至公告建立與收件匣。
- **RWD**：`<md` 單欄堆疊、Hero 晶片水平捲動；`lg+` 顯示雙欄活動與側欄；保持 `scroll-behavior: smooth` 及按鈕焦點圈。
- **Optimization Ideas**：串接實際統計 API、於卡片加入趨勢 sparkline、提供客製化排列與深色主題切換、將任務列表加入拖曳排序。

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
