<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\InteractsWithTenant;
use App\Models\PersonalCategory;
use App\Models\RecurringTransaction;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class RecurringTransactionController extends Controller
{
    use InteractsWithTenant;

    public function index(Request $request): Response
    {
        $this->ensureOperationalAccess($request);
        return Inertia::render('Crud/RecurringTransactions', [
            'recurringTransactions' => $this->scopeToAuthenticatedUser($this->scopeToCurrentClient(RecurringTransaction::query()->with('category:id,name')->latest(), $request), $request)->get(),
            'categories' => $this->scopeToAuthenticatedUser($this->scopeToCurrentClient(PersonalCategory::query()->where('type', 'Gasto')->orderBy('name'), $request), $request)->get(['id', 'name']),
        ]);
    }

    public function store(Request $request)
    {
        $this->ensureOperationalAccess($request);
        RecurringTransaction::create([...$this->validated($request), 'client_id' => $this->currentClientId($request), 'user_id' => $request->user()->id]);
        return back()->with('success', 'Movimiento recurrente creado.');
    }

    public function update(Request $request, RecurringTransaction $recurringTransaction)
    {
        $this->ensureOperationalAccess($request);
        $this->ensureSameClient($recurringTransaction, $request);
        $this->ensureOwnedByAuthenticatedUser($recurringTransaction, $request);
        $recurringTransaction->update($this->validated($request));
        return back()->with('success', 'Movimiento recurrente actualizado.');
    }

    public function destroy(RecurringTransaction $recurringTransaction)
    {
        $request = request();
        $this->ensureOperationalAccess($request);
        $this->ensureSameClient($recurringTransaction, $request);
        $this->ensureOwnedByAuthenticatedUser($recurringTransaction, $request);
        $recurringTransaction->delete();
        return back()->with('success', 'Movimiento recurrente eliminado.');
    }

    private function validated(Request $request): array
    {
        return $request->validate([
            'category_id' => ['nullable', Rule::exists('personal_categories', 'id')->where(fn ($query) => $query->where('client_id', $this->currentClientId($request))->where('user_id', $request->user()->id))],
            'concept' => ['required', 'string', 'max:160'],
            'type' => ['required', 'in:Ingreso,Gasto'],
            'amount' => ['required', 'numeric', 'min:0'],
            'frequency' => ['required', 'in:Semanal,Mensual,Anual'],
            'next_date' => ['required', 'date'],
            'account' => ['nullable', 'string', 'max:120'],
            'status' => ['required', 'in:Activo,Pausado'],
            'notes' => ['nullable', 'string'],
        ]);
    }
}
