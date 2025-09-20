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
        Schema::create('audit_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('actor_id')->constrained('users')->onDelete('cascade');
            $table->string('action'); // e.g., 'restore_user', 'delete_user', etc.
            $table->string('target_type'); // e.g., 'App\\Models\\User'
            $table->unsignedBigInteger('target_id'); // ID of the target model
            $table->json('metadata')->nullable(); // Additional data
            $table->text('reason')->nullable(); // Optional reason
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('audit_logs');
    }
};
