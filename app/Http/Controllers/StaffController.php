<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class StaffController extends Controller
{
    // 顯示成員列表
    public function index(Request $request)
    {
        $people = [
            [
                'slug' => 'john-doe',
                'name' => ['en' => 'John Doe', 'zh-TW' => '約翰·杜'],
                'role' => 'faculty',
            ],
            [
                'slug' => 'jane-smith',
                'name' => ['en' => 'Jane Smith', 'zh-TW' => '珍·史密斯'],
                'role' => 'staff',
            ],
        ];

        $role = $request->query('role');

        return Inertia::render('people/index', [
            'people' => $people,
            'role' => $role,
        ]);
    }

    // 顯示單一成員
    public function show(string $slug)
    {
        $person = [
            'slug' => $slug,
            'name' => ['en' => 'John Doe', 'zh-TW' => '約翰·杜'],
            'role' => 'faculty',
            'bio' => ['en' => 'Sample bio', 'zh-TW' => '範例簡介'],
        ];

        return Inertia::render('people/show', [
            'person' => $person,
        ]);
    }
}
