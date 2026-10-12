<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

#[Fillable(['nombre_usuario', 'email', 'contrasenia', 'password', 'rol', 'peso', 'altura', 'peso_objetivo', 'calorias_diarias', 'genero', 'edad', 'nivel_actividad', 'target_proteins', 'target_carbs', 'target_fats', 'onboarding_completed'])]
#[Hidden(['contrasenia', 'password', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    protected $table = 'usuarios';

    protected static function booted(): void
    {
        static::deleting(function (User $user) {
            $user->foodLogs()->delete();
            $user->weightLogs()->delete();
            $user->waterLogs()->delete();
            $user->resistanceBands()->delete();
            $user->errorReports()->delete();
            $user->entrenamientos()->delete();
            $user->rutinas()->delete();
            $user->customExercises()->delete();
        });
    }

    public function getAuthPassword()
    {
        return $this->contrasenia;
    }

    public function getAuthPasswordName()
    {
        return 'contrasenia';
    }

    /**
     * Mutador de compatibilidad para código que asigne 'password'
     */
    public function setPasswordAttribute($value): void
    {
        $this->attributes['contrasenia'] = $value;
    }

    /**
     * Accesor de compatibilidad para código que acceda a 'password'
     */
    public function getPasswordAttribute()
    {
        return $this->attributes['contrasenia'] ?? null;
    }

    /**
     * Obtiene los atributos que deben ser transformados.
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
        return $this->hasMany(Routine::class, 'id_usuario');
    }

    public function entrenamientos()
    {
        return $this->hasMany(Entrenamiento::class, 'id_usuario');
    }

    public function foodLogs()
    {
        return $this->hasMany(FoodLog::class, 'user_id');
    }

    public function weightLogs()
    {
        return $this->hasMany(WeightLog::class, 'user_id');
    }

    public function resistanceBands()
    {
        return $this->hasMany(ResistanceBand::class, 'user_id');
    }

    public function waterLogs()
    {
        return $this->hasMany(WaterLog::class, 'user_id');
    }

    public function errorReports()
    {
        return $this->hasMany(ErrorReport::class, 'user_id');
    }

    public function customExercises()
    {
        return $this->hasMany(Exercise::class, 'id_usuario');
    }
}
