import { useMemo, useState } from 'react';
import { endOfMonth, endOfWeek, endOfYear, isWithinInterval, parseISO, startOfMonth, startOfWeek, startOfYear } from 'date-fns';
import ResourceIndex, { ResourceColumn, ResourceField, ResourceRow } from './ResourceIndex';
import { DataTableFilters } from '@/Components/data-table/DataTableFilters';
import { DateTimePicker } from '@/Components/shared/DateTimePicker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { PageProps } from '@/types';

type Props = PageProps<{
    movements: ResourceRow[];
    departments: ResourceRow[];
    paymentMethods: ResourceRow[];
}>;

const statuses = ['Pendiente', 'Aprobado', 'Pagado', 'Rechazado', 'Cancelado'];
const periodOptions = [
    { label: 'Todas', value: 'all' },
    { label: 'Semanal', value: 'weekly' },
    { label: 'Mensual', value: 'monthly' },
    { label: 'Anual', value: 'yearly' },
    { label: 'Rango de fechas', value: 'custom' },
] as const;

type PeriodFilter = (typeof periodOptions)[number]['value'];

export default function FinancialMovements({ auth, movements, departments, paymentMethods }: Props) {
    const [periodFilter, setPeriodFilter] = useState<PeriodFilter>('all');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');

    const departmentOptions = departments.map((department) => ({ label: department.name, value: String(department.id) }));
    const paymentMethodOptions = paymentMethods.map((paymentMethod) => ({ label: paymentMethod.name, value: paymentMethod.code }));

    const fields: ResourceField[] = [
        { name: 'concept', label: 'Concepto', required: true },
        { name: 'department_id', label: 'Departamento', type: 'select', options: departmentOptions },
        { name: 'type', label: 'Tipo', type: 'select', required: true, defaultValue: 'Ingreso', options: ['Ingreso', 'Gasto'].map((value) => ({ label: value, value })) },
        { name: 'amount', label: 'Valor', type: 'number', required: true },
        { name: 'movement_date', label: 'Fecha', type: 'date', required: true },
        { name: 'status', label: 'Estado', type: 'select', required: true, options: statuses.map((value) => ({ label: value, value })) },
        { name: 'payment_method', label: 'Medio de pago', type: 'select', options: paymentMethodOptions },
        { name: 'image', label: 'Imagen', type: 'file', accept: 'image/*', previewKey: 'image_url' },
        { name: 'description', label: 'Descripción', type: 'textarea' },
    ];

    const columns: ResourceColumn[] = [
        { key: 'image_url', header: 'Imagen', type: 'image' },
        { key: 'concept', header: 'Movimiento' },
        { key: 'department.name', header: 'Departamento' },
        { key: 'type', header: 'Tipo' },
        { key: 'amount', header: 'Valor', type: 'money' },
        { key: 'status', header: 'Estado', type: 'status' },
        { key: 'movement_date', header: 'Fecha', type: 'date' },
    ];

    const filteredMovements = useMemo(() => {
        if (periodFilter === 'all') {
            return movements;
        }

        const now = new Date();
        const intervals = {
            weekly: { start: startOfWeek(now, { weekStartsOn: 1 }), end: endOfWeek(now, { weekStartsOn: 1 }) },
            monthly: { start: startOfMonth(now), end: endOfMonth(now) },
            yearly: { start: startOfYear(now), end: endOfYear(now) },
        } as const;

        return movements.filter((movement) => {
            if (!movement.movement_date) {
                return false;
            }

            const movementDate = parseISO(String(movement.movement_date));

            if (periodFilter === 'custom') {
                const from = dateFrom ? parseISO(dateFrom) : null;
                const to = dateTo ? parseISO(dateTo) : null;

                if (from && movementDate < from) {
                    return false;
                }

                if (to && movementDate > to) {
                    return false;
                }

                return true;
            }

            return isWithinInterval(movementDate, intervals[periodFilter]);
        });
    }, [movements, periodFilter, dateFrom, dateTo]);

    const tableToolbar = (
        <DataTableFilters>
            <div className="space-y-2">
                <span className="text-xs font-medium uppercase tracking-normal text-muted-foreground">Período</span>
                <Select value={periodFilter} onValueChange={(value) => setPeriodFilter(value as PeriodFilter)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Seleccionar período" />
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

            <div className="flex items-end">
                <button
                    type="button"
                    className="h-10 w-full rounded-md border border-white/10 bg-white/5 px-3 text-sm text-white/85 transition hover:bg-white/10"
                    onClick={() => {
                        setPeriodFilter('all');
                        setDateFrom('');
                        setDateTo('');
                    }}
                >
                    Limpiar filtros
                </button>
            </div>
        </DataTableFilters>
    );

    return (
        <ResourceIndex
            auth={auth}
            title="Finanzas"
            description="Registra ingresos, gastos, estados y medios de pago."
            items={filteredMovements}
            fields={fields}
            columns={columns}
            storeUrl="/financial-movements"
            resourceUrl="/financial-movements"
            searchPlaceholder="Buscar movimientos..."
            tableToolbar={tableToolbar}
        />
    );
}
