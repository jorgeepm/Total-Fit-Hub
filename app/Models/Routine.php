<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Routine extends Model
{
    protected $table = 'rutinas';

    protected $fillable = ['id_usuario', 'nombre', 'estado'];

    public function user()
    {
        return $this->belongsTo(User::class, 'id_usuario');
    }

    /**
     * Relación ManyToMany con ejercicios a través de la tabla pivot rutina_ejercicio.
     * Las columnas pivot son: objetivo_series y objetivo_repeticiones.
     */
    public function exercises()
    {
        return $this->belongsToMany(
            Exercise::class,
            'rutina_ejercicio',   // tabla pivot real
            'id_rutina',          // FK de esta tabla en el pivot
            'id_ejercicio'        // FK de Exercise en el pivot
        )->withPivot('objetivo_series', 'objetivo_repeticiones')->withTimestamps();
    }

    public function entrenamientos()
    {
        return $this->hasMany(Entrenamiento::class, 'id_rutina');
    }
}
