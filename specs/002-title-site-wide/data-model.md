# Data Model: Site-wide UI/UX and auth improvements

Date: 2025-09-20

## Entities

### User
- id: integer
- name: string
- email: string
- type or roles: string or JSON/pivot (e.g., `teacher`, `admin`, `user`) [compatibility check required]
- deleted_at: timestamp (SoftDeletes)
- preferences: JSON (may include `locale`)
- timestamps: created_at, updated_at

Notes:
- Use existing `users` table; avoid adding new columns unless necessary. If `preferences` (JSON) doesn't exist, store locale in a small `locale` column or use existing profile fields.

### Announcement (if present / reusing Post model)
- id: integer
- title: string
- content: text
- author_user_id: integer (references users.id)
- visibility: string
- timestamps

Notes: There is an existing `Post.php` in `app/Models` — consider reusing or adding a lightweight Announcement model.

### Publication
- id: integer
- title: string
- authors: string / JSON
- abstract: text
- files/links: JSON
- author_user_id: integer
- timestamps

### Settings
- User-level preferences captured via `preferences` JSON or separate columns (e.g., `locale`).

## Migrations (minimal)
- If `deleted_at` is not present: add SoftDeletes to users table (migration required).
- If `preferences` JSON or `locale` column not present: add `preferences` JSON or `locale` string column. Prefer minimal schema change.

## Validation rules
- Profile: name required, email required and unique (existing rules apply)
- Locale: must be one of supported locales (e.g., `en`, `zh-TW`)


