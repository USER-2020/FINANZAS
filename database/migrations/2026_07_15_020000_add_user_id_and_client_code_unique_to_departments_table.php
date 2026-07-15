<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('departments', function (Blueprint $table) {
            $table->dropUnique('departments_code_unique');
            $table->foreignId('user_id')->nullable()->after('client_id')->constrained()->nullOnDelete();
            $table->unique(['client_id', 'code']);
        });
    }

    public function down(): void
    {
        Schema::table('departments', function (Blueprint $table) {
            $table->dropUnique(['client_id', 'code']);
            $table->dropConstrainedForeignId('user_id');
            $table->unique('code');
        });
    }
};
