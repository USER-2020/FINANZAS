<?php

namespace App\Http\Middleware;

use App\Support\Navigation;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureMenuAccess
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (! $user || $user->isSuperAdmin() || ! $user->hasRole('admin')) {
            return $next($request);
        }

        $module = Navigation::matchTenantModuleForPath($request->path());

        if (! $module) {
            return $next($request);
        }

        abort_unless(
            in_array($module['key'], $user->allowedMenuModules(), true),
            403,
            'No tienes acceso a este modulo.',
        );

        return $next($request);
    }
}
