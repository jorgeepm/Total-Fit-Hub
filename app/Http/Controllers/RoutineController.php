<?php

namespace App\Http\Controllers;

use App\Models\Exercise;
use App\Models\Routine;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class RoutineController extends Controller
{
    /**
     * Muestra la lista de rutinas del usuario autenticado.
     */
    public function index()
    {
        $routines = Routine::where('id_usuario', Auth::id())
            ->withCount('exercises')
            ->latest()
            ->get(['id', 'nombre', 'estado', 'created_at']);

        return Inertia::render('Routines/Index', [
            'routines' => $routines,
        ]);
    }

    /**
     * Devuelve la vista de creación pasando TODOS los ejercicios disponibles.
     * Solo seleccionamos las columnas necesarias para optimizar el payload.
     */
    public function create()
    {
        try {
            $exercises = Exercise::forUser(Auth::id())
                ->orderByRaw('ISNULL(id_usuario) ASC')
                ->orderBy('nombre')
                ->get(['id', 'id_usuario', 'nombre', 'grupo_muscular', 'equipamiento_necesario', 'dificultad']);
        } catch (\Exception $e) {
            $exercises = Exercise::orderBy('nombre')
                ->get(['id', 'nombre', 'grupo_muscular', 'equipamiento_necesario'])
                ->map(fn($ex) => array_merge($ex->toArray(), ['id_usuario' => null, 'dificultad' => null]));
        }

        return Inertia::render('Routines/Create', [
            'exercises' => $exercises,
        ]);
    }

    /**
     * Guarda la nueva rutina y vincula los ejercicios en la tabla pivot
     * rutina_ejercicio con objetivo_series y objetivo_repeticiones.
     *
     * Payload esperado:
     * {
     *   "routineName": "Día de Empuje",
     *   "exercises": [
     *     { "id": 3, "sets": [{ "target_reps": 12 }, { "target_reps": 10 }] },
     *     { "id": 7, "sets": [{ "target_reps": 8 }] }
     *   ]
     * }
     */
    public function store(Request $request)
    {
        $request->validate([
            'routineName'             => ['required', 'string', 'max:255'],
            'exercises'               => ['required', 'array', 'min:1'],
            'exercises.*.id'          => ['required', 'integer', 'exists:ejercicios,id'],
            'exercises.*.sets'        => ['required', 'array', 'min:1'],
            'exercises.*.sets.*.target_reps' => ['required', 'integer', 'min:1', 'max:999'],
        ]);

        // 1. Crear la rutina asociada al usuario
        $routine = Routine::create([
            'id_usuario' => Auth::id(),
            'nombre'     => $request->routineName,
            'estado'     => 'activa',
        ]);

        // 2. Construir el array para sync() con los datos pivot
        //    Como un ejercicio puede tener VARIAS series, guardamos:
        //      - objetivo_series  = número total de series
        //      - objetivo_repeticiones = reps de la primera serie (o la moda)
        //    Si en el futuro necesitas series individuales, añade una tabla aparte.
        $syncData = [];
        foreach ($request->exercises as $exerciseData) {
            $sets       = $exerciseData['sets'];
            $totalSets  = count($sets);
            // Calculamos las reps objetivo como la media redondeada de todas las series
            $avgReps    = (int) round(array_sum(array_column($sets, 'target_reps')) / $totalSets);

            $syncData[$exerciseData['id']] = [
                'objetivo_series'        => $totalSets,
                'objetivo_repeticiones'  => $avgReps,
            ];
        }

        $routine->exercises()->sync($syncData);

        return redirect()
            ->route('routines.index')
            ->with('success', "¡Rutina \"{$routine->nombre}\" creada con éxito!");
    }
}
