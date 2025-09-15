<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Post;
use App\Models\PostCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PostController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $posts = Post::with(['category', 'author'])
            ->orderBy('pinned', 'desc')
            ->orderBy('published_at', 'desc')
            ->paginate(20);

        return Inertia::render('admin/posts/index', [
            'posts' => $posts,
            'categories' => PostCategory::all(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('admin/posts/create', [
            'categories' => PostCategory::all(),
        ]);
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
            'content' => 'required|array',
            'content.zh-TW' => 'required|string',
            'content.en' => 'nullable|string',
            'category_id' => 'required|exists:post_categories,id',
            'status' => 'required|in:draft,published',
            'pinned' => 'boolean',
            'published_at' => 'nullable|date',
        ]);

        $validated['author_id'] = auth()->id();
        $validated['slug'] = \Str::slug($validated['title']['zh-TW'] . '-' . time());

        Post::create($validated);

        return redirect()->route('admin.posts.index')
            ->with('success', '公告建立成功');
    }

    /**
     * Display the specified resource.
     */
    public function show(Post $post)
    {
        return Inertia::render('admin/posts/show', [
            'post' => $post->load(['category', 'author', 'attachments']),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Post $post)
    {
        return Inertia::render('admin/posts/edit', [
            'post' => $post,
            'categories' => PostCategory::all(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Post $post)
    {
        $validated = $request->validate([
            'title' => 'required|array',
            'title.zh-TW' => 'required|string|max:255',
            'title.en' => 'nullable|string|max:255',
            'content' => 'required|array',
            'content.zh-TW' => 'required|string',
            'content.en' => 'nullable|string',
            'category_id' => 'required|exists:post_categories,id',
            'status' => 'required|in:draft,published',
            'pinned' => 'boolean',
            'published_at' => 'nullable|date',
        ]);

        $post->update($validated);

        return redirect()->route('admin.posts.index')
            ->with('success', '公告更新成功');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Post $post)
    {
        $post->delete();

        return redirect()->route('admin.posts.index')
            ->with('success', '公告刪除成功');
    }
}
