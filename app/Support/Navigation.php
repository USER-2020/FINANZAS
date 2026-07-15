<?php

namespace App\Support;

use App\Models\User;

class Navigation
{
    public static function superadminModules(): array
    {
        return config('navigation.superadmin', []);
    }

    public static function tenantModules(): array
    {
        return config('navigation.tenant', []);
    }

    public static function tenantModuleKeys(): array
    {
        return collect(self::tenantModules())
            ->pluck('key')
            ->values()
            ->all();
    }

    public static function forUser(?User $user): array
    {
        if (! $user) {
            return [];
        }

        if ($user->isSuperAdmin()) {
            return self::superadminModules();
        }

        $modules = self::tenantModules();

        if ($user->hasRole('admin')) {
            $allowed = $user->allowedMenuModules();

            return array_values(array_filter(
                $modules,
                fn (array $module) => in_array($module['key'], $allowed, true),
            ));
        }

        return $modules;
    }

    public static function matchTenantModuleForPath(string $path): ?array
    {
        $normalizedPath = '/'.ltrim($path, '/');

        return collect(self::tenantModules())
            ->sortByDesc(fn (array $module) => strlen($module['href']))
            ->first(function (array $module) use ($normalizedPath) {
                $href = $module['href'];

                return $normalizedPath === $href || str_starts_with($normalizedPath, $href.'/');
            });
    }
}
