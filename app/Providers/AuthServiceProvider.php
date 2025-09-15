<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use App\Models\Post;
use App\Policies\PostPolicy;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * 權限對應表
     */
    protected $policies = [
        Post::class => PostPolicy::class,
    ];

    /**
     * 啟動任何認證服務
     */
    public function boot(): void
    {
        // 可在此定義額外 Gate
    }
}
