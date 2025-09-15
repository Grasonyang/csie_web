<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Teacher;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TeacherController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $teachers = Teacher::with(['user', 'labs'])
            ->orderBy('sort_order')
            ->orderBy('name->zh-TW')
            ->paginate(20);

        return Inertia::render('admin/teachers/index', [
            'teachers' => $teachers,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('admin/teachers/create', [
            'users' => User::where('role', 'teacher')->whereDoesntHave('teacher')->get(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'nullable|exists:users,id',
            'name' => 'required|array',
            'name.zh-TW' => 'required|string|max:255',
            'name.en' => 'nullable|string|max:255',
            'title' => 'required|array',
            'title.zh-TW' => 'required|string|max:255',
            'title.en' => 'nullable|string|max:255',
            'email' => 'nullable|email',
            'phone' => 'nullable|string',
            'office' => 'nullable|string',
            'job_title' => 'nullable|string',
            'photo_url' => 'nullable|url',
            'bio' => 'nullable|array',
            'expertise' => 'nullable|array',
            'education' => 'nullable|array',
            'sort_order' => 'integer',
            'visible' => 'boolean',
        ]);

        Teacher::create($validated);

        return redirect()->route('admin.teachers.index')
            ->with('success', '教師建立成功');
    }

    /**
     * Display the specified resource.
     */
    public function show(Teacher $teacher)
    {
        return Inertia::render('admin/teachers/show', [
            'teacher' => $teacher->load(['user', 'labs', 'links', 'projects', 'publications']),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Teacher $teacher)
    {
        return Inertia::render('admin/teachers/edit', [
            'teacher' => $teacher->load(['user', 'links']),
            'users' => User::where('role', 'teacher')
                ->where(function($query) use ($teacher) {
                    $query->whereDoesntHave('teacher')
                          ->orWhere('id', $teacher->user_id);
                })->get(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Teacher $teacher)
    {
        $validated = $request->validate([
            'user_id' => 'nullable|exists:users,id',
            'name' => 'required|array',
            'name.zh-TW' => 'required|string|max:255',
            'name.en' => 'nullable|string|max:255',
            'title' => 'required|array',
            'title.zh-TW' => 'required|string|max:255',
            'title.en' => 'nullable|string|max:255',
            'email' => 'nullable|email',
            'phone' => 'nullable|string',
            'office' => 'nullable|string',
            'job_title' => 'nullable|string',
            'photo_url' => 'nullable|url',
            'bio' => 'nullable|array',
            'expertise' => 'nullable|array',
            'education' => 'nullable|array',
            'sort_order' => 'integer',
            'visible' => 'boolean',
        ]);

        $teacher->update($validated);

        return redirect()->route('admin.teachers.index')
            ->with('success', '教師更新成功');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Teacher $teacher)
    {
        $teacher->delete();

        return redirect()->route('admin.teachers.index')
            ->with('success', '教師刪除成功');
    }
}
