<?php

namespace App\Http\Controllers\Api;

use App\Models\TeacherLink;
use App\Repositories\Contracts\BaseRepository;
use Illuminate\Http\Request;

class TeacherLinkController extends BaseApiController
{
    public function __construct()
    {
        parent::__construct(app(BaseRepository::class, ['model' => new TeacherLink()]));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'teacher_id' => 'required|integer|exists:teachers,id',
            'type' => 'required|string|in:website,scholar,github,linkedin,other',
            'label' => 'nullable|string',
            'url' => 'required|string',
            'sort_order' => 'nullable|integer',
        ]);
        $m = $this->service->create($data);
        return response()->json($m, 201);
    }

    public function update(Request $request, $id)
    {
        $data = $request->validate([
            'type' => 'sometimes|string|in:website,scholar,github,linkedin,other',
            'label' => 'nullable|string',
            'url' => 'nullable|string',
            'sort_order' => 'nullable|integer',
        ]);
        $m = $this->service->update($id, $data);
        abort_if(!$m, 404);
        return response()->json($m);
    }
}

