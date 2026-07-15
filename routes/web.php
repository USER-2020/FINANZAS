<?php

use App\Models\Department;
use App\Models\Client;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\AdminModuleAccessController;
use App\Http\Controllers\FinancialMovementController;
use App\Http\Controllers\InventoryItemController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PurchaseController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\SitemapController;
use App\Http\Controllers\SuperAdminVideoController;
use App\Http\Controllers\UserController;
use App\Models\FinancialMovement;
use App\Models\InventoryItem;
use App\Models\Purchase;
use App\Models\User;
use App\Support\LoginMetrics;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    if (Auth::check()) {
        return redirect()->route('dashboard');
    }

    return Inertia::render('Auth/Login', [
        'canResetPassword' => Route::has('password.request'),
        'loginMetrics' => LoginMetrics::make(),
        'status' => session('status'),
    ]);
});

Route::get('/sitemap.xml', [SitemapController::class, 'index'])->name('sitemap');
Route::get('/videos/share/{video}', [SuperAdminVideoController::class, 'showPublic'])->name('videos.share.show');

Route::get('/dashboard', function (Request $request) {
    $user = Auth::user();

    if ($user->hasRole('super_admin')) {
        return Inertia::render('Dashboard', [
            'isSuperAdmin' => true,
            'superAdminMetrics' => [
                'clients' => Client::query()->count(),
                'users' => User::query()->count(),
                'tenantUsers' => User::query()->whereNotNull('client_id')->count(),
                'superAdmins' => User::role('super_admin')->count(),
            ],
        ]);
    }

    $allowedPeriods = ['all', 'weekly', 'monthly', 'yearly', 'custom'];
    $period = in_array($request->string('period')->value(), $allowedPeriods, true)
        ? $request->string('period')->value()
        : 'monthly';

    $dateFrom = $request->string('from')->value();
    $dateTo = $request->string('to')->value();

    $rangeStart = null;
    $rangeEnd = null;
    $periodLabel = 'Mensual';

    try {
        if ($period === 'weekly') {
            $rangeStart = now()->startOfWeek(Carbon::MONDAY);
            $rangeEnd = now()->endOfWeek(Carbon::SUNDAY);
            $periodLabel = 'Semanal';
        } elseif ($period === 'monthly') {
            $rangeStart = now()->startOfMonth();
            $rangeEnd = now()->endOfMonth();
            $periodLabel = 'Mensual';
        } elseif ($period === 'yearly') {
            $rangeStart = now()->startOfYear();
            $rangeEnd = now()->endOfYear();
            $periodLabel = 'Anual';
        } elseif ($period === 'custom') {
            $rangeStart = $dateFrom ? Carbon::parse($dateFrom)->startOfDay() : null;
            $rangeEnd = $dateTo ? Carbon::parse($dateTo)->endOfDay() : null;
            $periodLabel = 'Rango personalizado';
        } else {
            $periodLabel = 'Todas';
        }
    } catch (\Throwable) {
        $period = 'monthly';
        $rangeStart = now()->startOfMonth();
        $rangeEnd = now()->endOfMonth();
        $dateFrom = '';
        $dateTo = '';
        $periodLabel = 'Mensual';
    }

    $applyDateRange = function ($query, string $column) use ($rangeStart, $rangeEnd) {
        if ($rangeStart) {
            $query->where($column, '>=', $rangeStart->toDateString());
        }

        if ($rangeEnd) {
            $query->where($column, '<=', $rangeEnd->toDateString());
        }

        return $query;
    };

    $clientId = $user->client_id;
    $userId = $user->id;
    $movementsQuery = FinancialMovement::query()
        ->where('client_id', $clientId)
        ->where('user_id', $userId);

    $periodIncome = (float) $applyDateRange(
        (clone $movementsQuery)->where('type', 'Ingreso'),
        'movement_date',
    )->sum('amount');

    $previousPeriodIncome = 0;

    if ($rangeStart && $rangeEnd) {
        $periodDays = $rangeStart->diffInDays($rangeEnd) + 1;
        $previousRangeStart = $rangeStart->copy()->subDays($periodDays);
        $previousRangeEnd = $rangeStart->copy()->subDay();

        $previousPeriodIncome = (float) (clone $movementsQuery)
            ->where('type', 'Ingreso')
            ->whereBetween('movement_date', [$previousRangeStart->toDateString(), $previousRangeEnd->toDateString()])
            ->sum('amount');
    }

    $periodExpenses = (float) $applyDateRange(
        (clone $movementsQuery)->where('type', 'Gasto'),
        'movement_date',
    )->sum('amount');

    $pendingPurchases = $applyDateRange(
        Purchase::query()->where('client_id', $clientId)->where('user_id', $userId)->where('status', 'Pendiente'),
        'requested_at',
    );
    $pendingPurchasesAmount = (float) (clone $pendingPurchases)->sum('total_amount');
    $pendingPurchasesCount = (clone $pendingPurchases)->count();
    $lowInventoryCount = InventoryItem::query()
        ->where('client_id', $clientId)
        ->where('user_id', $userId)
        ->whereColumn('quantity', '<=', 'minimum_stock')
        ->count();
    $totalBudget = (float) Department::query()->where('client_id', $clientId)->sum('monthly_budget');

    if ($period === 'all') {
        $chartStart = now()->startOfMonth()->subMonths(5);
        $chartEnd = now()->endOfMonth();
        $chartBucket = 'month';
    } elseif ($period === 'yearly') {
        $chartStart = now()->startOfYear();
        $chartEnd = now()->endOfYear();
        $chartBucket = 'month';
    } elseif ($period === 'weekly') {
        $chartStart = now()->startOfWeek(Carbon::MONDAY);
        $chartEnd = now()->endOfWeek(Carbon::SUNDAY);
        $chartBucket = 'day';
    } elseif ($period === 'custom') {
        $chartStart = $rangeStart?->copy() ?? now()->startOfMonth();
        $chartEnd = $rangeEnd?->copy() ?? now()->endOfMonth();
        $chartBucket = $chartStart->diffInDays($chartEnd) > 62 ? 'month' : 'day';
    } else {
        $chartStart = now()->startOfMonth();
        $chartEnd = now()->endOfMonth();
        $chartBucket = 'day';
    }

    $chartMovements = FinancialMovement::query()
        ->where('client_id', $clientId)
        ->where('user_id', $userId)
        ->whereBetween('movement_date', [$chartStart->toDateString(), $chartEnd->toDateString()])
        ->get(['type', 'amount', 'movement_date']);

    $groupedChartMovements = $chartMovements->groupBy(function (FinancialMovement $movement) use ($chartBucket) {
        return $chartBucket === 'month'
            ? $movement->movement_date->format('Y-m')
            : $movement->movement_date->format('Y-m-d');
    });

    $cashFlow = collect();
    $cursor = $chartBucket === 'month' ? $chartStart->copy()->startOfMonth() : $chartStart->copy()->startOfDay();

    while ($cursor <= $chartEnd) {
        $key = $chartBucket === 'month' ? $cursor->format('Y-m') : $cursor->format('Y-m-d');
        $rows = $groupedChartMovements->get($key, collect());

        $cashFlow->push([
            'month' => $chartBucket === 'month'
                ? $cursor->copy()->locale('es')->isoFormat('MMM')
                : $cursor->copy()->locale('es')->isoFormat('DD MMM'),
            'ingresos' => (float) $rows->where('type', 'Ingreso')->sum('amount'),
            'gastos' => (float) $rows->where('type', 'Gasto')->sum('amount'),
        ]);

        $cursor = $chartBucket === 'month' ? $cursor->addMonth() : $cursor->addDay();
    }

    $sectors = Department::query()
        ->where('departments.client_id', $clientId)
        ->leftJoin('financial_movements', function ($join) use ($rangeStart, $rangeEnd) {
            $join->on('departments.id', '=', 'financial_movements.department_id')
                ->whereColumn('financial_movements.client_id', 'departments.client_id')
                ->where('financial_movements.user_id', Auth::id())
                ->where('financial_movements.type', 'Gasto');

            if ($rangeStart) {
                $join->where('financial_movements.movement_date', '>=', $rangeStart->toDateString());
            }

            if ($rangeEnd) {
                $join->where('financial_movements.movement_date', '<=', $rangeEnd->toDateString());
            }
        })
        ->select('departments.name')
        ->selectRaw('COALESCE(SUM(financial_movements.amount), 0) as value')
        ->groupBy('departments.id', 'departments.name')
        ->havingRaw('value > 0')
        ->orderByDesc('value')
        ->limit(6)
        ->get();

    $latestMovements = FinancialMovement::query()
        ->where('client_id', $clientId)
        ->where('user_id', $userId)
        ->with('department:id,name')
        ->when($rangeStart, fn ($query) => $query->where('movement_date', '>=', $rangeStart->toDateString()))
        ->when($rangeEnd, fn ($query) => $query->where('movement_date', '<=', $rangeEnd->toDateString()))
        ->latest('movement_date')
        ->limit(8)
        ->get(['id', 'department_id', 'concept', 'amount', 'status', 'movement_date']);

    return Inertia::render('Dashboard', [
        'metrics' => [
            'monthlyIncome' => $periodIncome,
            'previousMonthlyIncome' => $previousPeriodIncome,
            'monthlyExpenses' => $periodExpenses,
            'pendingPurchasesAmount' => $pendingPurchasesAmount,
            'pendingPurchasesCount' => $pendingPurchasesCount,
            'netFlow' => $periodIncome - $periodExpenses,
            'totalBudget' => $totalBudget,
            'lowInventoryCount' => $lowInventoryCount,
        ],
        'cashFlow' => $cashFlow,
        'sectors' => $sectors,
        'latestMovements' => $latestMovements,
        'filters' => [
            'period' => $period,
            'from' => $dateFrom,
            'to' => $dateTo,
            'label' => $periodLabel,
        ],
        'departments' => Department::query()
            ->where('client_id', $clientId)
            ->withSum([
                'financialMovements as spent' => fn ($query) => $query
                    ->where('client_id', $clientId)
                    ->where('user_id', $userId)
                    ->where('type', 'Gasto')
                    ->when($rangeStart, fn ($query) => $query->where('movement_date', '>=', $rangeStart->toDateString()))
                    ->when($rangeEnd, fn ($query) => $query->where('movement_date', '<=', $rangeEnd->toDateString())),
            ], 'amount')
            ->orderBy('name')
            ->get(['id', 'name', 'manager', 'monthly_budget', 'status']),
    ]);
})->middleware(['auth', 'active', 'menu', 'verified'])->name('dashboard');

Route::middleware(['auth', 'active', 'menu'])->group(function () {
    Route::resource('clients', ClientController::class)->except(['create', 'show', 'edit']);
    Route::get('admin-videos', [SuperAdminVideoController::class, 'index'])->name('admin-videos.index');
    Route::get('module-access', [AdminModuleAccessController::class, 'index'])->name('module-access.index');
    Route::put('module-access/{user}', [AdminModuleAccessController::class, 'update'])->name('module-access.update');
    Route::post('departments/import-templates', [DepartmentController::class, 'importTemplates'])->name('departments.import-templates');
    Route::resource('departments', DepartmentController::class)->except(['create', 'show', 'edit']);
    Route::resource('financial-movements', FinancialMovementController::class)->except(['create', 'show', 'edit']);
    Route::resource('purchases', PurchaseController::class)->except(['create', 'show', 'edit']);
    Route::resource('inventory-items', InventoryItemController::class)->except(['create', 'show', 'edit']);
    Route::resource('reports', ReportController::class)->except(['create', 'show', 'edit']);
    Route::resource('users', UserController::class)->except(['create', 'show', 'edit']);

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
