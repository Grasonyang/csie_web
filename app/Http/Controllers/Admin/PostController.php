<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Post;
use App\Models\PostCategory;
use App\Services\PostContentFetcher;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use RuntimeException;

class PostController extends Controller
{
    public function __construct(private PostContentFetcher $contentFetcher)
    {
    }

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
            'content.zh-TW' => [Rule::requiredIf(fn () => $request->input('source_type', 'manual') === 'manual'), 'nullable', 'string'],
            'content.en' => 'nullable|string',
            'category_id' => 'required|exists:post_categories,id',
            'status' => 'required|in:draft,published,archived',
            'pinned' => 'boolean',
            'publish_at' => 'nullable|date',
            'source_type' => ['required', Rule::in(['manual', 'link'])],
            'source_url' => [Rule::requiredIf(fn () => $request->input('source_type') === 'link'), 'nullable', 'url'],
        ]);

        $sourceType = $validated['source_type'];
        $fetchedHtml = null;

        if ($sourceType === 'link') {
            try {
                $fetched = $this->contentFetcher->fetch($validated['source_url']);
                $fetchedHtml = $fetched['html'];
            } catch (RuntimeException $exception) {
                throw ValidationException::withMessages([
                    'source_url' => '抓取內容失敗：' . $exception->getMessage(),
                ]);
            }
        }

        $postData = [
            'category_id' => $validated['category_id'],
            'status' => $validated['status'],
            'pinned' => $request->boolean('pinned'),
            'publish_at' => $validated['publish_at'] ?? null,
            'title' => $validated['title']['zh-TW'] ?? '',
            'title_en' => $validated['title']['en'] ?? '',
            'content' => $sourceType === 'manual' ? ($validated['content']['zh-TW'] ?? '') : '',
            'content_en' => $sourceType === 'manual' ? ($validated['content']['en'] ?? '') : '',
            'source_type' => $sourceType,
            'source_url' => $sourceType === 'link' ? $validated['source_url'] : null,
            'fetched_html' => $sourceType === 'link' ? $fetchedHtml : null,
            'created_by' => auth()->id(),
            'updated_by' => auth()->id(),
            'slug' => Str::slug(($validated['title']['zh-TW'] ?? '') . '-' . time()),
        ];

        Post::create($postData);

        return redirect()->route('admin.posts.index')
            ->with('success', '公告建立成功');
    }

    /**
     * 即時抓取外部內容供後台預覽使用。
     */
    public function fetchPreview(Request $request)
    {
        $validated = $request->validate([
            'source_url' => ['required', 'url'],
        ]);

        try {
            $result = $this->contentFetcher->fetch($validated['source_url']);
        } catch (RuntimeException $exception) {
            return response()->json([
                'message' => $exception->getMessage(),
            ], 422);
        }

        return response()->json([
            'title' => $result['title'],
            'description' => $result['description'],
            'html' => $result['html'],
        ]);
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
            'content.zh-TW' => [Rule::requiredIf(fn () => $request->input('source_type', 'manual') === 'manual'), 'nullable', 'string'],
            'content.en' => 'nullable|string',
            'category_id' => 'required|exists:post_categories,id',
            'status' => 'required|in:draft,published,archived',
            'pinned' => 'boolean',
            'publish_at' => 'nullable|date',
            'source_type' => ['required', Rule::in(['manual', 'link'])],
            'source_url' => [Rule::requiredIf(fn () => $request->input('source_type') === 'link'), 'nullable', 'url'],
        ]);

        $sourceType = $validated['source_type'];
        $fetchedHtml = null;

        if ($sourceType === 'link') {
            try {
                $fetched = $this->contentFetcher->fetch($validated['source_url']);
                $fetchedHtml = $fetched['html'];
            } catch (RuntimeException $exception) {
                throw ValidationException::withMessages([
                    'source_url' => '抓取內容失敗：' . $exception->getMessage(),
                ]);
            }
        }

        $postData = [
            'category_id' => $validated['category_id'],
            'status' => $validated['status'],
            'pinned' => $request->boolean('pinned'),
            'publish_at' => $validated['publish_at'] ?? null,
            'title' => $validated['title']['zh-TW'] ?? $post->title,
            'title_en' => $validated['title']['en'] ?? $post->title_en,
            'content' => $sourceType === 'manual' ? ($validated['content']['zh-TW'] ?? '') : '',
            'content_en' => $sourceType === 'manual' ? ($validated['content']['en'] ?? '') : '',
            'source_type' => $sourceType,
            'source_url' => $sourceType === 'link' ? $validated['source_url'] : null,
            'fetched_html' => $sourceType === 'link' ? $fetchedHtml : null,
            'updated_by' => auth()->id(),
        ];

        $post->update($postData);

        return redirect()->route('admin.posts.index')
            ->with('success', '公告更新成功');
    }

    /**
     * 刪除指定的公告。
     */
    public function destroy(Post $post)
    {
        // 執行刪除動作
        $post->delete();

        return redirect()->route('admin.posts.index')
            ->with('success', '公告刪除成功');
    }
}
