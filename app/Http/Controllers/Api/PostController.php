<?php

namespace App\Http\Controllers\Api;

use App\Models\Post;
use App\Repositories\Contracts\BaseRepository;
use Illuminate\Http\Request;

class PostController extends BaseApiController
{
    public function __construct()
    {
        parent::__construct(app(BaseRepository::class, ['model' => new Post()]));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'category_id' => 'required|integer|exists:post_categories,id',
            'slug' => 'required|string|unique:posts,slug',
            'status' => 'required|string|in:draft,published,archived',
            'publish_at' => 'nullable|date',
            'expire_at' => 'nullable|date',
            'pinned' => 'boolean',
            'cover_image_url' => 'nullable|string',
            'title' => 'required|string',
            'title_en' => 'nullable|string',
            'summary' => 'nullable|string',
            'summary_en' => 'nullable|string',
            'content' => 'required|string',
            'content_en' => 'nullable|string',
        ]);
        $adminId = (int) (\DB::table('users')->where('role','admin')->value('id') ?? \DB::table('users')->value('id'));
        $data['title_en'] = $data['title_en'] ?? $data['title'];
        $data['content_en'] = $data['content_en'] ?? $data['content'];
        $data['created_by'] = $adminId;
        $data['updated_by'] = $adminId;
        $post = $this->service->create($data);
        return response()->json($post, 201);
    }

    public function update(Request $request, $id)
    {
        $data = $request->validate([
            'category_id' => 'sometimes|integer|exists:post_categories,id',
            'slug' => 'sometimes|string|unique:posts,slug,'.$id,
            'status' => 'sometimes|string|in:draft,published,archived',
            'publish_at' => 'nullable|date',
            'expire_at' => 'nullable|date',
            'pinned' => 'boolean',
            'cover_image_url' => 'nullable|string',
            'title' => 'sometimes|string',
            'title_en' => 'nullable|string',
            'summary' => 'nullable|string',
            'summary_en' => 'nullable|string',
            'content' => 'sometimes|string',
            'content_en' => 'nullable|string',
        ]);
        if (isset($data['title']) && empty($data['title_en'])) {
            $data['title_en'] = $data['title'];
        }
        if (isset($data['content']) && empty($data['content_en'])) {
            $data['content_en'] = $data['content'];
        }
        $post = $this->service->update($id, $data);
        abort_if(!$post, 404);
        return response()->json($post);
    }
}

