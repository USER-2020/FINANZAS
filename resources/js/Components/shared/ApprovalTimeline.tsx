import { StatusBadge } from './StatusBadge';

export function ApprovalTimeline({ items }: { items: { label: string; status: string; date?: string }[] }) {
    return (
        <ol className="space-y-4">
            {items.map((item) => (
                <li key={item.label} className="flex items-start gap-3">
                    <div className="mt-1 h-2 w-2 rounded-full bg-[#D4AF37]" />
                    <div className="flex-1">
                        <div className="flex items-center justify-between gap-3">
                            <p className="text-sm font-medium">{item.label}</p>
                            <StatusBadge status={item.status} />
                        </div>
                        {item.date && <p className="text-xs text-muted-foreground">{item.date}</p>}
                    </div>
                </li>
            ))}
        </ol>
    );
}
