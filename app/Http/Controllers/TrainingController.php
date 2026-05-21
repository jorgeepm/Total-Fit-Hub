<?php

namespace App\Http\Controllers;

use App\Models\Entrenamiento;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

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

            $horaInicio = \Carbon\Carbon::parse($request->hora_inicio);
            $horaFin = \Carbon\Carbon::parse($request->hora_fin);
            $duracionMinutos = $horaFin->diffInMinutes($horaInicio) ?: 1; // Mínimo 1 minuto
            
            // Recuperar ejercicios de la base de datos para obtener peso_base y calorias_minuto
            $ejercicioIds = collect($request->ejercicios)->pluck('dbId')->unique();
            $ejerciciosDb = \App\Models\Exercise::whereIn('id', $ejercicioIds)->get()->keyBy('id');

            $volumenTotal = 0;
            $ejerciciosRealizadosCount = 0;
            $caloriasPorMinutoSuma = 0;

            foreach ($request->ejercicios as $ej) {
                $dbEx = $ejerciciosDb->get($ej['dbId']);
                $pesoBase = $dbEx ? (float) $dbEx->peso_base : 0;
                $calsMin = $dbEx ? (float) $dbEx->calorias_minuto : 0;
                
                $seriesCompletadas = 0;
                foreach ($ej['series'] as $serie) {
                    if (!empty($serie['completado'])) {
                        $peso = (float) ($serie['peso'] ?: 0);
                        $reps = (int) ($serie['repeticiones'] ?: 0);
                        $volumenTotal += (($peso + $pesoBase) * $reps);
                        $seriesCompletadas++;
                    }
                }
                
                if ($seriesCompletadas > 0) {
                    $caloriasPorMinutoSuma += $calsMin;
                    $ejerciciosRealizadosCount++;
                }
            }
            
            // Calculamos calorías aproximadas
            $avgCaloriasMin = $ejerciciosRealizadosCount > 0 ? ($caloriasPorMinutoSuma / $ejerciciosRealizadosCount) : 0;
            $caloriasQuemadas = $duracionMinutos * $avgCaloriasMin;

            // 1. Crear el registro principal del entrenamiento
            $entrenamiento = Entrenamiento::create([
                'id_usuario' => auth()->id(),
                'id_rutina' => $request->id_rutina,
                'hora_inicio' => $request->hora_inicio,
                'hora_fin' => $request->hora_fin,
                'total_calorias_quemadas' => $caloriasQuemadas,
                'volumen_total' => $volumenTotal,
            ]);

            // 2. Guardar cada serie de cada ejercicio
            foreach ($request->ejercicios as $ejercicio) {
                foreach ($ejercicio['series'] as $index => $serie) {
                    if ($serie['completado']) {
                        DB::table('entrenamiento_ejercicios')->insert([
                            'id_entrenamiento' => $entrenamiento->id,
                            'id_ejercicio' => $ejercicio['dbId'],
                            'numero_series' => $index + 1,
                            'repeticiones_hechas' => (int) ($serie['repeticiones'] ?: 0),
                            'peso_usado' => (float) ($serie['peso'] ?: 0),
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
     * Display a listing of the user's past training sessions.
     */
    public function history()
    {
        $entrenamientos = auth()->user()->entrenamientos()
            ->with(['routine', 'ejercicios'])
            ->orderBy('hora_inicio', 'desc')
            ->get();

        return Inertia::render('Trainings/History', [
            'entrenamientos' => $entrenamientos
        ]);
    }

    /**
     * Remove the specified training session from storage.
     */
    public function destroy($id)
    {
        $entrenamiento = Entrenamiento::where('id', $id)
            ->where('id_usuario', auth()->id())
            ->firstOrFail();

        $entrenamiento->delete();

        return back()->with('success', 'Entrenamiento eliminado con éxito.');
    }
}
