import { formatCOP } from '@/lib/format';
import { cn } from '@/lib/utils';

export function MoneyDisplay({ value, className }: { value: number | string; className?: string }) {
    return <span className={cn('tabular-nums tracking-tight text-white', className)}>{formatCOP(value)}</span>;
}
