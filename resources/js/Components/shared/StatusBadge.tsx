import { Badge } from '@/Components/ui/badge';
import { cn } from '@/lib/utils';

const statusStyles: Record<string, string> = {
    planeado: 'border-white/10 bg-white/10 text-zinc-300',
    'por hacerse': 'border-amber-300/30 bg-amber-300/10 text-amber-200',
    cotizado: 'border-cyan-300/30 bg-cyan-300/10 text-cyan-200',
    aprobado: 'border-sky-300/30 bg-sky-300/10 text-sky-200',
    adquirido: 'border-emerald-300/30 bg-emerald-300/10 text-emerald-200',
    instalado: 'border-blue-300/30 bg-blue-300/10 text-blue-200',
    'en mantenimiento': 'border-violet-300/30 bg-violet-300/10 text-violet-200',
    cancelado: 'border-zinc-700 bg-zinc-900 text-zinc-400',
    rechazado: 'border-rose-300/30 bg-rose-300/10 text-rose-200',
    pagado: 'border-emerald-300/30 bg-emerald-300/10 text-emerald-200',
    pendiente: 'border-amber-300/30 bg-amber-300/10 text-amber-200',
    activo: 'border-emerald-300/30 bg-emerald-300/10 text-emerald-200',
    pausado: 'border-amber-300/30 bg-amber-300/10 text-amber-200',
    cerrado: 'border-zinc-700 bg-zinc-900 text-zinc-400',
    disponible: 'border-emerald-300/30 bg-emerald-300/10 text-emerald-200',
    'inventario bajo': 'border-amber-300/30 bg-amber-300/10 text-amber-200',
    agotado: 'border-rose-300/30 bg-rose-300/10 text-rose-200',
};

export function StatusBadge({ status, className }: { status: string; className?: string }) {
    return (
        <Badge variant="outline" className={cn(statusStyles[status.toLowerCase()] ?? statusStyles.planeado, className)}>
            {status}
        </Badge>
    );
}
