import { useRef, useState, FormEventHandler } from 'react';
import InputError from '@/Components/InputError';
import { Button } from '@/Components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/Components/ui/dialog';
import { Input } from '@/Components/ui/input';
import { useForm } from '@inertiajs/react';

export default function DeleteUserForm({ className = '' }: { className?: string }) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const contraseñaInput = useRef<HTMLInputElement>(null);

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
    } = useForm({
        password: '',
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser: FormEventHandler = (e) => {
        e.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => contraseñaInput.current?.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);

        reset();
    };

    return (
        <section className={`space-y-6 ${className}`}>
            <header>
                <h2 className="text-lg font-medium text-white">Eliminar cuenta</h2>

                <p className="mt-1 text-sm text-muted-foreground">
                    Esta acción elimina permanentemente tu cuenta y no se puede deshacer.
                </p>
            </header>

            <Button variant="destructive" onClick={confirmUserDeletion}>Eliminar cuenta</Button>

            <Dialog open={confirmingUserDeletion} onOpenChange={(open) => (open ? setConfirmingUserDeletion(true) : closeModal())}>
                <DialogContent>
                    <form onSubmit={deleteUser} className="space-y-5">
                        <DialogHeader>
                            <DialogTitle>Confirmar eliminacion</DialogTitle>
                            <DialogDescription>
                                Ingresa tu contraseña para eliminar la cuenta permanentemente.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-2">
                            <label htmlFor="password" className="text-sm font-medium text-white">Contraseña</label>
                            <Input
                            id="password"
                            type="password"
                            name="password"
                            ref={contraseñaInput}
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            autoFocus
                            placeholder="Contraseña"
                            />

                            <InputError message={errors.password} />
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={closeModal}>Cancelar</Button>
                            <Button type="submit" variant="destructive" disabled={processing}>
                                Eliminar cuenta
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </section>
    );
}
