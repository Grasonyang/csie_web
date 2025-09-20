# Feature Specification: 修改 login/register page 與郵件送出修正

**Feature Branch**: `001-login-register-page`  
**Created**: 2025-09-19  
**Status**: Draft  
**Input**: User description: "修改login、register page，目前根本看不到，另外註冊、忘記密碼都沒有送出mail，但我明明在.env中有配置送mail的"

## Execution Flow (main)
```
1. Parse user description from Input
   → If empty: ERROR "No feature description provided"
2. Extract key concepts from description
   → Identify: actors, actions, data, constraints
3. For each unclear aspect:
   → Mark with [NEEDS CLARIFICATION: specific question]
4. Fill User Scenarios & Testing section
   → If no clear user flow: ERROR "Cannot determine user scenarios"
5. Generate Functional Requirements
   → Each requirement must be testable
6. Identify Key Entities (if data involved)
7. Run Review Checklist
   → If any [NEEDS CLARIFICATION]: WARN "Spec has uncertainties"
8. Return: SUCCESS (spec ready for planning)
```

---

## ⚡ Quick Guidelines
- ✅ Focus on WHAT users need and WHY
- ❌ Avoid HOW to implement (not prescriptive about specific frameworks)

---

## User Scenarios & Testing *(mandatory)*

### Primary User Story
作為一名使用者，我需要能正常看到並使用登入（login）與註冊（register）頁面，當我註冊或請求忘記密碼時，系統應會送出郵件到我的電子信箱以完成驗證或重設流程。

### Acceptance Scenarios
1. **Given** 未登入使用者，**When** 訪問 `/login`，**Then** 應能看到登入表單（email/password 與送出按鈕）；表單可正常送出並顯示錯誤/成功訊息。
2. **Given** 未登入使用者，**When** 訪問 `/register`，**Then** 應能看到註冊表單（至少 email/password & submit），填寫並送出後系統應嘗試發送驗證郵件並顯示合適的回饋。
3. **Given** 使用者在忘記密碼頁面請求重設（`/password/forgot`），**When** 提交 email，**Then** 系統應嘗試發送重設密碼郵件並顯示已發送訊息（不要洩漏是否該 email 存在）。
4. **Given** 在上述流程中若郵件寄送失敗，**Then** UI 應顯示錯誤訊息（或提示系統暫時無法寄信），並記錄 server-side 錯誤以供診斷。

### Edge Cases
- 表單隱藏/元素不可見：若 DOM 或 CSS 導致表單元素被隱藏或在視窗外，應修復樣式或結構，使表單在標準 desktop / mobile viewport 可見。
- 郵件配置看似正確但無寄送：需檢查環境變數（.env）、隊列（queue）設定、郵件驅動（sync/smtp/mailgun/..）與錯誤日誌。
- 非法/惡意輸入：輸入應被驗證並回傳適當錯誤訊息，避免詳細錯誤資訊外洩。

## Requirements *(mandatory)*

### Functional Requirements
- **FR-001**: Public pages `/login`, `/register`, `/password/forgot` MUST render visible, accessible forms on standard desktop and mobile viewports.
- **FR-002**: Forms MUST validate input client- and server-side and present clear validation messages.
- **FR-003**: Registration flow MUST trigger a verification email to the supplied address (or enqueue a job to send it) when mail settings are configured.
- **FR-004**: Password-forgot flow MUST trigger an email with reset instructions (or enqueue) and show a generic confirmation message regardless of account existence.
- **FR-005**: Email sending failures MUST be surfaced to the server logs and produce a user-friendly error message on the frontend.
- **FR-006**: If emails are sent via queue, the worker MUST be started in appropriate environments or fallback to synchronous delivery for debugging.

*Clarifications / environment assumptions*:
- **ENV MAIL_** settings are present in `.env` (user stated this). We MUST verify that APP_ENV, MAIL_DRIVER (or MAIL_MAILER), and queue settings are correct.
- [NEEDS CLARIFICATION]: Are email deliveries expected to be synchronous (MAIL_MAILER=smtp/sendmail) or queued (MAIL_MAILER=smtp + queue workers)?

### Key Entities
- **User**: existing user model (email, password, verified flag)
- **MailJob**: job used to send verification/reset emails (if queued)

---

## Review & Acceptance Checklist

### Content Quality
- [x] No implementation details beyond what is necessary
- [x] Focused on user value and observable behavior
- [x] Mandatory sections completed

### Requirement Completeness
- [ ] No [NEEDS CLARIFICATION] markers remain (one present re: queued vs sync)
- [ ] Requirements are testable and unambiguous
- [ ] Success criteria are measurable

---

## Execution Status

- [x] User description parsed
- [x] Key concepts extracted
- [x] Ambiguities marked
- [x] User scenarios defined
- [x] Requirements generated
- [ ] Entities identified (done at a high level)
- [ ] Review checklist passed (pending clarification)

---

## Next steps (recommended tasks)
1. Reproduce the visible issue: open `/login` and `/register` in desktop and mobile viewports and capture DOM/console/logs to confirm whether the forms exist but are hidden by CSS or not rendered at all.
2. Verify mail settings: check `.env` keys (MAIL_MAILER, MAIL_HOST, MAIL_PORT, MAIL_USERNAME, MAIL_PASSWORD, QUEUE_CONNECTION) and confirm if mail sending is synchronous or via queue.
3. If forms are present but hidden, fix CSS/component hierarchy (likely Tailwind classes or container overflow). If not rendered, trace the Inertia/React rendering path and controller responses.
4. Add debugging endpoints/logs for mail sending attempts (capture exceptions and mailer response). Add temporary fallback to synchronous sending for debugging if queue workers are not running.
5. Add automated tests (integration) for registration and forgot-password flows that assert an email was queued/sent (mock mailer) and that the UI shows the correct post-submit message.
