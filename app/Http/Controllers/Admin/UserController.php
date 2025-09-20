<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\AuditLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class UserController extends Controller
{
    /**
     * Create a new controller instance.
     */
    public function __construct()
    {
        $this->authorizeResource(User::class, 'user');
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = User::withTrashed(); // Include soft-deleted users

        $search = trim((string) $request->input('search'));
        if ($search !== '') {
            $query->where(function ($innerQuery) use ($search) {
                $innerQuery->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $role = $request->input('role');
        if (in_array($role, ['admin', 'teacher', 'user'], true)) {
            $query->where('role', $role);
        }

        $status = $request->input('status');
        if (in_array($status, ['active', 'suspended'], true)) {
            $query->where('status', $status);
        }

        $allowedPerPage = [10, 20, 50];
        $perPage = (int) $request->input('per_page', 20);
        if (! in_array($perPage, $allowedPerPage, true)) {
            $perPage = 20;
        }

        $users = $query
            ->orderBy('created_at', 'desc')
            ->paginate($perPage)
            ->withQueryString();

        $roleOptions = [
            ['value' => 'admin', 'label' => 'Admin'],
            ['value' => 'teacher', 'label' => 'Teacher'],
            ['value' => 'user', 'label' => 'User'],
        ];

        $statusOptions = [
            ['value' => 'active', 'label' => 'Active'],
            ['value' => 'suspended', 'label' => 'Suspended'],
        ];

        return Inertia::render('admin/users/index', [
            'users' => $users,
            'filters' => [
                'search' => $search,
                'role' => $role ?? '',
                'status' => $status ?? '',
                'per_page' => $perPage,
            ],
            'roleOptions' => $roleOptions,
            'statusOptions' => $statusOptions,
            'perPageOptions' => $allowedPerPage,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('admin/users/create', [
            'roleOptions' => [
                ['value' => 'admin', 'label' => 'Admin'],
                ['value' => 'teacher', 'label' => 'Teacher'],
                ['value' => 'user', 'label' => 'User'],
            ],
            'statusOptions' => [
                ['value' => 'active', 'label' => 'Active'],
                ['value' => 'suspended', 'label' => 'Suspended'],
            ],
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users', 'email')->withoutTrashed()],
            'role' => ['required', Rule::in(['admin', 'teacher', 'user'])],
            'status' => ['required', Rule::in(['active', 'suspended'])],
            'locale' => ['nullable', 'string', 'max:10'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'email_verified' => ['boolean'],
        ]);

        $locale = $data['locale'] ?? null;

        $payload = [
            'name' => $data['name'],
            'email' => $data['email'],
            'role' => $data['role'],
            'status' => $data['status'],
            'locale' => $locale !== '' ? $locale : null,
            'password' => Hash::make($data['password']),
            'email_verified_at' => $request->boolean('email_verified') ? now() : null,
        ];

        User::create($payload);

        return redirect()->route('admin.users.index')
            ->with('success', '使用者建立成功');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($userId)
    {
        $user = User::withTrashed()->findOrFail($userId);

        return Inertia::render('admin/users/edit', [
            'user' => $user->only([
                'id',
                'name',
                'email',
                'role',
                'status',
                'locale',
                'email_verified_at',
                'deleted_at', // Include deleted_at for UI logic
            ]),
            'roleOptions' => [
                ['value' => 'admin', 'label' => 'Admin'],
                ['value' => 'teacher', 'label' => 'Teacher'],
                ['value' => 'user', 'label' => 'User'],
            ],
            'statusOptions' => [
                ['value' => 'active', 'label' => 'Active'],
                ['value' => 'suspended', 'label' => 'Suspended'],
            ],
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $userId)
    {
        $user = User::withTrashed()->findOrFail($userId);

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user->id)->withoutTrashed()],
            'role' => ['required', Rule::in(['admin', 'teacher', 'user'])],
            'status' => ['required', Rule::in(['active', 'suspended'])],
            'locale' => ['nullable', 'string', 'max:10'],
            'password' => ['nullable', 'string', 'min:8', 'confirmed'],
            'email_verified' => ['boolean'],
        ]);

        $locale = $data['locale'] ?? null;

        $payload = [
            'name' => $data['name'],
            'email' => $data['email'],
            'role' => $data['role'],
            'status' => $data['status'],
            'locale' => $locale !== '' ? $locale : null,
        ];

        if (! empty($data['password'])) {
            $payload['password'] = Hash::make($data['password']);
        }

        $emailVerified = $request->boolean('email_verified');
        $payload['email_verified_at'] = $emailVerified
            ? ($user->email_verified_at ?? now())
            : null;

        $user->update($payload);

        return redirect()->route('admin.users.index')
            ->with('success', '使用者更新成功');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, $userId)
    {
        $user = User::withTrashed()->findOrFail($userId);

        if ((int) $request->user()->id === (int) $user->id) {
            return back()->with('error', '不能刪除自己的帳號');
        }

        $user->delete();

        return redirect()->route('admin.users.index')
            ->with('success', '使用者已刪除');
    }

    /**
     * Restore the specified soft-deleted user.
     */
    public function restore(Request $request, $userId)
    {
        $user = User::withTrashed()->findOrFail($userId);

        // Authorize the restore action
        $this->authorize('restore', $user);

        // Ensure only soft-deleted users can be restored
        if (!$user->trashed()) {
            return back()->with('error', '此使用者未被刪除');
        }

        $user->restore();

        // Log the restore action using AuditLog
        AuditLog::logAction(
            action: 'restore_user',
            target: $user,
            actor: $request->user(),
            metadata: [
                'restored_user_email' => $user->email,
                'restored_user_role' => $user->role,
            ]
        );

        return redirect()->route('admin.users.index')
            ->with('success', '使用者已還原');
    }
}
