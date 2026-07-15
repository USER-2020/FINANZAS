<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\InteractsWithTenant;
use App\Models\Department;
use App\Models\Purchase;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class PurchaseController extends Controller
{
    use InteractsWithTenant;

    public function index(Request $request): Response
    {
        $this->ensureOperationalAccess($request);

        return Inertia::render('Crud/Purchases', [
            'purchases' => $this->scopeToAuthenticatedUser(
                $this->scopeToCurrentClient(Purchase::query()->with(['department:id,name', 'user:id,name'])->latest(), $request),
                $request,
            )->get(),
            'departments' => $this->tenantDepartments($request),
        ]);
    }

    public function store(Request $request)
    {
        $this->ensureOperationalAccess($request);

        Purchase::create([
            ...$this->validated($request),
            'client_id' => $this->currentClientId($request),
            'user_id' => $request->user()->id,
        ]);

        return back()->with('success', 'Compra creada.');
    }

    public function update(Request $request, Purchase $purchase)
    {
        $this->ensureOperationalAccess($request);
        $this->ensureSameClient($purchase, $request);
        $this->ensureOwnedByAuthenticatedUser($purchase, $request);

        $purchase->update([
            ...$this->validated($request),
            'user_id' => $request->user()->id,
        ]);

        return back()->with('success', 'Compra actualizada.');
    }

    public function destroy(Purchase $purchase)
    {
        $request = request();
        $this->ensureOperationalAccess($request);
        $this->ensureSameClient($purchase, $request);
        $this->ensureOwnedByAuthenticatedUser($purchase, $request);

        $purchase->delete();

        return back()->with('success', 'Compra eliminada.');
    }

    private function validated(Request $request): array
    {
        $departmentIds = $this->tenantDepartments($request)->pluck('id')->all();

        $data = $request->validate([
            'department_id' => ['nullable', Rule::in($departmentIds)],
            'item' => ['required', 'string', 'max:255'],
            'supplier' => ['nullable', 'string', 'max:255'],
            'quantity' => ['required', 'integer', 'min:1'],
            'unit_price' => ['required', 'numeric', 'min:0'],
            'requested_at' => ['required', 'date'],
            'expected_at' => ['nullable', 'date'],
            'status' => ['required', 'string', 'max:50'],
            'notes' => ['nullable', 'string'],
        ]);

        $data['total_amount'] = $data['quantity'] * $data['unit_price'];

        return $data;
    }
}
