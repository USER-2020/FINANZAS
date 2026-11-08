<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('financial_movements', function (Blueprint $table) {
            $table->string('merchant_name')->nullable()->after('concept');
            $table->string('invoice_number')->nullable()->after('merchant_name');
            $table->string('invoice_nit')->nullable()->after('invoice_number');
            $table->string('source_hash', 64)->nullable()->after('image_path');
            $table->text('ocr_raw_text')->nullable()->after('source_hash');
            $table->decimal('ocr_confidence', 5, 4)->nullable()->after('ocr_raw_text');
            $table->index(['user_id', 'source_hash']);
        });
    }

    public function down(): void
    {
        Schema::table('financial_movements', function (Blueprint $table) {
            $table->dropIndex('financial_movements_user_id_source_hash_index');
            $table->dropColumn(['merchant_name', 'invoice_number', 'invoice_nit', 'source_hash', 'ocr_raw_text', 'ocr_confidence']);
        });
    }
};
