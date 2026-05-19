<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class OnboardingController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        
        // Si ya completó el onboarding, redirigir al dashboard
        if ($user->onboarding_completed) {
            return redirect()->route('dashboard');
        }

        return Inertia::render('Auth/Onboarding', [
            'user' => $user
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'genero' => ['required', 'string', 'in:masculino,femenino'],
            'edad' => ['required', 'integer', 'min:1', 'max:120'],
            'peso' => ['required', 'numeric', 'min:30', 'max:500'],
            'altura' => ['required', 'numeric', 'min:50', 'max:300'],
            'peso_objetivo' => ['required', 'numeric', 'min:30', 'max:500'],
            'nivel_actividad' => ['required', 'string', 'in:1.2,1.375,1.55,1.725,1.9'],
            'calorias_diarias' => ['required', 'integer', 'min:500', 'max:10000'],
            'target_proteins' => ['nullable', 'integer', 'min:0'],
            'target_carbs' => ['nullable', 'integer', 'min:0'],
            'target_fats' => ['nullable', 'integer', 'min:0'],
        ]);

        $user = Auth::user();
        $user->update($request->all() + ['onboarding_completed' => true]);

        // Registrar el peso inicial en el historial
        $user->weightLogs()->create([
            'weight' => $request->peso,
            'log_date' => now()->toDateString(),
        ]);

        return redirect()->route('dashboard');
    }
}
