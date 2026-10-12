<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Solo agregar campos si no existen
        Schema::table('ejercicios', function (Blueprint $table) {
            // FK nullable: NULL = ejercicio global (API), valor = ejercicio del usuario
            if (!Schema::hasColumn('ejercicios', 'id_usuario')) {
                $table->unsignedBigInteger('id_usuario')->nullable()->after('id');
                $table->foreign('id_usuario')->references('id')->on('usuarios')->onDelete('cascade');
            }

            // Campos extra para ejercicios de usuario
            if (!Schema::hasColumn('ejercicios', 'descripcion')) {
                $table->text('descripcion')->nullable()->after('calorias_minuto');
            }
            if (!Schema::hasColumn('ejercicios', 'dificultad')) {
                $table->string('dificultad')->nullable()->after('descripcion'); // Principiante / Intermedio / Avanzado
            }
        });
    }

    public function down(): void
    {
        Schema::table('ejercicios', function (Blueprint $table) {
            try { $table->dropForeign(['id_usuario']); } catch (\Exception $e) {}
            $table->dropColumn(array_filter(
                ['id_usuario', 'descripcion', 'dificultad'],
                fn($col) => Schema::hasColumn('ejercicios', $col)
            ));
        });
    }
};
