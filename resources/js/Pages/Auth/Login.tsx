import { useEffect, useState, type FormEventHandler } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Building2, LockKeyhole, Mail, ShieldCheck, TrendingUp, Users, WalletCards } from 'lucide-react';
import { FiEye, FiEyeOff } from 'react-icons/fi';

import InputError from '@/Components/InputError';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Checkbox } from '@/Components/ui/checkbox';
import { Input } from '@/Components/ui/input';

type LoginMetrics = {
    clients: number;
    users: number;
    departments: number;
    movements: number;
    monthlyIncome: number;
    monthlyExpenses: number;
    monthlyNetFlow: number;
};

type LoginProps = {
    status?: string;
    canResetPassword: boolean;
    loginMetrics: LoginMetrics;
};

const currencyFormatter = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
});

const numberFormatter = new Intl.NumberFormat('es-CO');
const desktopShowcaseVideoUrl = (import.meta.env.VITE_LOGIN_SHOWCASE_VIDEO_URL_DESKTOP as string | undefined)?.trim()
    || (import.meta.env.VITE_LOGIN_SHOWCASE_VIDEO_URL as string | undefined)?.trim()
    || (import.meta.env.VITE_ADMIN_ONBOARDING_VIDEO_URL as string | undefined)?.trim()
    || '';
const mobileShowcaseVideoUrl = (import.meta.env.VITE_LOGIN_SHOWCASE_VIDEO_URL_MOBILE as string | undefined)?.trim()
    || (import.meta.env.VITE_LOGIN_SHOWCASE_VIDEO_URL as string | undefined)?.trim()
    || (import.meta.env.VITE_ADMIN_ONBOARDING_VIDEO_URL as string | undefined)?.trim()
    || '';

function AnimatedValue({
    value,
    format = (current: number) => numberFormatter.format(Math.round(current)),
    duration = 900,
}: {
    value: number;
    format?: (value: number) => string;
    duration?: number;
}) {
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        let frame = 0;
        let start: number | null = null;
        const origin = displayValue;
        const delta = value - origin;

        const tick = (timestamp: number) => {
            if (start === null) {
                start = timestamp;
            }

            const progress = Math.min((timestamp - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplayValue(origin + delta * eased);

            if (progress < 1) {
                frame = window.requestAnimationFrame(tick);
            }
        };

        frame = window.requestAnimationFrame(tick);

        return () => window.cancelAnimationFrame(frame);
    }, [displayValue, duration, value]);

    return <>{format(displayValue)}</>;
}

export default function Login({ status, canResetPassword, loginMetrics }: LoginProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, [reset]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    const highlights = [
        {
            label: 'Clientes activos',
            value: loginMetrics.clients,
            helper: 'tenants operando',
            icon: Building2,
        },
        {
            label: 'Usuarios activos',
            value: loginMetrics.users,
            helper: 'acceso habilitado',
            icon: Users,
        },
        {
            label: 'Departamentos',
            value: loginMetrics.departments,
            helper: 'estructuras creadas',
            icon: ShieldCheck,
        },
        {
            label: 'Movimientos',
            value: loginMetrics.movements,
            helper: 'registros globales',
            icon: WalletCards,
        },
    ];

    const monthlyCards = [
        {
            label: 'Ingresos del mes',
            value: loginMetrics.monthlyIncome,
            tone: 'text-emerald-300',
        },
        {
            label: 'Gastos del mes',
            value: loginMetrics.monthlyExpenses,
            tone: 'text-amber-300',
        },
        {
            label: 'Flujo neto global',
            value: loginMetrics.monthlyNetFlow,
            tone: loginMetrics.monthlyNetFlow >= 0 ? 'text-cyan-300' : 'text-rose-300',
        },
    ];

    const hasDesktopShowcaseVideo = desktopShowcaseVideoUrl.length > 0;
    const hasMobileShowcaseVideo = mobileShowcaseVideoUrl.length > 0;

    return (
        <main className="min-h-screen overflow-hidden bg-[#061119] text-white">
            <Head title="Iniciar sesion" />

            <div className="relative min-h-screen">
                {hasDesktopShowcaseVideo && (
                    <div className="pointer-events-none absolute inset-0 hidden overflow-hidden opacity-[0.86] lg:block">
                        <video
                            src={desktopShowcaseVideoUrl}
                            className="h-full w-full object-cover"
                            autoPlay
                            muted
                            loop
                            playsInline
                            preload="metadata"
                        />
                    </div>
                )}

                {hasMobileShowcaseVideo && (
                    <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-[0.88] lg:hidden">
                        <video
                            src={mobileShowcaseVideoUrl}
                            className="h-full w-full object-cover"
                            autoPlay
                            muted
                            loop
                            playsInline
                            preload="metadata"
                        />
                    </div>
                )}

                <div className="absolute inset-0 bg-[#02070d]/54" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(6,182,212,0.16),transparent_30%),radial-gradient(circle_at_85%_20%,rgba(16,185,129,0.12),transparent_24%),linear-gradient(135deg,rgba(7,19,27,0.68)_0%,rgba(8,25,35,0.76)_45%,rgba(4,16,24,0.86)_100%)]" />
                <div className="absolute inset-0 backdrop-blur-[4px]" />

                <div className="relative z-10 grid min-h-screen lg:grid-cols-[1.15fr_0.85fr]">
                    <section className="hidden border-b border-white/10 px-5 py-8 sm:px-8 lg:flex lg:flex-col lg:justify-between lg:border-b-0 lg:border-r lg:border-white/8 lg:px-10 lg:py-10 xl:px-12">
                        <motion.div
                            initial={{ opacity: 0, y: -16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.55 }}
                            className="flex items-center gap-3"
                        >
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-400/15 shadow-[0_0_40px_rgba(34,211,238,0.18)]">
                                <TrendingUp className="h-5 w-5 text-cyan-200" />
                            </div>
                            <div>
                                <div className="text-lg font-semibold tracking-tight">Finanzas OS</div>
                                <div className="text-sm text-slate-300/75">Control multi-tenant financiero</div>
                            </div>
                        </motion.div>

                        <div className="py-10 lg:py-0">
                            <motion.p
                                initial={{ opacity: 0, y: 18 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.55, delay: 0.08 }}
                                className="text-xs uppercase tracking-[0.4em] text-cyan-300"
                            >
                                Operacion financiera conectada
                            </motion.p>

                            <motion.h1
                                initial={{ opacity: 0, y: 22 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.14 }}
                                className="mt-5 max-w-4xl text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl xl:text-6xl"
                            >
                                Convierte cada acceso en una vista clara del negocio, con el producto vivo detras de la experiencia.
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, y: 22 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="mt-6 max-w-2xl text-base leading-8 text-slate-300/80 sm:text-lg"
                            >
                                El login ahora presenta la plataforma con video inmersivo de fondo y metricas globales reales
                                para reforzar confianza, contexto operativo y valor desde el primer segundo.
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, y: 24 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.26 }}
                                className="mt-10 grid gap-6 sm:grid-cols-2 xl:gap-7"
                            >
                                {highlights.map((item, index) => (
                                    <motion.div
                                        key={item.label}
                                        initial={{ opacity: 0, y: 18 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.45, delay: 0.32 + index * 0.08 }}
                                        className="group flex min-h-[208px] flex-col rounded-3xl border border-white/10 bg-white/[0.045] p-7 backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:border-cyan-300/25 hover:bg-white/[0.065] xl:p-8"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="rounded-2xl border border-cyan-300/15 bg-cyan-400/10 p-3 text-cyan-200">
                                                <item.icon className="h-5 w-5" />
                                            </div>
                                            <span className="text-xs uppercase tracking-[0.25em] text-slate-400">Live</span>
                                        </div>
                                        <div className="mt-7 text-sm text-slate-300/80">{item.label}</div>
                                        <div className="mt-3 text-3xl font-semibold tracking-tight text-white">
                                            <AnimatedValue value={item.value} />
                                        </div>
                                        <div className="mt-auto pt-5 text-sm text-slate-400">{item.helper}</div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.55, delay: 0.38 }}
                            className="grid gap-6 md:grid-cols-3 xl:gap-7"
                        >
                            {monthlyCards.map((item, index) => (
                                <div
                                    key={item.label}
                                    className="rounded-3xl border border-white/10 bg-[#0d1d28]/78 px-7 py-6 shadow-[0_24px_60px_rgba(2,8,23,0.32)] backdrop-blur-md xl:px-8 xl:py-7 mt-8"
                                >
                                    <div className="text-sm text-slate-400">{item.label}</div>
                                    <div className={`mt-3 text-2xl font-semibold tracking-tight ${item.tone}`}>
                                        <AnimatedValue value={item.value} format={(value) => currencyFormatter.format(value)} duration={1100 + index * 120} />
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    </section>

                    <section className="flex min-h-screen items-center justify-center px-4 py-8 sm:px-6 lg:px-10">
                        <motion.div
                            initial={{ opacity: 0, x: 24 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.55, delay: 0.14 }}
                            className="w-full max-w-md lg:max-w-lg"
                        >
                            <div className="mb-6 flex items-center gap-3 lg:hidden">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-400/15 shadow-[0_0_40px_rgba(34,211,238,0.18)]">
                                    <TrendingUp className="h-5 w-5 text-cyan-200" />
                                </div>
                                <div>
                                    <div className="text-lg font-semibold tracking-tight">Finanzas OS</div>
                                    <div className="text-sm text-slate-300/75">Control multi-tenant financiero</div>
                                </div>
                            </div>

                            <Card className="overflow-hidden rounded-[2rem] border-white/10 bg-[#10212d]/84 shadow-[0_30px_90px_rgba(2,8,23,0.45)] backdrop-blur-xl">
                                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/60 to-transparent" />

                                <CardHeader className="space-y-5 px-7 pb-5 pt-7 sm:px-8 sm:pt-8">
                                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-400/10">
                                        <LockKeyhole className="h-6 w-6 text-cyan-200" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-3xl tracking-tight text-white">Iniciar sesion</CardTitle>
                                        <CardDescription className="mt-2 text-base text-slate-300/75">
                                            Accede al panel financiero y operativo con una interfaz mas inmersiva y enfocada.
                                        </CardDescription>
                                    </div>
                                </CardHeader>

                                <CardContent className="px-7 pb-7 sm:px-8 sm:pb-8">
                                    {status && (
                                        <div className="mb-5 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">
                                            {status}
                                        </div>
                                    )}

                                    <form onSubmit={submit} className="space-y-6">
                                        <div className="space-y-2">
                                            <label htmlFor="email" className="text-sm font-medium text-white">
                                                Email
                                            </label>
                                            <div className="relative">
                                                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    name="email"
                                                    value={data.email}
                                                    className="h-12 rounded-2xl border-white/10 bg-white/[0.04] pl-10 text-white placeholder:text-slate-500"
                                                    autoComplete="username"
                                                    autoFocus
                                                    placeholder="admin@finanzas.test"
                                                    onChange={(e) => setData('email', e.target.value)}
                                                />
                                            </div>
                                            <InputError message={errors.email} />
                                        </div>

                                        <div className="space-y-2">
                                            <label htmlFor="password" className="text-sm font-medium text-white">
                                                Contrasena
                                            </label>
                                            <div className="relative">
                                                <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                                <Input
                                                    id="password"
                                                    type={showPassword ? 'text' : 'password'}
                                                    name="password"
                                                    value={data.password}
                                                    className="h-12 rounded-2xl border-white/10 bg-white/[0.04] pl-10 pr-12 text-white placeholder:text-slate-500"
                                                    autoComplete="current-password"
                                                    placeholder="Ingresa tu contrasena"
                                                    onChange={(e) => setData('password', e.target.value)}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword((value) => !value)}
                                                    className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-slate-400 transition hover:bg-white/10 hover:text-cyan-200"
                                                    aria-label={showPassword ? 'Ocultar contrasena' : 'Mostrar contrasena'}
                                                >
                                                    {showPassword ? <FiEyeOff className="h-4 w-4" /> : <FiEye className="h-4 w-4" />}
                                                </button>
                                            </div>
                                            <InputError message={errors.password} />
                                        </div>

                                        <div className="flex items-center justify-between gap-4">
                                            <label className="flex items-center gap-2 text-sm text-slate-300/80">
                                                <Checkbox checked={data.remember} onCheckedChange={(checked) => setData('remember', checked === true)} />
                                                Recordarme
                                            </label>

                                            {canResetPassword && (
                                                <Link href={route('password.request')} className="text-sm text-cyan-300 transition hover:text-cyan-100">
                                                    Olvidaste tu contrasena?
                                                </Link>
                                            )}
                                        </div>

                                        <Button type="submit" className="h-12 w-full rounded-2xl text-base font-semibold" disabled={processing}>
                                            {processing ? 'Entrando...' : 'Entrar'}
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </section>
                </div>
            </div>
        </main>
    );
}
