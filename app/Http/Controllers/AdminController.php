<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Entrenamiento;
use App\Models\ErrorReport;
use App\Models\FoodLog;
use App\Models\Routine;
use App\Models\WeightLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AdminController extends Controller
{
    public function index()
    {
        // --- Estadísticas globales ---
        $totalUsuarios      = User::count();
        $nuevosEstaSemana   = User::where('created_at', '>=', now()->startOfWeek())->count();
        $totalEntrenamientos = Entrenamiento::count();
        $totalRegistrosComida = FoodLog::count();
        $totalRutinas       = Routine::count();
        $usuariosOnboarding = User::where('onboarding_completed', true)->count();
        $totalAdmins        = User::where('rol', 'admin')->count();
        $totalEstandar      = User::where('rol', 'estandar')->count();

        // Top 5 usuarios más activos por número de entrenamientos
        $topUsuarios = User::withCount(['entrenamientos'])
            ->orderByDesc('entrenamientos_count')
            ->take(5)
            ->get(['id', 'nombre_usuario', 'email', 'created_at', 'rol'])
            ->map(fn($u) => [
                'id'             => $u->id,
                'nombre_usuario' => $u->nombre_usuario,
                'email'          => $u->email,
                'entrenamientos' => $u->entrenamientos_count,
                'rol'            => $u->rol,
            ]);

        // Nuevos usuarios por mes (últimos 6 meses)
        $mesesRecientes = collect(range(5, 0))->map(function ($i) {
            $fecha = now()->subMonths($i);
            return [
                'mes'      => $fecha->translatedFormat('M Y'),
                'cantidad' => User::whereYear('created_at', $fecha->year)
                                  ->whereMonth('created_at', $fecha->month)
                                  ->count(),
            ];
        });

        // --- Lista completa de usuarios ---
        $usuarios = User::orderByDesc('created_at')
            ->get(['id', 'nombre_usuario', 'email', 'rol', 'created_at', 'onboarding_completed', 'peso', 'altura'])
            ->map(fn($u) => [
                'id'                   => $u->id,
                'nombre_usuario'       => $u->nombre_usuario,
                'email'                => $u->email,
                'rol'                  => $u->rol,
                'created_at'           => $u->created_at->format('d/m/Y'),
                'onboarding_completed' => (bool) $u->onboarding_completed,
                'peso'                 => $u->peso,
                'altura'               => $u->altura,
            ]);

        // --- Reportes de Error ---
        $errorReports = ErrorReport::with('user')
            ->orderByDesc('created_at')
            ->get()
            ->map(fn($r) => [
                'id' => $r->id,
                'user' => $r->user ? $r->user->nombre_usuario : 'Usuario eliminado',
                'subject' => $r->subject,
                'description' => $r->description,
                'status' => $r->status,
                'created_at' => $r->created_at->format('d/m/Y H:i'),
            ]);

        return Inertia::render('Admin/Index', [
            'stats' => [
                'totalUsuarios'        => $totalUsuarios,
                'nuevosEstaSemana'     => $nuevosEstaSemana,
                'totalEntrenamientos'  => $totalEntrenamientos,
                'totalRegistrosComida' => $totalRegistrosComida,
                'totalRutinas'         => $totalRutinas,
                'usuariosOnboarding'   => $usuariosOnboarding,
                'totalAdmins'          => $totalAdmins,
                'totalEstandar'        => $totalEstandar,
                'topUsuarios'          => $topUsuarios,
                'mesesRecientes'       => $mesesRecientes,
            ],
            'usuarios' => $usuarios,
            'errorReports' => $errorReports,
        ]);
    }

    public function updateUser(Request $request, $id)
    {
        // Un admin no puede cambiar su propio rol
        if ((int)$id === Auth::id()) {
            return back()->withErrors(['error' => 'No puedes modificar tu propio rol.']);
        }

        $validated = $request->validate([
            'rol' => 'required|in:admin,estandar',
        ]);

        $user = User::findOrFail($id);
        $user->rol = $validated['rol'];
        $user->save();

        return back()->with('success', "Rol de {$user->nombre_usuario} actualizado a '{$validated['rol']}'.");
    }

    public function deleteUser($id)
    {
        // Un admin no puede eliminarse a sí mismo
        if ((int)$id === Auth::id()) {
            return back()->withErrors(['error' => 'No puedes eliminar tu propia cuenta desde el panel de administrador.']);
        }

        $user = User::findOrFail($id);
        $nombre = $user->nombre_usuario;

        // Eliminar datos relacionados manualmente (cascada lógica)
        FoodLog::where('user_id', $id)->delete();
        WeightLog::where('user_id', $id)->delete();
        Entrenamiento::where('id_usuario', $id)->delete();
        Routine::where('id_usuario', $id)->delete();

        $user->delete();

        return back()->with('success', "Usuario '{$nombre}' eliminado correctamente.");
    }

    public function updateErrorStatus(Request $request, $id)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,resolved',
        ]);

        $report = ErrorReport::findOrFail($id);
        $report->status = $validated['status'];
        $report->save();

        return back()->with('success', "Estado del reporte actualizado a '{$validated['status']}'.");
    }

    public function deleteError($id)
    {
        $report = ErrorReport::findOrFail($id);
        $report->delete();

        return back()->with('success', 'Reporte de error eliminado correctamente.');
    }
}
