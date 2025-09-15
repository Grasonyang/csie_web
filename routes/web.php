<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\AttachmentDownloadController;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Session;
use App\Http\Controllers\TestController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

// Locale switcher: sets session locale and redirects back
Route::get('/locale/{locale}', function (string $locale) {
    $normalized = strtolower(str_replace('_', '-', $locale));
    $supported = ['en', 'zh-tw'];
    if (! in_array($normalized, $supported, true)) {
        $normalized = config('app.locale');
    }
    // Map to canonical format used by resources/lang folder
    $canonical = $normalized === 'zh-tw' ? 'zh-TW' : 'en';
    Session::put('locale', $canonical);
    App::setLocale($canonical);
    return Redirect::back();
})->name('locale.set');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::prefix('test')->name('test')->group(function(){
        Route::get('/', [TestController::class, 'index'])->name('index');
        Route::get('/create', [TestController::class, 'create'])->name('create');
        Route::post('/', [TestController::class, 'store'])->name('store');
        Route::get('/{test}', [TestController::class, 'show'])->name('show');
        Route::get('/{test}/edit', [TestController::class, 'edit'])->name('edit');
        Route::put('/{test}', [TestController::class, 'update'])->name('update');
        Route::delete('/{test}', [TestController::class, 'destroy'])->name('destroy');
    });

});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';

// Attachments (web access)
Route::get('/attachments/{attachment}', [AttachmentDownloadController::class, 'redirect'])
    ->name('attachments.show');
Route::get('/attachments/{attachment}/download', [AttachmentDownloadController::class, 'download'])
    ->name('attachments.download');
