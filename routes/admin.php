<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Admin Controllers
use App\Http\Controllers\Admin\StaffController as AdminStaffController;
use App\Http\Controllers\Admin\LabController as AdminLabController;
use App\Http\Controllers\Admin\TeacherController as AdminTeacherController;
use App\Http\Controllers\Admin\PostController as AdminPostController;
use App\Http\Controllers\Admin\PostCategoryController as AdminPostCategoryController;
use App\Http\Controllers\Admin\CourseController as AdminCourseController;
use App\Http\Controllers\Admin\ProgramController as AdminProgramController;
use App\Http\Controllers\Admin\ProjectController as AdminProjectController;
use App\Http\Controllers\Admin\PublicationController as AdminPublicationController;
use App\Http\Controllers\Admin\ContactMessageController as AdminContactMessageController;

/*
|--------------------------------------------------------------------------
| Admin Routes
|--------------------------------------------------------------------------
|
| Here are the routes for administrative functionality.
| All routes in this file require authentication and admin privileges.
|
*/

Route::middleware(['auth', 'verified'])->prefix('admin')->name('admin.')->group(function () {

    // Dashboard
    Route::get('/', function () {
        return redirect()->route('admin.dashboard');
    });

    Route::get('/dashboard', function () {
        return Inertia::render('admin/dashboard');
    })->name('dashboard');

    // 系所成員管理
    Route::resource('staff', AdminStaffController::class);
    Route::resource('teachers', AdminTeacherController::class);

    // 學術研究管理
    Route::resource('labs', AdminLabController::class);
    Route::resource('projects', AdminProjectController::class);
    Route::resource('publications', AdminPublicationController::class);

    // 課程修業管理
    Route::resource('programs', AdminProgramController::class);
    Route::resource('courses', AdminCourseController::class);

    // 公告管理
    Route::resource('post-categories', AdminPostCategoryController::class);
    Route::resource('posts', AdminPostController::class);

    // 聯絡我們管理
    Route::resource('contact-messages', AdminContactMessageController::class);
    Route::patch('contact-messages/{contactMessage}/spam', [AdminContactMessageController::class, 'markAsSpam'])
        ->name('contact-messages.spam');
    Route::patch('contact-messages/{contactMessage}/resolved', [AdminContactMessageController::class, 'markAsResolved'])
        ->name('contact-messages.resolved');

});
