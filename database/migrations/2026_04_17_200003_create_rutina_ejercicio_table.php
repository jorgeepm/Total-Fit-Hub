<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('rutina_ejercicio', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_rutina')->constrained('rutinas')->onDelete('cascade');
            $table->foreignId('id_ejercicio')->constrained('ejercicios')->onDelete('cascade');
            $table->integer('objetivo_series');
            $table->integer('objetivo_repeticiones');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rutina_ejercicio');
    }
};
