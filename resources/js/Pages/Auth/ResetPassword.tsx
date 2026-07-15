import { useEffect, FormEventHandler } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { LockKeyhole, Mail, ShieldCheck, Sparkles } from 'lucide-react';
import InputError from '@/Components/InputError';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Input } from '@/Components/ui/input';

export default function ResetPassword({ token, email }: { token: string; email: string }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token,
        email,
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('password.store'));
    };

    return (
        <main className="min-h-screen bg-[#07131b] text-white">
            <Head title="Restablecer contraseña" />

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
                                <CardTitle className="text-2xl">Crear nueva contraseña</CardTitle>
                                <CardDescription>Define una clave nueva para volver a entrar al sistema.</CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={submit} className="space-y-5">
                                <div className="space-y-2">
                                    <label htmlFor="email" className="text-sm font-medium text-white">Email</label>
                                    <div className="relative">
                                        <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input id="email" type="email" name="email" value={data.email} className="pl-10" autoComplete="username" onChange={(e) => setData('email', e.target.value)} />
                                    </div>
                                    <InputError message={errors.email} />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="password" className="text-sm font-medium text-white">Nueva contraseña</label>
                                    <div className="relative">
                                        <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input id="password" type="password" name="password" value={data.password} className="pl-10" autoComplete="new-password" autoFocus onChange={(e) => setData('password', e.target.value)} />
                                    </div>
                                    <InputError message={errors.password} />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="password_confirmation" className="text-sm font-medium text-white">Confirmar contraseña</label>
                                    <div className="relative">
                                        <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input id="password_confirmation" type="password" name="password_confirmation" value={data.password_confirmation} className="pl-10" autoComplete="new-password" onChange={(e) => setData('password_confirmation', e.target.value)} />
                                    </div>
                                    <InputError message={errors.password_confirmation} />
                                </div>

                                <Button type="submit" className="w-full" disabled={processing}>
                                    {processing ? 'Guardando...' : 'Restablecer contraseña'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </section>
        </main>
    );
}
