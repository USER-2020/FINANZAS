import { motion } from 'framer-motion';
import { Link } from '@inertiajs/react';
import { ArrowRight, BarChart3, CheckCircle2, Clock3, Package, Users, WalletCards } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';

type WorkflowStep = {
    title: string;
    description: string;
    href: string;
    cta: string;
    icon: typeof WalletCards;
    accent: string;
    status: 'completed' | 'active' | 'pending';
    helper: string;
};

function statusLabel(status: WorkflowStep['status']) {
    if (status === 'completed') {
        return 'Completado';
    }

    if (status === 'active') {
        return 'En curso';
    }

    return 'Pendiente';
}

function statusClasses(status: WorkflowStep['status']) {
    if (status === 'completed') {
        return 'border-emerald-400/30 bg-emerald-400/10 text-emerald-200';
    }

    if (status === 'active') {
        return 'border-cyan-400/30 bg-cyan-400/10 text-cyan-200';
    }

    return 'border-white/10 bg-white/5 text-slate-300';
}

export function AdminWorkflowGuide({
    departmentsCount,
    latestMovementsCount,
    pendingPurchasesCount,
    lowInventoryCount,
    canManageUsers,
}: {
    departmentsCount: number;
    latestMovementsCount: number;
    pendingPurchasesCount: number;
    lowInventoryCount: number;
    canManageUsers: boolean;
}) {
    const steps: WorkflowStep[] = [
        {
            title: 'Construye la base operativa',
            description: 'Configura departamentos y estructura el trabajo del cliente antes de mover dinero o inventario.',
            href: '/departments',
            cta: departmentsCount > 0 ? 'Ver departamentos' : 'Crear departamentos',
            icon: Users,
            accent: 'from-cyan-500/20 to-sky-500/5',
            status: departmentsCount > 0 ? 'completed' : 'active',
            helper: departmentsCount > 0 ? `${departmentsCount} departamentos disponibles` : 'Aun no hay departamentos creados',
        },
        {
            title: 'Activa el flujo financiero',
            description: 'Registra ingresos y gastos para empezar a construir el historial operativo del cliente.',
            href: '/financial-movements',
            cta: latestMovementsCount > 0 ? 'Ver movimientos' : 'Registrar movimiento',
            icon: WalletCards,
            accent: 'from-emerald-500/20 to-cyan-500/5',
            status: latestMovementsCount > 0 ? 'completed' : departmentsCount > 0 ? 'active' : 'pending',
            helper: latestMovementsCount > 0 ? `${latestMovementsCount} movimientos recientes detectados` : 'Todavia no hay movimientos en el panel',
        },
        {
            title: 'Controla compras e inventario',
            description: 'Supervisa solicitudes, existencias y alertas antes de que el flujo operativo se atrase.',
            href: '/purchases',
            cta: 'Ir a compras',
            icon: Package,
            accent: 'from-amber-500/20 to-orange-500/5',
            status: pendingPurchasesCount > 0 || lowInventoryCount > 0 ? 'active' : latestMovementsCount > 0 ? 'completed' : 'pending',
            helper:
                pendingPurchasesCount > 0 || lowInventoryCount > 0
                    ? `${pendingPurchasesCount} compras pendientes y ${lowInventoryCount} alertas de inventario`
                    : 'Sin alertas activas en compras o inventario',
        },
        {
            title: 'Cierra con control y visibilidad',
            description: 'Revisa reportes y asegura que cada usuario del cliente tenga el acceso correcto para operar.',
            href: canManageUsers ? '/users' : '/reports',
            cta: canManageUsers ? 'Gestionar usuarios' : 'Ver reportes',
            icon: BarChart3,
            accent: 'from-fuchsia-500/15 to-cyan-500/5',
            status: canManageUsers && departmentsCount > 0 ? 'active' : 'pending',
            helper: canManageUsers ? 'Permisos y operacion listos para administrar' : 'Consulta reportes cuando el flujo este activo',
        },
    ];

    return (
        <Card className="overflow-hidden border-white/10 bg-[#0d1d28]/90 shadow-[0_24px_60px_rgba(2,8,23,0.35)]">
            <CardHeader className="relative border-b border-white/10 pb-5">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/70 to-transparent" />
                <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <CardTitle className="text-xl text-white">Flujo guiado para admin</CardTitle>
                        <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-300/80">
                            Recorrido sugerido para activar la operacion del cliente de forma ordenada: estructura, movimientos, control y seguimiento.
                        </p>
                    </div>
                    <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs uppercase tracking-[0.24em] text-cyan-200">
                        <motion.span
                            className="h-2 w-2 rounded-full bg-cyan-300"
                            animate={{ opacity: [0.35, 1, 0.35], scale: [0.9, 1.15, 0.9] }}
                            transition={{ duration: 1.8, repeat: Number.POSITIVE_INFINITY }}
                        />
                        Admin Journey
                    </div>
                </div>
            </CardHeader>

            <CardContent className="grid gap-4 p-6 xl:grid-cols-4">
                {steps.map((step, index) => (
                    <motion.div
                        key={step.title}
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.45, delay: 0.08 * index }}
                        className={`relative rounded-3xl border border-white/10 bg-gradient-to-br ${step.accent} p-[1px]`}
                    >
                        <div className="flex h-full flex-col rounded-[calc(1.5rem-1px)] bg-[#0b1822]/95 p-5">
                            <div className="mb-5 flex items-start justify-between gap-3">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-cyan-200">
                                    <step.icon className="h-5 w-5" />
                                </div>
                                <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs ${statusClasses(step.status)}`}>
                                    {step.status === 'completed' ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Clock3 className="h-3.5 w-3.5" />}
                                    {statusLabel(step.status)}
                                </div>
                            </div>

                            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-slate-500">
                                Paso {index + 1}
                                {index < steps.length - 1 && <span className="hidden h-px flex-1 bg-white/10 xl:block" />}
                            </div>

                            <h3 className="mt-4 text-lg font-semibold text-white">{step.title}</h3>
                            <p className="mt-3 text-sm leading-7 text-slate-300/78">{step.description}</p>
                            <p className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-300/80">{step.helper}</p>

                            <div className="mt-5 flex items-center justify-between gap-3 pt-1">
                                <Button asChild variant="outline" className="border-white/10 bg-white/[0.04] hover:bg-white/10">
                                    <Link href={step.href}>{step.cta}</Link>
                                </Button>
                                <ArrowRight className="h-4 w-4 text-cyan-200" />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </CardContent>
        </Card>
    );
}
