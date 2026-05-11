<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use App\Models\Exercise;

class FetchExercises extends Command
{
    /**
     * Execute the console command.
     */
    protected $signature = 'exercises:fetch';
    protected $description = 'Descarga la base de datos de ejercicios desde ExerciseDB (RapidAPI)';

    public function handle()
    {
        $this->info('Iniciando descarga de ejercicios desde Wger...');

        $response = Http::withHeaders([
            'Authorization' => 'Token de9113cf72a14ee3cc3d92fb73b6702ab0c1ddeb',
            'Accept' => 'application/json',
        ])->get('https://wger.de/api/v2/exerciseinfo/?language=2&limit=300'); // Usamos language=2 (Inglés) para asegurar nombres

        if ($response->successful()) {
            $data = $response->json();
            $exercises = $data['results'] ?? [];

            $bar = $this->output->createProgressBar(count($exercises));
            $bar->start();

            foreach ($exercises as $ex) {
                // Si el ejercicio no tiene nombre, saltamos al siguiente
                if (empty($ex['name'])) {
                    $bar->advance();
                    continue;
                }

                $equipmentName = !empty($ex['equipment']) ? $ex['equipment'][0]['name'] : 'Varios';

                Exercise::updateOrCreate(
                    ['nombre' => $ex['name']],
                    [
                        'grupo_muscular' => $ex['category']['name'] ?? 'General',
                        'equipamiento_necesario' => $equipmentName,
                        'calorias_minuto' => 5.00,
                    ]
                );
                $bar->advance();
            }

            $bar->finish();
            $this->info("\n¡Éxito! Base de datos actualizada. 🏋️‍♂️");
        } else {
            $this->error('Error al contactar con la API. Código: ' . $response->status());
        }
    }
}