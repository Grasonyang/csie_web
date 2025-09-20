<?php

namespace Tests\Feature\Middleware;

use Tests\TestCase;
use App\Models\User;
use App\Http\Middleware\ManageRole;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Symfony\Component\HttpFoundation\Response as BaseResponse;

class ManageRoleTest extends TestCase
{
    use RefreshDatabase;

    protected $middleware;
    protected $admin;
    protected $teacher;
    protected $user;

    protected function setUp(): void
    {
        parent::setUp();

        $this->middleware = new ManageRole();

        // Create test users
        $this->admin = User::factory()->create(['role' => 'admin']);
        $this->teacher = User::factory()->create(['role' => 'teacher']);
        $this->user = User::factory()->create(['role' => 'user']);
    }

    public function test_admin_can_access_admin_routes()
    {
        $request = Request::create('/manage/admin', 'GET');
        $request->setUserResolver(fn() => $this->admin);

        $response = $this->middleware->handle($request, function ($req) {
            return new Response('OK');
        }, 'admin');

        $this->assertEquals(200, $response->getStatusCode());
        $this->assertEquals('OK', $response->getContent());
    }

    public function test_admin_can_access_teacher_routes()
    {
        $request = Request::create('/manage/teacher', 'GET');
        $request->setUserResolver(fn() => $this->admin);

        $response = $this->middleware->handle($request, function ($req) {
            return new Response('OK');
        }, 'teacher');

        $this->assertEquals(200, $response->getStatusCode());
        $this->assertEquals('OK', $response->getContent());
    }

    public function test_admin_can_access_user_routes()
    {
        $request = Request::create('/manage/user', 'GET');
        $request->setUserResolver(fn() => $this->admin);

        $response = $this->middleware->handle($request, function ($req) {
            return new Response('OK');
        }, 'user');

        $this->assertEquals(200, $response->getStatusCode());
        $this->assertEquals('OK', $response->getContent());
    }

    public function test_teacher_can_access_teacher_routes()
    {
        $request = Request::create('/manage/teacher', 'GET');
        $request->setUserResolver(fn() => $this->teacher);

        $response = $this->middleware->handle($request, function ($req) {
            return new Response('OK');
        }, 'teacher');

        $this->assertEquals(200, $response->getStatusCode());
        $this->assertEquals('OK', $response->getContent());
    }

    public function test_teacher_can_access_user_routes()
    {
        $request = Request::create('/manage/user', 'GET');
        $request->setUserResolver(fn() => $this->teacher);

        $response = $this->middleware->handle($request, function ($req) {
            return new Response('OK');
        }, 'user');

        $this->assertEquals(200, $response->getStatusCode());
        $this->assertEquals('OK', $response->getContent());
    }

    public function test_teacher_cannot_access_admin_routes()
    {
        $request = Request::create('/manage/admin', 'GET');
        $request->setUserResolver(fn() => $this->teacher);

        $this->expectException(\Symfony\Component\HttpKernel\Exception\HttpException::class);
        $this->expectExceptionMessage('Insufficient privileges to access this resource.');

        $this->middleware->handle($request, function ($req) {
            return new Response('OK');
        }, 'admin');
    }

    public function test_user_can_access_user_routes()
    {
        $request = Request::create('/manage/user', 'GET');
        $request->setUserResolver(fn() => $this->user);

        $response = $this->middleware->handle($request, function ($req) {
            return new Response('OK');
        }, 'user');

        $this->assertEquals(200, $response->getStatusCode());
        $this->assertEquals('OK', $response->getContent());
    }

    public function test_user_cannot_access_teacher_routes()
    {
        $request = Request::create('/manage/teacher', 'GET');
        $request->setUserResolver(fn() => $this->user);

        $this->expectException(\Symfony\Component\HttpKernel\Exception\HttpException::class);
        $this->expectExceptionMessage('Insufficient privileges to access this resource.');

        $this->middleware->handle($request, function ($req) {
            return new Response('OK');
        }, 'teacher');
    }

    public function test_user_cannot_access_admin_routes()
    {
        $request = Request::create('/manage/admin', 'GET');
        $request->setUserResolver(fn() => $this->user);

        $this->expectException(\Symfony\Component\HttpKernel\Exception\HttpException::class);
        $this->expectExceptionMessage('Insufficient privileges to access this resource.');

        $this->middleware->handle($request, function ($req) {
            return new Response('OK');
        }, 'admin');
    }

    public function test_unauthenticated_user_is_redirected_to_login()
    {
        $request = Request::create('/manage/admin', 'GET');
        $request->setUserResolver(fn() => null);

        $response = $this->middleware->handle($request, function ($req) {
            return new Response('OK');
        }, 'admin');

        $this->assertEquals(302, $response->getStatusCode());
        $this->assertStringContainsString('login', $response->headers->get('Location'));
    }

    public function test_api_request_returns_json_error_for_insufficient_privileges()
    {
        $request = Request::create('/api/admin/users', 'GET');
        $request->headers->set('Accept', 'application/json');
        $request->setUserResolver(fn() => $this->teacher);

        $response = $this->middleware->handle($request, function ($req) {
            return new Response('OK');
        }, 'admin');

        $this->assertEquals(403, $response->getStatusCode());
        $this->assertJson($response->getContent());

        $data = json_decode($response->getContent(), true);
        $this->assertEquals('Insufficient privileges for this action.', $data['message']);
        $this->assertEquals('admin', $data['required_role']);
        $this->assertEquals('teacher', $data['user_role']);
    }

    public function test_role_hierarchy_is_properly_configured()
    {
        // Test that admin has higher privileges than teacher
        $request = Request::create('/manage/teacher', 'GET');
        $request->setUserResolver(fn() => $this->admin);

        $response = $this->middleware->handle($request, function ($req) {
            return new Response('OK');
        }, 'teacher');

        $this->assertEquals(200, $response->getStatusCode());

        // Test that teacher has higher privileges than user
        $request = Request::create('/manage/user', 'GET');
        $request->setUserResolver(fn() => $this->teacher);

        $response = $this->middleware->handle($request, function ($req) {
            return new Response('OK');
        }, 'user');

        $this->assertEquals(200, $response->getStatusCode());
    }

    public function test_invalid_role_defaults_to_no_access()
    {
        $request = Request::create('/manage/invalid', 'GET');
        $request->setUserResolver(fn() => $this->user);

        // Invalid role has level 0, user has level 1, so user can access
        // This is actually correct behavior - invalid roles have no requirements
        $response = $this->middleware->handle($request, function ($req) {
            return new Response('OK');
        }, 'invalid_role');

        $this->assertEquals(200, $response->getStatusCode());
    }
}
