<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Database\Eloquent\Relations\Relation;
use App\Models\Post;
use App\Models\Teacher;
use App\Models\Lab;
use App\Models\Project;
use App\Models\Publication;
use App\Models\Program;
use App\Models\Course;
use App\Models\Staff;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Relation::enforceMorphMap([
            'Post' => Post::class,
            'Teacher' => Teacher::class,
            'Lab' => Lab::class,
            'Project' => Project::class,
            'Publication' => Publication::class,
            'Program' => Program::class,
            'Course' => Course::class,
            'Staff' => Staff::class,
        ]);
    }
}
