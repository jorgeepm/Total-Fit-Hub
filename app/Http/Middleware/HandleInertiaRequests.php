<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * La plantilla raíz que se carga en la primera visita de la página.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determina la versión actual del asset.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define las props que se comparten por defecto.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
            ],
        ];
    }
}
