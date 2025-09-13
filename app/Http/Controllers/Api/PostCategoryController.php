<?php

namespace App\Http\Controllers\Api;

use App\Models\PostCategory;
use App\Repositories\Contracts\BaseRepository;
use Illuminate\Http\Request;

class PostCategoryController extends BaseApiController
{
    public function __construct()
    {
        parent::__construct(app(BaseRepository::class, ['model' => new PostCategory()]));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'parent_id' => 'nullable|integer|exists:post_categories,id',
            'slug' => 'required|string|unique:post_categories,slug',
            'name' => 'required|string',
            'name_en' => 'nullable|string',
            'sort_order' => 'integer',
            'visible' => 'boolean',
        ]);
        $data['name_en'] = $data['name_en'] ?? $data['name'];
        $m = $this->service->create($data);
        return response()->json($m, 201);
    }

    public function update(Request $request, $id)
    {
        $data = $request->validate([
            'parent_id' => 'nullable|integer|exists:post_categories,id',
            'slug' => 'sometimes|string|unique:post_categories,slug,'.$id,
            'name' => 'sometimes|string',
            'name_en' => 'nullable|string',
            'sort_order' => 'integer',
            'visible' => 'boolean',
        ]);
        if (isset($data['name']) && empty($data['name_en'])) {
            $data['name_en'] = $data['name'];
        }
        $m = $this->service->update($id, $data);
        abort_if(!$m, 404);
        return response()->json($m);
    }
}

