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
        Schema::rename('food_logs', 'diario_comidas');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::rename('diario_comidas', 'food_logs');
    }
};
