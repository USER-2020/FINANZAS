import { ReactNode } from 'react';
import { Button } from '@/Components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/Components/ui/dialog';

export function ConfirmDialog({ trigger, title, description, onConfirm }: { trigger: ReactNode; title: string; description?: string; onConfirm: () => void }) {
    return (
        <Dialog>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    {description && <DialogDescription>{description}</DialogDescription>}
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline">Cancelar</Button>
                    <Button onClick={onConfirm}>Confirmar</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
