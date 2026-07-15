<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('clients', function (Blueprint $table) {
            if (Schema::hasColumn('clients', 'contact_name') && ! Schema::hasColumn('clients', 'contact_phone')) {
                $table->renameColumn('contact_name', 'contact_phone');
            }
        });
    }

    public function down(): void
    {
        Schema::table('clients', function (Blueprint $table) {
            if (Schema::hasColumn('clients', 'contact_phone') && ! Schema::hasColumn('clients', 'contact_name')) {
                $table->renameColumn('contact_phone', 'contact_name');
            }
        });
    }
};
