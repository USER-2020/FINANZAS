import { useMemo, useState } from 'react';
import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Banknote, Calculator, CircleMinus, CirclePlus, RotateCcw, Sparkles, WalletCards } from 'lucide-react';
import { AppLayout } from '@/Components/layout/AppLayout';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Input } from '@/Components/ui/input';
import { PageHeader } from '@/Components/shared/PageHeader';
import { PageProps } from '@/types';

const denominations = [100000, 50000, 20000, 10000, 5000, 2000, 1000];

function formatCop(value: number): string {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(value);
}

export default function CashCounter({ auth }: PageProps) {
    const [counts, setCounts] = useState<Record<number, number>>(() => Object.fromEntries(denominations.map((value) => [value, 0])));

    const total = useMemo(() => denominations.reduce((sum, denomination) => sum + denomination * (counts[denomination] ?? 0), 0), [counts]);
    const billCount = useMemo(() => denominations.reduce((sum, denomination) => sum + (counts[denomination] ?? 0), 0), [counts]);

    function updateCount(denomination: number, value: string) {
        const parsed = Math.max(0, Math.floor(Number(value) || 0));
        setCounts((current) => ({ ...current, [denomination]: parsed }));
    }

    function adjustCount(denomination: number, amount: number) {
        updateCount(denomination, String((counts[denomination] ?? 0) + amount));
    }

    function reset() {
        setCounts(Object.fromEntries(denominations.map((value) => [value, 0])));
    }

    return (
        <AppLayout user={auth.user}>
            <Head title="Contar efectivo" />
            <PageHeader
                eyebrow="Herramienta financiera"
                title="Contar efectivo"
                description="Cuenta tus billetes y conoce el total disponible en segundos."
            />

            <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_21rem]" data-tour="page:cash-counter">
                <Card className="overflow-hidden border-white/10 bg-slate-950/35">
                    <CardHeader className="border-b border-white/[0.07] bg-white/[0.02] pb-5">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <CardTitle className="flex items-center gap-2 text-white"><Banknote className="h-5 w-5 text-emerald-300" /> Denominaciones</CardTitle>
                                <p className="mt-2 text-sm text-muted-foreground">Indica cuántos billetes tienes de cada valor.</p>
                            </div>
                            <span className="hidden rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-xs font-medium text-emerald-200 sm:inline-flex">COP · Efectivo</span>
                        </div>
                    </CardHeader>
                    <CardContent className="grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-4">
                        {denominations.map((denomination, index) => (
                            <motion.label key={denomination} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.04 }} className={'group rounded-2xl border p-4 transition ' + (counts[denomination] > 0 ? 'border-emerald-300/35 bg-emerald-300/[0.08] shadow-[0_12px_30px_rgba(16,185,129,0.08)]' : 'border-white/10 bg-white/[0.03] hover:border-emerald-300/30 hover:bg-emerald-300/[0.05]')}>
                                <span className="flex items-center justify-between text-sm"><span className="font-semibold text-white">{formatCop(denomination)}</span><span className="text-xs text-muted-foreground">billetes</span></span>
                                <div className="mt-3 grid grid-cols-[2.75rem_minmax(0,1fr)_2.75rem] items-center gap-3">
                                    <Button type="button" variant="outline" size="icon" disabled={!counts[denomination]} className="h-11 w-11 rounded-xl border-white/10 bg-slate-950/40 text-muted-foreground hover:border-rose-300/40 hover:bg-rose-300/10 hover:text-rose-200 disabled:cursor-not-allowed disabled:opacity-35" onClick={() => adjustCount(denomination, -1)} aria-label={'Reducir billetes de ' + formatCop(denomination)}><CircleMinus className="h-5 w-5" /></Button>
                                    <Input className="h-11 min-w-0 rounded-xl border-white/10 bg-white/[0.06] text-center text-lg font-semibold shadow-inner focus:border-emerald-300/50" type="number" min="0" step="1" inputMode="numeric" value={counts[denomination] || ''} onChange={(event) => updateCount(denomination, event.target.value)} placeholder="0" aria-label={'Cantidad de billetes de ' + formatCop(denomination)} />
                                    <Button type="button" variant="outline" size="icon" className="h-11 w-11 rounded-xl border-emerald-300/25 bg-emerald-300/[0.06] text-emerald-300 hover:bg-emerald-300/15 hover:text-emerald-200" onClick={() => adjustCount(denomination, 1)} aria-label={'Añadir billete de ' + formatCop(denomination)}><CirclePlus className="h-5 w-5" /></Button>
                                </div>
                                <span className="mt-2 block text-right text-xs text-emerald-200/70">{formatCop(denomination * (counts[denomination] ?? 0))}</span>
                            </motion.label>
                        ))}
                    </CardContent>
                </Card>

                <Card className="h-fit overflow-hidden border-emerald-300/20 bg-gradient-to-br from-emerald-300/[0.1] via-slate-950/70 to-cyan-300/[0.06] shadow-[0_20px_60px_rgba(16,185,129,0.12)] xl:sticky xl:top-24">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-white"><Calculator className="h-5 w-5 text-cyan-300" /> Resumen del conteo</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">Total de efectivo</p>
                        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-200/70">Total de efectivo</p>
                            <motion.p key={total} initial={{ opacity: 0.5, y: 4 }} animate={{ opacity: 1, y: 0 }} className="mt-2 text-4xl font-bold tracking-tight text-white">{formatCop(total)}</motion.p>
                            <p className="mt-2 text-xs text-muted-foreground">Calculado en tiempo real</p>
                        </div>
                        <div className="mt-4 grid grid-cols-2 gap-3">
                            <div className="rounded-2xl border border-white/10 bg-black/10 p-3"><p className="text-xs text-muted-foreground">Billetes</p><p className="mt-1 text-xl font-semibold text-white">{billCount}</p></div>
                            <div className="rounded-2xl border border-white/10 bg-black/10 p-3"><p className="text-xs text-muted-foreground">Denominaciones</p><p className="mt-1 text-xl font-semibold text-white">{denominations.filter((value) => counts[value] > 0).length}</p></div>
                        </div>
                        <div className="mt-4 flex items-start gap-2 rounded-xl border border-cyan-300/15 bg-cyan-300/[0.06] p-3 text-sm leading-5 text-cyan-100"><Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" /> Úsalo para arqueos de caja o para actualizar tu saldo manualmente.</div>
                        <div className="mt-4 flex items-center justify-between border-t border-white/[0.07] pt-4 text-xs text-muted-foreground"><span>Moneda</span><span className="font-medium text-white">Peso colombiano · COP</span></div>
                    </CardContent>
                </Card>
            </div>
            <div className="mt-6 flex justify-center">
                <Button type="button" variant="outline" onClick={reset} className="min-w-36 justify-center border-white/10 bg-white/[0.03] hover:border-rose-300/30 hover:bg-rose-300/[0.08] hover:text-rose-100">
                    <RotateCcw className="h-4 w-4" /> Limpiar conteo
                </Button>
            </div>
        </AppLayout>
    );
}
