import ResourceIndex, { ResourceColumn, ResourceField, ResourceRow } from './ResourceIndex';
import { PageProps } from '@/types';

type Props = PageProps<{
    items: ResourceRow[];
    departments: ResourceRow[];
}>;

const statuses = ['Disponible', 'Inventario bajo', 'Agotado', 'En mantenimiento', 'Cancelado'];

export default function InventoryItems({ auth, items, departments }: Props) {
    const departmentOptions = departments.map((department) => ({ label: department.name, value: String(department.id) }));
    const fields: ResourceField[] = [
        { name: 'name', label: 'Nombre', required: true },
        { name: 'sku', label: 'SKU', required: true },
        { name: 'department_id', label: 'Departamento', type: 'select', options: departmentOptions },
        { name: 'category', label: 'Categoria' },
        { name: 'quantity', label: 'Cantidad', type: 'number', required: true },
        { name: 'minimum_stock', label: 'Stock mínimo', type: 'number', required: true },
        { name: 'unit_cost', label: 'Costo unitario', type: 'number', required: true },
        { name: 'location', label: 'Ubicacion' },
        { name: 'status', label: 'Estado', type: 'select', required: true, options: statuses.map((value) => ({ label: value, value })) },
        { name: 'image', label: 'Imagen', type: 'file', accept: 'image/*', previewKey: 'image_url' },
        { name: 'notes', label: 'Notas', type: 'textarea' },
    ];
    const columns: ResourceColumn[] = [
        { key: 'image_url', header: 'Imagen', type: 'image' },
        { key: 'name', header: 'Item' },
        { key: 'sku', header: 'SKU' },
        { key: 'department.name', header: 'Departamento' },
        { key: 'quantity', header: 'Cantidad' },
        { key: 'minimum_stock', header: 'Mínimo' },
        { key: 'unit_cost', header: 'Costo', type: 'money' },
        { key: 'status', header: 'Estado', type: 'status' },
    ];

    return (
        <ResourceIndex
            auth={auth}
            title="Inventario"
            description="Gestiona existencias, costos, ubicaciónes y alertas de stock."
            items={items}
            fields={fields}
            columns={columns}
            storeUrl="/inventory-items"
            resourceUrl="/inventory-items"
            searchPlaceholder="Buscar inventario..."
        />
    );
}
