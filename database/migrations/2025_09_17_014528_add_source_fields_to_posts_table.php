<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('posts', function (Blueprint $table) {
            $table->enum('source_type', ['manual', 'link'])
                ->default('manual')
                ->after('status')
                ->index();
            $table->string('source_url')
                ->nullable()
                ->after('source_type');
            $table->longText('fetched_html')
                ->nullable()
                ->after('content_en');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('posts', function (Blueprint $table) {
            $table->dropColumn(['source_type', 'source_url', 'fetched_html']);
        });
    }
};
