# Implementation Plan: Site-wide UI/UX and auth improvements

**Branch**: `002-title-site-wide` | **Date**: 2025-09-20 | **Spec**: `/var/www/html/csie_fk/specs/002-title-site-wide/spec.md`
**Input**: Feature specification from `/var/www/html/csie_fk/specs/002-title-site-wide/spec.md`

## Execution Flow (/plan command scope)
```
1. Load feature spec from Input path
   → If not found: ERROR "No feature spec at {path}"
2. Fill Technical Context (scan for NEEDS CLARIFICATION)
   → Detect Project Type from context (web=frontend+backend, mobile=app+api)
   → Set Structure Decision based on project type
3. Fill the Constitution Check section based on the content of the constitution document.
4. Evaluate Constitution Check section below
   → If violations exist: Document in Complexity Tracking
   → If no justification possible: ERROR "Simplify approach first"
   → Update Progress Tracking: Initial Constitution Check
5. Execute Phase 0 → research.md
   → If NEEDS CLARIFICATION remain: ERROR "Resolve unknowns"
6. Execute Phase 1 → data-model.md, contracts/, quickstart.md
7. Re-evaluate Constitution Check section
   → If new violations: Refactor design, return to Phase 1
   → Update Progress Tracking: Post-Design Constitution Check
8. Plan Phase 2 → Describe task generation approach (DO NOT create tasks.md)
9. STOP - Ready for /tasks command
```

## Summary
Primary requirement: implement a clean white-background UI across the site, fix auth email delivery (registration & password reset), show and restore soft-deleted users in admin, restrict announcement/publication creation to `teacher` users, ensure post-login redirect to Settings, and provide Settings UI for language/profile editing — using Tailwind and the simplest effective approach.

Technical approach (high-level):
- Use Tailwind for UI updates and global styles; add a minimal, repo-wide utility to enforce white page backgrounds and spacing.
- Diagnose and fix mailer configuration and queue behavior; add logging and UI feedback for email send status.
- Update admin user listing to include soft-deleted users (labeled) and add Restore action; record audit logs on restore.
- Implement simple role checks (teacher) for announcement/publication creation UI and API authorization.
- Modify login redirect to send non-admin users to Settings; keep admin navigation accessible.
- Build Settings UI components using Tailwind and persist language preference and profile changes in user model.

## Technical Context
**Language/Version**: PHP 8.x (Laravel 10 inferred from repo structure) — NEEDS CLARIFICATION if different
**Primary Dependencies**: Laravel framework, Tailwind CSS (already present in project), Inertia.js (observed vendor/inertiajs), PHPUnit for tests
**Storage**: SQLite present for tests; likely uses database config in `config/database.php` (MySQL/Postgres in prod) — use existing User model and migrations
**Testing**: PHPUnit (phpunit.xml in repo)
**Target Platform**: Linux web server (PHP-FPM + web server)
**Project Type**: Web application (frontend + backend using Laravel + Inertia/Tailwind)
**Performance Goals**: N/A for this feature (not performance sensitive)
**Constraints**: Follow Constitution: use Tailwind and shared components; do not add scattered CSS; localizations must be stored per Constitution; include locale updates for any new UI copy.

## Constitution Check
Gates derived from `.specify/memory/constitution.md`:
- Must use Tailwind/shared components for styling changes (no scattered CSS) — PASS (we will implement with Tailwind)
- Locale strings added for any UI copy changes — PASS (plan includes locale file updates)
- Changes that affect data shape (e.g., new user fields) require reversible migrations and tests — N/A (we will reuse existing fields where possible)

Complexity Tracking: No violations anticipated; implementation follows constitution principles.

## Project Structure (decision)
This is a web application (Option 2 in template): changes span backend (Laravel controllers, mailer, controllers for restore action, policies) and frontend (Inertia pages/components with Tailwind). We'll place design artifacts in specs/002-title-site-wide/.

## Phase 0: Outline & Research (research.md summary)
1. Unknowns extracted from spec:
   - Which SMTP/email provider and credentials to use in staging/production?
   - Is `teacher` stored as `role` or `type` on `users` table?
   - Post-login behavior for admins (should admins be excluded from redirect?)
   - Scope of "all pages" for white background (include admin, emails?)

2. Research decisions (minimal, pragmatic choices to move forward):
   - Email: default to using Laravel's configured mailer (MAIL_MAILER env); for local/dev use `log` driver or `mailtrap` if available. Implementation will make mail sending observable and add UI message. [Rationale: use existing config to avoid adding new provider without credentials.]
   - Teacher role: assume `user->type` field exists given `app/Models/Teacher.php` and other models (but mark as NEEDS CLARIFICATION). Implementation will check both `role` and `type` and add a small compatibility helper to detect teacher role.
   - Admin redirect: implement default behavior — non-admin users redirect to Settings; admin users keep current behavior (stay on their previous target or admin dashboard) unless you confirm preference. This avoids disrupting admin workflows.
   - White background: apply global white background to public and admin pages via Tailwind base utilities; for emails, include a simple email template with white content area but do not overhaul existing email templates unless requested.

3. Research output (to be written into `research.md` in the specs dir): decisions above plus references to Laravel mail config docs and Tailwind base styling recommendations.

Output: `research.md` created inline in plan and will be written to specs directory by the /plan command.

## Phase 1: Design & Contracts (data-model.md, contracts/, quickstart.md)

1. Extract entities from feature spec (data-model decisions):
   - User: fields used — id, email, name, type/roles, soft_deleted (deleted_at timestamp using Laravel SoftDeletes trait), preferences->locale
   - Announcement & Publication: existing models `Post`, `Publication` (there is `Publication.php` in app/Models) — map create permissions to `teacher` type/role

2. API/Controller changes required (contracts summary):
   - Auth: ensure registration and password reset controllers use the configured mailer and queue; add explicit error handling and UI messages for send failures.
   - Admin User Management: extend listing endpoint to include soft-deleted users (with optional filter), add `restore` endpoint: POST /admin/users/{id}/restore.
   - Announcements/Publications: protect create/update/destroy endpoints with authorization checks: Gate or Policy that verifies the user is a `teacher`.
   - Settings endpoints: GET/PUT /settings/profile, PUT /settings/language, PUT /settings/password (or reuse existing routes if present).

3. Frontend changes (Inertia + Tailwind):
   - Global style: add or update `resources/css/app.css` (Tailwind base) to ensure `body` and main page wrappers use white background and consistent padding.
   - Login/Register/Forgot flows: add UI feedback for email send and errors; ensure forms submit and display success states.
   - Admin User List: add UI to show soft-deleted users (badge/label) and a Restore button that calls the restore endpoint; consider confirmation modal.
   - Announcements/Publications: hide creation buttons/links from non-teacher users; show editor page to teachers.
   - Settings: build pages/components for language selector and profile edit using Tailwind utilities; persist via settings endpoints.

4. Tests & Contracts:
   - Create contract tests (PHPUnit) for: registration triggers mail, password reset triggers mail, restore endpoint requires admin and succeeds for soft-deleted user, teacher-only endpoints reject non-teachers.
   - Create a visual smoke test checklist in quickstart.md (manual or automated screenshot checks) for white background on key pages.

5. Agent/context update: update AI agent context to include that Tailwind is required and localization changes must update locale files.

Output: data-model.md and contracts/ (summary) described here; quickstart.md will document how to run manual checks and tests.

## Phase 2: Task Planning Approach (what /tasks will generate)
Task generation strategy (short):
- Phase 2 will generate tasks in this order:
  1. Small visual/global CSS change (Tailwind) to enforce white background — low risk, high visibility
  2. Settings UI scaffolding (language selector + profile form) and backend endpoints wiring
  3. Mailer investigation task and fix (check .env MAIL_* settings, queue worker, logs). Add retry or surface errors in UI.
  4. Admin user list change (include soft-deleted, add restore endpoint, add audit log)
  5. Policy/Gate tasks for teacher-only create endpoints and hide UI affordances
  6. Tests: unit/integration tests for mail flows, restore action, authorization

Ordering strategy: execute in TDD-friendly order — tests (or failing contract tests) before implementation for APIs; visual changes can be committed and tested directly.

Parallelization: UI global style, Settings UI scaffolding and Admin list can be done in parallel where they don't touch the same files.

## Complexity Tracking
No constitution violations expected. All changes adhere to Tailwind usage and localization rules.

## Progress Tracking
- **Phase Status**:
- [x] Phase 0: Research complete (/plan command)
- [x] Phase 1: Design complete (/plan command)
- [ ] Phase 2: Task planning complete (/tasks command - not executed here)
- [ ] Phase 3: Tasks generated (/tasks command)
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

- **Gate Status**:
- [x] Initial Constitution Check: PASS
- [ ] Post-Design Constitution Check: PENDING (will run after contracts/tests are generated)
- [ ] All NEEDS CLARIFICATION resolved
- [ ] Complexity deviations documented

---

Artifacts to be created by next commands:
- `/var/www/html/csie_fk/specs/002-title-site-wide/research.md` (Phase 0 full research notes)
- `/var/www/html/csie_fk/specs/002-title-site-wide/data-model.md` (Phase 1 data shapes)
- `/var/www/html/csie_fk/specs/002-title-site-wide/contracts/` (API contracts and test skeletons)
- `/var/www/html/csie_fk/specs/002-title-site-wide/quickstart.md` (manual/automated checks list)

Ready for the `/tasks` command to generate `tasks.md` and begin implementation.


# Implementation Plan: [FEATURE]

**Branch**: `[###-feature-name]` | **Date**: [DATE] | **Spec**: [link]
**Input**: Feature specification from `/specs/[###-feature-name]/spec.md`

## Execution Flow (/plan command scope)
```
1. Load feature spec from Input path
   → If not found: ERROR "No feature spec at {path}"
2. Fill Technical Context (scan for NEEDS CLARIFICATION)
   → Detect Project Type from context (web=frontend+backend, mobile=app+api)
   → Set Structure Decision based on project type
3. Fill the Constitution Check section based on the content of the constitution document.
4. Evaluate Constitution Check section below
   → If violations exist: Document in Complexity Tracking
   → If no justification possible: ERROR "Simplify approach first"
   → Update Progress Tracking: Initial Constitution Check
5. Execute Phase 0 → research.md
   → If NEEDS CLARIFICATION remain: ERROR "Resolve unknowns"
6. Execute Phase 1 → contracts, data-model.md, quickstart.md, agent-specific template file (e.g., `CLAUDE.md` for Claude Code, `.github/copilot-instructions.md` for GitHub Copilot, `GEMINI.md` for Gemini CLI, `QWEN.md` for Qwen Code or `AGENTS.md` for opencode).
7. Re-evaluate Constitution Check section
   → If new violations: Refactor design, return to Phase 1
   → Update Progress Tracking: Post-Design Constitution Check
8. Plan Phase 2 → Describe task generation approach (DO NOT create tasks.md)
9. STOP - Ready for /tasks command
```

**IMPORTANT**: The /plan command STOPS at step 7. Phases 2-4 are executed by other commands:
- Phase 2: /tasks command creates tasks.md
- Phase 3-4: Implementation execution (manual or via tools)

## Summary
[Extract from feature spec: primary requirement + technical approach from research]

## Technical Context
**Language/Version**: [e.g., Python 3.11, Swift 5.9, Rust 1.75 or NEEDS CLARIFICATION]  
**Primary Dependencies**: [e.g., FastAPI, UIKit, LLVM or NEEDS CLARIFICATION]  
**Storage**: [if applicable, e.g., PostgreSQL, CoreData, files or N/A]  
**Testing**: [e.g., pytest, XCTest, cargo test or NEEDS CLARIFICATION]  
**Target Platform**: [e.g., Linux server, iOS 15+, WASM or NEEDS CLARIFICATION]
**Project Type**: [single/web/mobile - determines source structure]  
**Performance Goals**: [domain-specific, e.g., 1000 req/s, 10k lines/sec, 60 fps or NEEDS CLARIFICATION]  
**Constraints**: [domain-specific, e.g., <200ms p95, <100MB memory, offline-capable or NEEDS CLARIFICATION]  
**Scale/Scope**: [domain-specific, e.g., 10k users, 1M LOC, 50 screens or NEEDS CLARIFICATION]

## Constitution Check
*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

[Gates determined based on constitution file]

## Project Structure

### Documentation (this feature)
```
specs/[###-feature]/
├── plan.md              # This file (/plan command output)
├── research.md          # Phase 0 output (/plan command)
├── data-model.md        # Phase 1 output (/plan command)
├── quickstart.md        # Phase 1 output (/plan command)
├── contracts/           # Phase 1 output (/plan command)
└── tasks.md             # Phase 2 output (/tasks command - NOT created by /plan)
```

### Source Code (repository root)
```
# Option 1: Single project (DEFAULT)
src/
├── models/
├── services/
├── cli/
└── lib/

tests/
├── contract/
├── integration/
└── unit/

# Option 2: Web application (when "frontend" + "backend" detected)
backend/
├── src/
│   ├── models/
│   ├── services/
│   └── api/
└── tests/

frontend/
├── src/
│   ├── components/
│   ├── pages/
│   └── services/
└── tests/

# Option 3: Mobile + API (when "iOS/Android" detected)
api/
└── [same as backend above]

ios/ or android/
└── [platform-specific structure]
```

**Structure Decision**: [DEFAULT to Option 1 unless Technical Context indicates web/mobile app]

## Phase 0: Outline & Research
1. **Extract unknowns from Technical Context** above:
   - For each NEEDS CLARIFICATION → research task
   - For each dependency → best practices task
   - For each integration → patterns task

2. **Generate and dispatch research agents**:
   ```
   For each unknown in Technical Context:
     Task: "Research {unknown} for {feature context}"
   For each technology choice:
     Task: "Find best practices for {tech} in {domain}"
   ```

3. **Consolidate findings** in `research.md` using format:
   - Decision: [what was chosen]
   - Rationale: [why chosen]
   - Alternatives considered: [what else evaluated]

**Output**: research.md with all NEEDS CLARIFICATION resolved

## Phase 1: Design & Contracts
*Prerequisites: research.md complete*

1. **Extract entities from feature spec** → `data-model.md`:
   - Entity name, fields, relationships
   - Validation rules from requirements
   - State transitions if applicable

2. **Generate API contracts** from functional requirements:
   - For each user action → endpoint
   - Use standard REST/GraphQL patterns
   - Output OpenAPI/GraphQL schema to `/contracts/`

3. **Generate contract tests** from contracts:
   - One test file per endpoint
   - Assert request/response schemas
   - Tests must fail (no implementation yet)

4. **Extract test scenarios** from user stories:
   - Each story → integration test scenario
   - Quickstart test = story validation steps

5. **Update agent file incrementally** (O(1) operation):
   - Run `.specify/scripts/bash/update-agent-context.sh copilot` for your AI assistant
   - If exists: Add only NEW tech from current plan
   - Preserve manual additions between markers
   - Update recent changes (keep last 3)
   - Keep under 150 lines for token efficiency
   - Output to repository root

**Output**: data-model.md, /contracts/*, failing tests, quickstart.md, agent-specific file

## Phase 2: Task Planning Approach
*This section describes what the /tasks command will do - DO NOT execute during /plan*

**Task Generation Strategy**:
- Load `.specify/templates/tasks-template.md` as base
- Generate tasks from Phase 1 design docs (contracts, data model, quickstart)
- Each contract → contract test task [P]
- Each entity → model creation task [P] 
- Each user story → integration test task
- Implementation tasks to make tests pass

**Ordering Strategy**:
- TDD order: Tests before implementation 
- Dependency order: Models before services before UI
- Mark [P] for parallel execution (independent files)

**Estimated Output**: 25-30 numbered, ordered tasks in tasks.md

**IMPORTANT**: This phase is executed by the /tasks command, NOT by /plan

## Phase 3+: Future Implementation
*These phases are beyond the scope of the /plan command*

**Phase 3**: Task execution (/tasks command creates tasks.md)  
**Phase 4**: Implementation (execute tasks.md following constitutional principles)  
**Phase 5**: Validation (run tests, execute quickstart.md, performance validation)

## Complexity Tracking
*Fill ONLY if Constitution Check has violations that must be justified*

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |


## Progress Tracking
*This checklist is updated during execution flow*

**Phase Status**:
- [ ] Phase 0: Research complete (/plan command)
- [ ] Phase 1: Design complete (/plan command)
- [ ] Phase 2: Task planning complete (/plan command - describe approach only)
- [ ] Phase 3: Tasks generated (/tasks command)
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

**Gate Status**:
- [ ] Initial Constitution Check: PASS
- [ ] Post-Design Constitution Check: PASS
- [ ] All NEEDS CLARIFICATION resolved
- [ ] Complexity deviations documented

---
*Based on Constitution v2.1.1 - See `/memory/constitution.md`*
