<?php

namespace App\Http\Controllers;

use App\Models\Lab;
use Inertia\Inertia;
use Inertia\Response;

class LabController extends Controller
{
    // 顯示所有實驗室列表
    public function index(): Response
    {
        // 取得所有可見的實驗室並載入教師
        $labs = Lab::where('visible', true)
            ->with('teachers')
            ->orderBy('sort_order')
            ->get();

        return Inertia::render('labs/index', [
            'labs' => $labs,
        ]);
    }

    // 顯示單一實驗室詳細資料
    public function show(Lab $lab): Response
    {
        // 預先載入教師資料
        $lab->load('teachers');

        return Inertia::render('labs/show', [
            'lab' => $lab,
        ]);
    }
}
