<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\PostController;

// 管理後台的文章路由
Route::middleware(['auth', 'verified'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        Route::resource('posts', PostController::class);
    });
