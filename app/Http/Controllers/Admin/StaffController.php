<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Staff;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StaffController extends Controller
{
    public function __construct()
    {
        // 使用政策進行授權
        $this->authorizeResource(Staff::class, 'staff');
    }

    // 列出所有職員
    public function index()
    {
        $staff = Staff::orderBy('sort_order')->get();
        return Inertia::render('admin/staff/index', [
            'staff' => $staff,
        ]);
    }

    // 顯示新增職員表單
    public function create()
    {
        return Inertia::render('admin/staff/create');
    }

    // 儲存新的職員
    public function store(Request $request)
    {
        $data = $request->validate([
            'email' => ['nullable', 'string', 'email'],
            'phone' => ['nullable', 'string', 'regex:/^\+?[0-9\s\-]+$/'],
            'photo' => ['nullable', 'file'],
            'name' => ['required', 'string'],
            'name_en' => ['nullable', 'string'],
            'position' => ['nullable', 'string'],
            'position_en' => ['nullable', 'string'],
            'bio' => ['nullable', 'string'],
            'bio_en' => ['nullable', 'string'],
            'sort_order' => ['nullable', 'integer'],
            'visible' => ['boolean'],
        ]);

        if ($request->hasFile('photo')) {
            // 儲存上傳圖片路徑
            $data['photo_url'] = $request->file('photo')->store('staff', 'public');
        }

        Staff::create($data);

        return redirect()->route('admin.staff.index');
    }

    // 顯示編輯表單
    public function edit(Staff $staff)
    {
        return Inertia::render('admin/staff/edit', [
            'staff' => $staff,
        ]);
    }

    // 更新職員資料
    public function update(Request $request, Staff $staff)
    {
        $data = $request->validate([
            'email' => ['nullable', 'string'],
            'phone' => ['nullable', 'string'],
            'photo' => ['nullable', 'file'],
            'name' => ['required', 'string'],
            'name_en' => ['nullable', 'string'],
            'position' => ['nullable', 'string'],
            'position_en' => ['nullable', 'string'],
            'bio' => ['nullable', 'string'],
            'bio_en' => ['nullable', 'string'],
            'sort_order' => ['nullable', 'integer'],
            'visible' => ['boolean'],
        ]);

        if ($request->hasFile('photo')) {
            $data['photo_url'] = $request->file('photo')->store('staff', 'public');
        }

        $staff->update($data);

        return redirect()->route('admin.staff.index');
    }

    // 刪除職員
    public function destroy(Staff $staff)
    {
        $staff->delete();
        return redirect()->route('admin.staff.index');
    }
}
