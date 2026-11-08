<?php

return [
    'superadmin' => [
        ['key' => 'dashboard', 'label' => 'Dashboard', 'href' => '/dashboard', 'icon' => 'LayoutDashboard'],
        ['key' => 'clients', 'label' => 'Clientes', 'href' => '/clients', 'icon' => 'BriefcaseBusiness'],
        ['key' => 'users', 'label' => 'Usuarios', 'href' => '/users', 'icon' => 'Users'],
        ['key' => 'admin-videos', 'label' => 'Videos', 'href' => '/admin-videos', 'icon' => 'Clapperboard'],
        ['key' => 'module-access', 'label' => 'Accesos', 'href' => '/module-access', 'icon' => 'ShieldCheck'],
    ],
    'tenant' => [
        ['key' => 'dashboard', 'label' => 'Dashboard', 'href' => '/dashboard', 'icon' => 'LayoutDashboard'],
        ['key' => 'financial-movements', 'label' => 'Movimientos', 'href' => '/financial-movements', 'icon' => 'WalletCards'],
        ['key' => 'budgets', 'label' => 'Presupuestos', 'href' => '/budgets', 'icon' => 'Target'],
        ['key' => 'savings-goals', 'label' => 'Metas de ahorro', 'href' => '/savings-goals', 'icon' => 'PiggyBank'],
        ['key' => 'recurring-transactions', 'label' => 'Recurrentes', 'href' => '/recurring-transactions', 'icon' => 'RefreshCw'],
        ['key' => 'categories', 'label' => 'Categorías', 'href' => '/categories', 'icon' => 'Tags'],
        ['key' => 'reports', 'label' => 'Reportes', 'href' => '/reports', 'icon' => 'BarChart3'],
        ['key' => 'cash-counter', 'label' => 'Contar efectivo', 'href' => '/cash-counter', 'icon' => 'Banknote'],
        ['key' => 'departments', 'label' => 'Operación avanzada', 'href' => '/departments', 'icon' => 'Building2'],
    ],
];
