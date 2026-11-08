import ResourceIndex, { ResourceColumn, ResourceField, ResourceRow } from './ResourceIndex';
import { PageProps } from '@/types';

type Props = PageProps<{ recurringTransactions: ResourceRow[]; categories: ResourceRow[] }>;

export default function RecurringTransactions({ auth, recurringTransactions, categories }: Props) {
    const fields: ResourceField[] = [
        { name: 'concept', label: 'Concepto', required: true },
        { name: 'type', label: 'Tipo', type: 'select', required: true, defaultValue: 'Gasto', options: ['Ingreso', 'Gasto'].map((value) => ({ label: value, value })) },
        { name: 'amount', label: 'Valor', type: 'number', required: true },
        { name: 'frequency', label: 'Frecuencia', type: 'select', required: true, defaultValue: 'Mensual', options: ['Semanal', 'Mensual', 'Anual'].map((value) => ({ label: value, value })) },
        { name: 'next_date', label: 'Próxima fecha', type: 'date', required: true },
        { name: 'category_id', label: 'Categoría', type: 'select', options: categories.map((item) => ({ label: item.name, value: String(item.id) })) },
        { name: 'account', label: 'Cuenta o medio de pago' },
        { name: 'status', label: 'Estado', type: 'select', required: true, defaultValue: 'Activo', options: ['Activo', 'Pausado'].map((value) => ({ label: value, value })) },
        { name: 'notes', label: 'Notas', type: 'textarea' },
    ];
    const columns: ResourceColumn[] = [
        { key: 'concept', header: 'Movimiento' },
        { key: 'type', header: 'Tipo' },
        { key: 'amount', header: 'Valor', type: 'money' },
        { key: 'frequency', header: 'Frecuencia' },
        { key: 'next_date', header: 'Próxima fecha', type: 'date' },
        { key: 'status', header: 'Estado', type: 'status' },
    ];
    return <ResourceIndex auth={auth} title="Movimientos recurrentes" description="Ten presente arriendo, suscripciones, nómina y cualquier ingreso o gasto que se repita." items={recurringTransactions} fields={fields} columns={columns} storeUrl="/recurring-transactions" resourceUrl="/recurring-transactions" searchPlaceholder="Buscar recurrentes..." />;
}
