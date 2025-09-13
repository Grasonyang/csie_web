<?php

namespace App\Http\Controllers\Api;

use App\Models\Staff;
use App\Repositories\Contracts\BaseRepository;
use Illuminate\Http\Request;

class StaffController extends BaseApiController
{
    public function __construct()
    {
        parent::__construct(app(BaseRepository::class, ['model' => new Staff()]));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'email' => 'nullable|email',
            'phone' => 'nullable|string',
            'photo_url' => 'nullable|string',
            'name' => 'required|string',
            'name_en' => 'nullable|string',
            'position' => 'required|string',
            'position_en' => 'nullable|string',
            'bio' => 'nullable|string',
            'bio_en' => 'nullable|string',
            'sort_order' => 'nullable|integer',
            'visible' => 'boolean',
        ]);
        $data['name_en'] = $data['name_en'] ?? $data['name'];
        $data['position_en'] = $data['position_en'] ?? $data['position'];
        $m = $this->service->create($data);
        return response()->json($m, 201);
    }

    public function update(Request $request, $id)
    {
        $data = $request->validate([
            'email' => 'nullable|email',
            'phone' => 'nullable|string',
            'photo_url' => 'nullable|string',
            'name' => 'sometimes|string',
            'name_en' => 'nullable|string',
            'position' => 'sometimes|string',
            'position_en' => 'nullable|string',
            'bio' => 'nullable|string',
            'bio_en' => 'nullable|string',
            'sort_order' => 'nullable|integer',
            'visible' => 'boolean',
        ]);
        if (isset($data['name']) && empty($data['name_en'])) {
            $data['name_en'] = $data['name'];
        }
        if (isset($data['position']) && empty($data['position_en'])) {
            $data['position_en'] = $data['position'];
        }
        $m = $this->service->update($id, $data);
        abort_if(!$m, 404);
        return response()->json($m);
    }
}

