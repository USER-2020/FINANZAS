import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { motion } from 'framer-motion';
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
    category?: {
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
    budgetSpent: number | string;
    goalsCurrent: number | string;
    goalsTarget: number | string;
    recurringCount: number;
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
    { accessorKey: 'category.name', header: 'Categoría', cell: ({ row }) => row.original.category?.name ?? '-' },
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
    budgetSpent: 0,
    goalsCurrent: 0,
    goalsTarget: 0,
    recurringCount: 0,
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

function goalsDetail(current: number, target: number) {
    if (target <= 0) return 'Crea una meta para empezar a avanzar';
    return `${Math.round((current / target) * 100)}% completado en tus metas activas`;
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
                    <PageHeader eyebrow="Administración" title="Panel superadmin" description="Vista global para administrar clientes, usuarios y acceso central." />

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
    const netFlow = Number(metrics.netFlow ?? 0);
    const totalBudget = Number(metrics.totalBudget ?? 0);
    const budgetSpent = Number(metrics.budgetSpent ?? 0);
    const goalsCurrent = Number(metrics.goalsCurrent ?? 0);
    const goalsTarget = Number(metrics.goalsTarget ?? 0);
    const recurringCount = Number(metrics.recurringCount ?? 0);
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
                    eyebrow="Tu panorama financiero"
                    title="Dashboard financiero"
                    description="Una lectura clara de tus ingresos, gastos y decisiones pendientes."
                    actions={
                        <Button asChild>
                            <Link href="/financial-movements?create=1">Nuevo movimiento</Link>
                        </Button>
                    }
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.06, duration: 0.35 }}
                    className="relative overflow-hidden rounded-3xl border border-emerald-300/15 bg-gradient-to-br from-emerald-400/[0.13] via-cyan-400/[0.06] to-transparent p-5 sm:p-6"
                >
                    <div className="pointer-events-none absolute -right-10 -top-20 h-56 w-56 rounded-full bg-cyan-300/10 blur-3xl" />
                    <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-200/80">Lectura rápida · {filters.label}</p>
                            <h2 className="mt-2 text-xl font-semibold tracking-tight text-white">{netFlow >= 0 ? 'Tu flujo va por buen camino.' : 'Este periodo pide atención.'}</h2>
                            <p className="mt-1 max-w-xl text-sm text-slate-300/80">{netFlowDetail(netFlow)}. Revisa los indicadores y convierte los datos en una acción concreta.</p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-slate-950/25 px-4 py-3 text-right backdrop-blur">
                            <p className="text-xs text-muted-foreground">Balance del periodo</p>
                            <MoneyDisplay value={netFlow} className="mt-1 block text-xl font-semibold" />
                        </div>
                    </div>
                </motion.div>

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
                    <FinancialCard title="Presupuesto usado" amount={budgetSpent} detail={totalBudget > 0 ? `${Math.round((budgetSpent / totalBudget) * 100)}% de tu límite configurado` : 'Configura tu primer presupuesto'} />
                    <FinancialCard title="Ahorro acumulado" amount={goalsCurrent} detail={goalsDetail(goalsCurrent, goalsTarget)} />
                </div>

                <Tabs defaultValue="general" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="general">General</TabsTrigger>
                        <TabsTrigger value="departamentos">Operación avanzada</TabsTrigger>
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
                            <AlertDescription>{recurringCount} movimientos recurrentes configurados para no olvidar nada.</AlertDescription>
                        </Alert>
                        <Alert>
                            <WalletCards className="h-4 w-4" />
                            <AlertTitle>{netFlow >= 0 ? 'Flujo positivo' : 'Flujo negativo'}</AlertTitle>
                            <AlertDescription>{goalsDetail(goalsCurrent, goalsTarget)}.</AlertDescription>
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
