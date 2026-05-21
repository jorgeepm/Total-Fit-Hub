<?php

namespace App\Http\Controllers;

use App\Models\Exercise;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ExerciseController extends Controller
{
    /**
     * Muestra la página de Entrenamientos con los ejercicios
     * globales + los creados por el usuario autenticado.
     */
    public function index() {
        $exercises = Exercise::forUser(Auth::id())
            ->orderByRaw('id_usuario IS NULL ASC') // personalizados primero
            ->orderBy('nombre')
            ->get([
                'id', 'id_usuario', 'nombre', 'grupo_muscular',
                'equipamiento_necesario', 'calorias_minuto', 'dificultad', 'descripcion',
            ]);

        return Inertia::render('Trainings/Index', [
            'exercises' => $exercises,
            'isAdmin'   => Auth::user()->rol === 'admin',
        ]);
    }

    /**
     * Crea un ejercicio personalizado para el usuario autenticado.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre'                 => ['required', 'string', 'max:255'],
            'grupo_muscular'         => ['required', 'string', 'max:100'],
            'equipamiento_necesario' => ['required', 'string', 'max:100'],
            'peso_base'              => ['nullable', 'numeric', 'min:0', 'max:999'],
            'calorias_minuto'        => ['required', 'numeric', 'min:0', 'max:9999'],
            'dificultad'             => ['required', 'in:Principiante,Intermedio,Avanzado'],
            'descripcion'            => ['nullable', 'string', 'max:1000'],
        ]);

        $isAdmin = Auth::user()->rol === 'admin';
        $id_usuario = Auth::id();

        if ($isAdmin && $request->boolean('is_global')) {
            $id_usuario = null;
        }

        $exercise = Exercise::create([
            ...$validated,
            'id_usuario' => $id_usuario,
        ]);

        return back()->with('success', "Ejercicio \"{$exercise->nombre}\" creado con éxito.");
    }

    /**
     * Actualiza un ejercicio personalizado.
     */
    public function update(Request $request, int $id)
    {
        $exercise = Exercise::findOrFail($id);
        $isAdmin = Auth::user()->rol === 'admin';

        // Check permissions
        if ($exercise->id_usuario === null && !$isAdmin) {
            abort(403, 'Unauthorized action.');
        }
        if ($exercise->id_usuario !== null && $exercise->id_usuario != Auth::id()) {
            abort(403, 'Unauthorized action.');
        }

        $validated = $request->validate([
            'nombre'                 => ['required', 'string', 'max:255'],
            'grupo_muscular'         => ['required', 'string', 'max:100'],
            'equipamiento_necesario' => ['required', 'string', 'max:100'],
            'peso_base'              => ['nullable', 'numeric', 'min:0', 'max:999'],
            'calorias_minuto'        => ['required', 'numeric', 'min:0', 'max:9999'],
            'dificultad'             => ['required', 'in:Principiante,Intermedio,Avanzado'],
            'descripcion'            => ['nullable', 'string', 'max:1000'],
            'is_global'              => ['nullable', 'boolean'],
        ]);

        $data = [
            'nombre' => $validated['nombre'],
            'grupo_muscular' => $validated['grupo_muscular'],
            'equipamiento_necesario' => $validated['equipamiento_necesario'],
            'peso_base' => $validated['peso_base'] ?? 0,
            'calorias_minuto' => $validated['calorias_minuto'],
            'dificultad' => $validated['dificultad'],
            'descripcion' => $validated['descripcion'] ?? null,
        ];

        if ($isAdmin && $request->has('is_global')) {
            $data['id_usuario'] = $request->boolean('is_global') ? null : Auth::id();
        }

        $exercise->update($data);

        return back()->with('success', "Ejercicio \"{$exercise->nombre}\" actualizado con éxito.");
    }

    /**
     * Elimina un ejercicio creado por el usuario autenticado.
     */
    public function destroy(int $id)
    {
        $exercise = Exercise::findOrFail($id);
        $isAdmin = Auth::user()->rol === 'admin';

        if ($exercise->id_usuario === null && !$isAdmin) {
            abort(403, 'Unauthorized action.');
        }
        if ($exercise->id_usuario !== null && $exercise->id_usuario != Auth::id()) {
            abort(403, 'Unauthorized action.');
        }

        $exercise->delete();

        return back()->with('success', 'Ejercicio eliminado.');
    }
}
