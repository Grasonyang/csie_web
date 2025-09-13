<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('publications', function (Blueprint $table) {
            $table->id();
            $table->integer('year');
            $table->enum('type', ['journal','conference','book','other']);
            $table->string('venue')->nullable();
            $table->string('doi')->nullable();
            $table->string('url')->nullable();
            $table->string('title');
            $table->string('title_en');
            $table->text('authors_text');
            $table->text('authors_text_en');
            $table->longText('abstract')->nullable();
            $table->longText('abstract_en')->nullable();
            $table->boolean('visible')->default(true);
            $table->softDeletes();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('publications');
    }
};

