<?php

namespace App\Http\Controllers\Api;

use App\Models\Teacher;
use App\Repositories\Contracts\BaseRepository;
use Illuminate\Http\Request;

class TeacherController extends BaseApiController
{
    public function __construct()
    {
        parent::__construct(app(BaseRepository::class, ['model' => new Teacher()]));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'email' => 'nullable|email',
            'phone' => 'nullable|string',
            'office' => 'nullable|string',
            'job_title' => 'nullable|string',
            'photo_url' => 'nullable|string',
            'name' => 'required|string',
            'name_en' => 'nullable|string',
            'title' => 'nullable|string',
            'title_en' => 'nullable|string',
            'bio' => 'nullable|string',
            'bio_en' => 'nullable|string',
            'expertise' => 'nullable|string',
            'expertise_en' => 'nullable|string',
            'education' => 'nullable|string',
            'education_en' => 'nullable|string',
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
            'email' => 'nullable|email',
            'phone' => 'nullable|string',
            'office' => 'nullable|string',
            'job_title' => 'nullable|string',
            'photo_url' => 'nullable|string',
            'name' => 'sometimes|string',
            'name_en' => 'nullable|string',
            'title' => 'nullable|string',
            'title_en' => 'nullable|string',
            'bio' => 'nullable|string',
            'bio_en' => 'nullable|string',
            'expertise' => 'nullable|string',
            'expertise_en' => 'nullable|string',
            'education' => 'nullable|string',
            'education_en' => 'nullable|string',
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

