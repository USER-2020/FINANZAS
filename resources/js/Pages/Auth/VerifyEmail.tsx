import { FormEventHandler } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { MailCheck, Sparkles } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';

export default function VerifyEmail({ status }: { status?: string }) {
    const { post, processing } = useForm({});

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('verification.send'));
    };

    return (
        <main className="min-h-screen bg-[#07131b] text-white">
            <Head title="Verificar email" />

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
                                <MailCheck className="h-5 w-5 text-cyan-200" />
                            </div>
                            <div>
                                <CardTitle className="text-2xl">Verifica tu email</CardTitle>
                                <CardDescription>Antes de continuar, revisa tu correo y abre el enlace de verificación.</CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {status === 'verification-link-sent' && (
                                <div className="mb-4 rounded-md border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 text-sm text-emerald-200">
                                    Enviamos un nuevo enlace de verificación a tu correo.
                                </div>
                            )}

                            <form onSubmit={submit} className="space-y-4">
                                <Button type="submit" className="w-full" disabled={processing}>
                                    {processing ? 'Enviando...' : 'Reenviar email de verificación'}
                                </Button>

                                <Button type="button" variant="ghost" className="w-full text-muted-foreground hover:text-white" asChild>
                                    <Link href={route('logout')} method="post" as="button">
                                        Cerrar sesión
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
