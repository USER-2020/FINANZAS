import { Head } from '@inertiajs/react';
import { Shield, UserCircle } from 'lucide-react';
import { AppLayout } from '@/Components/layout/AppLayout';
import { PageHeader } from '@/Components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { PageProps } from '@/types';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({ auth, mustVerifyEmail, status }: PageProps<{ mustVerifyEmail: boolean; status?: string }>) {
    return (
        <AppLayout user={auth.user}>
            <Head title="Perfil" />

            <div className="mx-auto flex max-w-7xl flex-col gap-6">
                <PageHeader title="Perfil y ajustes" description="Administra tu información, seguridad y preferencias de cuenta." />

                <div className="grid gap-4 lg:grid-cols-[1fr_22rem]">
                    <div className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <UserCircle className="h-5 w-5 text-[#D4AF37]" />
                                    Información de perfil
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <UpdateProfileInformationForm mustVerifyEmail={mustVerifyEmail} status={status} />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Shield className="h-5 w-5 text-[#D4AF37]" />
                                    Seguridad
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <UpdatePasswordForm />
                            </CardContent>
                        </Card>
                    </div>

                    <Card className="h-fit">
                        <CardHeader>
                            <CardTitle>Zona sensible</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <DeleteUserForm />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
