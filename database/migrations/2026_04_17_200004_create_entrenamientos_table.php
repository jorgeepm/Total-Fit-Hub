<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('entrenamientos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_usuario')->constrained('usuarios')->onDelete('cascade');
            $table->foreignId('id_rutina')->constrained('rutinas')->onDelete('cascade');
            $table->timestamp('hora_inicio')->nullable();
            $table->timestamp('hora_fin')->nullable();
            $table->decimal('total_calorias_quemadas', 8, 2)->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('entrenamientos');
    }
};
