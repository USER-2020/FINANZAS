import ResourceIndex, { ResourceColumn, ResourceField, ResourceRow } from './ResourceIndex';
import { PageProps } from '@/types';

type Props = PageProps<{
    reports: ResourceRow[];
}>;

const fields: ResourceField[] = [
    { name: 'title', label: 'Título', required: true },
    { name: 'type', label: 'Tipo', type: 'select', required: true, hidden: true, defaultValue: 'Financiero', options: ['Financiero', 'Compras', 'Inventario', 'Departamentos'].map((value) => ({ label: value, value })) },
    { name: 'period_start', label: 'Inicio período', type: 'date' },
    { name: 'period_end', label: 'Fin período', type: 'date' },
    { name: 'status', label: 'Estado', type: 'select', required: true, options: ['Planeado', 'Pendiente', 'Aprobado', 'Cancelado'].map((value) => ({ label: value, value })) },
    { name: 'generated_by', label: 'Generado por' },
    { name: 'file_path', label: 'Archivo' },
    { name: 'notes', label: 'Notas', type: 'textarea' },
];

const columns: ResourceColumn[] = [
    { key: 'title', header: 'Reporte' },
    { key: 'type', header: 'Tipo' },
    { key: 'period_start', header: 'Inicio', type: 'date' },
    { key: 'period_end', header: 'Fin', type: 'date' },
    { key: 'status', header: 'Estado', type: 'status' },
    { key: 'generated_by', header: 'Generado por' },
];

export default function Reports({ auth, reports }: Props) {
    return (
        <ResourceIndex
            auth={auth}
            title="Reportes"
            description="Gestiona reportes preparados, períodos, estádo y archivos asociados."
            items={reports}
            fields={fields}
            columns={columns}
            storeUrl="/reports"
            resourceUrl="/reports"
            searchPlaceholder="Buscar reportes..."
        />
    );
}
