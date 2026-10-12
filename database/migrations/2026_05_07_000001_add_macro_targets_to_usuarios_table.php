<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('usuarios', function (Blueprint $table) {
            // Agregar objetivos de macronutrientes personalizables
            $table->integer('target_proteins')->nullable()->default(150)->after('calorias_diarias');
            $table->integer('target_carbs')->nullable()->default(250)->after('target_proteins');
            $table->integer('target_fats')->nullable()->default(70)->after('target_carbs');
        });
    }

    public function down(): void
    {
        Schema::table('usuarios', function (Blueprint $table) {
            $table->dropColumn(['target_proteins', 'target_carbs', 'target_fats']);
        });
    }
};
