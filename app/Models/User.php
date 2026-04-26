<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

#[Fillable(['nombre_usuario', 'email', 'contrasenia', 'rol', 'peso', 'altura', 'peso_objetivo', 'calorias_diarias'])]
#[Hidden(['contrasenia', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    protected $table = 'usuarios';

    public function getAuthPassword()
    {
        return $this->contrasenia;
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'contrasenia' => 'hashed',
        ];
    }

    public function rutinas()
    {
        return $this->hasMany(Rutina::class, 'id_usuario');
    }

    public function entrenamientos()
    {
        return $this->hasMany(Entrenamiento::class, 'id_usuario');
    }

    public function entradasComidas()
    {
        return $this->hasMany(EntradaComida::class, 'id_usuario');
    }
}
