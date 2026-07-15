import { formatCOP } from '@/lib/format';
import { cn } from '@/lib/utils';

export function MoneyDisplay({ value, className }: { value: number | string; className?: string }) {
    return <span className={cn('tabular-nums text-white', className)}>{formatCOP(value)}</span>;
}
