import { Inbox } from 'lucide-react';
import { cn } from '@/lib/utils';

export function EmptyState({ title, description, className }: { title: string; description?: string; className?: string }) {
    return (
        <div className={cn('flex flex-col items-center justify-center rounded-lg border border-dashed border-white/10 p-10 text-center', className)}>
            <Inbox className="mb-3 h-10 w-10 text-muted-foreground" />
            <h3 className="text-sm font-semibold">{title}</h3>
            {description && <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>}
        </div>
    );
}
