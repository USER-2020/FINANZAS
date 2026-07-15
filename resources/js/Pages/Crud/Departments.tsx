import { router } from '@inertiajs/react';
import { Download } from 'lucide-react';
import ResourceIndex, { ResourceColumn, ResourceField, ResourceRow } from './ResourceIndex';
import { Button } from '@/Components/ui/button';
import { PageProps } from '@/types';

type Props = PageProps<{
    departments: ResourceRow[];
    canCreateDepartments: boolean;
    canDeleteDepartments: boolean;
    templatesImported: boolean;
}>;

const fields: ResourceField[] = [
    { name: 'name', label: 'Nombre', required: true },
    { name: 'code', label: 'Codigo', required: true },
    { name: 'manager', label: 'Responsable' },
    { name: 'monthly_budget', label: 'Presupuesto mensual', type: 'number', required: true },
    { name: 'status', label: 'Estado', type: 'select', required: true, options: ['Activo', 'Pausado', 'Cerrado'].map((value) => ({ label: value, value })) },
    { name: 'notes', label: 'Notas', type: 'textarea' },
];

const columns: ResourceColumn[] = [
    { key: 'name', header: 'Departamento' },
    { key: 'code', header: 'Codigo' },
    { key: 'manager', header: 'Responsable' },
    { key: 'monthly_budget', header: 'Presupuesto', type: 'money' },
    { key: 'status', header: 'Estado', type: 'status' },
];

export default function Departments({ auth, departments, canCreateDepartments, canDeleteDepartments, templatesImported }: Props) {
    function importTemplates() {
        if (templatesImported) {
            return;
        }

        router.post('/departments/import-templates', {}, { preserveScroll: true });
    }

    return (
        <ResourceIndex
            auth={auth}
            title="Departamentos"
            description="Gestiona areas, responsables y presupuesto mensual."
            items={departments}
            fields={fields}
            columns={columns}
            storeUrl="/departments"
            resourceUrl="/departments"
            searchPlaceholder="Buscar departamentos..."
            headerActions={
                canCreateDepartments ? (
                    <Button type="button" variant="outline" onClick={importTemplates} disabled={templatesImported} title={templatesImported ? 'Los departamentos base ya fueron cargados.' : 'Cargar departamentos base'}>
                        <Download className="h-4 w-4" />
                        Cargar departamentos
                    </Button>
                ) : null
            }
            canCreate={canCreateDepartments}
            canDelete={canDeleteDepartments}
        />
    );
}
