<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class SuperadminMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle($request, Closure $next)
    {
        // Check if the authenticated user is a superadmin
        if ($request->user() && $request->user()->role_id === 1) {
            return $next($request);
        }

        // If the user is not a superadmin, return unauthorized response
        return response()->json(['error' => 'Unauthorized'], 403);
    }
}
