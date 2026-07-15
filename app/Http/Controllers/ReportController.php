<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\InteractsWithTenant;
use App\Models\Report;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ReportController extends Controller
{
    use InteractsWithTenant;

    public function index(Request $request): Response
    {
        $this->ensureOperationalAccess($request);

        return Inertia::render('Crud/Reports', [
            'reports' => $this->scopeToAuthenticatedUser(
                $this->scopeToCurrentClient(Report::query()->with('user:id,name')->latest(), $request),
                $request,
            )->get(),
        ]);
    }

    public function store(Request $request)
    {
        $this->ensureOperationalAccess($request);

        Report::create([
            ...$this->validated($request),
            'client_id' => $this->currentClientId($request),
            'user_id' => $request->user()->id,
            'generated_by' => $request->user()->name,
        ]);

        return back()->with('success', 'Reporte creado.');
    }

    public function update(Request $request, Report $report)
    {
        $this->ensureOperationalAccess($request);
        $this->ensureSameClient($report, $request);
        $this->ensureOwnedByAuthenticatedUser($report, $request);

        $report->update([
            ...$this->validated($request),
            'user_id' => $request->user()->id,
            'generated_by' => $request->user()->name,
        ]);

        return back()->with('success', 'Reporte actualizado.');
    }

    public function destroy(Report $report)
    {
        $request = request();
        $this->ensureOperationalAccess($request);
        $this->ensureSameClient($report, $request);
        $this->ensureOwnedByAuthenticatedUser($report, $request);

        $report->delete();

        return back()->with('success', 'Reporte eliminado.');
    }

    private function validated(Request $request): array
    {
        return $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'type' => ['required', 'string', 'max:100'],
            'period_start' => ['nullable', 'date'],
            'period_end' => ['nullable', 'date'],
            'status' => ['required', 'string', 'max:50'],
            'generated_by' => ['nullable', 'string', 'max:255'],
            'file_path' => ['nullable', 'string', 'max:255'],
            'notes' => ['nullable', 'string'],
        ]);
    }
}
