<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\InteractsWithTenant;
use App\Models\Client;
use App\Models\Department;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    use InteractsWithTenant;

    private const CREATOR_VISIBLE_ROLES = [
        'admin',
        'contador',
        'jefe_departamento',
    ];

    public function index(Request $request): Response
    {
        $query = User::query()
            ->with(['client:id,name', 'creator:id,name', 'departments:id,name', 'roles:id,name'])
            ->latest();

        if ($this->isSuperAdmin($request)) {
            $query->where('created_by', $request->user()->id);
        } else {
            $query->where('client_id', $this->currentClientId($request))
                ->where('created_by', $request->user()->id)
                ->whereDoesntHave('roles', fn ($roleQuery) => $roleQuery->whereIn('name', ['super_admin', 'admin']));
        }

        return Inertia::render('Crud/Users', [
            'users' => $query->get(),
            'departments' => $this->tenantDepartments($request),
            'roles' => Role::query()
                ->whereIn('name', $this->allowedRoles($request))
                ->orderBy('name')
                ->get(['id', 'name']),
            'clients' => $this->isSuperAdmin($request) ? Client::query()->orderBy('name')->get(['id', 'name']) : [],
            'canManageClients' => $this->isSuperAdmin($request),
        ]);
    }

    public function store(Request $request)
    {
        $data = $this->validated($request);
        $departmentIds = $data['department_ids'] ?? [];
        $role = $data['role'];

        abort_unless(in_array($role, $this->allowedRoles($request), true), 403);

        $clientId = $this->isSuperAdmin($request)
            ? ($data['client_id'] ?: null)
            : $this->currentClientId($request);

        unset($data['department_ids'], $data['role'], $data['client_id']);

        $user = User::create([
            ...$data,
            'client_id' => $role === 'super_admin' ? null : $clientId,
            'created_by' => $request->user()->id,
            'menu_access' => null,
        ]);
        $user->departments()->sync($departmentIds);
        $user->syncRoles([$role]);

        return back()->with('success', 'Usuario creado.');
    }

    public function update(Request $request, User $user)
    {
        $this->ensureManageableUser($request, $user);

        $data = $this->validated($request, $user);
        $departmentIds = $data['department_ids'] ?? [];
        $role = $data['role'];

        if (blank($data['password'] ?? null)) {
            unset($data['password']);
        }

        abort_unless(in_array($role, $this->allowedRoles($request), true), 403);

        $clientId = $this->isSuperAdmin($request)
            ? ($data['client_id'] ?: null)
            : $this->currentClientId($request);

        unset($data['department_ids'], $data['role'], $data['client_id']);

        $user->update([
            ...$data,
            'client_id' => $role === 'super_admin' ? null : $clientId,
            'menu_access' => $role === 'admin' ? $user->menu_access : null,
        ]);
        $user->departments()->sync($departmentIds);
        $user->syncRoles([$role]);

        return back()->with('success', 'Usuario actualizado.');
    }

    public function destroy(Request $request, User $user)
    {
        $this->ensureManageableUser($request, $user);

        if ($request->user()->is($user)) {
            return back()->with('error', 'No puedes eliminar tu propio usuario.');
        }

        $user->delete();

        return back()->with('success', 'Usuario eliminado.');
    }

    private function validated(Request $request, ?User $user = null): array
    {
        $departmentIds = $this->tenantDepartments($request)->pluck('id')->all();

        return $request->validate([
            'client_id' => ['nullable', 'integer', Rule::exists('clients', 'id')],
            'department_ids' => ['nullable', 'array'],
            'department_ids.*' => ['integer', Rule::in($departmentIds)],
            'role' => [
                'required',
                'string',
                Rule::exists('roles', 'name')
                    ->where('guard_name', 'web')
                    ->whereIn('name', $this->allowedRoles($request)),
            ],
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user)],
            'status' => ['required', 'string', Rule::in(['Activo', 'Inactivo'])],
            'password' => [$user ? 'nullable' : 'required', 'string', Password::defaults()],
        ]);
    }

    private function allowedRoles(Request $request): array
    {
        if ($this->isSuperAdmin($request)) {
            return ['admin', 'contador', 'jefe_departamento'];
        }

        if ($request->user()->hasRole('admin')) {
            return ['contador', 'jefe_departamento'];
        }

        return [];
    }

    private function ensureManageableUser(Request $request, User $user): void
    {
        if (! $this->isSuperAdmin($request)) {
            $this->ensureSameClient($user, $request);
        }

        abort_unless((int) $user->created_by === (int) $request->user()->id, 404);
    }
}
