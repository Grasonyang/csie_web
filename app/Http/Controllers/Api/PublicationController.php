<?php

namespace App\Http\Controllers\Api;

use App\Models\Publication;
use App\Repositories\Contracts\BaseRepository;
use Illuminate\Http\Request;

class PublicationController extends BaseApiController
{
    public function __construct()
    {
        parent::__construct(app(BaseRepository::class, ['model' => new Publication()]));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'year' => 'required|integer',
            'type' => 'required|string|in:journal,conference,book,other',
            'venue' => 'nullable|string',
            'doi' => 'nullable|string',
            'url' => 'nullable|string',
            'title' => 'required|string',
            'title_en' => 'nullable|string',
            'authors_text' => 'required|string',
            'authors_text_en' => 'nullable|string',
            'abstract' => 'nullable|string',
            'abstract_en' => 'nullable|string',
            'visible' => 'boolean',
        ]);
        $data['title_en'] = $data['title_en'] ?? $data['title'];
        $data['authors_text_en'] = $data['authors_text_en'] ?? $data['authors_text'];
        $m = $this->service->create($data);
        return response()->json($m, 201);
    }

    public function update(Request $request, $id)
    {
        $data = $request->validate([
            'year' => 'sometimes|integer',
            'type' => 'sometimes|string|in:journal,conference,book,other',
            'venue' => 'nullable|string',
            'doi' => 'nullable|string',
            'url' => 'nullable|string',
            'title' => 'sometimes|string',
            'title_en' => 'nullable|string',
            'authors_text' => 'nullable|string',
            'authors_text_en' => 'nullable|string',
            'abstract' => 'nullable|string',
            'abstract_en' => 'nullable|string',
            'visible' => 'boolean',
        ]);
        if (isset($data['title']) && empty($data['title_en'])) {
            $data['title_en'] = $data['title'];
        }
        if (isset($data['authors_text']) && empty($data['authors_text_en'])) {
            $data['authors_text_en'] = $data['authors_text'];
        }
        $m = $this->service->update($id, $data);
        abort_if(!$m, 404);
        return response()->json($m);
    }
}

