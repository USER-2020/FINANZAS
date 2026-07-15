<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\InteractsWithTenant;
use App\Models\FinancialMovement;
use App\Models\Department;
use App\Models\PaymentMethod;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class FinancialMovementController extends Controller
{
    use InteractsWithTenant;

    public function index(Request $request): Response
    {
        $this->ensureOperationalAccess($request);

        return Inertia::render('Crud/FinancialMovements', [
            'movements' => $this->scopeToAuthenticatedUser(
                $this->scopeToCurrentClient(FinancialMovement::query()->with(['department:id,name', 'user:id,name'])->latest(), $request),
                $request,
            )->get(),
            'departments' => $this->tenantDepartments($request),
            'paymentMethods' => PaymentMethod::query()
                ->where('is_active', true)
                ->orderBy('sort_order')
                ->orderBy('name')
                ->get(['id', 'name', 'code']),
        ]);
    }

    public function store(Request $request)
    {
        $this->ensureOperationalAccess($request);
        $data = $this->validated($request);
        unset($data['image']);

        if ($request->hasFile('image')) {
            $data['image_path'] = $request->file('image')->store('financial-movements', 'public');
        }

        FinancialMovement::create([
            ...$data,
            'client_id' => $this->currentClientId($request),
            'user_id' => $request->user()->id,
        ]);

        return back()->with('success', 'Movimiento creado.');
    }

    public function update(Request $request, FinancialMovement $financialMovement)
    {
        $this->ensureOperationalAccess($request);
        $this->ensureSameClient($financialMovement, $request);
        $this->ensureOwnedByAuthenticatedUser($financialMovement, $request);

        $data = $this->validated($request);
        unset($data['image']);

        if ($request->hasFile('image')) {
            if ($financialMovement->image_path) {
                Storage::disk('public')->delete($financialMovement->image_path);
            }

            $data['image_path'] = $request->file('image')->store('financial-movements', 'public');
        }

        $financialMovement->update([
            ...$data,
            'user_id' => $request->user()->id,
        ]);

        return back()->with('success', 'Movimiento actualizado.');
    }

    public function destroy(FinancialMovement $financialMovement)
    {
        $request = request();
        $this->ensureOperationalAccess($request);
        $this->ensureSameClient($financialMovement, $request);
        $this->ensureOwnedByAuthenticatedUser($financialMovement, $request);

        if ($financialMovement->image_path) {
            Storage::disk('public')->delete($financialMovement->image_path);
        }

        $financialMovement->delete();

        return back()->with('success', 'Movimiento eliminado.');
    }

    private function validated(Request $request): array
    {
        $departmentIds = $this->tenantDepartments($request)->pluck('id')->all();

        return $request->validate([
            'department_id' => ['nullable', Rule::in($departmentIds)],
            'concept' => ['required', 'string', 'max:255'],
            'type' => ['required', Rule::in(['Ingreso', 'Gasto'])],
            'amount' => ['required', 'numeric', 'min:0'],
            'movement_date' => ['required', 'date'],
            'status' => ['required', 'string', 'max:50'],
            'payment_method' => ['nullable', 'string', 'max:100', Rule::exists('payment_methods', 'code')->where('is_active', true)],
            'description' => ['nullable', 'string'],
            'image' => ['nullable', 'image', 'max:4096'],
        ]);
    }
}
