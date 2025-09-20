# Data Model Design: Role-Based Management System

**Date**: September 20, 2025  
**Feature**: 003-role-admin-teacher  
**Purpose**: Define data structures and relationships for role-based management system

## Core Entities

### User Entity
**Purpose**: Central user account with role-based permissions  
**Fields**:
- `id`: Primary key (existing)
- `name`: User display name (existing)  
- `email`: Authentication email (existing)
- `password`: Hashed password (existing)
- `role`: Enum ['admin', 'teacher', 'user'] (existing, enhanced)
- `teacher_id`: Foreign key to Teacher model (new, nullable)
- `locale`: User interface language preference (existing)
- `status`: Account status ['active', 'inactive', 'suspended'] (existing)
- `email_verified_at`: Email verification timestamp (existing)
- `created_at`, `updated_at`: Timestamps (existing)
- `deleted_at`: Soft delete timestamp (existing)

**Relationships**:
- `belongsTo(Teacher)`: One-to-one relationship with teacher profile
- `hasMany(Post)` as created_by: Posts created by user
- `hasMany(Post)` as updated_by: Posts updated by user
- `hasMany(AuditLog)`: User action history

**Validation Rules**:
- Email must be unique and valid format
- Role must be one of allowed values
- Teacher_id must exist in teachers table if set
- Only one user can have each teacher_id (unique constraint)

**State Transitions**:
- Active → Inactive (admin action)
- Inactive → Active (admin action)  
- Any → Suspended (admin action)
- Suspended → Active (admin action after review)

### Teacher Entity (Enhanced)
**Purpose**: Teacher profile information linked to user account  
**Fields**:
- `id`: Primary key (existing)
- `name`: Teacher name in multiple languages (existing JSON)
- `title`: Academic title in multiple languages (existing JSON)
- `department`: Department affiliation (existing)
- `office`: Office location (existing)
- `phone`: Contact phone (existing)
- `email`: Contact email (existing)
- `research_interests`: Research areas in multiple languages (existing JSON)
- `bio`: Biography in multiple languages (existing JSON)
- `photo_url`: Profile photo URL (existing)
- `user_id`: Foreign key to User model (new, nullable)
- `is_active`: Teacher profile status (existing)
- `created_at`, `updated_at`: Timestamps (existing)
- `deleted_at`: Soft delete timestamp (existing)

**Relationships**:
- `hasOne(User)`: One-to-one relationship with user account
- `hasMany(Lab)`: Labs managed by teacher
- `hasMany(Project)`: Research projects
- `hasMany(Publication)`: Academic publications
- `hasMany(Post)` through user: Posts created by teacher
- `hasMany(TeacherLink)`: External links/profiles

**Validation Rules**:
- User_id must be unique if set
- Multilingual fields must follow JSON structure per constitution
- Email must be valid format if provided

### Role Entity (New)
**Purpose**: Define role permissions and capabilities  
**Fields**:
- `name`: Role identifier ['admin', 'teacher', 'user']
- `display_name`: Human-readable name in multiple languages (JSON)
- `description`: Role description in multiple languages (JSON)
- `permissions`: JSON array of permission strings
- `can_access_admin`: Boolean flag for admin area access
- `can_manage_posts`: Boolean flag for post management
- `can_manage_research`: Boolean flag for research content
- `can_manage_users`: Boolean flag for user management
- `can_view_analytics`: Boolean flag for analytics access
- `created_at`, `updated_at`: Timestamps

**Validation Rules**:
- Name must be unique
- Permissions must be valid JSON array
- Display name and description must follow multilingual JSON structure

### Settings Entity (New)
**Purpose**: User-specific configuration and preferences  
**Fields**:
- `id`: Primary key
- `user_id`: Foreign key to User model
- `category`: Settings category ['interface', 'notifications', 'privacy']
- `key`: Setting identifier
- `value`: Setting value (JSON for complex values)
- `is_public`: Whether setting is visible to other users
- `created_at`, `updated_at`: Timestamps

**Relationships**:
- `belongsTo(User)`: User who owns the setting

**Validation Rules**:
- User_id and key combination must be unique
- Value must be valid JSON if complex type
- Category must be one of allowed values

## Enhanced Existing Entities

### Post Entity (Enhanced for Role-based Access)
**Purpose**: Content management with role-based permissions  
**New Fields**:
- `visibility`: Enum ['public', 'members', 'teachers', 'admin'] (new)
- `can_edit_roles`: JSON array of roles that can edit (new)

**Enhanced Validation**:
- Visibility must be one of allowed values
- Can_edit_roles must be valid JSON array of role names
- Teacher users can only create/edit their own posts

### Lab Entity (Enhanced for Teacher Association)
**Purpose**: Research lab management with teacher ownership  
**Enhanced Relationships**:
- `belongsTo(Teacher)` as primary_investigator: Enhanced relationship
- Teachers can only manage labs where they are PI or collaborator

### Project Entity (Enhanced for Teacher Association)  
**Purpose**: Research project management with teacher ownership
**Enhanced Relationships**:
- `belongsToMany(Teacher)` through pivot: Project collaborators
- Teachers can only manage projects they're associated with

## Permission Model

### Role-Based Permissions
```json
{
  "admin": [
    "manage_all_users",
    "manage_all_posts", 
    "manage_all_research",
    "manage_system_settings",
    "view_all_analytics",
    "manage_roles"
  ],
  "teacher": [
    "manage_own_posts",
    "manage_own_research", 
    "view_own_analytics",
    "manage_profile"
  ],
  "user": [
    "view_public_content",
    "manage_profile",
    "submit_contact_messages"
  ]
}
```

### Ownership Rules
- **Teachers**: Can only access/modify content they created or are associated with
- **Admin**: Full access to all content regardless of ownership
- **User**: Read-only access to public content, full access to own profile

## Data Relationships Diagram

```
User (1) ←→ (0..1) Teacher
  ↓ (1)           ↓ (1)
  ↓               ↓
Settings (n)     Lab (n)
  ↓ (1)           ↓ (1) 
  ↓               ↓
Post (n)        Project (n)
                  ↓ (1)
                  ↓
                Publication (n)
```

## Migration Strategy

### Database Changes Required
1. **Add teacher_id to users table**: Nullable foreign key
2. **Add user_id to teachers table**: Nullable foreign key with unique constraint  
3. **Create roles table**: New table for role definitions
4. **Create settings table**: New table for user preferences
5. **Add role columns to posts**: Visibility and edit permissions
6. **Add indexes**: Performance optimization for role-based queries

### Data Migration Steps
1. **Populate roles table** with default role definitions
2. **Set default user roles** based on existing data patterns
3. **Create teacher-user associations** for existing teacher profiles
4. **Set default post visibility** based on current public/private status
5. **Initialize default settings** for existing users

## Validation & Constraints

### Database Constraints
- `users.teacher_id` → `teachers.id` (foreign key)
- `teachers.user_id` → `users.id` (foreign key, unique)
- `settings.user_id` → `users.id` (foreign key)
- `users.role` must be in roles.name
- Only one user per teacher (unique constraint)

### Application-Level Validation
- Role changes require admin authorization
- Teacher content access verified against ownership
- Settings changes validated against user permissions
- Multilingual content follows constitutional JSON structure

## Security Considerations

### Data Protection
- Role permissions enforced at database query level
- Teacher content isolated by ownership checks
- Sensitive settings marked as private by default
- Audit trail maintained for role changes

### Access Control
- Database foreign key constraints prevent orphaned associations
- Application middleware validates role permissions before data access
- API endpoints secured with role-based guards
- Frontend components respect role visibility rules

This data model design supports the role-based management requirements while maintaining constitutional compliance and ensuring data integrity through proper relationships and constraints.
