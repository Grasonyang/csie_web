<?php

declare(strict_types=1);

namespace Tests\Unit\Policies;

use App\Models\Post;
use App\Models\User;
use App\Policies\PostPolicy;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PostPolicyTest extends TestCase
{
    use RefreshDatabase;

    protected PostPolicy $policy;

    protected function setUp(): void
    {
        parent::setUp();
        $this->policy = new PostPolicy();
    }

    /**
     * Test admin can view any post
     */
    public function test_admin_can_view_any_post(): void
    {
        $admin = User::factory()->admin()->create();
        $post = Post::factory()->create();

        $this->assertTrue($this->policy->viewAny($admin));
        $this->assertTrue($this->policy->view($admin, $post));
    }

    /**
     * Test teacher can view published posts and their own posts
     */
    public function test_teacher_can_view_posts(): void
    {
        $teacher = User::factory()->teacher()->create();
        $publishedPost = Post::factory()->create(['status' => 'published']);
        $draftPost = Post::factory()->create(['status' => 'draft']);
        $teacherPost = Post::factory()->create(['created_by' => $teacher->id]);

        $this->assertTrue($this->policy->viewAny($teacher));
        $this->assertTrue($this->policy->view($teacher, $publishedPost));
        $this->assertFalse($this->policy->view($teacher, $draftPost));
        $this->assertTrue($this->policy->view($teacher, $teacherPost));
    }

    /**
     * Test regular user can only view published posts
     */
    public function test_user_can_only_view_published_posts(): void
    {
        $user = User::factory()->user()->create();
        $publishedPost = Post::factory()->create(['status' => 'published']);
        $draftPost = Post::factory()->create(['status' => 'draft']);

        $this->assertTrue($this->policy->viewAny($user));
        $this->assertTrue($this->policy->view($user, $publishedPost));
        $this->assertFalse($this->policy->view($user, $draftPost));
    }

    /**
     * Test admin can create posts
     */
    public function test_admin_can_create_posts(): void
    {
        $admin = User::factory()->admin()->create();

        $this->assertTrue($this->policy->create($admin));
    }

    /**
     * Test teacher can create posts
     */
    public function test_teacher_can_create_posts(): void
    {
        $teacher = User::factory()->teacher()->create();

        $this->assertTrue($this->policy->create($teacher));
    }

    /**
     * Test regular user cannot create posts
     */
    public function test_user_cannot_create_posts(): void
    {
        $user = User::factory()->user()->create();

        $this->assertFalse($this->policy->create($user));
    }

    /**
     * Test admin can update any post
     */
    public function test_admin_can_update_any_post(): void
    {
        $admin = User::factory()->admin()->create();
        $otherUser = User::factory()->teacher()->create();
        $post = Post::factory()->create(['created_by' => $otherUser->id]);

        $this->assertTrue($this->policy->update($admin, $post));
    }

    /**
     * Test teacher can update their own posts
     */
    public function test_teacher_can_update_own_posts(): void
    {
        $teacher = User::factory()->teacher()->create();
        $ownPost = Post::factory()->create(['created_by' => $teacher->id]);
        $otherPost = Post::factory()->create();

        $this->assertTrue($this->policy->update($teacher, $ownPost));
        $this->assertFalse($this->policy->update($teacher, $otherPost));
    }

    /**
     * Test regular user cannot update posts
     */
    public function test_user_cannot_update_posts(): void
    {
        $user = User::factory()->user()->create();
        $post = Post::factory()->create();

        $this->assertFalse($this->policy->update($user, $post));
    }

    /**
     * Test admin can delete any post
     */
    public function test_admin_can_delete_any_post(): void
    {
        $admin = User::factory()->admin()->create();
        $post = Post::factory()->create();

        $this->assertTrue($this->policy->delete($admin, $post));
    }

    /**
     * Test teacher can delete their own posts
     */
    public function test_teacher_can_delete_own_posts(): void
    {
        $teacher = User::factory()->teacher()->create();
        $ownPost = Post::factory()->create(['created_by' => $teacher->id]);
        $otherPost = Post::factory()->create();

        $this->assertTrue($this->policy->delete($teacher, $ownPost));
        $this->assertFalse($this->policy->delete($teacher, $otherPost));
    }

    /**
     * Test regular user cannot delete posts
     */
    public function test_user_cannot_delete_posts(): void
    {
        $user = User::factory()->user()->create();
        $post = Post::factory()->create();

        $this->assertFalse($this->policy->delete($user, $post));
    }

    /**
     * Test admin can restore posts
     */
    public function test_admin_can_restore_posts(): void
    {
        $admin = User::factory()->admin()->create();
        $post = Post::factory()->create();

        $this->assertTrue($this->policy->restore($admin, $post));
    }

    /**
     * Test teacher cannot restore posts they don't own
     */
    public function test_teacher_can_restore_own_posts_only(): void
    {
        $teacher = User::factory()->teacher()->create();
        $ownPost = Post::factory()->create(['created_by' => $teacher->id]);
        $otherPost = Post::factory()->create();

        $this->assertTrue($this->policy->restore($teacher, $ownPost));
        $this->assertFalse($this->policy->restore($teacher, $otherPost));
    }

    /**
     * Test admin can force delete posts
     */
    public function test_admin_can_force_delete_posts(): void
    {
        $admin = User::factory()->admin()->create();
        $post = Post::factory()->create();

        $this->assertTrue($this->policy->forceDelete($admin, $post));
    }

    /**
     * Test teacher cannot force delete posts
     */
    public function test_teacher_cannot_force_delete_posts(): void
    {
        $teacher = User::factory()->teacher()->create();
        $post = Post::factory()->create(['created_by' => $teacher->id]);

        $this->assertFalse($this->policy->forceDelete($teacher, $post));
    }

    /**
     * Test publish permission
     */
    public function test_publish_permissions(): void
    {
        $admin = User::factory()->admin()->create();
        $teacher = User::factory()->teacher()->create();
        $user = User::factory()->user()->create();
        $post = Post::factory()->create(['status' => 'draft']);

        $this->assertTrue($this->policy->publish($admin, $post));
        $this->assertFalse($this->policy->publish($teacher, $post));
        $this->assertFalse($this->policy->publish($user, $post));
    }

    /**
     * Test unpublish permission
     */
    public function test_unpublish_permissions(): void
    {
        $admin = User::factory()->admin()->create();
        $teacher = User::factory()->teacher()->create();
        $user = User::factory()->user()->create();
        $post = Post::factory()->create(['status' => 'published']);

        $this->assertTrue($this->policy->unpublish($admin, $post));
        $this->assertFalse($this->policy->unpublish($teacher, $post));
        $this->assertFalse($this->policy->unpublish($user, $post));
    }

    /**
     * Test manage categories permission
     */
    public function test_manage_categories_permissions(): void
    {
        $admin = User::factory()->admin()->create();
        $teacher = User::factory()->teacher()->create();
        $user = User::factory()->user()->create();

        $this->assertTrue($this->policy->manageCategories($admin));
        $this->assertFalse($this->policy->manageCategories($teacher));
        $this->assertFalse($this->policy->manageCategories($user));
    }

    /**
     * Test bulk operations permission
     */
    public function test_bulk_operations_permissions(): void
    {
        $admin = User::factory()->admin()->create();
        $teacher = User::factory()->teacher()->create();
        $user = User::factory()->user()->create();

        $this->assertTrue($this->policy->bulkOperations($admin));
        $this->assertFalse($this->policy->bulkOperations($teacher));
        $this->assertFalse($this->policy->bulkOperations($user));
    }

    /**
     * Test view analytics permission
     */
    public function test_view_analytics_permissions(): void
    {
        $admin = User::factory()->admin()->create();
        $teacher = User::factory()->teacher()->create();
        $user = User::factory()->user()->create();

        $this->assertTrue($this->policy->viewAnalytics($admin));
        $this->assertTrue($this->policy->viewAnalytics($teacher));
        $this->assertFalse($this->policy->viewAnalytics($user));
    }

    /**
     * Test schedule post permission
     */
    public function test_schedule_post_permissions(): void
    {
        $admin = User::factory()->admin()->create();
        $teacher = User::factory()->teacher()->create();
        $user = User::factory()->user()->create();
        $post = Post::factory()->create();

        $this->assertTrue($this->policy->schedulePost($admin, $post));
        $this->assertFalse($this->policy->schedulePost($teacher, $post));
        $this->assertFalse($this->policy->schedulePost($user, $post));
    }

    /**
     * Test moderate comments permission
     */
    public function test_moderate_comments_permissions(): void
    {
        $admin = User::factory()->admin()->create();
        $teacher = User::factory()->teacher()->create();
        $user = User::factory()->user()->create();
        $post = Post::factory()->create();

        $this->assertTrue($this->policy->moderateComments($admin, $post));
        $this->assertFalse($this->policy->moderateComments($teacher, $post));
        $this->assertFalse($this->policy->moderateComments($user, $post));
    }
}
