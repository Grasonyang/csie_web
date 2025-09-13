<?php

namespace App\Http\Controllers\Api;

use App\Models\Project;
use App\Repositories\Contracts\BaseRepository;
use Illuminate\Http\Request;

class ProjectController extends BaseApiController
{
    public function __construct()
    {
        parent::__construct(app(BaseRepository::class, ['model' => new Project()]));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'code' => 'nullable|string',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
            'sponsor' => 'nullable|string',
            'budget' => 'nullable|numeric',
            'website_url' => 'nullable|string',
            'title' => 'required|string',
            'title_en' => 'nullable|string',
            'abstract' => 'nullable|string',
            'abstract_en' => 'nullable|string',
            'visible' => 'boolean',
        ]);
        $data['title_en'] = $data['title_en'] ?? $data['title'];
        $m = $this->service->create($data);
        return response()->json($m, 201);
    }

    public function update(Request $request, $id)
    {
        $data = $request->validate([
            'code' => 'nullable|string',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
            'sponsor' => 'nullable|string',
            'budget' => 'nullable|numeric',
            'website_url' => 'nullable|string',
            'title' => 'sometimes|string',
            'title_en' => 'nullable|string',
            'abstract' => 'nullable|string',
            'abstract_en' => 'nullable|string',
            'visible' => 'boolean',
        ]);
        if (isset($data['title']) && empty($data['title_en'])) {
            $data['title_en'] = $data['title'];
        }
        $m = $this->service->update($id, $data);
        abort_if(!$m, 404);
        return response()->json($m);
    }
}

