# Data Model (extracted from spec)

Entities for this feature (high-level):

- User (existing)
  - key fields: id, name, email, password, email_verified_at, role
  - behaviors: create, request_password_reset, send_verification_email

- MailJob / Notification
  - used for queuing email sending (if application configured to queue)
  - fields: id, type, payload, attempts, reserved_at, available_at

Validation rules (for forms):
- email: required, email format, max length
- password: required, min length (configurable), confirmation when registering

Notes:
- No new persistent entities are necessary beyond existing `users` and standard queue tables. Focus is on flow and ensuring mail jobs are dispatched and logged.
