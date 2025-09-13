<?php

namespace App\Http\Controllers\Api;

use App\Models\ContactMessage;
use App\Repositories\Contracts\BaseRepository;
use Illuminate\Http\Request;

class ContactMessageController extends BaseApiController
{
    public function __construct()
    {
        parent::__construct(app(BaseRepository::class, ['model' => new ContactMessage()]));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'locale' => 'nullable|string',
            'name' => 'required|string',
            'email' => 'required|email',
            'subject' => 'nullable|string',
            'message' => 'required|string',
            'file_url' => 'nullable|string',
        ]);
        $data['status'] = 'new';
        $m = $this->service->create($data);
        return response()->json($m, 201);
    }

    public function update(Request $request, $id)
    {
        $data = $request->validate([
            'status' => 'sometimes|string|in:new,in_progress,resolved,spam',
            'processed_by' => 'nullable|integer|exists:users,id',
            'processed_at' => 'nullable|date',
        ]);
        $m = $this->service->update($id, $data);
        abort_if(!$m, 404);
        return response()->json($m);
    }
}

