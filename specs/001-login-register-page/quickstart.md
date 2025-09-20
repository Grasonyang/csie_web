# Quickstart: Reproduce and fix login/register visibility and mail issues

1. Reproduce UI issue
   - Open browser at `/login` and `/register`.
   - Capture DOM (View Source / Inspector), computed styles of the form container, and browser console errors.
   - Check for overlays or decorative elements with absolute positioning and high z-index.

2. Reproduce mail issue
   - Ensure `.env` contains MAIL_MAILER, MAIL_HOST, MAIL_PORT, MAIL_USERNAME, MAIL_PASSWORD, QUEUE_CONNECTION.
   - From a tinker or route, call the mail-sending function synchronously and observe logs.
   - If queued, ensure `php artisan queue:work --once` or a worker is running and check `failed_jobs`.

3. Minimal fix approach (safe and compliant):
   - For visibility: Temporarily add a `no-decor` layout modifier for auth pages that disables large background decorative elements (implement as a component prop or layout conditional). Prefer adjusting component props rather than scattering CSS.
   - For mail: If queue workers are not running, trigger a synchronous send for debugging (temporary) and record full mailer exceptions; ensure env variables are correct.

4. Tests
   - Add an integration test that posts to register and asserts a Mail was queued/sent (mock Mail facade).
   - Add a UI smoke test (if applicable) to assert form container is visible in mobile and desktop sizes.

## Notes about constitution compliance

- Any UI change MUST avoid adding scattered CSS files; prefer passing a prop to shared layout/components or updating design tokens.
- Any change that affects content text MUST ensure localization keys are updated per the constitution (add locale entries and update translations if necessary).
