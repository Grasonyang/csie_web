<?php

namespace App\Http\Controllers\Api;

use App\Models\Attachment;
use App\Repositories\Contracts\BaseRepository;
use Illuminate\Http\Request;

class AttachmentController extends BaseApiController
{
    public function __construct()
    {
        parent::__construct(app(BaseRepository::class, ['model' => new Attachment()]));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'attachable_type' => 'required|string',
            'attachable_id' => 'required|integer',
            'type' => 'required|string|in:image,document,link',
            'title' => 'nullable|string',
            'file_url' => 'nullable|string',
            'external_url' => 'nullable|string',
            'mime_type' => 'nullable|string',
            'file_size' => 'nullable|integer',
            'alt_text' => 'nullable|string',
            'alt_text_en' => 'nullable|string',
            'sort_order' => 'nullable|integer',
        ]);
        $m = $this->service->create($data);
        return response()->json($m, 201);
    }

    public function update(Request $request, $id)
    {
        $data = $request->validate([
            'type' => 'sometimes|string|in:image,document,link',
            'title' => 'nullable|string',
            'file_url' => 'nullable|string',
            'external_url' => 'nullable|string',
            'mime_type' => 'nullable|string',
            'file_size' => 'nullable|integer',
            'alt_text' => 'nullable|string',
            'alt_text_en' => 'nullable|string',
            'sort_order' => 'nullable|integer',
        ]);
        $m = $this->service->update($id, $data);
        abort_if(!$m, 404);
        return response()->json($m);
    }
}

