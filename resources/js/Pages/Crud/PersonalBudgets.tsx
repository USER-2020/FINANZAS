import ResourceIndex, { ResourceColumn, ResourceField, ResourceRow } from './ResourceIndex';
import { PageProps } from '@/types';

type Props = PageProps<{ budgets: ResourceRow[]; categories: ResourceRow[] }>;

export default function PersonalBudgets({ auth, budgets, categories }: Props) {
    const fields: ResourceField[] = [
        { name: 'name', label: 'Nombre del presupuesto', required: true },
        { name: 'category_id', label: 'Categoría', type: 'select', options: categories.map((item) => ({ label: item.name, value: String(item.id) })) },
        { name: 'amount', label: 'Límite', type: 'number', required: true },
        { name: 'period', label: 'Periodo', type: 'select', required: true, defaultValue: 'Mensual', options: ['Semanal', 'Mensual', 'Anual'].map((value) => ({ label: value, value })) },
        { name: 'start_date', label: 'Desde', type: 'date', required: true },
        { name: 'end_date', label: 'Hasta', type: 'date' },
        { name: 'status', label: 'Estado', type: 'select', required: true, defaultValue: 'Activo', options: ['Activo', 'Pausado', 'Cerrado'].map((value) => ({ label: value, value })) },
    ];
    const columns: ResourceColumn[] = [
        { key: 'name', header: 'Presupuesto' },
        { key: 'category.name', header: 'Categoría' },
        { key: 'amount', header: 'Límite', type: 'money' },
        { key: 'period', header: 'Periodo' },
        { key: 'status', header: 'Estado', type: 'status' },
    ];
    return <ResourceIndex auth={auth} title="Presupuestos" description="Define límites simples para gastar con intención y anticiparte a los excesos." items={budgets} fields={fields} columns={columns} storeUrl="/budgets" resourceUrl="/budgets" searchPlaceholder="Buscar presupuestos..." />;
}
