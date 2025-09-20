# Auth Endpoints (contracts)

- GET /login — returns login page (form)
- POST /login — accept credentials, set session
- GET /register — returns register page (form)
- POST /register — create user, dispatch verification email
- GET /password/forgot — returns forgot-password page (form)
- POST /password/email — send password reset email

Notes: Each POST endpoint MUST provide clear feedback (success/failure) and must not leak existence of email addresses in responses.
