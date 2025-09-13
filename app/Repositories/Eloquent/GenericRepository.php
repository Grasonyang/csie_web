<?php

namespace App\Repositories\Eloquent;

use Illuminate\Database\Eloquent\Model;

class GenericRepository extends BaseEloquentRepository
{
    public function __construct(Model $model)
    {
        parent::__construct($model);
    }
}

