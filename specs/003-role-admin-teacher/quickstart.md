# Quick Start Guide: Role-Based Management System

**Date**: September 20, 2025  
**Feature**: 003-role-admin-teacher  
**Purpose**: Guide for testing and validating the role-based management system implementation

## Overview

This guide provides step-by-step instructions for testing the role-based management system functionality. Use this guide to validate that the implementation meets all functional requirements.

## Prerequisites

### Environment Setup
1. **Database**: MySQL 8.0+ with test database created
2. **PHP**: Version 8.2+ with required extensions
3. **Node.js**: Version 18+ for frontend build tools
4. **Testing Tools**: PHPUnit, Jest, browser for manual testing

### Test Data Setup
```bash
# Run migrations and seeders
php artisan migrate:fresh --seed

# Create test users for each role
php artisan make:test-users
```

## Test Scenarios

### Scenario 1: Admin User Flow

**Test User**: admin@example.com / password  
**Expected Role**: admin  
**Expected Access**: All management pages

#### Steps:
1. **Login Test**
   ```bash
   # Navigate to login page
   curl -X POST /login -d '{"email":"admin@example.com","password":"password"}'
   ```
   **Expected**: Redirect to `/manage/admin/dashboard`

2. **Admin Dashboard Access**
   - Visit `/manage/admin/dashboard`
   - **Expected**: Dashboard loads with full statistics
   - **Expected**: Quick actions for all management areas visible
   - **Expected**: User management, content management, research management all accessible

3. **User Management Test**
   - Visit `/manage/admin/users`
   - **Expected**: List of all users displayed
   - **Expected**: Role assignment controls visible
   - **Expected**: Can change user roles successfully

4. **Content Management Test**
   - Visit `/manage/admin/posts`
   - **Expected**: All posts visible regardless of author
   - **Expected**: Can edit any post
   - **Expected**: Can delete any post

5. **System Settings Test**
   - Visit `/manage/admin/settings`
   - **Expected**: System-wide settings accessible
   - **Expected**: Can modify global configurations

#### Validation Points:
- [ ] Admin can access all management pages
- [ ] Admin can manage all users and content
- [ ] Admin sees system-wide statistics
- [ ] No permission denied errors

### Scenario 2: Teacher User Flow

**Test User**: teacher@example.com / password  
**Expected Role**: teacher  
**Expected Access**: Own content management only

#### Steps:
1. **Login Test**
   ```bash
   curl -X POST /login -d '{"email":"teacher@example.com","password":"password"}'
   ```
   **Expected**: Redirect to `/manage/dashboard`

2. **Management Dashboard Access**
   - Visit `/manage/dashboard`
   - **Expected**: Dashboard loads with teacher-specific content
   - **Expected**: Quick actions limited to announcement and research management
   - **Expected**: No user management options visible

3. **Content Management Test**
   - Visit `/manage/posts`
   - **Expected**: Only own posts visible
   - **Expected**: Cannot see posts by other teachers
   - **Expected**: Can create new posts
   - **Expected**: Can edit own posts only

4. **Research Management Test**
   - Visit `/manage/labs`
   - **Expected**: Only labs where teacher is PI or member
   - **Expected**: Can manage own lab information
   - **Expected**: Cannot modify other teachers' labs

5. **Access Restriction Test**
   - Try to visit `/manage/admin/users`
   - **Expected**: 403 Forbidden or redirect with error message
   - Try to edit another teacher's post
   - **Expected**: Permission denied

#### Validation Points:
- [ ] Teacher can only access own content
- [ ] Teacher cannot access admin functions
- [ ] Teacher can manage posts and research
- [ ] Proper permission errors for unauthorized access

### Scenario 3: User Role Flow

**Test User**: user@example.com / password  
**Expected Role**: user  
**Expected Access**: Limited to profile and settings

#### Steps:
1. **Login Test**
   ```bash
   curl -X POST /login -d '{"email":"user@example.com","password":"password"}'
   ```
   **Expected**: Redirect to `/manage/dashboard`

2. **Dashboard Access**
   - Visit `/manage/dashboard`
   - **Expected**: Basic dashboard with limited functionality
   - **Expected**: No content management options
   - **Expected**: Profile and settings access only

3. **Settings Test**
   - Visit `/manage/settings`
   - **Expected**: Personal settings accessible
   - **Expected**: Interface preferences editable
   - **Expected**: Cannot access system settings

4. **Access Restriction Test**
   - Try to visit `/manage/posts`
   - **Expected**: Permission denied or limited view
   - Try to visit `/manage/admin/*`
   - **Expected**: 403 Forbidden

#### Validation Points:
- [ ] User has minimal management access
- [ ] User cannot create or edit content
- [ ] User can manage own profile/settings
- [ ] Proper access restrictions enforced

### Scenario 4: Teacher-User Association

**Purpose**: Test one-to-one relationship between teacher profile and user account

#### Steps:
1. **Create Teacher Profile**
   - Admin creates new teacher profile
   - Associate with existing user account
   - **Expected**: User role automatically updated to 'teacher'

2. **Test Association**
   - Login with associated user account
   - **Expected**: Has teacher permissions
   - **Expected**: Can manage teacher profile content

3. **Test Uniqueness**
   - Try to associate teacher profile with another user
   - **Expected**: Validation error - one teacher per user

#### Validation Points:
- [ ] One-to-one relationship enforced
- [ ] Role automatically updated on association
- [ ] Teacher content access granted

## UI/UX Validation

### Responsive Design Test

#### Desktop (1920x1080)
- [ ] Management interface displays correctly
- [ ] All navigation elements accessible
- [ ] Content tables properly formatted
- [ ] Settings forms layout correctly

#### Tablet (768x1024)
- [ ] Navigation collapses appropriately
- [ ] Content remains readable
- [ ] Forms adapt to screen size
- [ ] Touch interactions work properly

#### Mobile (375x667)
- [ ] Mobile menu functions correctly
- [ ] Content scrolls properly
- [ ] Forms are usable on small screens
- [ ] All features accessible

### Clean Design Validation
- [ ] White background consistently applied
- [ ] Clean, minimal interface design
- [ ] Proper spacing and typography
- [ ] No visual clutter or unnecessary elements
- [ ] Consistent use of Tailwind utility classes

### Component Reusability Test
- [ ] Common UI elements use shared components
- [ ] Navigation components consistent across roles
- [ ] Form components reused appropriately  
- [ ] No code duplication in UI elements

## Multilingual Support Test

### Language Switching
1. **Content Creation**
   - Create post with Chinese and English content
   - **Expected**: Tab switching works for both languages
   - **Expected**: Content saves correctly in JSON format

2. **Content Display**
   - Switch interface language
   - **Expected**: Content displays in selected language
   - **Expected**: Falls back gracefully if translation missing

#### Validation Points:
- [ ] Multilingual JSON structure maintained
- [ ] Tab switching interface functional
- [ ] No data loss during language switches
- [ ] Constitutional compliance verified

## Performance Validation

### Page Load Times
- [ ] Dashboard loads in <500ms
- [ ] Content lists load in <1000ms
- [ ] Settings save in <200ms
- [ ] No blocking operations on UI

### Database Performance
- [ ] Role-based queries optimized
- [ ] No N+1 query problems
- [ ] Indexes improve query performance
- [ ] Large datasets paginate properly

## Security Validation

### Authorization Tests
- [ ] Server-side role validation enforced
- [ ] Client-side restrictions backup only
- [ ] API endpoints require proper authentication
- [ ] CSRF protection active

### Data Isolation Tests
- [ ] Teachers cannot access others' data
- [ ] Database queries filter by ownership
- [ ] No data leakage between roles
- [ ] Audit logs capture role changes

## Bug Fixes Validation

### Common Issues Checklist
- [ ] Login redirect works for all roles
- [ ] Role switching updates permissions immediately
- [ ] Component rendering issues resolved
- [ ] Form validation consistent across pages
- [ ] Navigation state preserved correctly

## Completion Checklist

### Functional Requirements
- [ ] FR-001: Three distinct user roles implemented
- [ ] FR-002: Admin access to all management pages
- [ ] FR-003: Teacher access limited to own content
- [ ] FR-004: One-to-one teacher-user relationship
- [ ] FR-005: Teacher content isolation enforced
- [ ] FR-006: Admin functions consolidated under manage
- [ ] FR-007: Reusable UI components implemented
- [ ] FR-008: Clean white-background design applied
- [ ] FR-009: Fully responsive design (RWD)
- [ ] FR-010: Settings interface included

### Constitutional Compliance
- [ ] Multilingual JSON storage maintained
- [ ] Tab switching for language editing functional
- [ ] Tailwind-only styling used
- [ ] Shared component architecture followed
- [ ] No scattered CSS files added

### User Experience
- [ ] Clean, intuitive interface
- [ ] Smooth role-based navigation
- [ ] Responsive across all devices
- [ ] Fast, reliable performance
- [ ] Proper error handling and messaging

## Troubleshooting

### Common Issues
1. **Permission Denied Errors**: Check role middleware and policies
2. **Component Not Loading**: Verify import paths and dependencies
3. **Styling Issues**: Ensure Tailwind classes compiled correctly
4. **Database Errors**: Check migrations and foreign key constraints

### Debug Commands
```bash
# Check role assignments
php artisan user:check-roles

# Verify component compilation
npm run build

# Test database permissions
php artisan test --filter=RolePermissionTest
```

This quick start guide provides comprehensive validation of the role-based management system implementation, ensuring all requirements are met and the system functions correctly across all user roles and scenarios.
