# Tasks: Site-wide UI/UX and auth improvements

**Input**: Design documents from `/var/www/html/csie_fk/specs/002-title-site-wide/`
**Prerequisites**: `plan.md`, `research.md`, `data-model.md`, `quickstart.md`

## Execution Flow (main)
Follow the plan: Tests-before-implementation for backend endpoints; visual changes may be applied directly but should include locale updates.

### Format
`[ID] [P?] Description — files, acceptance criteria, dependencies`

---

## Phase 2 Tasks (ordered, test-first where applicable)

### Setup & quick wins
[T001] [X] Enforce white page background globally (Tailwind base)
- Files: `/resources/css/app.css` (or the project's Tailwind entry), `/resources/views/layouts/app.blade.php` (or main layout)
- Description: add `@layer base { body { @apply bg-white text-gray-900; } }` and ensure main layout wrappers use a `.page-container` with consistent padding.
- Acceptance: screenshots from quickstart show white background on Home, Login, Register, Admin User List, Settings.
- Dependencies: none

[T002] [X] Add locale keys for any new UI copy introduced by T001 (if text added)
- Files: `resources/lang/en/*.php`, `resources/lang/zh-TW/*.php` (create or update appropriate files)
- Description: Ensure any new labels (e.g., "Restore") have entries in both locales and CI validation will detect missing keys.
- Acceptance: locale validation script (manual/CI) finds keys present.
- Dependencies: T001

### Settings UI scaffolding (Frontend) — TDD-light (UI changes low-risk)
[T003] [X] Create Settings page scaffold (Inertia + Tailwind)
- Files: `/resources/js/Pages/Settings/Index.vue` (or .tsx), `/routes/web.php` entry, Inertia controller `app/Http/Controllers/SettingsController.php`
- Description: basic form with language selector, name, email (read-only or editable per existing rules), link to change password.
- Acceptance: visiting /settings shows the page; form fields bound to current user data.
- Dependencies: T001

[T004] [P] Backend endpoints for Settings updates
- Files: `app/Http/Controllers/SettingsController.php`, `routes/web.php`, `app/Http/Requests/UpdateProfileRequest.php`
- Description: implement GET/PUT endpoints for profile and language; validation rules ensure locale is one of allowed locales.
- Acceptance: PUT /settings/profile persists changes to `users` table (preferences->locale or `locale` column); response 200.
- Tests: create integration tests under `tests/Feature/SettingsTest.php` (failing tests before implementation recommended).
- Dependencies: T003

[T005] [P] Implement language persistence and runtime application
- Files: `app/Providers/AppServiceProvider.php` (or middleware), `resources/lang/*` for locale files
- Description: on each request, set application locale from user preferences; allow immediate UI update after settings change.
- Acceptance: changing language in Settings updates the UI language in current session.
- Dependencies: T004

### Mailer diagnosis & fixes (TDD)
[T010] [P] Create failing contract/integration tests for registration and password reset email sending
- Files: `tests/Feature/Auth/RegisterTest.php`, `tests/Feature/Auth/PasswordResetTest.php`
- Description: Tests simulate registration and assert that mail was queued/sent (using Mail::fake() or checking log driver). Tests should fail initially if current behavior broken.
- Acceptance: tests exist and fail before implementation (if current code broken) or pass if fixed.
- Dependencies: none

[T011] [P] Investigate and fix mailer configuration and queue behavior
- Files: `.env.example`, `config/mail.php`, any queue worker config (supervisor/systemd) — code changes in `app/Mail/*` or controllers
- Description: ensure registration uses `Mail::to(...)->send()` or `->queue()` correctly; add try/catch and store send status in DB or logs; provide UI feedback on registration page about email sending status.
- Acceptance: Register a new user shows confirmation and test mailbox or log contains sent email; password reset flow sends reset email.
- Tests: once implemented, run T010 tests and they should pass.
- Dependencies: T010

### Admin user management (TDD)
[T020] [P] Add contract/integration tests for admin restore behavior
- Files: `tests/Feature/Admin/UserRestoreTest.php`
- Description: Test that soft-deleted users appear in admin listing and that POST /admin/users/{id}/restore restores the user; test that only admins can perform restore.
- Acceptance: test exists and fails until implemented.
- Dependencies: none

[T021] Restore endpoint implementation and list inclusion
- Files: `app/Http/Controllers/Admin/UserController.php` (update), `routes/admin.php` or `routes/web.php`, `resources/js/Pages/Admin/Users/Index.vue`
- Description: modify user query to include soft-deleted (`withTrashed()`), mark deleted rows with a badge, add `restore` method that calls `$user->restore()` and logs the action to audit table (or `activity_log` if present).
- Acceptance: admin listing shows deleted users and Restore button works; restored user can log in.
- Tests: T020 should pass after implementation.
- Dependencies: T020

[T022] Add audit logging for restore actions
- Files: `app/Models/User.php` (if using model events), `app/Http/Controllers/Admin/UserController.php`, migrations for an `audit_logs` table if not present
- Description: create an audit record with actor_id, action='restore_user', target_user_id, timestamp, optional reason
- Acceptance: audit record created when a user is restored; tests verify audit entry.
- Dependencies: T021

### Teacher-only content and authorization (TDD)
[T030] [P] Contract/integration tests for teacher-only endpoints
- Files: `tests/Feature/AnnouncementsTest.php`, `tests/Feature/PublicationsTest.php`
- Description: Tests assert that teacher users can create announcements/publications, non-teacher users receive 403 on create endpoints, UI hide checks.
- Acceptance: tests exist and fail before implementation if current behavior allows incorrect access.
- Dependencies: none

[T031] Implement Policy/Gate for teacher-only actions
- Files: `app/Policies/AnnouncementPolicy.php` (or `PublicationPolicy.php`), `app/Providers/AuthServiceProvider.php` registration
- Description: Add policy methods that check user is teacher (compatibility helper checks `role` or `type`). Apply policy to controller methods or via `authorize()` calls.
- Acceptance: endpoints return 403 for non-teachers; tests T030 pass.
- Dependencies: T030

[T032] Hide UI affordances for non-teacher users
- Files: `resources/js/Pages/Announcements/*`, `resources/js/Pages/Publications/*`, navbar components
- Description: conditionally render create buttons/links only for teacher users
- Acceptance: non-teacher users do not see create buttons; manual UI check from quickstart.
- Dependencies: T031

### Post-login redirect and admin access
[T040] [P] Integration test for post-login redirect behavior
- Files: `tests/Feature/Auth/PostLoginRedirectTest.php`
- Description: Test that regular users are redirected to `/settings` after login; admin users are not forced away from admin pages.
- Acceptance: test exists and fails until implemented.
- Dependencies: none

[T041] Implement post-login redirect logic
- Files: `app/Http/Controllers/Auth/LoginController.php` (or equivalent), middleware that handles intended URL
- Description: change redirect target after successful login to `/settings` for non-admin users; preserve admin flow for admins.
- Acceptance: T040 passes.
- Dependencies: T040

### Tests, CI & polish
[T050] [P] Add PHPUnit tests created in tasks above and ensure they run in CI
- Files: `phpunit.xml`, `tests/Feature/*`, `tests/Unit/*`
- Description: ensure Test database configured, Mail::fake used where appropriate, and locale tests added for new UI text
- Acceptance: `vendor/bin/phpunit` runs tests and they pass locally (or fail where expected prior to implementation)
- Dependencies: T010, T020, T030, T040

[T051] [P] Visual smoke test script / instructions
- Files: `/specs/002-title-site-wide/quickstart.md`, optional `scripts/smoke-screenshots.sh`
- Description: document and/or script the screenshot checks for white background and key flows
- Acceptance: quickstart manual steps complete without visual regressions
- Dependencies: T001, T003

---

## Dependencies Summary
- T001 → T002, T003
- T003 → T004 → T005
- T010 (tests) → T011 (fix)
- T020 (tests) → T021 (implementation) → T022 (audit)
- T030 (tests) → T031 (policy) → T032 (UI)
- T040 (tests) → T041 (implementation)
- T050 depends on multiple test tasks

## Parallelization notes
- Tasks marked [P] may be executed in parallel if they touch different files.
- Suggested parallel batch 1: T001, T003, T010, T020, T030, T040 (independent starting tasks)

## Validation checklist (before merging)
- [ ] All tests pass (unit, feature, contract)
- [ ] Locale keys updated for any new UI strings
- [ ] No scattered CSS added; styling via Tailwind utilities
- [ ] Audit logs created for restore action
- [ ] Visual smoke tests pass (white background confirmed)

---

Ready for execution. Run tasks in TDD order: create failing tests (where listed), implement code to make tests pass, then polish and add locales and docs.
