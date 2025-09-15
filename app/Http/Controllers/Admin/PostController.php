<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Post;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class PostController extends Controller
{
    public function __construct()
    {
        // 授權檢查
        $this->authorizeResource(Post::class, 'post');
    }
    // 列出所有文章
    public function index()
    {
        $posts = Post::latest()->get();
        return Inertia::render('admin/posts/index', [
            'posts' => $posts,
        ]);
    }

    // 顯示新增表單
    public function create()
    {
        return Inertia::render('admin/posts/create');
    }

    // 儲存新文章
    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'required|string',
            'title_en' => 'nullable|string',
            'content' => 'required|string',
            'content_en' => 'nullable|string',
            'attachments.*' => 'file',
        ]);

        // 若未提供英文欄位則自動複製
        $data['title_en'] = $data['title_en'] ?? $data['title'];
        $data['content_en'] = $data['content_en'] ?? $data['content'];

        $data['created_by'] = $request->user()->id;
        $data['updated_by'] = $request->user()->id;

        $post = Post::create($data);

        // 處理附件上傳
        if ($request->hasFile('attachments')) {
            foreach ($request->file('attachments') as $file) {
                $path = $file->store('attachments', 'public');
                $post->attachments()->create([
                    'type' => str_starts_with($file->getMimeType(), 'image/') ? 'image' : 'document',
                    'title' => $file->getClientOriginalName(),
                    'file_url' => '/storage/' . $path,
                    'mime_type' => $file->getMimeType(),
                    'file_size' => $file->getSize(),
                ]);
            }
        }

        return redirect()->route('admin.posts.index');
    }

    // 顯示編輯表單
    public function edit(Post $post)
    {
        return Inertia::render('admin/posts/edit', [
            'post' => $post,
        ]);
    }

    // 更新文章
    public function update(Request $request, Post $post)
    {
        $data = $request->validate([
            'title' => 'sometimes|string',
            'title_en' => 'nullable|string',
            'content' => 'sometimes|string',
            'content_en' => 'nullable|string',
            'attachments.*' => 'file',
        ]);

        if (isset($data['title']) && empty($data['title_en'])) {
            $data['title_en'] = $data['title'];
        }
        if (isset($data['content']) && empty($data['content_en'])) {
            $data['content_en'] = $data['content'];
        }

        $data['updated_by'] = $request->user()->id;

        $post->update($data);

        // 新增附件
        if ($request->hasFile('attachments')) {
            foreach ($request->file('attachments') as $file) {
                $path = $file->store('attachments', 'public');
                $post->attachments()->create([
                    'type' => str_starts_with($file->getMimeType(), 'image/') ? 'image' : 'document',
                    'title' => $file->getClientOriginalName(),
                    'file_url' => '/storage/' . $path,
                    'mime_type' => $file->getMimeType(),
                    'file_size' => $file->getSize(),
                ]);
            }
        }

        return redirect()->route('admin.posts.index');
    }

    // 刪除文章
    public function destroy(Post $post)
    {
        $post->delete();
        return redirect()->route('admin.posts.index');
    }
}
