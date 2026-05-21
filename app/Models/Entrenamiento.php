<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable(['id_usuario', 'id_rutina', 'hora_inicio', 'hora_fin', 'total_calorias_quemadas', 'volumen_total'])]
class Entrenamiento extends Model
{
    protected $table = 'entrenamientos';

    protected $primaryKey = 'id';

    protected function casts(): array
    {
        return [
            'hora_inicio' => 'datetime',
            'hora_fin' => 'datetime',
            'total_calorias_quemadas' => 'decimal:2',
            'volumen_total' => 'decimal:2',
        ];
    }

    /**
     * Get the user that owns this workout.
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'id_usuario');
    }

    /**
     * Get the routine associated with this workout.
     */
    public function routine()
    {
        return $this->belongsTo(Routine::class, 'id_rutina');
    }

    /**
     * Get the exercises associated with this workout.
     */
    public function ejercicios()
    {
        return $this->belongsToMany(Exercise::class, 'entrenamiento_ejercicios', 'id_entrenamiento', 'id_ejercicio')
                    ->withPivot('numero_series', 'repeticiones_hechas', 'peso_usado');
    }
}
