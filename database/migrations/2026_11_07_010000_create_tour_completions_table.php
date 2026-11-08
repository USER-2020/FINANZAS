<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tour_completions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('tour_key', 100);
            $table->string('version', 100);
            $table->timestamp('completed_at');
            $table->timestamps();
            $table->unique(['user_id', 'tour_key', 'version']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tour_completions');
    }
};
