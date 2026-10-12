<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('entrenamiento_ejercicios', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_entrenamiento')->constrained('entrenamientos')->onDelete('cascade');
            $table->foreignId('id_ejercicio')->constrained('ejercicios')->onDelete('cascade');
            $table->integer('numero_series');
            $table->integer('repeticiones_hechas');
            $table->decimal('peso_usado', 8, 2);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('entrenamiento_ejercicios');
    }
};
