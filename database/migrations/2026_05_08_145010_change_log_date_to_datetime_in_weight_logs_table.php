<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Ejecutar las migraciones.
     */
    public function up(): void
    {
        Schema::table('weight_logs', function (Blueprint $table) {
            $table->dateTime('log_date')->change();
        });
    }

    /**
     * Revertir las migraciones.
     */
    public function down(): void
    {
        Schema::table('weight_logs', function (Blueprint $table) {
            $table->date('log_date')->change();
        });
    }
};
