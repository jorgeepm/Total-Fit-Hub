<?php

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
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/nutrition', [App\Http\Controllers\NutritionController::class, 'index'])->name('nutrition.index');
    Route::get('/nutrition/search', [App\Http\Controllers\NutritionController::class, 'search'])->name('nutrition.search');
    Route::post('/nutrition/log', [App\Http\Controllers\NutritionController::class, 'store'])->name('nutrition.store');
    Route::patch('/nutrition/log/{id}', [App\Http\Controllers\NutritionController::class, 'update'])->name('nutrition.update');
    Route::delete('/nutrition/log/{id}', [App\Http\Controllers\NutritionController::class, 'destroy'])->name('nutrition.destroy');

    Route::get('/trainings', function () {
        return Inertia::render('Trainings/Index');
    })->name('trainings.index');
});

Route::get('/forzar-migracion', function () {
    \Illuminate\Support\Facades\Artisan::call('migrate:fresh', ['--force' => true]);
    return '¡Base de datos sincronizada con éxito! Ya puedes revisar tu gestor de base de datos. (Recuerda actualizar la vista)';
});

require __DIR__.'/auth.php';
