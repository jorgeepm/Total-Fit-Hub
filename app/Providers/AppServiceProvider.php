<?php

namespace App\Providers;

use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Registra cualquier servicio de la aplicación.
     */
    public function register(): void
    {
        //
    }

    /**
     * Pone en marcha cualquier servicio de la aplicación.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);
    }
}
