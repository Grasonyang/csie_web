<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\AttachmentDownloadController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';

// Attachments (web access)
Route::get('/attachments/{attachment}', [AttachmentDownloadController::class, 'redirect'])
    ->name('attachments.show');
Route::get('/attachments/{attachment}/download', [AttachmentDownloadController::class, 'download'])
    ->name('attachments.download');
