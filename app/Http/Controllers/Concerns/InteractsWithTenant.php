<?php

namespace App\Http\Controllers\Concerns;

use App\Models\Client;
use App\Models\Department;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Symfony\Component\HttpKernel\Exception\HttpException;

trait InteractsWithTenant
{
    protected function authUser(Request $request): User
    {
        return $request->user();
    }

    protected function isSuperAdmin(Request $request): bool
    {
        return $this->authUser($request)->hasRole('super_admin');
    }

    protected function ensureOperationalAccess(Request $request): void
    {
        if ($this->isSuperAdmin($request)) {
            throw new HttpException(403, 'El superadmin no tiene acceso a los módulos operativos.');
        }
    }

    protected function currentClientId(Request $request): ?int
    {
        return $this->authUser($request)->client_id;
    }

    protected function scopeToCurrentClient(Builder $query, Request $request, string $column = 'client_id'): Builder
    {
        if ($this->isSuperAdmin($request)) {
            return $query;
        }

        return $query->where($column, $this->currentClientId($request));
    }

    protected function scopeToAuthenticatedUser(Builder $query, Request $request, string $column = 'user_id'): Builder
    {
        if ($this->isSuperAdmin($request)) {
            return $query;
        }

        return $query->where($column, $request->user()->id);
    }

    protected function ensureSameClient(Model $model, Request $request): void
    {
        if ($this->isSuperAdmin($request)) {
            return;
        }

        if ((int) $model->getAttribute('client_id') !== (int) $this->currentClientId($request)) {
            abort(404);
        }
    }

    protected function ensureOwnedByAuthenticatedUser(Model $model, Request $request, string $column = 'user_id'): void
    {
        if ($this->isSuperAdmin($request)) {
            return;
        }

        if ((int) $model->getAttribute($column) !== (int) $request->user()->id) {
            abort(404);
        }
    }

    protected function tenantDepartments(Request $request): Collection
    {
        return $this->scopeToCurrentClient(Department::query()->orderBy('name'), $request)->get(['id', 'name']);
    }

    protected function tenantClients(Request $request): Collection
    {
        if (! $this->isSuperAdmin($request)) {
            return collect();
        }

        return Client::query()->orderBy('name')->get(['id', 'name']);
    }
}
