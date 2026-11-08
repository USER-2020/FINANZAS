export type DriverTourDefinition = {
    key: string;
    title: string;
    description: string;
    route: string;
};

export type DriverTourStep = {
    element: string;
    popover: {
        title: string;
        description: string;
        side?: 'top' | 'right' | 'bottom' | 'left';
        align?: 'start' | 'center' | 'end';
    };
};

export const driverTourVersion = '2026.11.personal-finance.2';

export const driverTourDefinitions: DriverTourDefinition[] = [
    { key: 'dashboard', title: 'Dashboard', description: 'Tu punto de partida: ingresos, gastos, presupuesto usado y progreso de ahorro.', route: '/dashboard' },
    { key: 'financial-movements', title: 'Movimientos', description: 'Registra cada ingreso y gasto para construir una fotografía real de tu dinero.', route: '/financial-movements' },
    { key: 'budgets', title: 'Presupuestos', description: 'Define límites por periodo y detecta antes cuándo una categoría empieza a salirse de control.', route: '/budgets' },
    { key: 'savings-goals', title: 'Metas de ahorro', description: 'Convierte planes concretos en objetivos medibles: fondo de emergencia, viaje o compra.', route: '/savings-goals' },
    { key: 'recurring-transactions', title: 'Recurrentes', description: 'Anticipa arriendos, suscripciones, nómina y otros movimientos que se repiten.', route: '/recurring-transactions' },
    { key: 'categories', title: 'Categorías', description: 'Usa un lenguaje personal para ordenar tus gastos e ingresos.', route: '/categories' },
    { key: 'reports', title: 'Reportes', description: 'Revisa periodos y convierte tu historial financiero en decisiones.', route: '/reports' },
    { key: 'cash-counter', title: 'Contar efectivo', description: 'Cuenta billetes por denominación y conoce cuánto efectivo tienes disponible.', route: '/cash-counter' },
    { key: 'departments', title: 'Operación avanzada', description: 'Módulos heredados para escenarios administrativos o de operación más complejos.', route: '/departments' },
    { key: 'clients', title: 'Clientes', description: 'Administra los espacios financieros de la plataforma.', route: '/clients' },
    { key: 'users', title: 'Usuarios', description: 'Gestiona las personas con acceso y sus roles.', route: '/users' },
    { key: 'admin-videos', title: 'Videos', description: 'Material de orientación para administradores.', route: '/admin-videos' },
    { key: 'module-access', title: 'Accesos', description: 'Controla qué módulos puede ver cada administrador.', route: '/module-access' },
];

export function currentDriverTourKey(): string {
    const path = window.location.pathname;
    return driverTourDefinitions.find((definition) => path === definition.route || path.startsWith(`${definition.route}/`))?.key ?? 'dashboard';
}

export function availableDriverSteps(tourKey: string): DriverTourStep[] {
    const definition = driverTourDefinitions.find((item) => item.key === tourKey) ?? driverTourDefinitions[0];
    const steps: DriverTourStep[] = [];
    const menuSelector = `[data-tour="menu:${definition.key}"]`;

    if (document.querySelector(menuSelector)) {
        steps.push({
            element: menuSelector,
            popover: { title: definition.title, description: definition.description, side: 'right', align: 'start' },
        });
    }

    if (definition.key === 'financial-movements' && document.querySelector('[data-tour="quick-capture"]')) {
        steps.push({
            element: '[data-tour="quick-capture"]',
            popover: { title: 'Captura un movimiento', description: 'Abre directamente el lector OCR para convertir una factura en un gasto revisable.', side: 'right', align: 'start' },
        });
    }

    if (document.querySelector('[data-tour="page-header"]')) {
        steps.push({
            element: '[data-tour="page-header"]',
            popover: { title: `Estás en ${definition.title}`, description: 'Desde aquí puedes entender el contexto de esta pantalla y continuar con la acción que necesitas.', side: 'bottom', align: 'start' },
        });
    }

    const pageSelector = '[data-tour="page:' + definition.key + '"]';
    if (document.querySelector(pageSelector)) {
        steps.push({
            element: pageSelector,
            popover: { title: 'Cuenta tu efectivo', description: 'Registra las cantidades de cada billete y revisa el total de efectivo en pesos colombianos.', side: 'top', align: 'center' },
        });
    }

    return steps;
}
