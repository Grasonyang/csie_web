<?php

namespace App\Http\Controllers\Api;

use App\Models\Program;
use App\Repositories\Contracts\BaseRepository;
use Illuminate\Http\Request;

class ProgramController extends BaseApiController
{
    public function __construct()
    {
        parent::__construct(app(BaseRepository::class, ['model' => new Program()]));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'code' => 'required|string|unique:programs,code',
            'level' => 'required|string|in:bachelor,master,ai_inservice,dual',
            'website_url' => 'nullable|string',
            'name' => 'required|string',
            'name_en' => 'nullable|string',
            'description' => 'nullable|string',
            'description_en' => 'nullable|string',
            'visible' => 'boolean',
            'sort_order' => 'nullable|integer',
        ]);
        $data['name_en'] = $data['name_en'] ?? $data['name'];
        $m = $this->service->create($data);
        return response()->json($m, 201);
    }

    public function update(Request $request, $id)
    {
        $data = $request->validate([
            'code' => 'sometimes|string|unique:programs,code,'.$id,
            'level' => 'sometimes|string|in:bachelor,master,ai_inservice,dual',
            'website_url' => 'nullable|string',
            'name' => 'sometimes|string',
            'name_en' => 'nullable|string',
            'description' => 'nullable|string',
            'description_en' => 'nullable|string',
            'visible' => 'boolean',
            'sort_order' => 'nullable|integer',
        ]);
        if (isset($data['name']) && empty($data['name_en'])) {
            $data['name_en'] = $data['name'];
        }
        $m = $this->service->update($id, $data);
        abort_if(!$m, 404);
        return response()->json($m);
    }
}

