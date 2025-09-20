<?php

namespace Tests\Feature\Admin;

use App\Models\User;
use App\Models\AuditLog;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserRestoreTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_see_soft_deleted_users_in_listing()
    {
        // Create admin user
        $admin = User::factory()->create([
            'role' => 'admin',
            'email_verified_at' => now(),
        ]);

        // Create regular user and soft delete them
        $deletedUser = User::factory()->create([
            'role' => 'user',
            'name' => 'Deleted User',
            'email' => 'deleted@example.com',
        ]);
        $deletedUser->delete();

        // Create active user for comparison
        $activeUser = User::factory()->create([
            'role' => 'user',
            'name' => 'Active User',
            'email' => 'active@example.com',
        ]);

        // Admin should see both active and soft-deleted users
        $response = $this->actingAs($admin)->get(route('admin.users.index'));

        $response->assertStatus(200);

        // Check that the response includes both users
        $users = $response->viewData('page')['props']['users']['data'];
        $userEmails = collect($users)->pluck('email')->toArray();

        $this->assertContains('deleted@example.com', $userEmails, 'Soft-deleted user should appear in admin listing');
        $this->assertContains('active@example.com', $userEmails, 'Active user should appear in admin listing');
    }

    public function test_admin_can_restore_soft_deleted_user()
    {
        // Create admin user
        $admin = User::factory()->create([
            'role' => 'admin',
            'email_verified_at' => now(),
        ]);

        // Create user and soft delete them
        $deletedUser = User::factory()->create([
            'role' => 'user',
            'name' => 'User To Restore',
            'email' => 'restore@example.com',
        ]);
        $deletedUser->delete();

        // Verify user is soft-deleted
        $this->assertSoftDeleted('users', ['id' => $deletedUser->id]);

        // Admin restores the user
        $response = $this->actingAs($admin)
            ->post(route('admin.users.restore', $deletedUser->id));

        $response->assertRedirect(route('admin.users.index'));
        $response->assertSessionHas('success');

        // Verify user is restored
        $this->assertDatabaseHas('users', [
            'id' => $deletedUser->id,
            'deleted_at' => null,
        ]);

        // Verify user can login again
        $restoredUser = User::find($deletedUser->id);
        $this->assertNotNull($restoredUser);
        $this->assertNull($restoredUser->deleted_at);

        // Verify audit log was created
        $this->assertDatabaseHas('audit_logs', [
            'actor_id' => $admin->id,
            'action' => 'restore_user',
            'target_type' => User::class,
            'target_id' => $deletedUser->id,
        ]);

        $auditLog = AuditLog::where('action', 'restore_user')
            ->where('target_id', $deletedUser->id)
            ->first();

        $this->assertNotNull($auditLog);
        $this->assertEquals($admin->id, $auditLog->actor_id);
        $this->assertArrayHasKey('restored_user_email', $auditLog->metadata);
        $this->assertEquals('restore@example.com', $auditLog->metadata['restored_user_email']);
    }

    public function test_non_admin_cannot_restore_users()
    {
        // Create regular user
        $user = User::factory()->create([
            'role' => 'user',
            'email_verified_at' => now(),
        ]);

        // Create another user and soft delete them
        $deletedUser = User::factory()->create([
            'role' => 'user',
        ]);
        $deletedUser->delete();

        // Regular user tries to restore
        $response = $this->actingAs($user)
            ->post(route('admin.users.restore', $deletedUser->id));

        $response->assertStatus(403); // Forbidden
    }

    public function test_restore_route_exists()
    {
        $admin = User::factory()->create([
            'role' => 'admin',
            'email_verified_at' => now(),
        ]);

        $deletedUser = User::factory()->create();
        $deletedUser->delete();

        // Test that the route exists (even if it returns 404 initially)
        $response = $this->actingAs($admin)
            ->post(route('admin.users.restore', $deletedUser->id));

        // Should not be a route not found error
        $this->assertNotEquals(404, $response->getStatusCode(), 'Route admin.users.restore should exist');
    }
}
