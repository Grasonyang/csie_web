<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Program;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProgramController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Program::withCount('courses');

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name->zh-TW', 'like', "%{$search}%")
                    ->orWhere('name->en', 'like', "%{$search}%")
                    ->orWhere('code', 'like', "%{$search}%");
            });
        }

        if ($level = $request->input('level')) {
            $query->where('level', $level);
        }

        if (!is_null($visible = $request->input('visible'))) {
            if ($visible === '1' || $visible === 1 || $visible === true) {
                $query->where('visible', true);
            } elseif ($visible === '0' || $visible === 0 || $visible === false) {
                $query->where('visible', false);
            }
        }

        $perPage = max(1, (int) $request->input('per_page', 20));

        $programs = $query
            ->orderBy('sort_order')
            ->orderBy('name->zh-TW')
            ->paginate($perPage)
            ->withQueryString();

        return Inertia::render('admin/programs/index', [
            'programs' => $programs,
            'filters' => $request->only(['search', 'level', 'visible', 'per_page']),
            'levelOptions' => [
                'bachelor' => 'bachelor',
                'master' => 'master',
                'ai_inservice' => 'ai_inservice',
                'dual' => 'dual',
            ],
            'perPageOptions' => [10, 20, 50],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('admin/programs/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'code' => 'nullable|string|unique:programs,code',
            'name' => 'required|array',
            'name.zh-TW' => 'required|string|max:255',
            'name.en' => 'nullable|string|max:255',
            'level' => 'required|in:bachelor,master,ai_inservice,dual',
            'description' => 'nullable|array',
            'description.zh-TW' => 'nullable|string',
            'description.en' => 'nullable|string',
            'website_url' => 'nullable|url',
            'sort_order' => 'integer',
            'visible' => 'boolean',
        ]);

        Program::create($validated);

        return redirect()->route('admin.programs.index')
            ->with('success', '學程建立成功');
    }

    /**
     * Display the specified resource.
     */
    public function show(Program $program)
    {
        return Inertia::render('admin/programs/show', [
            'program' => $program->load(['courses']),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Program $program)
    {
        return Inertia::render('admin/programs/edit', [
            'program' => $program,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Program $program)
    {
        $validated = $request->validate([
            'code' => 'nullable|string|unique:programs,code,' . $program->id,
            'name' => 'required|array',
            'name.zh-TW' => 'required|string|max:255',
            'name.en' => 'nullable|string|max:255',
            'level' => 'required|in:bachelor,master,ai_inservice,dual',
            'description' => 'nullable|array',
            'description.zh-TW' => 'nullable|string',
            'description.en' => 'nullable|string',
            'website_url' => 'nullable|url',
            'sort_order' => 'integer',
            'visible' => 'boolean',
        ]);

        $program->update($validated);

        return redirect()->route('admin.programs.index')
            ->with('success', '學程更新成功');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Program $program)
    {
        if ($program->courses()->count() > 0) {
            return back()->withErrors(['error' => '此學程下還有課程，無法刪除']);
        }

        $program->delete();

        return redirect()->route('admin.programs.index')
            ->with('success', '學程刪除成功');
    }
}
