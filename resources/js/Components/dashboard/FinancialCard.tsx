import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { MoneyDisplay } from '@/Components/shared/MoneyDisplay';
import { ArrowDownRight, ArrowUpRight, CircleDollarSign } from 'lucide-react';
import { motion } from 'framer-motion';

export function FinancialCard({ title, amount, detail }: { title: string; amount: number; detail?: string }) {
    const isExpense = title.toLowerCase().includes('gasto') || title.toLowerCase().includes('pendiente');
    const isPositive = title.toLowerCase().includes('ingreso') || title.toLowerCase().includes('neto');
    const Icon = isPositive ? ArrowUpRight : isExpense ? ArrowDownRight : CircleDollarSign;

    return (
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} whileHover={{ y: -3 }} transition={{ duration: 0.25 }}>
        <Card className="relative overflow-hidden">
            <div className="pointer-events-none absolute -right-8 -top-10 h-28 w-28 rounded-full bg-emerald-400/10 blur-2xl" />
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between gap-3">
                    <CardTitle className="text-sm text-muted-foreground">{title}</CardTitle>
                    <span className="rounded-xl border border-white/[0.08] bg-white/[0.04] p-2 text-emerald-300"><Icon className="h-4 w-4" /></span>
                </div>
            </CardHeader>
            <CardContent>
                <MoneyDisplay value={amount} className="text-2xl font-semibold sm:text-3xl" />
                {detail && <p className="mt-2 text-xs text-muted-foreground">{detail}</p>}
            </CardContent>
        </Card>
        </motion.div>
    );
}
