<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Post;
use Illuminate\Auth\Access\HandlesAuthorization;

class PostPolicy
{
    use HandlesAuthorization;

    public function before(User $user): bool|null
    {
        return $user->role === 'admin' ? true : null;
    }

    public function viewAny(User $user): bool
    {
        return in_array($user->role, ['admin', 'teacher']);
    }

    public function view(User $user, Post $post): bool
    {
        return in_array($user->role, ['admin', 'teacher']);
    }

    public function create(User $user): bool
    {
        return in_array($user->role, ['admin', 'teacher']);
    }

    public function update(User $user, Post $post): bool
    {
        // Teachers can only edit their own posts, admins can edit any post
        return $user->role === 'admin' || ($user->role === 'teacher' && $post->created_by === $user->id);
    }

    public function delete(User $user, Post $post): bool
    {
        // Teachers can only delete their own posts, admins can delete any post
        return $user->role === 'admin' || ($user->role === 'teacher' && $post->created_by === $user->id);
    }

    public function restore(User $user, Post $post): bool
    {
        return $user->role === 'admin';
    }

    public function forceDelete(User $user, Post $post): bool
    {
        return $user->role === 'admin';
    }
}
