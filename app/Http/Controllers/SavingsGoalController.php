<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\InteractsWithTenant;
use App\Models\SavingsGoal;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SavingsGoalController extends Controller
{
    use InteractsWithTenant;

    public function index(Request $request): Response
    {
        $this->ensureOperationalAccess($request);
        return Inertia::render('Crud/SavingsGoals', ['goals' => $this->scopeToAuthenticatedUser($this->scopeToCurrentClient(SavingsGoal::query()->latest(), $request), $request)->get()]);
    }

    public function store(Request $request)
    {
        $this->ensureOperationalAccess($request);
        SavingsGoal::create([...$this->validated($request), 'client_id' => $this->currentClientId($request), 'user_id' => $request->user()->id]);
        return back()->with('success', 'Meta de ahorro creada.');
    }

    public function update(Request $request, SavingsGoal $savingsGoal)
    {
        $this->ensureOperationalAccess($request);
        $this->ensureSameClient($savingsGoal, $request);
        $this->ensureOwnedByAuthenticatedUser($savingsGoal, $request);
        $savingsGoal->update($this->validated($request));
        return back()->with('success', 'Meta actualizada.');
    }

    public function destroy(SavingsGoal $savingsGoal)
    {
        $request = request();
        $this->ensureOperationalAccess($request);
        $this->ensureSameClient($savingsGoal, $request);
        $this->ensureOwnedByAuthenticatedUser($savingsGoal, $request);
        $savingsGoal->delete();
        return back()->with('success', 'Meta eliminada.');
    }

    private function validated(Request $request): array
    {
        return $request->validate([
            'name' => ['required', 'string', 'max:160'],
            'target_amount' => ['required', 'numeric', 'min:0'],
            'current_amount' => ['required', 'numeric', 'min:0'],
            'target_date' => ['nullable', 'date'],
            'status' => ['required', 'in:Activa,Pausada,Completada'],
            'notes' => ['nullable', 'string'],
        ]);
    }
}
