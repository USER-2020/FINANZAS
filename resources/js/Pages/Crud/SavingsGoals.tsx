import ResourceIndex, { ResourceColumn, ResourceField, ResourceRow } from './ResourceIndex';
import { PageProps } from '@/types';

type Props = PageProps<{ goals: ResourceRow[] }>;

const fields: ResourceField[] = [
    { name: 'name', label: 'Meta', required: true },
    { name: 'target_amount', label: 'Objetivo', type: 'number', required: true },
    { name: 'current_amount', label: 'Ahorrado hasta ahora', type: 'number', required: true, defaultValue: 0 },
    { name: 'target_date', label: 'Fecha objetivo', type: 'date' },
    { name: 'status', label: 'Estado', type: 'select', required: true, defaultValue: 'Activa', options: ['Activa', 'Pausada', 'Completada'].map((value) => ({ label: value, value })) },
    { name: 'notes', label: 'Notas', type: 'textarea' },
];

const columns: ResourceColumn[] = [
    { key: 'name', header: 'Meta' },
    { key: 'target_amount', header: 'Objetivo', type: 'money' },
    { key: 'current_amount', header: 'Ahorrado', type: 'money' },
    { key: 'target_date', header: 'Fecha objetivo', type: 'date' },
    { key: 'status', header: 'Estado', type: 'status' },
];

export default function SavingsGoals({ auth, goals }: Props) {
    return <ResourceIndex auth={auth} title="Metas de ahorro" description="Convierte tus planes —viaje, fondo de emergencia o compra— en objetivos visibles y medibles." items={goals} fields={fields} columns={columns} storeUrl="/savings-goals" resourceUrl="/savings-goals" searchPlaceholder="Buscar metas..." />;
}
