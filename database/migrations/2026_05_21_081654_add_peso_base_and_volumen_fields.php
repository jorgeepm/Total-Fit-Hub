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
        Schema::table('ejercicios', function (Blueprint $table) {
            $table->decimal('peso_base', 8, 2)->nullable()->default(0)->after('equipamiento_necesario');
        });

        Schema::table('entrenamientos', function (Blueprint $table) {
            $table->decimal('volumen_total', 10, 2)->nullable()->after('hora_fin');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('entrenamientos', function (Blueprint $table) {
            $table->dropColumn('volumen_total');
        });

        Schema::table('ejercicios', function (Blueprint $table) {
            $table->dropColumn('peso_base');
        });
    }
};
