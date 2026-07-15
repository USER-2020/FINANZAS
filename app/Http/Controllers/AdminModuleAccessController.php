<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Support\Navigation;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminModuleAccessController extends Controller
{
    public function index(Request $request): Response
    {
        abort_unless($request->user()?->isSuperAdmin(), 403);

        $admins = User::query()
            ->with(['client:id,name', 'roles:id,name'])
            ->role('admin')
            ->latest()
            ->get()
            ->map(function (User $user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'status' => $user->status,
                    'client' => $user->client ? ['id' => $user->client->id, 'name' => $user->client->name] : null,
                    'menu_access' => $user->allowedMenuModules(),
                ];
            })
            ->values();

        return Inertia::render('Crud/AdminModuleAccess', [
            'admins' => $admins,
            'modules' => collect(Navigation::tenantModules())
                ->map(fn (array $module) => ['label' => $module['label'], 'value' => $module['key']])
                ->values(),
        ]);
    }

    public function update(Request $request, User $user)
    {
        abort_unless($request->user()?->isSuperAdmin(), 403);
        abort_unless($user->hasRole('admin') && ! $user->isSuperAdmin(), 404);

        $allowedModules = Navigation::tenantModuleKeys();

        $data = $request->validate([
            'menu_access' => ['required', 'array', 'min:1'],
            'menu_access.*' => ['string', 'in:'.implode(',', $allowedModules)],
        ]);

        $menuAccess = collect($data['menu_access'])->unique()->values()->all();

        $user->update([
            'menu_access' => count($menuAccess) === count($allowedModules) ? null : $menuAccess,
        ]);

        return back()->with('success', 'Accesos del admin actualizados.');
    }
}
