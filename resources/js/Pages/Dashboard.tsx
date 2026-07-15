import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { type ColumnDef } from '@tanstack/react-table';
import { AlertTriangle, ArrowDownRight, ArrowUpRight, Building2, Package, ShieldCheck, Users, WalletCards } from 'lucide-react';
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, Tooltip as ChartTooltip, XAxis, YAxis } from 'recharts';
import { AppLayout } from '@/Components/layout/AppLayout';
import { FinancialCard } from '@/Components/dashboard/FinancialCard';
import { BudgetProgress } from '@/Components/dashboard/BudgetProgress';
import { DataTable } from '@/Components/data-table/DataTable';
import { DataTableFilters } from '@/Components/data-table/DataTableFilters';
import { MoneyDisplay } from '@/Components/shared/MoneyDisplay';
import { EmptyState } from '@/Components/shared/EmptyState';
import { PageHeader } from '@/Components/shared/PageHeader';
import { QuickActionMenu } from '@/Components/shared/QuickActionMenu';
import { SectionTitle } from '@/Components/shared/SectionTitle';
import { StatusBadge } from '@/Components/shared/StatusBadge';
import { DateTimePicker } from '@/Components/shared/DateTimePicker';
import { Alert, AlertDescription, AlertTitle } from '@/Components/ui/alert';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs';
import { formatDate } from '@/lib/format';
import { PageProps } from '@/types';

type Movement = {
    id: number;
    concept: string;
    department?: {
        name: string;
    } | null;
    amount: number | string;
    status: string;
    movement_date: string;
};

type DashboardDepartment = {
    id: number;
    name: string;
    manager?: string | null;
    monthly_budget: number | string;
    status: string;
    spent?: number | string | null;
};

type DashboardMetrics = {
    monthlyIncome: number | string;
    previousMonthlyIncome: number | string;
    monthlyExpenses: number | string;
    pendingPurchasesAmount: number | string;
    pendingPurchasesCount: number;
    netFlow: number | string;
    totalBudget: number | string;
    lowInventoryCount: number;
};

type SuperAdminMetrics = {
    clients: number;
    users: number;
    tenantUsers: number;
    superAdmins: number;
};

type ChartPoint = {
    month: string;
    ingresos: number | string;
    gastos: number | string;
};

type SectorPoint = {
    name: string;
    value: number | string;
};

type DashboardFilters = {
    period: 'all' | 'weekly' | 'monthly' | 'yearly' | 'custom';
    from: string;
    to: string;
    label: string;
};

const periodOptions = [
    { label: 'Todas', value: 'all' },
    { label: 'Semanal', value: 'weekly' },
    { label: 'Mensual', value: 'monthly' },
    { label: 'Anual', value: 'yearly' },
    { label: 'Rango de fechas', value: 'custom' },
] as const;

const columns: ColumnDef<Movement>[] = [
    { accessorKey: 'concept', header: 'Movimiento' },
    { accessorKey: 'department.name', header: 'Departamento', cell: ({ row }) => row.original.department?.name ?? '-' },
    { accessorKey: 'amount', header: 'Valor', cell: ({ row }) => <MoneyDisplay value={Number(row.original.amount)} /> },
    { accessorKey: 'status', header: 'Estado', cell: ({ row }) => <StatusBadge status={row.original.status} /> },
    { accessorKey: 'movement_date', header: 'Fecha', cell: ({ row }) => formatDate(row.original.movement_date) },
    { id: 'actions', cell: () => <QuickActionMenu /> },
];

const emptyMetrics: DashboardMetrics = {
    monthlyIncome: 0,
    previousMonthlyIncome: 0,
    monthlyExpenses: 0,
    pendingPurchasesAmount: 0,
    pendingPurchasesCount: 0,
    netFlow: 0,
    totalBudget: 0,
    lowInventoryCount: 0,
};

function incomeDetail(currentIncome: number, previousIncome: number) {
    if (previousIncome <= 0) {
        return currentIncome > 0 ? 'Sin comparativo del periodo anterior' : 'Sin ingresos para el filtro seleccionado';
    }

    const variation = ((currentIncome - previousIncome) / previousIncome) * 100;
    const sign = variation >= 0 ? '+' : '';

    return `${sign}${variation.toFixed(1)}% vs periodo anterior`;
}

function budgetDetail(expenses: number, budget: number) {
    if (budget <= 0) {
        return 'Sin presupuesto configurado';
    }

    return `${Math.round((expenses / budget) * 100)}% del presupuesto disponible`;
}

function netFlowDetail(netFlow: number) {
    if (netFlow > 0) {
        return 'Margen operativo positivo';
    }

    if (netFlow < 0) {
        return 'Flujo negativo en el periodo';
    }

    return 'Ingresos y gastos equilibrados';
}

export default function Dashboard({
    auth,
    departments = [],
    metrics = emptyMetrics,
    cashFlow = [],
    sectors = [],
    latestMovements = [],
    isSuperAdmin = false,
    superAdminMetrics,
    filters = { period: 'monthly', from: '', to: '', label: 'Mensual' },
}: PageProps<{
    departments: DashboardDepartment[];
    metrics: DashboardMetrics;
    cashFlow: ChartPoint[];
    sectors: SectorPoint[];
    latestMovements: Movement[];
    isSuperAdmin?: boolean;
    superAdminMetrics?: SuperAdminMetrics;
    filters?: DashboardFilters;
}>) {
    if (isSuperAdmin && superAdminMetrics) {
        return (
            <AppLayout user={auth.user}>
                <Head title="Dashboard" />

                <div className="mx-auto flex max-w-7xl flex-col gap-6">
                    <PageHeader title="Panel superadmin" description="Vista global para administrar tenants, usuarios y acceso central." />

                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                        <FinancialCard title="Clientes activos" amount={superAdminMetrics.clients} detail="Tenants registrados en la plataforma" />
                        <FinancialCard title="Usuarios totales" amount={superAdminMetrics.users} detail="Incluye operadores y administradores" />
                        <FinancialCard title="Usuarios por cliente" amount={superAdminMetrics.tenantUsers} detail="Accesos ligados a tenants" />
                        <FinancialCard title="Superadmins" amount={superAdminMetrics.superAdmins} detail="Accesos exclusivos de control global" />
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Gobierno de plataforma</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4 md:grid-cols-3">
                            <Alert>
                                <Users className="h-4 w-4" />
                                <AlertTitle>Usuarios centralizados</AlertTitle>
                                <AlertDescription>Crea y segmenta usuarios por cliente desde el modulo de usuarios.</AlertDescription>
                            </Alert>
                            <Alert>
                                <Building2 className="h-4 w-4" />
                                <AlertTitle>Tenants aislados</AlertTitle>
                                <AlertDescription>Cada cliente mantiene sus propios datos y flujos operativos.</AlertDescription>
                            </Alert>
                            <Alert>
                                <ShieldCheck className="h-4 w-4" />
                                <AlertTitle>Acceso restringido</AlertTitle>
                                <AlertDescription>El superadmin no participa en movimientos operativos ni inventario.</AlertDescription>
                            </Alert>
                        </CardContent>
                    </Card>
                </div>
            </AppLayout>
        );
    }

    const monthlyIncome = Number(metrics.monthlyIncome ?? 0);
    const previousMonthlyIncome = Number(metrics.previousMonthlyIncome ?? 0);
    const monthlyExpenses = Number(metrics.monthlyExpenses ?? 0);
    const pendingPurchasesAmount = Number(metrics.pendingPurchasesAmount ?? 0);
    const pendingPurchasesCount = Number(metrics.pendingPurchasesCount ?? 0);
    const netFlow = Number(metrics.netFlow ?? 0);
    const totalBudget = Number(metrics.totalBudget ?? 0);
    const lowInventoryCount = Number(metrics.lowInventoryCount ?? 0);

    const [periodFilter, setPeriodFilter] = useState<DashboardFilters['period']>(filters.period);
    const [dateFrom, setDateFrom] = useState(filters.from);
    const [dateTo, setDateTo] = useState(filters.to);

    function applyFilters() {
        router.get(
            '/dashboard',
            {
                period: periodFilter,
                from: periodFilter === 'custom' ? dateFrom : '',
                to: periodFilter === 'custom' ? dateTo : '',
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    }

    function clearFilters() {
        setPeriodFilter('monthly');
        setDateFrom('');
        setDateTo('');

        router.get(
            '/dashboard',
            { period: 'monthly' },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    }

    return (
        <AppLayout user={auth.user}>
            <Head title="Dashboard" />

            <div className="mx-auto flex max-w-7xl flex-col gap-6">
                <PageHeader
                    title="Dashboard financiero"
                    description="Resumen operativo, compras pendientes, alertas e inventario critico."
                    actions={
                        <Button asChild>
                            <Link href="/financial-movements?create=1">Nuevo movimiento</Link>
                        </Button>
                    }
                />

                <DataTableFilters>
                    <div className="space-y-2">
                        <span className="text-xs font-medium uppercase tracking-normal text-muted-foreground">Periodo</span>
                        <Select value={periodFilter} onValueChange={(value) => setPeriodFilter(value as DashboardFilters['period'])}>
                            <SelectTrigger>
                                <SelectValue placeholder="Seleccionar periodo" />
                            </SelectTrigger>
                            <SelectContent>
                                {periodOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <span className="text-xs font-medium uppercase tracking-normal text-muted-foreground">Desde</span>
                        <DateTimePicker value={dateFrom} disabled={periodFilter !== 'custom'} onChange={setDateFrom} placeholder="dd/mm/aaaa" />
                    </div>

                    <div className="space-y-2">
                        <span className="text-xs font-medium uppercase tracking-normal text-muted-foreground">Hasta</span>
                        <DateTimePicker value={dateTo} disabled={periodFilter !== 'custom'} onChange={setDateTo} placeholder="dd/mm/aaaa" />
                    </div>

                    <div className="flex items-end gap-2">
                        <Button type="button" variant="outline" className="w-full" onClick={clearFilters}>
                            Limpiar
                        </Button>
                        <Button type="button" className="w-full" onClick={applyFilters}>
                            Filtrar
                        </Button>
                    </div>
                </DataTableFilters>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <FinancialCard title="Ingresos del periodo" amount={monthlyIncome} detail={`${filters.label}. ${incomeDetail(monthlyIncome, previousMonthlyIncome)}`} />
                    <FinancialCard title="Gastos del periodo" amount={monthlyExpenses} detail={`${filters.label}. ${budgetDetail(monthlyExpenses, totalBudget)}`} />
                    <FinancialCard title="Compras pendientes" amount={pendingPurchasesAmount} detail={`${pendingPurchasesCount} solicitudes por aprobar`} />
                    <FinancialCard title="Flujo neto del periodo" amount={netFlow} detail={`${filters.label}. ${netFlowDetail(netFlow)}`} />
                </div>

                <Tabs defaultValue="general" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="general">General</TabsTrigger>
                        <TabsTrigger value="departamentos">Departamentos</TabsTrigger>
                        <TabsTrigger value="alertas">Alertas</TabsTrigger>
                    </TabsList>

                    <TabsContent value="general" className="grid gap-4 xl:grid-cols-[1.5fr_1fr]">
                        <Card>
                            <CardHeader>
                                <CardTitle>Ingresos vs gastos</CardTitle>
                            </CardHeader>
                            <CardContent className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={cashFlow}>
                                        <XAxis dataKey="month" stroke="#B7B7B7" />
                                        <YAxis stroke="#B7B7B7" tickFormatter={(value) => `$${Number(value) / 1000000}M`} />
                                        <ChartTooltip formatter={(value) => <MoneyDisplay value={Number(value)} />} />
                                        <Line type="monotone" dataKey="ingresos" stroke="#22d3ee" strokeWidth={3} dot={false} />
                                        <Line type="monotone" dataKey="gastos" stroke="#10b981" strokeWidth={3} dot={false} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Gastos por sector</CardTitle>
                            </CardHeader>
                            <CardContent className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={sectors}>
                                        <XAxis dataKey="name" stroke="#B7B7B7" />
                                        <YAxis stroke="#B7B7B7" tickFormatter={(value) => `$${Number(value) / 1000000}M`} />
                                        <ChartTooltip formatter={(value) => <MoneyDisplay value={Number(value)} />} />
                                        <Bar dataKey="value" fill="#06b6d4" radius={[6, 6, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="departamentos" className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {departments.length > 0 ? (
                            departments.map((department) => (
                                <Card key={department.id}>
                                    <CardHeader>
                                        <div className="flex items-start justify-between gap-3">
                                            <SectionTitle title={department.name} description={department.manager || 'Presupuesto disponible'} />
                                            <StatusBadge status={department.status} />
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <BudgetProgress label="Consumido" spent={Number(department.spent ?? 0)} budget={Number(department.monthly_budget ?? 0)} />
                                    </CardContent>
                                </Card>
                            ))
                        ) : (
                            <div className="md:col-span-2 xl:col-span-3">
                                <EmptyState title="Sin departamentos" description="Crea departamentos para ver su presupuesto y consumo en este panel." />
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="alertas" className="grid gap-4 md:grid-cols-3">
                        <Alert>
                            <AlertTriangle className="h-4 w-4" />
                            <AlertTitle>Inventario bajo</AlertTitle>
                            <AlertDescription>{lowInventoryCount} referencias requieren reposicion.</AlertDescription>
                        </Alert>
                        <Alert>
                            <Package className="h-4 w-4" />
                            <AlertTitle>Compras pendientes</AlertTitle>
                            <AlertDescription>{pendingPurchasesCount} solicitudes esperan aprobacion financiera.</AlertDescription>
                        </Alert>
                        <Alert>
                            <WalletCards className="h-4 w-4" />
                            <AlertTitle>{netFlow >= 0 ? 'Flujo positivo' : 'Flujo negativo'}</AlertTitle>
                            <AlertDescription>{netFlowDetail(netFlow)}.</AlertDescription>
                        </Alert>
                    </TabsContent>
                </Tabs>

                <div className="grid gap-4 xl:grid-cols-[1fr_22rem]">
                    <Card>
                        <CardHeader>
                            <CardTitle>Ultimos movimientos</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <DataTable columns={columns} data={latestMovements} searchPlaceholder="Buscar movimientos..." />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Senales rapidas</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between rounded-md border border-white/10 p-3">
                                <span className="flex items-center gap-2 text-sm text-muted-foreground"><ArrowUpRight className="h-4 w-4 text-emerald-300" /> Ingresos</span>
                                <MoneyDisplay value={monthlyIncome} />
                            </div>
                            <div className="flex items-center justify-between rounded-md border border-white/10 p-3">
                                <span className="flex items-center gap-2 text-sm text-muted-foreground"><ArrowDownRight className="h-4 w-4 text-red-300" /> Gastos</span>
                                <MoneyDisplay value={monthlyExpenses} />
                            </div>
                            <div className="flex items-center justify-between rounded-md border border-white/10 p-3">
                                <span className="text-sm text-muted-foreground">Estado general</span>
                                <StatusBadge status={netFlow >= 0 ? 'Aprobado' : 'Pendiente'} />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
