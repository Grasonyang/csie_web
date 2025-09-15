<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Publication;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PublicationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $publications = Publication::orderBy('year', 'desc')
            ->orderBy('title->zh-TW')
            ->paginate(20);

        return Inertia::render('admin/publications/index', [
            'publications' => $publications,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('admin/publications/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|array',
            'title.zh-TW' => 'required|string|max:255',
            'title.en' => 'nullable|string|max:255',
            'authors_text' => 'required|array',
            'authors_text.zh-TW' => 'required|string',
            'authors_text.en' => 'nullable|string',
            'abstract' => 'nullable|array',
            'abstract.zh-TW' => 'nullable|string',
            'abstract.en' => 'nullable|string',
            'year' => 'required|integer|min:1900|max:' . (date('Y') + 5),
            'type' => 'required|in:journal,conference,book,other',
            'venue' => 'nullable|string',
            'doi' => 'nullable|string',
            'url' => 'nullable|url',
            'visible' => 'boolean',
        ]);

        Publication::create($validated);

        return redirect()->route('admin.publications.index')
            ->with('success', '論文建立成功');
    }

    /**
     * Display the specified resource.
     */
    public function show(Publication $publication)
    {
        return Inertia::render('admin/publications/show', [
            'publication' => $publication,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Publication $publication)
    {
        return Inertia::render('admin/publications/edit', [
            'publication' => $publication,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Publication $publication)
    {
        $validated = $request->validate([
            'title' => 'required|array',
            'title.zh-TW' => 'required|string|max:255',
            'title.en' => 'nullable|string|max:255',
            'authors_text' => 'required|array',
            'authors_text.zh-TW' => 'required|string',
            'authors_text.en' => 'nullable|string',
            'abstract' => 'nullable|array',
            'abstract.zh-TW' => 'nullable|string',
            'abstract.en' => 'nullable|string',
            'year' => 'required|integer|min:1900|max:' . (date('Y') + 5),
            'type' => 'required|in:journal,conference,book,other',
            'venue' => 'nullable|string',
            'doi' => 'nullable|string',
            'url' => 'nullable|url',
            'visible' => 'boolean',
        ]);

        $publication->update($validated);

        return redirect()->route('admin.publications.index')
            ->with('success', '論文更新成功');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Publication $publication)
    {
        $publication->delete();

        return redirect()->route('admin.publications.index')
            ->with('success', '論文刪除成功');
    }
}
