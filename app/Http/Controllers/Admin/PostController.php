<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Post;
use App\Models\PostCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class PostController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $posts = Post::with(['category', 'creator'])
            ->orderBy('pinned', 'desc')
            ->orderBy('publish_at', 'desc')
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
            'title.zh-TW' => 'required|string|max:255',
            'title.en' => 'nullable|string|max:255',
            'content.zh-TW' => 'required|string',
            'content.en' => 'nullable|string',
            'category_id' => 'required|exists:post_categories,id',
            'status' => 'required|in:draft,published',
            'pinned' => 'boolean',
            'publish_at' => 'nullable|date',
        ]);

        $postData = [
            'category_id' => $validated['category_id'],
            'status' => $validated['status'],
            'pinned' => $request->boolean('pinned'),
            'publish_at' => $validated['publish_at'] ?? null,
            'title' => $validated['title']['zh-TW'] ?? '',
            'title_en' => $validated['title']['en'] ?? '',
            'content' => $validated['content']['zh-TW'] ?? '',
            'content_en' => $validated['content']['en'] ?? '',
            'created_by' => auth()->id(),
            'updated_by' => auth()->id(),
            'slug' => Str::slug($validated['title']['zh-TW'] . '-' . time()),
        ];

        Post::create($postData);

        return redirect()->route('admin.posts.index')
            ->with('success', '公告建立成功');
    }

    /**
     * Display the specified resource.
     */
    public function show(Post $post)
    {
        return Inertia::render('admin/posts/show', [
            'post' => $post->load(['category', 'creator', 'attachments']),
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
            'title.zh-TW' => 'required|string|max:255',
            'title.en' => 'nullable|string|max:255',
            'content.zh-TW' => 'required|string',
            'content.en' => 'nullable|string',
            'category_id' => 'required|exists:post_categories,id',
            'status' => 'required|in:draft,published',
            'pinned' => 'boolean',
            'publish_at' => 'nullable|date',
        ]);

        $postData = [
            'category_id' => $validated['category_id'],
            'status' => $validated['status'],
            'pinned' => $validated['pinned'] ?? false,
            'publish_at' => $validated['publish_at'],
            'title' => $validated['title']['zh-TW'],
            'title_en' => $validated['title']['en'],
            'content' => $validated['content']['zh-TW'],
            'content_en' => $validated['content']['en'],
            'updated_by' => auth()->id(),
        ];

        $post->update($postData);

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
