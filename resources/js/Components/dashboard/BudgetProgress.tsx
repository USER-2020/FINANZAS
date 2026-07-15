import { Progress } from '@/Components/ui/progress';
import { MoneyDisplay } from '@/Components/shared/MoneyDisplay';

export function BudgetProgress({ label, spent, budget }: { label: string; spent: number; budget: number }) {
    const percentage = budget > 0 ? Math.min(Math.round((spent / budget) * 100), 100) : 0;

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{label}</span>
                <span>{percentage}%</span>
            </div>
            <Progress value={percentage} />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
                <MoneyDisplay value={spent} />
                <MoneyDisplay value={budget} />
            </div>
        </div>
    );
}
