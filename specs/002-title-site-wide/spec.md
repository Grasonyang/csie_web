# Feature Specification: Site-wide UI/UX and auth improvements

**Feature Branch**: `002-title-site-wide`
**Created**: 2025-09-20
**Status**: Draft
**Input**: User description:
"1. 修改所有頁面的背景，白底為主，頁面顯示乾淨最重要
2. 修正登入、註冊、忘記密碼等流程，目前不會送出註冊信
3. 承二，admin管理user時，被軟刪除的user看不到，但我需要看到，並可以取消刪除
4. 承2、3，user type teacher可以發送公告、研究，其他頁面不應該看到
5. user登入後直接進入setting，不應該進入管理功能
6. setting應該要可以調整語言、個人資料、修改等"

## Execution Flow (main)
```
1. Parse user description from Input
	 → If empty: ERROR "No feature description provided"
2. Extract key concepts from description
	 → Identify: actors (user, admin, teacher), actions (UI update, auth flows, restore user, post announcement), data (user type, soft-delete flag, settings.language)
3. For each unclear aspect:
	 → Mark with [NEEDS CLARIFICATION: specific question]
4. Fill User Scenarios & Testing section
	 → If no clear user flow: ERROR "Cannot determine user scenarios"
5. Generate Functional Requirements
	 → Each requirement must be testable
	 → Mark ambiguous requirements
6. Identify Key Entities (if data involved)
7. Run Review Checklist
	 → If any [NEEDS CLARIFICATION]: WARN "Spec has uncertainties"
	 → If implementation details found: ERROR "Remove tech details"
8. Return: SUCCESS (spec ready for planning)
```

---

## ⚡ Quick Guidelines
- ✅ Focus on WHAT users need and WHY
- ❌ Avoid HOW to implement (no tech stack, APIs, code structure)
- 👥 Written for business stakeholders, not developers

### Section Requirements
- **Mandatory sections**: Must be completed for every feature
- **Optional sections**: Include only when relevant to the feature
- When a section doesn't apply, remove it entirely (don't leave as "N/A")

---

## User Scenarios & Testing *(mandatory)*

### Primary User Story
As a site user and administrator I want a clean, white-background UI; reliable authentication flows (including registration emails); admin visibility over soft-deleted users with the ability to restore them; teachers able to post announcements and publications (hidden from other types); and a Settings page where users can change language and personal info. After logging in, users should land on Settings and not on admin management pages.

### Acceptance Scenarios
1. Given the site is loaded, When any public or admin page renders, Then background must be white and layout should be visually clean (no noisy backgrounds) and pass basic accessibility contrast checks.

2. Given a new user registers, When registration completes, Then a registration email is sent to the provided address containing the confirmation link; the user receives the email in mailbox (or visible in delivery logs) within a reasonable time window.

3. Given an admin opens User Management, When users include soft-deleted accounts, Then soft-deleted users are listed (clearly labeled) and admin can trigger "Restore" to un-delete the account.

4. Given a user with type `teacher`, When they access announcements/publications, Then they can create and manage announcements and publications; Given a non-teacher user, When they view the site navigation, Then announcements/publications creation pages/options are hidden.

5. Given any authenticated (non-admin and admin) user completes login, When redirect happens, Then user is navigated to their Settings page by default; Admins who need the admin dashboard must still be able to access it via the admin menu (do not auto-send every admin to admin management unless also desired).

6. Given a user opens Settings, When they change language or edit personal details, Then changes persist in user profile and UI language preference updates (at least for the current session) per selection.

### Edge Cases
- What is the expected behavior when email delivery fails (temporary SMTP outage)? Should registration queue and retry, or show a failure to the user? [NEEDS CLARIFICATION]
- If a teacher is soft-deleted, should their announcements/publications remain visible? How to surface ownership? [NEEDS CLARIFICATION]
- For landing after login: are there role-specific landing pages (e.g., admin -> admin dashboard, teacher -> teacher dashboard) or always Settings? The request says "user登入後直接進入setting，不應該進入管理功能" — clarify for admins. [NEEDS CLARIFICATION]
- Which pages are considered "所有頁面" for the white background (public site only, or also embedded admin pages, emails, PDF exports)? [NEEDS CLARIFICATION]

## Requirements *(mandatory)*

### Functional Requirements
- **FR-001 (UI - global)**: The site MUST use a white background (or primarily white page surfaces) across all pages and adopt a clean, minimal visual style ensuring content legibility and consistent spacing.
	- Acceptance: Visual QA (screenshot sampling of key pages) and automated CSS regression test for global body/background color.

- **FR-002 (Auth - registration emails)**: The system MUST reliably send registration confirmation emails when a new user registers, and MUST surface a clear, testable outcome (sent status in logs, and a notification in the UI that the confirmation email was queued/sent).
	- Acceptance: End-to-end test that triggers registration and verifies an outbound email in the delivery log or test inbox; UI shows success and next steps.
	- [NEEDS CLARIFICATION]: Which email driver/environment to use for production vs staging/test? Provide SMTP credentials or preferred email provider.

- **FR-003 (Auth - forgot password)**: The system MUST send password reset emails and show appropriate success/failure states.
	- Acceptance: Request password reset, receive reset email with valid token link, be able to reset password.

- **FR-004 (Admin - show soft-deleted users)**: Admin user management MUST include soft-deleted users in the listing (clearly labeled as deleted) and MUST provide an action to restore/un-delete the user.
	- Acceptance: Admin list contains soft-deleted entries, and the restore action changes the user's deleted state and re-enables login.

- **FR-005 (Permissions - teacher content)**: Users with type `teacher` MUST be allowed to create and manage announcements and publications. Users who are not `teacher` MUST NOT see creation/management pages or UI affordances for announcements and publications.
	- Acceptance: Role-based visibility tests and action authorization tests ensuring non-teachers get a 403 or hidden UI.
	- [NEEDS CLARIFICATION]: Is `user type == teacher` implemented as a `role` or as a `type` field? Confirm the data model name.

- **FR-006 (Post-login redirect)**: After successful login, the system MUST redirect regular users to their Settings page. Admins should not be auto-sent to user management pages; admin access to management must remain available via the admin menu. If role-specific landing behavior is desired, confirm details.
	- Acceptance: Login flows test asserting redirect target for at least two user accounts (teacher and regular user). [NEEDS CLARIFICATION: desired behavior for admins]

- **FR-007 (Settings capabilities)**: Settings MUST expose at least the following: language selection (locale), editable personal profile fields (name, display name, contact email), and password change.
	- Acceptance: Changes to language persist in user preferences and update the interface language (at minimum for the current session); profile edits persist and appear on the user's public profile.

- **FR-008 (Security & audit)**: All user-facing changes to roles, soft-deletes, and restores MUST be logged with actor, timestamp, and reason (optional) to support auditing.
	- Acceptance: Admin action logs include restore events; tests verify log entries.

### Non-functional Requirements
- **NFR-001 (Usability)**: Visual changes should keep contrast and accessibility guidelines in mind (WCAG AA where feasible).
- **NFR-002 (Reliability)**: Email sending must be retryable and observable; failures should surface useful errors.

### Potential Acceptance Tests (minimal set)
1. Visual regression sample: capture home, login, register, admin user list, settings screenshots and assert body background is white.
2. Register flow: create test user, assert email was queued and delivered to test mailbox, complete confirmation.
3. Password reset flow: request reset, receive email, use link to change password.
4. Admin user list: create and soft-delete a user, confirm it appears in the admin list as "deleted", restore the user, confirm login works.
5. Permissions: with a teacher account, create announcement; with non-teacher, verify UI hidden and direct API calls are forbidden.
6. Post-login redirect: login as regular user, assert redirect to Settings; login as admin and assert admin menu entry exists and admin can reach management pages.

## Key Entities *(include if feature involves data)*
- **User**: Represents a person with attributes: id, email, name, type/roles (teacher, admin, regular), soft_deleted flag, preferences (locale), profile fields.
- **Announcement**: Represents a teacher-posted announcement with attributes: id, title, content, author_user_id, visibility, timestamps.
- **Publication**: Similar to Announcement but specialized for research outputs; attributes: id, title, authors, abstract, files/links, author_user_id, timestamps.
- **Settings**: User-specific preferences such as locale, display name, contact info.

---

## Review & Acceptance Checklist

### Content Quality
- [x] No implementation details (languages, frameworks, APIs) — (kept at a business/spec level)
- [x] Focused on user value and business needs
- [x] Written for non-technical stakeholders
- [x] All mandatory sections completed

### Requirement Completeness
- [ ] No [NEEDS CLARIFICATION] markers remain
- [ ] Requirements are testable and unambiguous
- [ ] Success criteria are measurable
- [ ] Scope is clearly bounded
- [ ] Dependencies and assumptions identified

Marked Clarifications:
- [NEEDS CLARIFICATION]: Which SMTP/email driver/config should be used in production vs staging for email sending (FR-002)
- [NEEDS CLARIFICATION]: Definition of "所有頁面" (FR-001) — confirm if admin UI and emails are included
- [NEEDS CLARIFICATION]: Clarify whether `teacher` is stored as a role or type field in the user model (FR-005)
- [NEEDS CLARIFICATION]: Post-login behavior for admins (FR-006)
- [NEEDS CLARIFICATION]: Desired behavior for content ownership if teacher is soft-deleted (Edge Cases)

---

## Execution Status

- [x] User description parsed
- [x] Key concepts extracted
- [x] Ambiguities marked
- [x] User scenarios defined
- [x] Requirements generated
- [x] Entities identified
- [ ] Review checklist passed

---

Ready for planning and implementation once clarifications above are resolved. The branch `002-title-site-wide` contains this spec at `/var/www/html/csie_fk/specs/002-title-site-wide/spec.md`.

