<?php

declare(strict_types=1);

namespace Tests\Unit\Policies;

use App\Models\User;
use App\Policies\UserPolicy;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserPolicyTest extends TestCase
{
    use RefreshDatabase;

    protected UserPolicy $policy;

    protected function setUp(): void
    {
        parent::setUp();
        $this->policy = new UserPolicy();
    }

    /**
     * Test admin can view any user
     */
    public function test_admin_can_view_any_user(): void
    {
        $admin = User::factory()->admin()->create();
        $user = User::factory()->create();

        $this->assertTrue($this->policy->viewAny($admin));
        $this->assertTrue($this->policy->view($admin, $user));
    }

    /**
     * Test teacher can view users they manage
     */
    public function test_teacher_can_view_managed_users(): void
    {
        $teacher = User::factory()->teacher()->create();
        $regularUser = User::factory()->user()->create();
        $anotherTeacher = User::factory()->teacher()->create();

        $this->assertTrue($this->policy->viewAny($teacher));
        $this->assertTrue($this->policy->view($teacher, $regularUser));
        $this->assertFalse($this->policy->view($teacher, $anotherTeacher));
    }

    /**
     * Test regular user can only view themselves
     */
    public function test_user_can_only_view_themselves(): void
    {
        $user = User::factory()->user()->create();
        $otherUser = User::factory()->user()->create();

        $this->assertFalse($this->policy->viewAny($user));
        $this->assertTrue($this->policy->view($user, $user));
        $this->assertFalse($this->policy->view($user, $otherUser));
    }

    /**
     * Test admin can create any user
     */
    public function test_admin_can_create_users(): void
    {
        $admin = User::factory()->admin()->create();

        $this->assertTrue($this->policy->create($admin));
    }

    /**
     * Test teacher cannot create users
     */
    public function test_teacher_cannot_create_users(): void
    {
        $teacher = User::factory()->teacher()->create();

        $this->assertFalse($this->policy->create($teacher));
    }

    /**
     * Test regular user cannot create users
     */
    public function test_user_cannot_create_users(): void
    {
        $user = User::factory()->user()->create();

        $this->assertFalse($this->policy->create($user));
    }

    /**
     * Test admin can update any user except other admins
     */
    public function test_admin_can_update_non_admin_users(): void
    {
        $admin = User::factory()->admin()->create();
        $otherAdmin = User::factory()->admin()->create();
        $teacher = User::factory()->teacher()->create();
        $user = User::factory()->user()->create();

        $this->assertTrue($this->policy->update($admin, $teacher));
        $this->assertTrue($this->policy->update($admin, $user));
        $this->assertFalse($this->policy->update($admin, $otherAdmin));
        $this->assertTrue($this->policy->update($admin, $admin)); // Can update self
    }

    /**
     * Test teacher can update users they manage
     */
    public function test_teacher_can_update_managed_users(): void
    {
        $teacher = User::factory()->teacher()->create();
        $regularUser = User::factory()->user()->create();
        $anotherTeacher = User::factory()->teacher()->create();
        $admin = User::factory()->admin()->create();

        $this->assertTrue($this->policy->update($teacher, $regularUser));
        $this->assertFalse($this->policy->update($teacher, $anotherTeacher));
        $this->assertFalse($this->policy->update($teacher, $admin));
        $this->assertTrue($this->policy->update($teacher, $teacher)); // Can update self
    }

    /**
     * Test regular user can only update themselves
     */
    public function test_user_can_only_update_themselves(): void
    {
        $user = User::factory()->user()->create();
        $otherUser = User::factory()->user()->create();
        $teacher = User::factory()->teacher()->create();

        $this->assertTrue($this->policy->update($user, $user));
        $this->assertFalse($this->policy->update($user, $otherUser));
        $this->assertFalse($this->policy->update($user, $teacher));
    }

    /**
     * Test admin can delete non-admin users
     */
    public function test_admin_can_delete_non_admin_users(): void
    {
        $admin = User::factory()->admin()->create();
        $otherAdmin = User::factory()->admin()->create();
        $teacher = User::factory()->teacher()->create();
        $user = User::factory()->user()->create();

        $this->assertTrue($this->policy->delete($admin, $teacher));
        $this->assertTrue($this->policy->delete($admin, $user));
        $this->assertFalse($this->policy->delete($admin, $otherAdmin));
        $this->assertFalse($this->policy->delete($admin, $admin)); // Cannot delete self
    }

    /**
     * Test teacher cannot delete users
     */
    public function test_teacher_cannot_delete_users(): void
    {
        $teacher = User::factory()->teacher()->create();
        $user = User::factory()->user()->create();

        $this->assertFalse($this->policy->delete($teacher, $user));
        $this->assertFalse($this->policy->delete($teacher, $teacher));
    }

    /**
     * Test regular user cannot delete users
     */
    public function test_user_cannot_delete_users(): void
    {
        $user = User::factory()->user()->create();
        $otherUser = User::factory()->user()->create();

        $this->assertFalse($this->policy->delete($user, $otherUser));
        $this->assertFalse($this->policy->delete($user, $user));
    }

    /**
     * Test admin can restore users
     */
    public function test_admin_can_restore_users(): void
    {
        $admin = User::factory()->admin()->create();
        $user = User::factory()->user()->create();

        $this->assertTrue($this->policy->restore($admin, $user));
    }

    /**
     * Test teacher cannot restore users
     */
    public function test_teacher_cannot_restore_users(): void
    {
        $teacher = User::factory()->teacher()->create();
        $user = User::factory()->user()->create();

        $this->assertFalse($this->policy->restore($teacher, $user));
    }

    /**
     * Test admin can force delete users
     */
    public function test_admin_can_force_delete_users(): void
    {
        $admin = User::factory()->admin()->create();
        $user = User::factory()->user()->create();

        $this->assertTrue($this->policy->forceDelete($admin, $user));
        $this->assertFalse($this->policy->forceDelete($admin, $admin)); // Cannot force delete self
    }

    /**
     * Test role-based permissions for assign role
     */
    public function test_assign_role_permissions(): void
    {
        $admin = User::factory()->admin()->create();
        $teacher = User::factory()->teacher()->create();
        $user = User::factory()->user()->create();

        // Admin can assign roles to lower roles
        $this->assertTrue($this->policy->assignRole($admin, $user));
        $this->assertTrue($this->policy->assignRole($admin, $teacher));

        // Admin cannot assign admin role to others or change other admin roles
        $otherAdmin = User::factory()->admin()->create();
        $this->assertFalse($this->policy->assignRole($admin, $otherAdmin));

        // Teacher cannot assign roles
        $this->assertFalse($this->policy->assignRole($teacher, $user));

        // User cannot assign roles
        $this->assertFalse($this->policy->assignRole($user, $user));
    }

    /**
     * Test manage teacher assignments permission
     */
    public function test_manage_teacher_assignments_permissions(): void
    {
        $admin = User::factory()->admin()->create();
        $teacher = User::factory()->teacher()->create();
        $user = User::factory()->user()->create();

        // Admin can manage teacher assignments
        $this->assertTrue($this->policy->manageTeacherAssignments($admin));

        // Teacher cannot manage teacher assignments
        $this->assertFalse($this->policy->manageTeacherAssignments($teacher));

        // User cannot manage teacher assignments
        $this->assertFalse($this->policy->manageTeacherAssignments($user));
    }

    /**
     * Test view settings permission
     */
    public function test_view_settings_permissions(): void
    {
        $admin = User::factory()->admin()->create();
        $teacher = User::factory()->teacher()->create();
        $user = User::factory()->user()->create();
        $targetUser = User::factory()->user()->create();

        // Admin can view any user's settings
        $this->assertTrue($this->policy->viewSettings($admin, $targetUser));

        // Teacher can view their own settings but not others'
        $this->assertTrue($this->policy->viewSettings($teacher, $teacher));
        $this->assertFalse($this->policy->viewSettings($teacher, $targetUser));

        // User can only view their own settings
        $this->assertTrue($this->policy->viewSettings($user, $user));
        $this->assertFalse($this->policy->viewSettings($user, $targetUser));
    }

    /**
     * Test update settings permission
     */
    public function test_update_settings_permissions(): void
    {
        $admin = User::factory()->admin()->create();
        $teacher = User::factory()->teacher()->create();
        $user = User::factory()->user()->create();
        $targetUser = User::factory()->user()->create();

        // Admin can update any user's settings
        $this->assertTrue($this->policy->updateSettings($admin, $targetUser));

        // Teacher can update their own settings but not others'
        $this->assertTrue($this->policy->updateSettings($teacher, $teacher));
        $this->assertFalse($this->policy->updateSettings($teacher, $targetUser));

        // User can only update their own settings
        $this->assertTrue($this->policy->updateSettings($user, $user));
        $this->assertFalse($this->policy->updateSettings($user, $targetUser));
    }

    /**
     * Test admin dashboard access
     */
    public function test_admin_dashboard_access(): void
    {
        $admin = User::factory()->admin()->create();
        $teacher = User::factory()->teacher()->create();
        $user = User::factory()->user()->create();

        $this->assertTrue($this->policy->accessAdminDashboard($admin));
        $this->assertFalse($this->policy->accessAdminDashboard($teacher));
        $this->assertFalse($this->policy->accessAdminDashboard($user));
    }

    /**
     * Test management dashboard access
     */
    public function test_management_dashboard_access(): void
    {
        $admin = User::factory()->admin()->create();
        $teacher = User::factory()->teacher()->create();
        $user = User::factory()->user()->create();

        $this->assertTrue($this->policy->accessManageDashboard($admin));
        $this->assertTrue($this->policy->accessManageDashboard($teacher));
        $this->assertFalse($this->policy->accessManageDashboard($user));
    }
}
