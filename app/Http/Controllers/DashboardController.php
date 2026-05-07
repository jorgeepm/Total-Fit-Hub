<?php

namespace App\Http\Controllers;

use App\Models\FoodLog;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $today = now()->toDateString();

        // Sumamos las calorías de todos los alimentos registrados HOY por este usuario
        $caloriasConsumidas = FoodLog::where('user_id', $user->id)
            ->whereDate('log_date', $today)
            ->sum('calories');

        // Proteínas, carbohidratos y grasas
        $proteinasConsumidas = FoodLog::where('user_id', $user->id)
            ->whereDate('log_date', $today)
            ->sum('proteins');

        $carbsConsumidas = FoodLog::where('user_id', $user->id)
            ->whereDate('log_date', $today)
            ->sum('carbs');

        $fatsConsumidas = FoodLog::where('user_id', $user->id)
            ->whereDate('log_date', $today)
            ->sum('fats');

        // Obtenemos su objetivo diario (o 2500 por defecto si no lo ha configurado)
        $caloriasDiarias = $user->calorias_diarias ?? 2500;

        // Obtenemos los entrenamientos de hoy
        $entrenamientosHoy = $user->entrenamientos()
            ->with('routine')
            ->whereDate('started_at', $today)
            ->get();

        return Inertia::render('Dashboard', [
            'nutritionSummary' => [
                'consumidas' => $caloriasConsumidas,
                'objetivo' => $caloriasDiarias,
                'proteins' => $proteinasConsumidas,
                'carbs' => $carbsConsumidas,
                'fats' => $fatsConsumidas,
            ],
            'entrenamientos' => $entrenamientosHoy,
        ]);
    }
}
