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
        Schema::table('usuarios', function (Blueprint $table) {
            $table->boolean('onboarding_completed')->default(false)->after('target_fats');
        });
    }

    /**
     * Revertir las migraciones.
     */
    public function down(): void
    {
        Schema::table('usuarios', function (Blueprint $table) {
            $table->dropColumn('onboarding_completed');
        });
    }
};
