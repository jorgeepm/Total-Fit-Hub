<?php

namespace App\Http\Controllers;

use App\Models\Exercise;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;

class ExerciseController extends Controller
{
    /**
     * Muestra la página de Entrenamientos con los ejercicios
     * globales + los creados por el usuario autenticado.
     */
    public function index() {
        $ejercicios = Cache::remember('api_ejercicios', 86400, function () {
            // Hace la petición a la API externa (ej. Wger o ExerciseDB)
            $response = Http::get("https://wger.de/api/v2/exerciseinfo/");
            return $response->json();
        });

        return Inertia::render('Trainings/Index', ['ejercicios' => $ejercicios]);
        try {
            $exercises = Exercise::forUser(Auth::id())
                ->orderByRaw('ISNULL(id_usuario) ASC') // personalizados primero
                ->orderBy('nombre')
                ->get([
                    'id', 'id_usuario', 'nombre', 'grupo_muscular',
                    'equipamiento_necesario', 'calorias_minuto', 'dificultad', 'descripcion',
                ]);
        } catch (\Exception $e) {
            // Si la columna id_usuario aún no existe (migración pendiente),
            // simplemente devolvemos todos los ejercicios globales
            $exercises = Exercise::orderBy('nombre')
                ->get([
                    'id', 'nombre', 'grupo_muscular',
                    'equipamiento_necesario', 'calorias_minuto',
                ])->map(fn($ex) => array_merge($ex->toArray(), ['id_usuario' => null, 'dificultad' => null, 'descripcion' => null]));
        }

        return Inertia::render('Trainings/Index', [
            'exercises' => $exercises,
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
            'calorias_minuto'        => ['required', 'numeric', 'min:0', 'max:9999'],
            'dificultad'             => ['required', 'in:Principiante,Intermedio,Avanzado'],
            'descripcion'            => ['nullable', 'string', 'max:1000'],
        ]);

        $exercise = Exercise::create([
            ...$validated,
            'id_usuario' => Auth::id(),
        ]);

        return back()->with('success', "Ejercicio \"{$exercise->nombre}\" creado con éxito.");
    }

    /**
     * Elimina un ejercicio creado por el usuario autenticado.
     */
    public function destroy(int $id)
    {
        $exercise = Exercise::where('id', $id)
            ->where('id_usuario', Auth::id())
            ->firstOrFail();

        $exercise->delete();

        return back()->with('success', 'Ejercicio eliminado.');
    }
}
