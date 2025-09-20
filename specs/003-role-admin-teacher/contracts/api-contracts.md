# API Contracts: Role-Based Management System

**Date**: September 20, 2025  
**Feature**: 003-role-admin-teacher  
**Purpose**: Define API contracts for role-based management functionality

## Authentication & Authorization

### POST /login
**Purpose**: Authenticate user and establish session  
**Request**:
```json
{
  "email": "string (required, email format)",
  "password": "string (required, min 8 chars)",
  "remember": "boolean (optional, default false)"
}
```
**Response** (200):
```json
{
  "user": {
    "id": "number",
    "name": "string", 
    "email": "string",
    "role": "admin|teacher|user",
    "teacher_id": "number|null"
  },
  "redirect_url": "string"
}
```
**Redirect Logic**:
- admin → `/manage/admin/dashboard`
- teacher → `/manage/dashboard` 
- user → `/manage/dashboard`

### POST /logout
**Purpose**: Destroy authenticated session  
**Request**: Empty body  
**Response** (200):
```json
{
  "message": "Successfully logged out"
}
```

## Role Management

### GET /manage/admin/users
**Purpose**: List all users for admin management  
**Authorization**: admin role required  
**Query Parameters**:
- `page`: number (optional, default 1)
- `per_page`: number (optional, default 15, max 100)
- `role`: string (optional, filter by role)
- `search`: string (optional, search name/email)

**Response** (200):
```json
{
  "data": [
    {
      "id": "number",
      "name": "string",
      "email": "string", 
      "role": "admin|teacher|user",
      "teacher_id": "number|null",
      "status": "active|inactive|suspended",
      "email_verified_at": "datetime|null",
      "created_at": "datetime"
    }
  ],
  "links": "pagination_object",
  "meta": "pagination_meta"
}
```

### PATCH /manage/admin/users/{id}/role
**Purpose**: Update user role (admin only)  
**Authorization**: admin role required  
**Request**:
```json
{
  "role": "admin|teacher|user",
  "teacher_id": "number|null (required if role=teacher)"
}
```
**Response** (200):
```json
{
  "user": "user_object",
  "message": "Role updated successfully"
}
```

## Content Management

### GET /manage/posts
**Purpose**: List posts based on user role  
**Authorization**: authenticated required  
**Query Parameters**:
- `page`, `per_page`: pagination
- `category`: string (optional, filter by category)
- `status`: string (optional, filter by status)

**Response** (200):
```json
{
  "data": [
    {
      "id": "number",
      "title": "multilingual_json",
      "content": "multilingual_json", 
      "category": "object",
      "status": "draft|published|archived",
      "visibility": "public|members|teachers|admin",
      "created_by": "user_object",
      "updated_by": "user_object|null",
      "can_edit": "boolean",
      "can_delete": "boolean",
      "created_at": "datetime",
      "updated_at": "datetime"
    }
  ],
  "links": "pagination_object",
  "meta": "pagination_meta"
}
```

**Role-Based Filtering**:
- admin: sees all posts
- teacher: sees own posts + public posts
- user: sees public posts only

### POST /manage/posts
**Purpose**: Create new post  
**Authorization**: admin or teacher role required  
**Request**:
```json
{
  "title": {
    "zh-TW": "string (required)",
    "en": "string (required)"
  },
  "content": {
    "zh-TW": "string (required)",
    "en": "string (required)"
  },
  "category_id": "number (required)",
  "status": "draft|published (optional, default draft)",
  "visibility": "public|members|teachers|admin (optional, default public)",
  "scheduled_at": "datetime (optional)"
}
```
**Response** (201):
```json
{
  "post": "post_object",
  "message": "Post created successfully"
}
```

### PUT /manage/posts/{id}
**Purpose**: Update existing post  
**Authorization**: admin or post owner (teacher) required  
**Request**: Same as POST with all fields optional  
**Response** (200):
```json
{
  "post": "post_object", 
  "message": "Post updated successfully"
}
```

### DELETE /manage/posts/{id}
**Purpose**: Delete post  
**Authorization**: admin or post owner required  
**Response** (200):
```json
{
  "message": "Post deleted successfully"
}
```

## Research Management

### GET /manage/labs
**Purpose**: List labs based on user role  
**Authorization**: authenticated required  
**Response** (200):
```json
{
  "data": [
    {
      "id": "number",
      "name": "multilingual_json",
      "description": "multilingual_json",
      "principal_investigator": "teacher_object",
      "members": ["teacher_object_array"],
      "can_edit": "boolean",
      "created_at": "datetime"
    }
  ]
}
```

**Role-Based Filtering**:
- admin: sees all labs
- teacher: sees labs where they are PI or member
- user: sees public lab information only

### POST /manage/labs
**Purpose**: Create new lab  
**Authorization**: admin or teacher role required  
**Request**:
```json
{
  "name": {
    "zh-TW": "string (required)",
    "en": "string (required)"
  },
  "description": {
    "zh-TW": "string (required)",
    "en": "string (required)"
  },
  "principal_investigator_id": "number (required)",
  "member_ids": "number_array (optional)"
}
```

### GET /manage/projects  
**Purpose**: List research projects based on user role  
**Authorization**: authenticated required  
**Role-Based Filtering**: Same pattern as labs

### GET /manage/publications
**Purpose**: List publications based on user role  
**Authorization**: authenticated required  
**Role-Based Filtering**: Same pattern as labs

## Settings Management

### GET /manage/settings
**Purpose**: Get user settings  
**Authorization**: authenticated required  
**Response** (200):
```json
{
  "interface": {
    "locale": "zh-TW|en",
    "theme": "light|dark",
    "dashboard_layout": "compact|expanded"
  },
  "notifications": {
    "email_announcements": "boolean",
    "email_research_updates": "boolean",
    "browser_notifications": "boolean"
  },
  "privacy": {
    "profile_visibility": "public|members|private",
    "research_visibility": "public|members|private"
  }
}
```

### PATCH /manage/settings
**Purpose**: Update user settings  
**Authorization**: authenticated required  
**Request**: Partial settings object  
**Response** (200):
```json
{
  "settings": "settings_object",
  "message": "Settings updated successfully"
}
```

## Admin-Specific Endpoints

### GET /manage/admin/dashboard
**Purpose**: Admin dashboard data  
**Authorization**: admin role required  
**Response** (200):
```json
{
  "stats": {
    "total_users": "number",
    "total_posts": "number", 
    "total_teachers": "number",
    "recent_activity": "activity_array"
  },
  "quick_actions": "action_array",
  "pending_approvals": {
    "users": "number",
    "content": "number"
  }
}
```

### GET /manage/admin/audit-logs
**Purpose**: System audit logs  
**Authorization**: admin role required  
**Query Parameters**: 
- Standard pagination + date range filters
**Response** (200):
```json
{
  "data": [
    {
      "id": "number",
      "user": "user_object",
      "action": "string",
      "resource_type": "string",
      "resource_id": "number|null",
      "changes": "json_object",
      "ip_address": "string",
      "user_agent": "string",
      "created_at": "datetime"
    }
  ]
}
```

## Error Responses

### Standard Error Format
```json
{
  "message": "Human readable error message",
  "errors": {
    "field_name": ["Validation error messages"]
  },
  "code": "ERROR_CODE"
}
```

### Common Status Codes
- **200**: Success
- **201**: Created
- **400**: Validation Error
- **401**: Unauthorized (not logged in)
- **403**: Forbidden (insufficient permissions)
- **404**: Not Found
- **422**: Unprocessable Entity (validation failed)
- **429**: Rate Limited
- **500**: Server Error

## Rate Limiting

### Limits by Endpoint Type
- Authentication: 5 requests per minute
- Content creation: 10 requests per minute  
- Content retrieval: 60 requests per minute
- Settings: 20 requests per minute

### Rate Limit Headers
```
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 59
X-RateLimit-Reset: 1632150000
```

## Security Headers

### Required Headers
- `Authorization: Bearer <token>` (for API)
- `X-CSRF-TOKEN: <token>` (for web)
- `Content-Type: application/json`

### Response Headers
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`

These API contracts define the interface between frontend and backend for the role-based management system, ensuring proper authorization, data validation, and constitutional compliance.
