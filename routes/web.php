<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
})->name('welcome');

Route::get('/privacidad', function () {
    return Inertia::render('Privacidad');
})->name('privacidad');

Route::get('/terminos', function () {
    return Inertia::render('Terminos');
})->name('terminos');

Route::get('/cookies', function () {
    return Inertia::render('Cookies');
})->name('cookies');

Route::get('/dashboard', [DashboardController::class, 'index'])->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/onboarding', [App\Http\Controllers\OnboardingController::class, 'index'])->name('onboarding.index');
    Route::post('/onboarding', [App\Http\Controllers\OnboardingController::class, 'store'])->name('onboarding.store');

    Route::post('/weight-logs', [App\Http\Controllers\WeightLogController::class, 'store'])->name('weight-logs.store');

    Route::post('/resistance-bands', [App\Http\Controllers\ResistanceBandController::class, 'store'])->name('resistance-bands.store');
    Route::delete('/resistance-bands/{id}', [App\Http\Controllers\ResistanceBandController::class, 'destroy'])->name('resistance-bands.destroy');

    Route::get('/nutrition', [App\Http\Controllers\NutritionController::class, 'index'])->name('nutrition.index');
    Route::get('/nutrition/search', [App\Http\Controllers\NutritionController::class, 'search'])->name('nutrition.search');
    Route::post('/nutrition/log', [App\Http\Controllers\NutritionController::class, 'store'])->name('nutrition.store');
    Route::patch('/nutrition/log/{id}', [App\Http\Controllers\NutritionController::class, 'update'])->name('nutrition.update');
    Route::delete('/nutrition/log/{id}', [App\Http\Controllers\NutritionController::class, 'destroy'])->name('nutrition.destroy');
    Route::post('/nutrition/water', [App\Http\Controllers\NutritionController::class, 'updateWater'])->name('nutrition.water.update');

    Route::get('/trainings', [App\Http\Controllers\ExerciseController::class, 'index'])->name('trainings.index');
    Route::post('/exercises', [App\Http\Controllers\ExerciseController::class, 'store'])->name('exercises.store');
    Route::put('/exercises/{id}', [App\Http\Controllers\ExerciseController::class, 'update'])->name('exercises.update');
    Route::delete('/exercises/{id}', [App\Http\Controllers\ExerciseController::class, 'destroy'])->name('exercises.destroy');

    // --- Rutinas ---
    Route::get('/routines', [App\Http\Controllers\RoutineController::class, 'index'])->name('routines.index');
    Route::get('/routines/create', [App\Http\Controllers\RoutineController::class, 'create'])->name('routines.create');
    Route::post('/routines', [App\Http\Controllers\RoutineController::class, 'store'])->name('routines.store');
    Route::get('/routines/{id}', [App\Http\Controllers\RoutineController::class, 'show'])->name('routines.show');
    Route::get('/routines/{id}/start', [App\Http\Controllers\RoutineController::class, 'start'])->name('routines.start');
    Route::patch('/routines/{id}/toggle-status', [App\Http\Controllers\RoutineController::class, 'toggleStatus'])->name('routines.toggle-status');

    // --- Guardado de entrenamiento ---
    Route::post('/trainings', [App\Http\Controllers\TrainingController::class, 'store'])->name('trainings.store');
    Route::get('/trainings/history', [App\Http\Controllers\TrainingController::class, 'history'])->name('trainings.history');
    Route::delete('/trainings/{id}', [App\Http\Controllers\TrainingController::class, 'destroy'])->name('trainings.destroy');

    // --- Reporte de Errores ---
    Route::post('/error-reports', [App\Http\Controllers\ErrorReportController::class, 'store'])->name('error-reports.store');

    // --- Feedback ---
    Route::get('/feedback', function () {
        return Inertia::render('SatisfactionForm');
    })->name('feedback');

    Route::post('/feedback', function (Illuminate\Http\Request $request) {
        $request->validate([
            'rating' => 'required|integer|between:1,5',
            'comentarios' => 'nullable|string|max:1000',
        ]);

        try {
            Illuminate\Support\Facades\Http::timeout(5)->post('https://script.google.com/macros/s/AKfycbzsAS9qG60ClYBZH__zNVnw0NOPQ0KCUAaPKhnDoFdJGPiZKhkfyr7ZuvH8sgoF2oeC/exec', [
                'correo_usuario' => $request->user()->email,
                'nota_estrellas' => $request->input('rating'),
                'opinion_texto'  => $request->input('comentarios'),
            ]);
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::warning('No se pudo enviar feedback a Google Apps Script: ' . $e->getMessage());
        }

        return back()->with('success', '¡Gracias! Tu opinión ha sido enviada.');
    });
});

// --- Panel de Administrador ---
Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/', [App\Http\Controllers\AdminController::class, 'index'])->name('index');
    Route::patch('/users/{id}', [App\Http\Controllers\AdminController::class, 'updateUser'])->name('users.update');
    Route::delete('/users/{id}', [App\Http\Controllers\AdminController::class, 'deleteUser'])->name('users.destroy');
    
    // Buzón de errores
    Route::patch('/error-reports/{id}', [App\Http\Controllers\AdminController::class, 'updateErrorStatus'])->name('error-reports.update');
    Route::delete('/error-reports/{id}', [App\Http\Controllers\AdminController::class, 'deleteError'])->name('error-reports.destroy');
});

// Ruta de migración restringida únicamente a entorno local y administrador
if (app()->environment('local')) {
    Route::middleware(['auth', 'admin'])->get('/forzar-migracion', function () {
        \Illuminate\Support\Facades\Artisan::call('migrate:fresh', ['--force' => true, '--seed' => true]);
        return '¡Base de datos sincronizada y sembrada con éxito! Ya puedes revisar tu gestor de base de datos. (Recuerda actualizar la vista)';
    });
}

require __DIR__.'/auth.php';
