import { ReactNode } from 'react';
import { Card, CardContent } from '@/Components/ui/card';
import { cn } from '@/lib/utils';

export function StatCard({ label, value, hint, icon, className }: { label: string; value: ReactNode; hint?: string; icon?: ReactNode; className?: string }) {
    return (
        <Card className={cn('overflow-hidden', className)}>
            <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <p className="text-sm text-muted-foreground">{label}</p>
                        <div className="mt-2 text-2xl font-semibold text-white">{value}</div>
                        {hint && <p className="mt-2 text-xs text-muted-foreground">{hint}</p>}
                    </div>
                    {icon && <div className="rounded-md border border-white/10 bg-white/5 p-2 text-[#D4AF37]">{icon}</div>}
                </div>
            </CardContent>
        </Card>
    );
}
