import ResourceIndex, { ResourceColumn, ResourceField, ResourceRow } from './ResourceIndex';
import { PageProps } from '@/types';

type Props = PageProps<{
    purchases: ResourceRow[];
    departments: ResourceRow[];
}>;

const statuses = ['Pendiente', 'Cotizado', 'Aprobado', 'Adquirido', 'Rechazado', 'Cancelado'];

export default function Purchases({ auth, purchases, departments }: Props) {
    const departmentOptions = departments.map((department) => ({ label: department.name, value: String(department.id) }));
    const fields: ResourceField[] = [
        { name: 'item', label: 'Item', required: true },
        { name: 'department_id', label: 'Departamento', type: 'select', options: departmentOptions },
        { name: 'supplier', label: 'Proveedor' },
        { name: 'quantity', label: 'Cantidad', type: 'number', required: true },
        { name: 'unit_price', label: 'Precio unitario', type: 'number', required: true },
        { name: 'requested_at', label: 'Fecha solicitud', type: 'date', required: true },
        { name: 'expected_at', label: 'Fecha esperada', type: 'date' },
        { name: 'status', label: 'Estado', type: 'select', required: true, options: statuses.map((value) => ({ label: value, value })) },
        { name: 'notes', label: 'Notas', type: 'textarea' },
    ];
    const columns: ResourceColumn[] = [
        { key: 'item', header: 'Compra' },
        { key: 'department.name', header: 'Departamento' },
        { key: 'supplier', header: 'Proveedor' },
        { key: 'quantity', header: 'Cantidad' },
        { key: 'total_amount', header: 'Total', type: 'money' },
        { key: 'status', header: 'Estado', type: 'status' },
        { key: 'requested_at', header: 'Solicitada', type: 'date' },
        { key: 'expected_at', header: 'Esperada', type: 'date' },
    ];

    return (
        <ResourceIndex
            auth={auth}
            title="Compras"
            description="Controla solicitudes, proveedores, costos y aprobaciones."
            items={purchases}
            fields={fields}
            columns={columns}
            storeUrl="/purchases"
            resourceUrl="/purchases"
            searchPlaceholder="Buscar compras..."
        />
    );
}
