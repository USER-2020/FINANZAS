import { FormEventHandler } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Mail, ShieldCheck, Sparkles } from 'lucide-react';
import InputError from '@/Components/InputError';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Input } from '@/Components/ui/input';

export default function ForgotPassword({ status }: { status?: string }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <main className="min-h-screen bg-[#07131b] text-white">
            <Head title="Recuperar contraseña" />

            <section className="flex min-h-screen items-center justify-center px-4 py-8">
                <div className="w-full max-w-md">
                    <div className="mb-8 flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-md border border-cyan-200/20 bg-cyan-500/20">
                            <Sparkles className="h-5 w-5 text-cyan-200" />
                        </div>
                        <div>
                            <div className="text-lg font-semibold">Finanzas OS</div>
                            <div className="text-xs text-muted-foreground">Multi-tenant financial control</div>
                        </div>
                    </div>

                    <Card className="rounded-lg border-white/10 bg-[#10212d]/90">
                        <CardHeader className="space-y-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-md border border-cyan-200/20 bg-cyan-500/15">
                                <ShieldCheck className="h-5 w-5 text-cyan-200" />
                            </div>
                            <div>
                                <CardTitle className="text-2xl">Recuperar contraseña</CardTitle>
                                <CardDescription>Escribe tu email y te enviaremos un enlace para crear una nueva clave.</CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {status && (
                                <div className="mb-4 rounded-md border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 text-sm text-emerald-200">
                                    Te enviamos el enlace de recuperación si el correo existe en el sistema.
                                </div>
                            )}

                            <form onSubmit={submit} className="space-y-5">
                                <div className="space-y-2">
                                    <label htmlFor="email" className="text-sm font-medium text-white">
                                        Email
                                    </label>
                                    <div className="relative">
                                        <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            id="email"
                                            type="email"
                                            name="email"
                                            value={data.email}
                                            className="pl-10"
                                            autoComplete="username"
                                            autoFocus
                                            placeholder="admin@finanzas.test"
                                            onChange={(e) => setData('email', e.target.value)}
                                        />
                                    </div>
                                    <InputError message={errors.email} />
                                </div>

                                <Button type="submit" className="w-full" disabled={processing}>
                                    {processing ? 'Enviando...' : 'Enviar enlace de recuperación'}
                                </Button>

                                <Button type="button" variant="ghost" className="w-full text-muted-foreground hover:text-white" asChild>
                                    <Link href={route('login')}>
                                        <ArrowLeft className="h-4 w-4" />
                                        Volver al login
                                    </Link>
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </section>
        </main>
    );
}
