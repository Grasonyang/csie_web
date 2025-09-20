# Tasks: 修正 login/register 頁面與郵件送出 (Feature 001)

**Input**: Design docs in `/var/www/html/csie_fk/specs/001-login-register-page/`  
**Prerequisites**: `plan.md`, `research.md`, `data-model.md`, `quickstart.md`, `/contracts/auth_endpoints.md`

## Execution Flow (main)
1. Run setup & environment checks
2. Write failing tests (TDD) for each contract/flow
3. Implement minimal fixes (visibility + mail delivery)
4. Integration tasks: queue/worker + logging
5. Polish: unit tests, docs, locale updates

## Tasks (ordered)

T001 Setup: Verify dev environment and dependencies
- Description: Confirm local dev env variables and tools. Ensure `.env` has MAIL_* keys and QUEUE_CONNECTION. Confirm Node and PHP dev toolchain (npm/yarn, php artisan) are present.
- Files/Commands:
  - Check: `/var/www/html/csie_fk/.env` (or env.example)
  - Commands: `php -v`, `node -v`, `npm -v`, `php artisan config:cache` (for debugging only)
- Notes: This is manual verification; record any missing config values.

T002 Setup: Ensure queue worker can run locally (if QUEUE_CONNECTION != sync)
- Description: Start a single-run worker to be able to process queued mails during debugging and testing.
- Commands:
  - `php artisan queue:work --once` (run while testing)
  - If QUEUE_CONNECTION=database, ensure migrations for `jobs` and `failed_jobs` exist (`php artisan queue:table`, `php artisan migrate`)
- Files: none

T003 Test [P]: Contract tests for auth endpoints (failing tests first)
- Description: Add contract tests that assert endpoints exist and respond appropriately (status codes and JSON/messages). Tests must fail before fixes.
- Files to create:
  - `tests/contract/test_auth_endpoints.php` (or `tests/Feature/AuthEndpointsTest.php` using PHPUnit)
  - Test cases: POST `/register` (assert 302 or 201), POST `/password/email` (assert 302 and message), POST `/login` (assert redirect on success)
- Parallel: Yes [P]

T004 Test [P]: Integration test for registration email dispatch
- Description: Add an integration test that fakes Mail and asserts a Mail or Job was queued/sent when posting `/register` with valid data.
- Files to create:
  - `tests/Feature/RegisterSendsMailTest.php`
  - Use Laravel's `Mail::fake()` and assert `Mail::assertQueued()` or `Mail::assertSent()` depending on queue mode.
- Parallel: Yes [P]

T005 Test [P]: Integration test for forgot-password flow
- Description: Add test that posts to `/password/email` and asserts a reset mail is queued/sent and user sees generic confirmation message.
- Files:
  - `tests/Feature/ForgotPasswordSendsMailTest.php`
- Parallel: Yes [P]

T006 Core: Reproduce visibility issue and capture evidence
- Description: Reproduce the problem locally, capture DOM/Inspector screenshots, console logs, and note the offending DOM nodes or CSS classes causing invisibility or decoration overlap.
- Files/Artifacts:
  - `specs/001-login-register-page/evidence/` (create a folder and save screenshots / console logs / notes)
- Notes: This helps reviewers and anchors the fix.

T007 Core: Implement clean-background mode for auth layout (minimal, constitutional)
- Description: Modify the auth layout to accept a `noDecor` prop (or use route-based conditional) that disables large decorative background elements and animations for `/login`, `/register`, and `/password/forgot` pages.
- Files to change:
  - `resources/js/layouts/public/public-header-layout.tsx` (or relevant layout file)
  - `resources/js/pages/auth/*` (ensure layout prop is set)
- Acceptance: On `/login` and `/register`, the decorative elements are absent and forms are visible. No scattered CSS files added; prefer toggling existing components or utility classes.

T008 Core: Fix z-index / pointer-events / overflow issues discovered
- Description: Apply targeted changes to component props or wrapper classes to ensure the form container is visible and interactive (e.g., set `z-index`, remove `pointer-events-none` from overlays, ensure parent overflow doesn't clip). Avoid adding new CSS files.
- Files to change: exact files found in T006 (list in evidence). Example candidates:
  - `resources/js/components/public-header.tsx`
  - `resources/js/layouts/public/public-header-layout.tsx`
- Acceptance: Forms are visible, clickable, and accessible in desktop & mobile viewports.

T009 Integration: Ensure mail send is invoked and logged
- Description: Inspect backend code for registration and forgot-password mail calls and add robust try/catch logging around mail send/dispatch path. If mail is queued, confirm job dispatch. If synchronous, ensure mail exceptions are logged.
- Files to inspect/change:
  - `app/Http/Controllers/Auth/RegisterController.php` (or `Register` flow in `app/Http/Controllers/Auth/*`)
  - `app/Notifications` or `app/Mail/*`
  - `app/Jobs/*` (if mails are queued)
- Acceptance: When registration or password request is executed locally, a log entry is produced showing mail send attempt result (success/failure with exception stack).

T010 Integration: Add temporary synchronous fallback for debugging (if queued)
- Description: Add a short-lived debug toggle (e.g., `.env DEBUG_MAIL_SYNC=true`) that forces the mail to send synchronously for reproducing problems when workers are not running. This must be removed or gated before merge (documented).
- Files to change:
  - Small conditional in mail dispatch code or in a helper service used for sending mail.
- Acceptance: When DEBUG_MAIL_SYNC=true, mails are sent synchronously and logs show direct send results.

T011 Integration: Ensure queue worker tested and monitor failed_jobs
- Description: Test queue job processing for mail jobs; run `php artisan queue:work --once` and verify that job is processed and no exceptions exist in `storage/logs/laravel.log` or `failed_jobs` table.
- Commands:
  - `php artisan queue:work --once`
  - `php artisan queue:failed` (or inspect `failed_jobs` table)

T012 Polish [P]: Add/adjust integration tests to assert visibility (smoke test)
- Description: Add a test that loads `/login` and asserts the form container element exists and is visible. Depending on test stack, use a headless browser test (Puppeteer / Dusk) or a shallow component test.
- Files:
  - `tests/Browser/AuthVisibilityTest.php` (if Laravel Dusk available) or `tests/Feature/AuthVisibilityTest.php` using DOM assertions
- Parallel: Yes [P]

T013 Polish [P]: Add Mail mock tests and CI check for mail flows
- Description: Ensure Mail sending is covered by tests and add or document a CI job that runs Mail-related tests. Add a small script example for validating mail keys presence in `.env`/config for CI documentation.
- Files:
  - `tests/Feature/*` (existing tests added above)
  - `.github/workflows/ci.yml` (document suggestion only)
- Parallel: Yes [P]

T014 Polish: Update docs and quickstart
- Description: Update `specs/001-login-register-page/quickstart.md` with reproduction steps and any commands required to run workers locally.
- Files:
  - `specs/001-login-register-page/quickstart.md`

T015 Finalize: Code review, remove debug toggles, and prepare PR
- Description: Remove any temporary synchronous debug toggles (e.g., DEBUG_MAIL_SYNC), ensure code conforms to constitution (no scattered CSS), update locales if any textual changes occurred, and create PR from `001-login-register-page`.
- Acceptance: PR includes description, evidence (screenshots), tests, and notes about queue requirements.

## Parallel execution examples
- Run T003, T004, T005 in parallel (contract & integration tests) since they add tests in separate files:  
  - Tasks: `tests/contract/test_auth_endpoints.php`, `tests/Feature/RegisterSendsMailTest.php`, `tests/Feature/ForgotPasswordSendsMailTest.php`  

- Run T012 and T013 in parallel after the core fixes are implemented.

## Dependencies & ordering notes
- Setup (T001/T002) MUST run before any tests that assert mail or queue behavior.
- Tests (T003-T005) should be added first and must fail (TDD) before implementing code changes (T007-T009).
- T007/T008 should be implemented together (layout mode + target fixes) to avoid partial visual regressions.
- Mail logging (T009) and temporary debug sync (T010) enable reproducing failures during development; they must be removed or gated before merge (see T015).

---

Generated by plan: /var/www/html/csie_fk/specs/001-login-register-page/plan.md
