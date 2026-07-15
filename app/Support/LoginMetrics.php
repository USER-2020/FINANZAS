<?php

namespace App\Support;

use App\Models\Client;
use App\Models\Department;
use App\Models\FinancialMovement;
use App\Models\User;

class LoginMetrics
{
    public static function make(): array
    {
        $monthStart = now()->startOfMonth()->toDateString();
        $monthEnd = now()->endOfMonth()->toDateString();

        $monthlyIncome = (float) FinancialMovement::query()
            ->where('type', 'Ingreso')
            ->whereBetween('movement_date', [$monthStart, $monthEnd])
            ->sum('amount');

        $monthlyExpenses = (float) FinancialMovement::query()
            ->where('type', 'Gasto')
            ->whereBetween('movement_date', [$monthStart, $monthEnd])
            ->sum('amount');

        return [
            'clients' => Client::query()->where('status', 'Activo')->count(),
            'users' => User::query()->whereNotNull('client_id')->where('status', 'Activo')->count(),
            'departments' => Department::query()->count(),
            'movements' => FinancialMovement::query()->count(),
            'monthlyIncome' => $monthlyIncome,
            'monthlyExpenses' => $monthlyExpenses,
            'monthlyNetFlow' => $monthlyIncome - $monthlyExpenses,
        ];
    }
}
