import { ReactNode } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/Components/ui/sheet';

export function FilterSheet({ children }: { children: ReactNode }) {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline">
                    <SlidersHorizontal className="h-4 w-4" />
                    Filtros
                </Button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Filtros</SheetTitle>
                </SheetHeader>
                <div className="mt-6">{children}</div>
            </SheetContent>
        </Sheet>
    );
}
