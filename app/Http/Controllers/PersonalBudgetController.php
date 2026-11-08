<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\InteractsWithTenant;
use App\Models\PersonalBudget;
use App\Models\PersonalCategory;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class PersonalBudgetController extends Controller
{
    use InteractsWithTenant;

    public function index(Request $request): Response
    {
        $this->ensureOperationalAccess($request);
        return Inertia::render('Crud/PersonalBudgets', [
            'budgets' => $this->scopeToAuthenticatedUser($this->scopeToCurrentClient(PersonalBudget::query()->with('category:id,name')->latest(), $request), $request)->get(),
            'categories' => $this->categories($request),
        ]);
    }

    public function store(Request $request)
    {
        $this->ensureOperationalAccess($request);
        PersonalBudget::create([...$this->validated($request), 'client_id' => $this->currentClientId($request), 'user_id' => $request->user()->id]);
        return back()->with('success', 'Presupuesto creado.');
    }

    public function update(Request $request, PersonalBudget $budget)
    {
        $this->ensureOperationalAccess($request);
        $this->ensureSameClient($budget, $request);
        $this->ensureOwnedByAuthenticatedUser($budget, $request);
        $budget->update($this->validated($request));
        return back()->with('success', 'Presupuesto actualizado.');
    }

    public function destroy(PersonalBudget $budget)
    {
        $request = request();
        $this->ensureOperationalAccess($request);
        $this->ensureSameClient($budget, $request);
        $this->ensureOwnedByAuthenticatedUser($budget, $request);
        $budget->delete();
        return back()->with('success', 'Presupuesto eliminado.');
    }

    private function categories(Request $request)
    {
        return $this->scopeToAuthenticatedUser($this->scopeToCurrentClient(PersonalCategory::query()->where('type', 'Gasto')->orderBy('name'), $request), $request)->get(['id', 'name']);
    }

    private function validated(Request $request): array
    {
        return $request->validate([
            'category_id' => ['nullable', Rule::exists('personal_categories', 'id')->where(fn ($query) => $query->where('client_id', $this->currentClientId($request))->where('user_id', $request->user()->id))],
            'name' => ['required', 'string', 'max:160'],
            'amount' => ['required', 'numeric', 'min:0'],
            'period' => ['required', 'in:Semanal,Mensual,Anual'],
            'start_date' => ['required', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
            'status' => ['required', 'in:Activo,Pausado,Cerrado'],
        ]);
    }
}
