<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Lab;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LabController extends Controller
{
    public function __construct()
    {
        // 使用政策進行授權
        $this->authorizeResource(Lab::class, 'lab');
    }

    // 列出所有實驗室
    public function index()
    {
        $labs = Lab::orderBy('sort_order')->get();
        return Inertia::render('admin/labs/index', [
            'labs' => $labs,
        ]);
    }

    // 顯示新增實驗室表單
    public function create()
    {
        return Inertia::render('admin/labs/create');
    }

    // 儲存新的實驗室
    public function store(Request $request)
    {
        $data = $request->validate([
            'code' => ['nullable', 'string'],
            'website_url' => ['nullable', 'string'],
            'email' => ['nullable', 'string'],
            'phone' => ['nullable', 'string'],
            'cover_image' => ['nullable', 'file'],
            'name' => ['required', 'string'],
            'name_en' => ['nullable', 'string'],
            'description' => ['nullable', 'string'],
            'description_en' => ['nullable', 'string'],
            'sort_order' => ['nullable', 'integer'],
            'visible' => ['boolean'],
        ]);

        if ($request->hasFile('cover_image')) {
            // 儲存上傳封面圖路徑
            $data['cover_image_url'] = $request->file('cover_image')->store('labs', 'public');
        }

        Lab::create($data);

        return redirect()->route('admin.labs.index');
    }

    // 顯示編輯表單
    public function edit(Lab $lab)
    {
        return Inertia::render('admin/labs/edit', [
            'lab' => $lab,
        ]);
    }

    // 更新實驗室資料
    public function update(Request $request, Lab $lab)
    {
        $data = $request->validate([
            'code' => ['nullable', 'string'],
            'website_url' => ['nullable', 'string'],
            'email' => ['nullable', 'string'],
            'phone' => ['nullable', 'string'],
            'cover_image' => ['nullable', 'file'],
            'name' => ['required', 'string'],
            'name_en' => ['nullable', 'string'],
            'description' => ['nullable', 'string'],
            'description_en' => ['nullable', 'string'],
            'sort_order' => ['nullable', 'integer'],
            'visible' => ['boolean'],
        ]);

        if ($request->hasFile('cover_image')) {
            $data['cover_image_url'] = $request->file('cover_image')->store('labs', 'public');
        }

        $lab->update($data);

        return redirect()->route('admin.labs.index');
    }

    // 刪除實驗室
    public function destroy(Lab $lab)
    {
        $lab->delete();
        return redirect()->route('admin.labs.index');
    }
}
