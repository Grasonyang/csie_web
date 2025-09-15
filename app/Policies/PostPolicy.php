<?php

namespace App\Policies;

use App\Models\Post;
use App\Models\User;

class PostPolicy
{
    // 檢視列表
    public function viewAny(User $user): bool
    {
        return $user->role === 'admin';
    }

    // 檢視單篇
    public function view(User $user, Post $post): bool
    {
        return $user->role === 'admin';
    }

    // 建立文章
    public function create(User $user): bool
    {
        return $user->role === 'admin';
    }

    // 更新文章
    public function update(User $user, Post $post): bool
    {
        return $user->role === 'admin';
    }

    // 刪除文章
    public function delete(User $user, Post $post): bool
    {
        return $user->role === 'admin';
    }
}
