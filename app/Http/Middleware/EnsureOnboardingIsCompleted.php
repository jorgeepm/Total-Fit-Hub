<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;

class EnsureOnboardingIsCompleted
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = Auth::user();

        // Si el usuario está autenticado, no ha completado el onboarding y no está ya en la ruta de onboarding
        if ($user && !$user->onboarding_completed && !$request->routeIs('onboarding.*') && !$request->routeIs('logout') && !$request->routeIs('admin.*')) {
            return redirect()->route('onboarding.index');
        }

        return $next($request);
    }
}
