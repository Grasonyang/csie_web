<?php

namespace App\Http\Controllers\Api;

use App\Repositories\Contracts\BaseRepository;
use App\Services\CrudService;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Http\Request;

abstract class BaseApiController extends BaseController
{
    use AuthorizesRequests;

    protected CrudService $service;

    public function __construct(BaseRepository $repo)
    {
        $this->service = new CrudService($repo);
    }

    public function index(Request $request)
    {
        $perPage = (int) $request->integer('per_page', 15);
        $filters = $request->except(['page','per_page']);
        return response()->json($this->service->list($filters, $perPage));
    }

    public function show($id)
    {
        $model = $this->service->get($id);
        abort_if(!$model, 404);
        return response()->json($model);
    }

    public function destroy($id)
    {
        $ok = $this->service->delete($id);
        return response()->json(['deleted' => $ok]);
    }
}

