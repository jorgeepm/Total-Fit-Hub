<?php

namespace App\Http\Controllers;

use App\Models\WeightLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class WeightLogController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'weight' => ['required', 'numeric', 'min:30', 'max:500'],
            'log_date' => ['required', 'date'],
        ]);

        $user = Auth::user();
        
        // Crear el registro de historial
        $user->weightLogs()->create([
            'weight' => $request->weight,
            'log_date' => $request->log_date,
        ]);

        // Actualizar el peso actual del usuario si es el registro más reciente
        // (Para simplificar, siempre actualizamos el peso actual del usuario)
        $user->update(['peso' => $request->weight]);

        return back();
    }
}
