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
            'nombre_usuario' => 'admin',
            'email' => 'admin@admin.com',
            'contrasenia' => bcrypt('password'),
            'rol' => 'admin',
        ]);

        // Seed exercises
        $this->call(ExerciseSeeder::class);
    }
}
