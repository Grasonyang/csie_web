# Quickstart / Smoke Tests

Date: 2025-09-20

This document lists minimal manual and automated checks to validate the feature after implementation.

1. Visual smoke checks (manual or screenshot-based):
   - Home (public)
   - Login page
   - Register page
   - Admin user list page
   - Settings page
   Expected: white page background and consistent spacing.

2. Registration flow (automated/manual):
   - Register a new user with test email
   - Check mail logs or test inbox for registration confirmation
   - Complete confirmation and verify account activation

3. Password reset flow:
   - Request password reset
   - Confirm reset email delivered
   - Use token to change password

4. Admin user management:
   - Soft-delete a user
   - Confirm user appears in admin list as "deleted"
   - Use Restore action; confirm user can login again

5. Teacher permissions:
   - As a teacher user: create announcement/publication
   - As a non-teacher: verify creation UI is hidden and API calls are forbidden (403)

6. Settings:
   - Change language preference; confirm UI updates for current session
   - Edit profile fields; confirm persistence and display on public profile

7. Post-login redirect:
   - Login as regular user: confirm redirect to Settings
   - Login as admin: confirm admin menu remains and admin can access management pages


