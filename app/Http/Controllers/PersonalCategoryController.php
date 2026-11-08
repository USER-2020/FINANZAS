<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\InteractsWithTenant;
use App\Models\PersonalCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PersonalCategoryController extends Controller
{
    use InteractsWithTenant;

    public function index(Request $request): Response
    {
        $this->ensureOperationalAccess($request);

        return Inertia::render('Crud/PersonalCategories', [
            'categories' => $this->scopeToAuthenticatedUser($this->scopeToCurrentClient(PersonalCategory::query()->latest(), $request), $request)->get(),
        ]);
    }

    public function store(Request $request)
    {
        $this->ensureOperationalAccess($request);
        PersonalCategory::create([...$this->validated($request), 'client_id' => $this->currentClientId($request), 'user_id' => $request->user()->id]);
        return back()->with('success', 'Categoría creada.');
    }

    public function update(Request $request, PersonalCategory $category)
    {
        $this->ensureOperationalAccess($request);
        $this->ensureSameClient($category, $request);
        $this->ensureOwnedByAuthenticatedUser($category, $request);
        $category->update($this->validated($request));
        return back()->with('success', 'Categoría actualizada.');
    }

    public function destroy(PersonalCategory $category)
    {
        $request = request();
        $this->ensureOperationalAccess($request);
        $this->ensureSameClient($category, $request);
        $this->ensureOwnedByAuthenticatedUser($category, $request);
        $category->delete();
        return back()->with('success', 'Categoría eliminada.');
    }

    private function validated(Request $request): array
    {
        return $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'type' => ['required', 'in:Ingreso,Gasto'],
            'color' => ['required', 'string', 'max:20'],
            'status' => ['required', 'string', 'max:50'],
            'notes' => ['nullable', 'string'],
        ]);
    }
}
