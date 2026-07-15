import ResourceIndex, { ResourceColumn, ResourceField, ResourceRow } from './ResourceIndex';
import { PageProps } from '@/types';

type Props = PageProps<{
    admins: ResourceRow[];
    modules: Array<{ label: string; value: string }>;
}>;

export default function AdminModuleAccess({ auth, admins, modules }: Props) {
    const fields: ResourceField[] = [
        {
            name: 'menu_access',
            label: 'Modulos del menu',
            type: 'switchlist',
            required: true,
            options: modules,
            initialValue: (row) => row.menu_access ?? [],
        },
    ];

    const columns: ResourceColumn[] = [
        { key: 'name', header: 'Admin' },
        { key: 'email', header: 'Correo' },
        { key: 'client.name', header: 'Cliente' },
        { key: 'status', header: 'Estado', type: 'status' },
        {
            key: 'menu_access',
            header: 'Accesos',
            render: (row) => {
                const labels = modules
                    .filter((module) => (row.menu_access ?? []).includes(module.value))
                    .map((module) => module.label);

                return labels.join(', ') || '-';
            },
        },
    ];

    return (
        <ResourceIndex
            auth={auth}
            title="Accesos por menu"
            description="Asigna a cada admin los modulos del menu que puede ver y usar."
            items={admins}
            fields={fields}
            columns={columns}
            storeUrl="/module-access"
            resourceUrl="/module-access"
            searchPlaceholder="Buscar admins..."
            canCreate={false}
            canDelete={false}
        />
    );
}
