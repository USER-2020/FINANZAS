import { Badge } from '@/Components/ui/badge';
import { cn } from '@/lib/utils';

const statusStyles: Record<string, string> = {
    planeado: 'border-white/10 bg-white/10 text-zinc-300',
    'por hacerse': 'border-[#FF8A2A]/30 bg-[#FF8A2A]/15 text-[#FFB36F]',
    cotizado: 'border-[#FFD000]/30 bg-[#FFD000]/15 text-[#FFE166]',
    aprobado: 'border-[#D4AF37]/30 bg-[#D4AF37]/15 text-[#F1D978]',
    adquirido: 'border-emerald-400/30 bg-emerald-400/15 text-emerald-200',
    instalado: 'border-blue-400/30 bg-blue-400/15 text-blue-200',
    'en mantenimiento': 'border-purple-400/30 bg-purple-400/15 text-purple-200',
    cancelado: 'border-zinc-700 bg-zinc-900 text-zinc-400',
    rechazado: 'border-[#C1002B]/30 bg-[#C1002B]/15 text-red-200',
    pagado: 'border-emerald-400/30 bg-emerald-400/15 text-emerald-200',
    pendiente: 'border-[#FFD000]/30 bg-[#FFD000]/15 text-[#FFE166]',
    activo: 'border-emerald-400/30 bg-emerald-400/15 text-emerald-200',
    pausado: 'border-[#FF8A2A]/30 bg-[#FF8A2A]/15 text-[#FFB36F]',
    cerrado: 'border-zinc-700 bg-zinc-900 text-zinc-400',
    disponible: 'border-emerald-400/30 bg-emerald-400/15 text-emerald-200',
    'inventario bajo': 'border-[#FFD000]/30 bg-[#FFD000]/15 text-[#FFE166]',
    agotado: 'border-[#C1002B]/30 bg-[#C1002B]/15 text-red-200',
};

export function StatusBadge({ status, className }: { status: string; className?: string }) {
    return (
        <Badge variant="outline" className={cn(statusStyles[status.toLowerCase()] ?? statusStyles.planeado, className)}>
            {status}
        </Badge>
    );
}
