<?php

namespace Database\Seeders;

use App\Models\Exercise;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ExerciseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the database with sample exercises.
     */
    public function run(): void
    {
        $exercises = [
            // Pecho
            [
                'nombre' => 'Press de Banca',
                'grupo_muscular' => 'pecho',
                'equipamiento_necesario' => 'banca',
                'calorias_minuto' => 8,
                'id_usuario' => null,
            ],
            [
                'nombre' => 'Flexiones',
                'grupo_muscular' => 'pecho',
                'equipamiento_necesario' => 'peso corporal',
                'calorias_minuto' => 6,
                'id_usuario' => null,
            ],
            [
                'nombre' => 'Aperturas con Mancuernas',
                'grupo_muscular' => 'pecho',
                'equipamiento_necesario' => 'mancuernas',
                'calorias_minuto' => 5,
                'id_usuario' => null,
            ],
            // Espalda
            [
                'nombre' => 'Dominadas',
                'grupo_muscular' => 'espalda',
                'equipamiento_necesario' => 'barra',
                'calorias_minuto' => 8,
                'id_usuario' => null,
            ],
            [
                'nombre' => 'Remo con Barra',
                'grupo_muscular' => 'espalda',
                'equipamiento_necesario' => 'barra',
                'calorias_minuto' => 7,
                'id_usuario' => null,
            ],
            [
                'nombre' => 'Remo Sentado',
                'grupo_muscular' => 'espalda',
                'equipamiento_necesario' => 'máquina',
                'calorias_minuto' => 6,
                'id_usuario' => null,
            ],
            // Hombros
            [
                'nombre' => 'Press Militar',
                'grupo_muscular' => 'hombros',
                'equipamiento_necesario' => 'mancuernas',
                'calorias_minuto' => 7,
                'id_usuario' => null,
            ],
            [
                'nombre' => 'Elevaciones Laterales',
                'grupo_muscular' => 'hombros',
                'equipamiento_necesario' => 'mancuernas',
                'calorias_minuto' => 5,
                'id_usuario' => null,
            ],
            [
                'nombre' => 'Pájaros en Máquina',
                'grupo_muscular' => 'hombros',
                'equipamiento_necesario' => 'máquina',
                'calorias_minuto' => 4,
                'id_usuario' => null,
            ],
            // Bíceps
            [
                'nombre' => 'Curl de Bíceps con Barra',
                'grupo_muscular' => 'bíceps',
                'equipamiento_necesario' => 'barra',
                'calorias_minuto' => 5,
                'id_usuario' => null,
            ],
            [
                'nombre' => 'Curl de Bíceps con Mancuernas',
                'grupo_muscular' => 'bíceps',
                'equipamiento_necesario' => 'mancuernas',
                'calorias_minuto' => 5,
                'id_usuario' => null,
            ],
            [
                'nombre' => 'Curl Predicador',
                'grupo_muscular' => 'bíceps',
                'equipamiento_necesario' => 'banca',
                'calorias_minuto' => 4,
                'id_usuario' => null,
            ],
            // Tríceps
            [
                'nombre' => 'Fondos en Barra',
                'grupo_muscular' => 'tríceps',
                'equipamiento_necesario' => 'barra',
                'calorias_minuto' => 6,
                'id_usuario' => null,
            ],
            [
                'nombre' => 'Extensión de Tríceps',
                'grupo_muscular' => 'tríceps',
                'equipamiento_necesario' => 'mancuernas',
                'calorias_minuto' => 5,
                'id_usuario' => null,
            ],
            [
                'nombre' => 'Press Francés',
                'grupo_muscular' => 'tríceps',
                'equipamiento_necesario' => 'barra',
                'calorias_minuto' => 5,
                'id_usuario' => null,
            ],
            // Piernas
            [
                'nombre' => 'Sentadillas',
                'grupo_muscular' => 'piernas',
                'equipamiento_necesario' => 'peso corporal',
                'calorias_minuto' => 9,
                'id_usuario' => null,
            ],
            [
                'nombre' => 'Prensa de Piernas',
                'grupo_muscular' => 'piernas',
                'equipamiento_necesario' => 'máquina',
                'calorias_minuto' => 8,
                'id_usuario' => null,
            ],
            [
                'nombre' => 'Extensión de Cuádriceps',
                'grupo_muscular' => 'piernas',
                'equipamiento_necesario' => 'máquina',
                'calorias_minuto' => 5,
                'id_usuario' => null,
            ],
            [
                'nombre' => 'Curl de Bíceps Femoral',
                'grupo_muscular' => 'piernas',
                'equipamiento_necesario' => 'máquina',
                'calorias_minuto' => 5,
                'id_usuario' => null,
            ],
            // Glúteos
            [
                'nombre' => 'Hip Thrust',
                'grupo_muscular' => 'glúteos',
                'equipamiento_necesario' => 'banca',
                'calorias_minuto' => 8,
                'id_usuario' => null,
            ],
            [
                'nombre' => 'Patadas de Glúteos',
                'grupo_muscular' => 'glúteos',
                'equipamiento_necesario' => 'cable',
                'calorias_minuto' => 5,
                'id_usuario' => null,
            ],
            // Abdominales
            [
                'nombre' => 'Crunch',
                'grupo_muscular' => 'abdominales',
                'equipamiento_necesario' => 'peso corporal',
                'calorias_minuto' => 4,
                'id_usuario' => null,
            ],
            [
                'nombre' => 'Abdominales en Máquina',
                'grupo_muscular' => 'abdominales',
                'equipamiento_necesario' => 'máquina',
                'calorias_minuto' => 4,
                'id_usuario' => null,
            ],
            [
                'nombre' => 'Plancha',
                'grupo_muscular' => 'abdominales',
                'equipamiento_necesario' => 'peso corporal',
                'calorias_minuto' => 5,
                'id_usuario' => null,
            ],
        ];

        foreach ($exercises as $exercise) {
            Exercise::create($exercise);
        }
    }
}
