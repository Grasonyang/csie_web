<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Admin Controllers
use App\Http\Controllers\Admin\StaffController as AdminStaffController;
use App\Http\Controllers\Admin\LabController as AdminLabController;
use App\Http\Controllers\Admin\TeacherController as AdminTeacherController;
use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\Admin\PostController as AdminPostController;
use App\Http\Controllers\Admin\PostCategoryController as AdminPostCategoryController;
use App\Http\Controllers\Admin\CourseController as AdminCourseController;
use App\Http\Controllers\Admin\ProgramController as AdminProgramController;
use App\Http\Controllers\Admin\AcademicController as AdminAcademicController;
use App\Http\Controllers\Admin\ProjectController as AdminProjectController;
use App\Http\Controllers\Admin\PublicationController as AdminPublicationController;
use App\Http\Controllers\Admin\ContactMessageController as AdminContactMessageController;
use App\Http\Controllers\Admin\AttachmentController as AdminAttachmentController;

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

    // 使用者與系所成員管理
    Route::resource('users', AdminUserController::class);
    Route::post('users/{user}/restore', [AdminUserController::class, 'restore'])
        ->name('users.restore');
    Route::resource('staff', AdminStaffController::class);
    Route::patch('staff/{staff}/restore', [AdminStaffController::class, 'restore'])
        ->name('staff.restore');
    Route::delete('staff/{staff}/force', [AdminStaffController::class, 'forceDelete'])
        ->name('staff.force-delete');
    Route::resource('teachers', AdminTeacherController::class);

    // 學術研究管理
    Route::resource('labs', AdminLabController::class);
    Route::resource('projects', AdminProjectController::class);
    Route::resource('publications', AdminPublicationController::class);

    // 課程修業管理
    Route::get('academics', [AdminAcademicController::class, 'index'])->name('academics.index');
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

    // 附件管理
    Route::resource('attachments', AdminAttachmentController::class)->only(['index', 'destroy']);
    Route::patch('attachments/{attachment}/restore', [AdminAttachmentController::class, 'restore'])
        ->name('attachments.restore');
    Route::delete('attachments/{attachment}/force', [AdminAttachmentController::class, 'forceDelete'])
        ->name('attachments.force-delete');

});
