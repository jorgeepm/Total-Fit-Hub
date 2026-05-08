<?php

namespace App\Http\Controllers;

use App\Models\FoodLog;
use App\Models\Entrenamiento;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        
        // Validación: El usuario debe estar autenticado
        if (!$user) {
            abort(403, 'Unauthorized');
        }
        
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

        // Obtenemos los entrenamientos de hoy con eager loading para evitar N+1
        $entrenamientosHoy = $user->entrenamientos()
            ->with('routine')
            ->whereDate('hora_inicio', $today)
            ->get();

        // Objetivos de macronutrientes (dinámicos, por usuario)
        $macroTargets = [
            'proteins' => $user->target_proteins ?? 150,
            'carbs' => $user->target_carbs ?? 250,
            'fats' => $user->target_fats ?? 70,
        ];

        // Historial de peso para la gráfica
        $weightHistory = $user->weightLogs()
            ->orderBy('log_date', 'asc')
            ->get(['weight', 'log_date', 'id'])
            ->map(fn($log) => [
                'id' => $log->id,
                'timestamp' => $log->log_date,
                'fecha' => \Carbon\Carbon::parse($log->log_date)->format('d/m'),
                'hora' => \Carbon\Carbon::parse($log->log_date)->format('H:i'),
                'full_date' => \Carbon\Carbon::parse($log->log_date)->format('d/m/Y H:i'),
                'peso' => (float) $log->weight,
            ]);

        return Inertia::render('Dashboard', [
            'nutritionSummary' => [
                'consumidas' => (int) $caloriasConsumidas,
                'objetivo' => (int) $caloriasDiarias,
                'proteins' => (int) $proteinasConsumidas,
                'carbs' => (int) $carbsConsumidas,
                'fats' => (int) $fatsConsumidas,
            ],
            'macroTargets' => $macroTargets,
            'entrenamientos' => $entrenamientosHoy,
            'weightHistory' => $weightHistory,
        ]);
    }
}
