<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

class EnsureStoreProfileComplete
{
    /**
     * Allow these route names when profile is incomplete (store can only complete profile).
     */
    protected array $allowedRouteNames = [
        'store.settings.profile',
        'store.settings.profile.update',
    ];

    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user('store');

        if (!$user) {
            return $next($request);
        }

        if ($user->hasCompletedProfile()) {
            return $next($request);
        }

        if ($request->routeIs($this->allowedRouteNames)) {
            return $next($request);
        }

        Inertia::flash('error', __('Please complete your store profile before continuing.'));
        return redirect()
            ->route('store.settings.profile');
    }
}
