import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { BudgetProgress } from './BudgetProgress';

export function DepartmentCard({ name, spent, budget }: { name: string; spent: number; budget: number }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{name}</CardTitle>
            </CardHeader>
            <CardContent>
                <BudgetProgress label="Presupuesto usado" spent={spent} budget={budget} />
            </CardContent>
        </Card>
    );
}
