import ResourceIndex, { ResourceColumn, ResourceField, ResourceRow } from './ResourceIndex';
import { PageProps } from '@/types';

type Props = PageProps<{
    users: ResourceRow[];
    departments: ResourceRow[];
    roles: ResourceRow[];
    clients: ResourceRow[];
    canManageClients: boolean;
}>;

export default function Users({ auth, users, departments, roles, clients, canManageClients }: Props) {
    const departmentOptions = departments.map((department) => ({ label: department.name, value: String(department.id) }));
    const roleOptions = roles.map((role) => ({ label: role.name, value: role.name }));
    const clientOptions = clients.map((client) => ({ label: client.name, value: String(client.id) }));

    const fields: ResourceField[] = [
        { name: 'name', label: 'Nombre', required: true },
        { name: 'email', label: 'Correo', required: true },
        {
            name: 'client_id',
            label: 'Cliente',
            type: 'select',
            options: clientOptions,
            hidden: !canManageClients,
            initialValue: (row) => (row.client_id ? String(row.client_id) : ''),
        },
        {
            name: 'role',
            label: 'Rol',
            type: 'select',
            required: true,
            options: roleOptions,
            initialValue: (row) => row.roles?.[0]?.name ?? '',
        },
        {
            name: 'department_ids',
            label: 'Departamentos',
            type: 'multiselect',
            options: departmentOptions,
            initialValue: (row) => row.departments?.map((department: ResourceRow) => String(department.id)) ?? [],
        },
        {
            name: 'status',
            label: 'Estado',
            type: 'select',
            required: true,
            options: ['Activo', 'Inactivo'].map((value) => ({ label: value, value })),
            defaultValue: 'Activo',
        },
        { name: 'password', label: 'Contrasena', type: 'password', requiredOnCreate: true },
    ];

    const columns: ResourceColumn[] = [
        { key: 'name', header: 'Usuario' },
        { key: 'email', header: 'Correo' },
        ...(canManageClients ? [{ key: 'client.name', header: 'Cliente' } as ResourceColumn] : []),
        { key: 'roles', header: 'Rol', render: (row) => row.roles?.map((role: ResourceRow) => role.name).join(', ') || '-' },
        { key: 'status', header: 'Estado', type: 'status' },
        { key: 'departments', header: 'Departamentos', render: (row) => row.departments?.map((department: ResourceRow) => department.name).join(', ') || '-' },
        { key: 'created_at', header: 'Creado', type: 'date' },
    ];

    return (
        <ResourceIndex
            auth={auth}
            title="Usuarios"
            description={canManageClients ? 'Gestiona superadmins, clientes y usuarios por tenant.' : 'Gestiona usuarios, roles y departamentos asignados a tu cliente.'}
            items={users}
            fields={fields}
            columns={columns}
            storeUrl="/users"
            resourceUrl="/users"
            searchPlaceholder="Buscar usuarios..."
        />
    );
}
