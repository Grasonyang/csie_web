<?php

namespace Tests\Feature\Admin;

use App\Models\User;
use App\Models\Post;
use App\Models\PostCategory;
use App\Models\Publication;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TeacherOnlyAccessTest extends TestCase
{
    use RefreshDatabase;

    protected User $admin;
    protected User $teacher;
    protected User $regularUser;
    protected PostCategory $category;

    protected function setUp(): void
    {
        parent::setUp();

        $this->admin = User::factory()->create(['role' => 'admin']);
        $this->teacher = User::factory()->create(['role' => 'teacher']);
        $this->regularUser = User::factory()->create(['role' => 'user']);

        $this->category = PostCategory::factory()->create();
    }

    public function test_admin_can_create_posts()
    {
        $response = $this->actingAs($this->admin)
            ->post(route('admin.posts.store'), [
                'title' => ['zh-TW' => 'Test Post'],
                'content' => ['zh-TW' => 'Test Content'],
                'category_id' => $this->category->id,
                'status' => 'published',
                'source_type' => 'manual',
            ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('posts', [
            'title' => 'Test Post',
            'created_by' => $this->admin->id,
        ]);
    }

    public function test_teacher_can_create_posts()
    {
        $response = $this->actingAs($this->teacher)
            ->post(route('admin.posts.store'), [
                'title' => ['zh-TW' => 'Test Post'],
                'content' => ['zh-TW' => 'Test Content'],
                'category_id' => $this->category->id,
                'status' => 'published',
                'source_type' => 'manual',
            ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('posts', [
            'title' => 'Test Post',
            'created_by' => $this->teacher->id,
        ]);
    }

    public function test_regular_user_cannot_create_posts()
    {
        $response = $this->actingAs($this->regularUser)
            ->post(route('admin.posts.store'), [
                'title' => ['zh-TW' => 'Test Post'],
                'content' => ['zh-TW' => 'Test Content'],
                'category_id' => $this->category->id,
                'status' => 'published',
                'source_type' => 'manual',
            ]);

        $response->assertForbidden();
        $this->assertDatabaseMissing('posts', [
            'title' => 'Test Post',
        ]);
    }

    public function test_regular_user_cannot_access_post_create_page()
    {
        $response = $this->actingAs($this->regularUser)
            ->get(route('admin.posts.create'));

        $response->assertForbidden();
    }

    public function test_admin_can_create_publications()
    {
        $response = $this->actingAs($this->admin)
            ->post(route('admin.publications.store'), [
                'title' => ['zh-TW' => 'Test Publication', 'en' => 'Test Publication EN'],
                'authors_text' => ['zh-TW' => 'Test Author', 'en' => 'Test Author EN'],
                'year' => 2024,
                'type' => 'journal',
                'visible' => true,
            ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('publications', [
            'title' => 'Test Publication',
        ]);
    }

    public function test_teacher_can_create_publications()
    {
        $response = $this->actingAs($this->teacher)
            ->post(route('admin.publications.store'), [
                'title' => ['zh-TW' => 'Test Publication', 'en' => 'Test Publication EN'],
                'authors_text' => ['zh-TW' => 'Test Author', 'en' => 'Test Author EN'],
                'year' => 2024,
                'type' => 'journal',
                'visible' => true,
            ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('publications', [
            'title' => 'Test Publication',
        ]);
    }

    public function test_regular_user_cannot_create_publications()
    {
        $response = $this->actingAs($this->regularUser)
            ->post(route('admin.publications.store'), [
                'title' => ['zh-TW' => 'Test Publication', 'en' => 'Test Publication EN'],
                'authors_text' => ['zh-TW' => 'Test Author', 'en' => 'Test Author EN'],
                'year' => 2024,
                'type' => 'journal',
                'visible' => true,
            ]);

        $response->assertForbidden();
        $this->assertDatabaseMissing('publications', [
            'title' => 'Test Publication',
        ]);
    }

    public function test_regular_user_cannot_access_publication_create_page()
    {
        $response = $this->actingAs($this->regularUser)
            ->get(route('admin.publications.create'));

        $response->assertForbidden();
    }

    public function test_teacher_can_edit_own_posts()
    {
        $post = Post::factory()->create([
            'created_by' => $this->teacher->id,
            'category_id' => $this->category->id,
        ]);

        $response = $this->actingAs($this->teacher)
            ->put(route('admin.posts.update', $post), [
                'title' => ['zh-TW' => 'Updated Post'],
                'content' => ['zh-TW' => 'Updated Content'],
                'category_id' => $this->category->id,
                'status' => 'published',
                'source_type' => 'manual',
            ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('posts', [
            'id' => $post->id,
            'title' => 'Updated Post',
        ]);
    }

    public function test_teacher_cannot_edit_other_teacher_posts()
    {
        $otherTeacher = User::factory()->create(['role' => 'teacher']);
        $post = Post::factory()->create([
            'created_by' => $otherTeacher->id,
            'category_id' => $this->category->id,
        ]);

        $response = $this->actingAs($this->teacher)
            ->put(route('admin.posts.update', $post), [
                'title' => ['zh-TW' => 'Updated Post'],
                'content' => ['zh-TW' => 'Updated Content'],
                'category_id' => $this->category->id,
                'status' => 'published',
                'source_type' => 'manual',
            ]);

        $response->assertForbidden();
    }

    public function test_regular_user_cannot_edit_posts()
    {
        $post = Post::factory()->create([
            'created_by' => $this->teacher->id,
            'category_id' => $this->category->id,
        ]);

        $response = $this->actingAs($this->regularUser)
            ->put(route('admin.posts.update', $post), [
                'title' => ['zh-TW' => 'Updated Post'],
                'content' => ['zh-TW' => 'Updated Content'],
                'category_id' => $this->category->id,
                'status' => 'published',
                'source_type' => 'manual',
            ]);

        $response->assertForbidden();
    }
}
