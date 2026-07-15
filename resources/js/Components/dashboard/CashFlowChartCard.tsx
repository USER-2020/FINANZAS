import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { MoneyDisplay } from '@/Components/shared/MoneyDisplay';

export function CashFlowChartCard({ data }: { data: { month: string; ingresos: number; gastos: number }[] }) {
    return (
        <Card>
            <CardHeader><CardTitle>Ingresos vs gastos</CardTitle></CardHeader>
            <CardContent className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <XAxis dataKey="month" stroke="#B7B7B7" />
                        <YAxis stroke="#B7B7B7" tickFormatter={(value) => `$${Number(value) / 1000000}M`} />
                        <Tooltip formatter={(value) => <MoneyDisplay value={Number(value)} />} />
                        <Line dataKey="ingresos" stroke="#D4AF37" strokeWidth={3} dot={false} />
                        <Line dataKey="gastos" stroke="#C1002B" strokeWidth={3} dot={false} />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
