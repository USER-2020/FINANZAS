<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('clients', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('contact_phone')->nullable();
            $table->string('contact_email')->nullable();
            $table->string('status')->default('Activo');
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        Schema::table('users', function (Blueprint $table) {
            $table->foreignId('client_id')->nullable()->after('id')->constrained()->nullOnDelete();
        });

        Schema::table('departments', function (Blueprint $table) {
            $table->foreignId('client_id')->nullable()->after('id')->constrained()->cascadeOnDelete();
        });

        Schema::table('financial_movements', function (Blueprint $table) {
            $table->foreignId('client_id')->nullable()->after('id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->after('client_id')->constrained()->nullOnDelete();
        });

        Schema::table('purchases', function (Blueprint $table) {
            $table->foreignId('client_id')->nullable()->after('id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->after('client_id')->constrained()->nullOnDelete();
        });

        Schema::table('inventory_items', function (Blueprint $table) {
            $table->foreignId('client_id')->nullable()->after('id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->after('client_id')->constrained()->nullOnDelete();
        });

        Schema::table('reports', function (Blueprint $table) {
            $table->foreignId('client_id')->nullable()->after('id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->after('client_id')->constrained()->nullOnDelete();
        });

        $now = now();
        $defaultClientId = DB::table('clients')->insertGetId([
            'name' => 'Cliente Principal',
            'slug' => 'cliente-principal',
            'status' => 'Activo',
            'created_at' => $now,
            'updated_at' => $now,
        ]);

        DB::table('users')->update(['client_id' => $defaultClientId]);
        DB::table('departments')->update(['client_id' => $defaultClientId]);
        DB::table('financial_movements')->update(['client_id' => $defaultClientId]);
        DB::table('purchases')->update(['client_id' => $defaultClientId]);
        DB::table('inventory_items')->update(['client_id' => $defaultClientId]);
        DB::table('reports')->update(['client_id' => $defaultClientId]);
    }

    public function down(): void
    {
        Schema::table('reports', function (Blueprint $table) {
            $table->dropConstrainedForeignId('user_id');
            $table->dropConstrainedForeignId('client_id');
        });

        Schema::table('inventory_items', function (Blueprint $table) {
            $table->dropConstrainedForeignId('user_id');
            $table->dropConstrainedForeignId('client_id');
        });

        Schema::table('purchases', function (Blueprint $table) {
            $table->dropConstrainedForeignId('user_id');
            $table->dropConstrainedForeignId('client_id');
        });

        Schema::table('financial_movements', function (Blueprint $table) {
            $table->dropConstrainedForeignId('user_id');
            $table->dropConstrainedForeignId('client_id');
        });

        Schema::table('departments', function (Blueprint $table) {
            $table->dropConstrainedForeignId('client_id');
        });

        Schema::table('users', function (Blueprint $table) {
            $table->dropConstrainedForeignId('client_id');
        });

        Schema::dropIfExists('clients');
    }
};
