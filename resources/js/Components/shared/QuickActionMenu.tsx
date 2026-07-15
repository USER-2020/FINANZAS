import { MoreHorizontal } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/Components/ui/dropdown-menu';

export function QuickActionMenu() {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem>Ver detalle</DropdownMenuItem>
                <DropdownMenuItem>Aprobar</DropdownMenuItem>
                <DropdownMenuItem>Exportar</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
