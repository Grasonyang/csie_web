<?php

namespace Tests\Unit\Models;

use App\Models\Teacher;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function it_has_valid_role_values()
    {
        $validRoles = ['admin', 'teacher', 'user'];

        foreach ($validRoles as $role) {
            $user = User::factory()->create(['role' => $role]);
            $this->assertEquals($role, $user->role);
        }
    }

    /** @test */
    public function it_has_default_user_role()
    {
        $user = User::factory()->create();
        $this->assertEquals('user', $user->role);
    }

    /** @test */
    public function it_can_belong_to_a_teacher()
    {
        $user = User::factory()->create(['role' => 'teacher']);
        $teacher = Teacher::factory()->create(['user_id' => $user->id]);

        $this->assertInstanceOf(Teacher::class, $user->teacher);
        $this->assertEquals($teacher->id, $user->teacher->id);
    }

    /** @test */
    public function it_can_check_if_user_is_admin()
    {
        $adminUser = User::factory()->create(['role' => 'admin']);
        $teacherUser = User::factory()->create(['role' => 'teacher']);
        $regularUser = User::factory()->create(['role' => 'user']);

        $this->assertTrue($adminUser->isAdmin());
        $this->assertFalse($teacherUser->isAdmin());
        $this->assertFalse($regularUser->isAdmin());
    }

    /** @test */
    public function it_can_check_if_user_is_teacher()
    {
        $adminUser = User::factory()->create(['role' => 'admin']);
        $teacherUser = User::factory()->create(['role' => 'teacher']);
        $regularUser = User::factory()->create(['role' => 'user']);

        $this->assertTrue($teacherUser->isTeacher());
        $this->assertFalse($adminUser->isTeacher());
        $this->assertFalse($regularUser->isTeacher());
    }

    /** @test */
    public function it_can_check_role_hierarchy()
    {
        $adminUser = User::factory()->create(['role' => 'admin']);
        $teacherUser = User::factory()->create(['role' => 'teacher']);
        $regularUser = User::factory()->create(['role' => 'user']);

        // Admin has highest privileges
        $this->assertTrue($adminUser->hasRoleOrHigher('admin'));
        $this->assertTrue($adminUser->hasRoleOrHigher('teacher'));
        $this->assertTrue($adminUser->hasRoleOrHigher('user'));

        // Teacher has teacher and user privileges
        $this->assertFalse($teacherUser->hasRoleOrHigher('admin'));
        $this->assertTrue($teacherUser->hasRoleOrHigher('teacher'));
        $this->assertTrue($teacherUser->hasRoleOrHigher('user'));

        // User has only user privileges
        $this->assertFalse($regularUser->hasRoleOrHigher('admin'));
        $this->assertFalse($regularUser->hasRoleOrHigher('teacher'));
        $this->assertTrue($regularUser->hasRoleOrHigher('user'));
    }

    /** @test */
    public function it_can_have_settings()
    {
        $user = User::factory()->create();

        // This test will initially fail until Settings model is created
        $this->assertInstanceOf('Illuminate\Database\Eloquent\Collection', $user->settings);
    }

    /** @test */
    public function it_has_audit_logs_relationship()
    {
        $user = User::factory()->create();

        // This test will initially fail until AuditLog model exists
        $this->assertInstanceOf('Illuminate\Database\Eloquent\Collection', $user->auditLogs);
    }
}
