<?php

namespace App\Repositories\Eloquent;

use App\Repositories\Contracts\BaseRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

abstract class BaseEloquentRepository implements BaseRepository
{
    protected Model $model;

    public function __construct(Model $model)
    {
        $this->model = $model;
    }

    public function model(): Model
    {
        return $this->model;
    }

    protected function applyFilters(Builder $query, array $filters): Builder
    {
        foreach ($filters as $key => $value) {
            if ($value === null || $value === '') continue;
            if (in_array($key, ['q','query'])) {
                $q = (string)$value;
                $query->where(function ($qq) use ($q) {
                    $qq->where('name', 'like', "%$q%")
                       ->orWhere('title', 'like', "%$q%")
                       ->orWhere('slug', 'like', "%$q%");
                });
            } else {
                $query->where($key, $value);
            }
        }
        return $query;
    }

    public function paginate(int $perPage = 15, array $filters = []): LengthAwarePaginator
    {
        $query = $this->applyFilters($this->model->newQuery(), $filters);
        return $query->paginate($perPage);
    }

    public function find(int|string $id): ?Model
    {
        return $this->model->find($id);
    }

    public function create(array $data): Model
    {
        return $this->model->create($data);
    }

    public function update(int|string $id, array $data): ?Model
    {
        $m = $this->find($id);
        if (!$m) return null;
        $m->fill($data);
        $m->save();
        return $m;
    }

    public function delete(int|string $id): bool
    {
        $m = $this->find($id);
        return $m ? (bool) $m->delete() : false;
    }
}

