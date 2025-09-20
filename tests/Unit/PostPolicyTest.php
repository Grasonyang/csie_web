<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\User;
use App\Models\Post;
use App\Policies\PostPolicy;
use Illuminate\Foundation\Testing\RefreshDatabase;

class PostPolicyTest extends TestCase
{
    use RefreshDatabase;

    protected $policy;
    protected $admin;
    protected $teacher;
    protected $user;
    protected $publishedPost;
    protected $draftPost;
    protected $teacherOwnPost;
    protected $adminOwnPost;

    protected function setUp(): void
    {
        parent::setUp();

        $this->policy = new PostPolicy();

        // Create test users
        $this->admin = User::factory()->create(['role' => 'admin']);
        $this->teacher = User::factory()->create(['role' => 'teacher']);
        $this->user = User::factory()->create(['role' => 'user']);

        // Create test posts
        $this->publishedPost = Post::factory()->create([
            'status' => 'published',
            'created_by' => $this->user->id
        ]);

        $this->draftPost = Post::factory()->create([
            'status' => 'draft',
            'created_by' => $this->user->id
        ]);

        $this->teacherOwnPost = Post::factory()->create([
            'status' => 'draft',
            'created_by' => $this->teacher->id
        ]);

        $this->adminOwnPost = Post::factory()->create([
            'status' => 'draft',
            'created_by' => $this->admin->id
        ]);
    }

    public function test_admin_can_view_any_post()
    {
        $this->assertTrue($this->policy->viewAny($this->admin));
    }

    public function test_teacher_can_view_any_post()
    {
        $this->assertTrue($this->policy->viewAny($this->teacher));
    }

    public function test_user_can_view_any_post()
    {
        $this->assertTrue($this->policy->viewAny($this->user));
    }

    public function test_admin_can_view_all_posts()
    {
        $this->assertTrue($this->policy->view($this->admin, $this->publishedPost));
        $this->assertTrue($this->policy->view($this->admin, $this->draftPost));
        $this->assertTrue($this->policy->view($this->admin, $this->teacherOwnPost));
        $this->assertTrue($this->policy->view($this->admin, $this->adminOwnPost));
    }

    public function test_teacher_can_view_published_posts_and_own_posts()
    {
        $this->assertTrue($this->policy->view($this->teacher, $this->publishedPost));
        $this->assertFalse($this->policy->view($this->teacher, $this->draftPost));
        $this->assertTrue($this->policy->view($this->teacher, $this->teacherOwnPost));
        $this->assertFalse($this->policy->view($this->teacher, $this->adminOwnPost));
    }

    public function test_user_can_only_view_published_posts()
    {
        $this->assertTrue($this->policy->view($this->user, $this->publishedPost));
        $this->assertFalse($this->policy->view($this->user, $this->draftPost));
        $this->assertFalse($this->policy->view($this->user, $this->teacherOwnPost));
        $this->assertFalse($this->policy->view($this->user, $this->adminOwnPost));
    }

    public function test_admin_can_create_posts()
    {
        $this->assertTrue($this->policy->create($this->admin));
    }

    public function test_teacher_can_create_posts()
    {
        $this->assertTrue($this->policy->create($this->teacher));
    }

    public function test_user_cannot_create_posts()
    {
        $this->assertFalse($this->policy->create($this->user));
    }

    public function test_admin_can_update_any_post()
    {
        $this->assertTrue($this->policy->update($this->admin, $this->publishedPost));
        $this->assertTrue($this->policy->update($this->admin, $this->draftPost));
        $this->assertTrue($this->policy->update($this->admin, $this->teacherOwnPost));
        $this->assertTrue($this->policy->update($this->admin, $this->adminOwnPost));
    }

    public function test_teacher_can_only_update_own_posts()
    {
        $this->assertFalse($this->policy->update($this->teacher, $this->publishedPost));
        $this->assertFalse($this->policy->update($this->teacher, $this->draftPost));
        $this->assertTrue($this->policy->update($this->teacher, $this->teacherOwnPost));
        $this->assertFalse($this->policy->update($this->teacher, $this->adminOwnPost));
    }

    public function test_user_cannot_update_posts()
    {
        $this->assertFalse($this->policy->update($this->user, $this->publishedPost));
        $this->assertFalse($this->policy->update($this->user, $this->draftPost));
        $this->assertFalse($this->policy->update($this->user, $this->teacherOwnPost));
        $this->assertFalse($this->policy->update($this->user, $this->adminOwnPost));
    }

    public function test_admin_can_delete_any_post()
    {
        $this->assertTrue($this->policy->delete($this->admin, $this->publishedPost));
        $this->assertTrue($this->policy->delete($this->admin, $this->draftPost));
        $this->assertTrue($this->policy->delete($this->admin, $this->teacherOwnPost));
        $this->assertTrue($this->policy->delete($this->admin, $this->adminOwnPost));
    }

    public function test_teacher_can_only_delete_own_posts()
    {
        $this->assertFalse($this->policy->delete($this->teacher, $this->publishedPost));
        $this->assertFalse($this->policy->delete($this->teacher, $this->draftPost));
        $this->assertTrue($this->policy->delete($this->teacher, $this->teacherOwnPost));
        $this->assertFalse($this->policy->delete($this->teacher, $this->adminOwnPost));
    }

    public function test_user_cannot_delete_posts()
    {
        $this->assertFalse($this->policy->delete($this->user, $this->publishedPost));
        $this->assertFalse($this->policy->delete($this->user, $this->draftPost));
        $this->assertFalse($this->policy->delete($this->user, $this->teacherOwnPost));
        $this->assertFalse($this->policy->delete($this->user, $this->adminOwnPost));
    }

    public function test_admin_can_restore_any_post()
    {
        $this->assertTrue($this->policy->restore($this->admin, $this->publishedPost));
        $this->assertTrue($this->policy->restore($this->admin, $this->draftPost));
        $this->assertTrue($this->policy->restore($this->admin, $this->teacherOwnPost));
        $this->assertTrue($this->policy->restore($this->admin, $this->adminOwnPost));
    }

    public function test_teacher_can_only_restore_own_posts()
    {
        $this->assertFalse($this->policy->restore($this->teacher, $this->publishedPost));
        $this->assertFalse($this->policy->restore($this->teacher, $this->draftPost));
        $this->assertTrue($this->policy->restore($this->teacher, $this->teacherOwnPost));
        $this->assertFalse($this->policy->restore($this->teacher, $this->adminOwnPost));
    }

    public function test_user_cannot_restore_posts()
    {
        $this->assertFalse($this->policy->restore($this->user, $this->publishedPost));
        $this->assertFalse($this->policy->restore($this->user, $this->draftPost));
        $this->assertFalse($this->policy->restore($this->user, $this->teacherOwnPost));
        $this->assertFalse($this->policy->restore($this->user, $this->adminOwnPost));
    }

    public function test_only_admin_can_force_delete()
    {
        $this->assertTrue($this->policy->forceDelete($this->admin, $this->publishedPost));
        $this->assertFalse($this->policy->forceDelete($this->teacher, $this->teacherOwnPost));
        $this->assertFalse($this->policy->forceDelete($this->user, $this->publishedPost));
    }

    public function test_only_admin_can_publish()
    {
        $this->assertTrue($this->policy->publish($this->admin, $this->draftPost));
        $this->assertFalse($this->policy->publish($this->teacher, $this->teacherOwnPost));
        $this->assertFalse($this->policy->publish($this->user, $this->draftPost));
    }

    public function test_only_admin_can_unpublish()
    {
        $this->assertTrue($this->policy->unpublish($this->admin, $this->publishedPost));
        $this->assertFalse($this->policy->unpublish($this->teacher, $this->publishedPost));
        $this->assertFalse($this->policy->unpublish($this->user, $this->publishedPost));
    }

    public function test_only_admin_can_manage_categories()
    {
        $this->assertTrue($this->policy->manageCategories($this->admin));
        $this->assertFalse($this->policy->manageCategories($this->teacher));
        $this->assertFalse($this->policy->manageCategories($this->user));
    }

    public function test_only_admin_can_bulk_operations()
    {
        $this->assertTrue($this->policy->bulkOperations($this->admin));
        $this->assertFalse($this->policy->bulkOperations($this->teacher));
        $this->assertFalse($this->policy->bulkOperations($this->user));
    }

    public function test_admin_and_teacher_can_view_analytics()
    {
        $this->assertTrue($this->policy->viewAnalytics($this->admin));
        $this->assertTrue($this->policy->viewAnalytics($this->teacher));
        $this->assertFalse($this->policy->viewAnalytics($this->user));
    }

    public function test_only_admin_can_schedule_post()
    {
        $this->assertTrue($this->policy->schedulePost($this->admin, $this->draftPost));
        $this->assertFalse($this->policy->schedulePost($this->teacher, $this->teacherOwnPost));
        $this->assertFalse($this->policy->schedulePost($this->user, $this->draftPost));
    }

    public function test_only_admin_can_moderate_comments()
    {
        $this->assertTrue($this->policy->moderateComments($this->admin, $this->publishedPost));
        $this->assertFalse($this->policy->moderateComments($this->teacher, $this->publishedPost));
        $this->assertFalse($this->policy->moderateComments($this->user, $this->publishedPost));
    }
}
