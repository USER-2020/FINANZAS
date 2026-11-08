<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('personal_categories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('client_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('type')->default('Gasto');
            $table->string('color')->default('#34d399');
            $table->string('status')->default('Activo');
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->unique(['client_id', 'user_id', 'name']);
        });

        Schema::create('personal_budgets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('client_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('category_id')->nullable()->constrained('personal_categories')->nullOnDelete();
            $table->string('name');
            $table->decimal('amount', 15, 2);
            $table->string('period')->default('Mensual');
            $table->date('start_date');
            $table->date('end_date')->nullable();
            $table->string('status')->default('Activo');
            $table->timestamps();
        });

        Schema::create('savings_goals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('client_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->decimal('target_amount', 15, 2);
            $table->decimal('current_amount', 15, 2)->default(0);
            $table->date('target_date')->nullable();
            $table->string('status')->default('Activa');
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        Schema::create('recurring_transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('client_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('category_id')->nullable()->constrained('personal_categories')->nullOnDelete();
            $table->string('concept');
            $table->string('type')->default('Gasto');
            $table->decimal('amount', 15, 2);
            $table->string('frequency')->default('Mensual');
            $table->date('next_date');
            $table->string('account')->nullable();
            $table->string('status')->default('Activo');
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        Schema::table('financial_movements', function (Blueprint $table) {
            $table->foreignId('category_id')->nullable()->after('department_id')->constrained('personal_categories')->nullOnDelete();
            $table->string('account')->nullable()->after('payment_method');
        });
    }

    public function down(): void
    {
        Schema::table('financial_movements', fn (Blueprint $table) => $table->dropConstrainedForeignId('category_id'));
        Schema::dropIfExists('recurring_transactions');
        Schema::dropIfExists('savings_goals');
        Schema::dropIfExists('personal_budgets');
        Schema::dropIfExists('personal_categories');
    }
};
