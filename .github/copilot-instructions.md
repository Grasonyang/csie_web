# csie_fk Development Guidelines

Auto-generated from all feature plans. Last updated: 2025-09-20

## Active Technologies
- **Backend**: PHP 8.2+ (Laravel 11), MySQL
- **Frontend**: TypeScript (React with Inertia.js), Tailwind CSS
- **Testing**: PHPUnit, Jest/React Testing Library (003-role-admin-teacher)

## Project Structure
```
app/                     # Laravel backend
├── Http/Controllers/    # Controllers including Admin namespace
├── Models/             # Eloquent models with role relationships
├── Policies/           # Authorization policies for role-based access
└── Services/           # Business logic services

resources/js/           # React frontend
├── components/ui/      # Shared UI components (constitutional requirement)
├── pages/manage/       # Unified management interface
├── pages/admin/        # Admin-specific pages
└── pages/settings/     # Settings interface

routes/
├── manage.php          # Role-based management routes
└── auth.php           # Authentication with role-based redirects
```

## Commands
# Role management
php artisan user:check-roles              # Verify user role assignments
php artisan make:test-users               # Create test users for all roles

# Development
npm run dev                               # Frontend development server
php artisan serve                         # Backend development server

## Code Style
**Laravel**: Follow Laravel conventions with policies for authorization
**React**: Functional components with TypeScript, shared component architecture
**Styling**: Tailwind CSS only (constitutional requirement - no scattered CSS)
**Multilingual**: JSON structure with Tab switching interface (constitutional requirement)

## Recent Changes
- 003-role-admin-teacher: Added role-based management system with admin/teacher/user roles, unified manage interface, reusable components, RWD, and settings

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
