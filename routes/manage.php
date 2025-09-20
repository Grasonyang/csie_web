<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// 管理後台控制器
use App\Http\Controllers\Manage\Admin\StaffController as AdminStaffController;
use App\Http\Controllers\Manage\Admin\LabController as AdminLabController;
use App\Http\Controllers\Manage\Admin\TeacherController as AdminTeacherController;
use App\Http\Controllers\Manage\Admin\UserController as AdminUserController;
use App\Http\Controllers\Manage\Admin\PostController as AdminPostController;
use App\Http\Controllers\Manage\Admin\PostCategoryController as AdminPostCategoryController;
use App\Http\Controllers\Manage\Admin\CourseController as AdminCourseController;
use App\Http\Controllers\Manage\Admin\ProgramController as AdminProgramController;
use App\Http\Controllers\Manage\Admin\AcademicController as AdminAcademicController;
use App\Http\Controllers\Manage\Admin\ProjectController as AdminProjectController;
use App\Http\Controllers\Manage\Admin\PublicationController as AdminPublicationController;
use App\Http\Controllers\Manage\Admin\ContactMessageController as AdminContactMessageController;
use App\Http\Controllers\Manage\Admin\AttachmentController as AdminAttachmentController;

// Route::middleware(['auth', 'verified'])
//     ->prefix('manage')
Route::prefix('manage')->name('manage.')
    ->group(function () {
        Route::get('/', function () {
            return redirect()->route('manage.dashboard');
        });

        Route::get('/dashboard', function () {
            return Inertia::render('manage/dashboard');
        })->name('dashboard');

        Route::middleware('manage.role:admin')
            ->prefix('admin')
            ->name('admin.')
            ->group(function () {
                Route::get('/', function () {
                    return redirect()->route('manage.admin.dashboard');
                });

                Route::get('/dashboard', function () {
                    return Inertia::render('manage/admin/dashboard');
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

        Route::middleware('manage.role:teacher')
            ->prefix('teacher')
            ->name('teacher.')
            ->group(function () {
                // 預留教師管理路由
            });

        Route::middleware('manage.role:user')
            ->prefix('user')
            ->name('user.')
            ->group(function () {
                // 預留使用者管理路由
            });
    });
