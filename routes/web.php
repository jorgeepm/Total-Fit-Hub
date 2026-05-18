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

    Route::get('/nutrition', [App\Http\Controllers\NutritionController::class, 'index'])->name('nutrition.index');
    Route::get('/nutrition/search', [App\Http\Controllers\NutritionController::class, 'search'])->name('nutrition.search');
    Route::post('/nutrition/log', [App\Http\Controllers\NutritionController::class, 'store'])->name('nutrition.store');
    Route::patch('/nutrition/log/{id}', [App\Http\Controllers\NutritionController::class, 'update'])->name('nutrition.update');
    Route::delete('/nutrition/log/{id}', [App\Http\Controllers\NutritionController::class, 'destroy'])->name('nutrition.destroy');

    Route::get('/trainings', [App\Http\Controllers\ExerciseController::class, 'index'])->name('trainings.index');
    Route::post('/exercises', [App\Http\Controllers\ExerciseController::class, 'store'])->name('exercises.store');
    Route::delete('/exercises/{id}', [App\Http\Controllers\ExerciseController::class, 'destroy'])->name('exercises.destroy');

    // --- Rutinas ---
    Route::get('/routines', [App\Http\Controllers\RoutineController::class, 'index'])->name('routines.index');
    Route::get('/routines/create', [App\Http\Controllers\RoutineController::class, 'create'])->name('routines.create');
    Route::post('/routines', [App\Http\Controllers\RoutineController::class, 'store'])->name('routines.store');

    // --- Reporte de Errores ---
    Route::post('/error-reports', [App\Http\Controllers\ErrorReportController::class, 'store'])->name('error-reports.store');
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

Route::get('/forzar-migracion', function () {
    \Illuminate\Support\Facades\Artisan::call('migrate:fresh', ['--force' => true]);
    return '¡Base de datos sincronizada con éxito! Ya puedes revisar tu gestor de base de datos. (Recuerda actualizar la vista)';
});

require __DIR__.'/auth.php';
