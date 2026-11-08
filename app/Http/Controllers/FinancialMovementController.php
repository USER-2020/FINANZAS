<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\InteractsWithTenant;
use App\Models\FinancialMovement;
use App\Models\Department;
use App\Models\PaymentMethod;
use App\Models\PersonalCategory;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response as SymfonyResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
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
                $this->scopeToCurrentClient(
                    FinancialMovement::query()
                        ->with(['department:id,name', 'category:id,name', 'user:id,name'])
                        ->orderByDesc('movement_date')
                        ->orderByDesc('created_at'),
                    $request,
                ),
                $request,
            )->get(),
            'departments' => $this->tenantDepartments($request),
            'categories' => $this->scopeToAuthenticatedUser($this->scopeToCurrentClient(PersonalCategory::query()->where('type', 'Gasto')->orderBy('name'), $request), $request)->get(['id', 'name']),
            'paymentMethods' => PaymentMethod::query()
                ->where('is_active', true)
                ->orderBy('sort_order')
                ->orderBy('name')
                ->get(['id', 'name', 'code']),
        ]);
    }

    public function image(FinancialMovement $financialMovement): SymfonyResponse
    {
        $request = request();
        $this->ensureOperationalAccess($request);
        $this->ensureSameClient($financialMovement, $request);
        $this->ensureOwnedByAuthenticatedUser($financialMovement, $request);

        return $this->privateImageResponse($financialMovement->image_path);
    }

    public function store(Request $request)
    {
        $this->ensureOperationalAccess($request);
        $data = $this->validated($request);
        unset($data['image']);

        if ($request->hasFile('image')) {
            $data['source_hash'] = hash_file('sha256', $request->file('image')->getRealPath());
            abort_if(
                FinancialMovement::query()->where('user_id', $request->user()->id)->where('source_hash', $data['source_hash'])->exists(),
                422,
                'Esta factura ya fue registrada como movimiento.',
            );
        }

        if ($request->hasFile('image')) {
            $data['image_path'] = $request->file('image')->store('financial-movements/'.$request->user()->id, 'local');
        }

        DB::transaction(fn () => FinancialMovement::create([
            ...$data,
            'client_id' => $this->currentClientId($request),
            'user_id' => $request->user()->id,
        ]));

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
                Storage::disk('local')->delete($financialMovement->image_path);
                Storage::disk('public')->delete($financialMovement->image_path);
            }

            $data['image_path'] = $request->file('image')->store('financial-movements/'.$request->user()->id, 'local');
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
            Storage::disk('local')->delete($financialMovement->image_path);
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
            'category_id' => ['nullable', Rule::exists('personal_categories', 'id')->where(fn ($query) => $query->where('client_id', $this->currentClientId($request))->where('user_id', $request->user()->id))],
            'concept' => ['required', 'string', 'max:255'],
            'merchant_name' => ['nullable', 'string', 'max:255'],
            'invoice_number' => ['nullable', 'string', 'max:120'],
            'invoice_nit' => ['nullable', 'string', 'max:80'],
            'type' => ['required', Rule::in(['Ingreso', 'Gasto'])],
            'amount' => ['required', 'numeric', 'min:0'],
            'movement_date' => ['required', 'date'],
            'status' => ['required', 'string', 'max:50'],
            'payment_method' => ['nullable', 'string', 'max:100', Rule::exists('payment_methods', 'code')->where('is_active', true)],
            'account' => ['nullable', 'string', 'max:120'],
            'source_hash' => ['nullable', 'string', 'size:64'],
            'ocr_raw_text' => ['nullable', 'string', 'max:20000'],
            'ocr_confidence' => ['nullable', 'numeric', 'between:0,1'],
            'description' => ['nullable', 'string'],
            'image' => ['nullable', 'image', 'max:8192'],
        ]);
    }

    private function privateImageResponse(?string $path): SymfonyResponse
    {
        abort_unless($path, 404);

        $disk = Storage::disk('local');
        if (! $disk->exists($path)) {
            // Compatibilidad temporal con imágenes antiguas guardadas en public.
            $disk = Storage::disk('public');
        }

        abort_unless($disk->exists($path), 404);

        return $disk->response($path, null, [
            'Cache-Control' => 'private, no-store, max-age=0',
            'X-Content-Type-Options' => 'nosniff',
        ]);
    }
}
