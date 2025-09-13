<?php

namespace App\Http\Controllers\Api;

use App\Models\Lab;
use App\Repositories\Contracts\BaseRepository;
use Illuminate\Http\Request;

class LabController extends BaseApiController
{
    public function __construct()
    {
        parent::__construct(app(BaseRepository::class, ['model' => new Lab()]));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'code' => 'nullable|string',
            'website_url' => 'nullable|string',
            'email' => 'nullable|string',
            'phone' => 'nullable|string',
            'cover_image_url' => 'nullable|string',
            'name' => 'required|string',
            'name_en' => 'nullable|string',
            'description' => 'nullable|string',
            'description_en' => 'nullable|string',
            'sort_order' => 'nullable|integer',
            'visible' => 'boolean',
        ]);
        $data['name_en'] = $data['name_en'] ?? $data['name'];
        $m = $this->service->create($data);
        return response()->json($m, 201);
    }

    public function update(Request $request, $id)
    {
        $data = $request->validate([
            'code' => 'nullable|string',
            'website_url' => 'nullable|string',
            'email' => 'nullable|string',
            'phone' => 'nullable|string',
            'cover_image_url' => 'nullable|string',
            'name' => 'sometimes|string',
            'name_en' => 'nullable|string',
            'description' => 'nullable|string',
            'description_en' => 'nullable|string',
            'sort_order' => 'nullable|integer',
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

