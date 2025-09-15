<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Lab;
use Illuminate\Auth\Access\HandlesAuthorization;

class LabPolicy
{
    use HandlesAuthorization;

    // 判斷使用者是否可檢視列表
    public function viewAny(User $user): bool
    {
        return $user->role === 'admin';
    }

    // 判斷使用者是否可檢視單筆資料
    public function view(User $user, Lab $lab): bool
    {
        return $user->role === 'admin';
    }

    // 判斷使用者是否可新增
    public function create(User $user): bool
    {
        return $user->role === 'admin';
    }

    // 判斷使用者是否可更新
    public function update(User $user, Lab $lab): bool
    {
        return $user->role === 'admin';
    }

    // 判斷使用者是否可刪除
    public function delete(User $user, Lab $lab): bool
    {
        return $user->role === 'admin';
    }
}
