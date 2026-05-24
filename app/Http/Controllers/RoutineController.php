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
            ->get();

        return Inertia::render('Routines/Index', [
            'routines' => $routines,
        ]);
    }

    /**
     * Devuelve la vista de creación pasando TODOS los ejercicios disponibles.
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
     */
    public function store(Request $request)
    {
        $request->validate([
            'routineName'             => ['required', 'string', 'max:255'],
            'description'             => ['nullable', 'string', 'max:1000'],
            'exercises'               => ['required', 'array', 'min:1'],
            'exercises.*.id'          => ['required', 'integer', 'exists:ejercicios,id'],
            'exercises.*.sets'        => ['required', 'array', 'min:1'],
            'exercises.*.sets.*.target_reps' => ['required', 'integer', 'min:1', 'max:999'],
        ]);

        // 1. Crear la rutina asociada al usuario
        $routine = Routine::create([
            'id_usuario'  => Auth::id(),
            'nombre'      => $request->routineName,
            'descripcion' => $request->description,
            'estado'      => 'activa',
        ]);

        // Construir el array para sync() con los datos pivot
        // Como un ejercicio puede tener varias series, guardamos:
        //      - objetivo_series  = número total de series
        //      - objetivo_repeticiones = reps de la primera serie
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

    public function start(Request $request, $id)
    {
        // Buscamos la rutina SOLO dentro de las que le pertenecen al usuario logueado
        $rutina = $request->user()->rutinas()->with('exercises')->findOrFail($id);

        return \Inertia\Inertia::render('Trainings/ActiveWorkout', [
            'rutina' => $rutina,
            'resistanceBands' => $request->user()->resistanceBands()->get()
        ]);
    }

    /**
     * Muestra el detalle de una rutina.
     */
    public function show(Request $request, $id)
    {
        // Buscamos la rutina SOLO dentro de las que le pertenecen al usuario logueado
        $routine = $request->user()->rutinas()->with('exercises')->findOrFail($id);

        return Inertia::render('Routines/Show', [
            'routine' => $routine
        ]);
    }

    /**
     * Alterna el estado de la rutina (activa/inactiva).
     */
    public function toggleStatus(Request $request, $id)
    {
        $routine = $request->user()->rutinas()->findOrFail($id);
        
        $routine->estado = $routine->estado === 'activa' ? 'inactiva' : 'activa';
        $routine->save();

        $action = $routine->estado === 'activa' ? 'activada' : 'archivada';
        return redirect()->back()->with('success', "Rutina {$action} con éxito.");
    }
}
