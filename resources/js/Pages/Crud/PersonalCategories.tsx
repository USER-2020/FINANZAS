import ResourceIndex, { ResourceColumn, ResourceField, ResourceRow } from './ResourceIndex';
import { PageProps } from '@/types';

type Props = PageProps<{ categories: ResourceRow[] }>;

const fields: ResourceField[] = [
    { name: 'name', label: 'Nombre', required: true },
    { name: 'type', label: 'Tipo', type: 'select', required: true, defaultValue: 'Gasto', options: ['Ingreso', 'Gasto'].map((value) => ({ label: value, value })) },
    { name: 'color', label: 'Color', required: true, defaultValue: '#34d399' },
    { name: 'status', label: 'Estado', type: 'select', required: true, defaultValue: 'Activo', options: ['Activo', 'Inactivo'].map((value) => ({ label: value, value })) },
    { name: 'notes', label: 'Notas', type: 'textarea' },
];

const columns: ResourceColumn[] = [
    { key: 'name', header: 'Categoría' },
    { key: 'type', header: 'Tipo' },
    { key: 'color', header: 'Color' },
    { key: 'status', header: 'Estado', type: 'status' },
];

export default function PersonalCategories({ auth, categories }: Props) {
    return <ResourceIndex auth={auth} title="Categorías" description="Organiza tus ingresos y gastos con un lenguaje que tenga sentido para tu vida." items={categories} fields={fields} columns={columns} storeUrl="/categories" resourceUrl="/categories" searchPlaceholder="Buscar categorías..." />;
}
