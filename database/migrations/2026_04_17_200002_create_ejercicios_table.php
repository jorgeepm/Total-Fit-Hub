<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ejercicios', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');
            $table->string('grupo_muscular');
            $table->string('equipamiento_necesario');
            $table->decimal('calorias_minuto', 8, 2);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ejercicios');
    }
};
