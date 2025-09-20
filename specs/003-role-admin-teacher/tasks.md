# Tasks: Role-Based Management System Restructuring

**Input**: Design documents from `/specs/003-role-admin-teacher/`
**Prerequisites**: plan.md (required), research.md, data-model.md, contracts/

## Execution Flow (main)
```
1. Load plan.md from feature directory ✓
   → Implementation plan loaded successfully
   → Extracted: Laravel 11 + Inertia.js + React + Tailwind CSS
2. Load optional design documents: ✓
   → data-model.md: User, Teacher, Role, Settings entities identified
   → contracts/: API contracts for auth, role management, content, settings
   → research.md: Role-based architecture and component reuse strategy
3. Generate tasks by category: ✓
   → Setup: Laravel/React project setup and dependencies
   → Tests: API contract tests, integration scenarios
   → Core: Models, policies, controllers, components
   → Integration: Middleware, routes, authentication flow
   → Polish: Performance tests, documentation, validation
4. Apply task rules: ✓
   → Different files = marked [P] for parallel execution
   → Same file = sequential ordering
   → Tests before implementation (TDD approach)
5. Number tasks sequentially (T001, T002...) ✓
6. Generate dependency graph ✓
7. Create parallel execution examples ✓
8. Validate task completeness: ✓
   → All API contracts have tests
   → All entities have model tasks
   → All components have implementation tasks
9. Return: SUCCESS (tasks ready for execution)
```

## Format: `[ID] [P?] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

## Path Conventions
- **Laravel Backend**: `app/`, `database/`, `routes/`, `tests/`
- **React Frontend**: `resources/js/`, `resources/css/`
- **Configuration**: `config/`, `.env`, `composer.json`, `package.json`

## Phase 3.1: Setup & Environment

- [x] T001 Update Laravel project dependencies for role-based management in `composer.json`
- [x] T002 [P] Update React/TypeScript dependencies in `package.json`
- [x] T003 [P] Configure PHPUnit test environment in `phpunit.xml`
- [x] T004 [P] Configure Jest test environment in `jest.config.js`
- [x] T005 Create role management middleware in `app/Http/Middleware/ManageRole.php`

## Phase 3.2: Database & Models (Tests First - TDD)

**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**

- [x] T006 [P] Model test for User role enhancements in `tests/Unit/Models/UserTest.php`
- [x] T007 [P] Model test for Teacher relationships in `tests/Unit/Models/TeacherTest.php`
- [x] T008 [P] Model test for Settings functionality in `tests/Unit/Models/SettingsTest.php`  
- [x] T009 [P] Database migration tests for new tables in `tests/Unit/DatabaseMigrationTest.php`
- [x] T010 [P] Create migration to add `teacher_id` column to users table and modify role enum in `database/migrations/add_role_to_users_table.php`
- [x] T011 [P] Create migration for teachers table with user relationships in `database/migrations/create_teachers_table.php` (Adapted existing table)
- [x] T012 [P] Create migration for settings table in `database/migrations/create_settings_table.php`
- [x] T013 [P] Create migration for enhanced audit logging in `database/migrations/create_audit_logs_table.php` (Adapted existing table)

## Phase 3.3: Authentication & Authorization (Tests First)

- [x] T014 [P] Policy test for User management in `tests/Unit/Policies/UserPolicyTest.php`
- [x] T015 [P] Policy test for Post role-based access in `tests/Unit/Policies/PostPolicyTest.php`
- [x] T016 [P] Policy test for Lab teacher ownership in `tests/Unit/Policies/LabPolicyTest.php`
- [x] T017 [P] Middleware test for role checking in `tests/Feature/Middleware/ManageRoleTest.php`
- [x] T018 [P] Authentication test for role-based redirects in `tests/Feature/Auth/RoleBasedRedirectTest.php`
- [ ] T019 Update User model with enhanced role relationships in `app/Models/User.php`
- [ ] T020 Update Teacher model with user relationship in `app/Models/Teacher.php`
- [ ] T021 Create Settings model in `app/Models/Settings.php`
- [ ] T022 Update User policy for role-based permissions in `app/Policies/UserPolicy.php`
- [ ] T023 Update Post policy for role-based access in `app/Policies/PostPolicy.php`
- [ ] T024 Update Lab policy for teacher ownership in `app/Policies/LabPolicy.php`

## Phase 3.4: API Contracts & Controllers (Tests First)

- [ ] T025 [P] Contract test for POST /login with role redirects in `tests/Feature/Auth/LoginContractTest.php`
- [ ] T026 [P] Contract test for GET /manage/admin/users in `tests/Feature/Admin/UserManagementContractTest.php`
- [ ] T027 [P] Contract test for PATCH /manage/admin/users/{id}/role in `tests/Feature/Admin/RoleManagementContractTest.php`
- [ ] T028 [P] Contract test for GET /manage/posts role filtering in `tests/Feature/Content/PostContractTest.php`
- [ ] T029 [P] Contract test for GET /manage/labs teacher ownership in `tests/Feature/Research/LabContractTest.php`
- [ ] T030 [P] Contract test for GET /manage/settings in `tests/Feature/Settings/SettingsContractTest.php`
- [ ] T031 Update AuthenticatedSessionController for role-based redirects in `app/Http/Controllers/Auth/AuthenticatedSessionController.php`
- [ ] T032 Create AdminUserController for user management in `app/Http/Controllers/Admin/UserController.php`
- [ ] T033 Update AdminPostController for role-based filtering in `app/Http/Controllers/Admin/PostController.php`
- [ ] T034 Update AdminLabController for teacher ownership in `app/Http/Controllers/Admin/LabController.php`
- [ ] T035 Create SettingsController for user preferences in `app/Http/Controllers/SettingsController.php`

## Phase 3.5: Frontend Components (Tests First)

- [ ] T036 [P] Component test for RoleBasedNavigation in `resources/js/__tests__/components/RoleBasedNavigation.test.tsx`
- [ ] T037 [P] Component test for ManageDashboard role variants in `resources/js/__tests__/pages/ManageDashboard.test.tsx`
- [ ] T038 [P] Component test for UserManagement admin interface in `resources/js/__tests__/components/UserManagement.test.tsx`
- [ ] T039 [P] Component test for PostManagement role filtering in `resources/js/__tests__/components/PostManagement.test.tsx`
- [ ] T040 [P] Component test for SettingsInterface in `resources/js/__tests__/components/SettingsInterface.test.tsx`
- [ ] T041 Create shared RoleBasedNavigation component in `resources/js/components/ui/RoleBasedNavigation.tsx`
- [ ] T042 Update ManageDashboard with role-specific content in `resources/js/pages/manage/dashboard.tsx`
- [ ] T043 Create AdminDashboard for admin role in `resources/js/pages/admin/dashboard.tsx`
- [ ] T044 Create UserManagement interface in `resources/js/components/admin/UserManagement.tsx`
- [ ] T045 Update PostManagement with role filtering in `resources/js/components/admin/PostManagement.tsx`
- [ ] T046 Create LabManagement for teacher ownership in `resources/js/components/admin/LabManagement.tsx`
- [ ] T047 Create SettingsInterface component in `resources/js/components/settings/SettingsInterface.tsx`

## Phase 3.6: Routes & Integration

- [ ] T048 Update manage.php routes for role-based access in `routes/manage.php`
- [ ] T049 Create settings.php routes in `routes/settings.php`
- [ ] T050 Update web.php for role-based dashboard routing in `routes/web.php`
- [ ] T051 Register role management middleware in `app/Http/Kernel.php`
- [ ] T052 Update AuthServiceProvider with new policies in `app/Providers/AuthServiceProvider.php`

## Phase 3.7: Styling & Responsive Design

- [ ] T053 [P] Create responsive layout utilities in `resources/js/styles/responsive.ts`
- [ ] T054 [P] Update Tailwind config for role-based color schemes in `tailwind.config.js`
- [ ] T055 [P] Create shared component styles in `resources/js/components/ui/styles.ts`
- [ ] T056 Implement mobile-responsive navigation in `resources/js/layouts/app-layout.tsx`
- [ ] T057 Apply clean white-background theme across components in `resources/js/styles/theme.ts`

## Localization & CI checks

- [ ] T058 [P] Add role management locale keys in `resources/lang/zh-TW/roles.php`
- [ ] T059 [P] Add role management locale keys in `resources/lang/en/roles.php`
- [ ] T060 [P] Add settings interface locale keys in `resources/lang/zh-TW/settings.php`
- [ ] T061 [P] Add settings interface locale keys in `resources/lang/en/settings.php`
- [ ] T062 [P] Create locale validation test in `tests/Feature/Localization/LocaleValidationTest.php`

## Phase 3.8: Integration Tests & User Flows

- [ ] T063 [P] Integration test for admin user complete flow in `tests/Feature/Integration/AdminUserFlowTest.php`
- [ ] T064 [P] Integration test for teacher user content management in `tests/Feature/Integration/TeacherFlowTest.php`
- [ ] T065 [P] Integration test for user role limited access in `tests/Feature/Integration/UserFlowTest.php`
- [ ] T066 [P] Integration test for teacher-user association in `tests/Feature/Integration/TeacherUserAssociationTest.php`
- [ ] T067 [P] Integration test for role permission enforcement in `tests/Feature/Integration/RolePermissionTest.php`

## Phase 3.9: Performance & Security

- [ ] T068 [P] Performance test for role-based dashboard loading in `tests/Performance/DashboardPerformanceTest.php`
- [ ] T069 [P] Performance test for role-filtered content queries in `tests/Performance/ContentQueryPerformanceTest.php`
- [ ] T070 [P] Security test for role isolation in `tests/Security/RoleIsolationTest.php`
- [ ] T071 [P] Security test for teacher content access in `tests/Security/TeacherContentSecurityTest.php`
- [ ] T072 Add database indexes for role-based queries in `database/migrations/2025_09_20_000005_add_role_query_indexes.php`

## Phase 3.10: Data Migration & Seeding

- [ ] T073 Create role assignment seeder in `database/seeders/RoleAssignmentSeeder.php`
- [ ] T074 Create test users seeder for all roles in `database/seeders/TestUsersSeeder.php`
- [ ] T075 Create settings default values seeder in `database/seeders/DefaultSettingsSeeder.php`
- [ ] T076 Create data migration script for existing users in `database/seeders/ExistingUserRoleMigrationSeeder.php`

## Phase 3.11: Polish & Documentation

- [ ] T077 [P] Update API documentation in `docs/api.md`
- [ ] T078 [P] Create role management user guide in `docs/role-management.md`
- [ ] T079 [P] Update development setup guide in `README.md`
- [ ] T080 [P] Create component documentation in `docs/components.md`
- [ ] T081 Run constitutional compliance validation
- [ ] T082 Run complete integration test suite
- [ ] T083 Perform manual testing per quickstart.md scenarios
- [ ] T084 Code cleanup and remove duplication
- [ ] T085 Final performance validation and optimization

## Dependencies

### Critical Path Dependencies
- **Setup** (T001-T005) → **All other phases**
- **Database Tests** (T006-T009) → **Database Migrations** (T010-T013)
- **Auth Tests** (T014-T018) → **Auth Implementation** (T019-T024)
- **API Tests** (T025-T030) → **Controller Implementation** (T031-T035)
- **Component Tests** (T036-T040) → **Component Implementation** (T041-T047)
- **Routes** (T048-T052) → **Integration Tests** (T063-T067)
- **Styling** (T053-T057) → **Performance Tests** (T068-T069)
- **Localization** (T058-T062) → **Final Validation** (T081-T083)

### Model Dependencies
- T019 (User model) blocks → T022 (User policy), T031 (Auth controller)
- T020 (Teacher model) blocks → T024 (Lab policy), T034 (Lab controller)
- T021 (Settings model) blocks → T035 (Settings controller), T047 (Settings interface)

### Component Dependencies
- T041 (Navigation component) blocks → T042, T043 (Dashboard pages)
- T044-T047 (Management components) depend on → T031-T035 (Controllers)

## Parallel Execution Examples

### Phase 3.2 - Database Tests (can run simultaneously)
```bash
Task: "Model test for User role enhancements in tests/Unit/Models/UserTest.php"
Task: "Model test for Teacher-User relationship in tests/Unit/Models/TeacherTest.php"
Task: "Model test for Settings entity in tests/Unit/Models/SettingsTest.php"
Task: "Migration test for user-teacher relationships in tests/Feature/Migrations/UserTeacherRelationshipTest.php"
```

### Phase 3.4 - API Contract Tests (can run simultaneously)
```bash
Task: "Contract test for POST /login with role redirects in tests/Feature/Auth/LoginContractTest.php"
Task: "Contract test for GET /manage/admin/users in tests/Feature/Admin/UserManagementContractTest.php"
Task: "Contract test for PATCH /manage/admin/users/{id}/role in tests/Feature/Admin/RoleManagementContractTest.php"
Task: "Contract test for GET /manage/posts role filtering in tests/Feature/Content/PostContractTest.php"
```

### Phase 3.5 - Frontend Component Tests (can run simultaneously)
```bash
Task: "Component test for RoleBasedNavigation in resources/js/__tests__/components/RoleBasedNavigation.test.tsx"
Task: "Component test for ManageDashboard role variants in resources/js/__tests__/pages/ManageDashboard.test.tsx"
Task: "Component test for UserManagement admin interface in resources/js/__tests__/components/UserManagement.test.tsx"
Task: "Component test for PostManagement role filtering in resources/js/__tests__/components/PostManagement.test.tsx"
```

### Phase 3.8 - Integration Tests (can run simultaneously)
```bash
Task: "Integration test for admin user complete flow in tests/Feature/Integration/AdminUserFlowTest.php"
Task: "Integration test for teacher user content management in tests/Feature/Integration/TeacherFlowTest.php"
Task: "Integration test for user role limited access in tests/Feature/Integration/UserFlowTest.php"
Task: "Integration test for teacher-user association in tests/Feature/Integration/TeacherUserAssociationTest.php"
```

## Notes
- **[P] tasks** = different files, no dependencies, can run in parallel
- **Critical**: All tests must be written BEFORE implementation (TDD approach)
- **Verify**: Tests fail before implementing functionality
- **Commit**: After each completed task for tracking
- **Constitutional**: All new UI text must use locale files (T058-T061)
- **Performance**: Target <500ms dashboard load times (T068-T069)
- **Security**: Role isolation must be enforced at database level (T070-T071)

## Task Generation Rules Applied

1. **From API Contracts**: Each endpoint → contract test + implementation task
2. **From Data Model**: Each entity → model test + model enhancement task  
3. **From User Stories**: Each role flow → integration test task
4. **TDD Ordering**: All tests before corresponding implementation
5. **Parallel Marking**: Different files marked [P] for concurrent execution
6. **Constitutional Compliance**: Locale file updates for all UI text

## Validation Checklist

- [x] All API contracts have corresponding test tasks
- [x] All data model entities have model tasks
- [x] All test tasks come before implementation tasks
- [x] Parallel tasks ([P]) operate on different files
- [x] Each task specifies exact file path
- [x] No [P] task modifies same file as another [P] task
- [x] Constitutional requirements (localization, Tailwind-only) included
- [x] Role-based access control properly tested
- [x] Component reusability and responsive design addressed
