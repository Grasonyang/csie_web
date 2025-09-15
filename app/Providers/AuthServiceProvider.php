<?php

namespace App\Providers;

use App\Models\Staff;
use App\Models\Lab;
use App\Policies\StaffPolicy;
use App\Policies\LabPolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    /** @var array<class-string, class-string> */
    protected $policies = [
        // 職員授權政策
        Staff::class => StaffPolicy::class,
        // 實驗室授權政策
        Lab::class => LabPolicy::class,
    ];

    public function boot(): void
    {
        // 可在此處加入額外授權邏輯
    }
}
