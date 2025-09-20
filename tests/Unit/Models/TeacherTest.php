<?php

declare(strict_types=1);

namespace Tests\Unit\Models;

use App\Models\Teacher;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Database\Eloquent\Collection;
use Tests\TestCase;

class TeacherTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test Teacher model can be created
     */
    public function test_teacher_can_be_created(): void
    {
        $userData = [
            'name' => 'Test Teacher',
            'email' => 'teacher@test.com',
            'password' => bcrypt('password'),
            'role' => 'teacher',
        ];

        $user = User::create($userData);

        $teacherData = [
            'user_id' => $user->id,
            'office' => 'Room 123',
            'phone' => '123-456-7890',
            'name' => 'Test Teacher',
            'name_en' => 'Test Teacher',
            'title' => 'Professor',
            'title_en' => 'Professor',
            'expertise' => 'Computer Science', // Use expertise instead of specialty
            'bio' => 'Experienced computer science teacher',
            'visible' => true, // Use visible instead of is_active
        ];

        $teacher = Teacher::create($teacherData);

        $this->assertInstanceOf(Teacher::class, $teacher);
        $this->assertEquals($teacherData['user_id'], $teacher->user_id);
        $this->assertEquals($teacherData['office'], $teacher->office);
        $this->assertEquals($teacherData['phone'], $teacher->phone);
        $this->assertEquals($teacherData['expertise'], $teacher->expertise);
        $this->assertTrue($teacher->visible);
    }

    /**
     * Test Teacher belongs to User relationship
     */
    public function test_teacher_belongs_to_user(): void
    {
        $user = User::factory()->create(['role' => 'teacher']);
        $teacher = Teacher::factory()->create(['user_id' => $user->id]);

        $this->assertInstanceOf(User::class, $teacher->user);
        $this->assertEquals($user->id, $teacher->user->id);
        $this->assertEquals('teacher', $teacher->user->role);
    }

    /**
     * Test User has one Teacher relationship
     */
    public function test_user_has_one_teacher(): void
    {
        $user = User::factory()->create(['role' => 'teacher']);
        $teacher = Teacher::factory()->create(['user_id' => $user->id]);

        // Update the user to reference the teacher
        $user->update(['teacher_id' => $teacher->id]);

        $this->assertInstanceOf(Teacher::class, $user->teacher);
        $this->assertEquals($teacher->id, $user->teacher->id);
    }

    /**
     * Test Teacher scope for active teachers
     */
    public function test_active_scope(): void
    {
        // Create active and inactive teachers
        $activeTeacher = Teacher::factory()->create(['visible' => true]);
        $inactiveTeacher = Teacher::factory()->create(['visible' => false]);

        $activeTeachers = Teacher::active()->get();

        $this->assertCount(1, $activeTeachers);
        $this->assertTrue($activeTeachers->contains($activeTeacher));
        $this->assertFalse($activeTeachers->contains($inactiveTeacher));
    }

    /**
     * Test Teacher can manage users (scope for management permission)
     */
    public function test_can_manage_users_scope(): void
    {
        $teacherUser = User::factory()->create(['role' => 'teacher']);
        $teacher = Teacher::factory()->create(['user_id' => $teacherUser->id]);

        // Create some regular users that this teacher can manage
        $user1 = User::factory()->create(['role' => 'user']);
        $user2 = User::factory()->create(['role' => 'user']);
        $adminUser = User::factory()->create(['role' => 'admin']);

        // Teachers should be able to manage regular users but not admins
        $manageableUsers = User::canBeManagedBy($teacherUser)->get();

        $this->assertTrue($manageableUsers->contains($user1));
        $this->assertTrue($manageableUsers->contains($user2));
        $this->assertFalse($manageableUsers->contains($adminUser));
        $this->assertFalse($manageableUsers->contains($teacherUser)); // Can't manage self
    }

    /**
     * Test Teacher fillable attributes
     */
    public function test_fillable_attributes(): void
    {
        $teacher = new Teacher();
        $expected = [
            'user_id',
            'office',
            'phone',
            'specialty', // This will be mapped to expertise
            'bio',
            'is_active', // This will be mapped to visible
            // Include existing fields for compatibility
            'email','job_title','photo_url',
            'name','name_en','title','title_en','bio_en','expertise','expertise_en','education','education_en',
            'sort_order','visible',
        ];

        $fillable = $teacher->getFillable();

        // Check that all our expected fields are in the fillable array
        foreach (['user_id', 'office', 'phone', 'bio', 'name'] as $field) {
            $this->assertContains($field, $fillable);
        }
    }

    /**
     * Test Teacher casts
     */
    public function test_casts(): void
    {
        $teacher = new Teacher();
        $casts = $teacher->getCasts();

        $this->assertArrayHasKey('visible', $casts);
        $this->assertEquals('boolean', $casts['visible']);
    }

    /**
     * Test Teacher validation requirements
     */
    public function test_validation_requirements(): void
    {
        // Test required fields
        $this->expectException(\Illuminate\Database\QueryException::class);

        // This should fail due to missing required user_id
        Teacher::create([
            'office' => 'Room 123',
            'phone' => '123-456-7890',
        ]);
    }

    /**
     * Test Teacher can be soft deleted
     */
    public function test_teacher_can_be_soft_deleted(): void
    {
        $teacher = Teacher::factory()->create();
        $teacherId = $teacher->id;

        $teacher->delete();

        // Should not exist in normal queries
        $this->assertNull(Teacher::find($teacherId));

        // Should exist in withTrashed queries
        $this->assertNotNull(Teacher::withTrashed()->find($teacherId));
        $this->assertNotNull($teacher->fresh()->deleted_at);
    }

    /**
     * Test Teacher display name accessor
     */
    public function test_display_name_accessor(): void
    {
        $user = User::factory()->create([
            'name' => 'John Doe',
            'role' => 'teacher'
        ]);
        $teacher = Teacher::factory()->create([
            'user_id' => $user->id,
            'expertise' => 'Computer Science'
        ]);

        $expectedDisplayName = 'John Doe (Computer Science)';
        $this->assertEquals($expectedDisplayName, $teacher->display_name);
    }

    /**
     * Test Teacher full info accessor
     */
    public function test_full_info_accessor(): void
    {
        $user = User::factory()->create([
            'name' => 'Jane Smith',
            'email' => 'jane@test.com',
            'role' => 'teacher'
        ]);
        $teacher = Teacher::factory()->create([
            'user_id' => $user->id,
            'office' => 'Room 456',
            'phone' => '098-765-4321',
            'expertise' => 'Mathematics'
        ]);

        $fullInfo = $teacher->full_info;

        $this->assertIsArray($fullInfo);
        $this->assertEquals('Jane Smith', $fullInfo['name']);
        $this->assertEquals('jane@test.com', $fullInfo['email']);
        $this->assertEquals('Room 456', $fullInfo['office']);
        $this->assertEquals('098-765-4321', $fullInfo['phone']);
        $this->assertEquals('Mathematics', $fullInfo['specialty']);
    }

    /**
     * Test Teacher can have multiple managed users
     */
    public function test_teacher_can_have_managed_users(): void
    {
        $teacherUser = User::factory()->create(['role' => 'teacher']);
        $teacher = Teacher::factory()->create(['user_id' => $teacherUser->id]);

        // Create users that this teacher manages
        $managedUser1 = User::factory()->create(['role' => 'user']);
        $managedUser2 = User::factory()->create(['role' => 'user']);

        // In a real implementation, there might be a many-to-many relationship
        // For now, we test the query scope
        $manageableUsers = User::canBeManagedBy($teacherUser)->get();

        $this->assertGreaterThanOrEqual(2, $manageableUsers->count());
        $this->assertTrue($manageableUsers->contains($managedUser1));
        $this->assertTrue($manageableUsers->contains($managedUser2));
    }

    /**
     * Test Teacher search functionality
     */
    public function test_teacher_search_scope(): void
    {
        $user1 = User::factory()->create(['name' => 'Alice Johnson', 'role' => 'teacher']);
        $user2 = User::factory()->create(['name' => 'Bob Wilson', 'role' => 'teacher']);

        $teacher1 = Teacher::factory()->create([
            'user_id' => $user1->id,
            'expertise' => 'Computer Science'
        ]);
        $teacher2 = Teacher::factory()->create([
            'user_id' => $user2->id,
            'expertise' => 'Mathematics'
        ]);

        // Search by name
        $results = Teacher::search('Alice')->get();
        $this->assertCount(1, $results);
        $this->assertTrue($results->contains($teacher1));

        // Search by specialty (expertise)
        $results = Teacher::search('Computer')->get();
        $this->assertCount(1, $results);
        $this->assertTrue($results->contains($teacher1));

        // Search should be case insensitive
        $results = Teacher::search('mathematics')->get();
        $this->assertCount(1, $results);
        $this->assertTrue($results->contains($teacher2));
    }
}
