<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('comida', function (Blueprint $table) {
            $table->id();
            $table->string('id_api')->nullable();
            $table->string('nombre');
            $table->decimal('calorias_100g', 8, 2);
            $table->decimal('proteina_100g', 8, 2);
            $table->decimal('carbs_100g', 8, 2);
            $table->decimal('grasas_100g', 8, 2);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('comida');
    }
};
