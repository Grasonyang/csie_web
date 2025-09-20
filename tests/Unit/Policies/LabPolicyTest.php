<?php

namespace Tests\Unit\Policies;

use Tests\TestCase;
use App\Models\User;
use App\Models\Lab;
use App\Models\Teacher;
use App\Policies\LabPolicy;
use Illuminate\Foundation\Testing\RefreshDatabase;

class LabPolicyTest extends TestCase
{
    use RefreshDatabase;

    protected $policy;
    protected $admin;
    protected $teacher;
    protected $user;
    protected $teacherWithLab;
    protected $teacherWithoutLab;
    protected $lab;
    protected $labWithTeacher;

    protected function setUp(): void
    {
        parent::setUp();

        $this->policy = new LabPolicy();

        // Create test users
        $this->admin = User::factory()->create(['role' => 'admin']);
        $this->teacher = User::factory()->create(['role' => 'teacher']);
        $this->user = User::factory()->create(['role' => 'user']);

        // Create test teachers
        $this->teacherWithLab = Teacher::factory()->create(['user_id' => $this->teacher->id]);
        $this->teacherWithoutLab = Teacher::factory()->create();

        // Create test labs
        $this->lab = Lab::factory()->create();
        $this->labWithTeacher = Lab::factory()->create();

        // Assign teacher to lab
        $this->labWithTeacher->teachers()->attach($this->teacherWithLab->id);
    }

    public function test_all_users_can_view_any_lab()
    {
        $this->assertTrue($this->policy->viewAny($this->admin));
        $this->assertTrue($this->policy->viewAny($this->teacher));
        $this->assertTrue($this->policy->viewAny($this->user));
    }

    public function test_all_users_can_view_lab()
    {
        $this->assertTrue($this->policy->view($this->admin, $this->lab));
        $this->assertTrue($this->policy->view($this->teacher, $this->lab));
        $this->assertTrue($this->policy->view($this->user, $this->lab));
    }

    public function test_only_admin_can_create_lab()
    {
        $this->assertTrue($this->policy->create($this->admin));
        $this->assertFalse($this->policy->create($this->teacher));
        $this->assertFalse($this->policy->create($this->user));
    }

    public function test_admin_can_update_any_lab()
    {
        $this->assertTrue($this->policy->update($this->admin, $this->lab));
        $this->assertTrue($this->policy->update($this->admin, $this->labWithTeacher));
    }

    public function test_teacher_can_update_own_lab()
    {
        $this->assertTrue($this->policy->update($this->teacher, $this->labWithTeacher));
        $this->assertFalse($this->policy->update($this->teacher, $this->lab));
    }

    public function test_user_cannot_update_lab()
    {
        $this->assertFalse($this->policy->update($this->user, $this->lab));
        $this->assertFalse($this->policy->update($this->user, $this->labWithTeacher));
    }

    public function test_only_admin_can_delete_lab()
    {
        $this->assertTrue($this->policy->delete($this->admin, $this->lab));
        $this->assertTrue($this->policy->delete($this->admin, $this->labWithTeacher));
        $this->assertFalse($this->policy->delete($this->teacher, $this->labWithTeacher));
        $this->assertFalse($this->policy->delete($this->user, $this->lab));
    }

    public function test_admin_and_lab_teacher_can_manage_members()
    {
        $this->assertTrue($this->policy->manageMembers($this->admin, $this->lab));
        $this->assertTrue($this->policy->manageMembers($this->admin, $this->labWithTeacher));
        $this->assertTrue($this->policy->manageMembers($this->teacher, $this->labWithTeacher));
        $this->assertFalse($this->policy->manageMembers($this->teacher, $this->lab));
        $this->assertFalse($this->policy->manageMembers($this->user, $this->lab));
    }

    public function test_admin_and_lab_teacher_can_view_lab_analytics()
    {
        $this->assertTrue($this->policy->viewAnalytics($this->admin, $this->lab));
        $this->assertTrue($this->policy->viewAnalytics($this->admin, $this->labWithTeacher));
        $this->assertTrue($this->policy->viewAnalytics($this->teacher, $this->labWithTeacher));
        $this->assertFalse($this->policy->viewAnalytics($this->teacher, $this->lab));
        $this->assertFalse($this->policy->viewAnalytics($this->user, $this->lab));
    }

    public function test_admin_and_lab_teacher_can_manage_lab_posts()
    {
        $this->assertTrue($this->policy->managePosts($this->admin, $this->lab));
        $this->assertTrue($this->policy->managePosts($this->admin, $this->labWithTeacher));
        $this->assertTrue($this->policy->managePosts($this->teacher, $this->labWithTeacher));
        $this->assertFalse($this->policy->managePosts($this->teacher, $this->lab));
        $this->assertFalse($this->policy->managePosts($this->user, $this->lab));
    }

    public function test_only_admin_can_restore_lab()
    {
        $this->assertTrue($this->policy->restore($this->admin, $this->lab));
        $this->assertFalse($this->policy->restore($this->teacher, $this->labWithTeacher));
        $this->assertFalse($this->policy->restore($this->user, $this->lab));
    }

    public function test_only_admin_can_force_delete_lab()
    {
        $this->assertTrue($this->policy->forceDelete($this->admin, $this->lab));
        $this->assertFalse($this->policy->forceDelete($this->teacher, $this->labWithTeacher));
        $this->assertFalse($this->policy->forceDelete($this->user, $this->lab));
    }

    public function test_check_if_user_is_lab_member()
    {
        $this->assertTrue($this->policy->isLabMember($this->teacher, $this->labWithTeacher));
        $this->assertFalse($this->policy->isLabMember($this->teacher, $this->lab));
        $this->assertFalse($this->policy->isLabMember($this->user, $this->lab));
    }
}
