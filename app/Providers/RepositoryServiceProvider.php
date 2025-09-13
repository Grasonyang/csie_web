<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Repositories\Contracts\BaseRepository;
use App\Repositories\Eloquent\GenericRepository;
use Illuminate\Database\Eloquent\Model;

class RepositoryServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        // Bind a generic repository factory: resolve(BaseRepository::class, ['model' => new ModelInstance])
        $this->app->bind(BaseRepository::class, function ($app, $params) {
            /** @var Model $model */
            $model = $params['model'] ?? null;
            if (!$model) {
                throw new \InvalidArgumentException('Model instance required for BaseRepository binding.');
            }
            return new GenericRepository($model);
        });
    }

    public function boot(): void
    {
        //
    }
}

