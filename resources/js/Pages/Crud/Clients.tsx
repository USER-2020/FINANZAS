import ResourceIndex, { ResourceColumn, ResourceField, ResourceRow } from './ResourceIndex';
import { PageProps } from '@/types';

type Props = PageProps<{
    clients: ResourceRow[];
}>;

export default function Clients({ auth, clients }: Props) {
    const toNickname = (value: string, currentValue?: string) => {
        const initials = value
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .trim()
            .split(/\s+/)
            .filter(Boolean)
            .map((part) => part[0]?.toLowerCase() ?? '')
            .join('')
            .slice(0, 6);

        const currentSuffix = currentValue?.split('-').pop()?.toLowerCase() ?? '';
        const suffix = /^[a-f0-9]{8}$/.test(currentSuffix)
            ? currentSuffix
            : crypto.randomUUID().replace(/-/g, '').slice(0, 8);

        return initials ? `${initials}-${suffix}` : suffix;
    };

    const fields: ResourceField[] = [
        { name: 'name', label: 'Nombre', required: true },
        { name: 'slug', label: 'Nickname', required: true, syncFrom: 'name', syncTransform: toNickname },
        { name: 'contact_phone', label: 'Telefono de contacto', type: 'phone' },
        { name: 'contact_email', label: 'Email contacto' },
        { name: 'admin_name', label: 'Admin inicial', requiredOnCreate: true, syncFrom: 'name' },
        { name: 'admin_email', label: 'Correo admin', requiredOnCreate: true, syncFrom: 'contact_email' },
        { name: 'admin_password', label: 'Contrasena admin', type: 'password', requiredOnCreate: true },
        {
            name: 'status',
            label: 'Estado',
            type: 'select',
            required: true,
            options: ['Activo', 'Inactivo'].map((value) => ({ label: value, value })),
            defaultValue: 'Activo',
        },
        { name: 'notes', label: 'Notas', type: 'textarea' },
    ];

    const columns: ResourceColumn[] = [
        { key: 'name', header: 'Cliente' },
        { key: 'slug', header: 'Nickname' },
        { key: 'contact_phone', header: 'Telefono' },
        { key: 'contact_email', header: 'Email' },
        { key: 'users_count', header: 'Usuarios' },
        { key: 'status', header: 'Estado', type: 'status' },
    ];

    return (
        <ResourceIndex
            auth={auth}
            title="Clientes"
            description="Administra tenants, estado y responsables de cada cliente."
            items={clients}
            fields={fields}
            columns={columns}
            storeUrl="/clients"
            resourceUrl="/clients"
            searchPlaceholder="Buscar clientes..."
        />
    );
}
