<?php

namespace App\Services;

use App\Repositories\Contracts\BaseRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Model;

class CrudService
{
    public function __construct(private BaseRepository $repo)
    {
    }

    public function list(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        return $this->repo->paginate($perPage, $filters);
    }

    public function get(int|string $id): ?Model
    {
        return $this->repo->find($id);
    }

    public function create(array $data): Model
    {
        return $this->repo->create($data);
    }

    public function update(int|string $id, array $data): ?Model
    {
        return $this->repo->update($id, $data);
    }

    public function delete(int|string $id): bool
    {
        return $this->repo->delete($id);
    }
}

