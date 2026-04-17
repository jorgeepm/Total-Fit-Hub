<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('entrada_comidas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_usuario')->constrained('usuarios')->onDelete('cascade');
            $table->foreignId('id_comida')->constrained('comida')->onDelete('cascade');
            $table->dateTime('fechaHora_consumo');
            $table->string('tipo_comida');
            $table->decimal('cantidad_g', 8, 2);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('entrada_comidas');
    }
};
