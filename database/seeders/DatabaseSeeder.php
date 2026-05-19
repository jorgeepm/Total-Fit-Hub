<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::create([
            'nombre_usuario'       => 'admin',
            'email'                => 'admin@admin.com',
            'contrasenia'          => bcrypt('password'),
            'rol'                  => 'admin',
            'onboarding_completed' => true,
            'peso'                 => 80,
            'altura'               => 180,
            'peso_objetivo'        => 75,
            'calorias_diarias'     => 2500,
            'target_proteins'      => 150,
            'target_carbs'         => 250,
            'target_fats'          => 70,
        ]);

        // Usuario estándar de prueba (para QA sin bloqueo de onboarding)
        User::create([
            'nombre_usuario'       => 'QA Test',
            'email'                => 'qa@test.com',
            'contrasenia'          => bcrypt('password'),
            'rol'                  => 'estandar',
            'onboarding_completed' => true,
            'peso'                 => 75,
            'altura'               => 175,
            'peso_objetivo'        => 70,
            'calorias_diarias'     => 2200,
            'target_proteins'      => 140,
            'target_carbs'         => 220,
            'target_fats'          => 65,
        ]);

        // Seed exercises
        $this->call(ExerciseSeeder::class);
    }
}
