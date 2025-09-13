<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('programs', function (Blueprint $table) {
            $table->id();
            $table->string('code')->nullable();
            $table->enum('level', ['bachelor','master','ai_inservice','dual']);
            $table->string('website_url')->nullable();
            $table->string('name');
            $table->string('name_en');
            $table->longText('description')->nullable();
            $table->longText('description_en')->nullable();
            $table->boolean('visible')->default(true);
            $table->integer('sort_order')->default(0);
            $table->softDeletes();
            $table->timestamps();
        });

        Schema::create('courses', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->decimal('credit', 3, 1);
            $table->integer('hours')->nullable();
            $table->string('url')->nullable();
            $table->string('name');
            $table->string('name_en');
            $table->longText('description')->nullable();
            $table->longText('description_en')->nullable();
            $table->boolean('visible')->default(true);
            $table->softDeletes();
            $table->timestamps();
        });

        Schema::create('program_courses', function (Blueprint $table) {
            $table->foreignId('program_id')->constrained('programs')->cascadeOnDelete();
            $table->foreignId('course_id')->constrained('courses')->cascadeOnDelete();
            $table->unique(['program_id', 'course_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('program_courses');
        Schema::dropIfExists('courses');
        Schema::dropIfExists('programs');
    }
};

