import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { MoneyDisplay } from '@/Components/shared/MoneyDisplay';

export function FinancialCard({ title, amount, detail }: { title: string; amount: number; detail?: string }) {
    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <MoneyDisplay value={amount} className="text-2xl font-semibold" />
                {detail && <p className="mt-2 text-xs text-muted-foreground">{detail}</p>}
            </CardContent>
        </Card>
    );
}
