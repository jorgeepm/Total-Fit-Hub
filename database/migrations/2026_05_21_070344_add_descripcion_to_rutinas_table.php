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
        if (!Schema::hasColumn('rutinas', 'descripcion')) {
            Schema::table('rutinas', function (Blueprint $table) {
                $table->text('descripcion')->nullable()->after('nombre');
            });
        }
    }

    /**
     * Revertir las migraciones.
     */
    public function down(): void
    {
        if (Schema::hasColumn('rutinas', 'descripcion')) {
            Schema::table('rutinas', function (Blueprint $table) {
                $table->dropColumn('descripcion');
            });
        }
    }
};
