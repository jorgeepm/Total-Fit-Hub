<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Exercise extends Model
{
    protected $table = 'ejercicios';

    protected $fillable = [
        'id_usuario',
        'nombre',
        'grupo_muscular',
        'equipamiento_necesario',
        'calorias_minuto',
        'descripcion',
        'dificultad',
        // Campos heredados de importación API
        'description',
        'difficulty',
        'equipment',
        'muscle_group',
        'name',
    ];

    /**
     * Scope: devuelve ejercicios globales (id_usuario IS NULL) + los del usuario dado.
     */
    public function scopeForUser($query, int $userId)
    {
        return $query->where(function ($q) use ($userId) {
            $q->whereNull('id_usuario')
              ->orWhere('id_usuario', $userId);
        });
    }

    /**
     * Relación inversa ManyToMany con Routine.
     */
    public function routines()
    {
        return $this->belongsToMany(
            Routine::class,
            'rutina_ejercicio',
            'id_ejercicio',
            'id_rutina'
        )->withPivot('objetivo_series', 'objetivo_repeticiones')->withTimestamps();
    }

    /**
     * Relación con el usuario propietario (nullable).
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'id_usuario');
    }
}
