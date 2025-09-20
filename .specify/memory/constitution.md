<!--
Sync Impact Report

- Version change: 1.0.0 -> 1.0.0
 - Version change: 1.0.0 -> 1.0.1
 - Modified principles:
   - PRINCIPLE_1 (multilingual storage) -> 堅守多語 JSON 儲存與 Tab 切換設計
   - PRINCIPLE_2 (styling & components) -> 保持 Tailwind 與共用元件架構，不額外寫散落 CSS
   - PRINCIPLE_3..PRINCIPLE_5 -> reserved (kept for future principles)
 - Added sections:
	- Additional Constraints
	- Development Workflow
	- Governance (expanded)
 - Removed sections:
	- None
 - Templates reviewed and impact:
	- .specify/templates/plan-template.md ✅ reviewed — Constitution Check steps present and aligned
	- .specify/templates/spec-template.md ✅ reviewed — mandatory sections consistent with principles
	- .specify/templates/tasks-template.md ✅ reviewed — contains CI example for locale key validation
	- .specify/templates/agent-file-template.md ✅ reviewed
 - Follow-up TODOs (deferred items):
 	- TODO(RATIFICATION_DATE): confirm and fill project ratification date (unknown from repo)

-->

# 彰化師範大學資工系系網 Constitution

## Core Principles

### 堅守多語 JSON 儲存與 Tab 切換設計
所有以使用者可見的文字內容（公告標題、內文、附件描述等）MUST 以多語 JSON 結構儲存，並以 locale 為 key（例如 `zh-TW`, `en`）。使用者介面在呈現多語內容時 MUST 提供清晰的 Tab 切換，讓編輯者與閱讀者可直接在相同畫面切換語言檢視與編輯。

理由：此策略與既有介面語言策略一致，能保證資料結構一致性、便於匯出備份與搜尋，並降低因散落翻譯字串帶來的遺失風險。

### 保持 Tailwind 與共用元件架構，不額外寫散落 CSS
前端樣式實作 MUST 儘量使用已採用的 Tailwind 實用工具類別與團隊維護的共用元件庫，禁止新增未經審核的全域或局部散置 CSS 檔案。任何需要新增樣式的情況，應優先擴充共用元件或在 design token / component 層級進行。

理由：維持一致的視覺語言、降低樣式衝突與維運成本，並促進元件複用。

### 原則三（保留）
此處為保留槽：目前憲法主要原則已由前兩項明確定義。任何新增的核心原則需按「治理」章節的修訂程序提出與通過。

### 原則四（保留）
此處為保留槽：保留給未來可能加入的核心原則。

### 原則五（保留）
此處為保留槽：保留給未來可能加入的核心原則或細分指引。

## Additional Constraints

Mission: 優化公告管理模組，強化多語內容、附件與發布體驗。

Constraints and requirements:
- 儲存與傳輸：所有多語內容 MUST 以多語 JSON 儲存並以 locale key 組織。
- UI/UX：編輯介面 MUST 提供語言 Tab 切換，且切換狀態與保存機制須避免資料遺失。
- 樣式與元件：不得新增散落 CSS，所有樣式變更應透過共用元件或 Tailwind 設計系統實作。
- 非協商條件（see Non‑Negotiables）: 所有新增文字需放入語系檔（locale files），不得直接硬編在模板或元件中。

## Development Workflow

Code review & quality gates:

- PRs that change UI or introduce text content MUST include corresponding locale file updates. CI checks SHOULD validate presence of locale keys for new strings.
- PRs that add or modify styles MUST reference existing shared components or design tokens; adding new CSS files is NOT allowed without governance approval.
- Feature branches MUST include automated tests for content serialization (multi-lang JSON) and for any backend attachment handling.
- Design/UX changes to the language tab behavior MUST include a quickstart.md style manual showing how editors use the tabbed editor and how to migrate existing content if needed.

Release & deployment:

- Backwards compatibility: data migrations that change the multi-language JSON shape MUST include a reversible migration plan and a migration test suite.
- Rollouts that affect content editors SHOULD be feature-flagged and accompanied by brief documentation and a support plan.

## Governance

Amendments

- Proposals to amend this constitution MUST be submitted as a documented PR against `.specify/memory/constitution.md` that includes:
	1. The exact text to add/change.
 2. A rationale explaining the need and any compatibility impact.
 3. A migration or compliance plan if the change affects runtime behavior or developer workflows.
- Approval: Amendments MUST be approved by the repository maintainers (code owners) and at least one additional senior contributor. For material changes (adding/removing core principles) a MAJOR version bump is required and a short announcement should accompany the merge.
- Emergency fixes: Minor editorial clarifications that do not change intent MAY be applied as PATCH with a brief changelog entry.

Compliance & enforcement

- CI and reviewers MUST verify non-negotiable items (localization updates, no scattered CSS, use of shared components) before merging UI/content PRs.
- Violations MUST be documented in the PR and accompanied by a remediation plan.

**Version**: 1.0.1 | **Ratified**: TODO(RATIFICATION_DATE) | **Last Amended**: 2025-09-19
