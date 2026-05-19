<?php

namespace App\Http\Controllers;

use App\Models\Entrenamiento;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TrainingController extends Controller
{
    /**
     * Store a newly created training session in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'id_rutina' => 'required|exists:rutinas,id',
            'hora_inicio' => 'required',
            'hora_fin' => 'required',
            'ejercicios' => 'required|array',
            'ejercicios.*.dbId' => 'required|exists:ejercicios,id',
            'ejercicios.*.series' => 'required|array',
        ]);

        // Verificar que la rutina pertenece al usuario autenticado
        $rutina = \App\Models\Routine::where('id', $request->id_rutina)
            ->where('id_usuario', auth()->id())
            ->firstOrFail();

        try {
            DB::beginTransaction();

            // 1. Crear el registro principal del entrenamiento
            $entrenamiento = Entrenamiento::create([
                'id_usuario' => auth()->id(),
                'id_rutina' => $request->id_rutina,
                'hora_inicio' => $request->hora_inicio,
                'hora_fin' => $request->hora_fin,
                'total_calorias_quemadas' => $this->calculateVolume($request->ejercicios), // Usaremos volumen como calorías por ahora
            ]);

            // 2. Guardar cada serie de cada ejercicio
            foreach ($request->ejercicios as $ejercicio) {
                foreach ($ejercicio['series'] as $index => $serie) {
                    if ($serie['completado']) {
                        DB::table('entrenamiento_ejercicios')->insert([
                            'id_entrenamiento' => $entrenamiento->id,
                            'id_ejercicio' => $ejercicio['dbId'],
                            'numero_series' => $index + 1,
                            'repeticiones_hechas' => $serie['repeticiones'],
                            'peso_usado' => $serie['peso'],
                            'created_at' => now(),
                            'updated_at' => now(),
                        ]);
                    }
                }
            }

            DB::commit();

            return redirect()->route('dashboard')->with('success', '¡Entrenamiento guardado con éxito!');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'No se pudo guardar el entrenamiento: ' . $e->getMessage()]);
        }
    }

    /**
     * Cálculo simple del volumen total (peso * reps)
     */
    private function calculateVolume($ejercicios)
    {
        $totalVolume = 0;
        foreach ($ejercicios as $ejercicio) {
            foreach ($ejercicio['series'] as $serie) {
                if ($serie['completado']) {
                    $totalVolume += ($serie['peso'] * $serie['repeticiones']);
                }
            }
        }
        return $totalVolume;
    }
}
