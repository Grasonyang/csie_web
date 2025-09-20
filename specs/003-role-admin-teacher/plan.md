
# Implementation Plan: Role-Based Management System Restructuring

**Branch**: `003-role-admin-teacher` | **Date**: September 20, 2025 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-role-admin-teacher/spec.md`

## Execution Flow (/plan command scope)
```
1. Load feature spec from Input path ✓
   → Feature spec loaded successfully
2. Fill Technical Context (scan for NEEDS CLARIFICATION) ✓
   → Detected Project Type from context: web (frontend+backend)
   → Set Structure Decision based on project type: Option 2 (Web application)
3. Fill the Constitution Check section based on the content of the constitution document. ✓
4. Evaluate Constitution Check section below ✓
   → No violations detected - proceeding with constitutional compliance
   → Update Progress Tracking: Initial Constitution Check ✓
5. Execute Phase 0 → research.md
   → Starting research phase...
6. Execute Phase 1 → contracts, data-model.md, quickstart.md, agent-specific template file
7. Re-evaluate Constitution Check section
   → To be completed after Phase 1
8. Plan Phase 2 → Describe task generation approach (DO NOT create tasks.md)
9. STOP - Ready for /tasks command
```

**IMPORTANT**: The /plan command STOPS at step 7. Phases 2-4 are executed by other commands:
- Phase 2: /tasks command creates tasks.md
- Phase 3-4: Implementation execution (manual or via tools)

## Summary
Primary requirement: Restructure the management system to support three distinct user roles (admin, teacher, user) with differentiated access permissions, consolidate admin functions under unified management interface, implement clean white-background design with reusable components, and ensure full responsive design (RWD) with settings interface.

Technical approach: Refactor existing Laravel/Inertia.js application to implement role-based access control, migrate admin routes to unified manage structure, create reusable UI components following Tailwind design system, and implement comprehensive responsive design patterns.

## Technical Context
**Language/Version**: PHP 8.2+ (Laravel 11), TypeScript (React with Inertia.js)  
**Primary Dependencies**: Laravel Framework, Inertia.js, React, Tailwind CSS  
**Storage**: MySQL database with existing schema  
**Testing**: PHPUnit for backend, Jest/React Testing Library for frontend  
**Target Platform**: Web application (responsive design for desktop/tablet/mobile)  
**Project Type**: web - Laravel backend with React frontend via Inertia.js  
**Performance Goals**: <500ms page load times, smooth UI transitions, responsive interactions  
**Constraints**: Must maintain backward compatibility with existing data, follow constitutional requirements for multilingual JSON storage and Tailwind-only styling  
**Scale/Scope**: Academic department website serving faculty and students, estimated 100-500 concurrent users  

Additional context from user requirements: 
- 後台有三種role: admin (所有管理頁面), teacher (公告管理、研究管理、教師teacher與user一對一連動，只能管理自己的), user
- 原先有admin，但現在統一搬到manage裡面
- 盡量讓component重複使用
- 畫面整體需要白底、乾淨
- bug修正、使整體程式碼使用組件(更好維護)、RWD、setting畫面

## Constitution Check
*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### 堅守多語 JSON 儲存與 Tab 切換設計
- [✓] **COMPLIANT**: Existing system already uses multilingual JSON storage for content
- [✓] **COMPLIANT**: UI changes will maintain Tab switching for language editing
- [✓] **COMPLIANT**: No changes to core multilingual data structure planned

### 保持 Tailwind 與共用元件架構，不額外寫散落 CSS  
- [✓] **COMPLIANT**: All styling changes will use existing Tailwind utility classes
- [✓] **COMPLIANT**: New components will follow existing shared component architecture
- [✓] **COMPLIANT**: No new CSS files planned - only component-level Tailwind usage

### Additional Constraints
- [✓] **COMPLIANT**: Role-based permissions align with content management mission
- [✓] **COMPLIANT**: All new text will be added to locale files, not hardcoded
- [✓] **COMPLIANT**: UI changes will use shared components and design tokens
- [✓] **COMPLIANT**: Changes support multilingual content management workflows

**Gate Status**: PASS - No constitutional violations detected

## Project Structure

### Documentation (this feature)
```
specs/003-role-admin-teacher/
├── plan.md              # This file (/plan command output)
├── research.md          # Phase 0 output (/plan command)
├── data-model.md        # Phase 1 output (/plan command)
├── quickstart.md        # Phase 1 output (/plan command)
├── contracts/           # Phase 1 output (/plan command)
└── tasks.md             # Phase 2 output (/tasks command - NOT created by /plan)
```

### Source Code (repository root)
```
# Option 2: Web application (Laravel + Inertia.js + React)
app/                     # Laravel backend
├── Http/
│   ├── Controllers/
│   ├── Middleware/
│   └── Requests/
├── Models/
├── Policies/
├── Repositories/
└── Services/

resources/js/            # React frontend
├── components/
│   ├── ui/             # Shared UI components
│   ├── admin/          # Admin-specific components
│   └── layouts/        # Layout components
├── pages/
│   ├── manage/         # Unified management pages
│   ├── admin/          # Admin-specific pages
│   └── settings/       # Settings pages
├── hooks/
├── types/
└── styles/

routes/                  # Laravel routes
├── web.php
├── manage.php          # Management routes
├── auth.php
└── settings.php

tests/
├── Feature/            # Laravel feature tests
├── Unit/               # Laravel unit tests
└── JavaScript/         # Frontend tests
```

**Structure Decision**: Option 2 (Web application) - Laravel backend with React frontend via Inertia.js

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
- Each API contract → integration test task [P]
- Each data model entity → model creation/enhancement task [P] 
- Each user story from quickstart → feature test task
- Implementation tasks to make tests pass
- Role-based authorization tasks for each endpoint
- Component creation tasks for shared UI elements
- Migration tasks for database schema changes

**Ordering Strategy**:
- **Foundation First**: Database migrations and model updates
- **TDD Order**: Tests before implementation for each feature
- **Dependency Order**: 
  1. User/Role/Teacher models and relationships
  2. Authentication and authorization middleware
  3. Backend API endpoints with policies
  4. Frontend shared components
  5. Role-specific UI pages
  6. Settings interface
  7. Integration tests and validation
- **Parallel Execution**: Mark [P] for tasks affecting independent files/components

**Role-Based Task Categories**:
1. **Authentication & Authorization** (8-10 tasks)
   - Role middleware implementation
   - Policy creation for each resource
   - Login redirect logic update
   - Session management enhancement

2. **Backend API Development** (12-15 tasks)
   - User management endpoints
   - Content management with role filtering
   - Research management with ownership
   - Settings management API
   - Audit logging implementation

3. **Frontend Component Development** (10-12 tasks)
   - Shared UI component library
   - Role-aware navigation components
   - Management dashboard components
   - Settings interface components
   - Responsive design implementation

4. **Database & Migration** (5-7 tasks)
   - User-Teacher relationship migration
   - Role system database setup
   - Settings table creation
   - Index optimization
   - Data seeding for testing

5. **Testing & Validation** (8-10 tasks)
   - Role-based authorization tests
   - API endpoint integration tests
   - Component unit tests
   - End-to-end user flow tests
   - Performance validation tests

**Estimated Task Breakdown**:
- **Database/Models**: 7 tasks
- **Backend/API**: 15 tasks  
- **Frontend/Components**: 12 tasks
- **Testing**: 10 tasks
- **Integration/Deployment**: 6 tasks
- **Total**: ~50 numbered, ordered tasks in tasks.md

**Constitutional Compliance Tasks**:
- Multilingual JSON validation tests
- Tailwind-only styling verification
- Shared component architecture validation
- No scattered CSS enforcement checks

**Bug Fix Integration**:
- Current bug identification and prioritization
- Bug fix tasks integrated into appropriate categories
- Regression testing for existing functionality

**Performance Optimization Tasks**:
- Database query optimization for role filtering
- Frontend bundle optimization for role-based loading
- Caching strategy for role permissions
- Mobile performance validation

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
- [x] Phase 0: Research complete (/plan command)
- [x] Phase 1: Design complete (/plan command)
- [x] Phase 2: Task planning complete (/plan command - describe approach only)
- [ ] Phase 3: Tasks generated (/tasks command)
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

**Gate Status**:
- [x] Initial Constitution Check: PASS
- [x] Post-Design Constitution Check: PASS  
- [x] All NEEDS CLARIFICATION resolved
- [x] Complexity deviations documented (None required)

---
*Based on Constitution v2.1.1 - See `/memory/constitution.md`*
