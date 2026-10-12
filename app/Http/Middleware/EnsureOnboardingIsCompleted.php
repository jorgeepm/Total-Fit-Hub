<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;

class EnsureOnboardingIsCompleted
{
    /**
     * Maneja una solicitud entrante.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = Auth::user();

        if ($user && !$user->onboarding_completed && !$request->routeIs('onboarding.*', 'logout', 'admin.*', 'welcome', 'privacidad', 'terminos', 'cookies')) {
            return redirect()->route('onboarding.index');
        }

        return $next($request);
    }
}
