<?php

namespace App\Http\Controllers\Manage\Admin;

use App\Actions\Admin\BuildAdminDashboardData;
use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(BuildAdminDashboardData $buildDashboardData): Response
    {
        return Inertia::render('manage/admin/dashboard', [
            'adminDashboard' => $buildDashboardData(),
        ]);
    }
}

