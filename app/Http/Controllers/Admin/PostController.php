<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Post;
use App\Models\PostCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
// PostContentFetcher removed from controller; preview endpoint removed

class PostController extends Controller
{
    public function __construct()
    {
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Post::with(['category', 'creator']);

        $search = trim((string) $request->input('search'));
        if ($search !== '') {
            $query->where(function ($innerQuery) use ($search) {
                $innerQuery->where('title', 'like', "%{$search}%")
                    ->orWhere('title_en', 'like', "%{$search}%");
            });
        }

        if ($request->filled('category')) {
            $query->where('category_id', $request->input('category'));
        }

        $status = $request->input('status');
        if (in_array($status, ['draft', 'published', 'archived'], true)) {
            $query->where('status', $status);
        }

        $pinned = $request->input('pinned');
        if (in_array($pinned, ['1', '0'], true)) {
            $query->where('pinned', $pinned === '1');
        }

        $perPage = (int) $request->input('per_page', 20);
        $allowedPerPage = [10, 20, 50];
        if (! in_array($perPage, $allowedPerPage, true)) {
            $perPage = 20;
        }

        $hasCustomFilters = $search !== ''
            || $request->filled('category')
            || $request->filled('status')
            || $request->filled('pinned');

        if (! $hasCustomFilters) {
            $query->where(function ($innerQuery) {
                $innerQuery->whereNull('publish_at')
                    ->orWhere('publish_at', '<=', now());
            });
        }

        $posts = $query
            ->orderBy('pinned', 'desc')
            ->orderBy('publish_at', 'desc')
            ->orderBy('created_at', 'desc')
            ->paginate($perPage)
            ->withQueryString();

        return Inertia::render('admin/posts/index', [
            'posts' => $posts,
            'categories' => PostCategory::all(),
            'filters' => [
                'search' => $search,
                'category' => $request->input('category', ''),
                'status' => $status ?? '',
                'pinned' => $pinned ?? '',
                'per_page' => $perPage,
            ],
            'perPageOptions' => $allowedPerPage,
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
            'attachments.files' => 'array',
            'attachments.files.*' => 'file|max:20480',
            'attachments.links' => 'array',
            'attachments.links.*.title' => 'nullable|string|max:255',
            'attachments.links.*.url' => 'nullable|url',
        ]);

        $sourceType = $validated['source_type'];
        $titleZh = trim($validated['title']['zh-TW'] ?? '');
        $titleEn = trim($validated['title']['en'] ?? '');
        if ($titleEn === '') {
            $titleEn = $titleZh;
        }

        $manualContentZh = $validated['content']['zh-TW'] ?? '';
        $manualContentEn = $validated['content']['en'] ?? '';
        if ($sourceType === 'manual' && trim($manualContentEn) === '') {
            $manualContentEn = $manualContentZh;
        }

        $postData = [
            'category_id' => $validated['category_id'],
            'status' => $validated['status'],
            'pinned' => $request->boolean('pinned'),
            'publish_at' => $validated['publish_at'] ?? null,
            'title' => $titleZh,
            'title_en' => $titleEn,
            'content' => $sourceType === 'manual' ? $manualContentZh : '',
            'content_en' => $sourceType === 'manual' ? $manualContentEn : '',
            'source_type' => $sourceType,
            'source_url' => $sourceType === 'link' ? $validated['source_url'] : null,
            'created_by' => auth()->id(),
            'updated_by' => auth()->id(),
            'slug' => Str::slug(($validated['title']['zh-TW'] ?? '') . '-' . time()),
        ];

        if (blank($postData['publish_at'])) {
            $postData['publish_at'] = null;
        }

        if ($postData['status'] === 'published') {
            $postData['publish_at'] = $postData['publish_at']
                ? Carbon::parse($postData['publish_at'])
                : now();
        } elseif ($postData['publish_at']) {
            $postData['publish_at'] = Carbon::parse($postData['publish_at']);
        }

        $post = Post::create($postData);

        $this->syncAttachments($post, $request);

        return redirect()->route('admin.posts.index')
            ->with('success', '公告建立成功');
    }

    // Note: preview endpoint removed; external content is not stored server-side anymore.

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
            'post' => $post->load(['attachments']),
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
            'attachments.files' => 'array',
            'attachments.files.*' => 'file|max:20480',
            'attachments.links' => 'array',
            'attachments.links.*.title' => 'nullable|string|max:255',
            'attachments.links.*.url' => 'nullable|url',
            'attachments.remove' => 'array',
            'attachments.remove.*' => 'integer|exists:attachments,id',
        ]);

        $sourceType = $validated['source_type'];

        $titleZh = trim($validated['title']['zh-TW'] ?? $post->title);
        $titleEn = trim($validated['title']['en'] ?? '');
        if ($titleEn === '') {
            $titleEn = $titleZh;
        }

        $manualContentZh = $validated['content']['zh-TW'] ?? '';
        $manualContentEn = $validated['content']['en'] ?? '';
        if ($sourceType === 'manual' && trim($manualContentEn) === '') {
            $manualContentEn = $manualContentZh;
        }

        $postData = [
            'category_id' => $validated['category_id'],
            'status' => $validated['status'],
            'pinned' => $request->boolean('pinned'),
            'publish_at' => $validated['publish_at'] ?? null,
            'title' => $titleZh,
            'title_en' => $titleEn,
            'content' => $sourceType === 'manual' ? $manualContentZh : '',
            'content_en' => $sourceType === 'manual' ? $manualContentEn : '',
            'source_type' => $sourceType,
            'source_url' => $sourceType === 'link' ? $validated['source_url'] : null,
            'updated_by' => auth()->id(),
        ];

        if (blank($postData['publish_at'])) {
            $postData['publish_at'] = null;
        }

        if ($postData['status'] === 'published') {
            $postData['publish_at'] = $postData['publish_at']
                ? Carbon::parse($postData['publish_at'])
                : now();
        } elseif ($postData['publish_at']) {
            $postData['publish_at'] = Carbon::parse($postData['publish_at']);
        }

        $post->update($postData);

        $this->syncAttachments($post, $request);

        return redirect()->route('admin.posts.index')
            ->with('success', '公告更新成功');
    }

    protected function syncAttachments(Post $post, Request $request): void
    {
        $files = $request->file('attachments.files', []);
        $links = (array) $request->input('attachments.links', []);
        $remove = (array) $request->input('attachments.remove', []);

        if (! empty($remove)) {
            $attachmentsToRemove = $post->attachments()->whereIn('id', $remove)->get();
            foreach ($attachmentsToRemove as $attachment) {
                if ($attachment->file_url && str_starts_with($attachment->file_url, '/storage/')) {
                    $path = str_replace('/storage/', '', $attachment->file_url);
                    if (Storage::disk('public')->exists($path)) {
                        Storage::disk('public')->delete($path);
                    }
                }
                $attachment->delete();
            }
        }

        if (! empty($files)) {
            $currentSort = (int) $post->attachments()->max('sort_order');
            foreach ($files as $file) {
                if (! $file) {
                    continue;
                }

                $path = $file->store('attachments', 'public');
                $mime = $file->getMimeType();
                $type = str_starts_with((string) $mime, 'image/') ? 'image' : 'document';

                $post->attachments()->create([
                    'type' => $type,
                    'title' => $file->getClientOriginalName(),
                    'file_url' => '/storage/' . $path,
                    'mime_type' => $mime,
                    'file_size' => $file->getSize(),
                    'sort_order' => ++$currentSort,
                ]);
            }
        }

        if (! empty($links)) {
            $currentSort = (int) $post->attachments()->max('sort_order');
            foreach ($links as $link) {
                $url = trim($link['url'] ?? '');
                if ($url === '') {
                    continue;
                }

                $title = trim($link['title'] ?? '');

                $post->attachments()->create([
                    'type' => 'link',
                    'title' => $title !== '' ? $title : null,
                    'external_url' => $url,
                    'sort_order' => ++$currentSort,
                ]);
            }
        }
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
