import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { MoneyDisplay } from '@/Components/shared/MoneyDisplay';

export function SectorExpenseChartCard({ data }: { data: { name: string; value: number }[] }) {
    return (
        <Card>
            <CardHeader><CardTitle>Gastos por sector</CardTitle></CardHeader>
            <CardContent className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <XAxis dataKey="name" stroke="#B7B7B7" />
                        <YAxis stroke="#B7B7B7" tickFormatter={(value) => `$${Number(value) / 1000000}M`} />
                        <Tooltip formatter={(value) => <MoneyDisplay value={Number(value)} />} />
                        <Bar dataKey="value" fill="#8B0018" radius={[6, 6, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
