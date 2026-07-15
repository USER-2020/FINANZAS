<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\InteractsWithTenant;
use App\Models\Department;
use Database\Seeders\DepartmentsSeeder;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class DepartmentController extends Controller
{
    use InteractsWithTenant;

    public function index(Request $request): Response
    {
        $this->ensureOperationalAccess($request);

        $templateCodes = collect(DepartmentsSeeder::definitions())
            ->pluck('code')
            ->all();

        $templatesImported = $this->scopeToCurrentClient(Department::query(), $request)
            ->whereIn('code', $templateCodes)
            ->distinct('code')
            ->count('code') === count($templateCodes);

        return Inertia::render('Crud/Departments', [
            'departments' => $this->scopeToCurrentClient(Department::query()->latest(), $request)->get(),
            'canCreateDepartments' => $this->canCreateDepartments($request),
            'canDeleteDepartments' => $this->canDeleteDepartments($request),
            'templatesImported' => $templatesImported,
        ]);
    }

    public function store(Request $request)
    {
        $this->ensureOperationalAccess($request);
        abort_unless($this->canCreateDepartments($request), 403);

        Department::create([
            ...$this->validated($request),
            'client_id' => $this->currentClientId($request),
            'user_id' => $request->user()->id,
        ]);

        return back()->with('success', 'Departamento creado.');
    }

    public function update(Request $request, Department $department)
    {
        $this->ensureOperationalAccess($request);
        $this->ensureSameClient($department, $request);
        abort_unless($this->canCreateDepartments($request), 403);

        $department->update($this->validated($request, $department));

        return back()->with('success', 'Departamento actualizado.');
    }

    public function destroy(Department $department)
    {
        $request = request();
        $this->ensureOperationalAccess($request);
        $this->ensureSameClient($department, $request);
        abort_unless($this->canDeleteDepartments($request), 403);

        $department->delete();

        return back()->with('success', 'Departamento eliminado.');
    }

    public function importTemplates(Request $request)
    {
        $this->ensureOperationalAccess($request);
        abort_unless($this->canCreateDepartments($request), 403);

        $created = 0;
        $clientId = $this->currentClientId($request);
        $userId = $request->user()->id;

        foreach (DepartmentsSeeder::definitions() as $template) {
            $department = Department::firstOrCreate(
                [
                    'client_id' => $clientId,
                    'code' => $template['code'],
                ],
                [
                    ...$template,
                    'user_id' => $userId,
                ],
            );

            if ($department->wasRecentlyCreated) {
                $created++;
            }
        }

        return back()->with(
            'success',
            $created > 0
                ? "Se cargaron {$created} departamentos base."
                : 'Los departamentos base ya estaban cargados.',
        );
    }

    private function validated(Request $request, ?Department $department = null): array
    {
        return $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'code' => [
                'required',
                'string',
                'max:50',
                Rule::unique('departments', 'code')
                    ->ignore($department)
                    ->where(fn ($query) => $query->where('client_id', $this->currentClientId($request))),
            ],
            'manager' => ['nullable', 'string', 'max:255'],
            'monthly_budget' => ['required', 'numeric', 'min:0'],
            'status' => ['required', 'string', 'max:50'],
            'notes' => ['nullable', 'string'],
        ]);
    }

    private function canCreateDepartments(Request $request): bool
    {
        return $request->user()->hasAnyRole(['admin', 'jefe_departamento']);
    }

    private function canDeleteDepartments(Request $request): bool
    {
        return $request->user()->hasRole('admin');
    }
}
