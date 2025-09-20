<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable implements MustVerifyEmail
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'teacher_id',
        'locale',
        'status',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'role' => 'string',
            'status' => 'string',
        ];
    }

    // Role-related methods
    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function isTeacher(): bool
    {
        return $this->role === 'teacher';
    }

    public function isUser(): bool
    {
        return $this->role === 'user';
    }

    public function hasRoleOrHigher(string $role): bool
    {
        $hierarchy = ['user' => 1, 'teacher' => 2, 'admin' => 3];
        $userLevel = $hierarchy[$this->role] ?? 0;
        $requiredLevel = $hierarchy[$role] ?? 0;

        return $userLevel >= $requiredLevel;
    }

    /**
     * Scope: Get users that can be managed by the given user
     */
    public function scopeCanBeManagedBy($query, $user)
    {
        if ($user->role === 'admin') {
            // Admin can manage all users except other admins
            return $query->where('role', '!=', 'admin')
                        ->where('id', '!=', $user->id);
        } elseif ($user->role === 'teacher') {
            // Teacher can manage regular users only
            return $query->where('role', 'user');
        } else {
            // Regular users cannot manage anyone
            return $query->whereRaw('1 = 0'); // Always false
        }
    }

    // Relationships
    public function teacher()
    {
        return $this->hasOne(Teacher::class, 'user_id');
    }

    public function settings()
    {
        return $this->hasMany(Settings::class);
    }

    public function auditLogs()
    {
        return $this->hasMany(AuditLog::class, 'actor_id');
    }

    public function createdPosts()
    {
        return $this->hasMany(Post::class, 'created_by');
    }

    public function updatedPosts()
    {
        return $this->hasMany(Post::class, 'updated_by');
    }
}
