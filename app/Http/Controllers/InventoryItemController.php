<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\InteractsWithTenant;
use App\Models\InventoryItem;
use App\Models\Department;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class InventoryItemController extends Controller
{
    use InteractsWithTenant;

    public function index(Request $request): Response
    {
        $this->ensureOperationalAccess($request);

        return Inertia::render('Crud/InventoryItems', [
            'items' => $this->scopeToAuthenticatedUser(
                $this->scopeToCurrentClient(InventoryItem::query()->with(['department:id,name', 'user:id,name'])->latest(), $request),
                $request,
            )->get(),
            'departments' => $this->tenantDepartments($request),
        ]);
    }

    public function store(Request $request)
    {
        $this->ensureOperationalAccess($request);
        $data = $this->validated($request);
        unset($data['image']);

        if ($request->hasFile('image')) {
            $data['image_path'] = $request->file('image')->store('inventory-items', 'public');
        }

        InventoryItem::create([
            ...$data,
            'client_id' => $this->currentClientId($request),
            'user_id' => $request->user()->id,
        ]);

        return back()->with('success', 'Item de inventario creado.');
    }

    public function update(Request $request, InventoryItem $inventoryItem)
    {
        $this->ensureOperationalAccess($request);
        $this->ensureSameClient($inventoryItem, $request);
        $this->ensureOwnedByAuthenticatedUser($inventoryItem, $request);

        $data = $this->validated($request, $inventoryItem);
        unset($data['image']);

        if ($request->hasFile('image')) {
            if ($inventoryItem->image_path) {
                Storage::disk('public')->delete($inventoryItem->image_path);
            }

            $data['image_path'] = $request->file('image')->store('inventory-items', 'public');
        }

        $inventoryItem->update([
            ...$data,
            'user_id' => $request->user()->id,
        ]);

        return back()->with('success', 'Item de inventario actualizado.');
    }

    public function destroy(InventoryItem $inventoryItem)
    {
        $request = request();
        $this->ensureOperationalAccess($request);
        $this->ensureSameClient($inventoryItem, $request);
        $this->ensureOwnedByAuthenticatedUser($inventoryItem, $request);

        if ($inventoryItem->image_path) {
            Storage::disk('public')->delete($inventoryItem->image_path);
        }

        $inventoryItem->delete();

        return back()->with('success', 'Item de inventario eliminado.');
    }

    private function validated(Request $request, ?InventoryItem $inventoryItem = null): array
    {
        $departmentIds = $this->tenantDepartments($request)->pluck('id')->all();

        return $request->validate([
            'department_id' => ['nullable', Rule::in($departmentIds)],
            'name' => ['required', 'string', 'max:255'],
            'sku' => [
                'required',
                'string',
                'max:100',
                Rule::unique('inventory_items', 'sku')
                    ->ignore($inventoryItem)
                    ->where(fn ($query) => $query->where('client_id', $this->currentClientId($request))),
            ],
            'category' => ['nullable', 'string', 'max:100'],
            'quantity' => ['required', 'integer', 'min:0'],
            'minimum_stock' => ['required', 'integer', 'min:0'],
            'unit_cost' => ['required', 'numeric', 'min:0'],
            'location' => ['nullable', 'string', 'max:255'],
            'status' => ['required', 'string', 'max:50'],
            'notes' => ['nullable', 'string'],
            'image' => ['nullable', 'image', 'max:4096'],
        ]);
    }
}
