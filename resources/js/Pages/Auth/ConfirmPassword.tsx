import { useEffect, FormEventHandler } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { LockKeyhole, ShieldCheck, Sparkles } from 'lucide-react';
import InputError from '@/Components/InputError';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Input } from '@/Components/ui/input';

export default function ConfirmPassword() {
    const { data, setData, post, processing, errors, reset } = useForm({
        password: '',
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('password.confirm'));
    };

    return (
        <main className="min-h-screen bg-[#07131b] text-white">
            <Head title="Confirmar contraseña" />

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
                                <CardTitle className="text-2xl">Confirmar contraseña</CardTitle>
                                <CardDescription>Esta zona es segura. Confirma tu contraseña para continuar.</CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={submit} className="space-y-5">
                                <div className="space-y-2">
                                    <label htmlFor="password" className="text-sm font-medium text-white">Contraseña</label>
                                    <div className="relative">
                                        <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input id="password" type="password" name="password" value={data.password} className="pl-10" autoFocus onChange={(e) => setData('password', e.target.value)} />
                                    </div>
                                    <InputError message={errors.password} />
                                </div>

                                <Button type="submit" className="w-full" disabled={processing}>
                                    {processing ? 'Confirmando...' : 'Confirmar'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </section>
        </main>
    );
}
