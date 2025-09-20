# Research: Site-wide UI/UX and auth improvements

Date: 2025-09-20

Summary of unknowns and decisions made to unblock implementation:

1. Email provider / mailer configuration
   - Decision: Use Laravel's configured mailer (env MAIL_MAILER). For local development use `log` driver or `mailtrap` when available; for staging/prod use configured SMTP or third-party provider already present in environment.
   - Rationale: The repository already has mail configuration; using existing config avoids introducing new secrets or providers. The fix will add visibility (logs/UI) and queue retries rather than swapping providers.
   - Alternatives considered:
     - Add a new provider (SendGrid/Mailgun) — rejected until credentials or preference provided.

2. Representation of `teacher` user
   - Decision: Implement a compatibility helper that checks both a `role` and `type` attribute on the User model for `teacher`. If repository already uses a single convention, adapt to it after review.
   - Rationale: Minimal change approach to support existing data models and avoid large migrations.
   - Alternatives considered:
     - Add a roles table and pivot — heavier migration; deferred unless requested.

3. Post-login landing behavior for admins
   - Decision: Default to redirecting non-admin users to Settings. Admins keep current behavior (no forced redirect). Provide configuration/flag to change behavior later.
   - Rationale: Minimizes disruption to admin workflows while meeting the user's request for normal users.

4. Scope of "all pages" for white background
   - Decision: Apply a global white background to public and admin pages by updating Tailwind base styles and main layout wrappers. For emails, create/adjust email templates to use a white content card but avoid sweeping email template refactors.
   - Rationale: Quick, low-risk visual change with broad coverage while avoiding risky mass changes in email templates.

Implementation notes / references:
- Laravel mail config: https://laravel.com/docs/mail
- Laravel SoftDeletes & restore: https://laravel.com/docs/eloquent#soft-deleting
- Tailwind global styles: use `@layer base` to set `body` background and `.page-container` utilities.

Next steps:
- Implement global Tailwind base update and smoke-test key pages.
- Investigate mailer logs and queue; add UI notification for registration/forgot password flows.
- Implement admin user list restore and audit logging.
- Create a small helper to detect `teacher` and gate announcement/publication creation.


